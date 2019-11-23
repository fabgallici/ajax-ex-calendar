/* Creare un calendario dinamico con le festività.Partiamo dal gennaio 2018 dando la possibilità di cambiare mese, 
gestendo il caso in cui l’API non possa ritornare festività.
Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018(unici dati disponibili sull’API). */
// BONUS: Creazione oggetto con salvataggio chiamate ajax precedenti, 
// e utilizzo delle stesse per visualizzare festività quando già presenti


//estrapolazione dati num giorni in un mese,nome giorni settimana, nome mesi etc, 
//elaborazioni e pulizia dati a schermo
function evMonthData(calObj) {
  var monthIndex = calObj.monthIndex;
  var yearNum = calObj.year;
  var foundFirstMondayOfMonth = false;
  // increm mese di 1 per parificare notazione momentjs, senza parseInt error converte in string i dati del Select
  var monthNum = parseInt(monthIndex) + 1;
  var currentMonth = yearNum + '-' + monthNum;
  var daysInAMonth = moment(currentMonth, "YYYY-MM").daysInMonth();
  var monthName = moment(currentMonth, "YYYY-MM").format('MMMM');
  // console.log('daysInAMonth', daysInAMonth, 'monthname', monthName, 'year', yearNum);
  //stampa titolo con mese corrente
  document.getElementById('current-month').innerText = monthName + ' - ' + yearNum;
  //ripulisco il container prima di immettere nuovi dati mese
  $('.days-container').empty();
  //ciclo in base ai numeri del mese, estrapolando numero del giorno, giorno della settimana, e data del giorno per attr
  for (var i = 1; i <= daysInAMonth; i++) {
    var currentDate = moment(yearNum + '-' + monthName + '-' + i, 'YYYY-MMMM-D').format('YYYY-MM-DD');
    var dayOfTheWeek = moment(currentDate, "YYYY-MM-DD").format('ddd');
    if (dayOfTheWeek === "lun" && !foundFirstMondayOfMonth) { //used by formatInitialEmptySpace
      var firstMondayOfMonth = moment(currentDate, 'YYYY-MMMM-D').format('D');
      foundFirstMondayOfMonth = true;
    }
    // console.log('dayoftheweek', dayOfTheWeek, 'currendata', currentDate);
    printCalendar(i, dayOfTheWeek, currentDate);
  }
  //inserire le festività presenti nel calendario
  getCalendarData(calObj);
  //creo celle vuote format lunedì primo elemento
  formatInitialEmptySpace(firstMondayOfMonth);
}

//controllo se ci sono dati caricati precedentemente in memoria calObj sulla festività del mese,
//altrimenti interrogo l'api e li richiedo.
function getCalendarData(calObj) {
  var monthIndex = calObj.monthIndex;
  var currMonthFest = calObj.festivity[monthIndex];
  if (currMonthFest === 0) {
    getFestAjax(calObj);
  } else {
    printFestivity(currMonthFest);
    console.log('Used saved festivity data');
  }
}

//chiamata ajax get, salvataggio dati
function getFestAjax(calObj) {
  var monthIndex = calObj.monthIndex;
  // var monthIndex = -1; //test missing month
  var year = calObj.year;
  $.ajax({
    url: "https://flynn.boolean.careers/exercises/api/holidays",
    method: "GET",
    data: {
      year: year,
      month: monthIndex
    },
    success: function (data) {
      var arrObjMonth = data.response;   
      // var arrObjMonth = null; //test missing data
      if (data.success === true) {
        if (arrObjMonth) {
          // console.log('success', arrObjMonth);
          printFestivity(arrObjMonth);
          //aggiorno oggetto calendar
          calObj.festivity[monthIndex] = arrObjMonth;
          console.log('Ajax Call!, update callObj: ', calObj); // debug
        } else {
          console.log('missing data');
        }
      } else {
        console.log('error: ', data.error);
      }
    },
    error: function (error) {
      console.log("error: ", error);
    }
  });
}

//controlla festività presenti e le associa all'attributo html corrispondente
function printFestivity(arrObjMonth) {
  if (Array.isArray(arrObjMonth)) {
    arrObjMonth.forEach(el => {
      var festName = el.name;
      var date = el.date;
      // console.log('festname', festName, date);
      //aggiungo festività in pagina e cambio bg-color cella
      $(`.date[data-name="${date}"]`)
        .html(festName)
        .closest('.days')
        .addClass('bg-fest');

    });
  } else {
    console.log('invalid data');
  }
}

//stampa il giorno del calendario a schermo con handlebars
function printCalendar(dayNum, dayOfWeek, currentDate) {
  var source = document.getElementById('calendar-template').innerHTML;
  var calendarTemplate = Handlebars.compile(source);
  var calendarData = { dayNum: dayNum, dayOfWeek: dayOfWeek, currentDate: currentDate };
  var htmlcalendarData = calendarTemplate(calendarData);
  $('.container.days-container').append(htmlcalendarData);
}

//funzione opzionale calcola eventuali spazi bianchi per formattazione lunedì primo elemento
function formatInitialEmptySpace(day) {
  if (day > 1) {
    var whiteSpaces = 8 - day;
    for (var j = 1; j <= whiteSpaces; j++) {
      $('.container.days-container').prepend('<div class="days"></div>');
    }
  }
}

// ritorna funzione in base alla sezione "prev" o "next", aggiorna contatore index
function switchMonthBtns(direction) {
  if (direction === "prev") {
    return function (index) {
      if (index > 0) {
        index--;
      }
      return index;
    }
  } else if (direction === "next") {
    return function (index) {
      if (index == 11) {  // solo 2 uguali perchè selMonth return string
        index = 0;
      } else {
        index++;
      }
      return index;
    }
  }
}
//costruttore obj calendar
var Calendar = function (monthIndex, year) {
  this.monthIndex = monthIndex;
  this.year = year;
}

Calendar.prototype.fillEmptyFest = function() {
  this.festivity = Array(12).fill(0);
}

//Init Program
$(document).ready(function () {
  const year = 2018;
  var monthIndex = 0;
  //creo nuovo oggetto Calendar in cui salvero dati festività, usero indice mese e anno
  var calObj = new Calendar(monthIndex, year);
  calObj.fillEmptyFest();
  //inizializzo all'index primo mese 
  evMonthData(calObj);

  var prevMonth = switchMonthBtns("prev");
  var nextMonth = switchMonthBtns("next");

  $('.prev-btn').on('click', function () {
    monthIndex = prevMonth(monthIndex);
    calObj.monthIndex = monthIndex;
    evMonthData(calObj);
  });

  $('.next-btn').on('click', function () {
    monthIndex = nextMonth(monthIndex);
    calObj.monthIndex = monthIndex;
    evMonthData(calObj);
  });

  $('#select-month').change(function () {
    var selMonth = $(this).val();
    monthIndex = selMonth;
    calObj.monthIndex = monthIndex;

    evMonthData(calObj);
  })

});
