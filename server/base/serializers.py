from rest_framework import serializers
from .models import Ticket, Activity
from django.contrib.auth import get_user_model

# Get the currently active user model for assignment relationship
User = get_user_model()

class ActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for Activity model that:
    - Exposes all relevant activity fields
    - Provides read-only representation of ticket activities
    - Used in nested representation within TicketSerializer
    """
    class Meta:
        model = Activity
        fields = [
            'id',          # Unique activity identifier (UUID)
            'ticket',      # Related ticket ID
            'type',        # Activity type (status_change/priority_change/assignment/comment)
            'message',     # Detailed activity description
            'created_by',  # Who performed the activity
            'created_at'   # When activity was created (auto timestamp)
        ]
        # All fields are read-only when used in nested serializer
        # since activities are created through separate endpoints


class TicketSerializer(serializers.ModelSerializer):
    """
    Main Ticket serializer that handles:
    - Ticket CRUD operations
    - Nested activity representation
    - User assignment validation
    - All field validations
    """
    # Custom field for user assignment - uses primary key for writes
    # but can be expanded to show user details in read operations
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), required=False, allow_null=True
    )
    # Nested serializer for ticket activities (read-only)
    activities = ActivitySerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'created_by_name', 'created_by_email', 'assigned_to',
            'created_at', 'updated_at', 'activities',
        ]