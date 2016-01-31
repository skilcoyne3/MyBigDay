"use strict";
app.PillPowerUp = function(){
	
	function PillPowerUp(image,canvasWidth,canvasHeight,ctx, utils) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.active = true;
		
		this.color = "pink";
		this.x = app.utils.getRandom(10,500); //10 620
		this.y = app.utils.getRandom(60,425);
		this.image = image;
		this.width = 30;
		this.height = 40;
	};
		

	var p = PillPowerUp.prototype;
	
	  p.draw = function(ctx) {
			var halfW = this.width/2;
			var halfH = this.height/2;
			
			if(!this.image){
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x - halfW, this.y - halfH, this.width, this.height);
				
			} else{
				//ctx.drawImage(this.image,this.x - halfW, this.y - halfH, this.width, this.height);
				ctx.drawImage(this.image,this.x, this.y, this.width, this.height);
				//ctx.drawImage(this.image, 52, 98, 17, 20, this.x - halfW, this.y - halfH, 34, 42);
			}
			
	  };
	
	p.update = function(dt) {
	  };
	  
	 p.explode  = function() {
		this.active = false;
		//console.log("explode = " + this.active);
	  };
	  
	  function inBounds(obj) {
		return obj.y <= obj.canvasHeight + obj.height * 0.5;
	  };
	
	return PillPowerUp;
	
}();