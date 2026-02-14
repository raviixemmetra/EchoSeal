import { useState, useRef } from 'react';

const Sender = () => {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = []; // Reset chunks
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        
        // Slight delay to ensure UI updates
        setTimeout(async () => {
            const password = prompt("🔒 Enter a password to encrypt this message:");
            if (!password) return;

            setProcessing(true);
            const formData = new FormData();
            formData.append("audio", audioBlob, "voice.wav");
            formData.append("password", password);

            try {
                const response = await fetch("http://localhost:8000/create-seal", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const imageBlob = await response.blob();
                    setQrImage(URL.createObjectURL(imageBlob));
                } else {
                    alert("Server Error: Could not create seal.");
                }
            } catch (err) {
                console.error(err);
                alert("Connection Failed: Is backend running?");
            }
            setProcessing(false);
        }, 100);
      };

      mediaRecorder.current.start();
      setRecording(true);
    } catch (err) {
      alert("Microphone access denied!");
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-blue-400">
        <span>🎙️</span> <span className="ml-2">Create Seal</span>
      </h2>
      
      <div className="flex flex-col items-center">
        <button 
          onClick={recording ? stopRecording : startRecording}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            recording 
              ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-500 shadow-lg'
          }`}
        >
          {recording ? (
            <div className="w-8 h-8 bg-white rounded-sm" />
          ) : (
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
          )}
        </button>
        
        <p className="mt-4 text-slate-400 font-mono">
          {recording ? "Recording... (Press to Stop)" : processing ? "Encrypting..." : "Tap to Record"}
        </p>

        {qrImage && (
          <div className="mt-8 p-4 bg-white rounded-xl shadow-inner">
            <img src={qrImage} alt="Generated QR" className="w-48 h-48 object-cover" />
            <a href={qrImage} download="secure_seal.png" className="block text-center mt-2 text-blue-600 font-bold text-sm hover:underline">
              Download Seal
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sender;