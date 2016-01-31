"use strict";
app.Germ = function(){
	
	function Germ(image,canvasWidth,canvasHeight,ctx, utils) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.active = true;
		this.age = Math.floor(Math.random() * 128);
		
		this.color = "#AA22BB";
		
		//MOVES FROM LEFT
		this.x = this.canvasWidth - 10;
		this.y = Math.random() * this.canvasHeight;
		this.xVelocity = app.utils.getRandom(3,6);
		this.yVelocity = app.utils.getRandom(1,3);
		this.amplitude = 1;
		this.image = image;
		this.width = 40;
		this.height = 50;
	};
		

	var p = Germ.prototype;
	
	  p.draw = function(ctx) {
			var halfW = this.width/2;
			var halfH = this.height/2;
			
			if(!this.image){
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);	
			} else{
				ctx.drawImage(this.image,this.x - halfW, this.y - halfH, this.width, this.height);
				//ctx.drawImage(this.image, 52, 98, 17, 20, this.x - halfW, this.y - halfH, 34, 42);
			}
	  };
	p.update = function(dt) {
		
		this.yVelocity = this.amplitude * Math.sin(this.age * Math.PI * dt);
		this.x -= this.xVelocity;
		this.y -= this.yVelocity;
		this.active = this.active;
	  };
	  
	 p.explode  = function() {
		this.active = false;
	  };
	  p.dead  = function() {
		this.active = false;
	  };	
	return Germ;
}();
