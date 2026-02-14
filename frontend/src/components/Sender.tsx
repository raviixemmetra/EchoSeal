import { useState, useRef, useEffect } from 'react';
import AudioVisualizer from './AudioVisualizer';
import Modal from './Modal';
import Toast, { ToastType } from './Toast';

interface SealHistory {
  id: string;
  image: string;
  timestamp: number;
}

const Sender = () => {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [sealHistory, setSealHistory] = useState<SealHistory[]>([]);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const pendingAudioBlob = useRef<Blob | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('echoseal_history');
    if (savedHistory) {
      setSealHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (sealHistory.length > 0) {
      localStorage.setItem('echoseal_history', JSON.stringify(sealHistory));
    }
  }, [sealHistory]);

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(audioStream);
      mediaRecorder.current = new MediaRecorder(audioStream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        pendingAudioBlob.current = audioBlob;
        setShowPasswordModal(true);
        
        // Stop all tracks
        audioStream.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      mediaRecorder.current.start();
      setRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      showToast('Microphone access denied!', 'error');
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      showToast('Password cannot be empty', 'warning');
      return;
    }

    if (!pendingAudioBlob.current) {
      showToast('No audio recording found', 'error');
      return;
    }

    setShowPasswordModal(false);
    setProcessing(true);

    const formData = new FormData();
    formData.append('audio', pendingAudioBlob.current, 'voice.wav');
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/create-seal', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setQrImage(imageUrl);

        // Add to history
        const newSeal: SealHistory = {
          id: Date.now().toString(),
          image: imageUrl,
          timestamp: Date.now(),
        };
        setSealHistory((prev) => [newSeal, ...prev].slice(0, 10)); // Keep last 10

        showToast('Seal created successfully!', 'success');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to create seal', 'error');
      }
    } catch (err) {
      showToast('Connection failed. Is the backend running?', 'error');
    } finally {
      setProcessing(false);
      setPassword('');
      pendingAudioBlob.current = null;
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      showToast('Copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const deleteSeal = (id: string) => {
    setSealHistory((prev) => prev.filter((seal) => seal.id !== id));
    showToast('Seal deleted', 'info');
  };

  return (
    <div className="card-glass animate-slide-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center text-gradient-primary">
          <span className="text-3xl mr-3">🎙️</span>
          <span>Create Seal</span>
        </h2>
        {sealHistory.length > 0 && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium"
          >
            {showHistory ? 'Hide' : 'Show'} History ({sealHistory.length})
          </button>
        )}
      </div>

      <div className="flex flex-col items-center space-y-10">
        {/* Recording Button */}
        <div className="text-center space-y-6">
          <div className="relative">
            {recording && (
              <div className="absolute inset-0 rounded-full animate-ping bg-red-500/20" />
            )}
            <button
              onClick={recording ? stopRecording : startRecording}
              disabled={processing}
              className={`w-40 h-40 rounded-full flex flex-col items-center justify-center gap-3 transition-all duration-300 font-bold text-lg ${
                recording
                  ? 'bg-red-500 shadow-glow-blue animate-pulse-glow'
                  : processing
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-gradient-primary hover:scale-110 shadow-xl'
              }`}
            >
              {recording ? (
                <>
                  <div className="w-12 h-12 bg-white rounded-sm" />
                  <span className="text-white text-sm">Stop</span>
                </>
              ) : processing ? (
                <>
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-white text-sm">Processing...</span>
                </>
              ) : (
                <>
                  <div className="w-0 h-0 border-t-[16px] border-t-transparent border-l-[28px] border-l-white border-b-[16px] border-b-transparent ml-2" />
                  <span className="text-white text-sm font-bold">Record</span>
                </>
              )}
            </button>

            {/* Recording Timer */}
            {recording && (
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-red-500 px-6 py-2 rounded-full text-white font-mono text-base font-bold animate-pulse shadow-lg">
                {formatTime(recordingTime)}
              </div>
            )}
          </div>
        </div>

        {/* Status Text */}
        <p className="text-slate-300 font-medium text-center text-lg mt-4">
          {recording
            ? 'Recording in progress... Click to stop'
            : processing
            ? 'Encrypting and generating your secure seal...'
            : 'Click the button above to start recording'}
        </p>

        {/* Audio Visualizer */}
        {recording && <AudioVisualizer stream={stream} isActive={recording} />}

        {/* Generated QR Image */}
        {qrImage && (
          <div className="w-full animate-scale-in">
            <div className="p-6 bg-white rounded-2xl shadow-2xl">
              <img
                src={qrImage}
                alt="Generated Seal"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <a
                href={qrImage}
                download="echoseal_secure.png"
                className="flex-1 btn btn-primary"
              >
                <span>📥</span> Download
              </a>
              <button
                onClick={() => copyToClipboard(qrImage)}
                className="flex-1 btn btn-secondary"
              >
                <span>📋</span> Copy
              </button>
            </div>
          </div>
        )}

        {/* History Gallery */}
      </div>
      {sealHistory.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-700/50 w-full animate-fade-in">
          <h3 className="text-lg font-semibold mb-6 text-slate-300">Recent Seals</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {sealHistory.map((seal) => (
              <div
                key={seal.id}
                className="group relative aspect-square bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-colors"
              >
                <img
                  src={seal.image}
                  alt="Historical Seal"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a
                    href={seal.image}
                    download={`seal_${seal.id}.png`}
                    className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                    title="Download"
                  >
                    📥
                  </a>
                  <button
                    onClick={() => deleteSeal(seal.id)}
                    className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1 text-xs text-slate-300 truncate">
                  {new Date(seal.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
  
        </div>
      )}


      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPassword('');
        }}
        title="🔒 Encrypt Your Message"
      >
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">
            Enter a password to encrypt your message. You'll need this password to decrypt it later.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            placeholder="Enter password..."
            className="input"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPassword('');
              }}
              className="flex-1 btn btn-ghost"
            >
              Cancel
            </button>
            <button onClick={handlePasswordSubmit} className="flex-1 btn btn-primary">
              Create Seal
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Sender;