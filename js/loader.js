"use strict";

var app = app || {};

app.KEYBOARD = {
	"KEY_LEFT":37,
	"KEY_UP":38,
	"KEY_RIGHT":39,
	"KEY_DOWN":40,
	"KEY_SPACE":32
};
app.IMAGES = {
	kidImage: "images/kindergardener.png",
	kidWalk: "images/walking.png",
	kidImage2: "images/kindergardener_left.png",
	germImage: "images/germy.png",
	healthPowerupImage: "images/heart.png", 
	pillPowerUpImage: "images/pill.png", 
	winScreenImage: "images/winScreen.png",
	instructionImage: "images/instructions.png",
	introImage: "images/introScreen.png",
	looseImage: "images/looseScreen.png",
	schoolImage: "images/school.png",
};

app.SOUND = {
	mySound: "sound/game.wav",
	winSound: "sound/3bells.wav",
};

app.keydown = [];


window.onload = function(){
	//This is the "sandbox" where we hook our modules up so that we don't have any
	//hard coded dependencies
	app.kid.drawLib = app.drawLib;
	app.game.drawLib = app.drawLib;
	app.game.app = app;
	app.game.utils = app.utils;
	app.game.gameScreens = app.gameScreens;
	
	
	//Preload Images and Sound
	app.queue = new createjs.LoadQueue(false);
	app.queue.installPlugin(createjs.Sound);
	app.queue.on("complete", function(){
		//console.log("images loaded called");
		app.game.init(app.kid);
	});	
	//load image files
	app.queue.loadManifest([
		//IMAGES	
		{id: "kidImage", src:"images/kindergardener.png"},
		{id: "kidWalk", src:"images/walking.png"},
		{id: "kidImage2", src:"images/kindergardener_left.png"},
		{id: "germImage", src:"images/germy.png"},
		{id: "healthPowerupImage", src:"images/heart.png"},
		{id: "pillPowerUpImage", src: "images/pill.png"}, 
		{id: "winScreenImage", src:"images/winScreen.png"},
		{id: "instructionImage", src:"images/instructions.png"},
		{id: "introImage", src:"images/introScreen.png"},
		{id: "looseImage", src:"images/looseScreen.png"},
		{id: "schoolImage", src:"images/school.png"},
		//SOUND
		{id: "mySound", src:"sound/game.wav"},
		{id: "winSound", src:"sound/3bells.wav"},
	]);
	
	window.addEventListener("keydown",function(e){
	app.keydown[e.keyCode] = true;
});

window.addEventListener("keyup",function(e){
	app.keydown[e.keyCode] = false;
});


}


