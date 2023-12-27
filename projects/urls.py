from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get_projects", views.get_projects, name="get_projects"),
    path("all_projects", views.all_projects, name="all_projects"),
    path("all_users", views.all_users, name="all_users"),
    path("get_user/<int:id>", views.get_user, name="get_user"),
    path("get_project/<int:id>", views.get_project, name="get_project"),
    path("get_task/<int:id>", views.get_task, name="get_task"),
    path("create_project", views.create_project, name="create_project"),
    path("delete_project", views.delete_project, name="delete_project"),
    path("edit_project_title", views.edit_project_title, name="edit_project_title"),
    path("edit_project_description", views.edit_project_description, name="edit_project_description"),
    path("edit_task_title", views.edit_task_title, name="edit_task_title"),
    path("edit_task_description", views.edit_task_description, name="edit_task_description"),
    path("add_project_user", views.add_project_user, name="add_project_user"),
    path("create_task", views.create_task, name="create_task"),
    path("delete_task", views.delete_task, name="delete_task"),
    path("assign_task_member", views.assign_task_member, name="assign_task_member"),
    path("create_comment", views.create_comment, name="create_comment"),
    path("edit_user_info", views.edit_user_info, name="edit_user_info"),
    path("login", views.login_view, name="login_view"),
    path("logout", views.logout_view, name="logout_view"),
    path("signup", views.signup_view, name="signup_view"),

]

