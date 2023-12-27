from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from .models import *
import json
# Create your views here.

def index(request):
    # Render index.html
    return render(request, 'projects/index.html')


def all_projects(request):
    if request.method == 'GET': 
        # Get all projects
        all_projects = Project.objects.all()
        # Order them 
        all_projects = all_projects.order_by("-timestamp").all()
        # Serialize all of the projects
        all_projects = [project.serialize() for project in all_projects]

        return JsonResponse(all_projects, safe=False)


def get_projects(request):
    if request.method == 'GET':
        # Get the user
        user = User.objects.get(username=request.user)   
        # If the user has any projects
        try:
            # Get all the projects which has the user
            projects = Project.objects.filter(members=user)
            # Order them 
            projects = projects.order_by('-timestamp').all()
            # Serialize the projects
            projects = [project.serialize() for project in projects]
        # Else
        except:
            projects = []
        
        return JsonResponse(projects, safe=False)
    

def get_user(request, id):
    # if id is 0 then it means current user
    if id == 0:
        user = str(request.user)
        user = User.objects.get(username=user)
        user = user.serialize()
        return JsonResponse(user, safe=False)
    # if not find the user by the id 
    else:
        user = User.objects.get(id=id)
        user = user.serialize()
        return JsonResponse(user, safe=False)
     
def get_project(request, id):
    # Get the project by the id
    project = Project.objects.get(pk=id)
    project = project.serialize()
    return JsonResponse(project, safe=False)


    
@csrf_exempt
def create_project(request):
    if request.method == 'POST':
        try:
            # Load the data
            data = json.loads(request.body)
            title = data.get('Title')
            description = data.get('Description')
            owner = User.objects.get(username=request.user)
            # if the title is blank, then it should be replaced with a placeholder
            if title == "":
                title = f"Untitled Project #{len(Project.objects.all()) + 1}"
            # if the description is blank, then it should be replaced with another placeholder
            if description == "":
                description = "No description provided"
            # Then create a new project and save it 
            new_project = Project(owner=owner, title=title, description=description)
            new_project.save()
            # Add the creator of the project to the members initally 
            new_project.members.add(owner)
            new_project.save()
            # Return a message indicating that the project was created
            return JsonResponse("Successfully created project", safe=False)
        except:
            # If any error, return a message indicating that some error occurred
            return JsonResponse("Unexpected Error occured", safe=False)
    
def login_view(request):
    if request.method == 'POST':
        # Get the username and password
        username = request.POST["username"]
        password = request.POST["password"]
        # Authenticate the user 
        user = authenticate(request, username=username, password=password)
        # if the user is authenticated then login the user and render the index page
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))            
        else:
            # else return a message indicating the error and render the login html page
            return render(request, "projects/login.html", {
                "error_message": "Invalid username and/or password"
            })
    else:
        return render(request, "projects/login.html")
        
