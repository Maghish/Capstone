/*
An Overview of all functions in this file.

displayAllProjects - This function displays all projects (this is the home page you can get when you're loged in)
displayCreateProjectForm - This function displays a page for creating a new project (you can visit this page by clicking the "Create Project" button in the navbar)
createProject - This function creates a new project by sending POST request to the backend with all the details (i.e. Project Name, Project Description) and display the displayAllProjects page at the last
displayProject - This function takes project id as input and display the project with the given project id, you can edit the project name, description and invite other users to the project if you are the owner of this project (you can visit this page by clicking any of the projects in displayAllProjects page) 
displayUserProjects - This function displays all the projects of the current user (you can visit this page by clicking the "my projects" link on the navbar)
displayUserProfile - This function displays the profile of the given argument user id, it also shows what projects that the displaying user is working on and if the current user and the displaying user are the same then the user can edit their username and bio. (you can visit your profile by clicking "Profile" link on the navbar or you can also visit other's profile by clicking any of the links in other pages)
displayTask - This function takes task id as input and displays the task with the given task id, you can edit the task name, description and assign other members from the project to this task if you are the creator of this task. (you can visit this page by going to your desired project and clicking your desired task and it will display this page) 
displayCreateTaskForm - This function displays a page for creating a new task (you can visit this page by going to your desired project and hovering over the plus button near the tasks title and click it)
displayEditProjectTitle - This function creates an input field and when enter key is clicked or if the user clicks out of the input filed, it edits the title of the project by sending POST request to the backend with the new title and display the project page at the last
displayEditProjectDescription - This function creates an input field and when enter key is clicked or if the user clicks out of the input filed, it edits the description of the project by sending POST request to the backend with the new description and display the project page at the last
displayEditTaskTitle - This function creates an input field and when enter key is clicked or if the user clicks out of the input filed, it edits the title of the task by sending POST request to the backend with the new task and display the task page at the last
displayEditTaskDescription - This function creates an input field and when enter key is clicked or if the user clicks out of the input filed, it edits the description of the task by sending POST request to the backend with the new description and display the task page at the last
displayInviteMemberBox - This function displays a search box in which you can search any user and invite them to the project and once the user closes this search box then this function will add all the users that the current user selected to the project 
createNewTask - This function creates a new task by sending POST request to the backend with the task title, description and members to assign and this function takes project id as input
assignTaskToMember - This function displays a search box in which you can search any member of the project that the task is created on and assign them to the task and once the user closes this search box then this function will add all the users that the current user selected to the task 
createComment - This function creates a new comment by sending POST request to the backend with the comment content and this function takes task id as input
displayAssignMemberBox - This function displays a search box in which you can search any member of the project that the task is created on and assign them to the task and once the user closes this search box then this function will add all the users that the current user selected to the task 
*/ 



// When DOM content loaded 
document.addEventListener("DOMContentLoaded", () => {
    // Add event listeners 
    document.querySelector(".create-pro-btn").addEventListener("click", () => displayCreateProjectForm()) 
    document.querySelector("#my-projects-nav-link").addEventListener("click", () => displayUserProjects())
    document.querySelector("#profile-nav-link").addEventListener("click", () => displayUserProfile(0))
    // Initially load the displayAllProjects page
    displayAllProjects();    
})


function displayAllProjects () {
    // Clear the content of the page
    document.querySelector(".all-projects-div").innerHTML = "";
    // Fetch data 
    fetch("/all_projects")
    .then(response => response.json())
    .then((result) => {
        
        // Assign the result as allProjects
        const allProjects = result;

        // Create an outer div
        const outerDiv = document.createElement("div");
        outerDiv.className = "display-all-projects-outer-div";
        outerDiv.style.padding = "50px"

        // Create the title element 
        const h2Element = document.createElement("h2");
        h2Element.innerHTML = "All Projects";
        h2Element.style.textAlign = "center";
        h2Element.style.marginTop = "-10px";
        h2Element.style.paddingBottom = "10px";
        h2Element.style.fontFamily = "Franklin Gothic Medium";
        outerDiv.append(h2Element);
        
        // Create a div to store all projects
        const allProjectsDiv = document.createElement("div");
        allProjectsDiv.className = "display-all-projects-div";
        // If there are more then one project 
        if (allProjects.length > 0) {
            // For each project in allProjects
            allProjects.forEach(project => {
                // Create the project element and add it to the allProjectsDiv   
                const projectDiv = document.createElement("div");
                projectDiv.className = "card";
                const projectBodyDiv = document.createElement("div");
                projectBodyDiv.className = "card-body"; 
                projectBodyDiv.id = project.id;
                projectBodyDiv.innerHTML =  `<h5>${project.title}</h5>
                                            <p class="card-text">${project.description}</p>
                                            <div class="card-footer" style="display: flex; justify-content: space-between;">
                                                <p style="align-self: flex-start; margin-bottom: -10px"><i class="fa-solid fa-users"></i> ${project.members.length}</p>
                                                <p style="align-self: flex-end; margin-bottom: -10px;">Created by <a class="user-profile-link" href="#">${project.owner}</a></p>
                                            </div>
                                            `
                projectBodyDiv.querySelector(".user-profile-link").addEventListener("click", (event) => {
                    event.stopPropagation();
                    // Fetch, and go through all users, and display the user's profile whose username matches the contents of user-profile-link
                    fetch("all_users")
                    .then(response => response.json())
                    .then((allUsers) => {
                        allUsers.forEach((user) => {
                            if (user.username === projectBodyDiv.querySelector(".user-profile-link").textContent) {
                                displayUserProfile(user.id);
                            }

                            else {}
                        })
                    })
                })

                // Add an event listener to the project div when clicked
                projectBodyDiv.addEventListener("click", () => displayProject(project.id));
                projectDiv.append(projectBodyDiv);
                allProjectsDiv.append(projectDiv);
            })

            outerDiv.append(allProjectsDiv);
        }   
        
        else {
            // Create an alert box indicating that there are no projects created yet
            const alertBox = document.createElement("div");
            alertBox.className = "alert-box";
            alertBox.style.marginTop = "50px";
            alertBox.innerHTML = "No Projects Found";
            outerDiv.append(alertBox);
        }

        document.querySelector(".all-projects-div").append(outerDiv);

        // Remove all the possible link tags 
        const head  = document.getElementsByTagName('head')[0];
        try { let link = document.querySelector(`link[href="/static/projects/allprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/myprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayproject.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displaytask.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createprojectform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createtaskform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayprofile.css"]`); head.removeChild(link);} catch (e) {}
        
        // Add a new link tag to the stylesheet of this page
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = "/static/projects/allprojects.css";
        head.appendChild(link);
    })
}


function displayCreateProjectForm () {
    // Clear the content of the page
    document.querySelector(".all-projects-div").innerHTML = "";
    // Hide the create-pro-btn button
    document.querySelector(".create-pro-btn").style.display = "none";

    // Create the outer div
    const outerDiv = document.createElement("div");
    outerDiv.className = "create-project-form-outer-div";
    outerDiv.style.padding = "50px"

    // Create the title element 
    const h2Element = document.createElement("h2");
    h2Element.innerHTML = "Create a new project";
    h2Element.style.textAlign = "center";
    h2Element.style.marginTop = "-10px";
    h2Element.style.paddingBottom = "10px"
    h2Element.style.fontFamily = "Franklin Gothic Medium"
    outerDiv.append(h2Element);
    
    // Create the forms and button to save
    const formDiv = document.createElement("div");
    formDiv.className = "form-group-div";
    formDiv.style.alignItems = "center";

    const projectTitleTextArea = document.createElement("input");
    projectTitleTextArea.type = "text";
    projectTitleTextArea.placeholder = "Enter Project's Name";
    projectTitleTextArea.className = "form-cls";
    projectTitleTextArea.id = "projectTitleTextArea";
    projectTitleTextArea.style.width = "500px";
    projectTitleTextArea.style.marginBottom = "15px";
    
    const projectDescriptionTextArea = document.createElement("textarea");
    projectDescriptionTextArea.placeholder = "Enter Project's Description";
    projectDescriptionTextArea.className = "form-cls";
    projectDescriptionTextArea.id = "projectDescriptionTextArea";
    projectDescriptionTextArea.style.width = "500px";
    projectDescriptionTextArea.style.height = "300px";

    const createBtn = document.createElement("button");
    createBtn.className = "btn";
    createBtn.id = "createBtn";
    createBtn.innerHTML = "Create";
    createBtn.addEventListener("click", () => createProject());
    createBtn.style.margin = "auto";
    createBtn.style.marginTop = "10px"

    formDiv.append(projectTitleTextArea);
    formDiv.append(projectDescriptionTextArea);
    formDiv.append(createBtn);

    outerDiv.append(formDiv);
    document.querySelector(".all-projects-div").append(outerDiv);

    // Remove all possible link tags
    const head  = document.getElementsByTagName('head')[0];
    try { let link = document.querySelector(`link[href="/static/projects/allprojects.css"]`); head.removeChild(link);} catch (e) {}
    try { let link = document.querySelector(`link[href="/static/projects/myprojects.css"]`); head.removeChild(link);} catch (e) {}
    try { let link = document.querySelector(`link[href="/static/projects/displayproject.css"]`); head.removeChild(link);} catch (e) {}
    try { let link = document.querySelector(`link[href="/static/projects/displaytask.css"]`); head.removeChild(link);} catch (e) {}
    try { let link = document.querySelector(`link[href="/static/projects/createprojectform.css"]`); head.removeChild(link);} catch (e) {}
    try { let link = document.querySelector(`link[href="/static/projects/createtaskform.css"]`); head.removeChild(link);} catch (e) {}
    try { let link = document.querySelector(`link[href="/static/projects/displayprofile.css"]`); head.removeChild(link);} catch (e) {}
    
    // Add a new link tag to the stylesheet of this page
    let link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = "/static/projects/createprojectform.css";
    head.appendChild(link);
}


function createProject() {
    // Get the project title and project description 
    const projectTitle = document.querySelector("#projectTitleTextArea").value
    const projectDescription = document.querySelector("#projectDescriptionTextArea").value
    // Clear the content of the page
    document.querySelector(".all-projects-div").innerHTML = "";
    // Send a POST request with the project title and description
    fetch("/create_project", {
        method: "POST",
        body: JSON.stringify({
            Title: projectTitle,
            Description: projectDescription,
        })
    })
    .then(response => response.json())
    .then((result) => {
        // Show the create-pro-btn button 
        document.querySelector(".create-pro-btn").style.display = "block";
        // Display the displayAllProjects page
        displayAllProjects();
        // Console log out the response from the POST request sent 
        console.log(result);
    }) 
}   


