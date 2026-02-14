import Sender from './components/Sender';
import Receiver from './components/Receiver';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 gradient-mesh opacity-50 pointer-events-none" />
      
      {/* Floating Orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 left-1/2 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <header className="text-center py-16 px-4">
          <div className="animate-slide-in-down">
            <h1 className="text-6xl md:text-7xl font-black mb-4 tracking-tight">
              <span className="text-gradient-primary">ECHO</span>
              <span className="text-gradient-secondary">SEAL</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl mb-3 tracking-wide">
              Secure Audio Steganography
            </p>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
              Transform your voice into encrypted visual seals. Record, encrypt, and share messages hidden in beautiful spectrograms.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm font-medium backdrop-blur-sm">
              🔐 End-to-End Encryption
            </div>
            <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm font-medium backdrop-blur-sm">
              🎨 Visual Steganography
            </div>
            <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm font-medium backdrop-blur-sm">
              🎙️ Voice-to-QR
            </div>
            <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm font-medium backdrop-blur-sm">
              🔊 Text-to-Speech
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="container mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
            <Sender />
            <Receiver />
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8 px-4 border-t border-slate-800">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-500 text-sm mb-2">
              Built with FastAPI, React, and Web Audio API
            </p>
            <p className="text-slate-600 text-xs">
              Your messages are encrypted client-side. Only you and your recipient can decrypt them.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;