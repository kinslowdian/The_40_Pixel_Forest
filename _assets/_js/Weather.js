	/* @kinslowdian -- http://www.simonkinslow.com -- 2013 */
	


	var weatherUse_fog 	= false;
	var weatherUse_wind = false;
	var weatherUse_snow = false;
	var weatherUse_rain = false;
	
	function mapWeatherClear()
	{
		if(weatherUse_fog)
		{
			fogCancel();
			
			weatherUse_fog 	= false;
		}
		
		if(weatherUse_rain)
		{
			thunder.killStorm();
			
			weatherUse_rain = false;
			
			thunder = null;
		}
		
		if(weatherUse_wind)
		{
			if(windyCloudARR)
			{
				for(var i in windyCloudARR)
				{
					windyCloudARR[i].kill();
				}
				
				windyCloudARR.length = 0;
			}
			
			weatherUse_wind = false;
		}
		
		if(weatherUse_snow)
		{
			snowingHardEnd();
			
			weatherUse_snow = false;
		}
	}

// --------------------------------------------- FOG
	
	function fogInit()
	{
		weatherUse_fog = true;
		
		$(".weather-fog").addClass("weather-fog-cloud tween_weather-fog");
	}
	
	function fogCancel()
	{
		$(".weather-fog").removeClass("weather-fog-cloud tween_weather-fog");
	}
	
// --------------------------------------------- FOG
	


	
// --------------------------------------------- WIND
	
	var windyCloudARR;
	
	function windInit(clouds, speed)
	{
		weatherUse_wind = true;
		
		windyCloudARR = new Array();
		
		for(var i = 0; i < clouds; i++)
		{
			var w = new Wind($(".weather-wind"), i, speed);
			
			windyCloudARR.push(w);
			
			windyCloudARR[i].build();
		}
		
		trace("!!! ------------------------------------------------------ windInit(); once? !!!");
	}
	
	var Wind = function(container, id, speed)
	{
		this.container = container;
		this.id = "windyCloud" + id;
		this.num = id;
		this.born = true;
		this.exitFrame = null;
		this.speed = speed;
		this.html = '<div id="' + this.id + '" class="weather-wind-shadow-cloud-x"><div class="weather-wind-cloud-y pixels_weatherWindShadowCloud"></div></div>';
		this.cancel = false;
		this.run = false;
		
		trace("!!! ------------------------------------------------------ new Wind(" + id + ");");
			
	};
	
	Wind.prototype.build = function()
	{
		this.speedOffset	= Math.round(Math.random() * ((this.speed * 0.5) - -(this.speed * 0.5)) + -(this.speed * 0.5));
		this.startY 		= Math.round(Math.random() * ((DISPLAY._height * 0.75) - (DISPLAY._height * 0.25) + (DISPLAY._height * 0.25)));
		this.endY			= DISPLAY._height + Math.ceil(Math.random() * 200);
		this.resetY 		= -Math.round(Math.random() * (400 - 200) + 200);
		this._x				= Math.round(Math.random() * ((($(".woodland").width() + DISPLAY.center_X) - 136) - 20) + 20); 	
		this.speedExtra 	= Math.ceil(Math.random() * 3) + Math.round(Math.random() + 10) * 0.1;
		
		$(this.container).append(this.html);
		
		if(this.born)
		{
			this.born = false;
			
			windCreateCSS(this, (this.speed + this.speedOffset + 10));
		}
		
		else
		{
			windCreateCSS(this, ((this.speed + this.speedOffset) + this.speedExtra + 10));
		}			
	};
	
	Wind.prototype.kill = function()
	{
		this.cancel = true;
		
		clearTimeout(this.exitFrame);
		
		if(this.run)
		{
			this.run = false;
			
			$("#" + this.id + " .weather-wind-cloud-y")[0].addEventListener("webkitTransitionEnd", windBlowEnd, false);
			$("#" + this.id + " .weather-wind-cloud-y")[0].addEventListener("transitionend", windBlowEnd, false);
		}
	};
	
	//windCreateCSS(this, this._x, this.resetY, this.endY, ((this.speed + this.speedOffset) + this.speedExtra));
	
	function windCreateCSS(ob, speed)
	{
		ob.css_x = 		{
								"z-index"			: ob.num,
								"-webkit-transform"	: "translateX(" + ob._x + "px)",
								"transform"			: "translateX(" + ob._x + "px)"								
						};
		
		ob.css_STR = 	{
								"-webkit-transform"		: "translateY(" + ob.resetY + "px)",
								"transform"				: "translateY(" + ob.resetY + "px)",
								"-webkit-transition"	: "-webkit-transform " + speed + "s linear",
								"transition"			: "transform " + speed + "s linear"						
						};
						
		ob.css_END =	{
								"-webkit-transform"		: "translateY(" + ob.endY + "px)",
								"transform"				: "translateY(" + ob.endY + "px)"	
						};
						
		$("#" + ob.id).css(ob.css_x);
		$("#" + ob.id + " .weather-wind-cloud-y").css(ob.css_STR);
		
		ob.exitFrame = setTimeout(windBlow, 20, ob);
	}
	
	function windBlow(ob)
	{
		if(!ob.cancel && !ob.run)
		{
			ob.run = true;
			
			$("#" + ob.id + " .weather-wind-cloud-y")[0].addEventListener("webkitTransitionEnd", windBlowEnd, false);
			$("#" + ob.id + " .weather-wind-cloud-y")[0].addEventListener("transitionend", windBlowEnd, false);
		
			$("#" + ob.id + " .weather-wind-cloud-y").css(ob.css_END);
		}
	}
	
	function windBlowEnd(event)
	{
		var TARG = event.target.parentElement.id
		
		for(var i in windyCloudARR)
		{
			if(windyCloudARR[i].id === TARG)
			{
				$("#" + windyCloudARR[i].id + " .weather-wind-cloud-y")[0].removeEventListener("webkitTransitionEnd", windBlowEnd, false);
				$("#" + windyCloudARR[i].id + " .weather-wind-cloud-y")[0].removeEventListener("transitionend", windBlowEnd, false);
				
				
				$("#" + windyCloudARR[i].id).remove();
				
				windyCloudARR[i].run = false;
				
				if(!windyCloudARR[i].cancel)
				{
					windyCloudARR[i].build();
				}
			}
		}
	}
	
