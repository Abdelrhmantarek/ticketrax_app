import React from 'react';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  // If not loading, don't render anything
  if (!isLoading) return null;

  return (
    // Fullscreen overlay with white translucent background and blur effect,
    // centered content with high z-index so it overlays everything
    <motion.div
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}      // Start transparent
      animate={{ opacity: 1 }}      // Fade in
      exit={{ opacity: 0 }}         // Fade out on exit
      transition={{ duration: 0.3 }}
    >
      {/* Container for scaling animation */}
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ scale: 0.8 }}    // Slightly shrunk initially
        animate={{ scale: 1 }}      // Scale to full size with spring effect
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.5 
        }}
      >
        {/* Animated icon rotating and bouncing vertically */}
        <motion.div
          animate={{ 
            rotate: 360,             // Full continuous rotation
            y: [0, -10, 0]          // Smooth up and down bounce
          }}
          transition={{ 
            rotate: { duration: 2, ease: "linear", repeat: Infinity },
            y: { duration: 1, ease: "easeInOut", repeat: Infinity }
          }}
          className="text-primary"
        >
          <Ticket size={48} />
        </motion.div>
        
        {/* Title text fading in after a slight delay */}
        <motion.h2 
          className="mt-4 text-xl font-bold text-gradient-blue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          TicketRax
        </motion.h2>
        
        {/* Three dots scaling up and down sequentially, like a loading indicator */}
        <motion.div
          className="mt-2 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "loop",
                delay: i * 0.2        // Stagger each dot's animation
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Loader;
