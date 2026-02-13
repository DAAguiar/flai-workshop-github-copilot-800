from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from pymongo import MongoClient
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Connect to MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        self.stdout.write(self.style.SUCCESS('Connected to MongoDB'))

        # Clear existing data
        self.stdout.write('Clearing existing data...')
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Create unique index on email field
        db.users.create_index([("email", 1)], unique=True)
        self.stdout.write(self.style.SUCCESS('Created unique index on email field'))

        # Create Teams
        teams_data = [
            {
                "_id": "team_marvel",
                "name": "Team Marvel",
                "description": "Earth's Mightiest Heroes",
                "created_at": datetime.now(),
                "members": []
            },
            {
                "_id": "team_dc",
                "name": "Team DC",
                "description": "Justice League United",
                "created_at": datetime.now(),
                "members": []
            }
        ]
        db.teams.insert_many(teams_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(teams_data)} teams'))

        # Create Users (Superheroes)
        marvel_heroes = [
            {"name": "Tony Stark", "hero_name": "Iron Man", "email": "tony.stark@marvel.com", "team": "team_marvel"},
            {"name": "Steve Rogers", "hero_name": "Captain America", "email": "steve.rogers@marvel.com", "team": "team_marvel"},
            {"name": "Natasha Romanoff", "hero_name": "Black Widow", "email": "natasha.romanoff@marvel.com", "team": "team_marvel"},
            {"name": "Bruce Banner", "hero_name": "Hulk", "email": "bruce.banner@marvel.com", "team": "team_marvel"},
            {"name": "Thor Odinson", "hero_name": "Thor", "email": "thor@marvel.com", "team": "team_marvel"},
            {"name": "Peter Parker", "hero_name": "Spider-Man", "email": "peter.parker@marvel.com", "team": "team_marvel"},
        ]

        dc_heroes = [
            {"name": "Clark Kent", "hero_name": "Superman", "email": "clark.kent@dc.com", "team": "team_dc"},
            {"name": "Bruce Wayne", "hero_name": "Batman", "email": "bruce.wayne@dc.com", "team": "team_dc"},
            {"name": "Diana Prince", "hero_name": "Wonder Woman", "email": "diana.prince@dc.com", "team": "team_dc"},
            {"name": "Barry Allen", "hero_name": "Flash", "email": "barry.allen@dc.com", "team": "team_dc"},
            {"name": "Arthur Curry", "hero_name": "Aquaman", "email": "arthur.curry@dc.com", "team": "team_dc"},
            {"name": "Hal Jordan", "hero_name": "Green Lantern", "email": "hal.jordan@dc.com", "team": "team_dc"},
        ]

        users_data = []
        user_ids = {}
        
        for hero in marvel_heroes + dc_heroes:
            user_doc = {
                "username": hero["hero_name"],  # Use hero_name as username
                "email": hero["email"],
                "password": "hashed_password_here",  # In production, use proper hashing
                "team_id": hero["team"],
                "created_at": datetime.now()
            }
            users_data.append(user_doc)

        result = db.users.insert_many(users_data)
        inserted_user_ids = result.inserted_ids
        
        # Map emails to MongoDB IDs
        for i, hero in enumerate(marvel_heroes + dc_heroes):
            user_ids[hero["email"]] = inserted_user_ids[i]

        self.stdout.write(self.style.SUCCESS(f'Created {len(users_data)} users'))

        # Update teams with member references
        marvel_member_ids = [user_ids[hero["email"]] for hero in marvel_heroes]
        dc_member_ids = [user_ids[hero["email"]] for hero in dc_heroes]

        db.teams.update_one({"_id": "team_marvel"}, {"$set": {"members": marvel_member_ids}})
        db.teams.update_one({"_id": "team_dc"}, {"$set": {"members": dc_member_ids}})

        # Create Activities
        activity_types = [
            {"type": "running", "unit": "km"},
            {"type": "cycling", "unit": "km"},
            {"type": "swimming", "unit": "laps"},
            {"type": "weightlifting", "unit": "reps"},
            {"type": "yoga", "unit": "minutes"},
            {"type": "boxing", "unit": "rounds"},
        ]

        activities_data = []
        for email, user_id in user_ids.items():
            for _ in range(random.randint(5, 15)):
                activity_type = random.choice(activity_types)
                date_offset = random.randint(0, 30)
                activity_doc = {
                    "user_id": user_id,
                    "activity_type": activity_type["type"],  # Changed from "type" to "activity_type"
                    "duration": random.randint(15, 120),  # minutes
                    "distance": random.uniform(1.0, 20.0) if activity_type["unit"] in ["km", "laps"] else None,
                    "calories": random.randint(100, 800),  # Changed from "calories_burned" to "calories"
                    "date": datetime.now() - timedelta(days=date_offset),
                    "created_at": datetime.now()
                }
                activities_data.append(activity_doc)

        db.activities.insert_many(activities_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(activities_data)} activities'))

        # Create Leaderboard entries
        leaderboard_data = []
        for email, user_id in user_ids.items():
            user_doc = db.users.find_one({"_id": user_id})
            
            # Calculate actual totals from activities
            user_activities = list(db.activities.find({"user_id": user_id}))
            total_activities = len(user_activities)
            total_calories = sum(act.get("calories", 0) for act in user_activities)
            total_duration = sum(act.get("duration", 0) for act in user_activities)
            total_distance = sum(act.get("distance", 0.0) for act in user_activities if act.get("distance"))
            
            # Get team name
            team_doc = db.teams.find_one({"_id": user_doc["team_id"]})
            team_name = team_doc["name"] if team_doc else None
            
            leaderboard_entry = {
                "user_id": user_id,
                "username": user_doc["username"],
                "team_id": user_doc["team_id"],
                "team_name": team_name,
                "total_activities": total_activities,
                "total_calories": total_calories,
                "total_duration": total_duration,
                "total_distance": total_distance,
                "updated_at": datetime.now()
            }
            leaderboard_data.append(leaderboard_entry)

        # Sort by total_calories
        leaderboard_data.sort(key=lambda x: x["total_calories"], reverse=True)

        db.leaderboard.insert_many(leaderboard_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard_data)} leaderboard entries'))

        # Create Workouts
        workouts_data = [
            {
                "name": "Superhero Strength Training",
                "description": "Build strength like a superhero",
                "difficulty": "advanced",
                "duration": 45,
                "exercises": [
                    {"name": "Push-ups", "sets": 4, "reps": 20},
                    {"name": "Pull-ups", "sets": 4, "reps": 15},
                    {"name": "Squats", "sets": 4, "reps": 25},
                ],
                "category": "strength",
                "created_at": datetime.now()
            },
            {
                "name": "Speedster Cardio Blast",
                "description": "Run like the Flash",
                "difficulty": "intermediate",
                "duration": 30,
                "exercises": [
                    {"name": "Sprint intervals", "sets": 8, "duration": "30 seconds"},
                    {"name": "Jump rope", "sets": 3, "duration": "5 minutes"},
                    {"name": "High knees", "sets": 3, "reps": 50},
                ],
                "category": "cardio",
                "created_at": datetime.now()
            },
            {
                "name": "Warrior Flexibility Flow",
                "description": "Flexibility training for warriors",
                "difficulty": "beginner",
                "duration": 25,
                "exercises": [
                    {"name": "Yoga flow", "duration": "10 minutes"},
                    {"name": "Stretching routine", "duration": "15 minutes"},
                ],
                "category": "flexibility",
                "created_at": datetime.now()
            },
            {
                "name": "Hero's Full Body Workout",
                "description": "Complete workout for all-around fitness",
                "difficulty": "advanced",
                "duration": 60,
                "exercises": [
                    {"name": "Burpees", "sets": 5, "reps": 15},
                    {"name": "Deadlifts", "sets": 4, "reps": 12},
                    {"name": "Mountain climbers", "sets": 4, "reps": 30},
                    {"name": "Plank", "sets": 3, "duration": "90 seconds"},
                ],
                "category": "full-body",
                "created_at": datetime.now()
            },
            {
                "name": "Beginner Hero Training",
                "description": "Start your superhero journey",
                "difficulty": "beginner",
                "duration": 20,
                "exercises": [
                    {"name": "Wall push-ups", "sets": 3, "reps": 10},
                    {"name": "Bodyweight squats", "sets": 3, "reps": 15},
                    {"name": "Walking", "duration": "10 minutes"},
                ],
                "category": "general",
                "created_at": datetime.now()
            },
        ]

        db.workouts.insert_many(workouts_data)
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts_data)} workouts'))

        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(self.style.SUCCESS(f'Teams: {db.teams.count_documents({})}'))
        self.stdout.write(self.style.SUCCESS(f'Users: {db.users.count_documents({})}'))
        self.stdout.write(self.style.SUCCESS(f'Activities: {db.activities.count_documents({})}'))
        self.stdout.write(self.style.SUCCESS(f'Leaderboard: {db.leaderboard.count_documents({})}'))
        self.stdout.write(self.style.SUCCESS(f'Workouts: {db.workouts.count_documents({})}'))

        client.close()
