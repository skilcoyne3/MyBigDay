"use strict";

var app = app || {};

app.kid = {
	color: "white",
	x: 320,
	y: 400,
	width: 35,
	height: 70,
	speed: 250,
	image: undefined,
	image2: undefined,
	drawLib: undefined,
	facingRight: true,
	
	
	init: function(ctx){
		//console.log(" app.kid.init() called");
	},
	draw: function(ctx) {
	
		var halfW = this.width/2;
		var halfH = this.height/2;
	if(this.facingRight){
				ctx.drawImage(this.image, this.x - halfW, this.y - halfH, this.width, this.height);
			}else{
				ctx.drawImage(this.image2, this.x - halfW, this.y - halfH, this.width, this.height);
			}
	},
	moveLeft: function(dt){
		this.x -= this.speed *dt;
		this.facingRight = false;
	},
	moveRight: function(dt){
		this.x += this.speed *dt;
		this.facingRight = true;
	},
	moveUp: function(dt){
		this.y -= this.speed *dt;
	},
	moveDown: function(dt){
		this.y += this.speed *dt;
	},
};