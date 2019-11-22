/* Creare un calendario dinamico con le festività.Partiamo dal gennaio 2018 dando la possibilità di cambiare mese, 
gestendo il caso in cui l’API non possa ritornare festività.
Il calendario partirà da gennaio 2018 e si concluderà a dicembre 2018(unici dati disponibili sull’API). */

function getMonth(monthIndex) {
  const year = 2018;
  var monthUrl = "https://flynn.boolean.careers/exercises/api/holidays?year=" + year + "&month=" + monthIndex;
  $.ajax({
    url: monthUrl,
    method: "GET",
    success: function (data) {
      // console.log(data);
      var arrObjMonth = data.response;
      // arrObjMonth = null; //test missing data
      if (data.success === true) {
        if (arrObjMonth) {
          console.log('success', arrObjMonth);
          evaluateMonthData(monthIndex, year, arrObjMonth);
        } else {
          arrObjMonth = null;  //? atrim se non esiste da errore, quindi lo setto già io inesistente
          evaluateMonthData(monthIndex, year, 'missing data'); //se arrObjMonth non esiste stampa il calendario senza le festività
        }
      }
    },
    error: function (error) {
      console.log("error", error);
      evaluateMonthData(monthIndex, year, 'data error');
    }
  });
}

//estrapolazione dati num giorni in un mese,nome giorni settimana, nome mesi etc, elaborazioni e pulizia dati a schermo
function evaluateMonthData(monthIndex, yearNum, arrObjMonth) {
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
  checkFestivity(arrObjMonth);
  //creo celle vuote format lunedì primo elemento
  formatInitialEmptySpace(firstMondayOfMonth);
}

//stampa il giorno del calendario a schermo con handlebars
function printCalendar(dayNum, dayOfWeek, currentDate) {
  var source = document.getElementById('calendar-template').innerHTML;
  var calendarTemplate = Handlebars.compile(source);
  var calendarData = { dayNum: dayNum, dayOfWeek: dayOfWeek, currentDate: currentDate };
  var htmlcalendarData = calendarTemplate(calendarData);
  $('.container.days-container').append(htmlcalendarData);
}

//controlla festività presenti e le associa all'attributo html corrispondente
function checkFestivity(arrObjMonth) {
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
    console.log('festivity missing data');
  }
}

//funzione opzionale calcola eventuali spazi bianchi per formattazione lunedì primo elemento
function formatInitialEmptySpace(day) {
  if (day > 1) {
    var whiteSpaces = 8 - day;
    for (var j = 1; j <= whiteSpaces; j++) {
      $('.container.days-container').prepend('<div class="days"></div>')
    }
  }
}

// ritorna funzione in base alla sezione "prev" o "next", aggiorna contatore monthIndex e chiama getMonth con nuovo index mese
function switchMonthBtns(direction) {
  if (direction === "prev") {
    return function (index) {
      if (index > 0) {
        index--;
        getMonth(index);
      }
      return index;
    }
  } else if (direction === "next") {
    return function (index) {
      if (index == 11) {  // solo 2 uguali perchè selMonth return string
        index = 0;
        getMonth(index);
      } else {
        index++;
        getMonth(index);
      }
      return index;
    }
  }
}

$(document).ready(function () {
  var monthIndex = 0;
  //inizializzo all'index primo mese 
  getMonth(monthIndex);

  var prevMonth = switchMonthBtns("prev");
  var nextMonth = switchMonthBtns("next");

  $('.prev-btn').on('click', function () {
    monthIndex = prevMonth(monthIndex);
  });

  $('.next-btn').on('click', function () {
    monthIndex = nextMonth(monthIndex);
  });

  $('#select-month').change(function () {
    var selMonth = $(this).val();
    monthIndex = selMonth;

    getMonth(monthIndex);
  })

});
