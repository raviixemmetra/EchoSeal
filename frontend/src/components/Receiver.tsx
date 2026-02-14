import React, { useState } from 'react';

const Receiver = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    const password = prompt("🔑 Enter the password to decrypt:");
    
    if (!password) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("password", password);

    try {
        const response = await fetch("http://localhost:8000/unseal", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.message) {
            setMessage(data.message);
            // Auto-speak
            const utterance = new SpeechSynthesisUtterance(data.message);
            window.speechSynthesis.speak(utterance);
        } else {
            alert(data.error || "Failed to decrypt");
        }
    } catch (err) {
        alert("Error connecting to server");
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-teal-400">
        <span>🔓</span> <span className="ml-2">Unseal Message</span>
      </h2>

      <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-teal-500 hover:bg-slate-700/50 transition-colors relative">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-slate-400">
          <p className="text-4xl mb-2">📁</p>
          <p className="font-bold">Click to Upload Seal</p>
          <p className="text-xs mt-1 text-slate-500">Supports PNG / JPG</p>
        </div>
      </div>
      
      {loading && <p className="text-center mt-4 text-teal-400 animate-pulse">Decrypting...</p>}

      {message && (
        <div className="mt-6 p-4 bg-teal-900/30 border border-teal-500/30 rounded-lg">
            <p className="text-xs text-teal-400 uppercase tracking-wider mb-1">Decrypted Transmission:</p>
            <p className="text-lg text-white font-mono leading-relaxed">"{message}"</p>
        </div>
      )}
    </div>
  );
};

export default Receiver;