# Capstone

The final project of CS50's Web Programming with Python and Javascript.

![logo](./imgs/logo.png)

## The Idea of this project

This project is a project managing tool. You can create projects, create tasks and assign them with other members of the project and also comment on those tasks. 

## Distinctiveness and Complexity

This is project is built with [Django](https://www.djangoproject.com/) on the backend and HTML, CSS and JavaScript on the frontend. This is a single page web application with JavaScript. Some of the pages might be built with HTML and CSS. This [idea of this project](#the-idea-of-this-project) is completely different from other projects in CS50W course and also using the knowledge that I learnt from the course. Since this is a single page application, I used urls in Django to communicate between the frontend and the backend as an API and fetch function in JavaScript to receive and send API requests.

## Project File Structure

### Before we see the file structure, here is an important note:
This is a single page appliction just like the [Mail project of CS50W](https://cs50.harvard.edu/web/2020/projects/3/mail/) There are 2 HTML files for login and signup and one HTML page for the majority of all pages in this project which is the `index.html` file.

Since I have to make the entire website mobile responsive and fit equally on all possible screens. I have to use the media queries in CSS but unfortunately media queries only work for one HTML page, and as I'm using JavaScript to switch between different pages without reloading the HTML. This means that the media queries will not apply to the new pages, and the style will not change as I want. To solve this problem, I have created different CSS files for each page, and I have written some JavaScript code to remove and add the link tags for the CSS files when I switch between pages. This way, You can have different media queries for each page, and the style will change accordingly. For some cases I have also used JavaScript to manage mobile responsive by checking the window's current inner width. 

### File Structure
- `./`
    - `Capstone/` - Contains all the initial files created by Django
    - `imgs/` - Contains the images needed for `README.md` file
    - `projects/` 
        - `static/projects`
            - `allprojects.css` - Contains the media queries for `allprojects` page
            - `createprojectform.css` - Contains the media queries for `createprojectform` page
            - `createtaskform.css` - Contains the media queries for `createtaskform` page
            - `displayprofile.css` - Contains the media queries for `displayprofile` page
            - `displayproject.css` - Contains the media queries for `displayproject` page
            - `displaytask.css` - Contains the media queries for `displaytask` page
            - `forms.css` - Contains the media queries for `login` and `signup` pages
            - `index.js` - The main JavaScript file which operates the majority of the frontend
            - `myprojects.css` - Contains the media queries for `myprojects` page
            - `style.css` - Contains all the global styling
        - `templates/projects`
            - `index.html` - The main HTML file for majority of the pages in the frontend
            - `layout.html` - Has the main layout for all the HTML pages containing the navbar, etc
            - `login.html` - The HTML file for login page
            - `signup.html` - The HTML file for signup page
        - `admin.py` - For Registering models on Django Admin
        - `models.py` - Contains all the models for this project
        - `urls.py` - Stores all the url paths for this project
        - `views.py` - Contains all the views for the urls in `urls.py`
    - `.gitignore`- Helps to let git ignore unnecessary files like cache files 
    - `README.md` - The documentation for this project
    - `requirements.txt` - All the requirements for this project to install


## How to run this application

This application can be run like any other projects of CS50W. 

1. Create a new virtual environment if needed

    - Windows
        ```
        $ python -m venv -your venv name-
        ```
    - Mac & Linux
        ```
        $ python3 -m venv -your venv name-
        ```

2. Install the dependencies

    - Windows
        ```
        $ pip install -r requirements.txt
        ```
    
    - Mac & Linux
        ```
        $ pip3 install -r requirements.txt
        ```

3. Make Migrations and Migrate to the Database

    - Windows
        ```
        $ python manage.py makemigrations projects
        $ python manage.py migrate
        ```

    - Mac & Linux
        ```
        $ python3 manage.py makemigrations projects
        $ python3 manage.py migrate
        ```
4. Run the application

    - Windows
        ```
        $ python manage.py runserver
        ```

    - Mac & Linux
        ```
        $ python3 manage.py runserver
        ```

5. Go to your browser and open this url `http://127.0.0.1:8000/` 

<br>
<br>
<br>
<br>

**This was CS50W!**