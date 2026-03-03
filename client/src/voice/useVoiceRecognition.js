import { useEffect, useRef, useState } from "react";

const useVoiceRecognition = (onCommand, language) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = language;
    recognition.interimResults = true; // important
    recognition.maxAlternatives = 1;

    // ✅ USE IT HERE
    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];

      if (result.isFinal) {
        const transcript = result[0].transcript.trim().toLowerCase();
        console.log("Final Command:", transcript);
        onCommand(transcript);
      }
    };

    recognition.onend = () => {
      if (listening) recognition.start(); // auto restart
    };

    recognitionRef.current = recognition;
  }, [language, onCommand, listening]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (listening) recognitionRef.current.start();
    else recognitionRef.current.stop();

    return () => recognitionRef.current?.stop();
  }, [listening]);

  return { listening, setListening };
};

export default useVoiceRecognition;