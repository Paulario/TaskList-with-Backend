import { $ } from "./helpers.js";
import { Tasklist, Task, Subtask } from "./tasklist.js";

const LIST = $("#task-list");
const ADD_FORM = $('form[name="task-add-form"]');
const ICONS = {
    arrowRight: '<i class="fas fa-chevron-circle-right" data-function="toggleMinified"></i>',
    arrowDown: '<i class="fas fa-chevron-circle-down" data-function="toggleMinified"></i>',
    trash: '<i class="fas fa-trash-alt" data-function="removeTask"></i>',
    minusSign: '<i class="fas fa-minus" data-function="removeSubtask"></i>',
};

render();

ADD_FORM.addEventListener("submit", function(event) {
    event.preventDefault();
    addTask();
});

LIST.addEventListener("click", event => {
    let t = event.target;
    if(t.dataset.function === 'addSubtask') { 
        addSubtask(t);
    }
    if(t.dataset.function === 'removeTask') {
        removeTask(t);
    }
    if(t.dataset.function === 'removeSubtask') {
        removeSubtask(t);
    }
    if(t.dataset.function === 'toggleChecked') {
        let taskID = getTaskID(t);
        if(t.closest('.subtask')){
            let N = t.closest('.subtask').dataset.n;
            Tasklist.toggleChecked(taskID, N);
        } else {
            Tasklist.toggleChecked(taskID);
        }
    }
    if(t.dataset.function === 'toggleMinified') {
        let taskID = getTaskID(t);
        Tasklist.toggleMinified(taskID);
        render();
    }
});

async function removeSubtask(target) {
    let N = target.closest('.subtask').dataset.n;
    let taskID = getTaskID(target);
    await Tasklist.removeSubtask(taskID, N);
    render();
}

async function addTask() {
    if(ADD_FORM.taskInput.value) {
        await Tasklist.add(new Task(ADD_FORM.taskInput.value));
        render();
        ADD_FORM.reset();
    }
}

async function removeTask(target) {
    let taskID = getTaskID(target);
    await Tasklist.remove(taskID);
    render();
    ADD_FORM.reset();
}


async function addSubtask(target) {
    let taskID = getTaskID(target);
    let content = target.previousElementSibling.value
    let newSubtask = new Subtask(content);
    await Tasklist.addSubtask(taskID, newSubtask);
    render();
}

async function render() {
    let TASKS = await Tasklist.get();
    LIST.innerHTML = '';
    TASKS.forEach(taskObj => {
        renderTask(taskObj);
    });
}

function renderTask(taskObj) {
    let template = `<li class="task main-task" data-id="${taskObj.id}">
                        <input type="checkbox" class="task-checkbox" ${taskObj.checked ? 'checked' : ''} data-function="toggleChecked"}> 
                        <button type="button" name="minify" data-function="minify">
                            ${ taskObj.minified ? ICONS.arrowRight : ICONS.arrowDown }
                        </button>
                        <span class="task-text"> 
                            <input type="text" maxlength="23" value="${taskObj.content}">
                        </span>
                        <button type="button" name="removeTask" data-function="removeTask">
                            ${ICONS.trash}
                        </button>
                        <ul class="subtask-list ${!taskObj.minified ? "d-none" : "" }">
                            ${renderSubtasks(taskObj)}
                        </ul>
                        <span class="subtask-add">
                            <input type="text" maxlength="23" placeholder="Enter an action">
                            <input type="button" value="Add" data-function="addSubtask">
                        </span>
                    </li>`;
    LIST.insertAdjacentHTML('beforeend', template);
}

function renderSubtasks(taskObj) {
    if(taskObj.subtasks.length) {
        let out = '';
        taskObj.subtasks.forEach(subtask => {
            let template = `<li class="task subtask" data-n="${subtask.N}">
                                <input type="checkbox" class="task-checkbox" ${subtask.checked ? 'checked' : ''} data-function="toggleChecked"}>
                                <span class="task-text"> 
                                    <input type="text" maxlength="23" value="${subtask.content}">
                                </span>
                                <button type="button" data-function="removeSubtask">
                                    ${ICONS.minusSign}
                                </button>
                            </li>`;
            out += template;
        });
        return out;
    } else {
        return '';
    }
}

function getTaskID(elem) {
    let task = elem.closest('.main-task');
    if(task) {
        return task.dataset.id;
    }
}


