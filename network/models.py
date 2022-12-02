from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    content = models.TextField(blank=False)
    poster = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    like_count = models.IntegerField(default=0)
    timestamp = models.DateTimeField("Time posted", auto_now_add=True)
    likers =  models.ManyToManyField(User, blank=True, related_name="liked")

    def __str__(self):
        return f"{self.poster} posted {self.content}"
    
    def serialize(self):
        return {
            "id": self.id,
            "poster": self.poster,
            "content": self.content,
            "like_count": self.like_count,
            "timestamp": self.timestamp,
            "likers": self.likers
        }


class Follow(models.Model):
    follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name="following")
    followee = models.ForeignKey("User", on_delete=models.CASCADE, related_name="followers")

    def __str__(self):
        return f"{self.follower} followed {self.followee}"