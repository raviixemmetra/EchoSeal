import speech_recognition as sr
import qrcode
import sounddevice as sd
import scipy.io.wavfile as wav
import numpy as np
import keyboard
import os
import sys
import time
from datetime import datetime

# --- NEW IMPORTS FOR VISUALS ---
import librosa
import librosa.display
import matplotlib.pyplot as plt
from PIL import Image

# --- CONFIGURATION ---
SAMPLE_RATE = 44100
OUTPUT_FOLDER = "output"
TEMP_AUDIO_FILE = "temp_recording.wav"
TEMP_SPEC_FILE = "temp_spectrogram.png" # Temp file for background image

def ensure_output_folder():
    """Creates the output folder if it doesn't exist."""
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)

# --- NEW FUNCTION: GENERATE SPECTROGRAM ---
def create_spectrogram_background(audio_path):
    print("... Generating Sonic Fingerprint (Spectrogram) ...")
    # 1. Load Audio using Librosa
    y, sr = librosa.load(audio_path, sr=SAMPLE_RATE)
    
    # 2. Create Mel-Spectrogram (heat map of frequencies)
    # n_mels determines height of image, fmax limits highest frequency shown
    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)
    # Convert to decibels (log scale) for visualization
    S_dB = librosa.power_to_db(S, ref=np.max)

    # 3. Plotting
    # Create a square figure without a frame
    plt.figure(figsize=(5, 5), frameon=False)
    plt.axis('off') # Hide axes (numbers/ticks)
    
    # Display data using a high-contrast colormap like 'magma' or 'inferno'
    librosa.display.specshow(S_dB, sr=sr, fmax=8000, cmap='magma')
    
    # 4. Save the raw plot as an image
    # bbox_inches='tight', pad_inches=0 removes all whitespace borders
    plt.savefig(TEMP_SPEC_FILE, bbox_inches='tight', pad_inches=0, dpi=100)
    plt.close() # Close plot to free memory
    return TEMP_SPEC_FILE

def record_audio_manual():
    """Records audio until the user presses the stop key."""
    print("\n" + "="*50)
    print("🎤  ECHO SEAL: PUSH-TO-TALK MODE")
    print("="*50)
    print("   [SPACE]    -> START Recording")
    print("   [SPACE]    -> STOP Recording")
    print("   [CTRL + C] -> Quit")
    print("-" * 50)

    print("waiting for start trigger...")
    keyboard.wait('space')
    
    print("\n🔴 RECORDING! (Press SPACE to stop)...")
    
    recording = []
    def callback(indata, frames, time, status):
        if status: print(status, file=sys.stderr)
        recording.append(indata.copy())

    stream = sd.InputStream(samplerate=SAMPLE_RATE, channels=1, callback=callback)
    stream.start()

    time.sleep(0.5) # Debounce
    keyboard.wait('space')
    
    stream.stop()
    stream.close()
    print("✅ Recording Stopped.")

    full_recording = np.concatenate(recording, axis=0)
    wav_data = (full_recording * 32767).astype(np.int16)
    wav.write(TEMP_AUDIO_FILE, SAMPLE_RATE, wav_data)
    
    return TEMP_AUDIO_FILE

def transcribe_and_generate():
    ensure_output_folder()

    try:
        # --- 1. RECORDING ---
        audio_filename = record_audio_manual()

        # --- 2. TRANSCRIPTION ---
        recognizer = sr.Recognizer()
        print("\n... Processing Audio ...")
        with sr.AudioFile(audio_filename) as source:
            audio_data = recognizer.record(source)
            
        try:
            secret_message = recognizer.recognize_google(audio_data)
        except (sr.UnknownValueError, sr.RequestError) as e:
            print(f"❌ Error during transcription: {e}")
            return

        print(f"\n📝 DETECTED MESSAGE: '{secret_message}'")
        confirm = input("Is this correct? (y/n): ").strip().lower()
        if confirm != 'y':
            print("🔄 Cancelled.")
            return

        # --- 3. GENERATE VISUALS (Spectrogram + QR) ---
        
        # A. Generate Spectrogram Background
        spec_bg_path = create_spectrogram_background(TEMP_AUDIO_FILE)
        
        # B. Generate QR Code
        print("... Minting QR Seal ...")
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            # Make box size larger for better resolution when merging
            box_size=15, 
            border=2,
        )
        qr.add_data(secret_message)
        qr.make(fit=True)

        # IMPORTANT: Make QR background TRANSPARENT
        qr_img = qr.make_image(fill_color="white", back_color="transparent").convert("RGBA")

        # C. Composite Images using Pillow (PIL)
        # Open spectrogram and convert to RGBA
        bg_img = Image.open(spec_bg_path).convert("RGBA")
        
        # Resize background to match the exact size of the QR code image
        bg_img = bg_img.resize(qr_img.size, Image.Resampling.LANCZOS)
        
        # Overlay QR onto background (Alpha Composite handles transparency)
        final_img = Image.alpha_composite(bg_img, qr_img)

        # D. Save Final Image
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"sonic_seal_v2_{timestamp}.png"
        filepath = os.path.join(OUTPUT_FOLDER, filename)
        final_img.save(filepath)

        print("\n" + "="*50)
        print(f"🚀 SUCCESS! Visual Seal saved to: {filepath}")
        print("="*50)

    except KeyboardInterrupt:
        print("\n👋 Exiting...")
    finally:
        # Cleanup all temporary files
        if os.path.exists(TEMP_AUDIO_FILE): os.remove(TEMP_AUDIO_FILE)
        if os.path.exists(TEMP_SPEC_FILE): os.remove(TEMP_SPEC_FILE)

if __name__ == "__main__":
    transcribe_and_generate()