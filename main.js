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
  console.log(yearAndMonth);
  console.log('daysInAMonth', daysInAMonth);
  console.log('monthname', monthName);
  // objMonth.array.forEach(el => {
    
  // });
  
  // var daysInAMonth = moment("2012-02-01", "YYYY-MM").daysInMonth();
  //creare una lista di n° giorni elementi

  //inserire le festività nella lista
}




$(document).ready(function () {
  getMonth();
});
