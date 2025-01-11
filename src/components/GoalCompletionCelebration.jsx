import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

function GoalCompletionCelebration({ goals, onClose }) {
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  const [activeMemoryIndex, setActiveMemoryIndex] = useState(0);
  const completedGoals = goals.filter(goal => goal.progress === 100);

  useEffect(() => {
    // Create a confetti celebration
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const getAllMemories = (goal) => {
    return [
      ...(goal.notes || []).map(note => ({ type: 'note', ...note })),
      ...(goal.voiceNotes || []).map(note => ({ type: 'voice', ...note })),
      ...(goal.images || []).map(image => ({ type: 'image', ...image }))
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const currentGoal = completedGoals[activeGoalIndex];
  const memories = getAllMemories(currentGoal);
  const currentMemory = memories[activeMemoryIndex];

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
        <h1 className="celebration-title">
          🎉 Congratulations! All Goals Completed! 🎉
        </h1>
        
        <div className="goals-carousel">
          <div className="goal-navigation">
            {completedGoals.map((goal, index) => (
              <motion.button
                key={goal.id}
                className={`goal-nav-button ${index === activeGoalIndex ? 'active' : ''}`}
                onClick={() => {
                  setActiveGoalIndex(index);
                  setActiveMemoryIndex(0);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {goal.title}
              </motion.button>
            ))}
          </div>

          <div className="memories-showcase">
            <AnimatePresence mode="wait">
              {currentMemory && (
                <motion.div
                  key={currentMemory.id}
                  className="memory-display"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {currentMemory.type === 'note' && (
                    <div className="memory-note">
                      <p>{currentMemory.content}</p>
                    </div>
                  )}
                  {currentMemory.type === 'voice' && (
                    <div className="memory-voice">
                      <audio controls src={URL.createObjectURL(currentMemory.audio)} />
                    </div>
                  )}
                  {currentMemory.type === 'image' && (
                    <div className="memory-image">
                      <img src={currentMemory.url} alt="Goal memory" />
                    </div>
                  )}
                  <span className="memory-date">
                    {new Date(currentMemory.timestamp).toLocaleDateString()}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="memory-navigation">
              {memories.map((_, index) => (
                <motion.button
                  key={index}
                  className={`memory-dot ${index === activeMemoryIndex ? 'active' : ''}`}
                  onClick={() => setActiveMemoryIndex(index)}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>
        </div>

        <motion.button
          className="close-celebration"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Close Celebration
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default GoalCompletionCelebration; 