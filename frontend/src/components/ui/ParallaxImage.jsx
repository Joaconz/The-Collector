import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const ParallaxImage = ({
  src,
  alt,
  speed = 0.15,
  className = '',
  imgClassName = '',
  fetchPriority,
  loading,
}) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const range = speed * 100;
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        fetchPriority={fetchPriority}
        loading={loading}
        style={shouldReduceMotion ? {} : { y }}
        className={`w-full object-cover ${imgClassName}`}
      />
    </div>
  );
};

export default ParallaxImage;
