import speech_recognition as sr
import qrcode
import sounddevice as sd
import scipy.io.wavfile as wav
import numpy as np
import keyboard  # To detect key presses
import os
import time
import sys
from datetime import datetime

# --- CONFIGURATION ---
SAMPLE_RATE = 44100
OUTPUT_FOLDER = "output"
TEMP_AUDIO_FILE = "temp_recording.wav"

def ensure_output_folder():
    """Creates the output folder if it doesn't exist."""
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)
        print(f"📁 Created folder: {OUTPUT_FOLDER}/")

def record_audio_manual():
    """Records audio until the user presses the stop key."""
    print("\n" + "="*50)
    print("🎤  ECHO SEAL: PUSH-TO-TALK MODE")
    print("="*50)
    print("   [SPACE] -> START Recording")
    print("   [SPACE] -> STOP Recording")
    print("   [CTRL + C]   -> Quit")
    print("-" * 50)

    print("waiting for start trigger...")
    # 1. Wait for Start Key
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

    # 3. Wait for Stop Key (Debounce to prevent instant double-press)
    time.sleep(0.5) 
    keyboard.wait('space')
    
    stream.stop()
    stream.close()
    print("✅ Recording Stopped.")

    # 4. Save to WAV
    # Concatenate all the little chunks into one big array
    full_recording = np.concatenate(recording, axis=0)
    
    # Normalize and save (Convert float32 to int16)
    wav_data = (full_recording * 32767).astype(np.int16)
    wav.write(TEMP_AUDIO_FILE, SAMPLE_RATE, wav_data)
    
    return TEMP_AUDIO_FILE

def transcribe_and_generate():
    ensure_output_folder()

    try:
        # --- RECORDING ---
        audio_filename = record_audio_manual()

        # --- TRANSCRIPTION ---
        recognizer = sr.Recognizer()
        print("\n... Processing Audio ...")
        
        with sr.AudioFile(audio_filename) as source:
            audio_data = recognizer.record(source)
            
        # Transcribe
        try:
            secret_message = recognizer.recognize_google(audio_data)
        except sr.UnknownValueError:
            print("❌ Error: Could not understand audio.")
            return
        except sr.RequestError:
            print("❌ Error: No internet connection.")
            return

        print(f"\n📝 DETECTED MESSAGE: '{secret_message}'")
        
        # User Confirmation
        confirm = input("Is this correct? (y/n): ").strip().lower()
        if confirm != 'y':
            print("🔄 Cancelled.")
            return

        # --- QR GENERATION ---
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"sonic_seal_{timestamp}.png"
        filepath = os.path.join(OUTPUT_FOLDER, filename)

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(secret_message)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        img.save(filepath)

        print("\n" + "="*50)
        print(f"🚀 SUCCESS! Saved to: {filepath}")
        print("="*50)

    except KeyboardInterrupt:
        print("\n👋 Exiting...")
    finally:
        # Cleanup temp file
        if os.path.exists(TEMP_AUDIO_FILE):
            os.remove(TEMP_AUDIO_FILE)

if __name__ == "__main__":
    transcribe_and_generate()