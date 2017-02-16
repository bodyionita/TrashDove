var game = new Phaser.Game('100', '100', Phaser.AUTO, 'gameContainer', true);
game.state.add('boot', bootState);						   
game.state.add('load', loadState);						   
game.state.add('menu', menuState);						   
game.state.add('play', playState);						   
					   
game.state.start('boot');						   
						  
						  
function spriteScale(object, scale)
	{
		var x = Math.min(game.width/object.width * scale, game.height/object.height * scale);
		object.scale.setTo(x, x);
	}					  





