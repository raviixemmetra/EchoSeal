import Sender from './components/Sender';
import Receiver from './components/Receiver';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10">
      <h1 className="text-5xl font-extrabold mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
        ECHOSEAL
      </h1>
      <p className="text-slate-400 mb-12 tracking-widest uppercase text-sm">Secure Audio Steganography</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl px-4">
        <Sender />
        <Receiver />
      </div>
    </div>
  );
}

export default App;