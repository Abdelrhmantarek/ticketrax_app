import React from 'react';
import { Ticket } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    // Main footer container with dark background and light text,
    // plus a fade-in animation for smooth appearance
    <footer className="bg-gray-900 text-gray-300 animate-fade-in">
      <div className="container mx-auto px-4 py-12">
        {/* Flex container for vertical stacking, centering content */}
        <div className="flex flex-col items-center text-center gap-8">
          
          {/* Company info section with spacing between elements */}
          <div className="space-y-4">
            
            {/* Brand logo and name with interactive hover animations */}
            <div className="flex items-center gap-2 justify-center group">
              
              {/* Icon wrapper with rotation on hover */}
              <div className="relative transition-transform duration-500 group-hover:rotate-[30deg]">
                
                {/* Ticket icon with color transition on hover */}
                <Ticket className="h-8 w-8 text-primary transition-all duration-300 ease-out group-hover:text-purple-400" />
                
                {/* Pulsing border effect that appears on hover */}
                <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-ping-slow opacity-0 group-hover:opacity-100" />
              </div>

              {/* Brand name with bold white text and color change on hover */}
              <h3 className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-primary">
                TicketRax
                {/* Registered trademark symbol with primary color */}
                <span className="ml-2 text-primary transition-colors duration-300">®</span>
              </h3>
            </div>

            {/* Brief company description with a slight opacity change on hover */}
            <p className="text-sm max-w-md mx-auto transition-opacity duration-300 hover:opacity-80">
              Streamlined ticket management system for efficient customer support and issue resolution.
            </p>
          </div>
        </div>

        {/* Bottom footer section separated by a top border */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          {/* Text with a subtle underline animation on hover */}
          <div className="relative inline-block group">
            <p className="text-sm transition-opacity duration-300 group-hover:opacity-80">
              {/* Link to personal site, opens in new tab */}
              <a href="https://abdelrhmantarek.me/" target='_blank' rel="noopener noreferrer">
                Eng. Abdelrhman Tarek
              </a> © 2025. All rights reserved.
              <br />
              Maharah.
            </p>
            
            {/* Animated underline that scales from 0 to full width on hover */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 
                          transition-transform duration-500 origin-left" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
