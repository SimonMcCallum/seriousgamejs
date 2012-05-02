var gamejs = require('gamejs');

var frameNumber = 0;
var running = false;
//document.frameNumber = frameNumber;
var FPS = 30;
var currentObjective = 70;

$('#submitScore').click(
		function() {
			$.post("http://gamemetrics.otago.ac.nz/scores.php?score="+document.score.value, {score: document.score.value} );
			console.debug("http://gamemetrics.otago.ac.nz/scores.php?score="+document.score.value);
		});
$('#play').click(function() {running=!running; $('#play').button("option", "label", "custom label");});




 
var Heart = function (maxrate)
{
    Heart.superConstructor.apply(this, arguments);
    this.rate= 0.5*maxrate;
    this.beat =0;
    this.beatDuration = 4;
    this.rect= new gamejs.Rect([10,70]);
    
    $("#slider").slider({ orientation: "vertical", min : 20 , max: maxrate, values: [this.rate,this.rate] });
    $("#slider").slider({
    	   slide: function(event, ui) {
    		   console.debug(ui);
    	      if (ui.values[0] == ui.value){
    			   document.heart.rate = ui.value;
    		   }else{ 
    			   return false;
    		   }
    	   }
    	});
   // ever ship has its own scale
   this.originalImage = gamejs.image.load("images/heart.png");
   this.dims = this.originalImage.getSize();
   this.image = gamejs.transform.scale(this.originalImage, [this.dims[0] * (0.5), this.dims[1] *  (0.5)]);
   return this;
};
gamejs.utils.objects.extend(Heart, gamejs.sprite.Sprite);
Heart.prototype.update = function(msDuration) {
   // moveIp = move in place
   if (frameNumber%((FPS*60)/this.rate) > 1){
       this.image = gamejs.transform.scale(this.originalImage, [this.dims[0] * (0.55),this.dims[1] *  (0.55)]);
       this.beat = this.beatDuration;
    }else{
        this.beat--;
       if(this.beat ==1){
           this.beat = 0;
           this.image = gamejs.transform.scale(this.originalImage, [this.dims[0] * (0.5),this.dims[1] *  (0.5)]);
       }
    }
};


var Score = function (initScore)
{
    Score.superConstructor.apply(this, arguments);
    this.value = initScore;
    this.textcontainer = new gamejs.font.Font('18px Sans-serif');
    this.text = this.textcontainer.render('Score ');
    this.rect = new gamejs.Rect([400,10]);
    this.image = this.text;
   return this;
};
gamejs.utils.objects.extend(Score, gamejs.sprite.Sprite);
Score.prototype.update = function(msDuration) {
	console.debug(document.headrate[30]);
	if (document.headrate.length > 30) {
		this.value += Math.abs(document.headrate[30] - document.legsrate[1]);
	}
   this.image = this.textcontainer.render('Score '+this.value);
};




function main() {
    var display = gamejs.display.setMode([700, 480]);
 //   var bloodflow1 = new TimeSeries();
//    var chart = new SmoothieChart({resetBounds: false});
//    var chart = new Flotr();

    gamejs.backgroundImage = gamejs.image.load("images/background.png");

// inherit (actually: set prototype)
 var heart = new Heart(200);
 document.heart = heart;
 var score = new Score(100);
 document.score = score;
 
var graphContainer = document.getElementById("graphcanvas-div");
var headrate = [];
var legsrate = [];
document.headrate=headrate;
document.legsrate=legsrate;


 //   chart.addTimeSeries(bloodflow1, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
   

function basic(container) {
    var i, graph;
    //for (i = score.value/20; i < score.value/20 + 14; i += 0.05) {
    //    head.push([i, Math.sin(i)]);
    //    legs.push([i,document.heart.rate]);
    //}
    
    graph = Flotr.draw(container, [headrate, legsrate], {
        xaxis: {
            minorTickFreq: 4, min : frameNumber-30, max : frameNumber+30
        },
        yaxis: {min : 15, max : 205},
        grid: {
            minorVerticalLines: true
        }
    });
};
   

   var sprites = new gamejs.sprite.Group();
   sprites.add(heart);
   sprites.add(score);


   sprites.update(0);
   //score.update(msDuration);
   for(var i=0;i<30;i++){
	   legsrate.push([i,currentObjective]);
   }
   headrate.push([frameNumber,heart.rate]);
   basic(graphContainer);
   
   
   
//   scoreText = textcontainer.render('Score '+heart.rate);
//   scoreText.rect = new gamejs.Rect([500,10]);
   display.clear();
   display.blit(gamejs.backgroundImage);
   sprites.draw(display);
   
    function tick(msDuration) {
    if(running){
// 	bloodflow1.append(heart.rate, Math.random() * 1000);
        frameNumber +=1;
        sprites.update(msDuration);
        //score.update(msDuration);
        if (headrate.length>60) headrate.shift();
        headrate.push([frameNumber,heart.rate]); //Update the graph with current value of heart
        if (legsrate.length>60) legsrate.shift();
        legsrate.push([frameNumber+30,currentObjective]); //Update the graph with current value of heart
        
        if(Math.random() < 0.02) currentObjective = 20+(Math.random()*160);
        
        
	    basic(graphContainer);
//        scoreText = textcontainer.render('Score '+heart.rate);
//        scoreText.rect = new gamejs.Rect([500,10]);
        display.clear();
        display.blit(gamejs.backgroundImage);
        sprites.draw(display);
        //score.draw(display);
    	}
      return;
    };
    
    
    gamejs.time.fpsCallback(tick, this, FPS);
}

gamejs.preload(["images/background.png","images/heart.png"]);
gamejs.ready(main);
