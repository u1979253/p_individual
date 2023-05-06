"use strict";
class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
		this.username
        this.waittime=0 ;
		this.started = false;
		this.rest = 0;
		this.num_cards;
		this.totalScore = 0;
		this.level = 0;
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
		
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard","level":0}';
		var options_data = JSON.parse(json);
		var json2 = localStorage.getItem("configuration") || '{"cards":2,"time":3000,"start":false,"resta":20, "total":0}';     
		var game_config = JSON.parse(json2);
		if(game_config.start === false){
			this.num_cards = options_data.cards;
			this.dificulty= options_data.dificulty;
			var level = options_data.level;
			this.waittime = 3000;
			this.rest = 2.5;
			if(level > 14){
				this.num_cards = 4;
				level = options_data.level -14;
			}
			else if(level <= 14 && level > 7){
				this.num_cards = 3;
				level = options_data.level-7;
			}
			else{
				this.num_cards = 2;
			}
			for(var it = 1; it<level; it++){
				this.waittime= this.waittime/1.5;
				this.rest = this.rest * 2;
			}	
		}
		else{
			this.num_cards = game_config.cards;
			this.dificulty= game_config.dificulty;
			this.totalScore = game_config.total;
			this.waittime = game_config.time;
			this.rest = game_config.resta;
		}
		let allCards = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
		this.username = sessionStorage.getItem("username");
		this.items = allCards;
		this.items.sort(function(){return Math.random() - 0.5});
		this.items = this.items.slice(0, this.num_cards);
		this.items = this.items.concat(this.items);
		Phaser.Utils.Array.Shuffle(this.items);
		let cartes = this.num_cards * 2;
		var posicio = 250;
		for (let i = 0; i < cartes; i++){
			this.add.image(posicio, 200, this.items[i]);
			posicio+=100;
		}
		this.cards = this.physics.add.staticGroup();
		posicio=250;
		for (let i = 0; i < cartes; i++){
			this.cards.create(posicio, 200, 'back');
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
						this.score=this.score - this.rest;
						this.firstClick.enableBody(false, 0, 0, true, true);
						card.setTexture(card.card_id);
						setTimeout(function() {
							card.setTexture('back');
						}, this.waittime/2);
						card.enableBody(false, 0, 0, true, true);
						if (this.score <= 0){
							var puntuacio = {
								punts: this.totalScore,
								nom: this.username					
							};
							var puntuacions = JSON.parse(localStorage.getItem('scoreMode2')) || [];
							puntuacions.push(puntuacio);
							localStorage.setItem("scoreMode2", JSON.stringify(puntuacions));
							alert("Game Over");
							loadpage("../");
						}
					}
					else{
						this.correct++;
						var sortir = false;
						if (this.correct >= this.num_cards){
							alert("You Win with " + this.score + " points.");
							if(this.waittime< 265.0){
								this.num_cards = this.num_cards +1;
								if(this.num_cards<=4){
									this.waittime = 3000;
									this.rest = 2.5;
								}
								else{
									sortir = true;
								}
							}
							else{
								this.waittime/=1.5;
								this.rest = this.rest * 2;
							}		
							var PuntsTotals = this.totalScore + this.score;		
							var opcions = {
								cards: this.num_cards,
								time: this.waittime,
								start: this.started,
								resta: this.rest,
								total: PuntsTotals								
							};
							var save = function(){
								localStorage.setItem("configuration", JSON.stringify(opcions));
							};
							save();
							if(!sortir)
								loadpage("./mode2.html");
							else{
								var puntuacio = {
									punts: this.totalScore,
									nom: this.username					
								};
								var puntuacions = JSON.parse(localStorage.getItem('scoreMode2')) || [];
								puntuacions.push(puntuacio);
								localStorage.setItem("scoreMode2", JSON.stringify(puntuacions));
								loadpage("../");
							}
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