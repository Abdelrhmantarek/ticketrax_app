import React, { useMemo } from 'react';
import { useTickets } from '@/context/TicketContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TicketCard from '@/components/TicketCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * Dashboard Component:
 * Displays an overview of ticket statistics with:
 * - Summary cards for key metrics
 * - Data visualizations for priority/status distribution
 * - Recently created tickets
 */
const Dashboard: React.FC = () => {
  // Access tickets from context
  const { tickets } = useTickets();

  /**
   * Calculate dashboard statistics using memoization
   * to avoid recalculating on every render unless tickets change
   */
  const stats = useMemo(() => {
    // Count tickets by status categories
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'new' || t.status === 'open').length;
    const pendingTickets = tickets.filter(t => t.status === 'pending').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
    
    // Priority distribution for bar chart
    const priorityStats = [
      { name: 'Low', value: tickets.filter(t => t.priority === 'low').length },
      { name: 'Medium', value: tickets.filter(t => t.priority === 'medium').length },
      { name: 'High', value: tickets.filter(t => t.priority === 'high').length },
      { name: 'Urgent', value: tickets.filter(t => t.priority === 'urgent').length },
    ];
    
    // Detailed status distribution for bar chart
    const statusStats = [
      { name: 'New', value: tickets.filter(t => t.status === 'new').length },
      { name: 'Open', value: tickets.filter(t => t.status === 'open').length },
      { name: 'Pending', value: tickets.filter(t => t.status === 'pending').length },
      { name: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length },
      { name: 'Closed', value: tickets.filter(t => t.status === 'closed').length },
    ];
    
    return {
      totalTickets,
      openTickets,
      pendingTickets,
      resolvedTickets,
      priorityStats,
      statusStats
    };
  }, [tickets]);

  /**
   * Get 5 most recent tickets, sorted by creation date
   */
  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [tickets]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Overview of ticket activity and status</p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tickets Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTickets}</div>
          </CardContent>
        </Card>
        
        {/* Open Tickets Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.openTickets}</div>
          </CardContent>
        </Card>
        
        {/* Pending Tickets Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{stats.pendingTickets}</div>
          </CardContent>
        </Card>
        
        {/* Resolved Tickets Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{stats.resolvedTickets}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart Section - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
            <CardDescription>Distribution of tickets by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.priorityStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" /> {/* Blue bar */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Status Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Status</CardTitle>
            <CardDescription>Distribution of tickets by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.statusStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" /> {/* Indigo bar */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Tickets Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
          <CardDescription>The most recently submitted tickets</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTickets.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentTickets.map(ticket => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  isAdmin={true}  // Shows admin controls
                />
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No tickets submitted yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;