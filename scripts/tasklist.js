export const Tasklist = (function() {
    class Task {
        subtasks = [];
        completed = false;
        minified = true;
        constructor(content) {
            this.content = content;
        }
        set subtask(subtask) {
            if(subtask instanceof Subtask) {
                this.subtasks.push(subtask);
            }
            this._numberSubtasks();
        }
        _numberSubtasks() {
            if(this.subtasks.length) {
                let i = 0;
                this.subtasks.forEach(subtask => {
                    subtask.N = i;
                    i++;
                });
            }
        }
    }
    class Subtask extends Task {
        N = 0;
        constructor(content) {
            super(content);
            delete this.subtasks;
        }
    }
    const TASKS = [];

    return {
        add: add,
        remove: remove,
        addSubtask: addSubtask,
        removeSubtask: removeSubtask,
        minify: minify,
        check: check,
    }
})();


