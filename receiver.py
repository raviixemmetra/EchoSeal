import cv2
import pyttsx3
import sys
import os
import time

# --- SETUP VOICE ENGINE ---
try:
    engine = pyttsx3.init()
    # Adjust speed slightly slower for clarity
    rate = engine.getProperty('rate')
    engine.setProperty('rate', rate - 50)
except Exception as e:
    print(f"⚠️ Warning: Voice engine could not initialize. {e}")

def speak_message(text):
    """Speaks the text and blocks execution until finished."""
    print(f"\n🔊 SPEAKING: 'Incoming transmission: {text}'")
    try:
        engine.say(f"Incoming transmission: {text}")
        engine.runAndWait()
    except:
        print("   (Voice disabled or failed, just reading text)")

def scan_from_webcam():
    print("\n" + "="*40)
    print("👁️  MODE: WEBCAM SCANNER")
    print("="*40)
    print("... Initializing Camera ...")

    cap = cv2.VideoCapture(0)
    
    # Check if camera opened successfully
    if not cap.isOpened():
        print("❌ Error: Could not access the webcam.")
        return

    detector = cv2.QRCodeDetector()
    
    print("\n🟢 SCANNING... Hold up the QR code. (Press 'q' to quit)")

    last_data = ""
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Error: Failed to grab frame.")
            break
            
        data, bbox, _ = detector.detectAndDecode(frame)
        
        # If a QR code is detected
        if data:
            # Draw box if found
            if bbox is not None:
                for i in range(len(bbox)):
                    pt1 = tuple(map(int, bbox[i][0]))
                    pt2 = tuple(map(int, bbox[(i+1) % len(bbox)][0]))
                    cv2.line(frame, pt1, pt2, (0, 255, 0), 3)
            
            # If it's a new message (different from the last one we spoke)
            if data != last_data:
                print(f"\n🔓 DECODED: '{data}'")
                
                # Update the window immediately to show the green box
                cv2.imshow("EchoSeal Scanner", frame)
                cv2.waitKey(1) 
                
                # Speak the message
                speak_message(data)
                
                last_data = data
                print("✅ Ready for next code... (Press 'q' to quit)")
                
                # Pause briefly to prevent immediate re-scanning
                time.sleep(2)

        # Show the live feed
        cv2.imshow("EchoSeal Scanner", frame)
        
        # Check for 'q' key press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

def scan_from_file():
    print("\n" + "="*40)
    print("📂 MODE: FILE UPLOAD")
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

    # --- FIX 1: Add White Border (Quiet Zone) ---
    # Scanners need a blank border to find the corner markers.
    # We add 50 pixels of white padding around the entire image.
    img_padded = cv2.copyMakeBorder(img, 50, 50, 50, 50, cv2.BORDER_CONSTANT, value=[255, 255, 255])

    detector = cv2.QRCodeDetector()
    
    # --- STRATEGY 1: Normal Scan (on Padded Image) ---
    data, bbox, _ = detector.detectAndDecode(img_padded)

    # --- STRATEGY 2: High Contrast + Padding ---
    if not data:
        print("   (Applying high-contrast filter...)")
        # Convert to grayscale
        gray = cv2.cvtColor(img_padded, cv2.COLOR_BGR2GRAY)
        # Strong threshold: Make everything that isn't super bright PURE BLACK
        # Inverted thresholding because your QR is white-on-dark
        _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
        
        # Now we have White QR on Black background. 
        # But scanners prefer Black QR on White background.
        # So we invert it one last time to get Black-on-White.
        final_search_img = cv2.bitwise_not(thresh)
        
        data, bbox, _ = detector.detectAndDecode(final_search_img)

    # --- RESULT ---
    if data:
        print(f"\n🔓 DECODED: '{data}'")
        speak_message(data)
        
        # Show what the scanner actually saw (for debugging)
        cv2.imshow("Scanner Vision", img_padded)
        cv2.waitKey(1)
        time.sleep(2)
        cv2.destroyAllWindows()
    else:
        print("❌ Still could not read it. The spectrogram noise is overlapping the data modules.")

def main():
    while True:
        print("\n" + "="*40)
        print("🔊 ECHO SEAL: RECEIVER")
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
        else:
            print("❌ Invalid choice. Try again.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Forced Exit.")
        sys.exit()