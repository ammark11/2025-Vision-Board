import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { FiMic, FiSquare, FiPlay, FiTrash2 } from 'react-icons/fi';

function VoiceNoteRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onRecordingComplete(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="voice-recorder">
      {!audioURL ? (
        <motion.button
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isRecording ? <FiSquare /> : <FiMic />}
          {isRecording ? 'Stop Recording' : 'Record Voice Note'}
        </motion.button>
      ) : (
        <div className="audio-preview">
          <audio src={audioURL} controls className="audio-player" />
          <motion.button
            className="delete-recording"
            onClick={() => setAudioURL(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiTrash2 />
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default VoiceNoteRecorder; 