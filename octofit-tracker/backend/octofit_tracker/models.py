from djongo import models


class User(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    team_id = models.CharField(max_length=24, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.username


class Team(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'teams'
    
    def __str__(self):
        return self.name


class Activity(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    user_id = models.CharField(max_length=24)
    activity_type = models.CharField(max_length=100)
    duration = models.IntegerField()  # in minutes
    calories = models.IntegerField()
    distance = models.FloatField(null=True, blank=True)  # in km
    date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activities'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.activity_type} - {self.date}"


class Leaderboard(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    user_id = models.CharField(max_length=24)
    username = models.CharField(max_length=100)
    team_id = models.CharField(max_length=24, null=True, blank=True)
    team_name = models.CharField(max_length=200, null=True, blank=True)
    total_activities = models.IntegerField(default=0)
    total_calories = models.IntegerField(default=0)
    total_duration = models.IntegerField(default=0)  # in minutes
    total_distance = models.FloatField(default=0.0)  # in km
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'leaderboard'
        ordering = ['-total_calories']
    
    def __str__(self):
        return f"{self.username} - {self.total_calories} calories"


class Workout(models.Model):
    _id = models.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    activity_type = models.CharField(max_length=100)
    duration = models.IntegerField()  # in minutes
    difficulty = models.CharField(max_length=50)
    calories_estimate = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'workouts'
    
    def __str__(self):
        return self.name
