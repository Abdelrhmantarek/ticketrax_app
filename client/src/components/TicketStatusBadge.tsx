import React from 'react';
import { cn } from '@/lib/utils';               // Utility for conditional class names
import { TicketStatus } from '@/context/TicketContext'; // Status type enum or union

interface TicketStatusBadgeProps {
  status: TicketStatus;    // Status like 'new', 'open', 'pending', etc.
  className?: string;      // Optional additional class names
}

const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status, className }) => {
  // Map statuses to their CSS classes
  const statusClasses = {
    new: 'ticket-status-new',
    open: 'ticket-status-open',
    pending: 'ticket-status-pending',
    resolved: 'ticket-status-resolved',
    closed: 'ticket-status-closed',
  };
  
  // Map statuses to display labels
  const statusLabels = {
    new: 'New',
    open: 'Open',
    pending: 'Pending',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  return (
    <span className={cn('ticket-status', statusClasses[status], className)}>
      {statusLabels[status]}
    </span>
  );
};

export default TicketStatusBadge;
