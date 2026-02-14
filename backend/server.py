# server.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import speech_recognition as sr
import io
import uvicorn
import backend.sender as sender  
import backend.receiver as receiver 

app = FastAPI()

# Allow React to talk to Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ENDPOINT 1: CREATE SEAL (Voice -> QR) ---
@app.post("/create-seal")
async def create_seal(
    audio: UploadFile = File(...), 
    password: str = Form(...)
):
    # 1. Save uploaded audio temporarily
    temp_filename = "temp_upload.wav"
    with open(temp_filename, "wb") as buffer:
        buffer.write(await audio.read())

    # 2. Transcribe (Reuse your existing logic)
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(temp_filename) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
    except Exception:
        return JSONResponse({"error": "Could not transcribe audio"}, status_code=400)

    # 3. Encrypt
    key = sender.generate_key_from_password(password)
    cipher_suite = sender.Fernet(key)
    encrypted_text = cipher_suite.encrypt(text.encode()).decode()

    # 4. Generate Visuals (Reuse logic)
    # Note: You might need to tweak sender.py to return the image object instead of saving to disk
    spec_path = sender.create_spectrogram_background(temp_filename)
    
    # ... (Copy QR generation logic from sender.py here) ...
    # For brevity, let's assume we saved it to 'final_seal.png'
    
    with open("final_seal.png", "rb") as f:
        image_bytes = f.read()

    return Response(content=image_bytes, media_type="image/png")

# --- ENDPOINT 2: UNSEAL (QR Image -> Audio/Text) ---
@app.post("/unseal")
async def unseal(
    image: UploadFile = File(...), 
    password: str = Form(...)
):
    # 1. Read image from upload
    contents = await image.read()
    nparr = np.fromstring(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 2. Run your ADVANCED OpenCV Detection
    # (This is why we use Python backend: JS libraries fail on artistic QRs)
    detector = cv2.QRCodeDetector()
    data, bbox, _ = detector.detectAndDecode(img)
    
    # If standard fail, try your "Artistic" fallback logic
    if not data:
        img_padded = cv2.copyMakeBorder(img, 50, 50, 50, 50, cv2.BORDER_CONSTANT, value=[255, 255, 255])
        gray = cv2.cvtColor(img_padded, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
        final_search_img = cv2.bitwise_not(thresh)
        data, _, _ = detector.detectAndDecode(final_search_img)

    if not data:
        return JSONResponse({"error": "No QR code detected"}, status_code=400)

    # 3. Decrypt
    try:
        key = receiver.generate_key_from_password(password)
        cipher_suite = receiver.Fernet(key)
        decrypted_message = cipher_suite.decrypt(data.encode()).decode()
        return {"message": decrypted_message}
    except Exception:
        return JSONResponse({"error": "Incorrect password or corrupted data"}, status_code=403)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)