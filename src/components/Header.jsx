import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function Header() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <header className="header">
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              x: mousePosition.x * 0.02 * (i % 5),
              y: mousePosition.y * 0.02 * (i % 5),
            }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        ))}
      </div>
      
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
      >
        <span className="gradient-text">2025</span> Vision Board
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="subtitle"
      >
        Transform Your Dreams into Reality
      </motion.p>
    </header>
  );
}

export default Header; 