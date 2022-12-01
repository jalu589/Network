from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from .models import User, Post, Follow
import json
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, "network/index.html", {
        "posts": Post.objects.all().order_by("-timestamp")
    })


@login_required
def following(request):
    user = request.user

    # Get the people the current user is following
    follows = Follow.objects.filter(follower=user)
    following_posts = []
    for follow in follows:
        # Get the posts of the people
        posts = Post.objects.filter(poster=follow.followee)
        for post in posts:
            following_posts.append(post.serialize())
    
    return render(request, "network/following.html", {
        "posts": sorted(following_posts, key=lambda post: post['timestamp'], reverse=True)
    })


@csrf_exempt
@login_required
def newpost(request):
    print('post incoming')
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    user = request.user
    print(user)
    data = json.loads(request.body)
    content = data.get("content", "")
    print(content)
    obj = Post.objects.create(
        content = content,
        poster = user,
        like_count = 0
    )
    obj.save()
    return JsonResponse({"message": "Email sent successfully."}, status=201)


def user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)
    
    posts = Post.objects.filter(poster=user)
    follows = Follow.objects.filter(followee=user_id)
    followers = []
    for follow in follows:
        followers.append(follow.follower)
    
    return render(request, "network/user.html", {
        "username": user,
        "posts": posts,
        "followers": followers
    })


@csrf_exempt
@login_required
def follow(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    user = request.user
    #get post info from fetch request
    data = json.loads(request.body)
    name = data.get("followee", "")
    try:
        followee = User.objects.get(username=name)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    try:
        # If follow already exists this will unfollow
        follow = Follow.objects.get(follower=user, followee=followee)
        print('unfollowing')
        follow.delete()
        return JsonResponse({"message": "Unfollowed."}, status=201)
    except Follow.DoesNotExist:
        print('following')
        # otherwise will create new follow
        obj = Follow.objects.create(
            follower = user,
            followee = followee
        )
        obj.save()
        return JsonResponse({"message": "Followed."}, status=201)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
