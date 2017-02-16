var bootState = {
	
	create: function(){		
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//game.stage.disableVisibilityChange = true;
		game.time.advancedTiming = true;
		//game.time.desiredfps = 60;
		
		game.state.start('load');
	}
	
};