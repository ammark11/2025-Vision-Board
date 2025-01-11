import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiEdit3, FiMic, FiImage, FiX, FiSave } from 'react-icons/fi';
import VoiceNoteRecorder from './VoiceNoteRecorder';

function GoalJourney({ goal, onUpdate, onClose }) {
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState('notes');
  const [isRecording, setIsRecording] = useState(false);

  const addNote = () => {
    if (!newNote.trim()) return;
    const updatedNotes = [...(goal.notes || []), {
      id: Date.now(),
      content: newNote,
      timestamp: new Date().toISOString()
    }];
    onUpdate({ ...goal, notes: updatedNotes });
    setNewNote('');
  };

  const addVoiceNote = (audioBlob) => {
    const updatedVoiceNotes = [...(goal.voiceNotes || []), {
      id: Date.now(),
      audio: audioBlob,
      timestamp: new Date().toISOString()
    }];
    onUpdate({ ...goal, voiceNotes: updatedVoiceNotes });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedImages = [...(goal.images || []), {
          id: Date.now(),
          url: reader.result,
          timestamp: new Date().toISOString()
        }];
        onUpdate({ ...goal, images: updatedImages });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      className="goal-journey-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="goal-journey-modal"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="journey-header">
          <h2>{goal.title}</h2>
          <div className="progress-indicator">
            <div 
              className="progress-bar" 
              style={{ width: `${goal.progress}%` }}
            />
            <span>{goal.progress}% Complete</span>
          </div>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="journey-tabs">
          <button 
            className={`tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
          <button 
            className={`tab ${activeTab === 'voice' ? 'active' : ''}`}
            onClick={() => setActiveTab('voice')}
          >
            Voice Notes
          </button>
          <button 
            className={`tab ${activeTab === 'images' ? 'active' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            Images
          </button>
        </div>

        <div className="journey-content">
          <AnimatePresence mode="wait">
            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="notes-section"
              >
                <div className="add-note">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a new note..."
                    className="note-input"
                  />
                  <motion.button
                    onClick={addNote}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="add-note-btn"
                  >
                    Add Note
                  </motion.button>
                </div>
                <div className="notes-timeline">
                  {goal.notes?.map(note => (
                    <motion.div
                      key={note.id}
                      className="note-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p>{note.content}</p>
                      <span className="timestamp">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'voice' && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="voice-notes-section"
              >
                <VoiceNoteRecorder onRecordingComplete={addVoiceNote} />
                <div className="voice-notes-timeline">
                  {goal.voiceNotes?.map(note => (
                    <motion.div
                      key={note.id}
                      className="voice-note-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <audio controls src={URL.createObjectURL(note.audio)} />
                      <span className="timestamp">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'images' && (
              <motion.div
                key="images"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="images-section"
              >
                <div className="image-upload">
                  <label className="upload-btn">
                    <FiImage /> Add Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <div className="images-grid">
                  {goal.images?.map(image => (
                    <motion.div
                      key={image.id}
                      className="image-card"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <img src={image.url} alt="Goal progress" />
                      <span className="timestamp">
                        {new Date(image.timestamp).toLocaleDateString()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GoalJourney; 