function displayProject(projectID) {
    // Clear the content of the page
    document.querySelector(".all-projects-div").innerHTML = "";
    
    // Fetch data
    fetch(`/get_project/${projectID}`)
    .then(response => response.json())
    .then(result => {
        
        // Create an outer div
        const outerDiv = document.createElement('div');
        outerDiv.className = "display-project-div";
        outerDiv.style.padding = "50px";
        
        // Create the title and subtitle 
        const headerDiv = document.createElement('div');

        const projectTitleDiv = document.createElement('div');
        projectTitleDiv.className = 'project-title-div';

        const projectTitle = document.createElement('h2');
        projectTitle.innerHTML = result.title;
        projectTitle.style.textAlign = "center";
        projectTitle.style.marginTop = "5px";
        projectTitle.style.fontFamily = "Franklin Gothic Medium";
        projectTitleDiv.append(projectTitle);
   
        // Fetch the current user and check if the project this function displaying's owner is the current user and if so create a button to edit the displaying project's title 
        fetch("/get_user/0")
        .then(response => response.json())
        .then(currentUser => {
             if(currentUser.username === result.owner) {
                const projectTitleBtn = document.createElement("button");
                projectTitleBtn.className = "edit-pro-title-btn";
                projectTitleBtn.style.display = "none";
                projectTitleBtn.addEventListener("click", () => displayEditProjectTitle(projectID));
                projectTitleBtn.innerHTML = `<i class="fa-solid fa-pencil" style="color: white;"></i>`
                projectTitleDiv.append(projectTitleBtn);

                projectTitleDiv.onmouseover = () => {
                    projectTitle.style.paddingLeft = '32px';
                    projectTitleBtn.style.display = 'block'; 
                    projectTitleBtn.style.outline = 'none';
                }
                projectTitleDiv.onmouseout = () => {
                    projectTitle.style.paddingLeft = '0px';
                    projectTitleBtn.style.display = 'none'; 
                    projectTitleBtn.style.outline = 'none';
                }
             }
        })
        
   
        headerDiv.append(projectTitleDiv);

    
        const projectSubTitle = document.createElement('p');
        projectSubTitle.innerHTML = `Created by <a class="user-profile-link" href="#">${result.owner}</a>`
        projectSubTitle.style.textAlign = "center";
        projectSubTitle.style.margin = "auto";
        projectSubTitle.style.marginBottom = "30px"
        projectSubTitle.style.fontFamily = "Franklin Gothic Medium"; 
        projectSubTitle.querySelector(".user-profile-link").addEventListener("click", (event) => {
            event.stopPropagation();
            fetch("all_users")
            .then(response => response.json())
            .then((allUsers) => {
                allUsers.forEach((user) => {
                    if (user.username === projectSubTitle.querySelector(".user-profile-link").textContent) {
                        displayUserProfile(user.id);
                    }

                    else {}
                })
            })
        })
        headerDiv.append(projectSubTitle);

        outerDiv.append(headerDiv);


        // Create the body div
        const bodyDiv = document.createElement("div");
        bodyDiv.className = "project-body-div";

        // Create three children for the body div, content div, divider div, sidebar div

        // Create the content div 
        const contentDiv = document.createElement("div");
        contentDiv.className = "project-content-div";

        // Create all the tasks in this project 
        const descHead = document.createElement("div");
        descHead.className = "desc-head-div";

        const descHeadTextDiv = document.createElement("div");
        descHeadTextDiv.className = "desc-head-text-div";

        const descHeadText = document.createElement("h4");
        descHeadText.style.fontFamily = "Franklin Gothic Medium";
        descHeadText.innerHTML = "Description: ";
        descHeadTextDiv.append(descHeadText);

        // Fetch the current user and check if the project this function displaying's owner is the current user and if so create a button to edit the displaying project's description
        fetch("/get_user/0")
        .then(response => response.json())
        .then(currentUser => {
             if(currentUser.username === result.owner) {
                const descHeadBtn = document.createElement("button");
                descHeadBtn.className = "edit-pro-desc-btn";
                descHeadBtn.style.display = "none";
                descHeadBtn.addEventListener("click", () => displayEditProjectDescription(projectID));
                descHeadBtn.innerHTML = `<i class="fa-solid fa-pencil" style="color: white;"></i>`;
                descHeadTextDiv.append(descHeadBtn);

                descHeadTextDiv.onmouseover = () => {
                    descHeadBtn.style.display = "block";
                    descHeadBtn.style.outline = "none";
                } 

                descHeadTextDiv.onmouseout = () => {
                    descHeadBtn.style.display = "none";
                    descHeadBtn.style.outline = "none";
                }
             }
        })
        
        

        descHead.append(descHeadTextDiv);


        const descHeadDescText = document.createElement("p");
        descHeadDescText.innerHTML = result.description;
        descHead.append(descHeadDescText);


        contentDiv.append(descHead);
        
        
        const contentDivider = document.createElement("hr");
        contentDivider.className = "project-content-hr";
        contentDiv.append(contentDivider);

        const taskHead = document.createElement("div");
        taskHead.className = "task-head";
        const taskHeadText = document.createElement("h4");
        taskHeadText.style.fontFamily = "Franklin Gothic Medium";
        taskHeadText.innerHTML = "Tasks: ";
        taskHead.append(taskHeadText);
        
        
        // Fetch the current user and check if the current user is a member of the displaying project and if so create a button to create a task in the displaying project
        fetch("/get_user/0")
        .then(response => response.json())
        .then(currentUser => {
            if (currentUser.username === result.owner || result.members.some(member => member.username === currentUser.username)) {
                const addTaskBtn = document.createElement("button");
                addTaskBtn.className = "add-task-btn";
                addTaskBtn.style.display = "none";
                addTaskBtn.addEventListener("click", () => displayCreateTaskForm(result.id));
                addTaskBtn.innerHTML = `<i class="fa-solid fa-plus plus-icon" style="color: white;"></i>`;
                taskHead.append(addTaskBtn);

                taskHead.onmouseover = () => {
                    addTaskBtn.style.display = 'block';
                    addTaskBtn.style.outline = 'none';
                }
                taskHead.onmouseout = () => {
                    addTaskBtn.style.display = 'none'; 
                    addTaskBtn.style.outline = 'none';
                } 
             }
        })
        

        contentDiv.append(taskHead)
        

        const allTasksDiv = document.createElement("div");
        allTasksDiv.className = "all-tasks-div";

        // Display all the tasks in this project 
        if (result.tasks.length > 0) {
            result.tasks.forEach(task => {
            const taskBodyDiv = document.createElement("div");
            taskBodyDiv.className = "task-body-div";
            taskBodyDiv.innerHTML = `<p class="task-title">${task.title}</p>
                                     <p class="task-subtitle">Created by <a class="user-profile-link" href="#">${task.creator}</a> at ${task.timestamp}</p>`
            taskBodyDiv.querySelector(".user-profile-link").addEventListener("click", (event) => {
                event.stopPropagation();
                fetch("all_users")
                .then(response => response.json())
                .then((allUsers) => {
                    allUsers.forEach((user) => {
                        if (user.username === taskBodyDiv.querySelector(".user-profile-link").textContent) {
                            displayUserProfile(user.id);
                        }

                        else {}
                    })
                })
            })
            taskBodyDiv.addEventListener('click', () => displayTask(task.id));
            allTasksDiv.append(taskBodyDiv);
            });
        }

        else {
            // Create an alert box indicating that no tasks found in this project
            const alertBox = document.createElement('div');
            alertBox.className = 'alert-box';
            alertBox.innerHTML = "No Tasks Found";
            allTasksDiv.append(alertBox);
        }
        
        contentDiv.append(allTasksDiv);
        
        // Fetch the current user and check if the current user is the owner of the displaying project and if so create a button which enables the user to delete the whole project
        fetch("/get_user/0")
        .then(response => response.json())
        .then(currentUser => {
            if (currentUser.username === result.owner) {
                const contentDivider2 = document.createElement('hr');
                contentDivider2.className = "project-content-hr";
                contentDiv.append(contentDivider2);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = "project-delete-btn";
                deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete Project`;
                deleteBtn.addEventListener("click", () => {
                    fetch('/delete_project', {
                        method: "POST", 
                        body: JSON.stringify({
                            project: projectID,
                            delete: true
                        })
                    })
                    .then(response => response.json())
                    .then((result) => {
                        console.log(result);
                        displayAllProjects();
                    })
                })
                contentDiv.append(deleteBtn);    
                
                // Run the responsive function again after adding the delete button to make it responsive accordingly
                responsiveFunction();
            }
        })
        
        bodyDiv.append(contentDiv);

        // Create the divider div 
        const divider = document.createElement("div");
        divider.className = "display-project-body-divider";
        divider.innerHTML = "<div style='border-left: 1px solid rgb(26, 25, 25); height: 100%;'></div>";
        bodyDiv.append(divider);

        // Create the sidebar div 
        const sideBarDiv = document.createElement("div");
        sideBarDiv.className = "project-sidebar-div";
        
        const sideBarHeadDiv = document.createElement('div');
        sideBarHeadDiv.className = "side-bar-head-div";

        const sideBarHeadTitle = document.createElement("p");
        sideBarHeadTitle.innerHTML = "Members"
        sideBarHeadTitle.style.fontFamily = 'Franklin Gothic Medium';
        sideBarHeadTitle.style.padding = "3px";
        sideBarHeadTitle.style.fontSize = "18px";
        sideBarHeadDiv.append(sideBarHeadTitle);

        // Fetch the current user and check if the current user is the owner of the displaying project and if so create a button to display a box to invite other users
        fetch("/get_user/0")
        .then(response => response.json())
        .then(currentUser => {
             if(currentUser.username === result.owner) {

                const sideBarHeadBtn = document.createElement("button");
                sideBarHeadBtn.className = "side-bar-head-btn";
                sideBarHeadBtn.style.display = "none";
                sideBarHeadBtn.addEventListener("click", () => displayInviteMemberBox(result));
                sideBarHeadBtn.innerHTML = `<i class="fa-solid fa-plus plus-icon" style="color: white;"></i>`;
                sideBarHeadDiv.append(sideBarHeadBtn);

                
                sideBarHeadDiv.onmouseover = () => {
                    sideBarHeadBtn.style.display = "block";
                    sideBarHeadBtn.style.outline = "none";
                }

                sideBarHeadDiv.onmouseout = () => {
                    sideBarHeadBtn.style.display = "none";
                    sideBarHeadBtn.style.outline = "none";
                }
             }
        })
        

        sideBarDiv.append(sideBarHeadDiv);

        const ulElement = document.createElement("ul");
        ulElement.className = "project-sidebar-members-ul";
        result.members.forEach(member => {
            const liElement = document.createElement("li");
            liElement.innerHTML = member.username;
            liElement.className = "li-profile-link";
            liElement.addEventListener("click", () => {
                fetch("all_users")
                .then(response => response.json())
                .then((allUsers) => {
                    allUsers.forEach((user) => {
                        if (user.username === liElement.textContent) {
                            displayUserProfile(user.id);
                        }

                        else {}
                    })
                })
            })
            liElement.style.marginLeft = "-20px";
            liElement.style.marginBottom = "-3px";
            ulElement.append(liElement);
        })
        sideBarDiv.append(ulElement);   
        
        bodyDiv.append(sideBarDiv);
    

        outerDiv.append(bodyDiv);

        document.querySelector(".all-projects-div").append(outerDiv);
        
        // Remove all possible link tags
        const head  = document.getElementsByTagName('head')[0];
        try { let link = document.querySelector(`link[href="/static/projects/allprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/myprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayproject.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displaytask.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createprojectform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createtaskform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayprofile.css"]`); head.removeChild(link);} catch (e) {}
        
        // Add a new link tag to the stylesheet of this page
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = "/static/projects/displayproject.css";
        head.appendChild(link);
        
        // Create the function to manage breakpoints
        function responsiveFunction() {
            if (window.innerWidth <= 1350 && window.innerWidth >= 1096) {
                try {
                    document.querySelector(".project-sidebar-div").removeChild(document.querySelector(".clone-button"))
                    document.querySelector(".project-delete-btn").style.display = "block";
                }

                catch (error) {}
            }

            else if (window.innerWidth <= 1095) {
                try {
                    try {
                        document.querySelector(".project-sidebar-div").removeChild(document.querySelector(".clone-button"))
                        document.querySelector(".project-delete-btn").style.display = "block";
                    }

                    catch (error) {}
                    
                    try {
                        const deleteBtn = document.querySelector(".project-content-div").querySelector(".project-delete-btn");
                        deleteBtn.style.display = "none";
                        const cloneBtn = deleteBtn.cloneNode(true);
                        cloneBtn.style.display = "block";
                        cloneBtn.style.marginTop = "50px";
                        cloneBtn.classList.add("clone-button");
                        cloneBtn.addEventListener("click", () => {
                            fetch('/delete_project', {
                                method: "POST", 
                                body: JSON.stringify({
                                    project: projectID,
                                    delete: true
                                })
                            })
                            .then(response => response.json())
                            .then((result) => {
                                console.log(result);
                                displayAllProjects();
                            })
                        })

                        document.querySelector(".project-sidebar-div").append(cloneBtn);
                    }

                    catch (error) {}
                    
                }

                catch (error) {}
            }


            else {
                try {
                    try {
                        document.querySelector(".project-sidebar-div").removeChild(document.querySelector(".clone-button"))
                        document.querySelector(".project-delete-btn").style.display = "block";
                    }

                    catch (error) {}
                }

                catch (error) {}  
            }
        }

        // Try to remove the function from the window if the window already has an event listener
        // This is to prevent duplicate event listeners 
        try {
            window.removeEventListener("resize", responsiveFunction);
        }
        catch(error) {}
        
        // Add the function to the window 
        window.addEventListener("resize", responsiveFunction);
        
        // Run the function 
        responsiveFunction();
    })
}


function displayUserProjects() {
    // Clear the content of the page
    document.querySelector(".all-projects-div").innerHTML = "";
    
    // Fetch the current user
    fetch("/get_user/0")
    .then(response => response.json())
    .then(result => {
        // Assign allProjects with the projects where the current user is being a member or the owner
        const allProjects = result.projects;

        // Create an outer div
        const outerDiv = document.createElement("div");
        outerDiv.className = "display-user-projects-outer-div";
        outerDiv.style.padding = "50px";

        // Create the title element 
        const h2Element = document.createElement("h2");
        h2Element.innerHTML = "Your Projects";
        h2Element.style.textAlign = "center";
        h2Element.style.marginTop = "-10px";
        h2Element.style.paddingBottom = "10px";
        h2Element.style.fontFamily = "Franklin Gothic Medium";
        outerDiv.append(h2Element);

        // Create a div to store all the projects
        const allProjectsDiv = document.createElement("div");
        allProjectsDiv.className = "display-user-projects-div";
        // If there are more then one project 
        if (allProjects.length > 0) {
            // For each project in all projects
            allProjects.forEach(project => {
                // Create the project element and add it to the allProjectsDiv   
                const projectDiv = document.createElement("div");
                projectDiv.className = "card";
                const projectBodyDiv = document.createElement("div");
                projectBodyDiv.className = "card-body";
                projectBodyDiv.id = project.id;
                projectBodyDiv.innerHTML = `<h5>${project.title}</h5>
                                            <p class="card-text">${project.description}</p>
                                            <div class="card-footer" style="display: flex; justify-content: space-between;">
                                                <p style="align-self: flex-start; margin-bottom: -10px"><i class="fa-solid fa-users"></i> ${project.members.length}</p>
                                                <p style="align-self: flex-end; margin-bottom: -10px;">Created by <a class="user-profile-link" href="#">${project.owner}</a></p>
                                            </div>`
                projectBodyDiv.querySelector(".user-profile-link").addEventListener("click", (event) => {
                    event.stopPropagation();
                    // Fetch, and go through all users, and display the user's profile whose username matches the contents of user-profile-link
                    fetch("all_users")
                    .then(response => response.json())
                    .then((allUsers) => {
                        allUsers.forEach((user) => {
                            if (user.username === projectBodyDiv.querySelector(".user-profile-link").textContent) {
                                displayUserProfile(user.id);
                            }

                            else {}
                        })
                    })
                })
                projectBodyDiv.addEventListener("click", () => displayProject(project.id));
                projectDiv.append(projectBodyDiv);
                allProjectsDiv.append(projectDiv);
            })

            outerDiv.append(allProjectsDiv);
        }

        else {
            // Create an alert box indicating that the current user doesn't have any projects
            const alertBox = document.createElement("div");
            alertBox.className = "alert-box";
            alertBox.style.marginTop = "50px"
            alertBox.innerHTML = "You don't have any projects! <a href='#' onclick='displayCreateProjectForm()'>Create a new project</a>"
            outerDiv.append(alertBox);
        }

        document.querySelector(".all-projects-div").append(outerDiv);

        // Remove all possible link tags
        const head  = document.getElementsByTagName('head')[0];
        try { let link = document.querySelector(`link[href="/static/projects/allprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/myprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayproject.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displaytask.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createprojectform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createtaskform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayprofile.css"]`); head.removeChild(link);} catch (e) {}
        
        // Add a new link tag to the stylesheet of this page
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = "/static/projects/myprojects.css";
        head.appendChild(link);
    })
}


function displayUserProfile(userID) {
    // Clear the content of the page
    document.querySelector(".all-projects-div").innerHTML = "";
    
    // Fetch the user with the given argument user id
    fetch(`get_user/${userID}`)
    .then(response => response.json())
    .then(user => {
        // Create an outer div
        const outerDiv = document.createElement("div");
        outerDiv.className = "display-user-profile-outer-div";

        // Create the title and subtitle elements
        const titleElementDiv = document.createElement("div");
        titleElementDiv.className = "display-user-profile-title-element-div";
        const titleElement = document.createElement("h2");
        titleElement.innerHTML = user.username;
        titleElementDiv.append(titleElement);
        const subTitleElement = document.createElement("p");
        subTitleElement.style.fontSize = "14px";
        subTitleElement.innerHTML = `Joined at ${user.created_at.split(",")[0]}`;
        titleElementDiv.append(subTitleElement);
        outerDiv.append(titleElementDiv);

        // Create the body div
        const bodyDiv = document.createElement("div");
        bodyDiv.className = "display-user-profile-body-div";

        const userDetailsDiv = document.createElement("div");
        userDetailsDiv.className = "display-user-profile-details-div"
        
        const bioDiv = document.createElement("div");
        bioDiv.className = "display-user-profile-bio-div";
        const bioTitleElement = document.createElement("h4");
        bioTitleElement.innerHTML = "Bio: ";
        bioTitleElement.style.fontFamily = "Franklin Gothic Medium";
        bioTitleElement.style.marginBottom = "1rem";
        bioDiv.append(bioTitleElement);
        const bioTextElement = document.createElement("div");
        bioTextElement.className = "display-user-profile-bio-text-div";
        bioTextElement.innerHTML = user.description;
        bioDiv.append(bioTextElement);
        userDetailsDiv.append(bioDiv);

        // Fetch the current user and if the displaying user is the current user then display settings tab to enable the current user to edit their username and bio
        fetch("get_user/0")
        .then(response => response.json())
        .then(currentUser => {
            if (currentUser.username === user.username) {
                const settingsTabDiv = document.createElement("div");
                const settingsTabTitleDiv = document.createElement("div");
                settingsTabTitleDiv.style.marginTop = "20px";
                settingsTabTitleDiv.innerHTML = `<div style="display: flex; flex-direction: column;">
                                                    <h4 style="font-family: 'Franklin Gothic Medium'; margin-bottom: 0px;">Settings: </h4>
                                                    <span style="font-size: 12px; color: gray;">Only visble to you  <i class="fa-solid fa-eye"></i></span>
                                                </div>`
                settingsTabDiv.append(settingsTabTitleDiv);

                const allInputsDiv = document.createElement("div");
                allInputsDiv.className = "display-user-profile-settings-all-inputs-div";
                allInputsDiv.style.display = "flex";
                allInputsDiv.style.flexDirection = "column";


                const usernameInput = document.createElement("input");
                usernameInput.placeholder = "Enter your new username";
                usernameInput.value = user.username;
                usernameInput.style.marginBottom = "10px";

                allInputsDiv.append(usernameInput);

                const bioInput = document.createElement("textarea");
                bioInput.placeholder = "Enter your bio";
                bioInput.value = user.description;
                bioInput.style.marginBottom = "10px";
                bioInput.style.height = "110px";
                
                allInputsDiv.append(bioInput);

                settingsTabDiv.append(allInputsDiv);

                const saveChangesBtn = document.createElement("button");
                saveChangesBtn.className = "btn display-user-profile-save-btn";
                saveChangesBtn.innerHTML = "Save Changes";
                saveChangesBtn.addEventListener("click", () => {
                    fetch("edit_user_info", {
                        method: "POST",
                        body: JSON.stringify({
                            userID: user.id,
                            newUsername: usernameInput.value,
                            newBio: bioInput.value,
                        })
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log(result); 
                        displayUserProfile(user.id);
                    })
                });

                settingsTabDiv.append(saveChangesBtn);

                userDetailsDiv.append(settingsTabDiv);
            }
            
        })
        
        bodyDiv.append(userDetailsDiv);

        // Create the divider 
        const bodyDivider = document.createElement("div");
        bodyDivider.className = "display-user-profile-body-divider";
        bodyDivider.innerHTML = "<div style='border-left: 1px solid rgb(25, 25, 25); height: 100%;'></div>";
        bodyDiv.append(bodyDivider);

        // Display all the projects that the displaying user is a member of or the owner
        const projectsDiv = document.createElement("div");
        projectsDiv.className = "display-user-profile-projects-div";
        
        const allProjectsTitleElementDiv = document.createElement("div");
        allProjectsTitleElementDiv.className = "display-user-profile-projects-title-element-div";
        allProjectsTitleElementDiv.style.textAlign = "center";
        allProjectsTitleElementDiv.innerHTML = `<h4 style="font-family:'Franklin Gothic Medium';">All Projects</h4>`
        allProjectsTitleElementDiv.style.marginBottom = "20px";
        projectsDiv.append(allProjectsTitleElementDiv);

        const allProjectsDiv = document.createElement("div");
        allProjectsDiv.className = "display-user-profile-all-projects-div";
        const allProjects = user.projects;
        // If the displaying user is in any of the projects
        if (allProjects.length > 0) {
            allProjects.forEach(project => {
                const projectDiv = document.createElement("div");
                projectDiv.className = "card";
                projectDiv.style.width = "400px";
                const projectBodyDiv = document.createElement("div");
                projectBodyDiv.className = "card-body";
                projectBodyDiv.id = project.id; 
                projectBodyDiv.innerHTML = `<h5>${project.title}</h5>
                                            <p class="card-text">${project.description}</p>
                                            <div style="display: flex; justify-content: space-between;">
                                                <p class="members-count" style="font-size: small; align-self: flex-start; margin-bottom: -10px"><i class="fa-solid fa-users"></i> ${project.members.length}</p>
                                                <p class="creator-mention" style="font-size: small; align-self: flex-end; margin-bottom: -10px;">Created by ${project.owner}</p>
                                            </div>`
                
                if (user.username === project.owner) {}
                else {
                    projectBodyDiv.querySelector(".creator-mention").innerHTML = `Created by <a class="user-profile-link" href="#">${project.owner}</a>`; 
                    projectBodyDiv.querySelector(".creator-mention").addEventListener("click", (event) => {
                        event.stopPropagation();
                        fetch("all_users")
                        .then(response => response.json())
                        .then((allUsers) => {
                            allUsers.forEach(member => {
                                if (member.username === projectBodyDiv.querySelector(".user-profile-link").textContent) {
                                    displayUserProfile(member.id);
                                }

                                else {}
                            })
                        })
                    })
                }                
                        
    
                projectBodyDiv.addEventListener("click", () => displayProject(project.id));
                projectDiv.append(projectBodyDiv);
                allProjectsDiv.append(projectDiv);
            })
        }

        else {
            // Create an alert box indicating that the displaying user is not in any project
            const alertBox = document.createElement("div");
            alertBox.className = "alert-box";
            alertBox.style.textAlign = "center";
            alertBox.style.width = "200px"
            alertBox.innerHTML = "No Projects Found";
            allProjectsDiv.append(alertBox); 
        }
        projectsDiv.append(allProjectsDiv);

        bodyDiv.append(projectsDiv);

        outerDiv.append(bodyDiv); 

        document.querySelector(".all-projects-div").append(outerDiv);
        
        // Remove all the possible link tags 
        const head  = document.getElementsByTagName('head')[0];
        try { let link = document.querySelector(`link[href="/static/projects/allprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/myprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayproject.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displaytask.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createprojectform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createtaskform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayprofile.css"]`); head.removeChild(link);} catch (e) {}
        
        // Add a new link tag to the stylesheet of this page
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = "/static/projects/displayprofile.css";
        head.appendChild(link);
    })
}


function displayTask(taskID) {
    // Clear the content of the page
    document.querySelector(".all-projects-div").innerHTML = "";

    // Fetch the task data
    fetch(`/get_task/${taskID}`)   
    .then(response => response.json())
    .then(result => {
        
        // Create an outer div
        const outerDiv = document.createElement("div");
        outerDiv.className = "display-task-div";
        outerDiv.style.padding = "50px";

        // Create the task title and subtitle elements
        const headerDiv = document.createElement("div");

        const taskTitleDiv = document.createElement("div");
        taskTitleDiv.className = "display-task-title-div";

        const taskTitle = document.createElement("h2");
        taskTitle.innerHTML = result.title;
        taskTitle.style.textAlign = "center";
        taskTitle.style.marginTop = "5px";
        taskTitle.style.fontFamily = "Franklin Gothic Medium";
        taskTitleDiv.append(taskTitle); 

        // Fetch the current user and if the displaying task's owner is the current user then add a buttton which enables the current user to edit the task title
        fetch("/get_user/0")
        .then(response => response.json())
        .then(currentUser => {
            if (currentUser.username === result.creator) {
                const taskTitleBtn = document.createElement("button");
                taskTitleBtn.className = "edit-task-title-btn";
                taskTitleBtn.style.display = "none";
                taskTitleBtn.addEventListener("click", () => displayEditTaskTitle(result.id));
                taskTitleBtn.innerHTML = `<i class="fa-solid fa-pencil" style="color: white;"></i>`;
                taskTitleDiv.append(taskTitleBtn);

                taskTitleDiv.onmouseover = () => {
                    taskTitle.style.paddingLeft = "32px";
                    taskTitleBtn.style.display = "block";
                    taskTitleBtn.style.outline = "none";
                }

                taskTitleDiv.onmouseout = () => {
                    taskTitle.style.paddingLeft = "0px";
                    taskTitleBtn.style.display = "none";
                    taskTitleBtn.style.outline = "none";
                }
            }
        })

        headerDiv.append(taskTitleDiv);

        const taskSubTitle = document.createElement("p");
        taskSubTitle.innerHTML = `Created by <a class="user-profile-link" href="#">${result.creator}</a>`;
        taskSubTitle.style.textAlign = "center";
        taskSubTitle.style.margin = "auto";
        taskSubTitle.style.marginBottom = "30px";
        taskSubTitle.style.fontFamily = "Franklin Gothic Medium";
        taskSubTitle.querySelector(".user-profile-link").addEventListener("click", (event) => {
            fetch("all_users")
            .then(response => response.json())
            .then(allUsers => {
                allUsers.forEach((user) => {
                    if (user.username === taskSubTitle.querySelector(".user-profile-link").textContent) {
                        displayUserProfile(user.id);
                    }
                })
            })
        })
        headerDiv.append(taskSubTitle);

        outerDiv.append(headerDiv);

        // Create the body div
        const bodyDiv = document.createElement("div");
        bodyDiv.className = "display-task-body-div";

        // Create three children for the body div, content div, divider div and sidebar div

        // Create the content div
        const contentDiv = document.createElement("div");
        contentDiv.className = "display-task-content-div";

        // Display the task description
        const descDiv = document.createElement("div");
        descDiv.className = "display-task-desc-div";

        const descHeadDiv = document.createElement("div");
        descHeadDiv.className = "display-task-desc-head-div";

        const descHeadText = document.createElement("h4");
        descHeadText.style.fontFamily = "Franklin Gothic Medium";
        descHeadText.innerHTML = "Description: ";
        descHeadDiv.append(descHeadText);

        // Fetch the current user and if the displaying task's owner is the current user then add a button which enables the current user to edit the task description
        fetch("/get_user/0")
        .then(response => response.json())
        .then(currentUser => {
            if (currentUser.username === result.creator) {
                const descHeadBtn = document.createElement("button");
                descHeadBtn.className = "edit-task-desc-btn";
                descHeadBtn.style.display = "none";
                descHeadBtn.addEventListener("click", () => displayEditTaskDescription(result.id));
                descHeadBtn.innerHTML = `<i class="fa-solid fa-pencil" style="color: white;"></i>`;
                descHeadDiv.append(descHeadBtn);

                descHeadDiv.onmouseover = () => {
                    descHeadBtn.style.display = "block";
                    descHeadBtn.style.outline = "none";
                }

                descHeadDiv.onmouseout = () => {
                    descHeadBtn.style.display = "none";
                    descHeadBtn.style.outline = "none";
                }
            }
        })

        descDiv.append(descHeadDiv);

        const descText = document.createElement("p");
        descText.innerHTML = result.description;
        descDiv.append(descText);

        contentDiv.append(descDiv);

        const contentDivider = document.createElement("hr");
        contentDivider.className = "display-task-content-hr";
        contentDiv.append(contentDivider);

        // Display all the comments 
        const commentHeadDiv = document.createElement("div");
        commentHeadDiv.className = "comment-head";
        const commentHeadText = document.createElement("h4");
        commentHeadText.style.fontFamily = "Franklin Gothic Medium";
        commentHeadText.innerHTML = "Comments: ";
        commentHeadDiv.appendChild(commentHeadText);

        contentDiv.append(commentHeadDiv);
        
        const allCommentsDiv = document.createElement("div");
        allCommentsDiv.className = "all-comments-div";

        if (result.comments.length > 0) {
            result.comments.forEach(comment => {
                const commentBodyDiv = document.createElement("div");
                commentBodyDiv.className = "comment-body-div";
                commentBodyDiv.innerHTML = `<p class="comment-content">${comment.content}</p>
                                            <p class="comment-footer">Posted by <a class="user-profile-link" href="#">${comment.author}</a> at ${comment.timestamp}`;
                commentBodyDiv.querySelector(".user-profile-link").addEventListener("click", (event) => {
                    fetch("all_users")
                    .then(response => response.json())
                    .then(allUsers => {
                        allUsers.forEach(user => {
                            if (user.username === commentBodyDiv.querySelector(".user-profile-link").textContent) {
                                displayUserProfile(user.id);
                            }

                            else {}
                        })
                    })
                })
                allCommentsDiv.append(commentBodyDiv);
            });
        }

        else {
            // If no comments, then create an alert box indicating that no comments found on this task
            const alertBox = document.createElement("div");
            alertBox.className = "alert-box";
            alertBox.innerHTML = "No Comments Found";
            allCommentsDiv.append(alertBox);
        }

        contentDiv.append(allCommentsDiv);


        const contentDivider2 = document.createElement('hr');
        contentDivider2.className = "display-task-content-hr";
        contentDiv.append(contentDivider2);

        // Create a textarea for the current user to be able to write comments
        const textAreaInputElement = document.createElement('textarea');
        textAreaInputElement.className = "create-comment-textarea";
        textAreaInputElement.placeholder = "Write a comment";
        contentDiv.append(textAreaInputElement);

        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = "flex";
        buttonsDiv.style.flexDirection = "row";
        buttonsDiv.style.justifyContent = "space-between";

        const postBtn = document.createElement('button');
        postBtn.className = "btn";
        postBtn.innerHTML = "Post";
        postBtn.style.marginTop = "5px";
        postBtn.style.marginBottom = "5px";
        postBtn.addEventListener('click', () => createComment(taskID));
        buttonsDiv.append(postBtn);

        // Fetch the current user and if the displaying task's owner is the current user then add a button which enables the current user to delete the whole task
        fetch("/get_user/0")
        .then(response => response.json())
        .then(currentUser => {
            if (currentUser.username === result.creator) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = "display-task-delete-btn";
                deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i> Delete Task`;
                deleteBtn.addEventListener("click", () => {
                    fetch('/delete_task', {
                        method: "POST", 
                        body: JSON.stringify({
                            task: taskID,
                            delete: true
                        })
                    })
                    .then(response => response.json())
                    .then((result) => {
                        console.log(result.message);
                        displayProject(result.project_id);
                    })
                })
                buttonsDiv.append(deleteBtn);

                responsiveFunction();
            }
        })

        contentDiv.append(buttonsDiv);

        bodyDiv.append(contentDiv);
        
        // Create the divider
        const divider = document.createElement("div");
        divider.className = "display-task-body-divider";
        divider.innerHTML = "<div style='border-left: 1px solid rgb(26, 25, 25); height: 100%'></div>"
        bodyDiv.append(divider);
        
        // Create the sidebar div
        const sideBarDiv = document.createElement("div");
        sideBarDiv.className = "display-task-sidebar-div";

        // Display the sidebar head
        const sideBarHeadDiv = document.createElement("div");
        sideBarHeadDiv.className = "display-task-sidebar-head-div";

        const sideBarHeadTitle = document.createElement("p");
        sideBarHeadTitle.innerHTML = "Assigned"
        sideBarHeadTitle.style.fontFamily = 'Franklin Gothic Medium';
        sideBarHeadTitle.style.padding = "3px";
        sideBarHeadTitle.style.fontSize = "18px";
        sideBarHeadDiv.append(sideBarHeadTitle);

        // Fetch the current user and if the displaying task's owner is the current user then add a button which displays a box which enables the current user to assign any of the members from the displaying task's project
        fetch("/get_user/0")
        .then(response => response.json())
        .then(currentUser => {
            if (currentUser.username === result.creator) {
                const sideBarHeadBtn = document.createElement("button");
                sideBarHeadBtn.className = "display-task-sidebar-head-btn";
                sideBarHeadBtn.style.display = "none";
                sideBarHeadBtn.addEventListener("click", () => displayAssignMemberBox(result));
                sideBarHeadBtn.innerHTML = `<i class="fa-solid fa-plus plus-icon" style="color: white;"></i>`;
                sideBarHeadDiv.append(sideBarHeadBtn);

                sideBarHeadDiv.onmouseover = () => {
                    sideBarHeadBtn.style.display = "block";
                    sideBarHeadBtn.style.outline = "none";
                }

                sideBarHeadDiv.onmouseout = () => {
                    sideBarHeadBtn.style.display = "none";
                    sideBarHeadBtn.style.outline = "none";
                }
            }
        })

        sideBarDiv.append(sideBarHeadDiv);

        // Create an ul element and create all the members of the project and set display to none initially
        const ulElement = document.createElement("ul");
        ulElement.className = "display-task-sidebar-members-ul";
        if (result.assigned.length <= 0) {ulElement.style.display = "none";}
        else {ulElement.style.display = "block";}
        fetch("all_projects")
        .then(response => response.json())
        .then(allProjects => {
            allProjects.forEach(project => {
                if (project.title === result.project) {
                    project.members.forEach(member => {
                        const liElement = document.createElement("li");
                        liElement.innerHTML = member.username;
                        liElement.className = "li-profile-link";
                        liElement.style.marginLeft = "-20px";
                        liElement.style.marginBottom = "-3px";
                        liElement.style.display = "none";
                        liElement.addEventListener("click", () => {
                            fetch("all_users")
                            .then(response => response.json())
                            .then((allUsers) => {
                                allUsers.forEach(user => {
                                    if (user.username === liElement.textContent) {
                                        displayUserProfile(user.id);
                                    }

                                    else {}
                                })
                            })
                        })
  
                        result.assigned.forEach(assignedMember => {
                            if (liElement.textContent === assignedMember.username) {
                                liElement.style.display = "list-item";
                            }
                            else {}
                        }) 
                        
                        ulElement.append(liElement);
                    });
                }
            })
        })
        
        
        sideBarDiv.append(ulElement);

        // Create the alert message indicating that no one is assigned 
        const alertMessage = document.createElement("p");
        alertMessage.innerHTML = "No one assigned";
        alertMessage.className = "display-task-alert-message";
        alertMessage.style.fontSize = "14px";
    
        // But if no one is assigned then display the alert message
        if (result.assigned.length <= 0) {
            alertMessage.style.display = "block";
        }

        // Else not
        else {alertMessage.style.display = "none";}

        sideBarDiv.append(alertMessage);

        bodyDiv.append(sideBarDiv);

        outerDiv.append(bodyDiv);

        document.querySelector(".all-projects-div").append(outerDiv);

        // Remove all the possible link tags 
        const head  = document.getElementsByTagName('head')[0];
        try { let link = document.querySelector(`link[href="/static/projects/allprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/myprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayproject.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displaytask.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createprojectform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createtaskform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayprofile.css"]`); head.removeChild(link);} catch (e) {}
        
        // Add a new link tag to the stylesheet of this page
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = "/static/projects/displaytask.css";
        head.appendChild(link);

        // Create the function to manage breakpoints 
        function responsiveFunction() {
            if (window.innerWidth <= 1095) {
                try {
                    const x = document.querySelector("#display-task-sidebar-divider");
                    x.parentElement.removeChild(x);                    
                }

                catch (error) {}

                const contentDivider = document.createElement("hr");
                contentDivider.className = "display-task-content-hr";
                contentDivider.id = "display-task-sidebar-divider";
                document.querySelector(".display-task-content-div").append(contentDivider);
                
                
                try {
                    document.querySelector(".display-task-sidebar-div").removeChild(document.querySelector(".clone-button"));
                }

                catch (error) {}

                const deleteBtn = document.querySelector(".display-task-content-div").querySelector(".display-task-delete-btn");
                deleteBtn.style.display = "none";
                const cloneBtn = deleteBtn.cloneNode(true);
                cloneBtn.style.display = "block";
                cloneBtn.style.marginTop = "50px";
                cloneBtn.style.marginLeft = "0px";
                cloneBtn.classList.add("clone-button");
                cloneBtn.addEventListener("click", () => {
                    fetch('/delete_task', {
                        method: "POST", 
                        body: JSON.stringify({
                            task: taskID,
                            delete: true
                        })
                    })
                    .then(response => response.json())
                    .then((result) => {
                        console.log(result.message);
                        displayProject(result.project_id);
                    })
                })

                document.querySelector(".display-task-sidebar-div").append(cloneBtn);
            }

            else {
                try {
                    const x = document.querySelector("#display-task-sidebar-divider");
                    x.parentElement.removeChild(x);
                }

                catch (error) {}
                
                 try {
                    document.querySelector(".display-task-sidebar-div").removeChild(document.querySelector(".clone-button"));
                    document.querySelector(".display-task-delete-btn").style.display = "block";
                }

                catch (error) {}
            }
        }

        // Try to remove the function from the window if the window already has an event listener
        // This is to prevent duplicate event listeners 
        try {
            window.removeEventListener("resize", responsiveFunction);
        }
        catch(error) {}
        
        // Add the function to the window 
        window.addEventListener("resize", responsiveFunction);
        
        // Run the function 
        responsiveFunction();
     })
}


