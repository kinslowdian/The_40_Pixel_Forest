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
			zombie_cloudInit();
			
			$("#microBattle_resultWipe_wrapper .microBattle_endSky_sunMoon_sprite_lose")[0].removeEventListener("webkitTransitionEnd", battleOver_delay, false);
			$("#microBattle_resultWipe_wrapper .microBattle_endSky_sunMoon_sprite_lose")[0].removeEventListener("transitionend", battleOver_delay, false);			
		}
		
		// delay_return = setTimeout(battleOver_delayEnd, 2 * 1000);
	}
	
	function zombie_cloudInit()
	{
		$("#microBattle_player_wrapper .actionCloud").html(actionCloud_html);
		
		zombie_cloud_0();		
	}
	
	function zombie_cloud_0()
	{
		var delay_sequence;
		
		$("#microBattle_player_wrapper .player-sprite .actionCloudMain-1").css("visibility", "visible");
		
		$("#microBattle_player_wrapper .player-sprite .actionCloudMain-1 .actionCloudSprite-outer").addClass("tween-actionCloudSpriteOuterAlt");
		
		$("#microBattle_player_wrapper .player-sprite .actionCloudMain-1 .actionCloudSprite-inner").addClass("tween-actionCloudSpriteInner");
		
		delay_sequence = setTimeout(zombie_cloud_1, 0.2 * 1000);
	}
	
	function zombie_cloud_1()
	{
		var delay_sequence;
		
		zombie_mode();
		
		$("#microBattle_player_wrapper .player-sprite .actionCloudMain-0").css("visibility", "visible");
		
		$("#microBattle_player_wrapper .player-sprite .actionCloudMain-0 .actionCloudSprite-outer").addClass("tween-actionCloudSpriteOuter");
		
		$("#microBattle_player_wrapper .player-sprite .actionCloudMain-0 .actionCloudSprite-inner").addClass("tween-actionCloudSpriteInner");			
		
		// Temp.js
		delay_sequence = setTimeout(zombie_cloud_2, 1 * 1000);
		// Temp.js
	}
	
	function zombie_mode()
	{
		var livingForm = "pixels_map_player";
		
		var undeadForm = "pixels_playerZombie";
		
		$("#microBattle_player_wrapper #player1 div").each(function(i, div)
		{
			if($(div).attr("class"))
			{
				var search_pixels = $(div).attr("class");
				
				if(search_pixels.search(livingForm) >= 0)
				{
					$(div).removeClass(livingForm).addClass(undeadForm);
				}	
			}
		});
	}
	
	function zombie_cloud_2()
	{
		$("#microBattle_player_wrapper .actionCloud").css("opacity", "0");
		
		$("#microBattle_player_wrapper .tween-actionCloud")[0].addEventListener("webkitTransitionEnd", zombie_cloudEnd, false);
		$("#microBattle_player_wrapper .tween-actionCloud")[0].addEventListener("transitionend", zombie_cloudEnd, false);
	}
	
	function zombie_cloudEnd(event)
	{
		var delay_sequence;
		
		$("#microBattle_player_wrapper .tween-actionCloud")[0].removeEventListener("webkitTransitionEnd", zombie_cloudEnd, false);
		$("#microBattle_player_wrapper .tween-actionCloud")[0].removeEventListener("transitionend", zombie_cloudEnd, false);		
	
		$("#microBattle_player_wrapper .actionCloud").remove();
		
		delay_sequence = setTimeout(zombie_face, 1 * 1000);
	}
	
	function zombie_face()
	{
		$("#player1 .map-goat-head").removeClass("mapPlayer_head_dead").addClass("mapPlayer_head_default");
		
		zombie_objectCreate();
	}
	
	function zombie_objectCreate()
	{
		var delay_sequence;
		
		var new_zombie = new Object();
		
		var count_zombie = 0;
		
		for(var enemyObj in enemies_ARR)
		{
			if(enemies_ARR[enemyObj].spawn === ROM.mapLevel)
			{
				if(enemies_ARR[enemyObj].enemyType === "zombie")
				{
					count_zombie++;					
				}
				
				else
				{
					count_zombie = 0;
				}	
			}
		}
		
		
		new_zombie = 	{
							x		: theBattle.playerStore.x_return / 80,
							y		: theBattle.playerStore.y_return / 80,
							w		: 0.5,
							h		: 0.5,
							n		: "level" + ROM.mapLevel + "_zombie" + count_zombie,
							t		: "zombie",
							l		: 0, // DEFAULT EASY?
							known	: "an undead you",
							spawn	: ROM.mapLevel,
							head	: "GOAT"
							
						};
						
		html_lib_reuse();
		
		var nz = new enemy(new_zombie, ".enemy-area");
		
		nz.create();
		
		enemies_ARR.push(nz);
		
		html_lib_empty();
		
		delay_sequence = setTimeout(battleOver_delayEnd, 2 * 1000);
	}
	
	function battleOver_delayEnd()
	{
		$("#display_wrapper #display_inner_world").html(theBattle.html.display_inner_world);
		
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
				
	
		battleOver_add_additionals();
	}
	
	function battleOver_add_additionals()
	{
		for(var object_enemy in enemies_ARR)
		{
			if(ROM.mapLevel == enemies_ARR[object_enemy].spawn)
			{
				if(enemies_ARR[object_enemy].alive)
				{
					if(!enemies_ARR[object_enemy].rendered)
					{
						enemies_ARR[object_enemy].build();
					}
				}
			}				
		}
		
		battleOver_returnToMapInit();		
	}
	
	function battleOver_returnToMapInit()
	{
		var css;
		
		css = 	{
					"-webkit-transform" : "translateX(-100%)",
					"transform" 		: "translateX(-100%)"
				};
				
		// ENEMY POSITION CHECK USING DATA ATTRIBUTE ("data-npc")
		$('#display_wrapper #display_inner_world #roam_wrapper .enemy-area [data-npc *= "enemy"]').each(function(i, div)
		{
			// NO CSS ADDED (translate(x, y))
			if(!$(div).attr("style"))
			{
				var faulty = $(div).attr("id");
				
				for(var object_enemy in enemies_ARR)
				{
					// FIND OBJECT TO MATCH FAULTY ID
					if(enemies_ARR[object_enemy].id === faulty)
					{
						// FORCE CSS POSITIONING
						$(div).css(enemy_forcePosition(enemies_ARR[object_enemy]));
					}
				} 	
			}
			
		});
		
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
	