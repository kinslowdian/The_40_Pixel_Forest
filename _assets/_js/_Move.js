	
	var MAP_PLAYER;
	
	var HIT_TEST;
	
	var introFallIntoMap = true;
	
	var listenForQuestEntry = true;
	
	var playerInBattle = false;
	
	var playerInPortal = false;
	var playerExitPortal = false;
	
	var portalTravelType = "";
	
	var playerLevelTravel = false;
	
	var html_snapShot_preBattle;
	
	var TOUCH_UI;
	
	
	function controlNewLevel()
	{
		initMapPlayer();
		hitTest_build();
		
		// SET IF USER IS ON A TOUCH DEVICE
		
		initTouchUI();
	}
	
	function mapPlayerStartQuest()
	{
		if(introFallIntoMap)
		{
			introFallIntoMap = false;
			
			mapPlayerEntry(false);
		}
		
		else
		{
			moveStageTest();
		}
	}
	
	function controlsInit()
	{
		controlPort(true);
	}
	
	function controlsCancel(fullCancel)
	{
		controlPort(false);
		
		if(fullCancel)
		{
			mapPlayerAxisEventCancel();
		}
	}
	
	function initMapPlayer()
	{
		MAP_PLAYER 				= {};
		
		MAP_PLAYER.block_x		= 0;
		MAP_PLAYER.block_y		= 0;
		MAP_PLAYER.moveUnit		= 80;
		MAP_PLAYER.walkUnit		= 0.5;
		MAP_PLAYER.entry_d		= "";
		
		MAP_PLAYER.x			= 0;
		MAP_PLAYER.y			= 0;
		
		MAP_PLAYER.current_x	= 0;
		MAP_PLAYER.current_y	= 0;
		
		MAP_PLAYER.tweenClass	= "tween-map-goat-tile";
		MAP_PLAYER.walkClass 	= "tween-map-goat-legs";
		
		MAP_PLAYER.allowControl	= false;
	}
	
	function initTouchUI()
	{
		TOUCH_UI = {};
		
		TOUCH_UI.userTouchPad = false;
		TOUCH_UI.storeEvent = null;
	}
	
	function controlTouchUI(show)
	{
		if(show)
		{
			$("#touchPad").css("opacity", "1");
			$(".touchPad-area").css("pointer-events", "auto");
		}
		
		else
		{
			$("#touchPad").css("opacity", "0");
			$(".touchPad-area").css("pointer-events", "none");
		}
	}
	
	
	function mapPlayerPlace()
	{
		// FIRST LEVEL
		
		if(introFallIntoMap)
		{
			MAP_PLAYER.block_x = LEVEL_MAIN.buildData.entry_x;
			MAP_PLAYER.block_y = LEVEL_MAIN.buildData.entry_y;
			MAP_PLAYER.entry_d = LEVEL_MAIN.buildData.entry_d;
		}
		
		
		// PORTAL
		
		else
		{
			if(portalTravelType === "STAGE")
			{
				MAP_PLAYER.x = MAP_PLAYER.portalObj.x; 
				MAP_PLAYER.y = MAP_PLAYER.portalObj.y; 
				MAP_PLAYER.entry_d = MAP_PLAYER.portalObj.exit;	
			}
			
			if(portalTravelType === "LEVEL")
			{
				for(var i in portals)
				{
					if(portals[i].id === "level" + GAME.mapLevel + "_portal" + GAME.portalEnterThrough)
					{
						MAP_PLAYER.portalObj = portals[i];
					}
				}
				
				
				MAP_PLAYER.x = MAP_PLAYER.portalObj.x; 
				MAP_PLAYER.y = MAP_PLAYER.portalObj.y; 
				MAP_PLAYER.entry_d = MAP_PLAYER.portalObj.exit;
				
				$(".player-area").css("opacity", 0);	// 0
				controlTouchUI(false);			
			}
			
			revert_XY();			
		}
		
		controlConvert_XY(false);
	}
	
	function mapPlayerEntry(portalValue)
	{
		var x;
		var y;
		
		var moveVal;
		
		var update_x = false;
		var update_y = false;
		
		// DEFAULT IS PORTAL EXCEPT FIRST LEVEL
		portalValue ? moveVal = 1 : moveVal = 2;
		
		switch(MAP_PLAYER.entry_d)
		{
			case "UP":
			{
				x = MAP_PLAYER.current_x;
				y = MAP_PLAYER.current_y - (MAP_PLAYER.moveUnit * 0.5);
				
				update_y = true;
					
				break;
			}
			
			case "DOWN":
			{
				x = MAP_PLAYER.current_x;
				y = MAP_PLAYER.current_y + MAP_PLAYER.moveUnit;
				
				update_y = true;
				
				break;
			}
			
			case "LEFT":
			{
				x = MAP_PLAYER.current_x - (MAP_PLAYER.moveUnit * 0.5);
				y = MAP_PLAYER.current_y;
				
				update_x = true;
								
				break;
			}
			
			case "RIGHT":
			{
				x = MAP_PLAYER.current_x + MAP_PLAYER.moveUnit;
				y = MAP_PLAYER.current_y;
				
				update_x = true;
				
				break;				
			}
		}
		
			
		MAP_PLAYER.allowControl = true;
			
		if(update_x)
		{ 
			x *= moveVal;
				
			$(".player-area .player-x").addClass(MAP_PLAYER.tweenClass); 
		}
			
		if(update_y)
		{
			y *= moveVal;
				
			$(".player-area .player-y").addClass(MAP_PLAYER.tweenClass);
		}
			
			
		MAP_PLAYER.x = x;
		MAP_PLAYER.y = y;
			
		$(".player-block .map-goat-legs").addClass(MAP_PLAYER.walkClass);
			
		revert_XY();	
			
		preHitTest();
	}
	
	function controlPort(ON)
	{
		if(ON)
		{
			$(window)[0].addEventListener("keydown", registerKey, false);
			
			$("#touchPad #touchPad-U")[0].addEventListener("touchstart", registerTouch, false);
			$("#touchPad #touchPad-D")[0].addEventListener("touchstart", registerTouch, false);
			$("#touchPad #touchPad-L")[0].addEventListener("touchstart", registerTouch, false);
			$("#touchPad #touchPad-R")[0].addEventListener("touchstart", registerTouch, false);
			
			
			$("#touchPad #touchPad-U")[0].addEventListener("touchend", registerTouch, false);
			$("#touchPad #touchPad-D")[0].addEventListener("touchend", registerTouch, false);
			$("#touchPad #touchPad-L")[0].addEventListener("touchend", registerTouch, false);
			$("#touchPad #touchPad-R")[0].addEventListener("touchend", registerTouch, false);		
		}
		
		else
		{
			$(window)[0].removeEventListener("keydown", registerKey, false);
			
			$("#touchPad #touchPad-U")[0].removeEventListener("touchstart", registerTouch, false);
			$("#touchPad #touchPad-D")[0].removeEventListener("touchstart", registerTouch, false);
			$("#touchPad #touchPad-L")[0].removeEventListener("touchstart", registerTouch, false);
			$("#touchPad #touchPad-R")[0].removeEventListener("touchstart", registerTouch, false);
			
			$("#touchPad #touchPad-U")[0].removeEventListener("touchend", registerTouch, false);
			$("#touchPad #touchPad-D")[0].removeEventListener("touchend", registerTouch, false);
			$("#touchPad #touchPad-L")[0].removeEventListener("touchend", registerTouch, false);
			$("#touchPad #touchPad-R")[0].removeEventListener("touchend", registerTouch, false);
			
/*
			if(TOUCH_UI)
			{
				TOUCH_UI.userTouchPad = false;
				TOUCH_UI.storeEvent = null;
			}
*/			
		}
	}
	
	function registerKey(event)
	{
		if(MAP_PLAYER.allowControl)
		{
			switch(event.keyCode)
			{
				// LEFT
				case 37:
				{
					MAP_PLAYER.block_x -= MAP_PLAYER.walkUnit;
					
					break;
				}
				
				// UP
				case 38:
				{
					MAP_PLAYER.block_y -= MAP_PLAYER.walkUnit;
					
					break;
				}
				
				// RIGHT
				case 39:
				{
					MAP_PLAYER.block_x += MAP_PLAYER.walkUnit;
					
					break;
				}
				
				// DOWN
				case 40:
				{
					MAP_PLAYER.block_y += MAP_PLAYER.walkUnit;
					
					break;
				}
			}
			
			controlConvert_XY(true);
		}
	}
	
	function registerTouch(event)
	{
		event.preventDefault();
		
		var fakeEvent = {};
		
		if(MAP_PLAYER.allowControl)
		{
			if(event.type === "touchstart")
			{
				TOUCH_UI.userTouchPad = true;
				
				fakeEvent.keyCode = sortTouchDirection(event.target.id);
				
				TOUCH_UI.storeEvent = fakeEvent;
				
				registerKey(fakeEvent);
			}
			
			else
			{
				TOUCH_UI.userTouchPad = false;
				// TOUCH_UI.storeEvent = null;
			}	
		}
		
		else
		{
			TOUCH_UI.userTouchPad = false;
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
	
	function controlConvert_XY(send)
	{
		var css_x;
		var css_y;
		var css_h;
		
		var portalExitDelay;
		
		MAP_PLAYER.x = MAP_PLAYER.block_x * MAP_PLAYER.moveUnit;
		MAP_PLAYER.y = MAP_PLAYER.block_y * MAP_PLAYER.moveUnit;
		
		// NORMAL CONTROL
		
		if(send)
		{
			preHitTest();
		}
		
		// PLACEMENT
		
		else
		{
			mapPlayerAxisEventCancel();
			
			MAP_PLAYER.current_x = MAP_PLAYER.x;
			MAP_PLAYER.current_y = MAP_PLAYER.y;
			
			// alert(MAP_PLAYER.x + " " + MAP_PLAYER.y);
			
			css_x	=	{
							"-webkit-transform"	: "translateX(" + MAP_PLAYER.x + "px)",
							"transform"			: "translateX(" + MAP_PLAYER.x + "px)"
						};
						
			css_y	=	{
							"-webkit-transform"	: "translateY(" + MAP_PLAYER.y + "px)",
							"transform"			: "translateY(" + MAP_PLAYER.y + "px)"				
						};
						
			css_h	=	{
							"-webkit-transform"	: "translate(" + MAP_PLAYER.x + "px, " + MAP_PLAYER.y + "px)",
							"transform"			: "translate(" + MAP_PLAYER.x + "px, " + MAP_PLAYER.y + "px)"
						};
			
			$(".player-area .player-x").css(css_x);
			$(".player-area .player-y").css(css_y);
			$(".preHitTest .preHitTestBlock").css(css_h);
			
		}
		
		if(playerInPortal)
		{
			if(portalTravelType === "STAGE")
			{
				moveStageTest();
			}
			
			if(portalTravelType === "LEVEL")
			{

			}
		}
	}
	
	function preHitTest()
	{
		var hit_register;
		
		var css_ht	=	{
							"-webkit-transform"	: "translate(" + MAP_PLAYER.x + "px, " + MAP_PLAYER.y + "px)",
							"transform"			: "translate(" + MAP_PLAYER.x + "px, " + MAP_PLAYER.y + "px)" 
						};
						
		$(".preHitTest .preHitTestBlock").css(css_ht);
		
		hitTest_init();
	}
	
	function hitTest_build()
	{
		HIT_TEST = {};
		HIT_TEST.hits = null;
		
		HIT_TEST.hit_enemy_target = "";
		HIT_TEST.hit_portal_target = "";
		
		HIT_TEST.hit_edge = false;
		HIT_TEST.hit_enemy = false;	
		HIT_TEST.hit_portal = false;	
	}
	
	function hitTest_init()
	{
		var hit_id = "";
		
		// SETUP - INIT
		
		HIT_TEST.hits = $(".preHitTest .collideCheck-player").collision(".collideCheck-field");
		
		if(HIT_TEST.hits[0] != undefined || HIT_TEST.hits[0] != null)
		{
			hit_id = $(HIT_TEST.hits[0]).attr("id");
			
			// PLAYER HITS ENEMY
						
			if($("#" + hit_id).attr("data-npc") === "enemy")
			{
				HIT_TEST.hit_enemy	= true;
				
				HIT_TEST.hit_enemy_target = hit_id;
				
				nonAlert("HIT ENEMY " + HIT_TEST.hit_enemy_target);
				
				controlsCancel(false);
				
				playerInBattle = true;
			
				enemySearch(HIT_TEST.hit_enemy_target);
				
				mapPlayerMoveX();
				mapPlayerMoveY();
			}
			
			// PLAYER HITS PORTAL
			else if($("#" + hit_id).attr("data-gameObject") === "portal")
			{
				HIT_TEST.hit_portal	= true;
				
				HIT_TEST.hit_portal_target = $(HIT_TEST.hits[0]).attr("id");
				
				controlsCancel(false);
				
				playerInPortal = true;
				
				portalEntry(HIT_TEST.hit_portal_target);
				
				$(".player-area").css("opacity", 0);
				controlTouchUI(false);
				
				mapPlayerMoveX();
				mapPlayerMoveY();
				
				
				nonAlert("HIT PORTAL " + HIT_TEST.hit_portal_target);				
			}
			
			// PLAYER HITS EDGE
			
			else
			{
				HIT_TEST.hit_edge = true;
				
				MAP_PLAYER.x = MAP_PLAYER.current_x;
				MAP_PLAYER.y = MAP_PLAYER.current_y;
				
				revert_XY();	
			
				nonAlert("HIT EDGE");
			}
		}

		
		else
		{
			HIT_TEST.hit_edge = false;
			HIT_TEST.hit_enemy = false;
			HIT_TEST.hit_portal	= false;
			
			mapPlayerMoveX();
			mapPlayerMoveY();
			
			nonAlert("HIT NOTHING");
		}
	}
	
	function revert_XY()
	{
		// CONVERSION BACK TO BLOCKS AFTER ENTRY
		
		MAP_PLAYER.block_x = MAP_PLAYER.x / MAP_PLAYER.moveUnit;
		MAP_PLAYER.block_y = MAP_PLAYER.y / MAP_PLAYER.moveUnit;		
	}
	
	function battleMode_init()
	{
		html_snapShot_preBattle = $("#gameDisp").html();
		
		globalFade_IN("white", battleMode_fromMap);
	}
	
	// X MOVE
	
	function mapPlayerMoveX()
	{
		if(MAP_PLAYER.x !== MAP_PLAYER.current_x)
		{
			if(MAP_PLAYER.allowControl)
			{
				MAP_PLAYER.allowControl = false;
				
				$(".player-area .player-x").addClass(MAP_PLAYER.tweenClass);
				$(".player-block .map-goat-legs").addClass(MAP_PLAYER.walkClass);
				
				mapPlayerAxisX();
			}
			
			// POSSIBLE STALL
			
			else
			{
				mapPlayerAxisEventCancel();
			}
		}
	}
	
	function mapPlayerAxisX()
	{
		var css_x = {
						"-webkit-transform"	: "translateX(" + MAP_PLAYER.x + "px)",
						"transform"			: "translateX(" + MAP_PLAYER.x + "px)"
					};

		$("." + MAP_PLAYER.tweenClass)[0].addEventListener("webkitTransitionEnd", mapPlayerAxisX_End, false);
		$("." + MAP_PLAYER.tweenClass)[0].addEventListener("transitionend", mapPlayerAxisX_End, false);
		
		$(".player-area .player-x").css(css_x);
		
		if(playerExitPortal)
		{
			$(".player-area").css("opacity", 1);
			controlTouchUI(true);
		}
	}
	
	function mapPlayerAxisX_End(event)
	{
		$("." + MAP_PLAYER.tweenClass)[0].removeEventListener("webkitTransitionEnd", mapPlayerAxisX_End, false);
		$("." + MAP_PLAYER.tweenClass)[0].removeEventListener("transitionend", mapPlayerAxisX_End, false);
		
		$(".player-area .player-x").removeClass(MAP_PLAYER.tweenClass);
		$(".player-block .map-goat-legs").removeClass(MAP_PLAYER.walkClass);
		
		MAP_PLAYER.current_x = MAP_PLAYER.x;
		
		questEntryCheck();
		
		if(playerInPortal)
		{
			portalTravelSort();
		}
		
		else
		{
			MAP_PLAYER.allowControl = true;
			
			// TOUCH - KEYDOWN HACK
			if(TOUCH_UI.userTouchPad)
			{
				registerKey(TOUCH_UI.storeEvent);
			}				
		}
		
		if(playerExitPortal)
		{
			playerExitPortal = false;
			
			MAP_PLAYER.allowControl = true;
			
			// control plug
			
			controlPort(true);
			
/*
			// TOUCH - KEYDOWN HACK
			if(TOUCH_UI.userTouchPad)
			{
				registerKey(TOUCH_UI.storeEvent);
			}
*/
		}
		
		if(playerInBattle)
		{
			battleMode_init();
		}
		
/*
		// TOUCH - KEYDOWN HACK
		if(TOUCH_UI.userTouchPad)
		{
			registerKey(TOUCH_UI.storeEvent);
		}
*/				
	}
	
	
	// Y MOVE
	
	function mapPlayerMoveY()
	{
		if(MAP_PLAYER.y !== MAP_PLAYER.current_y)
		{
			if(MAP_PLAYER.allowControl)
			{
				MAP_PLAYER.allowControl = false;
				
				$(".player-area .player-y").addClass(MAP_PLAYER.tweenClass);
				$(".player-block .map-goat-legs").addClass(MAP_PLAYER.walkClass);
				
				mapPlayerAxisY();
			}
			
			// POSSIBLE STALL
			
			else
			{
				mapPlayerAxisEventCancel();
			}
		}
	}
	
	function mapPlayerAxisY()
	{
		var css_y = {
						"-webkit-transform"	: "translateY(" + MAP_PLAYER.y + "px)",
						"transform"			: "translateY(" + MAP_PLAYER.y + "px)"
					};
					
		$("." + MAP_PLAYER.tweenClass)[0].addEventListener("webkitTransitionEnd", mapPlayerAxisY_End, false);
		$("." + MAP_PLAYER.tweenClass)[0].addEventListener("transitionend", mapPlayerAxisY_End, false);
		
		$(".player-area .player-y").css(css_y);
		
		if(playerExitPortal)
		{
			$(".player-area").css("opacity", 1);
			controlTouchUI(true);
		}
		
	}
	
	function mapPlayerAxisY_End(event)
	{
		$("." + MAP_PLAYER.tweenClass)[0].removeEventListener("webkitTransitionEnd", mapPlayerAxisY_End, false);
		$("." + MAP_PLAYER.tweenClass)[0].removeEventListener("transitionend", mapPlayerAxisY_End, false);
		
		$(".player-area .player-x").removeClass(MAP_PLAYER.tweenClass);
		$(".player-block .map-goat-legs").removeClass(MAP_PLAYER.walkClass);
		
		MAP_PLAYER.current_y = MAP_PLAYER.y;
		
		questEntryCheck();
		
		if(portalTravelType === "LEVEL")
		{
			
		}
		
		else
		{
			moveStageTest();
		}
		
		if(playerInPortal)
		{
			portalTravelSort();
		}
		
		else
		{
			MAP_PLAYER.allowControl = true;
			
			// TOUCH - KEYDOWN HACK
			if(TOUCH_UI.userTouchPad)
			{
				registerKey(TOUCH_UI.storeEvent);
			}	
		}
		
		if(playerExitPortal)
		{
			playerExitPortal = false;
			
			MAP_PLAYER.allowControl = true;
			
			// control plug
			
			controlPort(true);
			
/*
			// TOUCH - KEYDOWN HACK
			if(TOUCH_UI.userTouchPad)
			{
				registerKey(TOUCH_UI.storeEvent);
			}
*/
		}
		
		if(playerInBattle)
		{
			battleMode_init();
		}
		
/*
		// TOUCH - KEYDOWN HACK
		if(TOUCH_UI.userTouchPad)
		{
			registerKey(TOUCH_UI.storeEvent);
		}	
*/		
	}
	
	function mapPlayerAxisEventCancel()
	{
		MAP_PLAYER.allowControl = false;


		$(".player-area .player-x")[0].removeEventListener("webkitTransitionEnd", mapPlayerAxisX_End, false);
		$(".player-area .player-x")[0].removeEventListener("transitionend", mapPlayerAxisX_End, false);	
		
		$(".player-area .player-y")[0].removeEventListener("webkitTransitionEnd", mapPlayerAxisY_End, false);
		$(".player-area .player-y")[0].removeEventListener("transitionend", mapPlayerAxisY_End, false);
		
		$(".player-area .player-x").removeClass(MAP_PLAYER.tweenClass);
		$(".player-area .player-y").removeClass(MAP_PLAYER.tweenClass);
		
		// TOUCH_UI.userTouchPad = false;
		// TOUCH_UI.storeEvent = null;	
	}
	
	
	function questEntryCheck()
	{
		if(listenForQuestEntry)
		{
			listenForQuestEntry = false;
			
			controlsInit();
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

			}

			if(battleEndStatus === "LOSE")
			{
				MAP_PLAYER.allowControl = true;
				
				$(".player-area .player-x").addClass(MAP_PLAYER.tweenClass); 
				
				$(".player-area .player-y").addClass(MAP_PLAYER.tweenClass);
				
				reset_battleEndStatus();
			}	

			// TRY
			
			if(portalTravelType === "LEVEL")
			{
				playerInPortal = false;
				portalTravelType = "";
				
				// PORTAL EXIT CHECK
				playerExitPortal = true;
				
				exitFrame = setTimeout(mapPlayerEntry, 1000, true);
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

		}
		
		if(playerInPortal)
		{
			if(portalTravelType === "STAGE")
			{
				playerInPortal = false;
				portalTravelType = "";
				
				// PORTAL EXIT CHECK
				playerExitPortal = true;
				
				exitFrame = setTimeout(mapPlayerEntry, 1000, true);
			}
			
			// TRY
			
			if(portalTravelType === "LEVEL")
			{
				playerInPortal = false;
				portalTravelType = "";
				
				// PORTAL EXIT CHECK
				playerExitPortal = true;
				
				exitFrame = setTimeout(mapPlayerEntry, 1000, true);
			}
		}
		
		if(battleEndStatus === "LOSE")
		{
			MAP_PLAYER.allowControl = true;
			
			$(".player-area .player-x").addClass(MAP_PLAYER.tweenClass); 
			
			$(".player-area .player-y").addClass(MAP_PLAYER.tweenClass);
			
			reset_battleEndStatus();
		}	
	}
	
	function portalEntry(hitPortal)
	{
		for(var i in portals)
		{
			if(portals[i].id === hitPortal)
			{
				if(portals[i].j_type === "LEVEL")
				{
					portalTravelType = "LEVEL";
					
					GAME.portalEnterThrough = portals[i].j_to_num;
					GAME.mapLevel = portals[i].j_to;
				}
				
				if(portals[i].j_type === "STAGE")
				{
					portalTravelType = "STAGE";
					
					portalExit(portals[i]);
				}	
			}
		}
	}

	
	function portalExit(portalObj)
	{
		// NEXT PORTAL FIND
			
		for(var i in portals)
		{
			if(portalObj.travel === portals[i].name)
			{
				MAP_PLAYER.portalObj = portals[i];	
			}
		}		
	}
	
	function portalTravelSort()
	{
		if(portalTravelType === "LEVEL")
		{
			globalFade_IN("white", refreshRebuildLevel);
			
			// level change	
		}
		
		if(portalTravelType === "STAGE")
		{
			trace("portalTravelSort(); " + "STAGE");
			mapPlayerPlace();
		}
		
		initTouchUI();
	}
	
	function portalPlayerFadeOut()
	{
		$(".player-area")[0].addEventListener("webkitTransitionEnd", portalPlayerFadeOutEnd, false);
		$(".player-area")[0].addEventListener("transitionend", portalPlayerFadeOutEnd, false);
		
		$(".player-area").css("opacity", 0);
		
		controlTouchUI(false); 
	}
	
	function portalPlayerFadeOutEnd(event)
	{
		$(".player-area")[0].removeEventListener("webkitTransitionEnd", portalPlayerFadeOutEnd, false);
		$(".player-area")[0].removeEventListener("transitionend", portalPlayerFadeOutEnd, false);		
	}	
	