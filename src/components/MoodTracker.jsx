import { motion } from 'framer-motion';
import { useState } from 'react';

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '🤗', label: 'Motivated' }
];

function MoodTracker({ onMoodSelect }) {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  return (
    <motion.div className="mood-tracker">
      <h3>How are you feeling about your goals today?</h3>
      <div className="mood-grid">
        {MOODS.map(mood => (
          <motion.button
            key={mood.label}
            className={`mood-button ${selectedMood?.label === mood.label ? 'selected' : ''}`}
            onClick={() => handleMoodSelect(mood)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

export default MoodTracker; 