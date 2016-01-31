"use strict";
var app = app || {};

app.drawLib = {
	clear : function(ctx, x, y, w, h){
		ctx.clearRect(x,y,w,h);
	},
	rect: function(ctx,x,y,w,h,col){
		ctx.save(); 
		ctx.fillStyle = col;
		ctx.fillRect(x,y,w,h);
		ctx.restore();
	},
	text: function(ctx, string, x, y, size, col){
		ctx.save();
		ctx.font = size + 'px Century Gothic, Apple Gothic, sans-serif';
		ctx.fillStyle = "black";
		ctx.fillText(string, x, y);
		ctx.restore();
	},	
	//in game background
	background: function(ctx, width, height){
		ctx.save();
		//Sky
		ctx.fillStyle = "#58a67f";
		ctx.fillRect(0,70,width,height);
		ctx.restore();
		//grass
		ctx.save();
		ctx.fillStyle = "#c2e4f2";
		ctx.fillRect(0,0,width,70);
		ctx.restore();
	},
	bullets: function(ctx, playerBullets){
		for(var i=0; i < playerBullets.length; i++){
			playerBullets[i].draw(ctx);
		}
	},
	opponents: function(ctx, germs){
		for(var i=0; i < germs.length; i++){
			germs[i].draw(ctx);
		};
	},
};