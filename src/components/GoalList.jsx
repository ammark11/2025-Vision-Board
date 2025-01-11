import { motion, AnimatePresence } from 'framer-motion';
import { Droppable } from 'react-beautiful-dnd';
import GoalCard from './GoalCard';

function GoalList({ goals, setGoals }) {
  const removeGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const updateGoal = (id, updatedGoal) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, ...updatedGoal } : goal
    ));
  };

  return (
    <Droppable droppableId="goals">
      {(provided) => (
        <motion.div
          className="goals-grid"
          {...provided.droppableProps}
          ref={provided.innerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            {goals.map((goal, index) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                index={index}
                onRemove={removeGoal}
                onUpdate={updateGoal}
              />
            ))}
          </AnimatePresence>
          {provided.placeholder}
        </motion.div>
      )}
    </Droppable>
  );
}

export default GoalList; 