// --------------------------------------------- WIND



	
// --------------------------------------------- SNOW
			
	var _SNOW;
	
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
	
	
	function snowingInit(target, pixel_PNG, pixel_MAP)
	{
		weatherUse_snow = true;
		
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
		if(_SNOW.snow_run)
		{
			$("#" + ob.com).css(ob.x_placement);
					
			$("#" + ob.com + " .snowTween").css(ob.css);
					
			$("#" + ob.com + " .snowInner").css(ob.flake_css);
					
			$("#" + ob.com + " .snowFlake").css(ob.sprite_css);
					
			$("#" + ob.com + " .snowTween")[0].addEventListener("webkitAnimationEnd", snowingEnd, false);
			$("#" + ob.com + " .snowTween")[0].addEventListener("animationend", snowingEnd, false);
		}
	}
	
	// HERE
	function snowingMoveCancel(ob)
	{
		$("#" + ob.com + " .snowTween")[0].removeEventListener("webkitAnimationEnd", snowingEnd, false);
		$("#" + ob.com + " .snowTween")[0].removeEventListener("animationend", snowingEnd, false);		
	}
			
	function snowingEnd(event)
	{
		var TARG = event.target.parentElement.id;
				
		$("#" + TARG + " .snowTween")[0].removeEventListener("webkitAnimationEnd", snowingEnd, false);
		$("#" + TARG + " .snowTween")[0].removeEventListener("animationend", snowingEnd, false);
				
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
		if(_SNOW != null || _SNOW != undefined)
		{
			_SNOW.snow_run = false;
			
			for(var i in _SNOW.snow_ARR)
			{
				snowingMoveCancel(_SNOW.snow_ARR[i]);
			}
			
			_SNOW.snow_ARR.length = 0;
		}
	}
	
