import { useEffect, useRef, useState } from 'react';

export default function useWebSocketTTS() {
  const [status, setStatus] = useState(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const sendAudioBlob = (blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;

      socketRef.current = new WebSocket("ws://localhost:9000/ws/stream");
      socketRef.current.binaryType = 'arraybuffer';

      socketRef.current.onopen = () => {
        setStatus("Connected");
        socketRef.current.send(arrayBuffer);
      };

      socketRef.current.onmessage = async (event) => {
        if (typeof event.data === 'string') {
          const json = JSON.parse(event.data);
          if (json.status === "complete") {
            setStatus("Done");
          }
          return;
        }

        // Play audio chunk
        const audioBuffer = await audioContextRef.current.decodeAudioData(await event.data.arrayBuffer());
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start(0);
        sourceRef.current = source;
      };

      socketRef.current.onclose = () => setStatus("Disconnected");
    };
    reader.readAsArrayBuffer(blob);
  };

  return { sendAudioBlob, status };
}
