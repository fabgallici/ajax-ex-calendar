

function getMonth(monthIndex) {
  const year = 2018;
  var monthUrl = "https://flynn.boolean.careers/exercises/api/holidays?year=" + year + "&month=" + monthIndex;
  $.ajax({
    url: monthUrl,
    method: "GET",
    success: function (data) {
      var objMonth = data.response;
      console.log('success', objMonth);
      convertMonth(monthIndex, objMonth, year);
    },
    error: function (error) {
      console.log("error", error);
    }
  });
}

//estrapolazione dati num giorni in un mese, nome mesi, anno e 
//divisione step successivi dati mese e controllo festività
function convertMonth(monthIndex, objMonth, yearNum) {
  var monthNum = monthIndex + 1; // aumento per parificare notazione momentjs
  // var firstDayInMonthDate = objMonth[0].date;
  var currentMonth = yearNum + '-' + monthNum;
  var daysInAMonth = moment(currentMonth, "YYYY-MM-DD").daysInMonth();
  var monthName = moment(currentMonth, "YYYY-MM-DD").format('MMMM');
  // console.log('daysInAMonth', daysInAMonth, 'monthname', monthName, 'year', yearNum);
  //ripulisco il container prima di immettere nuovi dati
  $('.days-container').empty();
  evaluateMonthData(daysInAMonth, monthName, yearNum);
  //stampa titolo con mese corrente
  document.getElementById('current-month').innerText = monthName + ' - ' + yearNum;
  //inserire le festività presenti nel calendario
  checkFestivity(objMonth);
}

//ciclo in base ai numeri del mese, estrapolando numero del giorno e giorno della settimana
function evaluateMonthData(daysInAMonth, monthName, yearNum) {
  for (i = 1; i <= daysInAMonth; i++) {
    var currentDate = moment(yearNum + '-' + monthName + '-' + i, 'YYYY-MMMM-D').format('YYYY-MM-DD');
    var dayOfTheWeek = moment(currentDate, "YYYY-MM-DD").format('ddd');
    // console.log('dayoftheweek', dayOfTheWeek, 'currendata', currentDate);
    printCalendar(i, dayOfTheWeek, currentDate);
  }
}

//stampa calendario a schermo con handlebars
function printCalendar(dayNum, dayOfWeek, currentDate) {
  var source = document.getElementById('calendar-template').innerHTML;
  var calendarTemplate = Handlebars.compile(source);
  var calendarData = { dayNum: dayNum, dayOfWeek: dayOfWeek, currentDate: currentDate };
  var htmlcalendarData = calendarTemplate(calendarData);
  $('.container.days-container').append(htmlcalendarData);
}

//controlla festività presenti e le associa all'attributo html corrispondente
function checkFestivity(objMonth) {
  objMonth.forEach(el => {
    var festName = el.name;
    var date = el.date;
    console.log('festname', festName, date);
    //aggiungo festività in pagina e cambio bg-color cella
    $(`.date[data-name="${date}"]`)
      .html(festName)
      .closest('.days')
      .addClass('bg-fest');

  });
}

//ritorna funzione in base alla sezione "prev" o "next", aggiorna contatore monthIndex e chiama getMonth con nuovo index mese
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
      if (index === 11) {
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
  //inizializzo al primo mese 
  getMonth(monthIndex);

  var prevMonth = switchMonthBtns("prev");
  var nextMonth = switchMonthBtns("next");

  $('.prev-btn').on('click', function() {
    monthIndex = prevMonth(monthIndex);
  });

  $('.next-btn').on('click', function() {
    monthIndex = nextMonth(monthIndex);
  });

});
