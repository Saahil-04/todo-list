import Project from './project'
import Todo from './todo'

export default class Storage {
    static saveProjects(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }
    
    static getProjects() {
        let projectsJSON = localStorage.getItem("projects");

        // ✅ Fix: Return an empty array if localStorage is empty or invalid
        if (!projectsJSON) {
            console.warn("No projects found in localStorage. Returning empty array.");
            return [];
        }

        let projects;
        try {
            projects = JSON.parse(projectsJSON);
        } catch (error) {
            console.error("Error parsing projects from localStorage:", error);
            return [];
        }

        return projects.map(p => {
            let project = new Project(p.name);

            // Ensure todos are properly reconstructed
            project.todos = (p.todos || []).map(todo => new Todo(
                todo.title,
                todo.description,
                todo.dueDate,
                todo.priority,
                todo.notes,
                todo.checklist,
                todo.completed || false
            ));

            return project;
        });
    }
}