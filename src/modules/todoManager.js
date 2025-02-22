import Project from "./project";
import Storage from "./storage";
import Todo from "./todo";

class TodoManager {
    constructor() {
        this.projects = Storage.getProjects() || [];

        if (this.projects.length === 0) {
            console.log("No projects found. Creating Default Project...");
            this.projects.push(new Project("Default"));
            Storage.saveProjects(this.projects);
        }
    }

    addProject(name) {
        if (!this.projects.some(p => p.name === name)) {
            this.projects.push(new Project(name));
            Storage.saveProjects(this.projects);
        }
    }

    removeProject(name) {
        this.projects = this.projects.filter(p => p.name !== name)
        Storage.saveProjects(this.projects);
    }

    addTodoToProject(projectName, todo) {
        let project = this.projects.find(p => p.name === projectName);
        if (project) {
            project.addTodo(todo);
            Storage.saveProjects(this.projects);
        }
    }

    removeTodoFromProject(name, todoTitle) {
        let project = this.projects.find(p => p.name === name);
        if (project) {
            project.removeTodo(todoTitle);
            Storage.saveProjects(this.projects);
        }
    }

    getProjectTodos(projectName) {
        let project = this.projects.find(p => p.name === projectName);
        return project ? project.getTodos() : [];
    }

    getAllTodos() {
        let allTodos = [];
        this.projects.forEach(project => {
            allTodos = allTodos.concat(project.todos);
        });
        return allTodos;
    }

    updateTodoInProject(oldTitle, updatedTodo) {
        let found = false;


        this.projects.forEach((project) => {
            project.todos.forEach((todo, index) => {
                if (todo.title === oldTitle) {
                    console.log("updating todo ", oldTitle, "in project", project.name)

                    // Update the existing todo
                    project.todos[index].title = updatedTodo.title;
                    project.todos[index].description = updatedTodo.description;
                    project.todos[index].dueDate = updatedTodo.dueDate;
                    project.todos[index].priority = updatedTodo.priority;

                    found = true;
                }
            });
        });
        if(found){
            Storage.saveProjects(this.projects);
        }
        else{
            console.warn("todo not found in any of the projects",oldTitle);
        }
    }

}

export default new TodoManager();