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
          icon: $("#icon").attr("href"),
		  requireInteraction: true
        });
      }
  }

  var notifyAllowed = false;

  if (window.Notification) {
    if (Notification.permission === "granted") {
      notifyAllowed = true;
    } else if (Notification.permission !== 'denied') {
      $('<button type="button" id="requestNotify">Enable Notification</button>').appendTo("body").click(function(ev){
        ev.preventDefault();
        Notification.requestPermission(function (permission) {
          if(permission == "granted") {
            notifyAllowed = true;
            $("#requestNotify").remove();
          }
        });
      });
    }
  }

  function stopAt(stopTime) {
	$("#reset").show();
    stop = stopTime;
    if (doneTimeout) {
      clearTimeout(doneTimeout);
    }
	localStorage.setItem("stop", stop);

    doneTimeout = setTimeout(function(){
	  $("#reset").hide();
      clearInterval(updateInterval);
	  localStorage.removeItem("stop");
      notify();
    }, Math.max(0, stop - Date.now()));

    update();
  }

  function reset() {
    start = Date.now();
	stop = null;
	localStorage.removeItem("stop");
    if (doneTimeout) {
      clearTimeout(doneTimeout);
    }
  }

  var updateInterval = setInterval(update, INTERVAL),
    doneTimeout;

  $("#go").click(function(){
    var duration = parseFloat($("#duration").val());
    var stop = duration * 1000 * 60 + start;
    stopAt(stop);
  });

  $("#reset").click(reset);

  $("#duration").on("input", function(){
    var val = parseFloat($(this).val());
    val *= 60;
    $("#durationDisplay").text(timeString(val));
  });


  //Check for saved stop time, so the timer survives reloads.
  function restoreTimer(){
    var savedStop = localStorage.getItem("stop");
	if(savedStop){ 
		stopAt(savedStop);
	}
  }

  restoreTimer();
});
