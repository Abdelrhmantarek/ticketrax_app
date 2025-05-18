import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as ticketService from '../services/ticketService';
import { useToast } from '@/hooks/use-toast';

/**
 * Type Definitions:
 * - TicketStatus: Possible lifecycle states of a ticket
 * - TicketPriority: Urgency levels for prioritization
 * - Ticket: Core ticket data structure with creator/assignee relationships
 * - TicketActivity: Audit trail for all ticket modifications and comments
 */
export type TicketStatus = 'new' | 'open' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  createdBy: {
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
};

export type TicketActivity = {
  id: string;
  ticketId: string;
  type: 'status_change' | 'priority_change' | 'assignment' | 'comment';
  message: string;
  createdBy: string;
  createdAt: string;
};

/**
 * TicketContextType:
 * Defines all available methods and state for ticket management
 * - tickets: Array of all tickets in the system
 * - activities: Audit log of all ticket activities
 * - loading: Global loading state for API operations
 * - error: Storage for any error messages
 * - CRUD operations: create/update tickets and activities
 * - Filtering utilities: Find tickets by ID, status, or priority
 */
type TicketContextType = {
  tickets: Ticket[];
  activities: TicketActivity[];
  loading: boolean;
  error: string | null;
  createTicket: (ticketData: {
    title: string;
    description: string;
    priority: TicketPriority;
    createdBy: {
      name: string;
      email: string;
    };
  }) => Promise<Ticket>;
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => Promise<Ticket>;
  addActivity: (activity: Omit<TicketActivity, 'id' | 'createdAt'>) => Promise<TicketActivity>;
  getTicketById: (id: string) => Ticket | undefined;
  getActivitiesByTicketId: (ticketId: string) => TicketActivity[];
  filterTickets: (filters: Partial<{ status: TicketStatus, priority: TicketPriority }>) => Ticket[];
  fetchTickets: () => Promise<void>;
};

// Initial empty state for the context
const initialTicketContext: TicketContextType = {
  tickets: [],
  activities: [],
  loading: false,
  error: null,
  createTicket: async () => ({} as Ticket),
  updateTicket: async () => ({} as Ticket),
  addActivity: async () => ({} as TicketActivity),
  getTicketById: () => undefined,
  getActivitiesByTicketId: () => [],
  filterTickets: () => [],
  fetchTickets: async () => {},
};

// Create context instance
const TicketContext = createContext<TicketContextType>(initialTicketContext);

/**
 * useTickets Hook:
 * Provides convenient access to the ticket context
 * Usage: const { tickets, createTicket } = useTickets();
 */
export const useTickets = () => useContext(TicketContext);

type TicketProviderProps = {
  children: ReactNode;
};

/**
 * TicketProvider Component:
 * - Manages all ticket-related state and operations
 * - Handles API communication via ticketService
 * - Provides real-time updates to child components
 */
