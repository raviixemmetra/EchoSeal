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
    print("hz  MODE: FILE UPLOAD")
    print("="*40)
    
    # Ask user for the filename
    filename = input("📂 Enter the filename (e.g., output/sonic_seal_xxxx.png): ").strip().strip('"')
    
    if not os.path.exists(filename):
        print(f"❌ Error: File '{filename}' not found.")
        return

    # Read image
    img = cv2.imread(filename)
    if img is None:
        print("❌ Error: Could not read image file.")
        return

    detector = cv2.QRCodeDetector()
    
    print("... Decoding ...")
    data, bbox, _ = detector.detectAndDecode(img)
    
    if data:
        print(f"\n🔓 DECODED MESSAGE: '{data}'")
        
        # Draw a box around the QR code
        if bbox is not None:
            for i in range(len(bbox)):
                pt1 = tuple(map(int, bbox[i][0]))
                pt2 = tuple(map(int, bbox[(i+1) % len(bbox)][0]))
                cv2.line(img, pt1, pt2, (0, 255, 0), 3)
        
        # Show the image
        cv2.imshow(f"Decoded: {os.path.basename(filename)}", img)
        cv2.waitKey(1) # Render the window momentarily
        
        # Speak! (Code waits here until speaking finishes)
        speak_message(data)
        
        print("\n✅ Message delivered. Closing window...")
        time.sleep(1) # Give user 1 second to see the result
        cv2.destroyAllWindows() # <--- FIXED: Closes automatically
    else:
        print("❌ Error: No QR code found in this image.")

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