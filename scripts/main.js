import { $, getIdSetter, clone, renameKey, getRandom  } from './helpers.js';

const TREE = document.querySelector('.task-tree');
const ADD_FORM = document.forms['task-add-form'];

let icons = {
    arrowRight: '<i class="fas fa-chevron-circle-right"></i>',
    arrowDown:  '<i class="fas fa-chevron-circle-down"></i>',
    trash: '<i class="fas fa-trash-alt"></i>',
    minusSign: '<i class="fas fa-minus"></i>'
};

let setID = getIdSetter().getID;
let updateIdList = getIdSetter().updateIdList;

const toDoList = {
    'task1': {
        completed: false,
        opened: false,
        id: setID(),
        subtaskList: { 
            'subtask1': {completed: false, id: setID()},
            'subtask2': {completed: false, id: setID()},
            'subtask3': {completed: false, id: setID()},
        }
    },
    'task2': { 
        completed: false,
        opened: false,
        id: setID(),
        subtaskList: {
            'subtask1': {completed: false, id: setID()},
            'subtask2': {completed: false, id: setID()},
        }
    },
    'task3': {
        completed: false,
        opened: false,
        id: setID(),
        subtaskList: {},
    },
    'task4': { 
        completed: false,
        opened: false,
        id: setID(),
        subtaskList: {
            'subtask1': {completed: false, id: setID()},
            'subtask2': {completed: false, id: setID()},
            'subtask3': {completed: false, id: setID()},
            'subtask4': {completed: false, id: setID()},
            'subtask5': {completed: false, id: setID()},
        }
    },
    'task5': { 
        completed: false,
        opened: false,
        id: setID(),
        subtaskList: {
            'subtask1': {completed: false, id: setID()},
            'subtask2': {completed: false, id: setID()},
            'subtask3': {completed: false, id: setID()},
            'subtask4': {completed: false, id: setID()},
            'subtask5': {completed: false, id: setID()},
        }
    },
    'task6': { 
        completed: false,
        opened: false,
        id: setID(),
        subtaskList: {
            'subtask1': {completed: false, id: setID()},
            'subtask2': {completed: false, id: setID()},
            'subtask3': {completed: false, id: setID()},
            'subtask4': {completed: false, id: setID()},
            'subtask5': {completed: false, id: setID()},
        }
    },
}

updateTaskTree();
ADD_FORM.addEventListener('click', addTask);
TREE.addEventListener('click', toggleSubtaskList);
TREE.addEventListener('click', removeSubtask);
TREE.addEventListener('click', removeTask);

function addTask(event){
    if(event.target === this.taskAdd){
        if(this.taskInput.value){
            toDoList[this.taskInput.value] = {
                completed: false,
                opened: false,
                id: setID(),
                subtaskList: {},
            };
            this.taskInput.value = '';
        }
    }
    updateTaskTree();
}

function updateTaskTree(){
    TREE.innerHTML = '';
    listFromObject(toDoList, TREE);
    for(const task of TREE.lastElementChild.children){
        let taskKey = task.querySelector('.task-text input').value;
        task.classList.add('task', 'main-task');
        task.id = toDoList[taskKey].id;
        task.querySelector('span').insertAdjacentHTML('afterend', icons.trash);
        task.querySelector('span').insertAdjacentHTML('beforebegin', icons.arrowDown);
        addCheckbox(task,'root-task');
        for(const subtask of task.lastElementChild.children){
            let subtaskKey = subtask.querySelector('.task-text input').value;
            subtask.classList.add('task', 'subtask');
            subtask.id = toDoList[taskKey].subtaskList[subtaskKey].id;
            subtask.querySelector('.task-text').insertAdjacentHTML('afterend', icons.minusSign);
            addCheckbox(subtask, 'subtask');
        }
    }
    addSubtaskInputs();
    checkTaskState();
}


function toggleSubtaskList(event){
    let check = event.target.matches('.fa-chevron-circle-down, .fa-chevron-circle-right');
    if(check){
        let target = event.target.closest('.task');
        target.querySelector('ul').classList.toggle('d-none');
        target.querySelector('.fas').classList.toggle('fa-chevron-circle-down');
        target.querySelector('.fas').classList.toggle('fa-chevron-circle-right');
    }
}


function listFromObject(object, whereToAppend = document.body){
    let outerUL = document.createElement('ul');
    for(const outerKey in object){
        let outerLI = document.createElement('li');
        let html = `<span class="task-text">
                        <input type="text" maxlength="23" value="${outerKey}">
                    </span>`;
        outerLI.insertAdjacentHTML('afterbegin', html);
        outerUL.append(outerLI);
        let innerUL = document.createElement('ul');
        for(const innerKey in object[outerKey].subtaskList){
            let innerLI = document.createElement('li');
            html = `<span class="task-text">
                            <input type="text" maxlength="23" value="${innerKey}">
                        </span>`;
            innerLI.insertAdjacentHTML('afterbegin', html);
            innerUL.append(innerLI);
        }
        outerLI.append(innerUL);
    }
    whereToAppend.append(outerUL);
}

function addCheckbox(li, _class){
    li.insertAdjacentHTML('afterbegin',
        `<input type="checkbox" class="task-tree-checkbox ${_class}"> `);
}

function removeSubtask(event){
    if(event.target.matches('.fa-minus')){
        let subtask = event.target.closest('.subtask');
        let task = subtask.closest('.main-task');
        let subtaskText = subtask.querySelector('input[type="text"]').value;
        let taskText = task.querySelector('.task-text input[type="text"]').value;
        delete toDoList[taskText].subtaskList[subtaskText];
        subtask.remove();
    }
}

function removeTask(event){
    if(event.target.matches('.fa-trash-alt')){
        let task = event.target.closest('.task.main-task');
        let taskText = task.querySelector('.task-text input[type="text"]').value;
        delete toDoList[taskText];
        task.remove();
    }
}

function addSubtaskInputs(){
    for(const task of TREE.querySelectorAll('.task.main-task')){
        let ul = task.querySelector('ul');
        let liSubtaskAdd = document.createElement('li');
        let html = `<span class="subtask-add">
            <input type="text" maxlength="23" placeholder="Enter an action">
            <input type="button" value="Add">
        </span>`;
        liSubtaskAdd.insertAdjacentHTML('afterbegin', html);
        liSubtaskAdd
            .querySelector('input[type="button"]')
            .addEventListener('click', addSubtask);
        ul.append(liSubtaskAdd);
    }
}

function addSubtask(){
    let subtaskText = this.previousElementSibling.value;
    console.log(subtaskText);
    if(subtaskText){
        let taskText = this.closest('.task.main-task').querySelector('.task-text input').value;
        toDoList[taskText].subtaskList[subtaskText] = {completed: false, id: setID()};
        updateTaskTree()
    }
}

function checkTaskState(){
    let checkboxes = TREE.querySelectorAll('input[type="checkbox"]');
    for(const checkbox of checkboxes){
        if(checkbox.checked){
            checkbox.closest('.task')
                .querySelector('input[type="text"]')
                .disabled = true;
        }
    }
}

// function rewriteOnBlur(){
//     let oldText = event.target.closest('.task');
//     if(event.target.value === ''){
//         event.target.value = '';
//     }
