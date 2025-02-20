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

}

export default new TodoManager();