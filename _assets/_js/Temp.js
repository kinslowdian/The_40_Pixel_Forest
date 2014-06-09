	trace("Temp.js being used -- remove from final build / release");
	
	function mapPlayer_storeEntry(x, y)
	{
		MAP_PLAYER.storeEntryPos = {};
		MAP_PLAYER.storeEntryPos.x = x;
		MAP_PLAYER.storeEntryPos.y = y;
	}
	
	function battleOver_delay(event)
	{
		var delay_return;
		
		if(BATTLE_NAV.game.result === "WIN")
		{
			
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
		{
			$("#microBattle_resultWipe_wrapper .microBattle_endSky_sunMoon_sprite_lose")[0].removeEventListener("webkitTransitionEnd", battleOver_delay, false);
			$("#microBattle_resultWipe_wrapper .microBattle_endSky_sunMoon_sprite_lose")[0].removeEventListener("transitionend", battleOver_delay, false);			
		}
		
		delay_return = setTimeout(battleOver_delayEnd, 2 * 1000);
	}
	
	function battleOver_delayEnd()
	{
		if(BATTLE_NAV.game.result === "WIN")
		{
			battleOver_win();
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
		{
			battleOver_lose();
		}
	}
	
	function battleOver_win()
	{
		
	}
	
	function battleOver_lose()
	{
		var css;
		
		$("#display_wrapper #display_inner_world").html(theBattle.html.display_inner_world);
			
		if(CONTROL_SIGNAL.enableTouch)
		{
			// TOUCH UI DISPLAY FIX
			$("#touchPad").html("");
			$("#touchPad").html(CONTROL_SIGNAL.html.touchNav);
				
			// ENABLE TOUCH UI TO APPEAR AFTER TRANSITION OUT
			CONTROL_SIGNAL.firstTouch = true;
		}
		
		css = 	{
					"-webkit-transform"	: "translate(" + MAP_PLAYER.storeEntryPos.x + "px, " + MAP_PLAYER.storeEntryPos.y + "px)",
					"transform"			: "translate(" + MAP_PLAYER.storeEntryPos.x + "px, " + MAP_PLAYER.storeEntryPos.y + "px)"
				};
		
		$("#" + MAP_PLAYER.playerMover).css(css);
		
			
		// RETURN ORIGINAL CONTROL POSITIONS
		MAP_PLAYER.pos_x = MAP_PLAYER.cur_x = MAP_PLAYER.storeEntryPos.x;
		MAP_PLAYER.pos_y = MAP_PLAYER.cur_y = MAP_PLAYER.storeEntryPos.y;
		
		$("#display_inner_info #battleScreen").addClass("tween-battleScreen");
		
		battleOver_returnToMapInit();		
	}
	
	function battleOver_returnToMapInit()
	{
		var css;
		
		css = 	{
					"-webkit-transform" : "translateX(-100%)",
					"transform" 		: "translateX(-100%)"
				};
		
		$("#display_inner_info #battleScreen").css(css);
		
		$(".tween-battleScreen")[0].addEventListener("webkitTransitionEnd", battleOver_returnToMapEnd, false);
		$(".tween-battleScreen")[0].addEventListener("transitionend", battleOver_returnToMapEnd, false);
	}
	
	function battleOver_returnToMapEnd(event)
	{
		$(".tween-battleScreen")[0].removeEventListener("webkitTransitionEnd", battleOver_returnToMapEnd, false);
		$(".tween-battleScreen")[0].removeEventListener("transitionend", battleOver_returnToMapEnd, false);
		
		$("#display_inner_info #battleScreen").html("");
		$("#display_inner_info #battleScreen").removeAttr("style");
		
		moveStageTest();		
	}