function displayCreateTaskForm(projectID) {
    // Clear the content of the page
    document.querySelector(".all-projects-div").innerHTML = "";

    // Fetch the project data 
    fetch(`/get_project/${projectID}`) 
    .then(response => response.json())
    .then(project => {
        
        // Create an outer div
        const outerDiv = document.createElement("div");
        outerDiv.className = "display-create-task-form-div";
        outerDiv.style.padding = "50px";

        // Create the title element 
        const h2Element = document.createElement("h2");
        h2Element.innerHTML = "Create a new task";
        h2Element.style.textAlign = "center";
        h2Element.style.fontFamily = "Franklin Gothic Medium"; 
        h2Element.style.marginBottom = "30px";
        outerDiv.append(h2Element);

        // Create a body div
        const bodyDiv = document.createElement("div");
        bodyDiv.className = "task-form-body-div";

        // Create three children for the body div, content div, divider div and sidebar div
        
        // Create the content div
        const contentDiv = document.createElement("div");
        contentDiv.className = "task-form-content-div";
    
        // Create the forms and the save button 
        const titleInput = document.createElement("input");
        titleInput.className = "task-title-input-field";
        titleInput.type = "text";
        titleInput.placeholder = "Enter the title";
        contentDiv.append(titleInput);

        const descriptionInput = document.createElement("textarea");
        descriptionInput.className = "task-desc-textarea";
        descriptionInput.placeholder = "Enter the description";
        contentDiv.append(descriptionInput);

        const saveBtnDiv = document.createElement("div");
        saveBtnDiv.className = "task-form-save-btn-div";
        saveBtnDiv.style.display = "flex";
        saveBtnDiv.style.width = "100%";

        const saveBtn = document.createElement("button");
        saveBtn.className = "btn task-form-save-btn";
        saveBtn.innerHTML = "Save";
        saveBtn.addEventListener("click", () => createNewTask(projectID));

        saveBtnDiv.append(saveBtn);

        contentDiv.append(saveBtnDiv);

        bodyDiv.append(contentDiv);

        // Create the divider div 
        const divider = document.createElement("div");
        divider.className = "task-form-divider";
        divider.innerHTML = "<div style='border-left: 1px solid rgb(26, 25, 25); height: 100%;' ></div>";
        
        bodyDiv.appendChild(divider);

        // Create the sidebar div
        const sideBarDiv = document.createElement("div");
        sideBarDiv.className = "task-form-side-bar-div";

        // Create the sidebar title and the button to display a box to assign other members to this task
        const sideBarHeadDiv = document.createElement("div");
        sideBarHeadDiv.className = "task-form-side-bar-head-div";

        const sideBarHeadTitle = document.createElement("p");
        sideBarHeadTitle.innerHTML = "Assigned";
        sideBarHeadTitle.style.fontFamily = 'Franklin Gothic Medium';
        sideBarHeadTitle.style.fontSize = "18px";
        sideBarHeadDiv.append(sideBarHeadTitle);

        const sideBarHeadBtn = document.createElement("button");
        sideBarHeadBtn.className = "task-form-side-bar-head-btn";
        sideBarHeadBtn.style.display = "none";
        sideBarHeadBtn.addEventListener("click", () => assignTaskToMember(project));
        sideBarHeadBtn.innerHTML = `<i class="fa-solid fa-plus plus-icon" style="color: white;"></i>`;
        sideBarHeadDiv.append(sideBarHeadBtn);

        sideBarHeadDiv.onmouseover = () => {
            sideBarHeadBtn.style.display = "block";
            sideBarHeadBtn.style.outline = "none";
        }

        sideBarHeadDiv.onmouseout = () => {
            sideBarHeadBtn.style.display = "none";
            sideBarHeadBtn.style.outline = "none";
        }

        sideBarDiv.append(sideBarHeadDiv);
        
        const ulElement = document.createElement("ul");
        ulElement.className = "task-form-sidebar-members-ul";
        ulElement.style.display = "none";

        project.members.forEach(member => {
            const liElement = document.createElement("li");
            liElement.innerHTML = member.username;
            liElement.style.marginLeft = "-20px";
            liElement.style.marginBottom = "-3px";
            liElement.style.display = "none";
            ulElement.append(liElement);
        })

        sideBarDiv.append(ulElement);

        // Display the alert message initially
        const alertMessage = document.createElement("p");
        alertMessage.innerHTML = "No one assigned";
        alertMessage.className = "task-form-alert-message";
        alertMessage.style.fontSize = "14px";

        sideBarDiv.append(alertMessage); 

        bodyDiv.append(sideBarDiv);
        
        outerDiv.append(bodyDiv);

        document.querySelector(".all-projects-div").append(outerDiv);

        // Remove all possible link tags
        const head  = document.getElementsByTagName('head')[0];
        try { let link = document.querySelector(`link[href="/static/projects/allprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/myprojects.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayproject.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displaytask.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createprojectform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/createtaskform.css"]`); head.removeChild(link);} catch (e) {}
        try { let link = document.querySelector(`link[href="/static/projects/displayprofile.css"]`); head.removeChild(link);} catch (e) {}
        
        // Add a new link tag to the stylesheet of this page
        let link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.href = "/static/projects/createtaskform.css";
        head.appendChild(link);
    })
}


