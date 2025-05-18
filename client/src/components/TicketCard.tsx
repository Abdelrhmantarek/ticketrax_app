import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Ticket } from '@/context/TicketContext';
import TicketStatusBadge from './TicketStatusBadge';
import TicketPriorityBadge from './TicketPriorityBadge';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  isAdmin?: boolean; // Optional prop to differentiate admin view links
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, isAdmin = false }) => {
  // Format the creation date to a localized string
  const formattedDate = new Date(ticket.createdAt).toLocaleDateString();

  // Define the link URL based on whether the user is an admin or not
  const linkPath = isAdmin 
    ? `/admin/tickets/${ticket.id}`  // Admin route
    : `/ticket/${ticket.id}`;         // Public/user route

  // Placeholder for the count of comments/activities (assumed 0 for now)
  // This will be updated when the ticket data includes activities
  const commentCount = 0;

  return (
    // Animate the card on mount and hover with framer-motion
    <motion.div
      initial={{ opacity: 0, y: 10 }} // Start slightly lower and transparent
      animate={{ opacity: 1, y: 0 }}  // Animate to full opacity and normal position
      transition={{ duration: 0.3 }}  // Smooth animation duration
      whileHover={{ y: -5 }}          // Lift the card slightly on hover
      className="h-full"
    >
      {/* Card container with hover shadow and flex layout */}
      <Card className="h-full transition-shadow hover:shadow-md border-opacity-70 flex flex-col">
        
        {/* Card header with background gradient and rounded corners */}
        <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <div className="flex justify-between items-start">
            {/* Title linked to ticket details, truncated if too long */}
            <CardTitle className="text-lg font-medium truncate">
              <Link to={linkPath} className="hover:text-primary transition-colors">
                {ticket.title}
              </Link>
            </CardTitle>

            {/* Badge displaying the current status of the ticket */}
            <TicketStatusBadge status={ticket.status} />
          </div>
        </CardHeader>

        {/* Card main content showing description and priority */}
        <CardContent className="pb-2 flex-grow">
          {/* Description with limited lines (3) and min height for consistent card size */}
          <p className="text-sm text-gray-600 line-clamp-3 mb-3 min-h-[3rem]">
            {ticket.description}
          </p>

          {/* Footer area inside content: ticket ID and priority badge */}
          <div className="flex items-center justify-between mt-auto">
            {/* Show first 8 characters of ticket ID for brevity */}
            <div className="text-sm text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
              #{ticket.id.substring(0, 8)}
            </div>

            {/* Priority badge to indicate urgency/importance */}
            <TicketPriorityBadge priority={ticket.priority} />
          </div>
        </CardContent>

        {/* Card footer showing creator and creation date */}
        <CardFooter className="pt-2 flex justify-between text-xs text-gray-500 border-t">
          <div className="flex items-center">
            {/* User avatar circle showing first letter of creator's name */}
            <span className="inline-block h-6 w-6 rounded-full bg-blue-100 text-blue-600 mr-2 flex items-center justify-center">
              {ticket.createdBy.name.charAt(0).toUpperCase()}
            </span>

            {/* Creator name truncated if too long */}
            <span className="truncate max-w-[100px]">{ticket.createdBy.name}</span>
          </div>

          <div className="flex items-center">
            {/* Conditionally show comment count and icon if there are comments */}
            {commentCount > 0 && (
              <span className="flex items-center mr-2 text-gray-400">
                <MessageCircle className="h-3 w-3 mr-1" />
                {commentCount}
              </span>
            )}

            {/* Show formatted creation date */}
            <span>{formattedDate}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TicketCard;
