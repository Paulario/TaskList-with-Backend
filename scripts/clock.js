let clock = {
    obj: document.querySelector('.time-setter'),
    hours: (new Date()).getHours(),
    minutes: (new Date()).getMinutes(),
    setUp() {
        getSel('.value.in-hours').value = padTime(this.hours + 1);
        getSel('.value.in-minutes').value = padTime(0);
    },
    arrowClickHandler(event) {
        if(event.target.closest('.arrow')){
            let arrow = event.target.closest('.arrow');
            let isArrowUp = arrow.matches('.arrow-up');
            let valueInput = isArrowUp ? arrow.nextElementSibling : arrow.previousElementSibling;
            let isInHours = valueInput.matches('.in-hours');
            let maxValue = isInHours ? 23 : 59;
            let v = +valueInput.value;
            valueInput.value = padTime(
                isArrowUp ? 
                ((v + 1) % (maxValue + 1)) :
                v<=0 ? maxValue : (v - 1) % (maxValue + 1)
            );
            if(isInHours){
                clock.hours = valueInput.value;
            } else {
                clock.minutes = valueInput.value;
            }
        }
    },
    isNumber(n){
        let isNum = !isNaN(Number(n));
        if(!isNum) {
            return false;
        }
        return true;
    },
    keyboardInputHandler(event) {
        let target = event.currentTarget;
        let check = (target.value >= 0 && clock.isNumber(target.value));
        if(target.matches('.in-hours')){
            check &= target.value < 23;
            if(!check) {
                target.value = clock.hours;
            }
        } else {
            check &= target.value < 59;
            if(!check) {
                target.value = clock.minutes;
            }
        }
    },
}

clock.setUp();
clock.obj.addEventListener('click', clock.arrowClickHandler);
clock.obj.querySelector('.value.in-hours').addEventListener('blur', clock.keyboardInputHandler);
clock.obj.querySelector('.value.in-minutes').addEventListener('blur', clock.keyboardInputHandler);

