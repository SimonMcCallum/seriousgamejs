var gamejs = require('gamejs');
var heartrate = 10;

gamejs.preload([]);

gamejs.ready(function() {

    var display = gamejs.display.setMode([200, 100]);
    var textcontainer = new gamejs.font.Font('30px Sans-serif');
    var headtext = textcontainer.render('Blood Flow');
    display.blit(headtext);
    var bloodflow1 = new TimeSeries();
    var chart = new SmoothieChart({resetBounds: false});

    chart.addTimeSeries(bloodflow1, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
   
    function tick(msDuration) {
	bloodflow1.append(heartrate, Math.random() * 1000);
	chart.streamTo(document.getElementById("chart"), 500);
        heartrate += 1;
        display.clear();
        display.blit(textcontainer.render('Blood'+heartrate));
        return;
    };
    gamejs.time.fpsCallback(tick, this, 1);
    
});
