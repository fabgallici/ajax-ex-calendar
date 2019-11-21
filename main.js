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
  //estrapolare quanti giorni ha un mese
  // var yearAndMonth = objMonth[0].date.slice(0,7);
  var firstDayInMonthDate = objMonth[0].date;
  var daysInAMonth = moment(firstDayInMonthDate, "YYYY-MM-DD").daysInMonth();
  var monthName = moment(firstDayInMonthDate, "YYYY-MM-DD").format('MMMM');
  var yearNum = moment(firstDayInMonthDate, "YYYY-MM-DD").format('YYYY');
  var dayOfTheWeek = moment(firstDayInMonthDate, "YYYY-MM-DD").format('ddd');
  console.log(firstDayInMonthDate);
  console.log('daysInAMonth', daysInAMonth);
  console.log('monthname', monthName);
  console.log('year', yearNum);
  console.log('dayoftheweek', dayOfTheWeek);
  for (i = 1; i <= daysInAMonth; i++) {
    //creare una data del giorno es 2018-01-01 da usare come attributo
    var currentDate = moment(yearNum + '-' + monthName + '-' + i, 'YYYY-MMMM-D').format('YYYY-MM-DD');
    console.log('currendata', currentDate);
    printCalendar(i, monthName, currentDate);
    // console.log(i, monthName);
  }

  //inserire le festività nella lista
  checkFestivity(objMonth);
}

function evaluateMonthData() {
  //da pensare come dividere func

}

function printCalendar(day, monthName, currentDate) {
  var source = document.getElementById('calendar-template').innerHTML;
  var calendarTemplate = Handlebars.compile(source);
  // var calendarData = { dayNumber: day, monthName: monthName};
  var calendarData = { dayNumber: day, monthName: monthName, currentDate: currentDate };
  var htmlcalendarData = calendarTemplate(calendarData);
  $('.container.days-container').append(htmlcalendarData);
}

function checkFestivity(objMonth) {
  objMonth.forEach(el => {
    var festName = el.name;
    var date = el.date;
    console.log('festname', festName, date);
    //aggiungo festività in pagina e cambio background cella
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