/*
	function snowingHardEnd()
	{
		_SNOW.snow_run = false;
		
		for(var i in _SNOW.snow_ARR)
		{
			snowingMoveCancel(_SNOW.snow_ARR[i]);
		}
		
		_SNOW.snow_ARR.length = 0;
	}
*/
	
// --------------------------------------------- SNOW

	var STRIKE = function(div, apply, complete, rain, fire)
	{
		this.target = div;
		this.delayCom;
		this.delayH = 6;
		this.delayL = 3;
		this.delayVal;
		this.funct_s = apply;
		this.funct_e = complete;
		this.firstStrike = true;
		this.secondStrike = false;
		this.rainCloud = rain;
		this.fire = fire;
		this.fireAlight = false;
		this.stormCancel = false;			
	};
			
	STRIKE.prototype.storm = function()
	{
		if(this.secondStrike)
		{
			this.secondStrike = false;
					
			this.delayH += Math.round(this.delayH * 0.5);
			this.delayL += Math.round(this.delayL * 0.5);
		}
				
		this.delayVal = Math.round(Math.random() * (this.delayH - this.delayL) + this.delayL);
				
		this.delayCom = setTimeout(this.funct_s, this.delayVal * 1000);
	};
			
	STRIKE.prototype.rain = function()
	{
		$(this.rainCloud).html(rain_html);
				
		$(this.rainCloud).css("opacity", "1");	
	};
			
	STRIKE.prototype.killStorm = function()
	{
		this.stormCancel = true;
				
		$(this.target)[0].removeEventListener("webkitAnimationEnd", thunder.funct_e, false);
		$(this.target)[0].removeEventListener("animationend", thunder.funct_e, false);
				
		clearTimeout(this.delayCom);	
	};
	
	var thunder;
			
	var rain_html = '<div class="rain tween_rain"></div>';
			
	var strikeFire_html = '<div class="flameInner tween_flameInner"><div class="flameTop pixels_flame tween_flameTop"></div><div class="flameMid pixels_flame tween_flameMid"></div><div class="flameBtm pixels_flame tween_flameBtm"></div></div>';
	
	var storm_html = '<div class="strike"></div><div class="rainCloud"></div><div class="haze tween_haze"></div>';
	
	function rainingInit()
	{
		weatherUse_rain = true;
		
		$(".weather-rain").html(storm_html); /* .rainHolder */
		
		thunder = new STRIKE(".strike", strikeDown, strikeDownEnd, ".rainCloud", ".flameHolder");
		thunder.storm();			
	}
	
	
	function strikeDown()
	{
		$(thunder.target).css("visibility", "visible");
				
		$(thunder.target)[0].addEventListener("webkitAnimationEnd", thunder.funct_e, false);
		$(thunder.target)[0].addEventListener("animationend", thunder.funct_e, false);
				
		$(thunder.target).addClass("tween_strike");
	}
			
	function strikeDownEnd(event)
	{
		var flameTarg;
				
		$(thunder.target).removeClass("tween_strike");
				
		$(thunder.target).css("visibility", "hidden");
				
		if(thunder.firstStrike)
		{
			thunder.firstStrike = false;
					
			thunder.secondStrike = true;
					
			thunder.rain();
		}
				
		else
		{
			if(thunder.fire && !thunder.fireAlight)
			{
				$(thunder.fire).each(function(i)
				{
					if($(this).attr("data-burning") === "false")
					{
						$(this).attr("data-burning", "true");
								
						$(this).html(strikeFire_html);
								
						$(this).css("opacity", 1);
								
						// break loop
						return false;
					}
							
					else if(i === $(thunder.fire).length - 1)
					{	
						thunder.fireAlight = true;
					}
				});
			}
		}
				
		if(!thunder.stormCancel)
		{
			thunder.storm();
		}
	}

// --------------------------------------------- RAIN



// --------------------------------------------- RAIN