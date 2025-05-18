
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTickets, TicketStatus, TicketPriority } from '@/context/TicketContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import TicketStatusBadge from '@/components/TicketStatusBadge';
import TicketPriorityBadge from '@/components/TicketPriorityBadge';
import { ArrowLeft, Mail, Clock } from 'lucide-react';
import { getTicketActivities } from '@/services/ticketService';

// Define the Activity type for local use
type Activity = {
  id: string;
  ticketId: string;
  type: string;
  message: string;
  createdBy: string;
  createdAt: string;
};

/**
 * TicketDetail Component:
 * Displays comprehensive ticket information with:
 * - Ticket details and metadata
 * - Status/priority management controls
 * - Activity log and commenting system
 * - Requester information
 */

const TicketDetail: React.FC = () => {
  // Routing and Context Hooks
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    getTicketById, 
    updateTicket, 
    addActivity,
    getActivitiesByTicketId 
  } = useTickets();
  
  // State Management
  const ticket = getTicketById(id || '');
  // const activities = getActivitiesByTicketId(id || '');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [status, setStatus] = useState<TicketStatus>(ticket?.status || 'new');
  const [priority, setPriority] = useState<TicketPriority>(ticket?.priority || 'medium');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
  if (!id) return;
  setLoadingActivities(true);
  getTicketActivities(id)
    .then(raw => {
      // map raw DjangoActivity into your local shape if needed
      setActivities(raw.map(a => ({
        id: a.id,
        ticketId: a.ticket,
        type: a.type,
        message: a.message,
        createdBy: a.created_by,
        createdAt: a.created_at,
      })));
    })
    .catch(console.error)
    .finally(() => setLoadingActivities(false));
}, [id]);

  /**
   * Gets display name for the current user
   * @returns string - Formatted name or "System" if no user
   */
  const getUserDisplayName = () => {
    if (!user) return 'System';
    return user.first_name ? `${user.first_name} ${user.last_name}` : user.username;
  };

  // Handle missing ticket scenario
  if (!ticket) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Ticket Not Found</h1>
        <p className="text-gray-500 mb-6">The ticket you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/admin/tickets">Return to Tickets</Link>
        </Button>
      </div>
    );
  }

  /**
   * Handles ticket status updates
   * @param value - New status value
   */
  const handleStatusChange = async (value: TicketStatus) => {
    if (value === status) return;
    
    try {
      setIsSubmitting(true);
      const oldStatus = status;
      setStatus(value);
      
      await updateTicket(ticket.id, { status: value });
      
      const created = await addActivity({
        ticketId: ticket.id,
        type: 'status_change',
        message: `Status changed from ${oldStatus} to ${value}`,
        createdBy: getUserDisplayName(),
      });
      // immediately show it
      setActivities(prev => [...prev, created]);
      
      toast({
        title: "Status Updated",
        description: `Ticket status changed to ${value}`
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update ticket status",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles ticket priority updates
   * @param value - New priority value
   */
  const handlePriorityChange = async (value: TicketPriority) => {
    if (value === priority) return;
    
    try {
      setIsSubmitting(true);
      const oldPriority = priority;
      setPriority(value);
      
      await updateTicket(ticket.id, { priority: value });
      
      const created = await addActivity({
        ticketId: ticket.id,
        type: 'priority_change',
        message: `Priority changed from ${oldPriority} to ${value}`,
        createdBy: getUserDisplayName(),
      });
      setActivities(prev => [...prev , created]);
      
      toast({
        title: "Priority Updated",
        description: `Ticket priority changed to ${value}`
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update ticket priority",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Adds a new comment to the ticket
   */
  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      setIsSubmitting(true);
      
      // POST & get back the new activity
      const created = await addActivity({
        ticketId: ticket.id,
        type: 'comment',
        message: comment,
        createdBy: getUserDisplayName(),
      });
      // prepend into state
      setActivities(prev => [...prev, created]);

      setComment('');
      
      toast({
        title: "Comment Added",
        description: "Your comment has been added to the ticket"
      });
    } catch (error) {
      toast({
        title: "Failed to Add Comment",
        description: "There was an error adding your comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  /**
   * Formats date string for display
   * @param dateString - ISO date string
   * @returns Formatted local date string or fallback text
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/tickets')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </Button>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold">Ticket #{ticket.id.substring(0, 8)}</h1>
        <p className="text-gray-500">{ticket.title}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{ticket.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 my-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Created: {formatDate(ticket.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{ticket.createdBy.email}</span>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-line">
                  {ticket.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <TicketStatusBadge status={ticket.status} />
                <TicketPriorityBadge priority={ticket.priority} />
              </div>
            </CardContent>
          </Card>
          
          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>History of all activity on this ticket</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingActivities ? (
                <p>Loading…</p>
              ) : activities.length ? (
                activities.map(act => (
                  <div key={act.id} className="pb-4 border-b last:border-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{act.createdBy}</span>
                      <span className="text-gray-500">{formatDate(act.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{act.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">No activity recorded yet.</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Separator />
              <div className="w-full">
                <Textarea
                  placeholder="Add a comment..."
                  className="mb-2"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button 
                  onClick={handleAddComment}
                  disabled={!comment.trim() || isSubmitting}
                >
                  Add Comment
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Actions Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={(value) => handleStatusChange(value as TicketStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priority} onValueChange={(value) => handlePriorityChange(value as TicketPriority)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Requester</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">{ticket.createdBy.name}</div>
                <div className="text-sm text-gray-500">{ticket.createdBy.email}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
