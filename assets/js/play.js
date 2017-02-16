var muted;
var lastClick;
			
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

var playState = {
	create: function() 
	{
		
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
		trashdove.events.onInputDown.add(this.clickTrash);
		
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
		
		this.getCount();
		getCountTimer = game.time.events.loop(30000, this.getCount);
		pushCountTimer = game.time.events.loop(10000, this.pushCount);
		
		this.achievementReset();
		
	},

	update: function() 
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
		
	},

	render: function()
	{
		globalCounterText.text = (globalCounter+recentTapped).toLocaleString();
		
		goldCountText.text = (player.gold).toLocaleString();
		goldTotalGroup.x = (game.world.width - goldTotalGroup.width)*0.99;
		goldCountText.x = (spinningCoin.width+ goldCountText.width)*0.6;
		
		game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");   
	},

	achievementReset: function()
	{
		titleGroup.setAll('visible', false);
		globalCounterGroup.setAll('visible', false);
		muted = true;
	},

	achievementIterate: function()
	{
		if (player.clicks >= 10) trashText.visible = true;
		if (player.clicks >= 20) doveText.visible = true;
		if (player.clicks >= 50) orgText.visible = true;
		if (player.clicks >= 80) globalCounterText.visible = true;
		if (player.clicks >= 100) slamsText.visible = true;
		if (player.clicks >= 5) {muted = false; this.pnotify("Bravo","success");}
	},

	pnotify: function(message, type)
	{
		$("#achievementBox").visibility="block";
		$("#achievementBox p")[0].innerHTML = message;
		$("#achievementBox").removeClass("alert-warning").addClass("alert-"+type);
	},

	clickTrash: function()
	{
		player.clicks++;
		player.gold++;
		recentTapped++;
		
		playState.createNewCoin();
		
		game.world.bringToTop(trashdove);
		
		animationRemainingTime =  12;
		trashdove.animations.play('slam');
		
		if (!muted) song.volume = 2;
		if (game.time.now - lastClick > 5000) song.restart(null, null, 0);
		lastClick = game.time.now;
		
		playState.achievementIterate();
	},

	createNewCoin: function()
	{
		var coin = coins.create(game.world.centerX, game.world.centerY, 'coin');
		coin.frame = 0;
		coin.anchor.setTo(0.5, 0.5);
		spriteScale(coin, 0.05);
		coin.body.velocity.x = Math.random()*500 - 250;
		coin.body.velocity.y = -(Math.random()*500 + 900);
		coin.body.gravity.y = 3000;	
		coin.alpha = 0.7;
		coin.checkWorldBounds = true;
		coin.events.onOutOfBounds.add(this.coinOut, this);
		
	},
	
	coinOut: function(e)
	{
		e.destroy();
	},

	
	pushCount: function()
	{
		$.ajax({
				data: {count: recentTapped},
				url: 'assets/php/increaseGlobalCount.php',
				method: 'POST',
				success: function(data){
					playState.getCount();
					recentTapped = 0;
				}
				});	
	},

	getCount: function()
	{
		$.ajax({
				url: 'assets/php/getGlobalCount.php',
				method: 'GET', 
				success: function(value) {
					globalCounter = parseInt(value);
						
					}
				});			
	}
	
};