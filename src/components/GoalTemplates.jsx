import { motion } from 'framer-motion';
import { FiCopy, FiStar } from 'react-icons/fi';

const TEMPLATES = [
  {
    id: 1,
    title: "Learn a New Language",
    description: "Master basic conversation skills in a new language",
    category: "education",
    milestones: [
      { percentage: 25, description: "Learn basic greetings" },
      { percentage: 50, description: "Complete beginner course" },
      { percentage: 75, description: "Hold basic conversations" },
      { percentage: 100, description: "Pass language certification" }
    ]
  },
  // Add more templates...
];

function GoalTemplates({ onSelectTemplate }) {
  return (
    <motion.div className="templates-grid">
      {TEMPLATES.map(template => (
        <motion.div
          key={template.id}
          className="template-card"
          whileHover={{ scale: 1.05 }}
        >
          <h3>{template.title}</h3>
          <p>{template.description}</p>
          <motion.button
            onClick={() => onSelectTemplate(template)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiCopy /> Use Template
          </motion.button>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default GoalTemplates; 