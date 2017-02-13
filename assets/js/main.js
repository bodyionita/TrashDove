//Create the renderer
var renderer = PIXI.autoDetectRenderer(  256, 256,
  {antialias: false, transparent: true, resolution: 1}
);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(parseInt(window.innerWidth*0.98), parseInt(window.innerHeight*0.98));

document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var globalCounterContainer = new PIXI.Container();
var nameContainer = new PIXI.Container();
var trashText = new PIXI.Text("TRASH",
  {fontFamily: "Arial Black", fontSize: 70, fill: "cyan"});
var doveText = new PIXI.Text("DOVE",
  {fontFamily: "Arial Black", fontSize: 70, fill: "red"});
var orgText = new PIXI.Text(".ORG",
  {fontFamily: "Arial Black", fontSize: 70, fill: "white"});
var tink = new Tink(PIXI, renderer.view);
var pointer = tink.makePointer();
var trashdove =  new Array();
var state = play;
var remainingAnimationTime = 0;
var tapped = 0;
var tappedCount = 0;
var totalCounter;
var gif = new PIXI.Container();
var currentFrame = 1;
var song;
var soundVolume=1, musicVolume=1;
var globalCounter = new PIXI.Text("",
  {fontFamily: "Arial Black", fontSize: 60, fill: "white"}
);
var textSlams = new PIXI.Text("SLAMS",
  {fontFamily: "Arial Black", fontSize: 60, fill: "grey"});
  

pointer.tap = () => tapped=1;

PIXI.loader
  .add([
    "assets/img/trashdove1.png",
    "assets/img/trashdove2.png",
    "assets/img/trashdove3.png",
    "assets/img/trashdove4.png",
    "assets/img/trashdove.gif",
    "assets/img/bg.jpg"
  ])
  .load(setup);

sounds.load([
	"assets/sound/song.mp3"
]);



  
function setup() {
  trashdove[1] = new PIXI.Sprite(PIXI.loader.resources["assets/img/trashdove1.png"].texture);
  trashdove[2] = new PIXI.Sprite(PIXI.loader.resources["assets/img/trashdove2.png"].texture);
  trashdove[3] = new PIXI.Sprite(PIXI.loader.resources["assets/img/trashdove3.png"].texture);
  trashdove[4] = new PIXI.Sprite(PIXI.loader.resources["assets/img/trashdove4.png"].texture);
  for (var i in trashdove)
  {
	trashdove[i].draggable = false;
	trashdove[i].visible = false;
	gif.addChild(trashdove[i]);
  }
  sounds.whenLoaded = function (){
	  song = sounds["assets/sound/song.mp3"];
	  song.loop = true;
	  song.play();
  }
  nameContainer.addChild(trashText);
  nameContainer.addChild(doveText);
  nameContainer.addChild(orgText);
  globalCounterContainer.addChild(globalCounter);
  globalCounterContainer.addChild(textSlams);
  stage.addChild(gif);  
  stage.addChild(globalCounterContainer);
  stage.addChild(nameContainer);
  getCount();
  setInterval(getCount, 10000);
  setInterval(resetTapped,1000);
  gameLoop();
  
}

function gameLoop(){

  requestAnimationFrame(gameLoop);
  tink.update();
  state();

  gif.x=window.innerWidth/2 - gif.width/2;
  gif.y=window.innerHeight/2- gif.height/2;
  doveText.x = parseInt(trashText.width * 1.05);
  orgText.x = parseInt(doveText.x+ doveText.width * 1.05);
  
  textSlams.y= parseInt(globalCounter.height * 1.07);
  globalCounter.text = (totalCounter+tappedCount).toString();
  nameContainer.y = parseInt(window.innerHeight*0.1);
  nameContainer.x = parseInt((window.innerWidth - nameContainer.width)/2);
  
  globalCounterContainer.y = parseInt(window.innerHeight*0.78);
  globalCounterContainer.x = parseInt(window.innerWidth * 0.03);
  
  renderer.render(stage);
}

function play()
{
	if (song)
		song.volume = song.volume * 0.95;
	if (remainingAnimationTime>0)
	{
		remainingAnimationTime--;
		
	}	
	
	trashdove[currentFrame].visible = false;	
	currentFrame = parseInt(remainingAnimationTime/4)  + 1;
	trashdove[currentFrame].visible = true;
	
	if (pointer.hitTestSprite(gif))
	{
		if (tapped)
		{
			if (song)
				if (song.volume < 2) song.volume = 2;
			tappedCount++;
			tapped = 0;
			//jumpSound();
			remainingAnimationTime = 12;
			
		}
	}
}
function pushCount()
{
	$.ajax({
			data: {count: tappedCount},
			url: 'assets/php/increaseGlobalCount.php',
			method: 'POST'
			});
	
}

function getCount()
{
	pushCount();
	$.ajax({
			data: {count: tappedCount},
			url: 'assets/php/getGlobalCount.php',
			method: 'POST', 
			success: function(value) {
				totalCounter = parseInt(value);
				}
			});
	tappedCount = 0;
			
}
function resetTapped()
{
	tapped = 0;
}
function jumpSound() {
  soundEffect(
    523.25,       //frequency
    0.05,         //attack
    0.2,          //decay
    "sine",       //waveform
    soundVolume,            //volume
    0.8,          //pan
    0,            //wait before playing
    600,          //pitch bend amount
    true,         //reverse
    100,          //random pitch range
    0,            //dissonance
    undefined,    //echo array: [delay, feedback, filter]
    undefined     //reverb array: [duration, decay, reverse?]
  );
}

