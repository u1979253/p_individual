function start_game(){
	name = prompt("User name");
	
	sessionStorage.setItem("username", name);
	
	loadpage("./game.html");
}

function exit (){
	if (name != ""){
		alert("Leaving " + name + "'s game");
	}
	name = "";
	loadpage("../index.html")
}

function options(){
	loadpage("./html/options.html");
}

function eliminarStorage(){
	name = prompt("User name");
	
	sessionStorage.setItem("username", name);
	var elimina = localStorage.removeItem("configuration");
	loadpage("./mode2.html")
}

