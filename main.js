function getMonth() {
  $.ajax({
    url: "https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0",
    method: "GET",
    success: function (data) {
      var objMonth = data.response;
      console.log('success', objMonth);
      convertMonth(objMonth);
    },
    error: function (error) {
      console.log("error", error);
    }
  });
}

function convertMonth(objMonth) {
  var firstDayInMonthDate = objMonth[0].date;
  var daysInAMonth = moment(firstDayInMonthDate, "YYYY-MM-DD").daysInMonth();
  var monthName = moment(firstDayInMonthDate, "YYYY-MM-DD").format('MMMM');
  var yearNum = moment(firstDayInMonthDate, "YYYY-MM-DD").format('YYYY');
  // console.log('daysInAMonth', daysInAMonth);
  // console.log('monthname', monthName);
  // console.log('year', yearNum);

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

$(document).ready(function () {
  getMonth();
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