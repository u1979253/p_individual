var options = function(){
	// Aquí dins hi ha la part privada de l'objecte
	var options_data = {
		cards:2, dificulty:"hard",level:0
	};
	var load = function(){
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard","level":0}';
		options_data = JSON.parse(json);
	};
	var save = function(){
		localStorage.setItem("config", JSON.stringify(options_data));
	};
	load();
	var vue_instance = new Vue({
		el: "#options_id",
		data: {
			num: 2,
			dificulty: "normal",
			lvl: 0
		},
		created: function(){
			this.num = options_data.cards;
			this.dificulty = options_data.dificulty;
			this.lvl = options_data.level;
		},
		watch: {
			num: function(value){
				if (value < 2)
					this.num = 2;
				else if (value > 4)
					this.num = 4;
			},
			lvl: function(value){
				if (value < 0)
					this.lvl = 0;
				else if (value > 21)
					this.lvl = 21;
			}
		},
		methods: { 
			discard: function(){
				this.num = options_data.cards;
				this.dificulty = options_data.dificulty;
				this.lvl = options_data.level},
			save: function(){
				options_data.cards = this.num;
				options_data.dificulty = this.dificulty;
				options_data.level = this.lvl;
				save();
				loadpage("../index.html");
			}
		}
	});
	return {
		// Aquí dins hi ha la part pública de l'objecte
		getOptionsString: function (){
			return JSON.stringify(options_data);
		},
		getNumOfCards: function (){
			return options_data.cards;
		},
		getDificulty: function (){
			return options_data.dificulty;
		},
		getLevel: function(){
			return options_data.level;
		}
	}; 
}();

console.log(options.getOptionsString());
console.log(options.getNumOfCards());
console.log(options.getDificulty());
console.log(options.options_data);