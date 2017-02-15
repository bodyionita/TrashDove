var game = new Phaser.Game('100', '100', Phaser.AUTO, 'gameContainer', 
						   { preload: preload, create: create, update: update, render: render}, 
						   true);

var getCountTimer, pushCountTimer;

var socialMediaGroup;

var globalCounterGroup;
var globalCounterText, slamsText;

var titleGroup;
var trashText,doveText, orgText;

var trashdove;
var animationRemainingTime = 0;

var song;
var background;

var recentTapped = 0;
var globalCounter = 0;


function preload() {
	game.load.image('background', 'assets/img/bg.jpg');
    game.load.spritesheet('trashdove', 'assets/img/trashdove6.png', 350, 400);
	game.load.audio('song',['assets/sound/song.ogg','assets/sound/song.m4a']);
}

function spriteScale(object, scale)
{
	var x = Math.min(game.width/object.width * scale, game.height/object.height * scale);
	object.scale.setTo(x, x);
}


function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	//game.stage.disableVisibilityChange = true;
	game.time.advancedTiming = true;
	//game.time.desiredfps = 60;
	
	background = game.add.sprite(game.world.centerX, game.world.centerY, 'background');
	background.anchor.setTo(0.5, 0.5);	
	background.scale.setTo(game.width/background.width, game.height/background.height);
	
	trashdove = game.add.sprite(game.world.centerX, game.world.centerY, 'trashdove');
	trashdove.anchor.setTo(0.5, 0.5);
	spriteScale(trashdove, 0.3);
	trashdove.animations.add('slam', [0, 1, 2, 3, 4, 5], 30, true);
	trashdove.draggable = false;
	trashdove.inputEnabled = true;
	trashdove.input.useHandCursor = true;
	trashdove.events.onInputDown.add(clickTrash);
	
	globalCounterGroup = game.add.group();
	globalCounterText = game.add.text(0, 0, "1000000",{fontFamily: "Arial Black", fontSize: 200, fill: "white"});
	slamsText = game.add.text(0, 0, "SLAMS",{fontFamily: "Arial Black", fontSize: 200, fill: "grey"});
	globalCounterGroup.add(globalCounterText);
	globalCounterGroup.add(slamsText);
	slamsText.y = globalCounterText.height * 0.7;
	spriteScale(globalCounterGroup,0.25);
	globalCounterGroup.y = game.world.height - globalCounterGroup.height;
	globalCounterGroup.x = game.world.width * 0.01;
	
	titleGroup = game.add.group();	
	trashText = game.add.text(0, 0, "TRASH",{fontFamily: "Arial Black", fontSize: 200, fill: "cyan"});
	doveText = game.add.text(0, 0, "DOVE",{fontFamily: "Arial Black", fontSize: 200, fill: "red"});
	orgText = game.add.text(0, 0, ".ORG",{fontFamily: "Arial Black", fontSize: 200, fill: "white"});
	titleGroup.add(trashText);
	titleGroup.add(doveText);
	titleGroup.add(orgText);
	doveText.x = trashText.width * 1.03;
	orgText.x = trashText.width + doveText.width * 1.03;
	spriteScale(titleGroup,0.60);
	titleGroup.x = game.world.centerX - titleGroup.width * 0.5;
	titleGroup.y = game.world.height * 0.05;
	
	
	
	socialMediaGroup = game.add.group();
	
	song = game.add.audio('song',0,true);
	song.play();
	
	getCount();
    //getCountTimer = game.time.events.loop(5000, getCount);
	pushCountTimer = game.time.events.loop(10000, pushCount);
}

function update() {
	
	if (animationRemainingTime==0) 
	{		
		trashdove.animations.stop();
		trashdove.frame = 0;
	} else {
		animationRemainingTime--;
		 }
	
	
	if (song)
		song.volume = song.volume * 0.95;
	
	
}

function render() {
	globalCounterText.text = (globalCounter+recentTapped).toString();
	game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");   
}

function pushCount()
{
	$.ajax({
			data: {count: recentTapped},
			url: 'assets/php/increaseGlobalCount.php',
			method: 'POST',
			success: function(data){
				recentTapped = 0;
			}
			});
	
}

function clickTrash()
{
	recentTapped++;
	animationRemainingTime =  12;
	trashdove.animations.play('slam');
	song.volume = 2;
}

function getCount()
{
	pushCount();
	$.ajax({
			url: 'assets/php/getGlobalCount.php',
			method: 'GET', 
			success: function(value) {
				globalCounter = parseInt(value);
				
				}
			});
	
			
}
