function rand(min, max) {
    return Math.random() * (max - min) + min;
}

class Game
{
	 constructor ()
	 {
		  this.canvas = document.getElementById ("game-canvas");
		  this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
		  this.context = this.canvas.getContext("2d", {
            alpha: true
        });

		  this.context.webkitImageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;

        this.lastTime = 0;
        this.deltaTime = 0;
        this.elapsedFrames = 0;

		  this.cloudImg = new Image ();
		  this.cloudImg.src = "res/cloud.png";
		  this.dropletImg = new Image ();
		  this.dropletImg.src = "res/droplet.png";

		  this.stage1Img = new Image ();
		  this.stage1Img.src = "res/stage1.png";
		  this.stage2Img = new Image ();
		  this.stage2Img.src = "res/stage2.png";
		  this.stage3Img = new Image ();
		  this.stage3Img.src = "res/stage3.png";

		  this.raining = false;
		  this.rainX = 0;
		  this.rainY = 0;

		  this.droplets = new Array ();
		  this.timer = null;

		  this.plants = new Array ();
		  this.score = 0;

		  window.setInterval (function ()
									 {
										  this.plants.forEach (function (plant, index)
																	  {
																			plant.stage -= 1;
																			if (plant.stage == 0)
																			{
																				 this.plants.splice (index, 1);
																			}
																	  }.bind (this));

										  this.plants.push ({
												x: rand (0, this.canvas.width - 8),
												y: rand (0, this.canvas.height - 32),
												stage: 3
										  });
									 }.bind (this), 500);
		  
		  document.addEventListener ("mousedown", function (event)
											  {
													this.raining = true;

													this.timer = window.setInterval (function ()
																								{
																									 this.droplets.push ({
																										  x: rand (this.rainX - 12, this.rainX + 6),
																										  origY: this.rainY + 8,
																										  y: 0,
																										  speed: rand (0.05, 0.1)
																									 });
																								}.bind (this), 100)
											  }.bind (this));

		  document.addEventListener ("mousemove", function (event)
											  {
													this.rainX = event.offsetX;
													this.rainY = event.offsetY;
											  }.bind (this));

		  
 		  document.addEventListener ("mouseup", function (event)
											  {
													this.raining = false;
													window.clearTimeout (this.timer);
											  }.bind (this));
		  
		  
		  this.request = requestAnimationFrame(this.loop.bind(this));
	 }

	 loop (timestamp)
	 {
		  this.update (timestamp);
		  this.render ();
		  this.request = requestAnimationFrame(this.loop.bind(this));
	 }

	 render ()
	 {
		  this.context.fillStyle = "black";
		  this.context.fillRect (0, 0, this.canvas.width, this.canvas.height);

		  this.context.fillStyle = "white";
		  this.context.font = "20px monospace";
		  this.context.fillText ("Score: " + this.score.toFixed(1), 10, 25);
		  
		  this.plants.forEach (function (plant, index)
									  {
											if (plant.stage == 1)
											{
												 this.context.drawImage (this.stage1Img, plant.x, plant.y);
											}
											else if (plant.stage == 2)
											{
												 this.context.drawImage (this.stage2Img, plant.x, plant.y);
											}
											else
											{
												 this.context.drawImage (this.stage3Img, plant.x, plant.y);
											}
									  }.bind (this));
		  
		  this.droplets.forEach (function (droplet, index)
										 {
											  this.context.drawImage (this.dropletImg, droplet.x, droplet.y + droplet.origY);
										 }.bind (this));
		  
		  if (this.raining)
		  {
				this.context.drawImage (this.cloudImg, this.rainX - 12, this.rainY - 8);
		  }
	 }
	 
	 update (timestamp)
	 {
		  this.elapsedFrames++;
        this.deltaTime = (timestamp - this.lastTime);
        this.lastTime = timestamp;

		  this.droplets.forEach (function (droplet, index)
										 {
											  droplet.y += this.deltaTime * droplet.speed;
											  
											  if (droplet.y > 80)
											  {
													this.droplets.splice (index, 1);
											  }
										 }.bind (this));
		  
		  if (this.raining)
		  {
				this.plants.forEach (function (plant, index)
											  {
													if (plant.x > this.rainX - 12 && plant.x < this.rainX - 12 + 16
														 && plant.y > this.rainY - 8 && plant.y < this.rainY + 120)
													{
														 if (this.plants.stage == 3)
														 {
															  this.score += 25;
														 }
														 else if (this.plants.stage == 2)
														 {
															  this.score += 50;
														 }
														 else
														 {
															  this.score += 100;
														 }

														 this.plants.splice (index, 1);
													}
														 
											  }.bind (this));
		  }
	 }
}

let game = new Game ();