function displayEditProjectTitle(projectID) {
    // Get the old title
    const titleElement = document.querySelector(".project-title-div").querySelector("h2");
    const editBtnElement = document.querySelector(".project-title-div").querySelector("button");
    // Get the new title
    const inputElement = document.createElement("input");
    inputElement.className = "edit-pro-title-field";
    inputElement.type = "text";
    inputElement.value = titleElement.innerHTML;
    inputElement.autofocus = true;
    // If the user clicks enter
    inputElement.onkeyup = (event) => {
        if (event.key === "Enter") {
            // Send a POST request with the given argument project id and the new title
            fetch("/edit_project_title", {
                method: "POST",
                body: JSON.stringify({
                    project: projectID,
                    title: inputElement.value,
                })
            })
            .then(response => response.json())
            .then((result) => {
                // Console log out the response from the POST request
                console.log(result.message);
                // Remove the input element
                inputElement.parentNode.removeChild(inputElement);
                // Display the project
                displayProject(result.project_id);
            })
        }
    };

    // If the user clicks away from the input field
    inputElement.onblur = (event) => {
        // Send a POST request with the given argument project id and the new title
        fetch("/edit_project_title", {
            method: "POST",
            body: JSON.stringify({
                project: projectID,
                title: inputElement.value,
            })
        })
        .then(response => response.json())
        .then((result) => {
            // Console log out the response from the POST request
            console.log(result.message);
            // Remove the input element 
            inputElement.parentNode.removeChild(inputElement);
            // Display the project
            displayProject(result.project_id);
        })
    };

    // Replace the title with new title
    document.querySelector(".project-title-div").replaceChild(inputElement, titleElement);
    document.querySelector(".project-title-div").removeChild(editBtnElement);
}
 

function displayEditProjectDescription(projectID) {
    // Get the old description
    const descText = document.querySelector(".desc-head-div").querySelector("p");
    const editBtnElement = document.querySelector(".desc-head-text-div").querySelector("button");
    // Get the new description
    const inputElement = document.createElement("input");
    inputElement.className = "edit-pro-desc-field";
    inputElement.type = "text";
    inputElement.value = descText.innerHTML;
    inputElement.autofocus = true;
    // If the user clicks enter
    inputElement.onkeyup = (event) => {
        if (event.key === "Enter") {
            // Send a POST request with the given argument project id and the new description
            fetch("/edit_project_description", {
                method: "POST",
                body: JSON.stringify({
                    project: projectID,
                    description: inputElement.value,
                })
            })
            .then(response => response.json())
            .then((result) => {
                // Console log out the response from the POST request
                console.log(result.message);
                // Remove the input element
                inputElement.parentNode.removeChild(inputElement);
                // Display the project
                displayProject(result.project_id);
            })
        }
    };

    // If the user clicks away from the input field
    inputElement.onblur = (event) => {
        // Send a POST request with the given argument project id and the new description
        fetch("/edit_project_description", {
            method: "POST",
            body: JSON.stringify({
                project: projectID,
                description: inputElement.value,
            })
        })
        .then(response => response.json())
        .then((result) => {
            // Console log out the response from the POST request
            console.log(result.message);
            // Remove the input element 
            inputElement.parentNode.removeChild(inputElement);
            // Display the project
            displayProject(result.project_id);
        })
    };

    // Replace the description with new description
    document.querySelector(".desc-head-div").replaceChild(inputElement, descText);
    document.querySelector(".desc-head-text-div").removeChild(editBtnElement);
}
    

function displayEditTaskTitle(taskID) {
    // Get the old title
    const titleElement = document.querySelector(".display-task-title-div").querySelector("h2");
    const editBtnElement = document.querySelector(".display-task-title-div").querySelector("button");
    // Get the new title
    const inputElement = document.createElement("input");
    inputElement.className = "edit-task-title-field";
    inputElement.type = "text";
    inputElement.value = titleElement.innerHTML;
    inputElement.autofocus = true;
    // If the user clicks enter
    inputElement.onkeyup = (event) => {
        if (event.key === "Enter") {
            // Send a POST request with the given argument task id and the new title
            fetch("/edit_task_title", {
                method: "POST",
                body: JSON.stringify({
                    taskID: taskID,
                    title: inputElement.value,
                })
            })
            .then(response => response.json())
            .then((result) => {
                // Console log out the response from the POST request
                console.log(result.message);
                // Remove the input element
                inputElement.parentNode.removeChild(inputElement);
                // Display the task
                displayTask(result.task_id);
            })
        }
    };

    // If the user clicks away from the input field
    inputElement.onblur = (event) => {
        // Send a POST request with the given argument task id and the new title
        fetch("/edit_task_title", {
            method: "POST",
            body: JSON.stringify({
                taskID: taskID,
                title: inputElement.value,
            })
        })
        .then(response => response.json())
        .then((result) => {
            // Console log out the response from the POST request
            console.log(result.message);
            // Remove the input element 
            inputElement.parentNode.removeChild(inputElement);
            // Display the task
            displayTask(result.task_id);
        })
    };

    // Replace the title with new title
    document.querySelector(".display-task-title-div").replaceChild(inputElement, titleElement);
    document.querySelector(".display-task-title-div").removeChild(editBtnElement);
}


function displayEditTaskDescription(taskID) {
    // Get the old description
    const descText = document.querySelector(".display-task-desc-div").querySelector("p");
    const editBtnElement = document.querySelector(".display-task-desc-head-div").querySelector("button");
    // Get the new title
    const inputElement = document.createElement("input");
    inputElement.className = "edit-task-desc-field";
    inputElement.type = "text";
    inputElement.value = descText.innerHTML;
    inputElement.autofocus = true;
    // If the user clicks enter
    inputElement.onkeyup = (event) => {
        if (event.key === "Enter") {
            // Send a POST request with the given argument task id and the new description
            fetch("/edit_task_description", {
                method: "POST",
                body: JSON.stringify({
                    taskID: taskID,
                    description: inputElement.value,
                })
            })
            .then(response => response.json())
            .then((result) => {
                // Console log out the response from the POST request
                console.log(result.message);
                // Remove the input element
                inputElement.parentNode.removeChild(inputElement);
                // Display the task
                displayTask(result.task_id);
            })
        }
    };

    // If the user clicks away from the input field
    inputElement.onblur = (event) => {
        // Send a POST request with the given argument task id and the new description
        fetch("/edit_task_description", {
            method: "POST",
            body: JSON.stringify({
                taskID: taskID,
                description: inputElement.value,
            })
        })
        .then(response => response.json())
        .then((result) => {
            // Console log out the response from the POST request
            console.log(result.message);
            // Remove the input element 
            inputElement.parentNode.removeChild(inputElement);
            // Display the task
            displayTask(result.task_id);
        })
    };

    // Replace the description with new description
    document.querySelector(".display-task-desc-div").replaceChild(inputElement, descText);
    document.querySelector(".display-task-desc-head-div").removeChild(editBtnElement);
}


