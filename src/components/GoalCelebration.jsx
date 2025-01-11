import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

function GoalCelebration({ goal, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Auto-advance through memories
    const interval = setInterval(() => {
      setActiveIndex(prev => 
        prev === getTotalItems() - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTotalItems = () => {
    return (goal.notes?.length || 0) + 
           (goal.voiceNotes?.length || 0) + 
           (goal.images?.length || 0);
  };

  const getAllItems = () => {
    const items = [
      ...(goal.notes || []).map(note => ({
        type: 'note',
        ...note
      })),
      ...(goal.voiceNotes || []).map(note => ({
        type: 'voice',
        ...note
      })),
      ...(goal.images || []).map(image => ({
        type: 'image',
        ...image
      }))
    ].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    return items;
  };

  return (
    <motion.div
      className="celebration-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="celebration-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="celebration-header">
          <h2>🎉 Goal Completed! 🎉</h2>
          <p className="celebration-subtitle">
            Let's relive your journey to achieving this goal
          </p>
        </div>

        <div className="memories-carousel">
          <AnimatePresence mode="wait">
            {getAllItems().map((item, index) => (
              index === activeIndex && (
                <motion.div
                  key={item.id}
                  className="memory-item"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  {item.type === 'note' && (
                    <div className="memory-note">
                      <p>{item.content}</p>
                    </div>
                  )}
                  {item.type === 'voice' && (
                    <div className="memory-voice">
                      <audio controls src={URL.createObjectURL(item.audio)} />
                    </div>
                  )}
                  {item.type === 'image' && (
                    <div className="memory-image">
                      <img src={item.url} alt="Goal memory" />
                    </div>
                  )}
                  <span className="memory-date">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        <div className="celebration-navigation">
          <div className="navigation-dots">
            {getAllItems().map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>

        <motion.button
          className="close-celebration"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default GoalCelebration; 