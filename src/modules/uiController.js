import Todo from './todo';
import Storage from './storage';
import TodoManager from './todomanager';
// import todomanager from './todomanager';

class UIController {

    static currentProject = null;

    static renderprojects() {
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = '';
        const projectFilters = document.querySelector('.project-filters');
        projectFilters.innerHTML = ''


        const specialProjects = ['Today', 'Upcoming'];
        specialProjects.forEach(name => {

            const specialDiv = document.createElement('div');
            specialDiv.textContent = name;
            specialDiv.classList.add('project-item');
            specialDiv.addEventListener('click', () => {
                this.currentProject = name;
                this.renderTodos(name);
                this.highlightSelectedProject(specialDiv);
            });
            projectFilters.append(specialDiv);

        });

        TodoManager.projects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.classList.add('project-item');
            projectDiv.innerHTML = `
            <h3>${project.name}</h3>
            <button class="delete-project" data-title="${project.name}"><i class="fa-solid fa-trash"></i></button>
            `;
            projectDiv.addEventListener('click', () => {
                console.log(this.currentProject);
                this.currentProject = project.name;
                this.renderTodos(project.name);
                this.highlightSelectedProject(projectDiv);
                this.updateProjectDropdown()
            });

            projectDiv.querySelector('.delete-project').addEventListener('click', () => {
                TodoManager.removeProject(project.name);
                UIController.renderprojects(project.name);
            });
            projectList.appendChild(projectDiv);
        });
        this.updateProjectDropdown();
        this.currentProject = "Today"
        this.renderTodos('Today');
        this.highlightSelectedProject(document.querySelector('.project-item'))

    }
    //thetoday and upcoming todos are not showing
    static renderTodos(projectName) {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';
        let todos;
        const todayDate = new Date();
        console.log("the date today", todayDate);

        if (projectName === 'Today') {
            todos = TodoManager.getAllTodos().filter(todo => {
                let todoDate = new Date(todo.dueDate)
                return (todoDate.toDateString() === todayDate.toDateString() && !todo.completed);
            });

            console.log("The todos scheduled for today", todos);
        } else if (projectName === 'Upcoming') {
            todos = TodoManager.getAllTodos().filter(todo => {
                let todoDate = new Date(todo.dueDate);
                return (todoDate > todayDate && !todo.completed); // Future Dates
            });
            console.log("The upcoming todos scheduled", todos);
        } else {
            todos = TodoManager.getProjectTodos(projectName);
            console.log("the todos are", todos)

        }


        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');

            if (todo.completed) todoItem.classList.add('completed');

            // Set background color based on priority
            let priorityColor = UIController.getPriorityColor(todo.priority);
            todoItem.style.backgroundColor = priorityColor;

            todoItem.innerHTML = `
            <div class="todo-itemDiv">
            <div id="checkboxDiv">
              <input type="checkbox" class="todo-checkbox" id="check-${todo.title}" ${todo.completed ? 'checked' : ''}>
              <label for="check-${todo.title}" class="custom-checkbox"></label>
            </div>
            <div id="todo-item-desc">
            <h2>${todo.title}</h2>
            <p>${todo.description}</p>
            <p>Due Date: ${todo.dueDate} | Priority: <span class="priority-${todo.priority.toLowerCase()}">(${todo.priority})</span></p>
            </div>
            </div>
            <div id="todo-action-btn">
            <button class= "edit-todo" data-title="${todo.title}"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete-todo" data-title="${todo.title}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

            const checkbox = todoItem.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => {
                todo.toggleCompleted(todo.title);
                Storage.saveProjects(TodoManager.projects);
                UIController.renderTodos(projectName);

            });

            todoItem.querySelector('.delete-todo').addEventListener('click', () => {
                TodoManager.removeTodoFromProject(projectName, todo.title);
                UIController.renderTodos(projectName);
            })

            todoItem.querySelector('.edit-todo').addEventListener('click', () => {
                UIController.openEditTodoModal(todo); // Open modal with todo data
            });

            todoList.appendChild(todoItem);
        });
    }

    static highlightSelectedProject(selectedProject) {
        document.querySelectorAll('.project-item').forEach(item => {
            item.classList.remove('selected-project');
        });
        selectedProject.classList.add('selected-project');
      
    }

    static setupEventListeners() {
        const projectModal = document.getElementById('project-modal');
        const todoModal = document.getElementById('todo-modal');

        const projectbtn = document.getElementById('add-project-btn');
        const todobtn = document.getElementById('add-todo-btn');

        const closeProjectModal = document.getElementById('close-project-modal');
        const closeTodoModal = document.getElementById('close-todo-modal');
        // show project modal
        projectbtn.addEventListener('click', () => {
            projectModal.style.display = 'flex';
        });
        todobtn.addEventListener('click', () => {
            UIController.updateProjectDropdown();
            todoModal.style.display = 'flex';
        });
        // close project modal
        closeProjectModal.addEventListener('click', () => projectModal.style.display = 'none');
        closeTodoModal.addEventListener('click', () => todoModal.style.display = 'none');

        window.addEventListener('click', (e) => {
            if (e.target === projectModal) projectModal.style.display = 'none';
            if (e.target === todoModal) todoModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            const selectedProject = document.querySelector('.selected-project');
            if (e.target === selectedProject) {
                selectedProject.classList.remove('selected-project');
            }
        });

        document.getElementById('save-project').addEventListener('click', (e) => {
            console.log("save project");
            const projectName = document.getElementById('project-name').value.trim();
            if (projectName) {
                TodoManager.addProject(projectName);
                UIController.renderprojects();
                projectModal.style.display = 'none';
                document.getElementById('project-name').value = '';
            }
        });

        document.getElementById('save-todo').addEventListener('click', (e) => {
            const projectName = document.getElementById('todo-project-select').value;
            const title = document.getElementById('todo-title').value.trim();
            const description = document.getElementById('todo-description').value.trim();
            const dueDate = document.getElementById('todo-due-date').value;
            const priority = document.getElementById('todo-priority').value;

            if (projectName && title && dueDate && priority) {
                const existingTitle = document.getElementById('todo-modal').getAttribute('data-editing-title');
                
                if (existingTitle) {
                    // Editing an existing todo
                    TodoManager.updateTodoInProject(existingTitle,{title,description,dueDate,priority});
                    document.getElementById('todo-modal').removeAttribute('data-editing-title');
                } else {
                    // Creating a new todo
                    const todo = new Todo(title, description, dueDate, priority);
                    TodoManager.addTodoToProject(UIController.currentProject, todo);
                }
                UIController.renderTodos(UIController.currentProject);
                todoModal.style.display = 'none';

                // Clear inputs after adding todo
                document.getElementById('todo-title').value = '';
                document.getElementById('todo-description').value = '';
                document.getElementById('todo-due-date').value = '';
            }
        });
    }

    static updateProjectDropdown() {
        const projectDropdown = document.getElementById('todo-project-select');
        projectDropdown.innerHTML = '';

        TodoManager.projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.name;
            option.textContent = project.name;
            if (project.name === this.currentProject) option.selected = true;
            projectDropdown.appendChild(option);
        });
    }

    static getPriorityColor(priority) {
        switch (priority.toLowerCase()) {
            case 'high':
                return '#F38BA8'; // Red for High Priority
            case 'medium':
                return '#ffcc66'; // Orange for Medium Priority
            case 'low':
                return '#66cc99'; // Green for Low Priority
            default:
                return '#f4f4f4'; // Default light gray
        }
    }
    
    static openEditTodoModal(todo){
        const todoModal = document.getElementById('todo-modal');
        todoModal.style.display = 'flex';

        // Populate modal fields with existing todo data
        document.getElementById('todo-title').value = todo.title;
        document.getElementById('todo-description').value = todo.description;
        document.getElementById('todo-due-date').value = todo.dueDate;
        document.getElementById('todo-priority').value = todo.priority;
        document.getElementById('todo-project-select').value = UIController.currentProject;
    
        // Store the todo title temporarily for updating
        document.getElementById('todo-modal').setAttribute('data-editing-title', todo.title);
    }
}

export default UIController;