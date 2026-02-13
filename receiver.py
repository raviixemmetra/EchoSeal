import cv2
import pyttsx3
import sys
import os
import time
import base64

# --- SECURITY IMPORTS ---
from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# --- SETUP VOICE ENGINE ---
try:
    engine = pyttsx3.init()
    rate = engine.getProperty('rate')
    engine.setProperty('rate', rate - 50)
except Exception as e:
    print(f"⚠️ Warning: Voice engine could not initialize. {e}")

# --- SECURITY HELPERS ---
def generate_key_from_password(password: str) -> bytes:
    """Derives the same secure key used in sender.py."""
    salt = b'echoseal_fixed_salt'  # MUST match sender.py salt exactly
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return base64.urlsafe_b64encode(kdf.derive(password.encode()))

def try_decrypt(data):
    """Checks if data is encrypted and handles password prompt."""
    # Fernet tokens usually start with 'gAAAA'
    if not data.startswith("gAAAA"):
        return data  # It's plain text, return as-is

    print("\n" + "🔒" * 20)
    print("SECURE TRANSMISSION DETECTED")
    print("This message is encrypted.")
    print("🔒" * 20)
    
    password = input("\n🔑 Enter password to decrypt: ").strip()
    
    try:
        key = generate_key_from_password(password)
        cipher_suite = Fernet(key)
        decrypted_message = cipher_suite.decrypt(data.encode()).decode()
        print("✅ Access Granted. Decrypting...")
        return decrypted_message
    except InvalidToken:
        print("❌ ACCESS DENIED: Incorrect password.")
        return None
    except Exception as e:
        print(f"❌ Decryption Error: {e}")
        return None

def speak_message(text):
    """Speaks the text and blocks execution until finished."""
    print(f"\n🔊 SPEAKING: '{text}'")
    try:
        engine.say(f"Transmission received: {text}")
        engine.runAndWait()
    except:
        print("   (Voice failed, just reading text)")

def scan_from_file():
    print("\n" + "="*40)
    print("📂 MODE: SECURE FILE UPLOAD")
    print("="*40)
    
    filename = input("Enter filename: ").strip().strip('"')
    if not os.path.exists(filename):
        print("❌ File not found.")
        return

    img = cv2.imread(filename)
    if img is None:
        print("❌ Could not read image.")
        return

    print("... Pre-processing Image ...")
    img_padded = cv2.copyMakeBorder(img, 50, 50, 50, 50, cv2.BORDER_CONSTANT, value=[255, 255, 255])
    detector = cv2.QRCodeDetector()
    
    # Try multiple strategies to decode the artistic QR
    data, bbox, _ = detector.detectAndDecode(img_padded)
    if not data:
        gray = cv2.cvtColor(img_padded, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
        final_search_img = cv2.bitwise_not(thresh)
        data, bbox, _ = detector.detectAndDecode(final_search_img)

    if data:
        # Attempt to decrypt if necessary
        final_msg = try_decrypt(data)
        
        if final_msg:
            cv2.imshow("Scanner Vision", img_padded)
            cv2.waitKey(1)
            speak_message(final_msg)
            time.sleep(1)
            cv2.destroyAllWindows()
    else:
        print("❌ Still could not read it. The background noise is too high.")

def scan_from_webcam():
    print("\n" + "="*40)
    print("👁️  MODE: WEBCAM SCANNER")
    print("="*40)
    
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Error: Could not access the webcam.")
        return

    detector = cv2.QRCodeDetector()
    print("\n🟢 SCANNING... (Press 'q' to quit)")
    last_data = ""
    
    while True:
        ret, frame = cap.read()
        if not ret: break
            
        data, bbox, _ = detector.detectAndDecode(frame)
        
        if data and data != last_data:
            # Check for encryption
            final_msg = try_decrypt(data)
            
            if final_msg:
                speak_message(final_msg)
                last_data = data
                time.sleep(2)

        cv2.imshow("EchoSeal Scanner", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

def main():
    while True:
        print("\n" + "="*40)
        print("🔊 ECHO SEAL: SECURE RECEIVER")
        print("="*40)
        print("[1] -> Scan via Webcam")
        print("[2] -> Upload Image File")
        print("[q] -> Quit")
        
        choice = input("\n👉 Select an option: ").strip().lower()
        
        if choice == '1':
            scan_from_webcam()
        elif choice == '2':
            scan_from_file()
        elif choice == 'q':
            print("👋 Exiting...")
            sys.exit()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit()