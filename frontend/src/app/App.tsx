import Sender from '../features/sender/Sender';
import Receiver from '../features/receiver/Receiver';

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
        <header className="text-center py-20 px-6">
          <div className="animate-slide-in-down">
            <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tight">
              <span className="text-gradient-primary text-shadow-glow">ECHO</span>
              <span className="text-gradient-secondary text-shadow-glow">SEAL</span>
            </h1>
            <p className="text-slate-300 text-xl md:text-2xl mb-4 tracking-wide font-semibold">
              Secure Audio Steganography
            </p>
            <p className="text-slate-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              Transform your voice into encrypted visual seals. Record, encrypt, and share messages hidden in beautiful spectrograms.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="group px-6 py-3 bg-slate-800/60 border border-slate-700 rounded-full text-sm font-semibold backdrop-blur-sm transition-all hover:bg-slate-700/70 hover:border-blue-500/50 hover:shadow-glow-blue hover:scale-105 cursor-default">
              <span className="inline-block transition-transform group-hover:scale-110">🔐</span> End-to-End Encryption
            </div>
            <div className="group px-6 py-3 bg-slate-800/60 border border-slate-700 rounded-full text-sm font-semibold backdrop-blur-sm transition-all hover:bg-slate-700/70 hover:border-teal-500/50 hover:shadow-glow-teal hover:scale-105 cursor-default">
              <span className="inline-block transition-transform group-hover:scale-110">🎨</span> Visual Steganography
            </div>
            <div className="group px-6 py-3 bg-slate-800/60 border border-slate-700 rounded-full text-sm font-semibold backdrop-blur-sm transition-all hover:bg-slate-700/70 hover:border-purple-500/50 hover:shadow-glow-purple hover:scale-105 cursor-default">
              <span className="inline-block transition-transform group-hover:scale-110">🎙️</span> Voice-to-QR
            </div>
            <div className="group px-6 py-3 bg-slate-800/60 border border-slate-700 rounded-full text-sm font-semibold backdrop-blur-sm transition-all hover:bg-slate-700/70 hover:border-cyan-500/50 hover:shadow-glow-cyan hover:scale-105 cursor-default">
              <span className="inline-block transition-transform group-hover:scale-110">🔊</span> Text-to-Speech
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="container mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <div className="animate-slide-in-left">
              <Sender />
            </div>
            <div className="animate-slide-in-right">
              <Receiver />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-12 px-6 border-t border-slate-800/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-3 text-slate-400 text-sm">
              <span className="px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50">FastAPI</span>
              <span className="text-slate-600">•</span>
              <span className="px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50">React</span>
              <span className="text-slate-600">•</span>
              <span className="px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50">Web Audio API</span>
            </div>
            <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
              <span className="text-green-400">🔒</span>
              Your messages are encrypted client-side. Only you and your recipient can decrypt them.
            </p>
            <p className="text-slate-600 text-xs">
              © 2026 EchoSeal • Secure Audio Communication
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;