
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * TicketSubmitted Component:
 * Displays a success message after ticket submission with:
 * - Confetti animation
 * - Ticket reference information
 * - Navigation options
 * - Responsive design
 */
const TicketSubmitted: React.FC = () => {
  React.useEffect(() => {
    // Trigger confetti animation when component mounts
    const duration = 2000;
    const end = Date.now() + duration;

     /**
     * Confetti Animation Effect:
     * Triggers a celebratory confetti animation on component mount
     * with controlled duration and color scheme.
     */
    const confettiAnimation = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#6366f1', '#8b5cf6']
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#6366f1', '#8b5cf6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(confettiAnimation);
      }
    };

    confettiAnimation();
  }, []);

  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <motion.div 
        className="max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 100
        }}
      >
        <motion.div 
          className="mb-6 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 10
          }}
        >
          <CheckCircle className="h-28 w-28 text-green-500" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold mb-4 text-gradient-blue"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Ticket Submitted Successfully!
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Thank you for submitting your ticket. Our support team has been notified and will respond as soon as possible.
        </motion.p>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link to="/">
            <Button className="w-full group transition-all duration-300 hover:shadow-lg">
              <Home className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Return to Home</span>
            </Button>
          </Link>
          
          <Link to="/submit-ticket">
            <Button variant="outline" className="w-full group transition-all duration-300 hover:bg-blue-50">
              <Ticket className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span>Submit Another Ticket</span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TicketSubmitted;
