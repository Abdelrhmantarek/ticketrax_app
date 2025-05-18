from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, ActivityViewSet

# Initialize a DefaultRouter instance
# This automatically generates URL patterns for ViewSets
router = DefaultRouter()

# Register ViewSets with the router:
# - First argument is the URL prefix (e.g., 'tickets/')
# - Second argument is the ViewSet class
# - basename provides the base for URL names (optional but recommended)
router.register(
    r'tickets',          # URL prefix for ticket endpoints
    TicketViewSet,       # Associated ViewSet
    basename='ticket'    # Base name for URL reversing
)

router.register(
    r'activities',       # URL prefix for activity endpoints
    ActivityViewSet,     # Associated ViewSet
    basename='activity'  # Base name for URL reversing
)

# The complete URL patterns for the API

urlpatterns = [
    # Include all router-generated URLs under the root path
    # This automatically creates standard CRUD endpoints for each ViewSet:
    # - GET /tickets/ - List all tickets
    # - POST /tickets/ - Create new ticket
    # - GET /tickets/<id>/ - Retrieve specific ticket
    # - PUT/PATCH /tickets/<id>/ - Update ticket
    # - DELETE /tickets/<id>/ - Delete ticket
    # Plus any custom actions defined in the ViewSets
    path('', include(router.urls)),
]

# Additional notes about generated URLs:
# - The TicketViewSet's custom 'activities' action will be available at:
#   GET /tickets/<id>/activities/
# - All endpoints follow RESTful conventions
# - Authentication requirements are handled by the ViewSets
# - URL patterns are version-agnostic (versioning would be added at project level)