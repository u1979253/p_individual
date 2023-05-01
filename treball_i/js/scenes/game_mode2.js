"use strict";
class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
		this.username
		this.dificulty = null;
        this.waittime=0 ;
		this.started = false;
		this.rest = 0;
		this.num_cards
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
		var json2 = localStorage.getItem("configuration") || '{"cards":2,"dificulty":"hard","time":3000,"start":false,"resta":10}';     
		var game_config = JSON.parse(json2)
		console.log(game_config.start)
		this.started=game_config.start;
		console.log(this.started)
		if(game_config.start === false){
			console.log("ENTRA AQUI")
			this.num_cards = options_data.cards
			this.dificulty= options_data.dificulty;
		}
		else{
			console.log("ARA AQUI")
			this.num_cards = game_config.cards
			this.dificulty= game_config.dificulty;

		}
		let allCards = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
		this.username = sessionStorage.getItem("username")
		
		this.items = allCards;
		this.items.sort(function(){return Math.random() - 0.5});
		this.items = this.items.slice(0, this.num_cards);
		this.items = this.items.concat(this.items);
		this.cameras.main.setBackgroundColor(0xBFFCFF);
		
        console.log(this.num_cards);
		let cartes = this.num_cards * 2;
		console.log(this.waittime)
		var posicio = 250;
		console.log(cartes);
		for (let i = 0; i < cartes; i++){
			this.add.image(posicio, 300, this.items[i]);
			posicio+=100;
		}
		this.cards = this.physics.add.staticGroup();
		posicio=250;
		
		
		
		
		if (this.waittime != 0) 
			this.started=true;
		this.rest = game_config.resta
		this.waittime = game_config.time
		console.log(game_config)
		console.log(this.waittime)
		for (let i = 0; i < cartes; i++){
			this.cards.create(posicio, 300, 'back');
			posicio+=100;
		}
		let iterador = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = this.items[iterador];
			iterador++;
			card.setInteractive();
			card.on('pointerup', () => {
			}, this);
			card.setTexture(card.card_id);
			console.log(this.started)
			if(!this.started){
				if(options_data.dificulty === "easy"){
					this.waittime = 6000;
					console.log("passo per aqui")
					this.rest = 10;
				}
				else if(options_data.dificulty === "normal"){
					this.waittime = 3000;
					this.rest=20
				}
				else{
					this.waittime = 1500;
					this.rest = 34;
				}
				console.log(this.waittime);
			}
			else{
				this.waittime = game_config.time
				this.rest = game_config.resta
			}
			
			console.log(this.waittime)

			this.time.delayedCall(this.waittime, () => {
				card.setTexture('back');
			});
		});
		this.started = true;
	
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = this.items[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						this.score=this.score - this.rest
						console.log(this.score)
						this.firstClick.enableBody(false, 0, 0, true, true);
						card.enableBody(false, 0, 0, true, true);
						if (this.score <= 0){
							alert("Game Over");
							loadpage("../");
						}
						console.log(this.waittime);
					}
					else{
						this.correct++;
						if (this.correct >= this.num_cards){
							//alert("You Win with " + this.score + " points.");
							console.log(this.num_cards);
							console.log("ABANS DE EL IF");
							if(this.waittime< 150.0){
								this.num_cards = this.num_cards +1;
								console.log(this.num_cards);
								console.log("DESORES DE EL IF");
								if(this.num_cards<=4){
									this.waittime = 3000
									this.rest = 20
								}
								else{
									alert("You Win with " + this.score + " points.");
								}
							}
							else{
								console.log(this.waittime)
								this.waittime/=1.5;
								this.rest = this.rest * 1.2
								console.log("olaa")
								
								console.log(this.rest)
								console.log(this.started)
							}		
							console.log(this.waittime)		
							var opcions = {
								dificulty: this.dificulty,
								cards: this.num_cards,
								time: this.waittime,
								start: this.started,
								resta: this.rest
							};
							console.log(opcions);
							var save = function(){
								localStorage.setItem("configuration", JSON.stringify(opcions));
							};
							save();
							
							setTimeout(function() {
								alert("Hola después de 5 segundos!");
								loadpage("./mode2.html");
							}, 3000);
                            
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

