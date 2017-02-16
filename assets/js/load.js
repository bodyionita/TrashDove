var loadState = {
	
	preload: function(){
		var loadingLabel = game.add.text(game.world.centerX,game.world.centerY,'loading...', {font: '30px Courier', fill: 'white'});
		loadingLabel.anchor.setTo(0.5,0.5);
		game.load.image('background', 'assets/img/bg.jpg');
		game.load.spritesheet('coins','assets/img/coins.png',128, 128);
		game.load.image('coin','assets/img/coin.png');
		game.load.spritesheet('trashdove', 'assets/img/trashdove6.png', 350, 400);
		game.load.audio('song',['assets/sound/song.ogg','assets/sound/song.m4a']);
	},
	
	create: function(){				
		game.state.start('play');
	}
	
};