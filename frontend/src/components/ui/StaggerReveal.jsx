import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const StaggerReveal = ({
  children,
  staggerDelay = 0.06,
  delay = 0,
  direction = 'up',
  once = true,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const distance = 40;

  const childVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, transform: direction === 'up' ? `translate3d(0, ${distance}px, 0)` : 'translate3d(0, 0, 0)' },
    visible: {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] },
    },
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay, delayChildren: delay } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-80px' }}
      className={className}
    >
      {React.Children.map(children, (child, i) =>
        child ? (
          <motion.div key={i} variants={childVariants}>
            {child}
          </motion.div>
        ) : null
      )}
    </motion.div>
  );
};

export default StaggerReveal;
