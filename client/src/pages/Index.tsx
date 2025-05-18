
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Ticket, UserCheck, Clock, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';


/**
 * Index (Landing) Page Component:
 * The main entry point of the application featuring:
 * - Animated hero section with gradient background
 * - Feature highlights with motion animations
 * - Call-to-action section
 * - Responsive design throughout
 */

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero section with enhanced animations */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-30">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: `${Math.random() * 10 + 5}rem`,
                  height: `${Math.random() * 10 + 5}rem`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 20}s linear infinite`,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">TicketRax</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Get help with your questions and issues quickly and efficiently with our maharah ticket management system.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Link to="/submit-ticket">
              <Button size="lg" className="rounded-full px-8 py-6 bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 group">
                Submit a Ticket
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            {/* <Link to="/admin/login">
              <Button variant="outline" size="lg" className="rounded-full px-8 py-6 border-white text-white hover:bg-blue-700 transition-all duration-300 group">
                <Shield className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Admin Login
              </Button>
            </Link> */}
          </motion.div>
        </div>
      </div>

      {/* Features section with motion animations */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Ticket className="text-blue-600 h-8 w-8" />}
              title="Submit Your Issue"
              description="Fill out a simple form with details about your problem, and our team will get notified immediately."
              delay={0}
            />
            
            <FeatureCard 
              icon={<Clock className="text-blue-600 h-8 w-8" />}
              title="Track Progress"
              description="Receive proactive email notifications—every status update and revised ETA comes straight to your inbox."
              delay={0.2}
            />
            
            <FeatureCard 
              icon={<UserCheck className="text-blue-600 h-8 w-8" />}
              title="Get Resolution"
              description="Our experts resolve your issue, then send a final email summary for your review. Once you confirm, your ticket is closed."
              delay={0.4}
            />
          </div>
        </div>
      </div>

      {/* CTA section with animation */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Need Help Right Now?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Submit a ticket and we'll respond as quickly as possible.
            </p>
            <Link to="/submit-ticket">
              <Button size="lg" className="rounded-full px-8 hover:shadow-lg transition-all duration-300 group">
                Create a Support Ticket
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

/**
 * FeatureCard Component:
 * Reusable component for displaying feature highlights
 * 
 * Props:
 * - icon: ReactNode - Icon to display
 * - title: string - Feature title
 * - description: string - Feature description
 * - delay: number - Animation delay in seconds
 */

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <motion.div 
      className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="bg-blue-50 p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5 transform transition-transform duration-300 hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </motion.div>
  );
};

export default Index;