$(function(){
  var INTERVAL = 1000;
  var start = Date.now(),
    stop;

  //Turns seconds into m:ss
  function timeString(val){
    var sec = val % 60;
    var min = (val - sec) / 60;
    var text = min + (sec < 10 ? ":0" :  ":") + sec;
    return text;
  }
    
  function update(){
    if (stop != null) {
      var remaining = Math.round((stop - Date.now())/1000);
      $("#timeLeft").text("T - " + timeString(remaining));
    } else {
      var elapsed = Math.round((Date.now() - start)/1000);
      $("#timeLeft").text("elapsed:  " + timeString(elapsed));
    }
  }

  function notify(){
      $("#timeLeft").text("Done. " + new Date());
      $title = $("title");
      $title.text($title.text() + " - Done");
      if (notifyAllowed) {
        new Notification("Tea is ready.", {
          icon: $("#icon").attr("href")
        });
      }
  }

  var notifyAllowed = false;

  if (window.Notification) {
    if (Notification.permission === "granted") {
      notifyAllowed = true;
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        if(permission == "granted") {
          notifyAllowed = true;
        }
      });
    }
  }

  var updateInterval = setInterval(update, INTERVAL),
    doneTimeout;

  $("#go").click(function(){
    var duration = parseInt($("#duration").val(), 10);
    stop = duration * 1000 * 60 + start;

    if (doneTimeout) {
      clearTimeout(doneTimeout);
    }

    doneTimeout = setTimeout(function(){
      clearInterval(updateInterval);
      notify();
    }, stop - Date.now());

    update();
  });

  $("#duration").on("input", function(){
    var val = parseFloat($(this).val());
    val *= 60;
    $("#durationDisplay").text(timeString(val));
  });

});
