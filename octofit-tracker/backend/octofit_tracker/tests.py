from django.test import TestCase
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            team_id='507f1f77bcf86cd799439011'
        )
    
    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertIsNotNone(self.user.created_at)
    
    def test_user_str(self):
        self.assertEqual(str(self.user), 'testuser')


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(
            name='Test Team',
            description='A test team'
        )
    
    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Test Team')
        self.assertEqual(self.team.description, 'A test team')
        self.assertIsNotNone(self.team.created_at)
    
    def test_team_str(self):
        self.assertEqual(str(self.team), 'Test Team')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id='507f1f77bcf86cd799439011',
            activity_type='Running',
            duration=30,
            calories=300,
            distance=5.0,
            date=datetime.now()
        )
    
    def test_activity_creation(self):
        self.assertEqual(self.activity.activity_type, 'Running')
        self.assertEqual(self.activity.duration, 30)
        self.assertEqual(self.activity.calories, 300)
        self.assertEqual(self.activity.distance, 5.0)
    
    def test_activity_str(self):
        self.assertIn('Running', str(self.activity))


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.leaderboard = Leaderboard.objects.create(
            user_id='507f1f77bcf86cd799439011',
            username='testuser',
            team_id='507f1f77bcf86cd799439012',
            team_name='Test Team',
            total_activities=10,
            total_calories=1000,
            total_duration=300,
            total_distance=50.0
        )
    
    def test_leaderboard_creation(self):
        self.assertEqual(self.leaderboard.username, 'testuser')
        self.assertEqual(self.leaderboard.total_activities, 10)
        self.assertEqual(self.leaderboard.total_calories, 1000)
    
    def test_leaderboard_str(self):
        self.assertIn('testuser', str(self.leaderboard))
        self.assertIn('1000', str(self.leaderboard))


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Beginner Running',
            description='A simple running workout',
            activity_type='Running',
            duration=30,
            difficulty='Easy',
            calories_estimate=250
        )
    
    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Beginner Running')
        self.assertEqual(self.workout.activity_type, 'Running')
        self.assertEqual(self.workout.difficulty, 'Easy')
    
    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Beginner Running')
