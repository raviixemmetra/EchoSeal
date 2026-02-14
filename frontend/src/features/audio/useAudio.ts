import { useEffect, useRef, useState } from "react";

export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      setIsActive(true);

      monitorSignal();
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stop = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioContextRef.current?.close();

    setIsActive(false);
    setSignalStrength(0);
  };

  const monitorSignal = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    const update = () => {
      if (!isActive) return;

      analyser.getByteTimeDomainData(dataArray);

      // Calculate average amplitude
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += Math.abs(dataArray[i] - 128);
      }

      const avg = sum / dataArray.length;
      setSignalStrength(avg);

      requestAnimationFrame(update);
    };

    update();
  };

  return {
    isActive,
    signalStrength,
    start,
    stop,
    analyserRef,
  };
}
