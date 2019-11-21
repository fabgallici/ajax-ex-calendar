var monthIndex = 0;

function getMonth(monthIndex) {
  var monthUrl = "https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=" + monthIndex;
  $.ajax({
    url: monthUrl,
    method: "GET",
    success: function (data) {
      var objMonth = data.response;
      console.log('success', objMonth);
      convertMonth(monthIndex, objMonth);
    },
    error: function (error) {
      console.log("error", error);
    }
  });
}

//estrapolazione dati num giorni in un mese, nome mesi, anno e 
//divisione step successivi dati mese e controllo festività
function convertMonth(monthIndex, objMonth) {
  const yearNum = 2018;
  var monthNum = monthIndex + 1; // aumento per parificare notazione momentjs
  // var firstDayInMonthDate = objMonth[0].date;
  var currentMonth = yearNum + '-' + monthNum;
  var daysInAMonth = moment(currentMonth, "YYYY-MM-DD").daysInMonth();
  var monthName = moment(currentMonth, "YYYY-MM-DD").format('MMMM');
  // var yearNum = moment(firstDayInMonthDate, "YYYY-MM-DD").format('YYYY');
  // console.log('daysInAMonth', daysInAMonth);
  // console.log('monthname', monthName);
  // console.log('year', yearNum);

  $('.days-container').empty();
  evaluateMonthData(daysInAMonth, monthName, yearNum);
  //stampa titolo con mese corrente
  document.getElementById('current-month').innerText = monthName + ' - ' + yearNum;
  //inserire le festività presenti nel calendario
  checkFestivity(objMonth);
}

//ciclo in base ai numeri del mese, estrapolando numero del giorno e giorno della settimana
function evaluateMonthData(daysInAMonth, monthName, yearNum) {
  //da pensare come dividere func
  for (i = 1; i <= daysInAMonth; i++) {
    //creare una data del giorno es 2018-01-01 da usare come attributo
    var currentDate = moment(yearNum + '-' + monthName + '-' + i, 'YYYY-MMMM-D').format('YYYY-MM-DD');
    var dayOfTheWeek = moment(currentDate, "YYYY-MM-DD").format('ddd');
    // console.log('dayoftheweek', dayOfTheWeek);
    // console.log('currendata', currentDate);
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

function switchMonthBtns(direction) {
  if (direction === "prev") {
    return function () {
      if (monthIndex > 0) {
        monthIndex--;
        getMonth(monthIndex);
      } else {
        monthIndex = 0;
        getMonth(monthIndex);
      }
    }
    
  } else if (direction === "next") {
    return function () {
      if (monthIndex === 11) {
        monthIndex = 0;
        getMonth(monthIndex);
      } else {
        monthIndex++;
        getMonth(monthIndex);
      }
    }
  }
}

$(document).ready(function () {
  
  //inizializzo al primo mese 
  getMonth(monthIndex);

  $('.prev-btn').on('click', function() {
    var prevMonth = switchMonthBtns("prev");
    prevMonth();
  })

  $('.next-btn').on('click', function () {
    var nextMonth = switchMonthBtns("next");
    nextMonth();
  })

  // $('.prev-btn').on('click', function() {
  //   if (monthIndex > 0) {
  //     monthIndex--;
  //     getMonth(monthIndex);
  //   } else {
  //     monthIndex = 0;
  //     getMonth(monthIndex);
  //   }
  // })

  // $('.next-btn').on('click', function () {
  //   if (monthIndex === 11) {
  //     monthIndex = 0;
  //     getMonth(monthIndex);
  //   } else {
  //     monthIndex++;
  //     getMonth(monthIndex);
  //   }
  // })
});

  // objMonth.array.forEach(el => {

  // });



// function printCalendar(dayObj) {
//   var source = document.getElementById('calendar-template').innerHTML;
//   var calendarTemplate = Handlebars.compile(source);
//   // var calendarData = { dayNumber: day, monthName: monthName};
//   var calendarData = dayObj;
//   var htmlcalendarData = calendarTemplate(calendarData);
//   $('.container.days-container').append(htmlcalendarData);
// }