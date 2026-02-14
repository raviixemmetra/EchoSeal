# 🔐 EchoSeal

**Secure Audio Steganography Platform**

Transform your voice into encrypted visual seals. Record, encrypt, and share messages hidden in beautiful spectrograms with end-to-end encryption.

![EchoSeal Banner](https://img.shields.io/badge/Security-End--to--End%20Encrypted-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

EchoSeal is a cutting-edge audio steganography platform that combines voice recording, encryption, and visual encoding to create secure, shareable message seals. Unlike traditional messaging apps, EchoSeal embeds your encrypted audio message into a visual spectrogram that can be shared as an image.

### How It Works

1. **Record** - Capture your voice message using the built-in recorder
2. **Encrypt** - Secure your message with a password using AES-256 encryption
3. **Encode** - Transform the encrypted audio into a visual spectrogram seal
4. **Share** - Send the seal image to your recipient
5. **Decrypt** - Recipient uploads the seal and enters the password to reveal the message

---

## ✨ Features

### 🎙️ Sender Features

- **Voice Recording** - High-quality audio capture with real-time visualizer
- **Live Audio Visualization** - Frequency bars with glow effects during recording
- **Password Encryption** - AES-256 encryption for maximum security
- **Spectrogram Generation** - Beautiful visual representation of encrypted audio
- **Download & Copy** - Easy sharing via download or clipboard

### 🔓 Receiver Features

- **Drag & Drop Upload** - Intuitive file upload with visual feedback
- **Password Decryption** - Secure decryption with password verification
- **Auto Text-to-Speech** - Automatic playback of decrypted messages
- **Message Display** - Clean, readable message output
- **Copy to Clipboard** - Quick message copying

### 🎨 UI/UX Features

- **Premium Design** - Modern glassmorphism with gradient effects
- **Smooth Animations** - 15+ custom animations (bounce, slide, rotate, glow)
- **Interactive Elements** - Hover effects with scale and glow animations
- **Responsive Layout** - Works seamlessly on desktop and mobile
- **Dark Theme** - Easy on the eyes with vibrant accent colors
- **Real-time Feedback** - Toast notifications with progress bars

---

## 🛠️ Technology Stack

### Backend

- **Framework**: FastAPI (Python)
- **Audio Processing**:
  - `librosa` - Audio analysis and manipulation
  - `soundfile` - Audio file I/O
  - `pydub` - Audio format conversion
- **Speech Recognition**: OpenAI Whisper (base model)
- **Encryption**: `cryptography` (Fernet symmetric encryption)
- **Image Processing**:
  - `matplotlib` - Spectrogram generation
  - `Pillow` - Image manipulation
- **Server**: Uvicorn (ASGI server)

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**:
  - Tailwind CSS
  - Custom CSS (animations, themes, utilities)
- **Audio**: Web Audio API
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

### Development Tools

- **Version Control**: Git
- **Package Managers**:
  - pip (Python)
  - npm (JavaScript)
- **Code Quality**: TypeScript strict mode

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Sender     │  │   Receiver   │  │  Components  │       │
│  │  Component   │  │  Component   │  │  (Modal,     │       │
│  │              │  │              │  │   Toast,     │       │
│  │  - Record    │  │  - Upload    │  │   Visualizer)│       │
│  │  - Encrypt   │  │  - Decrypt   │  │              │       │
│  │  - Download  │  │  - Playback  │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                          │                                  │
│                          │ HTTP/REST                        │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    FastAPI Server                    │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │  /create-seal│  │   /unseal    │  │   CORS     │  │   │
│  │  │              │  │              │  │ Middleware │  │   │
│  │  │  - Receive   │  │  - Receive   │  │            │  │   │
│  │  │    audio     │  │    image     │  │            │  │   │
│  │  │  - Transcribe│  │  - Extract   │  │            │  │   │
│  │  │  - Encrypt   │  │    audio     │  │            │  │   │
│  │  │  - Generate  │  │  - Decrypt   │  │            │  │   │
│  │  │    seal      │  │  - Return    │  │            │  │   │
│  │  │              │  │    message   │  │            │  │   │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Core Services                       │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │   Whisper    │  │ Cryptography │  │  Librosa   │  │   │
│  │  │   (Speech    │  │   (AES-256   │  │  (Audio    │  │   │
│  │  │Recognition)  │  │ Encryption)  │  │Processing) │  │   │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │   │
│  │                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐                  │   │
│  │  │  Matplotlib  │  │    Pillow    │                  │   │
│  │  │ (Spectrogram)│  │   (Image)    │                  │   │
│  │  └──────────────┘  └──────────────┘                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

#### Creating a Seal

```
User Records Audio
       ↓
Web Audio API captures stream
       ↓
Audio sent to /create-seal endpoint
       ↓
Backend: Audio → WAV → Whisper Transcription
       ↓
Backend: Text + Password → AES Encryption
       ↓
Backend: Encrypted Data → Spectrogram Image
       ↓
Frontend: Display seal image
       ↓
User downloads/shares seal
```

#### Unsealing a Message

```
User uploads seal image
       ↓
Image sent to /unseal endpoint
       ↓
Backend: Extract audio from spectrogram
       ↓
Backend: Decrypt with password
       ↓
Backend: Return original message
       ↓
Frontend: Display + Text-to-Speech
```

---

## 📦 Installation

### Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **npm**: 8 or higher
- **Git**: Latest version

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/raviixemmetra/EchoSeal.git
   cd EchoSeal
   ```

2. **Navigate to backend directory**

   ```bash
   cd backend
   ```

3. **Create virtual environment**

   ```bash
   python -m venv venv

   # Windows
   venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Download Whisper model** (first run only)
   ```bash
   # The base model will be downloaded automatically on first use
   # Approximately 150MB download
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

---

## 🚀 Usage

### Starting the Application

#### 1. Start Backend Server

```bash
cd backend
uvicorn server:app --reload
```

The backend will be available at: `http://localhost:8000`

#### 2. Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at: `http://localhost:5173`

### Creating a Seal

1. Open the application in your browser
2. Click the **Record** button in the "Create Seal" section
3. Speak your message
4. Click **Stop** when finished
5. Enter a password in the modal
6. Click **Create Seal**
7. Download or copy the generated seal image

### Unsealing a Message

1. Navigate to the "Unseal Message" section
2. Drag and drop the seal image or click to browse
3. Enter the password used to create the seal
4. Click **Decrypt**
5. The message will be displayed and automatically read aloud

---

## 📡 API Documentation

### Base URL

```
http://localhost:8000
```

### Endpoints

#### 1. Create Seal

**Endpoint**: `POST /create-seal`

**Description**: Creates an encrypted seal from audio recording

**Request**:

- **Content-Type**: `multipart/form-data`
- **Body**:
  - `audio` (file): Audio file (WAV format)
  - `password` (string): Encryption password

**Response**:

- **Content-Type**: `image/png`
- **Body**: PNG image of the encrypted seal

**Example**:

```bash
curl -X POST http://localhost:8000/create-seal \
  -F "audio=@recording.wav" \
  -F "password=mySecurePassword123" \
  --output seal.png
```

**Process**:

1. Receives audio file and password
2. Converts audio to standard WAV format
3. Transcribes audio using Whisper
4. Encrypts transcription with password (AES-256)
5. Generates spectrogram with encrypted data
6. Returns PNG image

---

#### 2. Unseal Message

**Endpoint**: `POST /unseal`

**Description**: Decrypts a seal image to retrieve the original message

**Request**:

- **Content-Type**: `multipart/form-data`
- **Body**:
  - `image` (file): Seal image (PNG/JPG)
  - `password` (string): Decryption password

**Response**:

- **Content-Type**: `application/json`
- **Body**:
  ```json
  {
    "message": "Decrypted message text"
  }
  ```

**Error Response**:

```json
{
  "error": "Invalid password or corrupted seal"
}
```

**Example**:

```bash
curl -X POST http://localhost:8000/unseal \
  -F "image=@seal.png" \
  -F "password=mySecurePassword123"
```

**Process**:

1. Receives seal image and password
2. Extracts encrypted audio from spectrogram
3. Attempts decryption with provided password
4. Returns original message text

---

## 🔒 Security

### Encryption

- **Algorithm**: AES-256 (Fernet symmetric encryption)
- **Key Derivation**: Password-based key derivation
- **Implementation**: Python `cryptography` library

### Security Features

1. **Client-Side Processing**: Audio recording happens in the browser
2. **Encrypted Transmission**: Messages are encrypted before leaving the client
3. **No Storage**: Server doesn't store audio files or messages
4. **Password Protection**: Only password holders can decrypt messages
5. **Secure Random**: Cryptographically secure random number generation

### Best Practices

- Use strong, unique passwords (12+ characters)
- Don't share passwords over insecure channels
- Verify recipient identity before sharing seals
- Delete sensitive seals after successful delivery

### Security Considerations

⚠️ **Important Notes**:

- This is a demonstration project, not audited for production use
- Password strength directly impacts security
- Seal images should be transmitted over secure channels (HTTPS)
- No password recovery mechanism exists

---

## 📁 Project Structure

```
EchoSeal/
├── backend/
│   ├── server.py              # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── venv/                  # Virtual environment
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx        # Main application component
│   │   │   ├── providers.tsx  # Context providers (unused)
│   │   │   └── routes.tsx     # Routing logic (unused)
│   │   │
│   │   ├── components/
│   │   │   ├── AudioVisualizer.tsx  # Real-time audio visualization
│   │   │   ├── Modal.tsx            # Modal dialog component
│   │   │   └── Toast.tsx            # Toast notification component
│   │   │
│   │   ├── features/
│   │   │   ├── sender/
│   │   │   │   └── Sender.tsx       # Recording & seal creation
│   │   │   └── receiver/
│   │   │       └── Receiver.tsx     # Upload & decryption
│   │   │
│   │   ├── style/
│   │   │   ├── animations.css       # Animation keyframes
│   │   │   ├── theme.css            # Design tokens & variables
│   │   │   └── global.css           # Global styles & utilities
│   │   │
│   │   ├── index.css          # Main CSS entry point
│   │   └── main.tsx           # React entry point
│   │
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   ├── tsconfig.json          # TypeScript configuration
│   ├── vite.config.ts         # Vite configuration
│   └── tailwind.config.js     # Tailwind CSS configuration
│
└── README.md                  # This file
```

### Key Files

#### Backend

- **`server.py`**: Main FastAPI application with endpoints
- **`requirements.txt`**: Python package dependencies

#### Frontend

- **`App.tsx`**: Main application layout and structure
- **`Sender.tsx`**: Voice recording and seal creation logic
- **`Receiver.tsx`**: Seal upload and decryption logic
- **`AudioVisualizer.tsx`**: Real-time frequency visualization
- **`Modal.tsx`**: Reusable modal dialog
- **`Toast.tsx`**: Notification system with progress bar

#### Styling

- **`animations.css`**: 15+ custom animation keyframes
- **`theme.css`**: CSS variables for colors, spacing, shadows
- **`global.css`**: Global styles, utilities, component base styles

---

## 💻 Development

### Frontend Development

#### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

#### Adding New Features

1. Create component in appropriate directory
2. Import and use in parent component
3. Add styles using Tailwind or custom CSS
4. Test functionality

#### Styling Guidelines

- Use Tailwind utility classes for layout
- Use custom CSS variables from `theme.css`
- Add animations from `animations.css`
- Follow existing component patterns

### Backend Development

#### Running with Auto-Reload

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

#### Adding New Endpoints

1. Define route in `server.py`
2. Add request/response models
3. Implement business logic
4. Update API documentation

#### Testing

```bash
# Manual testing with curl
curl -X POST http://localhost:8000/create-seal \
  -F "audio=@test.wav" \
  -F "password=test123"
```

### Environment Variables

Create `.env` file in backend directory:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Whisper Model
WHISPER_MODEL=base  # Options: tiny, base, small, medium, large
```

---

## 🎨 UI/UX Design

### Design System

#### Colors

- **Primary**: Blue (#3b82f6)
- **Secondary**: Teal (#14b8a6)
- **Accent**: Purple (#8b5cf6)
- **Success**: Emerald (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Amber (#f59e0b)

#### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: 700-900 weight
- **Body**: 400-600 weight

#### Spacing Scale

- xs: 0.5rem (8px)
- sm: 1rem (16px)
- md: 1.5rem (24px)
- lg: 3rem (48px)
- xl: 5rem (80px)

#### Animations

- **Duration**: 150ms (fast), 300ms (normal), 500ms (slow)
- **Easing**: ease-in-out, cubic-bezier
- **Types**: Fade, slide, bounce, rotate, scale, glow

### Component Library

#### Buttons

- Primary (blue gradient)
- Secondary (teal)
- Accent (purple)
- Ghost (transparent with border)

#### Cards

- Standard card
- Glass card (glassmorphism)
- Premium card (gradient border)

#### Inputs

- Text input with focus states
- Password input
- File upload (drag & drop)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs

1. Check existing issues
2. Create new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### Suggesting Features

1. Open an issue with `[Feature Request]` prefix
2. Describe the feature and use case
3. Explain why it would be valuable

### Pull Requests

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test thoroughly before submitting

---

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2026 EchoSeal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Technologies Used

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [OpenAI Whisper](https://github.com/openai/whisper) - Speech recognition
- [Librosa](https://librosa.org/) - Audio analysis
- [Cryptography](https://cryptography.io/) - Encryption library

### Inspiration

- Modern messaging apps
- Steganography techniques
- Privacy-focused communication tools

---

## 📞 Contact & Support

- **GitHub**: [@raviixemmetra](https://github.com/raviixemmetra)
- **Email**: ravi.raj@emmetra.com
- **Issues**: [GitHub Issues](https://github.com/raviixemmetra/EchoSeal/issues)

---

## 🗺️ Roadmap

### Planned Features

- [ ] Multiple audio format support (MP3, OGG, FLAC)
- [ ] Batch seal creation
- [ ] QR code integration for easy sharing
- [ ] Mobile app (React Native)
- [ ] End-to-end encrypted chat
- [ ] Self-destructing messages
- [ ] Audio effects (noise reduction, normalization)
- [ ] Custom seal themes
- [ ] Multi-language support
- [ ] Docker containerization
- [ ] Cloud deployment guide

### Future Enhancements

- Advanced encryption options (RSA, ECC)
- Seal verification system
- Message expiration
- Audio compression
- Watermarking
- Analytics dashboard

---

## 📊 Performance

### Metrics

- **Seal Creation**: ~2-5 seconds (depends on audio length)
- **Decryption**: ~1-2 seconds
- **Audio Quality**: 44.1kHz, 16-bit
- **Image Size**: ~200-500KB per seal
- **Supported Audio Length**: Up to 60 seconds

### Optimization Tips

1. Use shorter audio messages for faster processing
2. Compress images before sharing
3. Use strong but memorable passwords
4. Clear browser cache periodically

---

## 🔧 Troubleshooting

### Common Issues

#### Backend won't start

```bash
# Check Python version
python --version  # Should be 3.8+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

#### Frontend build errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Whisper model download fails

```bash
# Manually download model
python -c "import whisper; whisper.load_model('base')"
```

#### CORS errors

- Ensure backend is running on port 8000
- Check CORS configuration in `server.py`
- Verify frontend URL in allowed origins

---

<div align="center">

**Built with ❤️ for secure communication**

⭐ Star this repo if you find it useful!

[Report Bug](https://github.com/raviixemmetra/EchoSeal/issues) · [Request Feature](https://github.com/raviixemmetra/EchoSeal/issues) · [Documentation](https://github.com/raviixemmetra/EchoSeal/wiki)

</div>
