	
	var savedGameMapState;
	
	function enemySearch(hitEnemy)
	{
		trace("enemySearch();" + hitEnemy + " (sent from hit test)");
		trace(enemies);
		
		for(var i in enemies)
		{
			if(enemies[i].buildData.id === hitEnemy)
			{
				// GAME.enemy = enemies[i];
				
				ROM.enemy = enemies[i];
				
				trace("enemySearch(); == " + hitEnemy);
				trace(ROM.enemy);
			}
		}		
	}
	
	function battleMode_fromMap()
	{
		// clear weather
		
		mapWeatherClear();
		
		// clear portals
		
		portalClear(false);
		
		// portalStarsHold();
		
		// $(window).off("resize", screenUpdate);
		
		screenUpdateCancel();
		
		savedGameMapState = $("#gameDisp").html();
		
		$("#gameDisp").html("");
		
		battleMode_prepInit();		
	}
	
	function battleMode_prepInit()
	{
		$(document).get(0).addEventListener("EVENT_HTML_LOADED", battleMode_prepDone, false);
		
		var lf = Logic.dat_ROM["_HTML-EXT"]["file_battle_arena"]["file"];
		var lh = new load_HTML(lf, $("#memory"));		
	}
	
	function battleMode_prepDone(event)
	{
		$(document).get(0).removeEventListener("EVENT_HTML_LOADED", battleMode_prepDone, false);
		
		$("#gameDisp").append($("#memory").html());
		$("#memory").html("");
		
		battleMode_addCharacters();
	}
	
	function battleMode_addCharacters()
	{
		var entrance_delay;
		
		entrance_delay = new AnimationTimer();
		timerList_add(entrance_delay);
		entrance_delay.time(0.5, globalFade_OUT, battleMode_show);
		
		//globalFade_OUT(battleMode_show);
	}
	
	function battleMode_show()
	{
		var battleStart_delay;
		
		battleStart_delay = new AnimationTimer();
		timerList_add(battleStart_delay);
		battleStart_delay.time(2, battleMode_switch);
	}
	
	function battleMode_switch()
	{
		$("#battleArena-player1 .goat .goat-body").removeClass("goat-body-front").addClass("goat-body-back");
		$("#battleArena-player1 .goat .goat-face").css("visibility", "hidden");
		$("#battleArena-player1 .goat .goat-hands").css("visibility", "hidden");
	
		// call battle nav
		
		var cloudDisplayDelay = new AnimationTimer();
		timerList_add(cloudDisplayDelay);
		// cloudDisplayDelay.time(2, cloudDisplay);
		
		cloudDisplayDelay.time(2, function(){cloudDisplay(); addChoiceButtons();});
	}
	
	function endBattleSceneAnimation()
	{
		if(battleEndStatus === "WIN")
		{
			
		}
		
		if(battleEndStatus === "LOSE")
		{
			
		}
		
		// MOVE TO END OF END ANIMATION
		
		fadeOutBattleScene();
	}
	
	function fadeOutBattleScene()
	{
		globalFade_IN("white", returnToBattleField);	
	}
	
	function returnToBattleField()
	{
		var killList;
		
		$("#gameDisp").html("");
		$("#gameDisp").html(savedGameMapState);
		
		savedGameMapState = "";
		
		// killList = battleEngine.enemyDeadCheck(enemyArray, GAME_LEVEL);
		
		for(var i in enemies)
		{
			if(!enemies[i].alive)
			{
				$("#" + enemies[i].buildData.id).remove();
			}
		}
		
		// check draw
		
		if(battleEndStatus === "WIN")
		{
			globalFade_OUT(returnToBattleContinue);
			
			reset_battleEndStatus();
		}
		
		else
		{
			playerFallPosition();
		}
		
		rebuildStarsInit();
	}
	
	function playerFallPosition()
	{
		var fall_css_x;
		var fall_css_y;
		var fall_css_h;
		
		var fx;
		var fy;
		
		mapPlayerAxisEventCancel();
		
		fx = LEVEL_MAIN.buildData.fall_x * MAP_PLAYER.moveUnit;
		fy = LEVEL_MAIN.buildData.fall_y * MAP_PLAYER.moveUnit;
		
		
		fall_css_x	=	{
							"-webkit-transform" : "translateX(" + fx + "px)",
							"transform"			: "translateX(" + fx + "px)"
						};
						
		fall_css_y	=	{
							"-webkit-transform" : "translateY(" + fy + "px)",
							"transform"			: "translateY(" + fy + "px)"
						};
						
		fall_css_h	=	{
							"-webkit-transform"	: "translate(" + fx + "px, " + fy + "px)",
							"transform"			: "translate(" + fx + "px, " + fy + "px)" 
						};
		
		
		MAP_PLAYER.x = MAP_PLAYER.current_x = fx;
		MAP_PLAYER.y = MAP_PLAYER.current_y = fy;

		
		$(".player-area .player-x").css(fall_css_x);
		$(".player-area .player-y").css(fall_css_y);
		$(".preHitTest .preHitTestBlock").css(fall_css_h);
		// $(".preHitTest .preHitTestBlock").css(css_h);
			
		// alert(px + " " + py);
			
		// controlConvert_XY(false);
			
		revert_XY();
		
		// MOBILE-FIX
		screenUpdateInit();
		
		globalFade_OUT(returnToBattleContinue);
	}
	
	function returnToBattleContinue()
	{
		moveStageTest();
		
		playerInBattle = false;
		
		controlPort(true);
	}
		
		
