$(function(){
  var INTERVAL = 1000;
  var updateInterval = setInterval(update, INTERVAL);

  var start = Date.now(),
    stop;

  function update(){
    if (stop != null) {
      var remaining = 1000 * (stop - start);
      $("#timeLeft").text("T - " + remaining + "s");
    } else {
      var elapsed = 1000 * (Date.now() - start);
      $("#timeLeft").text("elapsed:  " + remaining + "s");
    }
  }
});
