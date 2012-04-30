var gamejs = require('gamejs');
var heart = require('heart');

gamejs.preload([]);



 


function main() {
    var display = gamejs.display.setMode([700, 480]);
    var textcontainer = new gamejs.font.Font('30px Sans-serif');
    var headtext = textcontainer.render('Blood Flow');
    display.blit(headtext);
 //   var bloodflow1 = new TimeSeries();
//    var chart = new SmoothieChart({resetBounds: false});
//    var chart = new Flotr();

    gamejs.backgroundImage = gamejs.image.load("images/background.png");


 //   chart.addTimeSeries(bloodflow1, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
   

function basic(container) {
    var d1 = [
        [0, 3],
        [4, 8],
        [8, 5],
        [9, 13]
    ],
        d2 = [],
        i, graph;
    for (i = 0; i < 14; i += 0.5) {
        d2.push([i, Math.sin(i)]);
    }
    graph = Flotr.draw(container, [d1, d2], {
        xaxis: {
            minorTickFreq: 4
        },
        grid: {
            minorVerticalLines: true
        }
    });
}




    function tick(msDuration) {
// 	bloodflow1.append(heart.rate, Math.random() * 1000);
	    basic(document.getElementById("graphcanvas-div"));
        heartrate += 1;
        display.clear();
        display.blit(gamejs.backgroundImage);
        display.blit(textcontainer.render('Blood'+heartrate));
        basic(document.getElementById("gjs-graph"));
        return;
    };
    
    
    gamejs.time.fpsCallback(tick, this, 1);
}

gamejs.preload(['images/background.png']);
gamejs.ready(main);
