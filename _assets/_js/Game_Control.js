	
	/* --- CONTROL */
	
	var CONTROL_SIGNAL;
	
	var track_touchScreen_UI = false;
	
	/* --- PLAYER */
	
	var MAP_PLAYER;
	
	/* --- PORTAL_SCREEN */
	
	var PortalScreen;
	
	/* --- PORTAL */
	
	var portalData_ARR = new Array();
	
	var portals_ARR = new Array();
	
	var portalsOpened = false;
	
	var PORTAL_TRAVEL;
	
	/* --- ENEMY */
	
	/* --- HITTEST */
	
	var HIT_TEST;
	
	
	
	var game_levelChange = false;
	
	var game_introEntrance = true;
	
	
	function mapPlayer_init(playerMover, playerTween, playerWalkTweenX, playerWalkTweenY, playerWalkStop, playerWalkLoop, playerFadeTarget, hitTestArea)
	{
		MAP_PLAYER = {};
		
		MAP_PLAYER.pos_x = 120;
		MAP_PLAYER.pos_y = 120;
		MAP_PLAYER.cur_x = 120;
		MAP_PLAYER.cur_y = 120;
		MAP_PLAYER.dir = "STILL";
		MAP_PLAYER.move_default = 40;
		MAP_PLAYER.move = MAP_PLAYER.move_default;
		MAP_PLAYER.walking = false;
		
		MAP_PLAYER.playerMover 		= playerMover;
		MAP_PLAYER.playerTween 		= playerTween;
		MAP_PLAYER.playerWalkTween	= "";
		MAP_PLAYER.playerWalkTweenX = playerWalkTweenX;
		MAP_PLAYER.playerWalkTweenY = playerWalkTweenY;
		MAP_PLAYER.playerWalkStop	= playerWalkStop;
		MAP_PLAYER.playerWalkLoop	= playerWalkLoop;
		MAP_PLAYER.playerFadeTarget = playerFadeTarget;
		MAP_PLAYER.hitTestArea 		= hitTestArea;
		
		MAP_PLAYER.playerHead		= "mapPlayer_head_default";
		MAP_PLAYER.playerHeadCur	= "";
		 
		MAP_PLAYER.placement = {};
		MAP_PLAYER.placement.block_x = 0;
		MAP_PLAYER.placement.block_y = 0;
		MAP_PLAYER.placement.block_full = 80;
		MAP_PLAYER.placement.entry = "";
		MAP_PLAYER.placement.enterMap = false;
		
		// MAP_PLAYER link to CONTROL_SIGNAL if false comms is broken
		MAP_PLAYER.listen = false;
	}
	
	function controlSignal_init()
	{
		CONTROL_SIGNAL = {};
		
		CONTROL_SIGNAL.html = {};
		
		if(deviceTest.toString() === "object")
		{
			CONTROL_SIGNAL.enableTouch = true;

			$(window)[0].addEventListener("touchstart", screenTouchMainListen, false);
			$(window)[0].addEventListener("touchend", screenTouchMainListen, false);
			
			CONTROL_SIGNAL.html.touchNav = $("#touchPad").html();
			
			phoneRotate(null);

			trace("DEVICE === TOUCH");
		}
		
		else
		{
			CONTROL_SIGNAL.enableTouch = false;
			
			trace("DEVICE === KEYBOARD");
		
			$("#touchPad").remove();
			
			$("#displayErrorWrapper").remove();
		}
		
		CONTROL_SIGNAL.data = {};
		
		if(CONTROL_SIGNAL.enableTouch)
		{
			CONTROL_SIGNAL.data.x_measure = $("#touchPad-full").width();
			CONTROL_SIGNAL.data.y_measure = $("#touchPad-full").height();
			
			// CONTROL_SIGNAL.ui_ready = false;
			CONTROL_SIGNAL.firstTouch = true;
		}
	}
	
	function hitTest_init()
	{
		HIT_TEST = {};
		HIT_TEST.hits = null;
		
		HIT_TEST.hit_edge = false;
		HIT_TEST.hit_portal = false;
		HIT_TEST.hit_enemy = false;		
	}
	
	function mapPlayer_ready()
	{
		mapPlayer_headCheck();
		
		MAP_PLAYER.listen = true;
		
		CONTROL_SIGNAL.firstTouch = true;
		
		control_switch(true);
	}
	
	
	///////////////////////////////// --- CONTROL
	
	
	// CALL AFTER ENTRY (true), TURN OFF WHEN LEAVING (false)
	
	function control_switch(ON)
	{
		trace("control_switch(ON); === " + ON);
		
		if(ON)
		{
			if(CONTROL_SIGNAL.enableTouch)
			{
				track_touchScreen_UI = true;
				
				$("#touchPad-full")[0].addEventListener("touchstart", touchFind, false);
				$("#touchPad-full")[0].addEventListener("touchmove", touchFind, false);
				$("#touchPad-full")[0].addEventListener("touchend", touchFind, false);
				
				if(CONTROL_SIGNAL.firstTouch)
				{
					touchDisplay(null);	
				}
				
			}
			
			else
			{
				$(window)[0].addEventListener("keydown", keyboardFind, false);
				$(window)[0].addEventListener("keyup", keyboardFind, false);	
			}			
		}
		
		else
		{
			if(CONTROL_SIGNAL.enableTouch)
			{
				track_touchScreen_UI = false;
				
				$("#touchPad-full")[0].removeEventListener("touchstart", touchFind, false);
				$("#touchPad-full")[0].removeEventListener("touchmove", touchFind, false);
				$("#touchPad-full")[0].removeEventListener("touchend", touchFind, false);
				
				touchDisplay(null);	
			}
			
			else
			{
				$(window)[0].removeEventListener("keydown", keyboardFind, false);
				$(window)[0].removeEventListener("keyup", keyboardFind, false);	
			}
			
			$("#" + MAP_PLAYER.playerMover).removeClass(MAP_PLAYER.playerTween);			
		}
		
		control_reset();
	}
	
	function control_reset()
	{
		CONTROL_SIGNAL.data.moveDirection = "STILL";
		
		if(CONTROL_SIGNAL.enableTouch)
		{
			CONTROL_SIGNAL.data.x_percent = 0;
			CONTROL_SIGNAL.data.y_percent = 0;	
			
			touchFeedback();
		}
		
		mapPlayer_update();
	}
	
	function touchFirstTransition()
	{
		var css_touch;
		
		css_touch = 	{
							"-webkit-transform"	: "scale(1)",
							"transform"			: "scale(1)",
							"opacity"			: "1"
						};
		
		$("#touchPad_C .touchPad-cont").css(css_touch);		
	}
	
	function screenTouchMainListen(event)
	{
		event.preventDefault();

		if(track_touchScreen_UI)
		{
			touchFeedback();
			
			touchDisplay(event);
		}
	}

	function touchDisplay(event)
	{
		var css_max;
		var css_min;
		
		if(event != null)
		{
			event.preventDefault();
			
			if(event.type === "touchstart")
			{
				css_max = 	{
								"-webkit-transform"	: "scale(1)",
								"transform"			: "scale(1)",
								"opacity"			: "1"
							};
							
				css_min = 	{
								"-webkit-transform"	: "scale(0)",
								"transform"			: "scale(0)",
								"opacity"			: "0"
							};
			}
			
			if(event.type === "touchend")
			{
				css_max = 	{
								"-webkit-transform"	: "scale(0)",
								"transform"			: "scale(0)",
								"opacity"			: "0"
							};
							
				css_min = 	{
								"-webkit-transform"	: "scale(1)",
								"transform"			: "scale(1)",
								"opacity"			: "1"
							};
			}
			
		}
		
		else
		{
			if(CONTROL_SIGNAL.firstTouch)
			{
				CONTROL_SIGNAL.firstTouch = false;
				
				css_max = 	{
								"-webkit-transform"	: "scale(1)",
								"transform"			: "scale(1)",
								"opacity"			: "1"
							};
							
				css_min = 	{
								"-webkit-transform"	: "scale(0)",
								"transform"			: "scale(0)",
								"opacity"			: "0"
							};				
			}
			
			else
			{
				css_max = 	{
								"-webkit-transform"	: "scale(0)",
								"transform"			: "scale(0)",
								"opacity"			: "0"
							};
								
				css_min = 	{
								"-webkit-transform"	: "scale(1)",
								"transform"			: "scale(1)",
								"opacity"			: "1"
							};					
			}		
		}
		
		if(css_max && css_min)
		{
			$("#touchPad_C .touchPad-cont").css(css_max);
			$("#touchPad_C .touchPad-min").css(css_min);	
		}
	}
	
	function touchFind(event)
	{
		event.preventDefault();
		
		if(event.type === "touchstart" || event.type === "touchmove")
		{
			if(!CONTROL_SIGNAL.data.offset) //  === "NONE"
			{
				CONTROL_SIGNAL.data.offset = $("#touchPad-full").offset()
			}	
			
			CONTROL_SIGNAL.data.x = event.targetTouches[0].pageX - CONTROL_SIGNAL.data.offset.left;
			CONTROL_SIGNAL.data.y = event.targetTouches[0].pageY - CONTROL_SIGNAL.data.offset.top;
			
			if(CONTROL_SIGNAL.data.x >= 0 && CONTROL_SIGNAL.data.x <= CONTROL_SIGNAL.data.x_measure)
			{
				CONTROL_SIGNAL.data.x_percent = Math.round((CONTROL_SIGNAL.data.x / CONTROL_SIGNAL.data.x_measure) * 100);
			}
			
			if(CONTROL_SIGNAL.data.y >= 0 && CONTROL_SIGNAL.data.y <= CONTROL_SIGNAL.data.y_measure)
			{
				CONTROL_SIGNAL.data.y_percent = Math.round((CONTROL_SIGNAL.data.y / CONTROL_SIGNAL.data.y_measure) * 100);
			}
			
			touchControlSignal();
		}
		
		if(event.type === "touchend")
		{
			control_reset();
		}
	}
	
	function touchControlSignal()
	{
		if(CONTROL_SIGNAL.data.x_percent >= 33 && CONTROL_SIGNAL.data.x_percent < 66)
		{
			if(CONTROL_SIGNAL.data.y_percent >= 0 && CONTROL_SIGNAL.data.y_percent < 33)
			{
				CONTROL_SIGNAL.data.moveDirection = "UP";
			}
		}
		
		if(CONTROL_SIGNAL.data.x_percent >= 33 && CONTROL_SIGNAL.data.x_percent < 66)
		{
			if(CONTROL_SIGNAL.data.y_percent >= 66 && CONTROL_SIGNAL.data.y_percent <= 100)
			{
				CONTROL_SIGNAL.data.moveDirection = "DOWN";
			}
		}
		
		if(CONTROL_SIGNAL.data.x_percent >= 0 && CONTROL_SIGNAL.data.x_percent < 33)
		{
			if(CONTROL_SIGNAL.data.y_percent >= 33 && CONTROL_SIGNAL.data.y_percent < 66)
			{
				CONTROL_SIGNAL.data.moveDirection = "LEFT";
			}
		}
		
		if(CONTROL_SIGNAL.data.x_percent >= 66 && CONTROL_SIGNAL.data.x_percent <= 100)
		{
			if(CONTROL_SIGNAL.data.y_percent >= 33 && CONTROL_SIGNAL.data.y_percent < 66)
			{
				CONTROL_SIGNAL.data.moveDirection = "RIGHT";
			}
		}	
		
		touchFeedback();
		
		mapPlayer_update();
	}
	
	// CALLED FROM PHONE ROTATE EVENT (BUG FIX)
	
	function touchOffsetUpdate()
	{
		if(CONTROL_SIGNAL.enableTouch)
		{
			CONTROL_SIGNAL.data.offset = $("#touchPad-full").offset();	
		}
	}	
	
	function touchFeedback()
	{
		var ind;
		
		switch(CONTROL_SIGNAL.data.moveDirection)
		{
			case "UP":
			{
				ind = "touchPad-U-ind";
				
				break;
			}
			
			case "DOWN":
			{
				ind = "touchPad-D-ind";
				
				break;
			}
			
			case "LEFT":
			{
				ind = "touchPad-L-ind";
				
				break;
			}
			
			case "RIGHT":
			{
				ind = "touchPad-R-ind";
				
				break;
			}
		}
		
		if(CONTROL_SIGNAL.data.moveDirection === "STILL")
		{
			$("#" + CONTROL_SIGNAL.data.indicator).css("opacity", 0);
		
			CONTROL_SIGNAL.data.indicator = "";
		}
		
		
		else
		{
			if(ind !== CONTROL_SIGNAL.data.indicator)
			{
				$("#" + CONTROL_SIGNAL.data.indicator).css("opacity", 0);
				
				$("#" + ind).css("opacity", 1);
				
				CONTROL_SIGNAL.data.indicator = ind;	
			}		
		}
	}
	
	function keyboardFind(event)
	{
		if(event.type === "keyup")
		{
			CONTROL_SIGNAL.data.moveDirection = "STILL";
		}
		
		if(event.type === "keydown")
		{
			switch(event.keyCode)
			{
				case 37:
				{
					// LEFT
					
					CONTROL_SIGNAL.data.moveDirection = "LEFT";
					
					break;
				}
				
				case 38:
				{
					// UP
					
					CONTROL_SIGNAL.data.moveDirection = "UP";
					
					break;
				}
				
				case 39:
				{
					// RIGHT
					
					CONTROL_SIGNAL.data.moveDirection = "RIGHT";
					
					break;
				}
				
				case 40:
				{
					// DOWN
					
					CONTROL_SIGNAL.data.moveDirection = "DOWN";
					
					break;
				}
				
				default:
				{
					CONTROL_SIGNAL.data.moveDirection = "STILL";
				}
			}	
		}
		
		mapPlayer_update();
	}
	
	
	///////////////////////////////// --- CONTROL
	
	///////////////////////////////// --- PLAYER
	
	function mapPlayer_spawn(x, y, d, moveExtra)
	{
		var css;
		
		var map_x = 0;
		var map_y = 0;
		
		MAP_PLAYER.placement.block_x = x;
		MAP_PLAYER.placement.block_y = y;
		MAP_PLAYER.placement.entry = d;
		MAP_PLAYER.placement.enterMap = true;
		
		map_x = MAP_PLAYER.placement.block_x * MAP_PLAYER.placement.block_full;
		map_y = MAP_PLAYER.placement.block_y * MAP_PLAYER.placement.block_full;
		
		MAP_PLAYER.pos_x = MAP_PLAYER.cur_x = map_x;
		MAP_PLAYER.pos_y = MAP_PLAYER.cur_y = map_y;
		
		
		css = 	{
					"-webkit-transform"	: "translate(" + MAP_PLAYER.pos_x + "px, " + MAP_PLAYER.pos_y + "px)",
					"transform"			: "translate(" + MAP_PLAYER.pos_x + "px, " + MAP_PLAYER.pos_y + "px)"
				};
		
		$("#" + MAP_PLAYER.playerMover).css(css);
	
	
		if(moveExtra)
		{
			// MAP_PLAYER.move += MAP_PLAYER.move;
			
			MAP_PLAYER.move = (MAP_PLAYER.move_default * 2);
		}
		
		else
		{
			MAP_PLAYER.move = MAP_PLAYER.move_default;
		}
	}
	
	function mapPlayer_headCheck()
	{
		if(MAP_PLAYER.playerHead !== MAP_PLAYER.playerHeadCur)
		{
			$("." + MAP_PLAYER.playerFadeTarget + " .map-goat-head").addClass(MAP_PLAYER.playerHead);
			
			MAP_PLAYER.playerHeadCur = MAP_PLAYER.playerHead;
		}
	}
	
	function mapPlayer_entry()
	{
		trace("mapPlayer_entry();");
		
		hitTest_init();
		
		CONTROL_SIGNAL.data.moveDirection = MAP_PLAYER.placement.entry;
		
		MAP_PLAYER.placement.entry = "";
		
		$("#" + MAP_PLAYER.playerMover).addClass(MAP_PLAYER.playerTween);
		
		$("." + MAP_PLAYER.playerFadeTarget).css("opacity", 1);
		
		mapPlayer_update();
	}
	
	function mapPlayer_update()
	{
		if(MAP_PLAYER.listen || MAP_PLAYER.placement.enterMap)
		{
			if(CONTROL_SIGNAL.data.moveDirection !== MAP_PLAYER.dir && !MAP_PLAYER.walking)
			{
				if(CONTROL_SIGNAL.data.moveDirection === "UP")
				{
					MAP_PLAYER.pos_y -= MAP_PLAYER.move;
					
					MAP_PLAYER.playerWalkTween = MAP_PLAYER.playerWalkTweenX;
				}
				
				if(CONTROL_SIGNAL.data.moveDirection === "DOWN")
				{
					MAP_PLAYER.pos_y += MAP_PLAYER.move;
					
					MAP_PLAYER.playerWalkTween = MAP_PLAYER.playerWalkTweenX;
				}
				
				if(CONTROL_SIGNAL.data.moveDirection === "LEFT")
				{
					MAP_PLAYER.pos_x -= MAP_PLAYER.move;
					
					MAP_PLAYER.playerWalkTween = MAP_PLAYER.playerWalkTweenY;
				}
				
				if(CONTROL_SIGNAL.data.moveDirection === "RIGHT")
				{
					MAP_PLAYER.pos_x += MAP_PLAYER.move;
					
					MAP_PLAYER.playerWalkTween = MAP_PLAYER.playerWalkTweenY;
				}
				
				if(MAP_PLAYER.pos_x != MAP_PLAYER.cur_x || MAP_PLAYER.pos_y != MAP_PLAYER.cur_y)
				{
					MAP_PLAYER.walking = true;
					
					mapPlayer_move();
				}
				
				MAP_PLAYER.dir = CONTROL_SIGNAL.data.moveDirection;
			}	
		}		
	}
	
	function mapPlayer_move()
	{
		var css;
		
		css = 	{
					"-webkit-transform"	: "translate(" + MAP_PLAYER.pos_x + "px, " + MAP_PLAYER.pos_y + "px)",
					"transform"			: "translate(" + MAP_PLAYER.pos_x + "px, " + MAP_PLAYER.pos_y + "px)"
				};
		
		$("#" + MAP_PLAYER.hitTestArea).css(css);
		
		hitTest();
		
		if(HIT_TEST.hit_edge)
		{
			MAP_PLAYER.pos_x = MAP_PLAYER.cur_x;
			MAP_PLAYER.pos_y = MAP_PLAYER.cur_y;
			
			MAP_PLAYER.walking = false;
			
			MAP_PLAYER.dir = "STILL";
		}
		
		else
		{
			if(HIT_TEST.hit_enemy)
			{
				// Temp.js
				preBattleOptions_init();
				// Temp.js
			}
			
			$("#" + MAP_PLAYER.playerMover + " .player-sprite").addClass(MAP_PLAYER.playerWalkTween);
			
			if(HIT_TEST.hit_portal)
			{
				$("." + MAP_PLAYER.playerFadeTarget).css("opacity", 0);
			}
			
			$("#" + MAP_PLAYER.playerMover + " .player-sprite .map-goat-legs").removeClass(MAP_PLAYER.playerWalkStop).addClass(MAP_PLAYER.playerWalkLoop);
			
			
			$("." + MAP_PLAYER.playerTween)[0].addEventListener("webkitTransitionEnd", mapPlayer_move_end, false);
			$("." + MAP_PLAYER.playerTween)[0].addEventListener("transitionend", mapPlayer_move_end, false);
			
			$("#" + MAP_PLAYER.playerMover).css(css);	
		}		
	}
	
	function mapPlayer_move_end(event)
	{
		$("." + MAP_PLAYER.playerTween)[0].removeEventListener("webkitTransitionEnd", mapPlayer_move_end, false);
		$("." + MAP_PLAYER.playerTween)[0].removeEventListener("transitionend", mapPlayer_move_end, false);
		
		MAP_PLAYER.cur_x = MAP_PLAYER.pos_x;
		MAP_PLAYER.cur_y = MAP_PLAYER.pos_y;
		
		MAP_PLAYER.walking = false;
		
		MAP_PLAYER.dir = "STILL";
		
		$("#" + MAP_PLAYER.playerMover + " .player-sprite").removeClass(MAP_PLAYER.playerWalkTween);
		$("#" + MAP_PLAYER.playerMover + " .player-sprite .map-goat-legs").removeClass(MAP_PLAYER.playerWalkLoop).addClass(MAP_PLAYER.playerWalkStop);
		
		if(MAP_PLAYER.placement.enterMap)
		{
			MAP_PLAYER.placement.enterMap = false;
			
			if(MAP_PLAYER.move != 40)
			{
				MAP_PLAYER.move = 40;	
			}
			
			mapPlayer_storeEntry(MAP_PLAYER.cur_x, MAP_PLAYER.cur_y);
			
			mapPlayer_ready();
		}
		
		if(HIT_TEST.hit_portal)
		{
			gameStateChange("PORTAL");	
		}
		
		if(HIT_TEST.hit_enemy)
		{
			gameStateChange("ENEMY");
		}
		
		else
		{
			mapPlayer_update();
		}
		
		moveStageTest();
	}
	
	function gameStateChange(gotoState)
	{
		MAP_PLAYER.listen = false;
		
		control_switch(false);
		
		if(gotoState === "PORTAL")
		{
			portalEntry(HIT_TEST.hit_portal_id);
		}
		
		if(gotoState === "ENEMY")
		{
			enemyEntry(HIT_TEST.hit_enemy_id);
		}
	}
	
	
	///////////////////////////////// --- PLAYER
	
	
	
	///////////////////////////////// --- PORTAL_SCREEN
	
	function portalScreen_init()
	{
		PortalScreen = {};
		PortalScreen.html = "";
		PortalScreen.displayed = false;
		PortalScreen.delay = null;
		
		PortalScreen.html = $("#portalScreen").html();
		
		// protalScreenHTML = $("#portalScreen").html();
		
		$("#portalScreen").html("");
	}

	function portalScreen_request()
	{
		// portalScreenDisplayed = true;
		
		PortalScreen.displayed = true;
		
		$("#portalScreen").html(PortalScreen.html);
		
		// EXIT FRAME
		PortalScreen.delay = setTimeout(portalScreen_run, 20);
	}
	
	function portalScreen_run()
	{
		var css;
		
		css = 	{
					"-webkit-transform"	: "translateX(0%)",
					"transform"			: "translateX(0%)"
				};
				
		$("#portalScreen .portalScreen_wrapper").css(css);
		
		$(".tween-portalScreen_wrapper")[0].addEventListener("webkitTransitionEnd", portalScreen_screen0, false);
		$(".tween-portalScreen_wrapper")[0].addEventListener("transitionend", portalScreen_screen0, false);		
	}
	
	function portalScreen_screen0(event)
	{
		$(".tween-portalScreen_wrapper")[0].removeEventListener("webkitTransitionEnd", portalScreen_screen0, false);
		$(".tween-portalScreen_wrapper")[0].removeEventListener("transitionend", portalScreen_screen0, false);		
	
		$("#portalScreen .portalScreen_fade").css("opacity", 0);
		
		PortalScreen.delay = setTimeout(portalScreen_screen1, 2 * 1000);
		
		level_clear();
		
		level_init();
		
		$("#portalScreen h1").text(LEVEL_MAIN.titleData.top);
		$("#portalScreen h2").text(LEVEL_MAIN.titleData.btm);
	}
	
	function portalScreen_screen1()
	{
		var css;
		
		css = 	{
					"-webkit-transform"	: "translateY(0%)",
					"transform"			: "translateY(0%)"
				};
				
		$("#portalScreen .portalScreen_green").css(css);
	
		$(".tween-portalScreen_green")[0].addEventListener("webkitTransitionEnd", portalScreen_screen2, false);
		$(".tween-portalScreen_green")[0].addEventListener("transitionend", portalScreen_screen2, false);
	}
	
	function portalScreen_screen2(event)
	{
		$(".tween-portalScreen_green")[0].removeEventListener("webkitTransitionEnd", portalScreen_screen2, false);
		$(".tween-portalScreen_green")[0].removeEventListener("transitionend", portalScreen_screen2, false);
		
		$("#portalScreen .portalScreen_map-goat .player-sprite").removeClass("tween-player-walkX");
		$("#portalScreen .portalScreen_map-goat .map-goat-head").removeClass("mapPlayer_head_default").addClass("mapPlayer_head_fear");
		$("#portalScreen .portalScreen_map-goat .map-goat-legs").removeClass("tween-mapPlayerWalk_loop").addClass("tween-mapPlayerWalk_stop");		
		
		$("#portalScreen .portalScreen_header").css("opacity", 1);
		
		
		$(".tween-portalScreen_header")[0].addEventListener("webkitTransitionEnd", portalScreen_screen3, false);
		$(".tween-portalScreen_header")[0].addEventListener("transitionend", portalScreen_screen3, false);
	}
	
	function portalScreen_screen3(event)
	{
		$(".tween-portalScreen_header")[0].removeEventListener("webkitTransitionEnd", portalScreen_screen3, false);
		$(".tween-portalScreen_header")[0].removeEventListener("transitionend", portalScreen_screen3, false);		
		
	
		PortalScreen.delay = setTimeout(portalScreen_screen4, 2 * 1000);
	}
	
	function portalScreen_screen4()
	{
		var css;
		
		css = 	{
					"-webkit-transform"	: "translateX(100%)",
					"transform"			: "translateX(100%)"
				};
				
		$("#portalScreen .portalScreen_wrapper").css(css);
		
		$(".tween-portalScreen_wrapper")[0].addEventListener("webkitTransitionEnd", portalScreen_remove, false);
		$(".tween-portalScreen_wrapper")[0].addEventListener("transitionend", portalScreen_remove, false);	
	}
	
	function portalScreen_remove(event)
	{
		$(".tween-portalScreen_wrapper")[0].removeEventListener("webkitTransitionEnd", portalScreen_remove, false);
		$(".tween-portalScreen_wrapper")[0].removeEventListener("transitionend", portalScreen_remove, false);
		
		$("#portalScreen").html("");
		
		level_player_setup();
		moveStageTest();		
	}	
	
	///////////////////////////////// --- PORTAL_SCREEN
	
	
	
	///////////////////////////////// --- PORTAL
	
	var portal = function(settings, container)
	{
		this.settings 				= settings;
		this.buildData				= {};
		this.buildData.html			= html_lib_use("_portal", false, true);
		this.buildData.container 	= container;
		
		trace(this);
	};
	
	portal.prototype.portal_open = function()
	{	
		this.spawn				= this.settings.spawn;
		this.num 				= this.settings.num;
		this.id 				= "portal_" +  this.spawn + "_" + this.num; // PORTAL NUMBER 1 ON LEVEL 0 === #portal_0_1;
		
		this.buildData.block_x 	= this.settings.x;
		this.buildData.block_y 	= this.settings.y;
		this.buildData.x		= this.buildData.block_x * 80;
		this.buildData.y 		= this.buildData.block_y * 80;
		this.buildData.w 		= this.settings.w * 80;
		this.buildData.h 		= this.settings.h * 80;
		
		this.level				= this.settings.level;
		this.exit				= this.settings.exit;	
		this.direction 			= this.settings.direction;
		
		this.buildData.css	=	{
									"-webkit-transform"	: "translate(" + this.buildData.x + "px, " + this.buildData.y + "px)",
									"transform"			: "translate(" + this.buildData.x + "px, " + this.buildData.y + "px)"
								};
		
		delete this.settings;
	};
	
	portal.prototype.build = function(levelCheck)
	{
		$(this.buildData.container).append(this.buildData.html);
		$(this.buildData.container + " #_portal").attr("id", this.id);
			
		$("#" + this.id).css(this.buildData.css);
	}
	
	function portalRead()
	{
		for(var levelData in Logic.dat_ROM["_LEVELS"])
		{
			for(var i in Logic.dat_ROM["_LEVELS"][levelData]["portal"])
			{
				portalData_ARR.push(Logic.dat_ROM["_LEVELS"][levelData]["portal"][i]);
			}
		}

		trace("SAFE");
		trace(portalData_ARR);
		
		for(var j in portalData_ARR)
		{
			var p = new portal(portalData_ARR[j], ".portal-area");
			
			p.portal_open();
			
			portals_ARR.push(p);
		}
		
		portalsOpened = true;				
	}
	
	function portalEntry(portal_hit)
	{
		for(var i in portals_ARR)
		{
			if(portals_ARR[i].id === portal_hit)
			{
				// STAGE TRAVEL
				
				if(portals_ARR[i].level == ROM.mapLevel)
				{
					for(var j in portals_ARR)
					{
						if(portals_ARR[i].level == portals_ARR[j].spawn)
						{
							if(portals_ARR[i].exit == portals_ARR[j].num)
							{
								PORTAL_TRAVEL = {};
								PORTAL_TRAVEL = portals_ARR[j];	
								
								portalExit();
								
								break;	
							}	
						}
					}
					
					break; 
				}
				
				// LEVEL TRAVEL
				
				else
				{
					for(var k in portals_ARR)
					{
						if(portals_ARR[i].level == portals_ARR[k].spawn)
						{
							if(portals_ARR[i].exit == portals_ARR[k].num)
							{
								game_levelChange = true;
								
								PORTAL_TRAVEL = {};
								PORTAL_TRAVEL = portals_ARR[k];
								
								ROM.mapLevel = portals_ARR[i].level;
								
								trace("!!!! GOING TO: " + ROM.mapLevel);
								trace(PORTAL_TRAVEL);
								
								// NEEDS TO BE IN OWN FUNCTION AND CALLED AFTER FADE:
								// level_clear();	
								
								// level_init();
								
								portalScreen_request();
								
								// portalExit();
								
								break;
							}
						}
					}	
				}
			}
		}
	}
	
	function portalExit()
	{
		trace("!----- portalExit(); === ");
		trace(PORTAL_TRAVEL);
		
		
		if(PORTAL_TRAVEL.direction === "LEFT" || PORTAL_TRAVEL.direction === "UP")
		{
			mapPlayer_spawn(PORTAL_TRAVEL.buildData.block_x, PORTAL_TRAVEL.buildData.block_y, PORTAL_TRAVEL.direction, false);			
		}
		
		else
		{
			mapPlayer_spawn(PORTAL_TRAVEL.buildData.block_x, PORTAL_TRAVEL.buildData.block_y, PORTAL_TRAVEL.direction, true); // true;	
		}
		
	}	
	
	///////////////////////////////// --- PORTAL
	
	
	
	
	///////////////////////////////// --- ENEMY
	
	function enemyEntry(enemy_hit)
	{
		ROM.enemy = {};
		
		for(var attacker in enemies_ARR)
		{
			if(enemies_ARR[attacker].id === enemy_hit)
			{
				ROM.enemy.character = enemies_ARR[attacker];
			}
		}
		
		trace("-------------- enemyEntry();");
		
		trace(ROM.enemy);
		
		trace("-------------- enemyEntry();");
		
		// Temp.js
		preBattleOptions_build();
		// Temp.js
		
		attackCloud_0();
	}
	
	function attackCloud_0()
	{
		var delay_sequence;
		
		$(".player-sprite .actionCloudMain-1").css("visibility", "visible");
		
		$(".player-sprite .actionCloudMain-1 .actionCloudSprite-outer").addClass("tween-actionCloudSpriteOuterAlt");
		
		$(".player-sprite .actionCloudMain-1 .actionCloudSprite-inner").addClass("tween-actionCloudSpriteInner");	
		
		$("#roam_wrapper").addClass("tween-fieldSmash");
		
		delay_sequence = setTimeout(attackCloud_1, 0.2 * 1000);
	}
	
	function attackCloud_1()
	{
		var delay_sequence;
		
		$(".player-sprite .actionCloudMain-0").css("visibility", "visible");
		
		$(".player-sprite .actionCloudMain-0 .actionCloudSprite-outer").addClass("tween-actionCloudSpriteOuter");
		
		$(".player-sprite .actionCloudMain-0 .actionCloudSprite-inner").addClass("tween-actionCloudSpriteInner");			
		
		// Temp.js
		delay_sequence = setTimeout(preBattleOptions_show, 1.2 * 1000);
		// Temp.js
	}
	
	function attackCloud_end()
	{
		
	}
	
	///////////////////////////////// --- ENEMY
	
	
	
	
	///////////////////////////////// --- HITTEST
	
	function hitTest()
	{
		var hit_id = "";
		
		HIT_TEST.hits = $(".collideCheck-player").collision(".collideCheck-field");
		
		HIT_TEST.hit_edge = false;
		HIT_TEST.hit_portal = false;
		HIT_TEST.hit_enemy = false;
		
		HIT_TEST.hit_portal_id = "";
		HIT_TEST.hit_enemy_id = "";
		
		if(HIT_TEST.hits[0] != undefined || HIT_TEST.hits[0] != null)
		{
			trace(HIT_TEST);
			
			if($(HIT_TEST.hits[0]).attr("id"))
			{
				hit_id = $(HIT_TEST.hits[0]).attr("id");
			}
			
			
			if($(HIT_TEST.hits[0]).attr("data-npc") === "edge")
			{
				HIT_TEST.hit_edge = true;
				
				// alert("HIT! - EG #" + hit_id + " " + $(HIT_TEST.hits[0]).html());		
			}
			
			if($(HIT_TEST.hits[0]).attr("data-npc") === "portal")
			{
				HIT_TEST.hit_portal = true;
				
				HIT_TEST.hit_portal_id = hit_id;
				
				// alert("HIT! - PO #" + hit_id + " " + $(HIT_TEST.hits[0]).html());	
			}
			
			if($(HIT_TEST.hits[0]).attr("data-npc") === "enemy")
			{
				HIT_TEST.hit_enemy = true;
				
				HIT_TEST.hit_enemy_id = hit_id;
			
				// alert("HIT! - EN #" + hit_id + " " + $(HIT_TEST.hits[0]).html());
			}
			
			// alert("HIT!");
		}
	}	
	
	///////////////////////////////// --- HITTEST
	
	
	
	
	
	
	