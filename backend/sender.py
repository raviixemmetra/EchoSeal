import speech_recognition as sr
import qrcode
import sounddevice as sd
import scipy.io.wavfile as wav
import numpy as np
import keyboard
import os
import sys
import time
import base64
from datetime import datetime

# --- VISUALS & SECURITY IMPORTS ---
import librosa
import librosa.display
import matplotlib.pyplot as plt
from PIL import Image
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# --- CONFIGURATION ---
SAMPLE_RATE = 44100
OUTPUT_FOLDER = "output"
TEMP_AUDIO_FILE = "temp_recording.wav"
TEMP_SPEC_FILE = "temp_spectrogram.png"

def ensure_output_folder():
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)

# --- NEW: KEY DERIVATION FUNCTION ---
def generate_key_from_password(password: str) -> bytes:
    """Creates a secure 32-byte key from a plain-text password."""
    salt = b'echoseal_fixed_salt' # In production, use a unique salt per user
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return key

def create_spectrogram_background(audio_path):
    print("... Generating Sonic Fingerprint (Spectrogram) ...")
    y, sr = librosa.load(audio_path, sr=SAMPLE_RATE)
    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)
    S_dB = librosa.power_to_db(S, ref=np.max)

    plt.figure(figsize=(5, 5), frameon=False)
    plt.axis('off')
    librosa.display.specshow(S_dB, sr=sr, fmax=8000, cmap='magma')
    plt.savefig(TEMP_SPEC_FILE, bbox_inches='tight', pad_inches=0, dpi=100)
    plt.close()
    return TEMP_SPEC_FILE

def record_audio_manual():
    """Records audio until the user presses the stop key."""
    print("\n" + "="*50)
    print("🎤  ECHO SEAL: SECURE SENDER (PTT)")
    print("="*50)
    print("   [SPACE]    -> START Recording")
    print("   [SPACE]    -> STOP Recording")
    print("   [CTRL + C] -> Quit")
    print("-" * 50)

    print("waiting for start trigger...")
    keyboard.wait('space')
    print("\n🔴 RECORDING! (Press SPACE to stop)...")
    
    # 2. Start Recording Stream
    # We record in a non-blocking way so we can check for key presses
    recording = []
    def callback(indata, frames, time, status):
        if status: 
            print(status, file=sys.stderr)
        recording.append(indata.copy())
        
    # Open the stream
    stream = sd.InputStream(samplerate=SAMPLE_RATE, channels=1, callback=callback)
    stream.start()
    time.sleep(0.5) 
    keyboard.wait('space')
    
    stream.stop()
    stream.close()
    print("✅ Recording Stopped.")

    full_recording = np.concatenate(recording, axis=0)
    wav_data = (full_recording * 32767).astype(np.int16)
    wav.write(TEMP_AUDIO_FILE, SAMPLE_RATE, wav_data)
    return TEMP_AUDIO_FILE

def transcribe_encrypt_and_generate():
    ensure_output_folder()

    try:
        # 1. RECORD
        audio_filename = record_audio_manual()

        # 2. TRANSCRIBE
        recognizer = sr.Recognizer()
        print("\n... Transcribing Audio ...")
        with sr.AudioFile(audio_filename) as source:
            audio_data = recognizer.record(source)
        try:
            secret_message = recognizer.recognize_google(audio_data)
        except Exception as e:
            print(f"❌ Error: {e}")
            return

        print(f"\n📝 DETECTED: '{secret_message}'")
        confirm = input("Confirm? (y/n): ").strip().lower()
        if confirm != 'y': return

        # --- 3. NEW: ENCRYPTION ---
        password = input("\n🔒 Set a password to lock this QR: ").strip()
        if not password:
            print("❌ Password cannot be empty.")
            return

        key = generate_key_from_password(password)
        cipher_suite = Fernet(key)
        # We encrypt the text and turn it into a string for the QR code
        encrypted_text = cipher_suite.encrypt(secret_message.encode()).decode()
        print("🔐 Message Encrypted.")

        # 4. GENERATE VISUALS
        spec_bg_path = create_spectrogram_background(TEMP_AUDIO_FILE)
        
        print("... Minting Secure QR Seal ...")
        qr = qrcode.QRCode(version=1, box_size=15, border=2)
        qr.add_data(encrypted_text) # Store the SCRAMBLED text
        qr.make(fit=True)

        qr_img = qr.make_image(fill_color="white", back_color="transparent").convert("RGBA")
        bg_img = Image.open(spec_bg_path).convert("RGBA")
        bg_img = bg_img.resize(qr_img.size, Image.Resampling.LANCZOS)
        
        final_img = Image.alpha_composite(bg_img, qr_img)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = os.path.join(OUTPUT_FOLDER, f"secure_seal_{timestamp}.png")
        final_img.save(filepath)

        print("\n" + "="*50)
        print(f"🚀 SECURE SEAL GENERATED: {filepath}")
        print("="*50)

    except KeyboardInterrupt:
        print("\n👋 Exiting...")
    finally:
        if os.path.exists(TEMP_AUDIO_FILE): os.remove(TEMP_AUDIO_FILE)
        if os.path.exists(TEMP_SPEC_FILE): os.remove(TEMP_SPEC_FILE)

if __name__ == "__main__":
    transcribe_encrypt_and_generate()