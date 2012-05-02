<!DOCTYPE html>
<html>
<head>
    <title>Blood Flow</title>
<!-- Styling -->
    <style type=text/css>
        body{
           background:#fff;
           color:#222;
           margin:1em 0 2em 6em;
           padding:0;
        }
        #gjs-loader {
            width: 50%;
            height: 50%;
            background: url('./public/ajax-loader.gif');
        }    
        #game-div {
            width : 600px;
            height: 384px;
            margin: 8px auto;
            position:absolute;
        }
        #game-canvas {
            width : 600px;
            height: 384px;
            margin: 8px auto;
        }
        #graphcanvas-div {
            width : 400px;
            height: 150px;
            position: absolute;
            left: 30px;
            top:-170px;
            margin: 0px auto;
        }
        #slider {
            width : 10px;
            height: 100px;
            position: absolute;
            left: 40px;
            top:150px;
            margin: 0px auto;
        }
        
    </style>
    <link type="text/css" href="css/smoothness/jquery-ui-1.8.20.custom.css" rel="stylesheet" />
    <style type=text/css>
          .ui-slider .ui-slider-handle { position: absolute; z-index: 2; width: 0.9em; height: 0.4em; cursor: pointer; }
          .ui-slider-vertical .ui-slider-handle { left: -0.2em; margin-left: 0; margin-bottom: -.6em; }
    </style>
    
<!-- Start javascript/main.js -->
    <script src="./public/yabble.js"></script>
    <script src="./public/gamejs.mini.js"></script> 
    <script src="./javascript/jquery-1.7.2.min.js"></script> 
    <script src="./javascript/jquery-ui-1.8.20.custom.min.js"></script> 
   <script src="./javascript/heart.js"></script>
   <script type="text/javascript" src="./public/flotr2.min.js"></script>
<!-- <script type="text/javascript" src="./public/smoothie.js"></script> -->

    <script>
        require.setModuleRoot('./javascript/');
        require.run('main')
    </script>
</head>
<!-- Html -->
<body>
    <div>
        <div id="gjs-loader">
         Loading...
        </div>
        <div id="game-div">
             <div id="gamedcanvas-div">
                 <canvas id="gjs-canvas"></canvas>
                 <div id="slider"></div>
                 <button id="submitScore">Submit</button>
                 <button id="play">Play</button>
                 <div id="artHead"></div>
                 <div id="artLegs"></div>
                 <div id="artArms"></div>
             </div>
              <div id="graphcanvas-div">
                 <canvas id="graph-canvas"></canvas>
             </div>
        </div>
	<p>
           Powered by <a href="http://gamejs.org">GameJs</a>.
        </p>
    </div>
</body>
</html>
