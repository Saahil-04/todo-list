
export default class Todo{
    constructor(title, description, dueDate, priority,notes='',checklist=[],completed){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.completed = completed;
    }

    toggleCompleted(){
        this.completed = !this.completed;
      
    }
}