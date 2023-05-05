var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 400,
	transparent: true,
    parent: 'game_area',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 0},
			debug: false
		}
	},
    scene: [ GameScene ]
};

var game = new Phaser.Game(config);
