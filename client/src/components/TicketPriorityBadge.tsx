import React from 'react';
import { cn } from '@/lib/utils'; // Utility to join class names conditionally
import { TicketPriority } from '@/context/TicketContext'; // Enum or union type for priorities

interface TicketPriorityBadgeProps {
  priority: TicketPriority;    // The priority level to display
  className?: string;          // Optional additional CSS classes
}

const TicketPriorityBadge: React.FC<TicketPriorityBadgeProps> = ({ priority, className }) => {
  // Mapping priority levels to their respective CSS class names
  const priorityClasses = {
    low: 'ticket-priority-low',
    medium: 'ticket-priority-medium',
    high: 'ticket-priority-high',
    urgent: 'ticket-priority-urgent',
  };
  
  // Mapping priority levels to their display labels
  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };

  return (
    // Render a span with combined classes for styling and display the label
    <span className={cn('ticket-priority', priorityClasses[priority], className)}>
      {priorityLabels[priority]}
    </span>
  );
};

export default TicketPriorityBadge;
