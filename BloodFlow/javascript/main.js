var gamejs = require('gamejs');
var draw = require('gamejs/draw');


//create a game state to put items into so they can be accessesd
var gameState= new Object();
document.gameState = gameState;

gameState.levels = [];
gameState.levels[0] = [[0,70],[20,80]];
gameState.level = 0;
var frameNumber = 0;
var exerciseTime = 0;
gameState.running = false;
//document.frameNumber = frameNumber;
var FPS = 20;
var currentObjective = 70;

//This is the submission of score section.  
function submitScore(value){
	$.post("http://gamemetrics.otago.ac.nz/scores.php?score="+document.score.value+"&level="+gameState.level, {score: document.score.value, level: gameState.level} );
	console.debug("http://gamemetrics.otago.ac.nz/scores.php?score="+document.score.value);
}

//respond to button push
$('#submitScore').click(submitScore);





var Control = function (rectCont, rectDest, slider, colour, rate)
{
	this.radius = 30; //outside radius 
	this.flow = 10; //this is the current flow through the control
	this.rate = rate;
   Control.superConstructor.apply(this, arguments);
   this.originalImage = gamejs.image.load("images/Artery.png");
   this.dims = this.originalImage.getSize();
   this.image = gamejs.transform.scale(this.originalImage, [1,1]);
   this.colour = colour;
   this.rect = gamejs.Rect(rectCont);
   this.rectCont = rectCont;
   var rectD = [];
   slider.slider({ orientation: "vertical", min : 2 , max: 20, value: 10});
   slider.css({ width : 6+"px", height: (this.radius*2)+"px", position:"absolute", top: (rectCont[1]-this.radius)+"px",  left: (rectCont[0]-(this.radius+15))+"px"});
   slider.slider({
   	   slide: function(event, ui) {
   	     //console.debug(this, event, ui);
   	     document.gameState.controls.updateFlow(this.id, ui.value);

   	   }
   	});

   rectD[0] =rectCont[0]+2;
   rectD[1] =rectCont[1]+this.radius;
  draw.circle(gamejs.backgroundImage, "#ff3366",rectCont, this.radius,  0);
  draw.circle(gamejs.backgroundImage, "#ffffff",rectCont, this.flow,  0);

  draw.line(gamejs.backgroundImage, this.colour,rectD,rectDest,2); //[this.rect.x+2, this.rect.y-radius], [this.rectD.x, this.rectD.y], 2);
   rectD[1] =rectCont[1]-this.radius;
   draw.line(gamejs.backgroundImage, this.colour,rectD,rectDest,2); //[this.rect.x+2, this.rect.y-radius], [this.rectD.x, this.rectD.y], 2);
   return this;
};

