var game = new Phaser.Game('100', '100', Phaser.AUTO, 'gameContainer', 
						   { preload: preload, create: create, update: update, render: render}, 
						   true);
			
var muted;
			
var getCountTimer, pushCountTimer;

var socialMediaGroup;

var globalCounterGroup;
var globalCounterText, slamsText;

var titleGroup;
var trashText,doveText, orgText;

var goldTotalGroup;
var goldCountText, spinningCoin;

var trashdove;
var animationRemainingTime = 0;

var song;
var background;

var recentTapped = 0;
var globalCounter = 0;

var player = {
	damage: 1,
	gold: 0,
	clicks: 0
}

var coins;

function preload() {
	game.load.image('background', 'assets/img/bg.jpg');
	game.load.spritesheet('coins','assets/img/coins.png',128, 128);
	game.load.image('coin','assets/img/coin.png');
    game.load.spritesheet('trashdove', 'assets/img/trashdove6.png', 350, 400);
	game.load.audio('song',['assets/sound/song.ogg','assets/sound/song.m4a']);
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
	globalCounterText = game.add.text(0, 0, "",{fontFamily: "Arial Black", fontSize: 200, fill: "white"});
	slamsText = game.add.text(0, 0, "SLAMS",{fontFamily: "Arial Black", fontSize: 200, fill: "grey"});
	globalCounterGroup.add(globalCounterText);
	globalCounterGroup.add(slamsText);
	slamsText.y = globalCounterText.height * 0.7;
	spriteScale(globalCounterGroup,0.20);
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
	
	goldTotalGroup = game.add.group();
	goldCountText = game.add.text(0, 0, "",{fontFamily: "Arial Black", fontSize: 200, fill: "gold"});
	spinningCoin = game.add.sprite(0,0,'coins');
	spinningCoin.anchor.set(0.5,0.5);
	goldCountText.anchor.set(0.5,0.5);
	spriteScale(spinningCoin, 0.06);
	spriteScale(goldCountText, 0.08);
	spinningCoin.animations.add('spin', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 30, true);
	spinningCoin.animations.play('spin');
	goldTotalGroup.add(spinningCoin);
	goldTotalGroup.add(goldCountText);
	goldTotalGroup.y = (game.world.height - goldTotalGroup.height)*1.02	;
	
	
	
	coins = game.add.group();
	coins.enableBody = true;
	
	socialMediaGroup = game.add.group();
	
	song = game.add.audio('song',0,true);
	song.play();
	
	getCount();
    getCountTimer = game.time.events.loop(30000, getCount);
	pushCountTimer = game.time.events.loop(10000, pushCount);
	
	achievementReset();
}

function update() 
{
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
	globalCounterText.text = (globalCounter+recentTapped).toLocaleString();
	
	goldCountText.text = (player.gold).toLocaleString();
	goldTotalGroup.x = (game.world.width - goldTotalGroup.width)*0.99;
	goldCountText.x = (spinningCoin.width+ goldCountText.width)*0.6;
	
	game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");   
}

function achievementReset(){
	titleGroup.setAll('visible', false);
	globalCounterGroup.setAll('visible', false);
	muted = true;
	song.volume = 0;
}

function achievementIterate(){
	if (player.clicks >= 10) trashText.visible = true;
	if (player.clicks >= 20) doveText.visible = true;
	if (player.clicks >= 50) orgText.visible = true;
	if (player.clicks >= 80) globalCounterText.visible = true;
	if (player.clicks >= 100) slamsText.visible = true;
	if (player.clicks >= 5) muted = false;
}

function spriteScale(object, scale)
{
	var x = Math.min(game.width/object.width * scale, game.height/object.height * scale);
	object.scale.setTo(x, x);
}

function clickTrash()
{
	player.clicks++;
	player.gold++;
	recentTapped++;
	throwCoin();
	animationRemainingTime =  12;
	trashdove.animations.play('slam');
	if (!muted) song.volume = 2;
	achievementIterate();
}

function createNewCoin()
{
	var coin = coins.create(game.world.centerX, game.world.centerY, 'coin');
	coin.frame = 0;
	coin.anchor.setTo(0.5, 0.5);
	spriteScale(coin, 0.05);
	coin.body.velocity.x = Math.random()*500 - 250;
	coin.body.velocity.y = -(Math.random()*500 + 900);
	coin.body.gravity.y = 3000;	
	coin.checkWorldBounds = true;
	coin.events.onOutOfBounds.add(coinOut, this);
	
}

function coinOut(e)
{
	e.destroy();
}

function throwCoin()
{
	createNewCoin();
}
function pushCount()
{
	$.ajax({
			data: {count: recentTapped},
			url: 'assets/php/increaseGlobalCount.php',
			method: 'POST',
			success: function(data){
				getCount();
				recentTapped = 0;
			}
			});	
}

function getCount()
{
	$.ajax({
			url: 'assets/php/getGlobalCount.php',
			method: 'GET', 
			success: function(value) {
				globalCounter = parseInt(value);
					
				}
			});			
}