export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  // State management
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activities, setActivities] = useState<TicketActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Initial Data Load:
   * Fetches all tickets when component mounts
   * Handles both success and error states
   */
  useEffect(() => {
    fetchTickets();
  }, []);

  /**
   * fetchTickets:
   * Retrieves all tickets from the API
   * Transforms backend data structure to frontend model
   */
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const fetchedTickets = await ticketService.getAllTickets();
      
      // Data transformation layer
      const transformedTickets = fetchedTickets.map(ticket => ({
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status as TicketStatus,
        priority: ticket.priority as TicketPriority,
        createdBy: {
          name: ticket.created_by_name,
          email: ticket.created_by_email
        },
        assignedTo: ticket.assigned_to || undefined,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at
      }));
      
      setTickets(transformedTickets);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Failed to load tickets from server');
      toast({
        title: "Error",
        description: "Failed to load tickets. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * createTicket:
   * Submits new ticket to backend
   * Updates local state optimistically
   * @param ticketData - Required fields for ticket creation
   * @returns Promise with created ticket
   */
  const createTicket = async (ticketData: {
    title: string;
    description: string;
    priority: TicketPriority;
    createdBy: {
      name: string;
      email: string;
    };
  }): Promise<Ticket> => {
    try {
      setLoading(true);
      
      // Prepare DTO for API call
      const createTicketDto: ticketService.CreateTicketDto = {
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority,
        created_by_name: ticketData.createdBy.name,
        created_by_email: ticketData.createdBy.email,
      };
      
      const newTicket = await ticketService.createTicket(createTicketDto);
      
      // Transform and update state
      const transformedTicket: Ticket = {
        id: newTicket.id,
        title: newTicket.title,
        description: newTicket.description,
        status: newTicket.status as TicketStatus,
        priority: newTicket.priority as TicketPriority,
        createdBy: {
          name: newTicket.created_by_name,
          email: newTicket.created_by_email
        },
        assignedTo: newTicket.assigned_to || undefined,
        createdAt: newTicket.created_at,
        updatedAt: newTicket.updated_at
      };
      
      setTickets(prev => [...prev, transformedTicket]);
      
      toast({
        title: "Ticket Created",
        description: "Your ticket has been submitted successfully.",
      });
      
      return transformedTicket;
    } catch (err) {
      console.error('Failed to create ticket:', err);
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * updateTicket:
   * Modifies existing ticket
   * Handles partial updates (only changed fields)
   * @param ticketId - ID of ticket to update
   * @param updates - Partial ticket data
   */
  const updateTicket = async (ticketId: string, updates: Partial<Ticket>): Promise<Ticket> => {
    try {
      setLoading(true);
      
      // Prepare update payload
      const updateData: ticketService.UpdateTicketDto = {
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        assigned_to: updates.assignedTo?.id
      };
      
      const updatedTicket = await ticketService.updateTicket(ticketId, updateData);
      
      // Transform and update state
      const transformedTicket: Ticket = {
        id: updatedTicket.id,
        title: updatedTicket.title,
        description: updatedTicket.description,
        status: updatedTicket.status as TicketStatus,
        priority: updatedTicket.priority as TicketPriority,
        createdBy: {
          name: updatedTicket.created_by_name,
          email: updatedTicket.created_by_email
        },
        assignedTo: updatedTicket.assigned_to || undefined,
        createdAt: updatedTicket.created_at,
        updatedAt: updatedTicket.updated_at
      };
      
      setTickets(prev => 
        prev.map(ticket => ticket.id === ticketId ? transformedTicket : ticket)
      );
      
      toast({
        title: "Ticket Updated",
        description: "Ticket has been updated successfully.",
      });
      
      return transformedTicket;
    } catch (err) {
      console.error(`Failed to update ticket ${ticketId}:`, err);
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * addActivity:
   * Creates audit trail entries for ticket modifications
   * @param activityData - Activity details without generated fields
   */
  const addActivity = async (activityData: Omit<TicketActivity, 'id' | 'createdAt'>): Promise<TicketActivity> => {
    try {
      setLoading(true);
      
      const createActivityDto: ticketService.CreateActivityDto = {
        ticket: activityData.ticketId,
        type: activityData.type,
        message: activityData.message,
        created_by: activityData.createdBy
      };
      
      const newActivity = await ticketService.createActivity(createActivityDto);
      
      // Transform and update state
      const transformedActivity: TicketActivity = {
        id: newActivity.id,
        ticketId: newActivity.ticket,
        type: newActivity.type as 'status_change' | 'priority_change' | 'assignment' | 'comment',
        message: newActivity.message,
        createdBy: newActivity.created_by,
        createdAt: newActivity.created_at
      };
      
      setActivities(prev => [...prev, transformedActivity]);
      
      return transformedActivity;
    } catch (err) {
      console.error('Failed to add activity:', err);
      toast({
        title: "Error",
        description: "Failed to add comment or update. Please try again.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper Methods //

  /**
   * getTicketById:
   * Retrieves single ticket by ID
   * @param id - Ticket ID to find
   * @returns Ticket or undefined if not found
   */
  const getTicketById = (id: string) => {
    return tickets.find(ticket => ticket.id === id);
  };

  /**
   * getActivitiesByTicketId:
   * Filters activities for a specific ticket
   * @param ticketId - Target ticket ID
   * @returns Array of matching activities
   */
  const getActivitiesByTicketId = (ticketId: string) => {
    return activities.filter(activity => activity.ticketId === ticketId);
  };

  /**
   * filterTickets:
   * Applies status/priority filters to ticket list
   * @param filters - Criteria object
   * @returns Filtered ticket array
   */
  const filterTickets = (filters: Partial<{ status: TicketStatus, priority: TicketPriority }>) => {
    return tickets.filter(ticket => {
      if (filters.status && ticket.status !== filters.status) return false;
      if (filters.priority && ticket.priority !== filters.priority) return false;
      return true;
    });
  };

  // Context value packaging
  const value = {
    tickets,
    activities,
    loading,
    error,
    createTicket,
    updateTicket,
    addActivity,
    getTicketById,
    getActivitiesByTicketId,
    filterTickets,
    fetchTickets,
  };

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};