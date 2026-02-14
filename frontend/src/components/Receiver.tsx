import React, { useState } from 'react';

const Receiver = () => {
  const [message, setMessage] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const file = e.target.files[0];
    const password = prompt("Enter the password to decrypt:");
    
    if (!password) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("password", password);

    const response = await fetch("http://localhost:8000/unseal", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (data.message) {
        setMessage(data.message);
        // Use browser's native text-to-speech
        const utterance = new SpeechSynthesisUtterance(data.message);
        window.speechSynthesis.speak(utterance);
    } else {
        alert(data.error || "Failed to decrypt");
    }
  };

  return (
    <div className="p-4 border rounded shadow mt-8">
      <h2 className="text-xl font-bold">🔓 Unseal Message</h2>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload}
        className="mt-4"
      />
      
      {message && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="font-bold">Decrypted Message:</h3>
          <p className="text-lg">{message}</p>
        </div>
      )}
    </div>
  );
};

export default Receiver;