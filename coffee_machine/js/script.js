let money = document.getElementById("money"); //создание элемента по идентификатору
let display = document.getElementById("display"); //создание элемента по идентификатору
let bill_acc = document.getElementById("bill_acc"); //создание элемента по идентификатору
let displayInfo = document.getElementById("displayInfo"); //создание элемента по идентификатору
let displayBalance = document.getElementById("displayBalance"); //создание элемента по идентификатору
let progressBar = document.getElementsByClassName("progress-bar")[0]; //создание элемента по классу,берем первый элемент "[0]"
let change_box = document.getElementById("change_box"); //создание элемента по идентификатору
let lock = document.getElementById("lock"); //создание элемента по идентификатору
let chashka_coffee = document.getElementById("chashka_coffee"); //создание элемента по идентификатору      
let progress = 0;

function getCoffee(coffeName,price){
  if(+money.value>=price){ // если баланс денег >= стоимости кофе
    money.value = +money.value-price; //баланс денег-стоимость кофе
    displayBalance.innerText = money.value; // высвечиваем на табло баланс денег
    let audio = new Audio("audio/coffee.mp3"); // ссылка на аудиовоспроизведение
    audio.play(); //аудиовоспроизведение          
    let timerId = setInterval(()=>{ //функция интервала приготовления
      lock.hidden = false; //включена блокировка экрана
      if(progress>110){ //110 указано для полной прорисовки интервала при использовании "hidden"
        clearInterval(timerId); //остановка таймера
        progressBar.hidden = true; //"убираем" прорисованный интервал
        progressBar.style.width = 0+'%'; //обнуление интервала
        displayInfo.innerHTML = `<i class="fas fa-mug-hot"></i> Кофе ${coffeName} готов`;
        progress = 0; //обнуление прогресса
        lock.hidden = true; //выключена блокировка экрана
       chashka_coffee.hidden = false; //появилась чашка приготовленного кофе              
        return; //прерывает функцию
      }
      else if(progress<10) displayInfo.innerHTML = `<i class="fas fa-hourglass-start"></i> Приготовление...`;
      else if(progress<90) displayInfo.innerHTML = `<i class="fas fa-hourglass-half"></i> Приготовление...`;
      else displayInfo.innerHTML = `<i class="fas fa-hourglass-end"></i> Приготовление...`;
      progressBar.hidden = false;
      progressBar.style.width = ++progress+'%'; //прогресс интервала
    },70);
  }else{
    displayInfo.innerHTML = `<i class="far fa-frown"></i> Недостаточно средств`;
  }
}

chashka_coffee.hidden = true; //"убрали" чашку приготовленного кофе
let banknotes = document.querySelectorAll("[src$='rub.jpg']"); // Коллекция (Как бы массив)
let zIndex = 1;
for(let i=0; i<banknotes.length; i++){ // Перебираем коллекцию
  let banknote = banknotes[i]; // Записываем очередной элемент коллекции в переменную
  banknote.onmousedown = function(e){ // при генерировании события "onmousedown" должно вызывается событие (event)
    this.ondragstart = function(){return false;} //прерывает стандартный драганддроп браузера
    this.style.position = 'absolute'; //позиционирование объекта
    this.style.zIndex = ++zIndex; //размещение купюр относительно оси z
    this.style.transform = 'rotate(90deg)'; //вращение объекта (купюры)
    moveAt(e);
    function moveAt(event){ //генерация объекта event
      banknote.style.top = (event.clientY-banknote.offsetHeight/2)+'px'; // высчитывание координат мыши относительно объекта(купюры) осьy
      banknote.style.left = (event.clientX-banknote.offsetWidth/2)+'px'; // высчитывание координат мыши относительно объекта(купюры) ось х
    }
    document.addEventListener('mousemove',moveAt);
    this.onmouseup = function(){
      document.removeEventListener('mousemove',moveAt);
      let bill_acc_top = bill_acc.getBoundingClientRect().top; // Верх купюроприёмника
      let bill_acc_bottom = bill_acc.getBoundingClientRect().bottom - (bill_acc.getBoundingClientRect().height*2/3); // граница снизу щели купюроприёмника
      let bill_acc_left = bill_acc.getBoundingClientRect().left; // левый край купюроприёмника
      let bill_acc_right = bill_acc.getBoundingClientRect().right; // правый край купюроприёмника
      let banknote_top = this.getBoundingClientRect().top; // Верх купюры
      let banknote_left = this.getBoundingClientRect().left; // левый край купюры
      let banknote_right = this.getBoundingClientRect().right; // правый край купюры
      if(bill_acc_top<banknote_top && bill_acc_bottom>banknote_top && bill_acc_left<banknote_left && bill_acc_right>banknote_right){
        money.value = (+money.value)+(+this.dataset.value); //суммируем положенные в автомат деньги
        displayBalance.innerText = money.value; //баланс денег
        this.hidden = true; //купюра "исчезает"
    let audio = new Audio("audio/12345.mp3"); // ссылка на аудиовоспроизведение
    audio.play(); //аудиовоспроизведение              
      }
    }
  }
}

function getChange(num){
  let change_box_h = change_box.getBoundingClientRect().height-65; //границы выспания монет с учетом границ монет
  let change_box_w = change_box.getBoundingClientRect().width-65; //границы выспания монет с учетом границ монет
  let change = 0;
  let top = Math.random()*change_box_h; //рандомное высыпание монет
  let left = Math.random()*change_box_w; //рандомное высыпание монет
  if(num>=10) change = 10;
  else if(num>=5) change = 5;
  else if(num>=2) change = 2;
  else if(num>=1) change = 1;
  else{
    let audio = new Audio("audio/getChange.mp3"); // ссылка на аудиовоспроизведение
    audio.play(); //аудиовоспроизведение
  }
  
  if(change>0){
    let img= document.createElement('img');
    img.src=`img/${change}rub.png`; // монеты сспятся в change-box
    img.style.top= top+'px';
    img.style.left= left+'px';
    img.onclick=function(){this.hidden=true;}
    change_box.append(img);
    displayBalance.innerText = money.value=0;
    getChange(num-change);
  }
}