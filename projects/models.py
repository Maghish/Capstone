from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    description = models.CharField(max_length=3000, default="No bio provided")
    created_at = models.DateTimeField(default=timezone.now)

    def serialize(self):
        return {
            "id": int(self.id),
            "username": self.username,
            "email": self.email,
            "description": self.description,
            "projects": [project.serialize() for project in Project.objects.order_by("-timestamp").all() if project.members.filter(id=self.id).exists()],
            "created_at": self.created_at.strftime('%b %d %Y, %I:%M %p'),
        }


class Project(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owner")
    title = models.CharField(max_length=30, null=False, default="Project")
    description = models.TextField(blank=True)
    members = models.ManyToManyField(User, related_name="members", blank=True)    
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"#{self.id} Project named {self.title} has been created by {self.owner} at {self.timestamp.strftime('%b %d %Y, %I:%M %p')}"
    
    def serialize(self):
        return {
            "id": int(self.id),
            "owner": self.owner.username,
            "title": self.title,
            "description": self.description,
            "members": list(self.members.values()),
            "tasks": [task.serialize() for task in Task.objects.filter(project=self).order_by("-timestamp")],            
            "timestamp": self.timestamp.strftime('%b %d %Y, %I:%M %p'),
        }

class Task(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="creator")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project")
    title = models.CharField(max_length=255, default="New Task")
    description = models.TextField(blank=True)
    assigned = models.ManyToManyField(User, related_name="assigned", blank=True)
    timestamp = models.DateTimeField(default=timezone.now)


    def __str__(self):
        return f"{self.title} created by {self.creator} at {self.timestamp}"

    def serialize(self):
        return {
            "id": int(self.id),
            "title": self.title,
            "creator": self.creator.username,
            "project": self.project.title,
            "description": self.description,
            "assigned": list(self.assigned.values()),
            "comments": [comment.serialize() for comment in Comment.objects.filter(task=self).order_by("-timestamp")],
            "timestamp": self.timestamp.strftime('%b %d %Y, %I:%M %p'),
        }
    
class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="author")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="task")
    content = models.TextField(blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'#{self.id} Comment written by {self.author} on "{self.task.title}" task at {self.timestamp}'
    
    def serialize(self):
        return {
            "id": int(self.id),
            "author": self.author.username,
            "task": self.task.title,
            "content": self.content,
            
            "timestamp": self.timestamp.strftime('%b %d %Y, %I:%M %p')
        }
