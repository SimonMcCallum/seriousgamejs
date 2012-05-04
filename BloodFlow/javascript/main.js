var gamejs = require('gamejs');
var draw = require('gamejs/draw');

var frameNumber = 0;
var exerciseTime = 0;
var levelNumber = 0;
var running = false;
//document.frameNumber = frameNumber;
var FPS = 20;
var currentObjective = 70;

//This is the submission of score section.  
function submitScore(value){
	$.post("http://gamemetrics.otago.ac.nz/scores.php?score="+document.score.value+"level="+levelNumber, {score: document.score.value, level: levelNumber} );
	console.debug("http://gamemetrics.otago.ac.nz/scores.php?score="+document.score.value);
}

//respond to button push
$('#submitScore').click(submitScore);


$('#play').click(function() {running=!running; $('#play').button("option", "label", "custom label");});





var Control = function (rectCont, rectDest)
{
	this.radius = 20; //outside radius 
	this.flow = 10; //this is the current flow through the control
	
    Control.superConstructor.apply(this, arguments);
   this.originalImage = gamejs.image.load("images/Artery.png");
   this.dims = this.originalImage.getSize();
   this.image = gamejs.transform.scale(this.originalImage, [1,1]);
   this.rect = gamejs.Rect(rectCont);
   this.rectCont = rectCont;
   var rectD = [];
   rectD[0] =rectCont[0]+2;
   rectD[1] =rectCont[1]+this.radius;
  draw.circle(gamejs.backgroundImage, "#ff3366",rectCont, this.radius,  0);
  draw.circle(gamejs.backgroundImage, "#fffff",rectCont, this.flow,  0);

  draw.line(gamejs.backgroundImage, "#ff3366",rectD,rectDest,2); //[this.rect.x+2, this.rect.y-radius], [this.rectD.x, this.rectD.y], 2);
   rectD[1] =rectCont[1]-this.radius;
   draw.line(gamejs.backgroundImage, "#ff3366",rectD,rectDest,2); //[this.rect.x+2, this.rect.y-radius], [this.rectD.x, this.rectD.y], 2);
   return this;
};

gamejs.utils.objects.extend(Control, gamejs.sprite.Sprite);
Control.prototype.update = function(msDuration) {
	  draw.circle(gamejs.backgroundImage, "#ff3366",this.rectCont, this.radius,  0);
	  draw.circle(gamejs.backgroundImage, "#ffffff",this.rectCont, this.flow,  0);
};



 
var Heart = function (maxrate)
{
    Heart.superConstructor.apply(this, arguments);
    this.rate= 0.5*maxrate;
    this.rateGoal= this.rate;
    this.ratedelta= 0.0;
     this.beat =0;
    this.beatDuration = 4;
    this.rect= new gamejs.Rect([10,70]);
    
    $("#slider").slider({ orientation: "vertical", min : 20 , max: maxrate, value: this.rate });
    $("#slider").slider({
    	   slide: function(event, ui) {
    		// console.debug(ui);
    	     document.heart.rateGoal = ui.value;
    	   }
    	});
   // ever ship has its own scale
   this.originalImage = gamejs.image.load("images/heart.png");
   this.dims = this.originalImage.getSize();
   this.image = gamejs.transform.scale(this.originalImage, [this.dims[0] * (0.4), this.dims[1] *  (0.4)]);
   return this;
};

gamejs.utils.objects.extend(Heart, gamejs.sprite.Sprite);

Heart.prototype.update = function(msDuration) {
   // moveIp = move in place
	/*if ((this.rateGoal - this.rate) > 0) {
		this.ratedelta += 0.2; 
	}else if ((this.rateGoal - this.rate) < 0){
		this.ratedelta -= 0.2; 
	} */
	this.ratedelta = this.rateGoal - this.rate;
	console.debug(this.ratedelta+" "+this.rateGoal + this);
	this.ratedelta = Math.min(Math.max(this.ratedelta, -5),+5);
	this.rate += this.ratedelta;
  if (frameNumber%((FPS*60)/this.rate) < 1){
       this.image = gamejs.transform.scale(this.originalImage, [this.dims[0] * (0.45),this.dims[1] *  (0.45)]);
       this.beat = this.beatDuration;
    }else{
        this.beat--;
       if(this.beat ==1){
           this.beat = 0;
           this.image = gamejs.transform.scale(this.originalImage, [this.dims[0] * (0.4),this.dims[1] *  (0.4)]);
       }
    }
};

function calcScore(est, base){
	dist = Math.abs(est - base);
	if (dist < 10) return 1;
	if (dist > 20) return 0;
	return ((20 - dist)/10);
}
document.calcScore = calcScore;

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
	console.debug(document.gameState.rates.headrate[30], document.gameState.rates.legsrate[30]);
//	console.debug(Math.abs((document.headrate[60])[1] - document.gameState.rates.legsrate[30][1]));
	console.debug(document.gameState.rates.headrate.length);
	if (document.gameState.rates.headrate.length > 30) {
		partialvalue = document.calcScore(document.gameState.rates.headrate[30][1],document.gameState.rates.legsrate[30][1]);
		this.value +=partialvalue;
	}
   this.image = this.textcontainer.render('Score '+Math.round(this.value));
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
 var score = new Score(0);
 document.score = score;
 
var graphContainer = document.getElementById("graphcanvas-div");

//create a game state to put items into so they can be accessesd
var gameState= new Object();
document.gameState = gameState;

var rates = new Object();
rates.headrate = [];
rates.legsrate = [];
rates.armsrate = [];
rates.lowerlegrate = [];
rates.upperlegrate = [];

var controls = new Object();
controls.head = new Control([350,80], [620,70]);
//controls.legs = new Control([300,120], [620,70]);
controls.arms = new Control([300,140], [570,110]);
controls.lowerleg = new Control([300,220], [600,250]);
controls.upperleg = new Control([350,270], [600,320]);

gameState.rates=rates;


 //   chart.addTimeSeries(bloodflow1, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
   

function basic(container) {
    var i, graph;
    //for (i = score.value/20; i < score.value/20 + 14; i += 0.05) {
    //    head.push([i, Math.sin(i)]);
    //    legs.push([i,document.heart.rate]);
    //}
    
    graph = Flotr.draw(container, [rates.headrate, rates.legsrate], {
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
   sprites.add(controls.head);
   sprites.add(controls.arms);


   sprites.update(0);
   score.update(0);
   
   for(var i=0;i<30;i++){
	   rates.legsrate.push([i,currentObjective]);
   }
   rates.headrate.push([frameNumber,heart.rate]);
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
        score.update(msDuration);
        if (rates.headrate.length>30) rates.headrate.shift();
        rates.headrate.push([frameNumber,heart.rate]); //Update the graph with current value of heart
        if (rates.legsrate.length>60) rates.legsrate.shift();
        rates.legsrate.push([frameNumber+30,currentObjective]); //Update the graph with current value of heart
        
        if(Math.random() < 0.02) currentObjective = 20+(Math.random()*160);
        
        
	    basic(graphContainer);
//        scoreText = textcontainer.render('Score '+heart.rate);
//        scoreText.rect = new gamejs.Rect([500,10]);
        display.clear();
        display.blit(gamejs.backgroundImage);
        sprites.draw(display);
        //score.draw(display);
        if (frameNumber > 500){
        	running = false;
        	submitScore();
        }
       }
      return;
    };
    
    
    gamejs.time.fpsCallback(tick, this, FPS);
}

gamejs.preload(["images/background.png","images/heart.png","images/Artery.png"]);
gamejs.ready(main);
