'use strict';

export function $(sel){
    return document.body.querySelector(sel);
}

export function padTime(time){
    return time.toString().padStart(2,'0');
}

export function renameKey(object, key, newKey) {
    const clonedObj = clone(object);
    const targetKey = clonedObj[key];
    delete clonedObj[key];
    clonedObj[newKey] = targetKey;
    return clonedObj;
};

export function clone(obj){ Object.assign({}, obj)};

export function getRandom(max){
    return Math.round(Math.random()*max);
}
export function getIdSetter(){
    let usedIds = [];
    const checkID = function(newID){
        if(usedIds.length){
            let check = false;
            usedIds.forEach((elem) => {
                if(elem !== newID){
                    check = true;
                    return;
                }
            });
            return check;
        }
        return true;
    };
    const updateIdList = function(){
        let existingIDs = [];
        for(const task of toDoList){
            existingIDs.push(task.id);
            for(const subtask of task.subtaskList){
                existingIDs.push(subtask.id);
            }
        }
        for(let i=0; i<usedIds.length; i++){
            if(existingIDs.findIndex(usedIds[i]) === -1){
                usedIds.splice(i, 1);
            }
        }
    }
    const getID = function(){
        let rand = getRandom(100000);
        while(!checkID(rand)){
            rand = getRandom(100000);
        }
        usedIds.push(rand);
        return rand;
    }
    return {
        getID: getID,
        updateIdList: updateIdList,
    }
}

