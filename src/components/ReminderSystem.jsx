import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiBell, FiCalendar, FiClock } from 'react-icons/fi';

function ReminderSystem({ onSetReminder }) {
  const [reminder, setReminder] = useState({
    frequency: 'daily',
    time: '09:00',
    days: ['monday', 'wednesday', 'friday']
  });

  return (
    <motion.div className="reminder-system">
      <h3>Set Goal Reminders</h3>
      <div className="reminder-options">
        <select
          value={reminder.frequency}
          onChange={(e) => setReminder({ ...reminder, frequency: e.target.value })}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        
        <input
          type="time"
          value={reminder.time}
          onChange={(e) => setReminder({ ...reminder, time: e.target.value })}
        />
        
        {reminder.frequency === 'weekly' && (
          <div className="day-selector">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
              <motion.button
                key={day}
                className={`day-button ${reminder.days.includes(day) ? 'selected' : ''}`}
                onClick={() => {
                  const newDays = reminder.days.includes(day)
                    ? reminder.days.filter(d => d !== day)
                    : [...reminder.days, day];
                  setReminder({ ...reminder, days: newDays });
                }}
                whileHover={{ scale: 1.1 }}
              >
                {day.charAt(0).toUpperCase()}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ReminderSystem; 