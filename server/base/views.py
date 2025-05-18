from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ticket, Activity
from .serializers import TicketSerializer, ActivitySerializer
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

# Get the currently active user model
User = get_user_model()

class EmailAuthToken(APIView):
    """
    Custom authentication view that:
    - Authenticates users via email/password (instead of default username)
    - Returns a DRF token and user details upon successful auth
    - Handles various error cases with appropriate responses
    """
    permission_classes = []  # Allow unauthenticated access

    def post(self, request, *args, **kwargs):
        """
        Handle POST requests for user authentication
        Expected payload:
        {
            "email": "",
            "password": ""
        }
        """
        email = request.data.get('email')
        password = request.data.get('password')
        # Validate required fields
        if not email or not password:
            return Response({'detail': 'Email and password required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Case-insensitive email lookup
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid credentials.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Verify password
        user = authenticate(request, username=user.username, password=password)
        if not user:
            return Response({'detail': 'Invalid credentials.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Get or create DRF token
        token, _ = Token.objects.get_or_create(user=user)

        # Return token and user details
        return Response({
            'token': token.key,
            'user': {
                'id': user.pk,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })
    
    
class TicketViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Ticket model that handles:
    - CRUD operations for support tickets
    - Custom permission logic
    - Automatic activity logging on creation
    - Nested activities endpoint
    """
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    lookup_field = 'id'

    def get_permissions(self):
        """
        Custom permission handling:
        - Allow anyone to create tickets (public submission)
        - Require authentication for other write operations
        - Allow read-only access for unauthenticated users
        """
        if self.action == 'create':
            return [AllowAny()]
        # but for list/detail/update/delete, require at least read‑only for unauthenticated
        return [IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        """
        Custom ticket creation logic:
        - Save the ticket
        - Create initial activity record
        """
        ticket = serializer.save()
        # record initial creation activity
        Activity.objects.create(
            ticket=ticket,
            type='comment',
            message='Ticket created',
            created_by=serializer.validated_data.get('created_by_name')
        )

    @action(detail=True, methods=['get'])
    def activities(self, request, id=None):
        """
        Custom endpoint to retrieve activities for a specific ticket
        GET /api/tickets/{id}/activities/
        Returns chronological list of activities
        """
        ticket = self.get_object()
        qs = ticket.activities.all().order_by('created_at')
        serializer = ActivitySerializer(qs, many=True)
        return Response(serializer.data)

class ActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Activity model that:
    - Provides read-only list/detail views of activities
    - Allows creation of new activities
    - Restricts to GET/POST methods only
    """
    queryset = Activity.objects.all().order_by('created_at')
    serializer_class = ActivitySerializer
    http_method_names = ['get', 'post']