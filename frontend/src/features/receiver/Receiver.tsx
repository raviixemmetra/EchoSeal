import { useState, useRef } from 'react';
import Modal from '../../components/Modal';
import Toast, { ToastType } from '../../components/Toast';

const Receiver = () => {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingFile = useRef<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    } else {
      showToast('Please upload a valid image file', 'error');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
      // Don't reset here - it causes the dialog to reappear
      // We'll reset when the user cancels or completes the flow
    }
  };

  const processFile = (file: File) => {
    // Reset previous state
    setMessage('');
    setPassword('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      
      // Small delay to ensure image preview renders before modal opens
      // This prevents the page freeze issue
      setTimeout(() => {
        setShowPasswordModal(true);
      }, 100);
    };
    reader.readAsDataURL(file);

    // Store file for later
    pendingFile.current = file;
  };

  const handlePasswordSubmit = async () => {
    if (!password.trim()) {
      showToast('Password cannot be empty', 'warning');
      return;
    }

    if (!pendingFile.current) {
      showToast('No image file found', 'error');
      return;
    }

    setShowPasswordModal(false);
    setLoading(true);

    const formData = new FormData();
    formData.append('image', pendingFile.current);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/unseal', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.message) {
        setMessage(data.message);
        showToast('Message decrypted successfully!', 'success');

        // Auto-speak with animation
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(data.message);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        showToast(data.error || 'Failed to decrypt', 'error');
        // Reset on error so user can try again
        setImagePreview(null);
        pendingFile.current = null;
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (err) {
      showToast('Connection failed. Is the backend running?', 'error');
      // Reset on error so user can try again
      setImagePreview(null);
      pendingFile.current = null;
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    showToast('Message copied to clipboard!', 'success');
  };

  const resetState = () => {
    setImagePreview(null);
    setMessage('');
    setPassword('');
    pendingFile.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card-glass animate-slide-in-up text-center" style={{ animationDelay: '0.1s' }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold inline-flex items-center text-gradient-secondary">
          <span className="text-3xl mr-3">🔓</span>
          <span>Unseal Message</span>
        </h2>
      </div>

      {/* Upload Zone - Only show when no image preview or message */}
      {!imagePreview && !message && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            // Don't trigger if modal is open or if we're loading
            if (!showPasswordModal && !loading) {
              fileInputRef.current?.click();
            }
          }}
          className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer ${
            isDragging
              ? 'border-teal-400 bg-teal-500/10 scale-105 shadow-glow-teal'
              : 'border-slate-600 hover:border-teal-500 hover:bg-slate-700/30 hover:shadow-lg'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-slate-400 pointer-events-none text-center">
            <div className="text-7xl mb-6 animate-float">
              {isDragging ? '📥' : '📁'}
            </div>
            <p className="text-xl font-bold text-white mb-3">
              {isDragging ? 'Drop your seal here!' : 'Upload Encrypted Seal'}
            </p>
            <p className="text-base text-slate-400 mb-2">
              Click to browse or drag & drop
            </p>
            <p className="text-sm text-slate-500">Supports PNG, JPG, JPEG</p>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-6 animate-scale-in">
          <div className="relative p-4 bg-slate-700 rounded-xl">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-contain rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetState();
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-6 flex items-center justify-center gap-3 text-teal-400 animate-pulse">
          <div className="w-6 h-6 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="font-medium">Decrypting message...</p>
        </div>
      )}

      {/* Message Output */}
      {message && (
        <div className="mt-12 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-inner relative overflow-hidden group">
            {/* Speaking Animation */}
            {isSpeaking && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-purple-500 animate-pulse" />
            )}
            <p className="text-xl text-white font-medium leading-relaxed mb-4">
              "{message}"
            </p>

            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="flex-1 btn btn-secondary text-sm"
              >
                <span>📋</span> Copy Message
              </button>
              <button
                onClick={resetState}
                className="flex-1 btn btn-ghost text-sm"
              >
                <span>🔄</span> Decrypt Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPassword('');
          setImagePreview(null);
        }}
        title="🔑 Enter Decryption Password"
      >
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">
            Enter the password that was used to encrypt this message.
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
                setImagePreview(null);
                pendingFile.current = null;
              }}
              className="flex-1 btn btn-ghost"
            >
              Cancel
            </button>
            <button onClick={handlePasswordSubmit} className="flex-1 btn btn-secondary">
              Decrypt
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

export default Receiver;