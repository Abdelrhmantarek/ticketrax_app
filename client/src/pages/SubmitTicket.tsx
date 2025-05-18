
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '@/context/TicketContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { SendHorizontal, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';


/**
 * Form Validation Schema:
 * Defines the structure and validation rules for the ticket form
 * using Zod for type-safe validation.
 */

const ticketSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    required_error: "Please select a priority level",
  }),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

/**
 * SubmitTicket Component:
 * Handles ticket submission with form validation, animations, and error handling.
 */
const SubmitTicket: React.FC = () => {
  const navigate = useNavigate();
  const { createTicket } = useTickets();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form initialization with react-hook-form and Zod validation
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: '',
      email: '',
      title: '',
      description: '',
      priority: 'medium',
    },
  });

  /**
   * Form Submission Handler:
   * Creates a new ticket and handles success/error states.
   */
  const onSubmit = async (formData: TicketFormValues) => {
    try {
      setIsSubmitting(true);
      
      await createTicket({
        title: formData.title,
        description: formData.description,
        createdBy: {
          name: formData.name,
          email: formData.email
        },
        priority: formData.priority
      });
      
      toast({
        title: "Ticket Submitted",
        description: "Your support ticket has been created successfully."
      });
      
      // Reset form and redirect
      form.reset();
      navigate('/ticket-submitted');
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants for form elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.h1 
        className="text-3xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Submit a Support Ticket
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto shadow-lg border-opacity-50 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-primary">New Support Request</CardTitle>
            <CardDescription>
              Fill out the form below to create a new support ticket. We'll respond as soon as possible.
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 pt-6">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Abdelrhman Tarek"
                              className="focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="abdelrhman@example.com"
                              className="focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Ticket Subject</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Brief description of your issue"
                              className="focus:ring-2 focus:ring-primary/30 transition-all duration-300"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Detailed Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Please provide detailed information about your issue..."
                              rows={5}
                              className="focus:ring-2 focus:ring-primary/30 transition-all duration-300 resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Priority</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="focus:ring-2 focus:ring-primary/30 transition-all duration-300">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </motion.div>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-lg p-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    className="hover:bg-white/80 transition-all duration-300 flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="relative overflow-hidden group hover:shadow-lg transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <SendHorizontal className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <SendHorizontal className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      )}
                    </span>
                    <span className="absolute inset-0 bg-primary/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                  </Button>
                </motion.div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default SubmitTicket;
