import { motion, useReducedMotion } from 'framer-motion';

const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 60,
  once = true,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const offsets = {
    up:    { x: 0,         y: distance  },
    down:  { x: 0,         y: -distance },
    left:  { x: distance,  y: 0         },
    right: { x: -distance, y: 0         },
  };
  const { x, y } = offsets[direction];

  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, transform: `translate3d(${x}px, ${y}px, 0)` };

  const animate = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, transform: 'translate3d(0px, 0px, 0px)' };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once, margin: '-100px' }}
      transition={{ duration, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
