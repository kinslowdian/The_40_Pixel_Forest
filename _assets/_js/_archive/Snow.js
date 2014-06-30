	/* @kinslowdian -- http://www.simonkinslow.com -- 2013 */
	
	
	// --------------------------------------------- SNOW
			
	var SnowMain = function(target, pixel_PNG, pixel_MAP)
	{
		this.snow_ARR = new Array();
		this.snow_DIV = target;
		this.snow_PNG = pixel_PNG;
		this.snow_MAP = pixel_MAP;
		this.snow_run = true;
	};
			
	var Snow = function(id, png, map)
	{
		this.com = "snow" + id;
		this.html = '<div id="' + this.com + '" class="snow"><div class="snowInner snowTween"><div class="snowFlake tween-snowFlake ' + png + ' ' + map + '"></div></div></div>';
	};		
			
/*
	Snow.prototype.setVals = function()
	{
		this.sx = Math.floor(Math.random() * (310 - 10) + 10);
		this.fx = Math.round(Math.random() * (50 + -50) + -50);
		this.fy = Math.round(Math.random() * (-10 + -50) + -50);
		this.fr = Math.floor(Math.random() * 360);
		this.fr_x = Math.round(Math.random() * (100 - -100) + -100);
		this.fr_y = Math.round(Math.random() * (100 - -100) + -100);
		this.fall = Math.round(Math.random() * (20 - 4) + 4) + Math.floor(Math.random() * 100) / 100;
	};
*/

	Snow.prototype.setVals = function()
	{
		this.sx = Math.floor(Math.random() * ((DISPLAY._width - 10) - 10) + 10);
		this.fx = Math.round(Math.random() * (50 + -50) + -50);
		this.fy = Math.round(Math.random() * (-10 + -50) + -50);
		this.fr = Math.floor(Math.random() * 360);
		this.fr_x = Math.round(Math.random() * (100 - -100) + -100);
		this.fr_y = Math.round(Math.random() * (100 - -100) + -100);
		this.fall = Math.round(Math.random() * (20 - 4) + 4) + Math.floor(Math.random() * 100) / 100;
	};
			
	Snow.prototype.build = function()
	{
		this.css = 	{
						"visibility"		: "visible",
						"-webkit-animation"	: "snowFall " + this.fall + "s linear",
						"animation"			: "snowFall " + this.fall + "s linear"
					};
							
		
		this.x_placement = 	{
								"-webkit-transform"	: "translateX(" + this.sx + "px)",
								"transform"			: "translateX(" + this.sx + "px)"
							};
									
		
		this.flake_css = 	{
								"-webkit-transform" : "translate(" + this.fx + "px, " + this.fy + "px) rotate(" + this.fr + "deg)",
								"transform" 		: "translate(" + this.fx + "px, " + this.fy + "px) rotate(" + this.fr + "deg)"
							};
									
		
		this.sprite_css = 	{
								"-webkit-transform-origin" 	: this.fr_x + "px " + this.fr_y + "px", 
								"-webkit-animation"			: "snowFallTurn " + (this.fall * 0.5) + "s ease-in-out infinite",
								"transform-origin" 			: this.fr_x + "px " + this.fr_y + "px", 
								"animation"					: "snowFallTurn " + (this.fall * 0.5) + "s ease-in-out infinite"
							};
	};
			
	Snow.prototype.reRun = function()
	{
		this.d = setTimeout(snowingMove, 50, this);
	};
	
	// --------------------------------------------- SNOW
	
	function snowingInit(target, pixel_PNG, pixel_MAP)
	{
		_SNOW = new SnowMain(target, pixel_PNG, pixel_MAP);
				
		snowing();	
	}
			
	function snowing()
	{
		for(var i = 0; i < 60; i++)
		{
			var S = new Snow(i, _SNOW.snow_PNG, _SNOW.snow_MAP);
						
			S.setVals();
			S.build();
						
			_SNOW.snow_ARR.push(S);
						
			$(_SNOW.snow_DIV).prepend(S.html);
						
			snowingMove(S);					
		}
	}
			
	function snowingMove(ob)
	{
		$("#" + ob.com).css(ob.x_placement);
				
		$("#" + ob.com + " .snowTween").css(ob.css);
				
		$("#" + ob.com + " .snowInner").css(ob.flake_css);
				
		$("#" + ob.com + " .snowFlake").css(ob.sprite_css);
				
		$("#" + ob.com + " .snowTween").get(0).addEventListener("webkitAnimationEnd", snowingEnd, false);
		$("#" + ob.com + " .snowTween").get(0).addEventListener("animationend", snowingEnd, false);
	}
			
	function snowingEnd(event)
	{
		var TARG = event.target.parentElement.id;
				
		$("#" + TARG + " .snowTween").get(0).removeEventListener("webkitAnimationEnd", snowingEnd, false);
		$("#" + TARG + " .snowTween").get(0).removeEventListener("animationend", snowingEnd, false);
				
		$("#" + TARG + " .snowTween").removeAttr('style');
				
		for(var i in _SNOW.snow_ARR)
		{
			if(_SNOW.snow_ARR[i].com === TARG && _SNOW.snow_run)
			{
				_SNOW.snow_ARR[i].setVals();
				_SNOW.snow_ARR[i].build();
				_SNOW.snow_ARR[i].reRun();
			}
		}
	}
	
	function snowingHardEnd()
	{
		_SNOW.snow_run = false;
		
		for(var i in _SNOW.snow_ARR)
		{
			$("#" + _SNOW.snow_ARR[i].com + " .snowTween").get(0).removeEventListener("webkitAnimationEnd", snowingEnd, false);
			$("#" + _SNOW.snow_ARR[i].com + " .snowTween").get(0).removeEventListener("animationend", snowingEnd, false);
		}
	}