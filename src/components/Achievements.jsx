import { motion } from 'framer-motion';

function Achievements({ goals }) {
  const achievements = [
    {
      id: 'first-goal',
      title: 'First Step',
      description: 'Create your first goal',
      icon: '🎯',
      condition: goals.length >= 1
    },
    {
      id: 'goal-master',
      title: 'Goal Master',
      description: 'Complete 5 goals',
      icon: '👑',
      condition: goals.filter(g => g.progress === 100).length >= 5
    },
    // Add more achievements...
  ];

  return (
    <div className="achievements-section">
      {achievements.map(achievement => (
        <motion.div
          key={achievement.id}
          className={`achievement-badge ${achievement.condition ? 'unlocked' : 'locked'}`}
          whileHover={{ scale: 1.1 }}
        >
          <span className="achievement-icon">{achievement.icon}</span>
          <span className="achievement-title">{achievement.title}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default Achievements; 