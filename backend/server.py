from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import cv2
import numpy as np
import speech_recognition as sr
import os
import qrcode
import base64
from datetime import datetime
from PIL import Image

# --- NEW: Audio Conversion Library ---
from pydub import AudioSegment 

# Security & Audio
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import librosa
import librosa.display
import matplotlib.pyplot as plt

# --- FFmpeg Configuration ---
# Pointing pydub directly to your WinGet FFmpeg installation
ffmpeg_path = r"C:\Users\RaviRaj\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffmpeg.exe"
ffprobe_path = r"C:\Users\RaviRaj\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin\ffprobe.exe"

AudioSegment.converter = ffmpeg_path
AudioSegment.ffprobe = ffprobe_path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- HELPER FUNCTIONS ---
def generate_key(password: str) -> bytes:
    salt = b'echoseal_fixed_salt'
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return base64.urlsafe_b64encode(kdf.derive(password.encode()))

def create_spectrogram(audio_path, output_path):
    y, sr_rate = librosa.load(audio_path, sr=44100)
    S = librosa.feature.melspectrogram(y=y, sr=sr_rate, n_mels=128, fmax=8000)
    S_dB = librosa.power_to_db(S, ref=np.max)

    plt.figure(figsize=(5, 5), frameon=False)
    plt.axis('off')
    librosa.display.specshow(S_dB, sr=sr_rate, fmax=8000, cmap='magma')
    plt.savefig(output_path, bbox_inches='tight', pad_inches=0, dpi=100)
    plt.close()

# --- ENDPOINT 1: CREATE SEAL ---
@app.post("/create-seal")
async def create_seal(audio: UploadFile = File(...), password: str = Form(...)):
    print(f"📥 Receiving Audio: {audio.filename}")
    
    # Files
    temp_raw = "temp_raw_upload" # Could be webm, ogg, etc.
    temp_clean_wav = "temp_clean.wav"
    temp_spec = "temp_spectrogram.png"
    final_seal = "final_generated_seal.png"
    
    try:
        # 1. Save Raw Upload
        with open(temp_raw, "wb") as buffer:
            buffer.write(await audio.read())

        # 2. CONVERT TO WAV
        try:
            print("... Converting audio to standard WAV ...")
            sound = AudioSegment.from_file(temp_raw)
            sound.export(temp_clean_wav, format="wav")
        except Exception as e:
            print(f"❌ FFmpeg Error: {e}")
            return JSONResponse({"error": "Audio conversion failed. Check FFmpeg paths."}, status_code=500)

        # 3. Transcribe
        recognizer = sr.Recognizer()
        with sr.AudioFile(temp_clean_wav) as source:
            audio_data = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio_data)
                print(f"📝 Transcribed: {text}")
            except sr.UnknownValueError:
                return JSONResponse({"error": "Audio was unclear (No speech detected)"}, status_code=400)
            except sr.RequestError:
                return JSONResponse({"error": "Speech API unavailable"}, status_code=503)

        # 4. Encrypt
        key = generate_key(password)
        cipher = Fernet(key)
        encrypted_text = cipher.encrypt(text.encode()).decode()
        
        # 5. Generate Visuals
        create_spectrogram(temp_clean_wav, temp_spec)
        
        qr = qrcode.QRCode(version=1, box_size=15, border=2)
        qr.add_data(encrypted_text)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="white", back_color="transparent").convert("RGBA")
        
        bg_img = Image.open(temp_spec).convert("RGBA")
        bg_img = bg_img.resize(qr_img.size, Image.Resampling.LANCZOS)
        final_img = Image.alpha_composite(bg_img, qr_img)
        
        final_img.save(final_seal)
        
        with open(final_seal, "rb") as f:
            image_bytes = f.read()
            
        return Response(content=image_bytes, media_type="image/png")

    except Exception as e:
        print(f"🔥 CRITICAL ERROR: {str(e)}")
        return JSONResponse({"error": str(e)}, status_code=500)
        
    finally:
        # Cleanup
        for f in [temp_raw, temp_clean_wav, temp_spec, final_seal]:
            if os.path.exists(f):
                os.remove(f)

# --- ENDPOINT 2: UNSEAL ---
@app.post("/unseal")
async def unseal(image: UploadFile = File(...), password: str = Form(...)):
    print(f"🔓 Decrypting Seal...")
    
    contents = await image.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    detector = cv2.QRCodeDetector()
    data, bbox, _ = detector.detectAndDecode(img)
    
    if not data:
        img_padded = cv2.copyMakeBorder(img, 50, 50, 50, 50, cv2.BORDER_CONSTANT, value=[255, 255, 255])
        gray = cv2.cvtColor(img_padded, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
        final_search = cv2.bitwise_not(thresh)
        data, _, _ = detector.detectAndDecode(final_search)

    if not data:
        return JSONResponse({"error": "No QR code found in image."}, status_code=400)

    try:
        key = generate_key(password)
        cipher = Fernet(key)
        decrypted_message = cipher.decrypt(data.encode()).decode()
        print(f"✅ Message: {decrypted_message}")
        return {"message": decrypted_message}
    except Exception:
        return JSONResponse({"error": "Incorrect password"}, status_code=403)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)