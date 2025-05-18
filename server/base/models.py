from django.db import models

# Create your models here.
from django.contrib.auth import get_user_model
import uuid

# Get the currently active user model for assignment relationship
User = get_user_model()

class Ticket(models.Model):
    """
    Ticket model representing a support ticket with:
    - Status tracking (new, open, pending, resolved, closed)
    - Priority levels (low, medium, high, urgent)
    - Creator information
    - Assignment capability
    - Automatic timestamp tracking
    """

    # Status choices for ticket lifecycle
    STATUS_CHOICES = [
        ('new', 'New'), # Ticket just created
        ('open', 'Open'), # Ticket in progress
        ('pending', 'Pending'), # Waiting on customer
        ('resolved', 'Resolved'), # Issue solved
        ('closed', 'Closed'), # Ticket completed
    ]
    # Priority levels for triage
    PRIORITY_CHOICES = [
        ('low', 'Low'), # Minor issue
        ('medium', 'Medium'), # Normal priority
        ('high', 'High'), # Significant impact
        ('urgent', 'Urgent'), # Critical problem
    ]

    # Primary key using UUID for security and distributed systems
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Ticket title/summary (limited to 200 chars)
    title = models.CharField(max_length=200)
    # Detailed description of the issue
    description = models.TextField()
    # Current status with default 'new'
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    # Priority level with default 'medium'
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    # Creator information (captured at creation)
    created_by_name = models.CharField(max_length=100) # User's name
    created_by_email = models.EmailField() # User's email

    # Optional assignment to staff user (can be null)
    assigned_to = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL) # Preserve ticket if user deleted
    # Automatic timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        """String representation for admin/dashboard displays"""
        return f"{self.title} ({self.status})"

class Activity(models.Model):
    """
    Activity model for tracking all ticket modifications including:
    - Status changes
    - Priority updates
    - Assignments
    - Comments
    Acts as an audit log for ticket history.
    """

    # Activity type choices
    TYPE_CHOICES = [
        ('status_change', 'Status Change'), # Ticket status modified
        ('priority_change', 'Priority Change'), # Priority level changed
        ('assignment', 'Assignment'), # Ticket reassigned
        ('comment', 'Comment'), # Internal notes added
    ]

    # Primary key using UUID
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Parent ticket relationship (CASCADE delete if ticket is deleted)
    ticket = models.ForeignKey(Ticket, related_name='activities', on_delete=models.CASCADE)
    # Type of activity from predefined choices
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    # Detailed message/comment about the activity
    message = models.TextField()
    # Who performed the activity (stored as string)
    created_by = models.CharField(max_length=100)
    # Automatic creation timestamp
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """String representation showing activity type and ticket"""
        return f"Activity {self.type} on {self.ticket}"