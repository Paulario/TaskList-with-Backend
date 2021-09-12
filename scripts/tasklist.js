export class Task {
    subtasks = [];
    checked = false;
    minified = true;
    constructor(content) {
        if(typeof content === 'object') {
            Object.assign(this, content);
        } else {
            this.content = content;
        }
    }
    addSubtask(subtask) {
        if(subtask instanceof Subtask) {
            this.subtasks.push(subtask);
        }
        this._numberSubtasks();
    }
    removeSubtask(N) {
        this.subtasks.splice(N, 1);
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
export class Subtask extends Task {
    N = 0;
    constructor(content) {
        if(typeof content === 'string') {
            super(content);
            delete this.subtasks;
        } else {
            throw TypeError('Content argument must be a string');
        }
    }
}

export const Tasklist = (function() {
    const BACKEND_URL = 'http://localhost:3000/tasks';

    async function removeSubtask(taskID, N) {
        let taskObj = await get(taskID);
        taskObj.removeSubtask(N);
        await _updateTask(taskObj);
    }

    async function addSubtask(taskID, subtask) {
        if(subtask instanceof Subtask) {
            let taskObj = await get(taskID);
            taskObj.addSubtask(subtask);
            await _updateTask(taskObj);
        }
    }

    async function toggleMinified(taskID) {
        let taskObj = await get(taskID);
        if(Object.keys(taskObj).length) {
            taskObj.minified = !taskObj.minified;
            await _updateTask(taskObj);
        }
    }

    async function toggleChecked(taskID, N=null) {
        let taskObj = await get(taskID);
        if(Object.keys(taskObj).length) {
            if(N !== null) {
                taskObj.subtasks[N].checked = !taskObj.subtasks[N].checked;
            } else {
                taskObj.checked = !taskObj.checked;
            }
        }
        await _updateTask(taskObj);
    }

    async function _updateTask(taskObj) {
        if(taskObj.id) {
            await fetch(`${BACKEND_URL}/${taskObj.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(taskObj)
            })
        }
    }

    async function add(task) {
        if(task instanceof Task) {
            await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(task)
            });
        } else {
            throw TypeError('Provided task object is not of instance "Task"');
        }
    }

    async function remove(taskID) {
        let TARGET_TASK = `${BACKEND_URL}/${taskID}`;
        await fetch(TARGET_TASK, { method: 'DELETE' });
    }

    async function clear() {
        let DATA = await get();
        if(DATA.length) {
            DATA.forEach(async (task) => {
                let id = task.id;
                await remove(id);
            });
        }
    }

    async function get(taskId='') {
        let response = await fetch(`${BACKEND_URL}/${taskId}`);
        let data = await response.json();
        if(taskId) {
            data = new Task(data);
        } else {
            data = Array.from(data).map(task => new Task(task));
        }

        return data;
    }

    return {
        get: get,
        add: add,
        remove: remove,
        addSubtask: addSubtask,
        removeSubtask: removeSubtask,
        toggleMinified: toggleMinified,
        toggleChecked: toggleChecked,
        clear: clear
    }
})();


