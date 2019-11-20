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

function evaluateMonthData() {
  

}

function convertMonth(objMonth) {
  //estrapolare quanti giorni ha un mese
  // var yearAndMonth = objMonth[0].date.slice(0,7);
  var yearAndMonth = objMonth[0].date;
  var daysInAMonth = moment(yearAndMonth, "YYYY-MM-DD").daysInMonth();
  var monthName = moment(yearAndMonth, "YYYY-MM-DD").format('MMMM');
  var yearName = moment(yearAndMonth, "YYYY-MM-DD").format('YYYY');
  console.log(yearAndMonth);
  console.log('daysInAMonth', daysInAMonth);
  console.log('monthname', monthName);
  console.log('year', yearName);
  for (i = 1; i <= daysInAMonth; i++) {
    //creare una data del giorno es 2018-01-01 da usare come attributo
    var currentDate = moment(yearName + '-' + monthName + '-' + i, 'YYYY-MMMM-D').format('YYYY-MM-DD');
    console.log('currendata', currentDate);
    printCalendar(i, monthName, currentDate);
    // console.log(i, monthName);
  }
  // objMonth.array.forEach(el => {
    
  // });
  
  // var daysInAMonth = moment("2012-02-01", "YYYY-MM").daysInMonth();
  //creare una lista di n° giorni elementi

  //inserire le festività nella lista
}

function printCalendar(day, month, currentDate) {
  var source = document.getElementById('calendar-template').innerHTML;
  var calendarTemplate = Handlebars.compile(source);
  // var calendarData = { dayNumber: day, monthName: month};
  var calendarData = { dayNumber: day, monthName: month, festDate: currentDate };
  var htmlcalendarData = calendarTemplate(calendarData);
  $('.container.days-container').append(htmlcalendarData);
}


$(document).ready(function () {
  getMonth();
});