gamejs.utils.objects.extend(Control, gamejs.sprite.Sprite);
Control.prototype.update = function(msDuration) {
	  draw.circle(gamejs.backgroundImage, "#ffffff",this.rectCont, this.radius+1,  0);
	  draw.circle(gamejs.backgroundImage, "#ff3366",this.rectCont, this.radius,  0);
	  draw.circle(gamejs.backgroundImage, "#ffffff" ,this.rectCont, this.flow,  0);
};
Control.prototype.setFlow = function(value) {
	  this.flow = Math.max(Math.min(value,radius-2, 2));
};


 
var Heart = function (maxrate)
{
    Heart.superConstructor.apply(this, arguments);
    this.rate= 0.5*maxrate;
    this.maxrate = maxrate;
    this.rateGoal= this.rate;
    this.ratedelta= 0.0;
     this.beat =0;
    this.beatDuration = 4;
    this.rect= new gamejs.Rect([10,70]);
    
    $("#heartRateSlider").slider({ orientation: "vertical", min : 20 , max: maxrate, value: this.rate });
    $("#heartRateSlider").slider({
    	   slide: function(event, ui) {
    		// console.debug(ui);
    	     document.heart.rateGoal = ui.value;
    	   }
    	});
    bar = new Object();
    bar.x = 30;
    bar.y = 90;
    bar.width =15;
    bar.range = 40;
	draw.rect(gamejs.backgroundImage, "#ff0000",[bar.x,bar.y,bar.x+bar.width,bar.y+bar.range],2);
	draw.rect(gamejs.backgroundImage, "#ff0000",[bar.x,bar.y+(bar.range*((this.rate-20)/(maxrate-20))),bar.x+bar.width,bar.y+bar.range],0);

    
    
    
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
	//console.debug(this.ratedelta+" "+this.rateGoal + this);
	this.ratedelta = Math.min(Math.max(this.ratedelta, -5),+5);
	this.rate += this.ratedelta;
	console.debug(gamejs.backgroundImage,bar,this.rate);
	draw.rect(gamejs.backgroundImage, "#ff0000",[bar.x,bar.y,bar.x+bar.width,bar.y+bar.range],2);
	draw.rect(gamejs.backgroundImage, "#ff0000",[bar.x,bar.y+(bar.range*((this.rate-20)/(this.maxrate-20))),bar.x+bar.width,bar.y+bar.range],0);
	if (document.gameState.running == false){
//		document.gameState.rates.headrate[document.gameState.rates.headrate.length-2]=[frameNumber-1,document.heart.rate];
//		document.gameState.rates.headrate[document.gameState.rates.headrate.length-1]=[frameNumber  ,document.heart.rate];
	}
		
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
//	console.debug(document.gameState.rates.headrate[30], document.gameState.rates.legsrate[30]);
//	console.debug(Math.abs((document.headrate[60])[1] - document.gameState.rates.legsrate[30][1]));
//	console.debug(document.gameState.rates.headrate.length);
//	if (document.gameState.rates.headrate.length > 30) {
//		partialvalue = document.calcScore(document.gameState.rates.headrate[30][1],document.gameState.rates.legsrate[30][1]);
//		this.value +=partialvalue;
//	}
   this.image = this.textcontainer.render('Score '+Math.round(this.value));
};
Score.prototype.updateScore = function(value) {
//	console.debug(document.gameState.rates.headrate[30], document.gameState.rates.legsrate[30]);
//	console.debug(Math.abs((document.headrate[60])[1] - document.gameState.rates.legsrate[30][1]));
//	console.debug(document.gameState.rates.headrate.length);
	if (document.gameState.rates.headrate.length > 30) {
		partialvalue = document.calcScore(document.gameState.rates.headrate[30][1],document.gameState.rates.legsrate[30][1]);
		this.value +=partialvalue;
	}
   this.image = this.textcontainer.render('Score '+Math.round(this.value));
};


//*********************Main  ******************************
function loading() {
	var menu = new Object();
	menu.fade = false;
	frameNumber=0;
	
	$("#menu").css({background: "url('images/menu.png')"});
	$("#playGame").button();
	$("#playGame").position({of:$("#menu"), at: "center bottom", offset: "-50 -150"});
	$("#playGame").text(" Level 1 ");
	$("#playGame").click(function() {
		menu.fade= true;
		 });
	function loadtick(msDuration) {
		if (menu.fade) {
			frameNumber++;
			$("#menu").css({opacity: (10-frameNumber)/10});
		}
		if (frameNumber>10){
			gamejs.time.deleteCallback(loadtick, FPS);
			$("#menu").hide();		
			main();	
		}
	}
    gamejs.time.fpsCallback(loadtick, this, FPS);
    return;
}