function displayInviteMemberBox(project) {
    // Create the close button to close the invite member box
    const closeBtn = document.createElement("button");
    closeBtn.className = "side-bar-head-close-btn";
    closeBtn.innerHTML = `<i class="fa-solid fa-plus plus-icon" style="color: white; transform: rotate(45deg);"></i>`
    document.querySelector(".side-bar-head-div").replaceChild(closeBtn, document.querySelector(".side-bar-head-btn"));

    // Create the invite member box
    const searchBoxDiv = document.createElement("div");
    searchBoxDiv.className = "member-search-box-div pro-inv-box";

    const searchBoxBodyDiv = document.createElement("div");
    searchBoxBodyDiv.style.display = "flex";
    searchBoxBodyDiv.style.flexDirection = "column";
    searchBoxBodyDiv.style.position = "static";

    const searchBoxHeadDiv = document.createElement("div");
    searchBoxHeadDiv.className = "pro-inv-search-box-div";
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.className = "pro-inv-search-box-input";
    searchBox.placeholder = "Type or select a user"
    searchBoxHeadDiv.append(searchBox);
    const searchBoxBtn = document.createElement("button");
    searchBoxBtn.className = "pro-inv-search-box-btn";
    searchBoxBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`
    searchBoxHeadDiv.append(searchBoxBtn);

    searchBoxBodyDiv.append(searchBoxHeadDiv);

    const searchBoxContentDiv = document.createElement("div");
    searchBoxContentDiv.className = "pro-inv-search-box-content-div"; 
    
    // Fetch all users 
    fetch("/all_users")
    .then(response => response.json())
    .then(users => {
        // For each user in users
        users.forEach(user => {
            // Display the user
            const userDiv = document.createElement("div");
            userDiv.className = "pro-inv-search-box-display-user";

            // Check the user is in the project
            let t = 0;
            document.querySelector(".project-sidebar-members-ul").querySelectorAll("li").forEach(liElement => {
                if (liElement.innerHTML === user.username) {
                    t = 1;
                }
            })
            
            if (t === 1) {
                userDiv.innerHTML = `${user.username} <i class="fa-solid fa-check" style="color: white;"></i>`;
            }

            else {
                userDiv.innerHTML = `${user.username}`
            }

            searchBoxContentDiv.append(userDiv);
            // If the displaying user is the project owner
            if (project.owner === user.username) {}
            else {
                // If the user is clicked then mark the user as selected  
                userDiv.addEventListener("click", () => {
                    fetch("/add_project_user", {
                        method: "POST",
                        body: JSON.stringify({
                            project: project.id, 
                            user: userDiv.textContent,
                        })
                    })

                    try {
                        console.log(userDiv.querySelector("i").innerHTML);
                        userDiv.innerHTML = userDiv.textContent;
                    }

                    catch (error) {
                        userDiv.innerHTML = `${userDiv.textContent} <i class="fa-solid fa-check" style="color: white;"></i>` 
                    }
                })
            }   
        })
    })

    searchBoxBodyDiv.append(searchBoxContentDiv);

    // Make the search function
    searchBoxDiv.append(searchBoxBodyDiv);
    document.querySelector(".project-sidebar-div").append(searchBoxDiv);
    searchBoxBtn.addEventListener("click", () => {
        const inputText = document.querySelector(".pro-inv-search-box-input").value;
        document.querySelector(".pro-inv-search-box-content-div").querySelectorAll(".pro-inv-search-box-display-user").forEach(element => {
            if (element.textContent.includes(inputText.trim())) {
                element.style.display = "block";
            }
            else {
                element.style.display = "none";
            }
        })
    })

    // Hide the search box and add all the users which the current user selected to the project when the close button is clicked 
    closeBtn.addEventListener("click", () => {
        document.querySelector(".project-sidebar-div").removeChild(document.querySelector(".pro-inv-box"));
        const sideBarHeadBtn = document.createElement("button");
        sideBarHeadBtn.className = "side-bar-head-btn";
        sideBarHeadBtn.style.display = "none";
        
        sideBarHeadBtn.innerHTML = `<i class="fa-solid fa-plus plus-icon" style="color: white;"></i>`;

        fetch(`/get_project/${project.id}`)
        .then(response => response.json())
        .then(result => {
            sideBarHeadBtn.addEventListener("click", () => displayInviteMemberBox(result));


            const ulElement = document.createElement("ul");
            ulElement.className = "project-sidebar-members-ul";
            result.members.forEach(member => {
                const liElement = document.createElement("li");
                liElement.innerHTML = member.username;
                liElement.className = "li-profile-link";
                liElement.addEventListener("click", () => {
                    fetch("all_users")
                    .then(response => response.json())
                    .then((allUsers) => {
                        allUsers.forEach((user) => {
                            if (user.username === liElement.textContent) {
                                displayUserProfile(user.id);
                            }

                            else {}
                        })
                    })  
                })

                liElement.style.marginLeft = "-20px";
                liElement.style.marginBottom = "-3px";
                ulElement.append(liElement);
            })

            document.querySelector(".project-sidebar-div").replaceChild(ulElement, document.querySelector(".project-sidebar-members-ul"));
        })

        

        const sideBarHeadDiv = document.querySelector(".side-bar-head-div"); 
        sideBarHeadDiv.replaceChild(sideBarHeadBtn, closeBtn);

        
        sideBarHeadDiv.onmouseover = () => {
            sideBarHeadBtn.style.display = "block";
            sideBarHeadBtn.style.outline = "none";
        }

        sideBarHeadDiv.onmouseout = () => {
            sideBarHeadBtn.style.display = "none";
            sideBarHeadBtn.style.outline = "none";
        }
    })

}


function createNewTask(projectID) {
    // Get the task title and description
    const taskTitle = document.querySelector(".task-title-input-field").value;
    const taskDescription = document.querySelector(".task-desc-textarea").value;
    // Create an empty array 
    const taskAssignedMembers = [];
    // Check all the li element in task-form-sidebar-members-ul and if they're display is none then do nothing or else push the content of the element to the array
    document.querySelector(".task-form-sidebar-members-ul").querySelectorAll("li").forEach(element => {
        if (element.style.display === "none") {}
        else {taskAssignedMembers.push(element.textContent);}
    })

    // Send a POST request with the given project id, task title, task description and the task assigned members array
    fetch("/create_task", {
        method: "POST",
        body: JSON.stringify({
            project_id: projectID,
            task_title: taskTitle,
            task_description: taskDescription,
            task_assigned_members: taskAssignedMembers
        })
    })
    .then(response => response.json())
    .then(result => {
        // Then console log out the response from the POST request 
        console.log(result.message);
        // THen display the task 
        displayTask(result.task_id);
    })
}


function assignTaskToMember(project) {
    // Create the close button to close the assign member box 
    const closeBtn  = document.createElement("button");
    closeBtn.className = "task-form-side-bar-head-close-btn";
    closeBtn.innerHTML = `<i class="fa-solid fa-plus plus-icon" style="color: white; transform: rotate(45deg);"></i>`;
    document.querySelector(".task-form-side-bar-head-div").replaceChild(closeBtn, document.querySelector(".task-form-side-bar-head-btn"));

    // Create the assign member box
    const searchBoxDiv = document.createElement("div");
    searchBoxDiv.className = "member-search-box-div task-assign-box";

    const searchBoxBodyDiv = document.createElement("div");
    searchBoxBodyDiv.style.display = "flex";
    searchBoxBodyDiv.style.flexDirection = "column";
    searchBoxBodyDiv.style.position = "static";

    const searchBoxHeadDiv = document.createElement("div");
    searchBoxHeadDiv.className = "task-assign-search-box-div";
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.className = "task-assign-search-box-input";
    searchBox.placeholder = "Type or select a user";
    searchBoxHeadDiv.append(searchBox);
    const searchBoxBtn = document.createElement("button");
    searchBoxBtn.className = "task-assign-search-box-btn";
    searchBoxBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
    searchBoxHeadDiv.append(searchBoxBtn);

    searchBoxBodyDiv.append(searchBoxHeadDiv);

    const searchBoxContentDiv = document.createElement("div");
    searchBoxContentDiv.className = "task-assign-search-box-content-div";

    // Display all the members of the project
    project.members.forEach((member) => {
        const userDiv = document.createElement("div");
        userDiv.className = "task-assign-search-box-display-user";
        userDiv.innerHTML = member.username;

        // Check if the user is already assigned to the task
        let t = 0;
        document.querySelector(".task-form-sidebar-members-ul").querySelectorAll("li").forEach(element => {
            if (element.innerHTML === member.username && element.style.display === "list-item") {
                t = 1;
            }
        })

        if (t === 1) {
            userDiv.innerHTML = `${member.username} <i class="fa-solid fa-check" style="color: white;"></i>`;
        }

        else {
            userDiv.innerHTML = `${member.username}`;
        }
        // If the user is clicked then mark the user as selected
        userDiv.addEventListener("click", () => {
            const ulElement = document.querySelector(".task-form-sidebar-members-ul");
            const alertMessage = document.querySelector(".task-form-alert-message");

            let t = 0;
            ulElement.querySelectorAll("li").forEach(element => {   
                if (element.textContent === member.username) {
                    if (element.style.display === "none") {element.style.display = "list-item"; t = 1;}
                    else {element.style.display = "none";}
                }

                else {
                    if (element.style.display === "list-item") {t = 1;}
                    else {}
                }
            })

            if (t === 0) {
                ulElement.style.display = "none";
                alertMessage.style.display = "block";   
            }    

            else {
                ulElement.style.display = "block";
                alertMessage.style.display = "none";
            }

            try {
                console.log(userDiv.querySelector("i").innerHTML);
                userDiv.innerHTML = userDiv.textContent;
            }

            catch (error) {
                userDiv.innerHTML = `${userDiv.textContent} <i class="fa-solid fa-check" style="color: white;"></i>`;
            }
        })

        searchBoxContentDiv.append(userDiv);
    })
    
    // Make the search function
    searchBoxBodyDiv.append(searchBoxContentDiv);
    searchBoxDiv.append(searchBoxBodyDiv);
    document.querySelector(".task-form-side-bar-div").append(searchBoxDiv);
    searchBoxBtn.addEventListener("click", () => {
        const inputText = document.querySelector(".task-assign-search-box-input").value;
        document.querySelector(".task-assign-search-box-content-div").querySelectorAll(".task-assign-search-box-display-user").forEach(element => {
            if (element.textContent.includes(inputText.trim())) {
                element.style.display = "block";
            }

            else {
                element.style.display = "none";
            }
        })
    })

    // Hide the assign member box 
    closeBtn.addEventListener("click", () => {
        document.querySelector(".task-form-side-bar-div").removeChild(document.querySelector(".task-assign-box"));
        const sideBarHeadBtn = document.createElement("button");
        sideBarHeadBtn.className = "task-form-side-bar-head-btn";
        sideBarHeadBtn.style.display = "none";
        
        sideBarHeadBtn.innerHTML = `<i class="fa-solid fa-plus plus-icon" style="color: white;"></i>`;

        fetch(`/get_project/${project.id}`)
        .then(response => response.json())
        .then(result => {
            sideBarHeadBtn.addEventListener("click", () => assignTaskToMember(result));
        })

        const oldUlElement = document.querySelector(".task-form-sidebar-members-ul");

        if (oldUlElement.style.display === "block") {
            const newUlElement = document.createElement("ul");
            newUlElement.className = oldUlElement.className;
            newUlElement.style.display = "block";
            oldUlElement.querySelectorAll("li").forEach(element => {
                const newLiElement = document.createElement("li");
                newLiElement.innerHTML = element.textContent;
                newLiElement.style.marginLeft = "-20px";
                newLiElement.style.marginBottom = "-3px";
                newLiElement.style.display = element.style.display;
                newUlElement.append(newLiElement);
            })

            document.querySelector(".task-form-side-bar-div").replaceChild(newUlElement, oldUlElement);
        }

        else {}
    
        const sideBarHeadDiv = document.querySelector(".task-form-side-bar-head-div"); 
        sideBarHeadDiv.replaceChild(sideBarHeadBtn, closeBtn);

        
        sideBarHeadDiv.onmouseover = () => {
            sideBarHeadBtn.style.display = "block";
            sideBarHeadBtn.style.outline = "none";
        }

        sideBarHeadDiv.onmouseout = () => {
            sideBarHeadBtn.style.display = "none";
            sideBarHeadBtn.style.outline = "none";
        }
    })
}


function createComment(taskID) {
    // Get the content of the comment
    const content = document.querySelector(".create-comment-textarea").value;

    // If the content is empty, then return 
    if (content === "") {
        return 
    }

    else {
        // Send a POST request with the content and the given task id
        fetch("/create_comment", {
            method: "POST",
            body: JSON.stringify({
                taskID: taskID,
                content: content,
            })
        })
        .then(response => response.json())
        .then((result) => {
            // Console log out the response from the POST request
            console.log(result.message);

            // Clear the crete-comment-textarea
            document.querySelector(".create-comment-textarea").value = "";
            
            // Create a new comment and append it to the all comments div
            const commentBodyDiv  = document.createElement("div");
            commentBodyDiv.className = "comment-body-div";
            commentBodyDiv.innerHTML = `<p class="comment-content">${result.comment.content}</p>
                                        <p class="comment-footer">Posted by <a class="user-profile-link" href="#">${result.comment.author}</a> at ${result.comment.timestamp}`;
            commentBodyDiv.querySelector(".user-profile-link").addEventListener("click", (event) => {
                fetch("all_users")
                .then(response => response.json())
                .then(allUsers => {
                    allUsers.forEach(user => {
                        if (user.username === commentBodyDiv.querySelector(".user-profile-link").textContent) {
                            displayUserProfile(user.id);
                        }

                        else {}
                    })
                })       
            })
            if (document.querySelector(".alert-box")) {
                document.querySelector(".all-comments-div").replaceChild(commentBodyDiv, document.querySelector(".alert-box"));
            }                            

            else {
                firstChildElement = document.querySelector(".all-comments-div").firstChild;
                document.querySelector(".all-comments-div").insertBefore(commentBodyDiv, firstChildElement);
            }
        })
    }   
}


function displayAssignMemberBox(task) {
    // Create the close button to close the assign member box
    const closeBtn = document.createElement("button");
    closeBtn.className = "display-task-sidebar-head-close-btn";
    closeBtn.innerHTML = `<i class="fa-solid fa-plus plus-icon" style="color: white; transform: rotate(45deg);"></i>`
    document.querySelector(".display-task-sidebar-head-div").replaceChild(closeBtn, document.querySelector(".display-task-sidebar-head-btn"));

    // Create the assign member box
    const searchBoxDiv = document.createElement("div");
    searchBoxDiv.className = "member-search-box-div display-task-assign-box";

    const searchBoxBodyDiv = document.createElement("div");
    searchBoxBodyDiv.style.display = "flex";
    searchBoxBodyDiv.style.flexDirection = "column";
    searchBoxBodyDiv.style.position = "static";

    const searchBoxHeadDiv = document.createElement("div");
    searchBoxHeadDiv.className = "display-task-search-box-div";
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.className = "display-task-search-box-input";
    searchBox.placeholder = "Type or select a user";
    searchBoxHeadDiv.append(searchBox);
    const searchBoxBtn = document.createElement("button");
    searchBoxBtn.className = "display-task-search-box-btn";
    searchBoxBtn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i>`;
    searchBoxHeadDiv.append(searchBoxBtn);

    searchBoxBodyDiv.append(searchBoxHeadDiv);

    const searchBoxContentDiv = document.createElement("div");
    searchBoxContentDiv.className = "display-task-search-box-content-div";

    // Fetch all projects
    fetch("/all_projects")
    .then(response => response.json())
    .then((allProjects) => {
        // For each project in all projects find the project of the task
        allProjects.forEach((project) => {
            if (project.title === task.project) {
                // Then display all the members of the project
                project.members.forEach((member) => {
                    // Display the user 
                    const userDiv = document.createElement("div");
                    userDiv.className = "display-task-search-box-display-user";
                    userDiv.innerHTML = member.username;

                    // Check user is already assigned to the task
                    let t = 0;
                    document.querySelector(".display-task-sidebar-members-ul").querySelectorAll("li").forEach(element => {
                        if (element.innerHTML === member.username && element.style.display === "list-item") {
                            t = 1;
                        }
                    })

                    if (t === 1) {
                        userDiv.innerHTML = `${member.username} <i class="fa-solid fa-check" style="color: white;"></i>`
                    }

                    else {
                        userDiv.innerHTML = `${member.username}`;
                    }

                    // If the user is clicked then mark the user as selected
                    userDiv.addEventListener("click", () => {
                        fetch("/assign_task_member", {
                            method: "POST",
                            body: JSON.stringify({
                                task: task.id,
                                user: userDiv.textContent,
                            })
                        })

                        const ulElement = document.querySelector(".display-task-sidebar-members-ul");
                        const alertMessage = document.querySelector(".display-task-alert-message");

                        let t = 0;
                        ulElement.querySelectorAll("li").forEach(element => {   
                            if (element.textContent === member.username) {
                                if (element.style.display === "none") {element.style.display = "list-item"; t = 1;}
                                else {element.style.display = "none";}
                            }

                            else {
                                if (element.style.display === "list-item") {t = 1;}
                                else {}
                            }
                        })

                        if (t === 0) {
                            ulElement.style.display = "none";
                            alertMessage.style.display = "block";   
                        }    

                        else {
                            ulElement.style.display = "block";
                            alertMessage.style.display = "none";
                        }

                        try {
                            console.log(userDiv.querySelector("i").innerHTML);
                            userDiv.innerHTML = userDiv.textContent;
                        }

                        catch (error) {
                            userDiv.innerHTML = `${userDiv.textContent} <i class="fa-solid fa-check" style="color: white;"></i>`;
                        }
                    })

                    searchBoxContentDiv.append(userDiv);
                })
            }
        })
    })

    searchBoxBodyDiv.append(searchBoxContentDiv);

    // Make the search function
    searchBoxDiv.append(searchBoxBodyDiv);
    document.querySelector(".display-task-sidebar-div").append(searchBoxDiv);
    searchBoxBtn.addEventListener("click", () => {
        const inputText = document.querySelector(".display-task-search-box-input").value;
        document.querySelector(".display-task-search-box-content-div").querySelectorAll(".display-task-search-box-display-user").forEach(element => {
            if (element.textContent.includes(inputText.trim())) {
                element.style.display = "block";
            }

            else {
                element.style.display = "none";
            }
        })    
    })
    
    // Hide the assign member box and add all the users which the current user selected to the task 
    closeBtn.addEventListener("click", () => {
        document.querySelector(".display-task-sidebar-div").removeChild(document.querySelector(".display-task-assign-box"));
        const sideBarHeadBtn = document.createElement("button");
        sideBarHeadBtn.className = "display-task-sidebar-head-btn";
        sideBarHeadBtn.style.display = "none";

        sideBarHeadBtn.innerHTML = `<i class="fa-solid fa-plus plus-icon" style="color: white;"></i>`;
    
        fetch(`/get_task/${task.id}`)
        .then(response => response.json())
        .then(result => {
            sideBarHeadBtn.addEventListener("click", () => displayAssignMemberBox(result));
        })

        const oldUlElement = document.querySelector(".display-task-sidebar-members-ul");

        if (oldUlElement.style.display === "block") {
            const newUlElement = document.createElement("ul");
            newUlElement.className = oldUlElement.className;
            newUlElement.style.display = "block";
            oldUlElement.querySelectorAll("li").forEach(element => {
                const newLiElement = document.createElement("li");
                newLiElement.innerHTML = element.textContent;
                newLiElement.className = "li-profile-link";
                newLiElement.style.marginLeft = "-20px";
                newLiElement.style.marginBottom = "-3px";
                newLiElement.style.display = element.style.display;
                newLiElement.addEventListener("click", (event) => {
                    fetch("all_users")
                    .then(response => response.json())
                    .then(allUsers => {
                        allUsers.forEach(user => {
                            if (user.username === newLiElement.textContent) {
                                displayUserProfile(user.id);
                            }

                            else {}
                        })
                    })
                })
                newUlElement.append(newLiElement);
            })

            document.querySelector(".display-task-sidebar-div").replaceChild(newUlElement, oldUlElement);
        }

        else {}

        const sideBarHeadDiv = document.querySelector(".display-task-sidebar-head-div");
        sideBarHeadDiv.replaceChild(sideBarHeadBtn, closeBtn);

        sideBarHeadDiv.onmouseover = () => {
            sideBarHeadBtn.style.display = "block";
            sideBarHeadBtn.style.outline = "none";
        }

        sideBarHeadDiv.onmouseout = () => {
            sideBarHeadBtn.style.display = "none";
            sideBarHeadBtn.style.outline = "none";
        }
    })
}