def signup_view(request):
    if request.method == "POST":
        # Get the username, email, password and confirmation 
        username = request.POST["username"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        # Check if the passward and confirmation is same 
        if password != confirmation:
            # If not return with an error message saying that the passwords must match
            return render(request, "projects/signup.html", {
                "error_message": "Passwords must match"
            })
        
        else:
            # Else authenticate the user
            user = authenticate(request, username=username, password=password)
            # If the user is None then it means that the user already exists and if not we can create a new user accound 
            if user is None:
                user = User.objects.create_user(username, email, password)
                user.save()
                login(request, user)
                return HttpResponseRedirect(reverse("index"))
            else:
                return render(request, "projects/signup.html", {
                    "error_message": "User already exists"
                })


    else:
        return render(request, "projects/signup.html")

def logout_view(request):
    if request.user:
        logout(request)
        return HttpResponseRedirect(reverse("index"))


@csrf_exempt
def edit_project_title(request):
    if request.method == "POST":
        # Load the data
        data = json.loads(request.body)
        # Get the project id and title 
        project_id = int(data.get("project"))
        new_project_title = data.get('title')
        # Strip the title to remove unnecessary whitespace
        new_project_title = str(new_project_title).strip()
        # If the title is blank 
        if new_project_title == "":
            # Replace it with a placeholder 
            new_project_title = f"Untitled project #{project_id}"
        # Get the project and change the title
        project = Project.objects.get(pk=project_id)
        project.title = new_project_title
        project.save()
        return JsonResponse({
            "message": "Successfully edited project",
            "project_id": project.id,
        }, safe=False)

@csrf_exempt
def edit_project_description(request):
    if request.method == "POST":
        # load the data
        data = json.loads(request.body)
        # Get the project id and description 
        project_id = int(data.get("project"))
        new_project_description = data.get("description")
        # Strip the description to remove unnecessary whitespace 
        new_project_description = str(new_project_description).lstrip()
        # If the description is blank
        if new_project_description == "":
            # Replace it with a placeholder
            new_project_description = "No description provided"
        # Get the project and change the description
        project = Project.objects.get(pk=project_id)
        project.description = new_project_description
        project.save()
        return JsonResponse({
            "message": "Successfully edited project",
            "project_id": project.id,
        }, safe=False)
    
def all_users(request):
    # Get all the users and serialize them 
    users = User.objects.all()
    users = [user.serialize() for user in users]
    return JsonResponse(users, safe=False)

@csrf_exempt
def add_project_user(request):
    if request.method == "POST":
        # Load the data 
        data = json.loads(request.body)
        # Get the project by the project id
        project_id = int(data.get('project'))
        project = Project.objects.get(pk=project_id)
        # Get the user by the username 
        username = str(data.get('user')).strip()
        user = User.objects.get(username=username)
        # Check if the user is already in the project
        if user in project.members.all():
            # If so remove the user from the project and save
            project.members.remove(user)
            project.save()
            return JsonResponse("Successfully removed the user from the project",safe=False)
        else:
            # If not add the user to the project and save
            project.members.add(user)
            project.save()
            return JsonResponse("Successfully added the user to the project", safe=False)
        
@csrf_exempt
def delete_project(request):
    if request.method == "POST":
        # Load the data
        data = json.loads(request.body)
        # Get the project by the project id
        project_id = int(data.get('project'))
        project = Project.objects.get(id=project_id)
        # If the current user is the owner of the project
        if project.owner == request.user:
            # Check if the delete is true  
            if data.get('delete') is True:
                # Delete the project
                project.delete()
                return JsonResponse("Successfully deleted the project", safe=False)
            else: 
                return JsonResponse("Failed to delete the project", safe=False)
        else:
            return JsonResponse("Failed to delete the project", safe=False)

@csrf_exempt          
def create_task(request):
    if request.method == "POST":
        # Load the data
        data = json.loads(request.body)
        # Get the project id and the task details 
        project_id = int(data.get("project_id"))
        task_title = data.get("task_title")
        task_description = data.get("task_description")
        task_assigned_members = data.get("task_assigned_members")
        # Strip the task_title to remove unnecessary whitespace
        task_title = str(task_title).strip()
        # If the task_title is blank
        if task_title == "":
            # Replace the task_title with a placeholder
            task_title = f"Untitled Task #{len(Task.objects.all()) + 1}"
        # Strip the task_description to remove unnecessary whitespace
        task_description = str(task_description).lstrip()
        # If the task_description is blank
        if task_description == "":
            # Replace the task_description with a placeholder
            task_description = "No description provided"
        # Get the project and create a task
        project = Project.objects.get(pk=project_id)
        creator = User.objects.get(username=request.user.username)
        new_task = Task(creator=creator, project=project, title=task_title, description=task_description)
        new_task.save()
        for member in task_assigned_members:
            member = User.objects.get(username=member)
            new_task.assigned.add(member)
        new_task.save()
        return JsonResponse({
            "message": "Successfully created a new task",
            "task_id": int(new_task.id)
        }, safe=False)

def get_task(request, id):
    task = Task.objects.get(pk=id)
    task = task.serialize()
    return JsonResponse(task, safe=False)

@csrf_exempt
def edit_task_title(request):
    if request.method == "POST":
        # Load the data
        data = json.loads(request.body)
        # Get the task id and new_task_title 
        task_id = int(data.get("taskID"))
        new_task_title = data.get("title")
        # Strip the new_task_title to remove unnecessary whitespace
        new_task_title = str(new_task_title).strip()
        # If the new_task_title is blank
        if new_task_title == "":
            # Replace it with a placeholder
            new_task_title = f"Untitled task #{task_id}"
        # Get the task and change the title
        task = Task.objects.get(pk=task_id)
        task.title = new_task_title
        task.save()
        return JsonResponse({
            "message": "Successfully edited task",
            "task_id": task.id, 
        }, safe=False)
    

@csrf_exempt
def edit_task_description(request):
    if request.method == "POST":
        # Load the data
        data = json.loads(request.body)
        # Get the task id and new_task_description
        task_id = int(data.get("taskID"))
        new_task_description = data.get("description")
        # Strip the new_task_description to remove unnecessary whitespace
        new_task_description = str(new_task_description).lstrip()
        # If the new_task_description is blank
        if new_task_description == "":
            # Replace it with a placeholder
            new_task_description = "No description provided"
        # Get the task and change the description
        task = Task.objects.get(pk=task_id)
        task.description = new_task_description
        task.save()
        return JsonResponse({
            "message": "Successfully edited task",
            "task_id": task.id, 
        }, safe=False)
    
@csrf_exempt
def create_comment(request):
    if request.method == "POST":
        # Load the data
        data = json.loads(request.body)
        # Get the task id and comment content
        task_id = int(data.get('taskID'))
        content = data.get('content')
        # Get the task and create a new comment and save
        task = Task.objects.get(pk=task_id)
        new_comment = Comment(author=request.user, task=task, content=content)
        new_comment.save()
        return JsonResponse({
            'message': "Successfully created a comment",
            'comment': new_comment.serialize(),
        })
    
    
@csrf_exempt
def delete_task(request):
    if request.method == 'POST':
        # Load the data
        data = json.loads(request.body)
        task_id = int(data.get('task'))
        # Get the task by the task id
        task = Task.objects.get(pk=task_id)
        # Check if the current user is the creator of the task
        if task.creator == request.user:
            # Check if the delete is true
            if bool(data.get('delete')) is True:
                # Delete the task
                task.delete()
                return JsonResponse({
                    "message": "Successfully deleted the task",
                    "project_id": task.project.id
                })
            else:
                return JsonResponse({
                    "message": "Failed to delete the task",
                    "project_id": task.project.id
                })
        else:
            return JsonResponse({
                "message": "Failed to delete the task",
                "project_id": task.project.id
            })

        
@csrf_exempt
def assign_task_member(request):
    if request.method == 'POST':
        # Load the data
        data = json.loads(request.body)
        # Get the task id and username
        task_id = int(data.get('task'))
        username = str(data.get('user')).strip()
        # Get the task by the task id
        task = Task.objects.get(pk=task_id)
        # Get the user by the username
        user = User.objects.get(username=username)
        # If the user is already assigned to the task
        if user in task.assigned.all():
            # Unassign the user from the task and save
            task.assigned.remove(user)
            task.save()
            return JsonResponse({
                "message": "Successfully removed the member from the task"
            })
        else: 
            # Assign the user to the task and save
            task.assigned.add(user)
            task.save()
            return JsonResponse({
                "message": "Successfully assigned the member to the task"
            }, safe=False)


@csrf_exempt 
def edit_user_info(request):
    if request.method == "POST":
        # Load the data
        data = json.loads(request.body)
        # Check if the current user's id and the userID are same
        if int(data.get("userID")) == int(request.user.id): 
            # Get the user with the current user's username  
            user = User.objects.get(username=request.user.username)
            # Get the new_usernamme and new_bio and strip them 
            new_username = str(data.get("newUsername")).strip()
            new_bio = str(data.get("newBio")).lstrip()
            # If the new_username or the new_bio are blank, then replace them with placeholders
            if new_username == "": new_username = user.username
            if new_bio == "": new_bio = "No bio provided"
            # Then change accordingly and save
            user.username = new_username
            user.description = new_bio
            user.save()
            return JsonResponse("Successfully edited the user's username and profile", safe=False)