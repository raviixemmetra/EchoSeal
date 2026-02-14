import React, { useState, useRef } from 'react';

const Sender = () => {
  const [recording, setRecording] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    
    mediaRecorder.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = async () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      const password = prompt("Enter a password to encrypt this message:");
      
      if (!password) return;

      const formData = new FormData();
      formData.append("audio", audioBlob, "voice.wav");
      formData.append("password", password);

      const response = await fetch("http://localhost:8000/create-seal", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const imageBlob = await response.blob();
        setQrImage(URL.createObjectURL(imageBlob));
      }
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">🎙️ Create Seal</h2>
      <button 
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 mt-4 rounded ${recording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      
      {qrImage && (
        <div className="mt-4">
          <p>Here is your Secure Seal:</p>
          <img src={qrImage} alt="Generated QR" className="w-64 h-64 border" />
        </div>
      )}
    </div>
  );
};

export default Sender;