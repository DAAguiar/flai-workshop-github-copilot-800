from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'team_id', 'created_at']
    search_fields = ['username', 'email']
    list_filter = ['created_at']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']
    list_filter = ['created_at']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['activity_type', 'user_id', 'duration', 'calories', 'distance', 'date']
    search_fields = ['activity_type', 'user_id']
    list_filter = ['activity_type', 'date', 'created_at']
    ordering = ['-date']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['username', 'team_name', 'total_activities', 'total_calories', 'total_duration', 'total_distance']
    search_fields = ['username', 'team_name']
    list_filter = ['updated_at']
    ordering = ['-total_calories']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['name', 'activity_type', 'duration', 'difficulty', 'calories_estimate']
    search_fields = ['name', 'activity_type']
    list_filter = ['activity_type', 'difficulty', 'created_at']
