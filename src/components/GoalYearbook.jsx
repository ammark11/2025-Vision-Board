import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FiChevronLeft, FiChevronRight, FiVolume2, FiVolumeX, FiPlay, FiPause } from 'react-icons/fi';

function GoalYearbook({ goals, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeVoiceNote, setActiveVoiceNote] = useState(null);
  
  // Add a check for completed goals
  const completedGoals = goals.filter(goal => goal.progress === 100);
  
  // Collect all memories across completed goals only
  const allMemories = completedGoals.flatMap(goal => {
    const memories = [
      ...(goal.notes || []).map(note => ({ type: 'note', goalTitle: goal.title, ...note })),
      ...(goal.voiceNotes || []).map(note => ({ type: 'voice', goalTitle: goal.title, ...note })),
      ...(goal.images || []).map(image => ({ type: 'image', goalTitle: goal.title, ...image }))
    ];
    return memories.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Show newest first
  });

  // Filter memories by type
  const voiceNotes = allMemories.filter(memory => memory.type === 'voice');
  const images = allMemories.filter(memory => memory.type === 'image');
  const notes = allMemories.filter(memory => memory.type === 'note');

  // Add debug logging
  console.log('Completed Goals:', completedGoals);
  console.log('All Memories:', allMemories);
  console.log('Images:', images);
  console.log('Notes:', notes);
  console.log('Voice Notes:', voiceNotes);

  useEffect(() => {
    // Trigger confetti
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    let interval;

    const startConfetti = () => {
      interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
      }, 250);
    };

    startConfetti();

    return () => {
      clearInterval(interval);
      // Clean up confetti
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.remove();
      }
    };
  }, []); // Only run once on mount

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    // Clean up confetti before closing
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.remove();
    }
    onClose();
  };

  const pages = [
    {
      type: 'cover',
      content: (
        <motion.div className="yearbook-cover">
          <h1>2025 Goals Achievement</h1>
          <h2>A Journey of Growth and Success</h2>
          <div className="achievement-stats">
            <motion.div 
              className="stat"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="number">{completedGoals.length}</span>
              <span className="label">Goals Achieved</span>
            </motion.div>
            <motion.div 
              className="stat"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="number">{allMemories.length}</span>
              <span className="label">Memories Created</span>
            </motion.div>
          </div>
        </motion.div>
      )
    },
    {
      type: 'photos',
      content: images.length > 0 ? (
        <motion.div className="yearbook-photos">
          <h2>Photo Memories</h2>
          <div className="photo-grid">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                className="photo-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img src={image.url} alt={`Memory from ${image.goalTitle}`} />
                <div className="photo-caption">
                  <span>{image.goalTitle}</span>
                  <span>{new Date(image.timestamp).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null
    },
    {
      type: 'quotes',
      content: notes.length > 0 ? (
        <motion.div className="yearbook-quotes">
          <h2>Memorable Notes</h2>
          <div className="quotes-grid">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                className="quote-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <p>"{note.content}"</p>
                <div className="quote-footer">
                  <span>{note.goalTitle}</span>
                  <span>{new Date(note.timestamp).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null
    },
    {
      type: 'voice',
      content: voiceNotes.length > 0 ? (
        <motion.div className="voice-notes-section">
          <h2>Voice Memories</h2>
          <div className="voice-notes-grid">
            {voiceNotes.map((note, index) => (
              <motion.div
                key={note.id}
                className="voice-note-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="voice-note-header">
                  <h3>{note.goalTitle}</h3>
                  <span>{new Date(note.timestamp).toLocaleDateString()}</span>
                </div>
                <motion.button
                  className="play-button"
                  onClick={() => handlePlayVoiceNote(note)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {activeVoiceNote?.id === note.id && isPlaying ? (
                    <FiPause size={24} />
                  ) : (
                    <FiPlay size={24} />
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null
    }
  ].filter(page => page.content !== null);

  const handlePlayVoiceNote = (note) => {
    if (activeVoiceNote?.id === note.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(URL.createObjectURL(note.audio));
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setActiveVoiceNote(null);
      };
      audioRef.current.play();
      setIsPlaying(true);
      setActiveVoiceNote(note);
    }
  };

  return (
    <motion.div 
      className="yearbook-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.button
        className="close-yearbook-button"
        onClick={handleClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{ zIndex: 10001 }}
      >
        Close Yearbook
      </motion.button>

      <motion.div 
        className="yearbook-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            className="yearbook-page"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            {pages[currentPage].content}
          </motion.div>
        </AnimatePresence>

        <div className="yearbook-controls">
          <motion.button
            className="nav-button prev"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={currentPage === 0}
          >
            <FiChevronLeft />
          </motion.button>
          
          <motion.button
            className="sound-toggle"
            onClick={() => setIsMuted(!isMuted)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? <FiVolumeX /> : <FiVolume2 />}
          </motion.button>

          <motion.button
            className="nav-button next"
            onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={currentPage === pages.length - 1}
          >
            <FiChevronRight />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GoalYearbook; 