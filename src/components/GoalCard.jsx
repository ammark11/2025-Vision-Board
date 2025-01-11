import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FiEdit2, FiTrash2, FiCheck, FiX, FiHeart, FiStar, FiEye, FiBook } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import GoalDetails from './GoalDetails';
import GoalCelebration from './GoalCelebration';
import GoalJourney from './GoalJourney';

function GoalCard({ goal, onRemove, index, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState(goal);
  const [progress, setProgress] = useState(goal.progress || 0);
  const [reactions, setReactions] = useState(goal.reactions || { '❤️': 0, '⭐': 0, '🎉': 0, '💪': 0 });
  const [showSparkles, setShowSparkles] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showJourney, setShowJourney] = useState(false);

  // Scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  // Progress celebration
  useEffect(() => {
    if (progress === 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [progress]);

  const handleReaction = (emoji) => {
    setReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1000);
  };

  const handleUpdate = () => {
    onUpdate(goal.id, { ...editedGoal, progress });
    setIsEditing(false);
  };

  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value);
    setProgress(newProgress);
    onUpdate(goal.id, { ...goal, progress: newProgress });
  };

  return (
    <Draggable draggableId={goal.id.toString()} index={index}>
      {(provided) => (
        <motion.div
          className="goal-card scroll-reveal"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editedGoal.title}
                onChange={(e) => setEditedGoal({ ...editedGoal, title: e.target.value })}
                className="edit-input"
              />
              <textarea
                value={editedGoal.description}
                onChange={(e) => setEditedGoal({ ...editedGoal, description: e.target.value })}
                className="edit-textarea"
              />
              <div className="edit-actions">
                <motion.button
                  onClick={handleUpdate}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiCheck />
                </motion.button>
                <motion.button
                  onClick={() => setIsEditing(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="cancel-button"
                >
                  <FiX />
                </motion.button>
              </div>
            </div>
          ) : (
            <>
              {goal.image && (
                <motion.div
                  className="image-container"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={goal.image} alt={goal.title} className="goal-image" />
                </motion.div>
              )}
              <motion.h3 className="goal-title">{goal.title}</motion.h3>
              <p className="goal-description">{goal.description}</p>
              
              <div className="progress-container">
                <label htmlFor={`progress-${goal.id}`}>Progress:</label>
                <input
                  id={`progress-${goal.id}`}
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressChange}
                  className="progress-slider"
                />
                <span className="progress-value">{progress}%</span>
              </div>

              <div className="goal-actions">
                <motion.button
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="edit-button"
                >
                  <FiEdit2 />
                </motion.button>
                <motion.button
                  onClick={() => onRemove(goal.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="delete-button"
                >
                  <FiTrash2 />
                </motion.button>
              </div>

              <div className="goal-reactions">
                {Object.entries(reactions).map(([emoji, count]) => (
                  <button
                    key={emoji}
                    className="reaction-button"
                    onClick={() => handleReaction(emoji)}
                  >
                    {emoji}
                    <span className="reaction-count">{count}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {showSparkles && (
                  <motion.div
                    className="sparkles"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="sparkle"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 0.5}s`
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="goal-actions-container">
                <motion.button
                  className="view-details"
                  onClick={() => setShowDetails(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiEye /> View Details
                </motion.button>

                <motion.button
                  className="view-journey"
                  onClick={() => setShowJourney(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiBook /> View Journey
                </motion.button>
              </div>

              <AnimatePresence>
                {showDetails && (
                  <GoalDetails
                    goal={goal}
                    onClose={() => setShowDetails(false)}
                    onUpdate={onUpdate}
                  />
                )}
                {showCelebration && (
                  <GoalCelebration
                    goal={goal}
                    onClose={() => setShowCelebration(false)}
                  />
                )}
                {showJourney && (
                  <GoalJourney
                    goal={goal}
                    onClose={() => setShowJourney(false)}
                    onUpdate={(updatedGoal) => {
                      onUpdate(goal.id, updatedGoal);
                    }}
                  />
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      )}
    </Draggable>
  );
}

export default GoalCard; 