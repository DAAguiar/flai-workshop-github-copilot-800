from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    team_name = serializers.SerializerMethodField()
    date_joined = serializers.DateTimeField(source='created_at', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'password', 'team_id', 'team_name', 'created_at', 'date_joined']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            '_id': {'read_only': True}
        }
    
    def get_team_name(self, obj):
        if obj.team_id:
            try:
                team = Team.objects.get(_id=obj.team_id)
                return team.name
            except Team.DoesNotExist:
                return None
        return None
    
    def update(self, instance, validated_data):
        # Only update password if it's provided
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = password
        instance.save()
        return instance


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', '_id', 'name', 'description', 'created_at', 'members_count']
        extra_kwargs = {
            '_id': {'read_only': True}
        }
    
    def get_members_count(self, obj):
        # Count users that have this team_id
        return User.objects.filter(team_id=str(obj._id)).count()


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    user = serializers.CharField(source='user_id', required=True)
    user_name = serializers.SerializerMethodField()
    calories_burned = serializers.IntegerField(source='calories')
    
    class Meta:
        model = Activity
        fields = ['id', '_id', 'user', 'user_id', 'user_name', 'activity_type', 'duration', 
                  'calories', 'calories_burned', 'distance', 'date', 'created_at']
        extra_kwargs = {
            '_id': {'read_only': True},
            'user_id': {'write_only': True}
        }
    
    def get_user_name(self, obj):
        try:
            user = User.objects.get(_id=obj.user_id)
            return user.username
        except User.DoesNotExist:
            return None


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    user = serializers.CharField(source='user_id', read_only=True)
    user_name = serializers.CharField(source='username', read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = ['id', '_id', 'user', 'user_id', 'user_name', 'username', 'team_id', 'team_name', 
                  'total_activities', 'total_calories', 'total_duration', 
                  'total_distance', 'updated_at']
        extra_kwargs = {
            '_id': {'read_only': True}
        }


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    
    class Meta:
        model = Workout
        fields = ['id', '_id', 'name', 'description', 'activity_type', 'duration', 
                  'difficulty', 'calories_estimate', 'created_at']
        extra_kwargs = {
            '_id': {'read_only': True}
        }