function main() {
	
    var display = gamejs.display.setMode([700, 480]);
 //   var bloodflow1 = new TimeSeries();
//    var chart = new SmoothieChart({resetBounds: false});
//    var chart = new Flotr();
    frameNumber=0;
    gameState.running =false;
    
    gamejs.backgroundImage = gamejs.image.load("images/background.png");

 $("#play").button();
 $("#play").text(" Play ");
 $("#play").click(function() {
	 if (gameState.running){
		 gameState.running =false; 
		 $("#play").text("Play");
	 } else {
		 gameState.running =true; 
		 $("#play").text("Pause"); 
	 }
	 });

 var heart = new Heart(200);
 document.heart = heart;
 var score = new Score(0);
 document.score = score;
 
var graphContainer = document.getElementById("graphcanvas-div");






var rates = new Object();
rates.headrate = [];
rates.legsrate = [];
rates.armsrate = [];
rates.lowerlegrate = [];
rates.upperlegrate = [];

var controls = new Object();
controls.head = new Control([240,80], [550,70],$("#artHead"), "#ff6699", rates.headrate );
//controls.legs = new Control([300,120], [620,70]);
controls.arms = new Control([190,175], [495,110],$("#artArms"), "#ff9966", rates.armsrate);
controls.upperLeg = new Control([240,270], [530,250],$("#artUpperLeg"), "#6699ff", rates.upperlegrate );
//controls.lowerLeg = new Control([200,270], [530,320],$("#artLowerLeg"));

gameState.rates=rates;
gameState.controls = controls;

gameState.controls.updateFlow = function (id,value){
	//console.debug(id,value,controls);
	if (id == "artHead" ) {
		controls.head.flow = value;
   		if (document.gameState.running == false){
   			controls.head.rate[0]=[frameNumber-1,value*10];
   			controls.head.rate[1]=[frameNumber  ,value*10];
		}
	}
	if (id == "artArms" ) {
		controls.arms.flow = value;
   		if (document.gameState.running == false){
   			controls.arms.rate[0]=[frameNumber-1,value*10];
   			controls.arms.rate[1]=[frameNumber  ,value*10];
		}
	}
	if (id == "artLowerLeg" ) {
		controls.lowerLeg.flow = value;
 	}
	if (id == "artUpperLeg" ) {
		controls.upperLeg.flow = value;
   		if (document.gameState.running == false){
   			controls.upperLeg.rate[0]=[frameNumber-1,value*10];
   			controls.upperLeg.rate[1]=[frameNumber  ,value*10];
		}
	}
	console.debug(controls.head.flow);
	
};

 //   chart.addTimeSeries(bloodflow1, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
   


function basic(container) {
    
    graph = Flotr.draw(container, [rates.headrate, rates.armsrate, rates.upperlegrate, rates.legsrate, document.gameState.levels[document.gameState.level]], {
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
   sprites.add(controls.upperLeg);
//   sprites.add(controls.lowerLeg);


   sprites.update(0);
   score.update(0);
   
   for(var i=0;i<30;i++){
	   rates.legsrate.push([i,currentObjective]);
   }
   rates.headrate.push([frameNumber-1,controls.head.flow]);
   rates.headrate.push([frameNumber,controls.head.flow]);
   rates.armsrate.push([frameNumber-1,controls.arms.flow]);
   rates.armsrate.push([frameNumber,controls.arms.flow]);
   rates.upperlegrate.push([frameNumber-1,controls.upperLeg.flow]);
   rates.upperlegrate.push([frameNumber,controls.upperLeg.flow]);

   
   
   
   basic(graphContainer);
   
   
   
//   scoreText = textcontainer.render('Score '+heart.rate);
//   scoreText.rect = new gamejs.Rect([500,10]);
   display.clear();
   display.blit(gamejs.backgroundImage);
   sprites.draw(display);
   
   
   var events = gamejs.event.get();
   
   events.forEach(function(event) {
		console.debug(event);
      if (event.type === gamejs.event.MOUSE_DOWN) {
        var hitTest = sprites.collidePoint(event.pos);
    	if (hitTest.length > 0){
    		console.debug(hitTest);
        	hitTest[0].setRate(15);
        }
      }
   });
   
   
    function tick(msDuration) {
        sprites.update(msDuration);
  	
    if(gameState.running){
//    	   var events = gamejs.event.get();
 /*   	   
    	   events.forEach(function(event) {
    	      if (event.type === gamejs.event.MOUSE_DOWN) {
      			console.debug(event);
    	        var hitTest = sprites.collidePoint();
    	    	if (hitTest.length > 0){
    	    		console.debug(hitTest);
    	        	hitTest[0].setRate(15);
    	        }
    	      }
    	   });
 */   	
        frameNumber +=1;
        
        score.updateScore(3);
        
        if (rates.headrate.length>30) {
        	rates.headrate.shift();
        }

        rates.headrate.push([frameNumber,controls.head.flow*10]); //Update the graph with current value of heart
        rates.armsrate.push([frameNumber,controls.arms.flow*10]); //Update the graph with current value of heart
        rates.upperlegrate.push([frameNumber,controls.upperLeg.flow*10]); //Update the graph with current value of heart

        if (rates.legsrate.length>60) {
        	rates.legsrate.shift();
        }
        if (frameNumber < 500-30){
        	rates.legsrate.push([frameNumber+30,currentObjective]); //Update the graph with current value of heart
        }
        if(frameNumber%30 == 0) {
        	currentObjective = Math.min(Math.max(currentObjective+(-40 +(Math.random()*80)),20),200);
           	if (currentObjective<50) currentObjective += 10;
           	if (currentObjective>150) currentObjective -= 10;
                   }
        
        

//        scoreText = textcontainer.render('Score '+heart.rate);
//        scoreText.rect = new gamejs.Rect([500,10]);
	    if (frameNumber > 500){
        	submitScore();
        	gameState.running = false;
			gamejs.time.deleteCallback(tick, FPS);
			$("#menu").css({opacity: 1});
			$("#menu").show(200);		
			loading();
        }
       } // end the running code
    	basic(graphContainer);
    	display.clear();
        display.blit(gamejs.backgroundImage);
        sprites.draw(display);
        //score.draw(display);
      return;
    };
    
    
    gamejs.time.fpsCallback(tick, this, FPS);
}

gamejs.preload(["images/background.png","images/heart.png","images/Artery.png","images/menu.png"]);
gamejs.ready(loading);
