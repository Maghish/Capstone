# Capstone

The final project of CS50's Web Programming with Python and Javascript.

![logo](./imgs/logo.png)

## Distinctiveness and Complexity

Capstone presents a small-scale project management application that allows users to create projects, assign tasks to various project participants, and leave comments on those tasks to build understanding and communication amongst project participants. 

Since this project is also a single-page application, I created it using the DOM method of JavaScript. This project follows the same tech stack as the other CS50W projects, using Django for the backend and JavaScript for the frontend along with a few Bootstrap components. While also being responsive, this project makes sure to fit on all available displays.

This project differs from all the previous CS50W course assignments, and I applied the knowledge I learnt through out the course. I firmly feel that my project is unique from others since it is a project management tool, which is a unique concept from previous CS50W projects, and because I created this application using a variety of my own methods to make it responsive.

There are 2 HTML files for login and signup and `index.html` is the main HTML file of this single page application. This is the true complexity of this project as I have to ensure that the entire website is mobile-responsive and displays properly on all types of screens. I have to use CSS's media queries, but unfortunately, they are limited to one HTML page. Fortunately, I can navigate between pages using JavaScript without having to reload the HTML. This implies that the new pages will not be covered by the media queries, and the style will not be altered as I would like. In order to get around this issue, I made separate CSS files for every page and wrote some JavaScript code that updates the CSS files' link tags when I navigate between them. You can use different media queries in this manner, and the style will adjust for each page. In certain situations, I have additionally checked the window's current inner width using JavaScript to control mobile responsiveness.

## All the files that I created

### imgs/

Contains all the images for `README.md` file.

### projects/static/projects/style.css

Global stylesheet for all pages of the application.

### projects/static/projects/index.js 

This is the main JavaScript file for making this application a single page application. This file contains multiple functions to display certain things for each page everytime and also fetch or push requests to the backend (Django). This file is the vital part of this application as it also manages the stylesheets for each page as discussed previously in [Distinctiveness and Complexity](#distinctiveness-and-complexity).  

### projects/static/projects/

As previously mentioned in [Distinctiveness and Complexity](#distinctiveness-and-complexity), the CSS files in this directory (except `style.css` and `index.js`) contain specific media queries for each page. Because the application is single-page, it switches between pages without reloading the HTML, so new pages are not covered by the media queries, and the style is not changed as I would like. For this reason, I attempted a different strategy: I made separate CSS files for every page. Then, in JavaScript, if a page changes, the CSS stylesheet for that page is appended to the HTML page, and the other CSS files are removed (apart from the `style.css`).

### projects/templates/projects/index.html

This is the main HTML file of the single page application that leverages `layout.html` template for the displaying the navbar. Further, it links to `index.js` which displays the exact state of our single page application based on the current event, in-turn populating the components dynamically.

### projects/templates/projects/layout.html

The main HTML template for all HTML pages which contains components like the navbar to be displayed on every page of this application.

### projects/templates/projects/login.html

The HTML page for logging in the user by displaying forms and sending PUSH requests to the backend (Django) to login the user.

### projects/templates/projects/signup.html

The HTML page for signing up new user by displaying forms and sending PUSH requests to the backend (Django) to register the new user. 

### .gitignore

Contains files and directories to be ignored while committing changes.

### README.md

Contains the documentation and description of this project. 

### requirements.txt

Contains all the dependencies required for this project.

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

**This was CS50W!**