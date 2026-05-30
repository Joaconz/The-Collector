import { useReducedMotion } from 'framer-motion';

const Marquee = ({
  children,
  duration = 30,
  direction = 'left',
  className = '',
  contentClassName = '',
}) => {
  const shouldReduceMotion = useReducedMotion();

  const animStyle = shouldReduceMotion
    ? {}
    : {
        '--marquee-duration': `${duration}s`,
        animationDirection: direction === 'right' ? 'reverse' : 'normal',
      };

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className={`inline-flex animate-marquee ${contentClassName}`}
        style={animStyle}
      >
        {/* Duplicated for seamless loop */}
        <span className="inline-flex">{children}</span>
        <span className="inline-flex" aria-hidden="true">{children}</span>
        <span className="inline-flex" aria-hidden="true">{children}</span>
        <span className="inline-flex" aria-hidden="true">{children}</span>
      </div>
    </div>
  );
};

export default Marquee;
