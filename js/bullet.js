"use strict"
var app = app || {};

app.Bullet = function(){

	function Bullet(x,y,speed){
		this.x = x;
		this.y = y;
		this.active = true;
		
		//makes it go right
		this.xVelocity = -speed;
		this.yVelocity = 0;
		this.width = 3;
		this.height = 3;
		this.color = "pink";
	}
	var p = Bullet.prototype;
	
	p.update = function(dt){
		this.x += this.xVelocity * dt;
		this.y += this.yVelocity * dt;
		this.active = this.active && inBounds(this.y);
	};
	
	p.draw = function(ctx){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};

	//private method
	function inBounds(y){
		return y >= -10;
	};
	return Bullet;
}();
