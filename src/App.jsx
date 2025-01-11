import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import GoalList from './components/GoalList';
import AddGoalForm from './components/AddGoalForm';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import GoalYearbook from './components/GoalYearbook';
import './styles/App.css';

function App() {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [showYearbook, setShowYearbook] = useState(false);
  const [hasShownYearbook, setHasShownYearbook] = useState(() => {
    const stored = localStorage.getItem('hasShownYearbook');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 100,
          delay: Math.random() * 2
        }
      ].slice(-20));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const completedGoals = goals.filter(goal => goal.progress === 100);
    
    if (completedGoals.length > 0 && !hasShownYearbook) {
      setShowYearbook(true);
      setHasShownYearbook(true);
    }
  }, [goals, hasShownYearbook]);

  useEffect(() => {
    localStorage.setItem('hasShownYearbook', JSON.stringify(hasShownYearbook));
  }, [hasShownYearbook]);

  const addGoal = (newGoal) => {
    setGoals([...goals, { ...newGoal, id: Date.now(), progress: 0 }]);
    setIsFormVisible(false);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(goals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setGoals(items);
  };

  const handleGoalComplete = (updatedGoal) => {
    const updatedGoals = goals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    setGoals(updatedGoals);
    
    if (updatedGoal.progress === 100) {
      setHasShownYearbook(false);
      setShowYearbook(true);
    }
  };

  const handleCloseYearbook = () => {
    setShowYearbook(false);
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.remove();
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <motion.div 
        className="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Header />
        
        <motion.button
          className="add-goal-button"
          onClick={() => setIsFormVisible(!isFormVisible)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isFormVisible ? 'Close Form' : 'Add New Goal'}
        </motion.button>

        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AddGoalForm onAddGoal={addGoal} />
            </motion.div>
          )}
        </AnimatePresence>

        <GoalList goals={goals} setGoals={setGoals} />

        <Dashboard goals={goals} />

        <div className="cute-background">
          {hearts.map(heart => (
            <div
              key={heart.id}
              className="floating-heart"
              style={{
                left: `${heart.left}%`,
                animationDelay: `${heart.delay}s`
              }}
            >
              ❤️
            </div>
          ))}
        </div>

        <AnimatePresence>
          {showYearbook && (
            <GoalYearbook 
              goals={goals} 
              onClose={handleCloseYearbook} 
            />
          )}
        </AnimatePresence>
      </motion.div>
    </DragDropContext>
  );
}

export default App; 