from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .models import Ticket, Activity

# Retrieve the active User model in the project, which may be a custom user model
User = get_user_model()

class SimpleAuthTests(APITestCase):
    """
    Test suite for the custom email-based authentication endpoint.
    Verifies both successful and failed login attempts.
    """
    def setUp(self):
        # Define the URL for email-token-auth based on URL name in urls.py
        self.url = reverse('email-token-auth')
        # Create a test user for authentication scenarios
        User.objects.create_user(username='u', email='u@example.com', password='p')

    def test_auth_valid(self):
        """
        Ensure that a POST with valid email/password returns HTTP 200
        and includes a 'token' in the response body.
        """
        # Perform login request with correct credentials
        response = self.client.post(
            self.url,
            {'email': 'u@example.com', 'password': 'p'},
            format='json'
        )
        # Expect HTTP 200 OK for successful authentication
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # The response should include a generated token string
        self.assertIn('token', response.data)

    def test_auth_invalid_password(self):
        """
        Ensure that invalid password returns HTTP 400 Bad Request
        without exposing sensitive details.
        """
        # Perform login with correct email but wrong password
        response = self.client.post(
            self.url,
            {'email': 'u@example.com', 'password': 'wrong'},
            format='json'
        )
        # Expect HTTP 400 BAD REQUEST for invalid credentials
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class SimpleTicketTests(APITestCase):
    """
    Test suite for TicketViewSet: creation of tickets and
    automatic logging of an initial activity record.
    """
    def setUp(self):
        # Create and authenticate a user via DRF Token for endpoints requiring auth
        self.user = User.objects.create_user(
            username='tuser', email='tuser@example.com', password='pass'
        )
        token = Token.objects.create(user=self.user)
        # Attach token to the test client headers
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        # Define the ticket list/create URL
        self.url = reverse('ticket-list')

    def test_ticket_create_and_activity(self):
        """
        Verify that posting a valid ticket payload:
        - Returns HTTP 201 CREATED
        - Actually creates a Ticket instance
        - Creates an initial Activity record linked to the ticket
        """
        # Payload must include required model fields: title, description, creator info
        data = {
            'title': 'Test',
            'description': 'Desc',
            'created_by_name': 'Name',
            'created_by_email': 'name@example.com'
        }
        # Perform POST to create a ticket
        response = self.client.post(self.url, data, format='json')
        # Check for HTTP 201 CREATED status
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Confirm exactly one Ticket was created in the database
        self.assertEqual(Ticket.objects.count(), 1)
        # Check that an Activity record was auto-created for the new ticket
        self.assertTrue(
            Activity.objects.filter(ticket__title='Test').exists()
        )

class SimpleActivityTests(APITestCase):
    """
    Test suite for ActivityViewSet: creating new activity entries
    linked to existing tickets.
    """
    def setUp(self):
        # Create and authenticate a user via DRF Token
        self.user = User.objects.create_user(
            username='auser', email='auser@example.com', password='pass'
        )
        token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        # Create a baseline ticket to attach activities to
        self.ticket = Ticket.objects.create(
            title='T2',
            description='D2',
            created_by_name='N2',
            created_by_email='n2@example.com'
        )
        # Define the activity list/create URL
        self.url = reverse('activity-list')

    def test_activity_create(self):
        """
        Verify that a valid Activity payload:
        - Returns HTTP 201 CREATED
        - Actually creates an Activity instance linked to the ticket
        """
        # Construct payload referencing the ticket's UUID
        data = {
            'ticket': self.ticket.id,
            'type': 'comment',
            'message': 'Message',
            'created_by': 'User'
        }
        # Perform POST to create the activity
        response = self.client.post(self.url, data, format='json')
        # Expect HTTP 201 CREATED on success
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Ensure exactly one Activity now exists in the DB
        self.assertEqual(Activity.objects.count(), 1)
