function getMonth() {
  $.ajax({
    url: "https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0",
    method: "GET",
    success: function (data) {
      console.log('success', data);

    },
    error: function (error) {
      console.log("error", error);
    }
  });
}





$(document).ready(function () {
  getMonth();
});
