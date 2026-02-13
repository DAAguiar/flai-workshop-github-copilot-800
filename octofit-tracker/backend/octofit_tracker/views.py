from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Team, Activity, Leaderboard, Workout
from .serializers import (
    UserSerializer, TeamSerializer, ActivitySerializer,
    LeaderboardSerializer, WorkoutSerializer
)


@api_view(['GET'])
def api_root(request, format=None):
    """
    API root endpoint that provides links to all available endpoints.
    """
    base_url = request.build_absolute_uri('/api/')
    return Response({
        'message': 'Welcome to the OctoFit Tracker API',
        'endpoints': {
            'users': f'{base_url}users/',
            'teams': f'{base_url}teams/',
            'activities': f'{base_url}activities/',
            'leaderboard': f'{base_url}leaderboard/',
            'workouts': f'{base_url}workouts/',
        }
    })


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for User CRUD operations.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class TeamViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Team CRUD operations.
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Activity CRUD operations.
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class LeaderboardViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Leaderboard CRUD operations.
    """
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Workout CRUD operations.
    """
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
