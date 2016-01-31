"use strict";

var app = app || {};

app.game = {
    WIDTH : 640, 
    HEIGHT: 480,
    canvas: undefined,
    ctx: undefined,
    kid: undefined,
	drawLib: undefined,
	dt: 1/60.0, //delta time
	app: undefined,
	utils: undefined,
	playerBullets: [],
	cooldown: 0,
	FIRE_RATE: 0,
	GERM_PROBABILTY_PER_SECOND : 2.4, //3  
	germs: [],
	germImage: undefined,
	healthPowerUp: [],
	healthPowerupImage: undefined,
	HEALTH_POWERUPS_PROBABILITY_PER_SECOND: .005,
	pillPowerUp: [],
	PILL_POWERUP_PROBABILITY_PER_SECOND : .8, //.3
	pillPowerUpImage: undefined,
	lives: 3,
	mySound: undefined,
	winSound: undefined,
	endGame: false,
	facingRight: undefined,
	finalPercent: undefined,
	winScreenImage: undefined,
	instructionImage: undefined,
	introImage: undefined,
	looseImage: undefined,	
	schoolImage: undefined,
	amountLoaded: 0,
	win: false,
	kidWalk: undefined,
	walk: [],
    
	init : function(kid, powerUP) {
			this.canvas = document.querySelector('canvas');
			this.canvas.width = this.WIDTH;
			this.canvas.height = this.HEIGHT;
			this.ctx = this.canvas.getContext('2d');
			this.kid = kid;
			this.kid.init();
			
			document.getElementById('play').style.display = "block";
			document.getElementById('instructions').style.display = "block";
			document.getElementById('win').style.display = "none";
			document.getElementById('gameOver').style.display = "none";
			document.getElementById('home').style.display = "none";
			document.getElementById('loader').style.display = "none";
			
			//kid facing right
			var image = new Image();
			image.src = this.app.IMAGES['kidImage'];
			this.kid.image = image;
			
			//kid facing left
			var image = new Image();
			image.src = this.app.IMAGES['kidImage2'];
			this.kid.image2 = image;
			
			//germ image
			var image = new Image();
			image.src = this.app.IMAGES['germImage'];
			this.germImage = image;	
			
			//heart image
			var image = new Image();
			image.src = this.app.IMAGES['healthPowerupImage'];
			this.healthPowerupImage = image;
			
			//pill image
			var image = new Image();
			image.src = this.app.IMAGES['pillPowerUpImage'];
			this.pillPowerUpImage = image;
			
			//intro screen image
			var image = new Image();
			image.src = this.app.IMAGES['introImage'];
			this.introImage = image;
			
			//instructions image
			var image = new Image();
			image.src = this.app.IMAGES['instructionImage'];
			this.instructionImage = image;
			
			//win screen image			
			var image = new Image();
			image.src = this.app.IMAGES['winScreenImage'];
			this.winScreenImage = image;
			
			//game over image
			var image = new Image();
			image.src = this.app.IMAGES['looseImage'];
			this.looseImage = image;
			
			//school image for progress bar
			var image = new Image();
			image.src = this.app.IMAGES['schoolImage'];
			this.schoolImage = image;
			
			//call intro scene
			this.introScreen();
	},
	update: function(){

	if (this.endGame == false){
		//LOOP	
		requestAnimationFrame(this.update.bind(this));
		
	    //UPDATE; move sprites
		this.moveSprites();
		
		//Check for collisions
		this.checkForCollisions();
		
		//DRAW
		this.drawSprites();
		
		//PRPGRESS BAR		
		this.amountLoaded++;
		this.drawProgressBar(this.amountLoaded/5000);
		//this.drawProgressBar(.5);
		}
		else if(this.win == true){
				this.winScreen();
			}
			else{
				this.gameOverScreen();
			}
	},
	
	drawProgressBar: function(percent){
		//black boarder for bar
		this.ctx.save();
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(180,35,300,20);
		this.ctx.restore();
		
		//green bar (loader)
		var maxWidth = 300;
		var width = maxWidth * percent;
		this.ctx.fillStyle = "#4dd637";
		this.ctx.fillRect(180,35,width,20);
		this.ctx.font = '20px source sans';
		this.ctx.fillStyle = "black";
		this.ctx.fillText((percent *100).toFixed(0) + "%", 485, 50);
		
		//add school at end of bar
		this.ctx.drawImage(this.schoolImage,455,-10,50,50);
		
		this.finalPercent = percent.toFixed(2);
		//console.log(this.finalPercent);
		this.ctx.restore();
		
		//if you reach 100% (the end) -> end game and call win screen
		if(percent == 1)
		{
			this.win = true;
			this.endGame = true;
		}		
	},	
	moveSprites: function(){
	
		if(this.app.keydown[this.app.KEYBOARD.KEY_LEFT]){
			this.kid.moveLeft(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_RIGHT]){
			this.kid.moveRight(this.dt);
			//this.createExplosion(this.kid.x, this.kid.y, -this.kid.xVelocity/4, -this.kid.yVelocity/4);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_UP]){
			this.kid.moveUp(this.dt);
		}
		if(this.app.keydown[this.app.KEYBOARD.KEY_DOWN]){
			this.kid.moveDown(this.dt);
		}
		if (this.FIRE_RATE > 0 && this.kid.facingRight == true)
		{
			//fire bullets
			this.cooldown --;
			//poll keyboard
			if(this.cooldown <= 0 && app.keydown[app.KEYBOARD.KEY_SPACE]){
				this.shoot(this.kid.x + this.kid.width/2, this.kid.y);
				//console.log(this.kid.y);
				this.cooldown = (60/(this.FIRE_RATE)); 
			}
		
			//move bullets
			for (var i=0; i < this.playerBullets.length; i++){
				this.playerBullets[i].update(this.dt);
			}
		}
		if (this.kid.facingRight == false){
			this.playerBullets.length = 0;
		}
		
		//UPDATE; move sprites
		var paddingX = this.kid.width/2;
		var paddingY = this.kid.height/2;
		this.kid.x = this.utils.clamp(this.kid.x, paddingX, this.WIDTH - paddingX);
		//this.kid.x = this.utils.clamp(this.kid.x, 0, this.WIDTH);
		this.kid.y = this.utils.clamp(this.kid.y, paddingY, this.HEIGHT - paddingY);
		
		//germs
		for(var i = 0; i < this.germs.length; i++){
			this.germs[i].update(this.dt);
		};
		this.germs = this.germs.filter(function(germ){
			return germ.active;
		});
		if(Math.random() < this.GERM_PROBABILTY_PER_SECOND/60){
			//this.germs.push(new app.Germ(this.germsImage, this.WIDTH, this.HEIGHT));
			this.germs.push(new app.Germ(this.germImage, this.WIDTH, this.HEIGHT));
			//console.log("New germ created! germs.length = " + this.germs.length);
		}
		
		//HEALTH_POWERUP
		for(var i = 0; i < this.healthPowerUp.length; i++){
			this.healthPowerUp[i].update(this.dt);
		};
		this.healthPowerUp = this.healthPowerUp.filter(function(healthPowerUps){
			return healthPowerUps.active;
		});
		if(Math.random() < this.HEALTH_POWERUPS_PROBABILITY_PER_SECOND/60){
			this.healthPowerUp.push(new app.HealthPowerUp(this.healthPowerupImage, this.WIDTH, this.HEIGHT));
		}
			
		//PILL_POWERUP
		for(var i = 0; i < this.pillPowerUp.length; i++){
			this.pillPowerUp[i].update(this.dt);
		};
		this.pillPowerUp = this.pillPowerUp.filter(function(pillPowerUps){
			return pillPowerUps.active;
		});
		if(Math.random() < this.PILL_POWERUP_PROBABILITY_PER_SECOND/60){
			this.pillPowerUp.push(new app.PillPowerUp(this.pillPowerUpImage, this.WIDTH, this.HEIGHT));
		}	
		//move 
		this.walk.forEach(function(exp){
			exp.update(this.dt);
			},this);
			
		this.walk = this.walk.filter(function(exp){
			return exp.active;
		});
		
	},
	shoot: function(x,y){
		this.playerBullets.push(new app.Bullet(x,y,-1000));
	},
	drawSprites: function(){
		//draw background
		this.drawLib.background(this.ctx,this.WIDTH,this.HEIGHT);
		
		//display lives
		this.drawLib.text(this.ctx, "Lives = " + this.lives, 10, 30, 20, "#FFF");
		this.drawLib.text(this.ctx, "Fire Rate = " + (Math.floor(this.FIRE_RATE * 100) / 100), 10, 60, 20, "#FFF");

		//draw game objects
		this.kid.draw(this.ctx);
		this.drawLib.bullets(this.ctx,this.playerBullets);
		this.drawLib.opponents(this.ctx,this.germs);
		this.drawLib.opponents(this.ctx,this.healthPowerUp);
		this.drawLib.opponents(this.ctx,this.pillPowerUp);
		
	},
	checkForCollisions: function(){
		var self = this;
		
		//bullets vs germs
		this.playerBullets.forEach(function(bullet){
			self.germs.forEach(function(germ){
				if (self.collides(bullet, germ)){
					germ.active = false;
					bullet.active = false;
				}
			});
		});
		
		//healthPowerUp vs kid
		this.healthPowerUp.forEach(function(healthPowerUp){
			if (self.collides(healthPowerUp, self.kid)){
				healthPowerUp.explode();
				self.lives += 1; 				
			}
		});
		
		//pillPowerUp vs kid
		this.pillPowerUp.forEach(function(pillPowerUp){
			if (self.collides(pillPowerUp, self.kid)){
					pillPowerUp.explode();
					self.FIRE_RATE += .1;
					}
				});
			
		//germs vs kid
		this.germs.forEach(function(germ){
			if (self.collides(germ, self.kid)){
				germ.explode();
				self.lives -= 1; 
				self.FIRE_RATE = 0;
				self.playerBullets.length = 0;
			}
			//Call Game Over screen
			if(self.lives == 0){
				self.endGame = true;
				self.win = false;
			}
		});
	},
	collides: function (a, b) {
		var ax = a.x - a.width/2;
		var ay = a.y - a.height/2;
		var bx = b.x - b.width/2;
		var by = b.y - b.height/2;
		
		return  ax < bx + b.width &&
				ax + a.width > bx &&
			   ay < by + b.height &&
				ay + a.height > by;
	},
	
	//SCREENS  
	introScreen: function(ctx){
		//draw intro picture
		this.ctx.drawImage(this.introImage,0,0,this.WIDTH,this.HEIGHT);
		
		//if instructions button is pressed
		document.getElementById('instructions').addEventListener('click', function() {
			document.getElementById('instructions').style.display = "none";
			app.game.instructionsScreen();
		});	
		
		//if play button is pressed
		document.getElementById('play').addEventListener('click', function() {
			document.getElementById('play').style.display = "none";
			document.getElementById('home').style.display = "none";
			document.getElementById('instructions').style.display = "none";
			this.soundtrack = createjs.Sound.play("mySound", {loop:-1, volume:0.4});
			app.game.update();
		});	
	},
	instructionsScreen: function(){
		this.drawLib.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
			
		//draw instructions image
		this.ctx.drawImage(this.instructionImage,0,0,this.WIDTH,this.HEIGHT);
		document.getElementById('home').style.display = "block";
			
		//if "main menu" is pressed
		document.getElementById('home').addEventListener('click', function() {
			document.getElementById('home').style.display = "none";
			document.location.href = "";
			//app.game.introScreen();	
		});
	},
	gameOverScreen: function(){
			this.drawLib.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
			
			//draw game over image 
			this.ctx.drawImage(this.looseImage,0,0,this.WIDTH,this.HEIGHT);
			
			document.getElementById('gameOver').style.display = "block";
			
			//add how far you got in the game(%) to "final distance"
			this.ctx.font = "18px Century Gothic, Apple Gothic, sans-serif";
			this.ctx.textAlign = "center";
			this.ctx.fillStyle = "black";
			this.ctx.fillText((this.finalPercent *100).toFixed(0) + "%", 390, 152);
			
			this.soundtrack = createjs.Sound.stop("mySound");
			
			//if "play again" button is clicked
			document.getElementById('gameOver').addEventListener('click', function() {
				document.getElementById('gameOver').style.display = "none";
				document.location.href = "";	
			});
		},
	winScreen: function(ctx){
		this.drawLib.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
		
		//draw win screen Image 
		this.ctx.drawImage(this.winScreenImage,0,0,this.WIDTH,this.HEIGHT);
		
		this.soundtrack = createjs.Sound.stop("mySound");
		this.soundtrack = createjs.Sound.play("winSound", {volume:0.4});
		document.getElementById('win').style.display = "block";
		
		//if "play again" in win is clicked
		document.getElementById('win').addEventListener('click', function() {
			document.getElementById('win').style.display = "none";
			document.location.href = "";
			this.soundtrack = createjs.Sound.stop("winSound");
			/*app.game.endGame = false;
			app.game.lives = 3;
			app.game.win = false;
			app.game.amountLoaded = 0;
			app.game.update();*/
		});
	},	
	createExplosion: function(x, y, xVelocity, yVelocity){
		
		var exp = new app.ExplosionSprite(this.kidWalk, 74, 146, 74, 146, 1/60);
		exp.x = x;
		exp.y = y;
		//exp.xVelocity = xVelocity;
		//exp.yVelocity = yVelocity;
		this.walk.push(exp);
	},
};