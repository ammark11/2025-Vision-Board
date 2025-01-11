import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiImage, FiX, FiShare2, FiTag, FiCalendar } from 'react-icons/fi';
import VoiceNoteRecorder from './VoiceNoteRecorder';

const GOAL_CATEGORIES = [
  { id: 'health', icon: '💪', label: 'Health & Fitness' },
  { id: 'career', icon: '💼', label: 'Career' },
  { id: 'education', icon: '📚', label: 'Education' },
  { id: 'finance', icon: '💰', label: 'Finance' },
  { id: 'personal', icon: '🎯', label: 'Personal Growth' },
  { id: 'relationships', icon: '❤️', label: 'Relationships' },
  { id: 'travel', icon: '✈️', label: 'Travel' },
  { id: 'creative', icon: '🎨', label: 'Creative' },
];

const MILESTONES = [25, 50, 75, 100];

function AddGoalForm({ onAddGoal }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    deadline: '',
    image: null,
    voiceNote: null,
    milestones: MILESTONES.map(percentage => ({
      percentage,
      description: '',
      reward: ''
    })),
    isPublic: false
  });

  const handleVoiceNote = (audioBlob) => {
    setFormData(prev => ({ ...prev, voiceNote: audioBlob }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: formData.title,
          text: formData.description,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            className="form-step basics"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
          >
            <h3>Let's Start with the Basics</h3>
            <input
              type="text"
              placeholder="What's your goal?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input fancy-input"
            />
            
            <div className="category-selector">
              {GOAL_CATEGORIES.map(category => (
                <motion.button
                  key={category.id}
                  className={`category-button ${formData.category === category.id ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, category: category.id })}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-label">{category.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            className="form-step details"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
          >
            <h3>Add More Details</h3>
            <textarea
              placeholder="Describe your goal..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea fancy-input"
            />
            
            <VoiceNoteRecorder onRecordingComplete={handleVoiceNote} />
            
            <div className="milestone-section">
              <h4>Set Your Milestones</h4>
              {formData.milestones.map((milestone, index) => (
                <div key={index} className="milestone-input">
                  <span className="milestone-percentage">{milestone.percentage}%</span>
                  <input
                    type="text"
                    placeholder={`Milestone ${index + 1} description`}
                    value={milestone.description}
                    onChange={(e) => {
                      const newMilestones = [...formData.milestones];
                      newMilestones[index].description = e.target.value;
                      setFormData({ ...formData, milestones: newMilestones });
                    }}
                    className="form-input"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            className="form-step finishing"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
          >
            <h3>Final Touches</h3>
            
            <div className="image-upload-container">
              <label htmlFor="image-upload" className="image-upload-label">
                <FiImage />
                <span>Add Cover Image</span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, image: reader.result });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="image-upload-input"
              />
            </div>

            <div className="sharing-options">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                />
                <span className="slider round"></span>
                Make this goal public
              </label>
              
              {formData.isPublic && (
                <motion.button
                  className="share-button"
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiShare2 /> Share Goal
                </motion.button>
              )}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      className="add-goal-form modern"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="form-progress">
        {[1, 2, 3].map(step => (
          <motion.div
            key={step}
            className={`progress-step ${currentStep >= step ? 'active' : ''}`}
            whileHover={{ scale: 1.1 }}
            onClick={() => setCurrentStep(step)}
          >
            {step}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      <div className="form-navigation">
        {currentStep > 1 && (
          <motion.button
            className="nav-button prev"
            onClick={() => setCurrentStep(prev => prev - 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </motion.button>
        )}
        
        {currentStep < 3 ? (
          <motion.button
            className="nav-button next"
            onClick={() => setCurrentStep(prev => prev + 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        ) : (
          <motion.button
            className="nav-button submit"
            onClick={() => onAddGoal(formData)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Goal
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default AddGoalForm; 