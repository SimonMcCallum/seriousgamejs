<!DOCTYPE html>
<html>
<head>
    <title>Blood Flow</title>
<!-- Styling -->
   	<link type="text/css" rel="stylesheet"  href="css/jsgame.css" />
   	<link type="text/css" rel="stylesheet" href="css/smoothness/jquery-ui-1.8.20.custom.css" />

     <style type=text/css>
          .ui-slider .ui-slider-handle { position: absolute; z-index: 2; width: 0.9em; height: 0.4em; cursor: pointer; };
          .ui-slider-vertical .ui-slider-handle { left: -0.2em; margin-left: 0; margin-bottom: -.6em; };
    </style>
 
   
    
<!-- Start javascript/main.js -->
    <script src="./public/yabble.js"></script>
    <script src="./public/gamejs.mini.js"></script> 
    <script src="./javascript/jquery-1.7.2.min.js"></script> 
    <script src="./javascript/jquery-ui-1.8.20.custom.min.js"></script> 
   <script src="./javascript/heart.js"></script>
   <script type="text/javascript" src="./public/flotr2.min.js"></script>
    <script>
        require.setModuleRoot('./javascript/');
        require.run('main')
    </script>
</head>
<!-- Html -->
<body>
    <div>
        <div id="gjs-loader">
              <div id="loading"></div>
        </div>
        <div id="game-div">
             <div id="menu" class="toggler>
				<div id="menutext" class="ui-widget-content ui-corner-all">
				    <div id="playGame"></div>
				</div>
		</div>
		
             <div id="gamecanvas-div">
                 <canvas id="gjs-canvas"></canvas>
                 <div id="heartRateSlider"></div>
                 <div id="artHead"></div>
                 <div id="artArms"></div>
                 <div id="artUpperLeg"></div>
                 <div id="artLowerLeg"></div>
                 <div id="submit"></div>
                 <div id="play"></div>
             	 <div id="graphcanvas-div">            	 
             	</div> 
                 <button id="submitScore">Submit</button>
             </div>
        </div>
    </div>
</body>
</html>
