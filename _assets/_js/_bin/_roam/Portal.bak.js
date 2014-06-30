	
	var PORTAL_COM;
	
	var portals;
	
	var PORTAL_TRAVEL;
	
	var PORTAL_LEVEL_TRAVEL;
	
	var Portal = function(div)
	{
		this.id			= $(div).attr("id");
		this.name		= $(div).attr("data-collideInstance");
		this.travel		= $(div).attr("data-travel");
		this.exit 		= $(div).attr("data-exitDir");
		this.x			= parseInt($(div).attr("data-x"));
		this.y			= parseInt($(div).attr("data-y"));
		this.w			= $(div).width();
		this.h			= $(div).height();
		this.cx			= Math.floor(this.w * 0.5) + this.x;
		this.cy			= Math.floor(this.h * 0.5) + this.y;
		this.j_type		= $(div).attr("data-journey");
		
		if($(div).attr("data-jump"))
		{
			this.j_to		= parseInt($(div).attr("data-jump"));
		}
		
		
		
		if($(div).attr("data-jump-to"))
		{
			this.j_to_num	= parseInt($(div).attr("data-jump-to"));	
		}
	
		$(div).removeAttr("data-collideInstance");
		$(div).removeAttr("data-travel");
		$(div).removeAttr("data-exitDir");
		$(div).removeAttr("data-x");
		$(div).removeAttr("data-y");
		$(div).removeAttr("data-journey");
		$(div).removeAttr("data-jump");
		$(div).removeAttr("data-jump-to");
	};
	
	
	
	
	var StarCont = function(holder, w, h, mass)
	{
		this.starCont_id 	= holder;
		this.starCont_w		= w;
		this.starCont_h		= h;
		this.starCont_mass	= mass;
		this.starCont_run	= true;
	};
	
	var Star = function(num, w, h, parentClass)
	{
		this.star_com			= parentClass;
		this.star_id 			= this.star_com.starCont_id + "_star" + num;
		this.star_boundary_w 	= w;
		this.star_boundary_h 	= h;
		this.use_starOpacityDepth = false;
	};
	
	Star.prototype.initValue = function(born)
	{
		this.star_size		= Math.round(Math.random() * (2 - 1) + 1);
		this.star_opacity 	= Math.round(Math.random() * (100 - 30) + 30) / 100;
		this.star_speed 	= Math.round(Math.random() * (12 - 4) + 4);
		this.star_off_sx	= Math.round(Math.random() * (20 - 5) + 5);
		// init x
		this.star_fx		= Math.floor(Math.random() * (this.star_boundary_w + 20)) + 10;
		// start x
		this.star_sx		= this.star_boundary_w + this.star_off_sx;
		// end x
		this.star_ex		= Math.round(Math.random() * (-10 - -20) + -20);
		this.star_sy		= Math.round(Math.random() * (this.star_boundary_h - 5) + 5);				
		
		this.ux				= 0;
		
		born ? this.ux = this.star_fx : this.ux = this.star_sx;
		
		this.use_starOpacityDepth ? this.star_opacity = this.star_opacity : this.star_opacity = 1;
		
		this.star_outer_css	= 	{
									"-webkit-transform"		: "translate3d(0," + this.star_sy + "px, 0)",
									"transform"				: "translate3d(0," + this.star_sy + "px, 0)",
									"opacity"			: this.star_opacity,
									"z-index"			: this.star_id
								};
								
		this.star_inner_css	=	{
									"width"					: this.star_size + "px",
									"height"				: this.star_size + "px"
								};
								
		this.star_engine_css =	{
									"-webkit-transform"		: "translate3d(" + this.ux + "px, 0, 0)",
									"transform"				: "translate3d(" + this.ux + "px, 0, 0)",
									"-webkit-transition" 	: "-webkit-transform " + this.star_speed  + "s linear",
									"transition" 			: "transform " + this.star_speed  + "s linear"				
								};
								
		this.move_css		=	{
									"-webkit-transform"		: "translate3d(" + this.star_ex + "px, 0, 0)",
									"transform"				: "translate3d(" + this.star_ex + "px, 0, 0)"									
								};
								
		this.html			= '<div id="' + this.star_id + '" class="starSpace-starHolder"><div class="starSpace-starSprite starSpace-starSprite-fill-basic"></div></div>';
		
	};
	
	Star.prototype.run = function()
	{
		this.d = setTimeout(starApply, 20, this);
	};
	
	function portalTravelCheckReset()
	{
		// alert("portalTravelCheckReset();");
		
		PORTAL_TRAVEL = false;
	
		PORTAL_LEVEL_TRAVEL = false;		
	}
	
	function readPortals()
	{
		PORTAL_COM = {};
		
		portals = new Array();
		
		$(".portal").each(function(i)
		{
			var p = new Portal(this);
		
			portals.push(p);
		});
		
		trace(portals);
		trace("portals.length == " + portals.length);
		
	}
	
	function starConstruct(obj)
	{
		
		for(var i = 0; i < obj.starArea.starCont_mass; i++)
		{
			var s = new Star(i, obj.starArea.starCont_w, obj.starArea.starCont_h, obj.starArea);
			
			
			s.initValue(true);
			
			obj.star_ARR.push(s);
			
			starBuild(obj, i);
		}
	}
	
	
	function starBuild(obj, v)
	{
		$("#" + obj.starArea.starCont_id + " .starSpace").append(obj.star_ARR[v].html);
		
		$("#" + obj.starArea.starCont_id + " #" + obj.star_ARR[v].star_id).css(obj.star_ARR[v].star_outer_css);
		
		$("#" + obj.starArea.starCont_id + " #" + obj.star_ARR[v].star_id + " .starSpace-starSprite").css(obj.star_ARR[v].star_inner_css);
		
		$("#" + obj.starArea.starCont_id + " #" + obj.star_ARR[v].star_id + " .starSpace-starSprite").css(obj.star_ARR[v].star_engine_css);
		
		obj.star_ARR[v].run();
	}

	
	function starApply(_s)
	{
		if(_s.star_com.starCont_run)
		{
			$("#" + _s.star_id + " .starSpace-starSprite").css(_s.move_css);
			$("#" + _s.star_id + " .starSpace-starSprite")[0].addEventListener("webkitTransitionEnd", starCycle, false); //get(0)	
			$("#" + _s.star_id + " .starSpace-starSprite")[0].addEventListener("transitionend", starCycle, false);	
		}
	}
	
	function starCancel(_s)
	{
		$("#" + _s.star_id + " .starSpace-starSprite")[0].removeEventListener("webkitTransitionEnd", starCycle, false);	
		$("#" + _s.star_id + " .starSpace-starSprite")[0].removeEventListener("transitionend", starCycle, false);			
	}
	
	
	function starCycle(event)
	{
		var PORTAL = event.target.parentElement.parentElement.parentElement.id;
		
		var TARG = event.target.parentElement.id;
		
		$("#" + TARG + " .starSpace-starSprite")[0].removeEventListener("webkitTransitionEnd", starCycle, false);	
		$("#" + TARG + " .starSpace-starSprite")[0].removeEventListener("transitionend", starCycle, false);	
		
		
		for(var i in BUILD_PORTAL)
		{
			if(BUILD_PORTAL[i].buildData.id === PORTAL)
			{
				for(var j in BUILD_PORTAL[i].star_ARR)
				{
					if(TARG === BUILD_PORTAL[i].star_ARR[j].star_id)
					{
						$("#" + BUILD_PORTAL[i].star_ARR[j].star_id).remove();
						
						if(BUILD_PORTAL[i].starArea.starCont_run)
						{
							BUILD_PORTAL[i].star_ARR[j].initValue(false);
							starBuild(BUILD_PORTAL[i], j);							
						}
					}
				}
			}
		}
	}
	
	
	function portalTravel(obj)
	{
		PORTAL_TRAVEL = {};
		
		PORTAL_TRAVEL = obj;
		
		$(".player-area .player-x").removeClass("tween-map-goat-tile");
		$(".player-area .player-y").removeClass("tween-map-goat-tile");
		
		$(".player-area .player-x")[0].removeEventListener("webkitTransitionEnd", controlEnd_x, false);
		$(".player-area .player-x")[0].removeEventListener("transitionend", controlEnd_x, false);
		$(".player-area .player-y")[0].removeEventListener("webkitTransitionEnd", controlEnd_y, false);
		$(".player-area .player-y")[0].removeEventListener("transitionend", controlEnd_y, false);
		

		$(".player-area")[0].addEventListener("webkitTransitionEnd", portalTravelEventCheck, false);
		$(".player-area")[0].addEventListener("transitionend", portalTravelEventCheck, false);
		
		$(".player-area").css("opacity", 0);
		
		$("#dev_fu").text("portalTravel();");
	}
	
	function portalTravelEventCheck(event)
	{
		var fadeDelay;
		
		if(event.propertyName === "opacity")
		{
			$(".player-area")[0].removeEventListener("webkitTransitionEnd", portalTravelEventCheck, false);
			$(".player-area")[0].removeEventListener("transitionend", portalTravelEventCheck, false);
			
			if(MAP_PLAYER.changeLevel)
			{
				fadeDelay = setTimeout(globalFade_IN, 20, "white", refreshRebuildLevel);
				//globalFade_OUT(refreshRebuildLevel);
				
				// FADE EDIT
				// map_fadeOutInit(false);
				// fadeDelay = setTimeout(map_fadeOutRun, 20, 1, "LOAD_NEW_LEVEL");
				
				levelWarping = true;
			}
			
			else
			{
				portalTravelTo();
			}
		}
	}
	
	
	function portalTravelTo()
	{
			
			var travel_css_x;
			var travel_css_y;
			
			$(".player-area")[0].removeEventListener("webkitTransitionEnd", portalTravelTo, false);
			$(".player-area")[0].removeEventListener("transitionend", portalTravelTo, false);
			
			
			travel_css_x = 	{
								"-webkit-transform"	: "translateX(" + PORTAL_TRAVEL.x + "px)",
								"transform"			: "translateX(" + PORTAL_TRAVEL.x + "px)"
							};
						
						
			travel_css_y = 	{
								"-webkit-transform"	: "translateY(" + PORTAL_TRAVEL.y + "px)",
								"transform"			: "translateY(" + PORTAL_TRAVEL.y + "px)"
							};
							
			$(".player-area .player-x").css(travel_css_x);
			$(".player-area .player-y").css(travel_css_y);				
			
			MAP_PLAYER.current_x = MAP_PLAYER.x = PORTAL_TRAVEL.x;	
			MAP_PLAYER.current_y = MAP_PLAYER.y = PORTAL_TRAVEL.y;
			
			moveStageTest();
	}
	
	function portalTravelExit()
	{
		var x;
		var y;
		var exit_css_x;
		var exit_css_y;
		var exit_css_h;
		
		switch(PORTAL_TRAVEL.exit)
		{
			case "UP":
			{
				x = PORTAL_TRAVEL.x;
				y = PORTAL_TRAVEL.y - (MAP_PLAYER.moveUnit * 0.5);
				
				break;
			}
			
			case "DOWN":
			{
				x = PORTAL_TRAVEL.x;
				y = PORTAL_TRAVEL.y + MAP_PLAYER.moveUnit;
								
				break;
			}
			
			case "LEFT":
			{
				x = PORTAL_TRAVEL.x - (MAP_PLAYER.moveUnit * 0.5);
				y = PORTAL_TRAVEL.y;
								
				break;
			}
			
			case "RIGHT":
			{
				x = PORTAL_TRAVEL.x + MAP_PLAYER.moveUnit;
				y = PORTAL_TRAVEL.y;
								
				break;
			}
		}
		
		
		exit_css_x = 	{
							"-webkit-transform"	: "translateX(" + x + "px)",
							"transform"			: "translateX(" + x + "px)"
						};
					
		exit_css_y =	{
							"-webkit-transform"	: "translateY(" + y + "px)",
							"transform"			: "translateY(" + y + "px)"			
						};
						
		exit_css_h =	{
							"-webkit-transform"	: "translate(" + x + "px, " + y + "px)",
							"transform"			: "translate(" + x + "px, " + y + "px)"		
						};
		
		$(".player-area .player-x").addClass("tween-map-goat-tile");
		$(".player-area .player-y").addClass("tween-map-goat-tile");
		
		$(".player-area .player-x").css(exit_css_x);
		$(".player-area .player-y").css(exit_css_y);
		$(".preHitTest .preHitTestBlock").css(exit_css_h);
		
		PORTAL_TRAVEL.save_x = x;
		PORTAL_TRAVEL.save_y = y;
	
		$(".player-area").css("opacity", 1);
	
		$(".player-area")[0].addEventListener("webkitTransitionEnd", portalTravelExitEnd, false);
		$(".player-area")[0].addEventListener("transitionend", portalTravelExitEnd, false);
		
		$("#dev_fu").text("portalTravelExit();");
	}
	
	function portalTravelExitEnd(event)
	{
		var exitFrame;
		
		if(event.propertyName === "opacity")
		{
			$(".player-area")[0].removeEventListener("webkitTransitionEnd", portalTravelExitEnd, false);
			$(".player-area")[0].removeEventListener("transitionend", portalTravelExitEnd, false);
			
			
			MAP_PLAYER.current_x = MAP_PLAYER.x = PORTAL_TRAVEL.save_x;	
			MAP_PLAYER.current_y = MAP_PLAYER.y = PORTAL_TRAVEL.save_y;
			
			exitFrame = setTimeout(portalComplete, 20);
			
			$("#dev_fu").text("portalTravelExitEnd(); bare 2");
		}
		
		$("#CONTROL_CHECK").text("END...?");	
	}
	
	function portalComplete()
	{
		// FAULT?
		
		if(levelWarping)
		{
			levelWarping = false;
		}
		
		controlReset();
		
		controlPlug();
		
		$("#CONTROL_CHECK").text("portalComplete();");
		
		// alert("portalComplete();");		
	}
	
	
	function portalClear()
	{
		var checkStar = true;
		
		
		for(var i in BUILD_PORTAL)
		{
			if(checkStar)
			{
				checkStar = false;
				
				trace("!!! --- checkStar:");
				trace(BUILD_PORTAL[i]);
			}
			
			BUILD_PORTAL[i].starArea.starCont_run = false;
			
			for(var j in BUILD_PORTAL[i].star_ARR)
			{
				starCancel(BUILD_PORTAL[i].star_ARR[j]);
			}
			
			BUILD_PORTAL[i].star_ARR.length = 0;
		}
		
		BUILD_PORTAL.length = 0;
		
		portals.length = 0;
	}
	