
import { api } from './authService';
import { Ticket, TicketActivity, TicketStatus, TicketPriority } from '@/context/TicketContext';

// Django REST Framework response interfaces
interface DjangoUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface DjangoTicket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_by_name: string;
  created_by_email: string;
  assigned_to: DjangoUser | null;
  created_at: string;
  updated_at: string;
}

interface DjangoActivity {
  id: string;
  ticket: string;
  type: 'status_change' | 'priority_change' | 'assignment' | 'comment';
  message: string;
  created_by: string;
  created_at: string;
}

// Interface for creating a new ticket
export interface CreateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
  created_by_name: string;
  created_by_email: string;
}

// Interface for updating a ticket
export interface UpdateTicketDto {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigned_to?: string;
}

// Interface for adding a comment/activity
export interface CreateActivityDto {
  ticket: string;
  type: 'status_change' | 'priority_change' | 'assignment' | 'comment';
  message: string;
  created_by: string;
}

// Get all tickets
export const getAllTickets = async (): Promise<DjangoTicket[]> => {
  try {
    const response = await api.get('/tickets/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tickets', error);
    throw error;
  }
};

// Get ticket by id
export const getTicketById = async (id: string): Promise<DjangoTicket> => {
  try {
    const response = await api.get(`/tickets/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ticket with ID: ${id}`, error);
    throw error;
  }
};

// Create a new ticket
export const createTicket = async (ticketData: CreateTicketDto): Promise<DjangoTicket> => {
  try {
    const response = await api.post('/tickets/', ticketData);
    return response.data;
  } catch (error) {
    console.error('Failed to create ticket', error);
    throw error;
  }
};

// Update a ticket
export const updateTicket = async (id: string, updateData: UpdateTicketDto): Promise<DjangoTicket> => {
  try {
    const response = await api.patch(`/tickets/${id}/`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update ticket with ID: ${id}`, error);
    throw error;
  }
};

// Get activities for a ticket
export const getTicketActivities = async (ticketId: string): Promise<DjangoActivity[]> => {
  try {
    const response = await api.get(`/tickets/${ticketId}/activities/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch activities for ticket ID: ${ticketId}`, error);
    throw error;
  }
};

// Create a new activity (comment or status change)
export const createActivity = async (activityData: CreateActivityDto): Promise<DjangoActivity> => {
  try {
    const response = await api.post('/activities/', activityData);
    return response.data;
  } catch (error) {
    console.error('Failed to create activity', error);
    throw error;
  }
};

// Get tickets filtered by status, priority, or search term
export const getFilteredTickets = async (
  filters: Partial<{
    status: TicketStatus;
    priority: TicketPriority;
    search: string;
  }>
): Promise<DjangoTicket[]> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    
    const response = await api.get(`/tickets/?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch filtered tickets', error);
    throw error;
  }
};
