class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
		this.username
		this.dificulty = null;
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}
	
    create (){	
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		var options_data = JSON.parse(json);
		let allCards = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
		this.username = sessionStorage.getItem("username")
		this.dificulty=options_data.dificulty;
		this.num_cards=options_data.cards;
		this.items = allCards;
		this.items.sort(function(){return Math.random() - 0.5});
		this.items = this.items.slice(0, options_data.cards);
		this.items = this.items.concat(this.items);
		Phaser.Utils.Array.Shuffle(this.items);
	
		let cartes = options_data.cards * 2
		
		var posicio = 250;
		for (let i = 0; i < cartes; i++){
			this.add.image(posicio, 200, this.items[i]);
			posicio+=100;
		}
		this.cards = this.physics.add.staticGroup();
		posicio = 250;
		 
		for (let i = 0; i < cartes; i++){
			this.cards.create(posicio, 200, 'back');
			posicio+=100;
		}
		let iterador = 0;
		var TempsEspera
		this.cards.children.iterate((card)=>{
			card.card_id = this.items[iterador];
			iterador++;
			card.setInteractive();
			card.on('pointerup', () => {
			}, this);
			card.setTexture(card.card_id);
			
			if(options_data.dificulty === "easy")
				TempsEspera = 6000;
			else if(options_data.dificulty === "normal")
				TempsEspera = 3000;
			else
				TempsEspera = 1500;
			
			this.time.delayedCall(TempsEspera, () => {
				card.setTexture('back');
			});
		});
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = this.items[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						if(this.dificulty==="hard"){
							this.score = this.score - 34;
						}
						else if(this.dificulty==="easy"){
							this.score = this.score - 10;
						}
						else {
							this.score = this.score - 20;
						}
						console.log(this.score);
						this.firstClick.enableBody(false, 0, 0, true, true);
						card.setTexture(card.card_id);
						setTimeout(function() {
							card.setTexture('back');
						}, TempsEspera/3);
						card.enableBody(false, 0, 0, true, true);
						if (this.score <= 0){
							alert("Game Over");
							loadpage("../");
						}
					}
					else{
						this.correct++;
						if (this.correct >= this.num_cards){
							var puntuacio = {
								punts: this.score,
								nom: this.username					
							};
							var puntuacions = JSON.parse(localStorage.getItem('score')) || [];
							puntuacions.push(puntuacio);
							localStorage.setItem("score", JSON.stringify(puntuacions));
							alert("You Win with " + this.score + " points.");
							loadpage("../");
						}
					}
					this.firstClick = null;
				}
				else{
					this.firstClick = card;
				}
			}, card);
		});
	}
	
	update (){	}
}

