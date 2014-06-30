	
	var testControl = true;
	
	var testControlOb = {
							run_com		:	null,
							
							run_temp	:	"",
							
							run_state	:	"",
							
							run_init	: 	function()
											{
												this.run_com = setInterval(this.run_do, 20, this);
											},
											
							run_cancel	:	function()
											{
												clearInterval(this.run_com);
											},
											
							run_post	:	function(s)
											{
												this.run_temp = s;	
											},
											
							run_do		:	function(main)
											{
												if(main.run_temp !== main.run_state)
												{
													main.run_state = main.run_temp;
													
													$("#CONTROL_CHECK p").text(main.run_state);
												}
											}
						};
	
	var MAP_PLAYER;
	
	var HIT_TEST;
	
	var onEnterFrame;
	
	var checkHit = true;
	
	function controlInit()
	{
		MAP_PLAYER = {};
		MAP_PLAYER.block_x = LEVEL_MAIN.buildData.entry_x;
		MAP_PLAYER.block_y = LEVEL_MAIN.buildData.entry_y;
		MAP_PLAYER.current_x;
		MAP_PLAYER.current_y;
		MAP_PLAYER.enter = true;
		MAP_PLAYER.moveUnit = 80;
		MAP_PLAYER.walkUnit = 0.5;
		MAP_PLAYER.walkClass = "tween-map-goat-legs";
		MAP_PLAYER.walking = false;
		MAP_PLAYER.walkingX = false;
		MAP_PLAYER.walkingY = false;
		
		MAP_PLAYER.updateListen = true;
		
		MAP_PLAYER.hitEdge = false;
		
		MAP_PLAYER.crabEyes = false;
		
		MAP_PLAYER.enterPortal = false;
		MAP_PLAYER.portalObj;
		
		MAP_PLAYER.changeLevel = false;
		
		controlConvert_XY(false);
		firstMoveCheck();
	}
	
	function controlConvert_XY(send)
	{
		MAP_PLAYER.x = MAP_PLAYER.block_x * MAP_PLAYER.moveUnit;
		MAP_PLAYER.y = MAP_PLAYER.block_y * MAP_PLAYER.moveUnit;
		
		if(send)
		{
			controlConvert_check();
		}
	}
	
	function controlConvert_check()
	{
		if(MAP_PLAYER.current_x != MAP_PLAYER.x && !MAP_PLAYER.walkingX)
		{
			MAP_PLAYER.updateListen = false;
			
			MAP_PLAYER.walkingX = true;
			
			controlApply("X");
		}
		
		if(MAP_PLAYER.current_y != MAP_PLAYER.y && !MAP_PLAYER.walkingY)
		{
			MAP_PLAYER.updateListen = false;
			
			MAP_PLAYER.walkingY = true;
			
			controlApply("Y");
		}		
	}
	
	function firstMoveCheck()
	{
		var css_x;
		var css_y;
		
		if(MAP_PLAYER.enter)
		{
			
			if(PORTAL_LEVEL_TRAVEL)
			{
				for(var i in portals)
				{
					if(portals[i].id === "level" + GAME.mapLevel + "_portal" + GAME.portalEnterThrough)
					{
						PORTAL_TRAVEL = {};
						PORTAL_TRAVEL = portals[i];
						
						MAP_PLAYER.x = PORTAL_TRAVEL.x;
						MAP_PLAYER.y = PORTAL_TRAVEL.y;
						
						css_x = {
									"-webkit-transform" : "translateX(" + MAP_PLAYER.x + "px)",
									"transform" 		: "translateX(" + MAP_PLAYER.x + "px)"
								};
								
						css_y = {
									"-webkit-transform" : "translateY(" + MAP_PLAYER.y + "px)",
									"transform" 		: "translateY(" + MAP_PLAYER.y + "px)"
								};
								
						$(".player-area .player-x").css(css_x);
						
						$(".player-area .player-y").css(css_y);
						
						$(".player-area").css("opacity", 0);
						
						MAP_PLAYER.current_x = MAP_PLAYER.x = PORTAL_TRAVEL.x;	
						MAP_PLAYER.current_y = MAP_PLAYER.y = PORTAL_TRAVEL.y;
						
						MAP_PLAYER.enterPortal = true;
					}
				}
			}
			
			else
			{
				css_x = {
							"-webkit-transform" : "translateX(" + MAP_PLAYER.x + "px)",
							"transform" 		: "translateX(" + MAP_PLAYER.x + "px)"
						};			
				
				$(".player-area .player-x").css(css_x);
				
				MAP_PLAYER.current_x = MAP_PLAYER.x;
				
				css_y = {
							"-webkit-transform" : "translateY(" + -MAP_PLAYER.moveUnit + "px)",
							"transform" 		: "translateY(" + -MAP_PLAYER.moveUnit + "px)"
						};	
				
				$(".player-area .player-y").css(css_y);
				
				MAP_PLAYER.current_y = -MAP_PLAYER.moveUnit;
				
				$(".player-area .player-x").addClass("tween-map-goat-tile");
				$(".player-area .player-y").addClass("tween-map-goat-tile");	
			}
		}
	}
	
	function playerEnterMap()
	{
		var css_y;

		
		if(PORTAL_LEVEL_TRAVEL)
		{
			$(".player-area .player-x").addClass("tween-map-goat-tile");
			$(".player-area .player-y").addClass("tween-map-goat-tile");
			
			moveStageTest();
		}
		
		else
		{
			css_y = {
						"-webkit-transform" : "translateY(" + MAP_PLAYER.y + "px)",
						"transform" 		: "translateY(" + MAP_PLAYER.y + "px)"
					};	
						
			$(".player-area .player-y")[0].addEventListener("webkitTransitionEnd", controlEnd_y, false);
			$(".player-area .player-y")[0].addEventListener("transitionend", controlEnd_y, false);					
						
			$(".player-area .player-y").css(css_y);
		}
	}
	
	function controlSetup()
	{
		// alert("controlSetup();");
		
		
		hitTest_build();
		
		
		DISPLAY.hits = null;
		
		controlPlug();
	
	}
	
	function controlPlug()
	{
		// alert("controlPlug();");
		
		$(window)[0].addEventListener("keydown", registerKey, false);
		
/*
		$("#touchPad #touchPad-U").css("pointer-events", "auto");
		$("#touchPad #touchPad-D").css("pointer-events", "auto");
		$("#touchPad #touchPad-L").css("pointer-events", "auto");
		$("#touchPad #touchPad-R").css("pointer-events", "auto");
*/
		
		
		// $("#touchPad .touchPad-surface div")[0].addEventListener("touchstart", findInteraction, false);
		
		$("#touchPad #touchPad-U")[0].addEventListener("touchstart", registerTouch, false);
		$("#touchPad #touchPad-D")[0].addEventListener("touchstart", registerTouch, false);
		$("#touchPad #touchPad-L")[0].addEventListener("touchstart", registerTouch, false);
		$("#touchPad #touchPad-R")[0].addEventListener("touchstart", registerTouch, false);
		
		
		$("#touchPad #touchPad-U")[0].addEventListener("touchend", registerTouch, false);
		$("#touchPad #touchPad-D")[0].addEventListener("touchend", registerTouch, false);
		$("#touchPad #touchPad-L")[0].addEventListener("touchend", registerTouch, false);
		$("#touchPad #touchPad-R")[0].addEventListener("touchend", registerTouch, false);		
	}
	
	function controlUnplug()
	{
		$(window)[0].removeEventListener("keydown", registerKey, false);
		
/*
		$("#touchPad #touchPad-U").css("pointer-events", "none");
		$("#touchPad #touchPad-D").css("pointer-events", "none");
		$("#touchPad #touchPad-L").css("pointer-events", "none");
		$("#touchPad #touchPad-R").css("pointer-events", "none");
*/
		
		$("#touchPad #touchPad-U")[0].removeEventListener("touchstart", registerTouch, false);
		$("#touchPad #touchPad-D")[0].removeEventListener("touchstart", registerTouch, false);
		$("#touchPad #touchPad-L")[0].removeEventListener("touchstart", registerTouch, false);
		$("#touchPad #touchPad-R")[0].removeEventListener("touchstart", registerTouch, false);
		
		$("#touchPad #touchPad-U")[0].removeEventListener("touchend", registerTouch, false);
		$("#touchPad #touchPad-D")[0].removeEventListener("touchend", registerTouch, false);
		$("#touchPad #touchPad-L")[0].removeEventListener("touchend", registerTouch, false);
		$("#touchPad #touchPad-R")[0].removeEventListener("touchend", registerTouch, false);
		
		DISPLAY.userTouchPad = false;
			
		if(MAP_PLAYER.crabEyes)
		{
			MAP_PLAYER.crabEyes = false;
				
			$("#touchPad .touchPad-crab-eyes").removeClass("tween_touchCrabEyes");
		}
			
		
		// alert("controlUnplug();");	
	}
	
	function registerTouch(event)
	{
		var fakeEvent = {};
		
		event.preventDefault();
		
		if(event.type === "touchstart")
		{
			DISPLAY.userTouchPad = true;
			
			fakeEvent.keyCode = sortTouchDirection(event.target.id);
			
			MAP_PLAYER.storeEvent = fakeEvent;
			
			registerKey(fakeEvent);
			
			if(!MAP_PLAYER.crabEyes)
			{
				MAP_PLAYER.crabEyes = true;
				
				$("#touchPad .touchPad-crab-eyes").addClass("tween_touchCrabEyes");
			}
		}
		
		else
		{
			DISPLAY.userTouchPad = false;
			
			if(MAP_PLAYER.crabEyes)
			{
				MAP_PLAYER.crabEyes = false;
				
				$("#touchPad .touchPad-crab-eyes").removeClass("tween_touchCrabEyes");
			}
		}
	}
	
	function sortTouchDirection(str)
	{
		var c;
		
		switch(str)
		{
			case "touchPad-U":
			{
				//c = "UP";
				
				c = 38;
				
				break;
			}
			
			case "touchPad-D":
			{
				//c = "DOWN";
				
				c = 40;
				
				break;
			}
			
			case "touchPad-L":
			{
				//c = "LEFT";
				
				c = 37;
				
				break;
			}
			
			case "touchPad-R":
			{
				// c = "RIGHT";
				
				c = 39;
				
				break;
			}
		}
		
		if(c)
		{
			return c;
		}
	}
	
	function registerKey(event)
	{
		if(MAP_PLAYER.updateListen)
		{
			if(event.keyCode >= 37 && event.keyCode <= 40)
			{
				switch(event.keyCode)
				{
					case 37:
					{
						// LEFT
						
						if(!MAP_PLAYER.walkingX)
						{
							MAP_PLAYER.block_x -= MAP_PLAYER.walkUnit;
						}
						
						break;
					}
					
					case 38:
					{
						// UP
						
						if(!MAP_PLAYER.walkingY)
						{
							MAP_PLAYER.block_y -= MAP_PLAYER.walkUnit;
						}
						
						break;
					}
					
					case 39:
					{
						// RIGHT
						
						if(!MAP_PLAYER.walkingX)
						{
							MAP_PLAYER.block_x += MAP_PLAYER.walkUnit;
						}
						
						break;
					}
					
					case 40:
					{
						// DOWN
						
						if(!MAP_PLAYER.walkingY)
						{
							MAP_PLAYER.block_y += MAP_PLAYER.walkUnit;
						}
						
						break;
					}
				}
				
				controlConvert_XY(true);
			}
		}
	}
	
	function controlApply(axis)
	{
		var css_ht;
        
		// CHROME EDIT?	
        if(PORTAL_LEVEL_TRAVEL)
		{
			PORTAL_LEVEL_TRAVEL = false;
		}
		
		css_ht = {
					"-webkit-transform"	: "translate(" + MAP_PLAYER.x + "px, " + MAP_PLAYER.y + "px)",		
					"transform"			: "translate(" + MAP_PLAYER.x + "px, " + MAP_PLAYER.y + "px)"
				};
				
		$(".preHitTest .preHitTestBlock").css(css_ht);
		
		hitTest_init();
		
		controlApplyHitTest(axis);
	}
	
	function controlReset()
	{
		var css_ht;
		
		MAP_PLAYER.x = MAP_PLAYER.current_x;
		MAP_PLAYER.y = MAP_PLAYER.current_y;
		
		MAP_PLAYER.walkingX = false;
		MAP_PLAYER.walkingY = false;
		
		MAP_PLAYER.updateListen = true;
		
		MAP_PLAYER.hitEdge = false;
		
		MAP_PLAYER.enterPortal = false;
		MAP_PLAYER.portalObj = null;
		
		
		MAP_PLAYER.block_x = MAP_PLAYER.x / MAP_PLAYER.moveUnit;
		MAP_PLAYER.block_y = MAP_PLAYER.y / MAP_PLAYER.moveUnit;
		
		
		css_ht = 	{
						"-webkit-transform"	: "translate(" + MAP_PLAYER.current_x + "px, " + MAP_PLAYER.current_y + "px)",		
						"transform"			: "translate(" + MAP_PLAYER.current_x + "px, " + MAP_PLAYER.current_y + "px)"
					};
					
		$(".preHitTest .preHitTestBlock").css(css_ht);

				
	}
	
	function controlApplyHitTest(axis)
	{
		var css_x;
		var css_y;
		var css_ht;
		
		var exitFrame;
		
		if(MAP_PLAYER.hitEdge)
		{
			$("#dev_re").text("DONT WALK");
			
			// controlReset();
			
			exitFrame = setTimeout(controlReset, 20);
		}
		
		else
		{
			$("#dev_re").text("WALK");
			
			if(axis === "X")
			{
				css_x = {
							"-webkit-transform" : "translateX(" + MAP_PLAYER.x + "px)",
							"transform" 		: "translateX(" + MAP_PLAYER.x + "px)"
						};
				
				$(".player-area .player-x")[0].addEventListener("webkitTransitionEnd", controlEnd_x, false);
				$(".player-area .player-x")[0].addEventListener("transitionend", controlEnd_x, false);
						
				$(".player-area .player-x").css(css_x);
				
				controlWalk(true);
			}
			
			if(axis === "Y")
			{
				css_y = {
							"-webkit-transform" : "translateY(" + MAP_PLAYER.y + "px)",
							"transform" 		: "translateY(" + MAP_PLAYER.y + "px)"
						};	
						
				$(".player-area .player-y")[0].addEventListener("webkitTransitionEnd", controlEnd_y, false);
				$(".player-area .player-y")[0].addEventListener("transitionend", controlEnd_y, false);					
						
				$(".player-area .player-y").css(css_y);
				
				controlWalk(true);
			}	
		}
	}
	
	function controlEnd_x(event)
	{
		$(".player-area .player-x")[0].removeEventListener("webkitTransitionEnd", controlEnd_x, false);
		$(".player-area .player-x")[0].removeEventListener("transitionend", controlEnd_x, false);
		
		controlWalk(false);
			
		MAP_PLAYER.current_x = MAP_PLAYER.x;
			
		MAP_PLAYER.walkingX = false;
			
			
		controlEnd_axis();
	}
	
	function controlEnd_y(event)
	{
		$(".player-area .player-y")[0].removeEventListener("webkitTransitionEnd", controlEnd_y, false);
		$(".player-area .player-y")[0].removeEventListener("transitionend", controlEnd_y, false);
			
		controlWalk(false);
		
		MAP_PLAYER.current_y = MAP_PLAYER.y;
			
		MAP_PLAYER.walkingY = false;
			
		

		controlEnd_axis();
		
		moveStageTest();		
	}
	
	function controlEnd_axis()
	{
		MAP_PLAYER.updateListen = true;
			
		if(MAP_PLAYER.enter)
		{
			MAP_PLAYER.enter = false;
				
			controlSetup();	
		}
		
		// alert("controlEnd_axis(); " + MAP_PLAYER.enter);
		
		
		if(DISPLAY.userTouchPad)
		{
			registerKey(MAP_PLAYER.storeEvent);
		}
		
		if(MAP_PLAYER.enterPortal)
		{
			portalTravel(MAP_PLAYER.portalObj);				
		}			
	}
	
	function controlWalk(walk)
	{
		if(walk)
		{
			MAP_PLAYER.walking = true;
			$(".player-block .map-goat-legs").addClass(MAP_PLAYER.walkClass);
			$(".player-block .map-goat-legs")[0].addEventListener("webkitAnimationIteration", controlWalkCheck, false);
			$(".player-block .map-goat-legs")[0].addEventListener("animationiteration", controlWalkCheck, false);
		}
		
		else
		{
			MAP_PLAYER.walking = false;			
		}
	}
	
	function controlWalkCheck(event)
	{
		if(!MAP_PLAYER.walking)
		{
			$(".player-block .map-goat-legs").removeClass(MAP_PLAYER.walkClass);
			$(".player-block .map-goat-legs")[0].removeEventListener("webkitAnimationIteration", controlWalkCheck, false);
			$(".player-block .map-goat-legs")[0].removeEventListener("animationiteration", controlWalkCheck, false);
		}
	}
	
	function moveStageTest()
	{
		var exitFrame;
		
		var triggered = false;
		
		for(var i = 0; i < LEVEL_MAIN.buildData.block_h / DISPLAY.screenSections; i++)
		{
			if(MAP_PLAYER.y >= i * DISPLAY.screenSections && MAP_PLAYER.y < (i + 1) * DISPLAY.screenSections)
			{
				$("#dev_or").text("OUT OF RANGE AREA " + i);
				
				if(DISPLAY.screenSectionCurrent != i && !DISPLAY.screenSectionMove)
				{
					DISPLAY.screenSectionMove = true;
						
					DISPLAY.screenSectionStore = i;
						
					i * DISPLAY.screenSections === 0 ? DISPLAY.y = 0 : DISPLAY.y = -(i * DISPLAY.screenSections - 80);
					
					triggered = true;
						
					moveStageScreen();
				}
			}
		}
		
		// catch new level without stage screen move
		
		if(!triggered)
		{
			if(MAP_PLAYER.enterPortal)
			{
				exitFrame = setTimeout(portalTravelExit, 1000);
			}	
		}
	}
	
	function moveStageScreen()
	{
		var css;
		
		css =	{
					"-webkit-transform"		: "translateY(" + DISPLAY.y + "px)",
					"transform"				: "translateY(" + DISPLAY.y + "px)",
					"-webkit-transition"	: "-webkit-transform 1s ease-in-out",
					"transition"			: "transform 6s ease-in-out" 
				};
			
		$("#stage-roam .stageCenter-y")[0].addEventListener("webkitTransitionEnd", moveStageScreenEnd, false);
		$("#stage-roam .stageCenter-y")[0].addEventListener("transitionend", moveStageScreenEnd, false);
					
		$("#stage-roam .stageCenter-y").css(css);			
	}
	
	function moveStageScreenEnd(event)
	{
		var exitFrame;
		
		$("#stage-roam .stageCenter-y")[0].removeEventListener("webkitTransitionEnd", moveStageScreenEnd, false);
		$("#stage-roam .stageCenter-y")[0].removeEventListener("transitionend", moveStageScreenEnd, false);
		
		DISPLAY.screenSectionCurrent = DISPLAY.screenSectionStore;
		
		DISPLAY.screenSectionMove = false;
		
		if(MAP_PLAYER.enterPortal)
		{
			exitFrame = setTimeout(portalTravelExit, 1000);
		}	
	}
	

	
	function hitTest_build()
	{
		HIT_TEST = {};
		HIT_TEST.hits = null;
		HIT_TEST.hitEvent = false;
		HIT_TEST.hitInstance = "";
		HIT_TEST.touch_ui_conflict = false;
	}
	

	
	function hitTest_init()
	{
		HIT_TEST.hits = $(".collideCheck-player").collision(".collideCheck-field");
		
		DISPLAY.hits = $(".collideCheck-player").collision(".collideCheck-nav");
		
		PORTAL_COM.hits = $(".collideCheck-player").collision(".collideCheck-portal");
		
		if(DISPLAY.hits[0] != undefined || DISPLAY.hits[0] != null)
		{
			// TOUCH UI
			
			if($(DISPLAY.hits[0]).attr("id") === "touchPad" && !HIT_TEST.touch_ui_conflict)
			{
				HIT_TEST.touch_ui_conflict = true;
				
				$("#dev_ht").text("NO HIT");
			
				$("#touchPad").css("opacity", 0.4);				
			}
		}
		
		else
		{
			if(HIT_TEST.touch_ui_conflict)
			{
				HIT_TEST.touch_ui_conflict = false;
				
				$("#touchPad").css("opacity", 1);
			}			
		}
		
		
		// if a hit happens
		
		if(HIT_TEST.hits[0] != undefined || HIT_TEST.hits[0] != null)
		{
			MAP_PLAYER.hitEdge = true;
			
			$("#dev_ht").text("HIT");
		}
		
		// no hit
		
		else
		{
			MAP_PLAYER.hitEdge = false;
			
			$("#dev_ht").text("NO HIT");			
		}
		
		if(PORTAL_COM.hits[0] != undefined || PORTAL_COM.hits[0] != null)
		{
			if(!MAP_PLAYER.enterPortal)
			{
				MAP_PLAYER.enterPortal = true;
				
				controlUnplug();
				
				for(var i in portals)
				{
					if(portals[i].id === $(PORTAL_COM.hits[0]).attr("id"))
					{
						if(portals[i].j_type === "LEVEL")
						{
							if(portals[i].j_to_num != null)
							{
								PORTAL_LEVEL_TRAVEL = true;
								
								GAME.portalEnterThrough = portals[i].j_to_num;				
							}
							
							MAP_PLAYER.changeLevel = true;
							
							GAME.mapLevel = portals[i].j_to;
						}						
						
						if(portals[i].j_type === "STAGE")
						{
							MAP_PLAYER.changeLevel = false;
						}
						
						for(var j in portals)
						{
							if(portals[i].travel === portals[j].name)
							{
								MAP_PLAYER.portalObj = portals[j];
							}
						}
					}
				}
			}
		}		
	}