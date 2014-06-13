	trace("Temp.js being used -- remove from final build / release");
	
	function mapPlayer_storeEntry(x, y)
	{
		MAP_PLAYER.storeEntryPos = {};
		MAP_PLAYER.storeEntryPos.x = x;
		MAP_PLAYER.storeEntryPos.y = y;
	}
	
	function battleOver_skySet(event)
	{
		trace("battleOver_skySet(); ----------");
		
		trace(event);
		
		trace("battleOver_skySet(); ----------");
		
		$(".tween-microBattle_endSky")[0].removeEventListener("webkitTransitionEnd", battleOver_skySet, false);
		$(".tween-microBattle_endSky")[0].removeEventListener("transitionend", battleOver_skySet, false);
		
		$("#display_wrapper #display_inner_world").html(theBattle.html.display_inner_world);
		$("#display_inner_info #battleScreen").addClass("tween-battleScreen");
		
		if(BATTLE_NAV.game.result === "WIN")
		{
			enemies_ARR[ROM.enemy.character.array_index].alive = false;
			
			battleOver_returnWin();
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
		{
			battleOver_returnLose();
		}
	}
	
	function battleOver_returnWin()
	{
		// var delay_returnWorld_win;
		
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).html("");
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).html(theBattle.grave.html);
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).removeAttr("data-npc");
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).removeClass("collideCheck-field");
		
		$("#" + theBattle.grave.ref).removeAttr("id");
		
		// battleOver_setControlsBasic();
		
		// delay_returnWorld_win = setTimeout(battleOver_returnWorld, 2 * 1000);
		
		battleOver_prepareForReturn();
	}
	
	function battleOver_returnLose()
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
		
		battleOver_zombie();		
	}
	
	function battleOver_zombie()
	{
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
		
		var nz = new enemy(new_zombie, ".enemy-area", enemies_ARR.length);
		
		nz.create();
		
		enemies_ARR.push(nz);
		
		html_lib_empty();
		
		// CREATE LATEST ON MAP
		if(enemies_ARR[(enemies_ARR.length - 1)].spawn == ROM.mapLevel)
		{
			if(enemies_ARR[(enemies_ARR.length - 1)].alive)
			{
				if(!enemies_ARR[(enemies_ARR.length - 1)].rendered)
				{
					enemies_ARR[(enemies_ARR.length - 1)].build();	
				}
				
			}
		}
		
		battleOver_prepareForReturn();
		
		
		
/*
		if(BATTLE_NAV.game.result === "LOSE")
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
		}
*/
		
		
	}
	
	function battleOver_prepareForReturn()
	{
		var delay_returnWorld;
		
		battleOver_setControlsBasic();
		
		delay_returnWorld = setTimeout(battleOver_returnWorld, 2 * 1000);
	}
	
	function battleOver_setControlsBasic()
	{
		var edit_x;
		var edit_y;
		
		var player_css;
		
		if(CONTROL_SIGNAL.enableTouch)
		{
			// TOUCH UI DISPLAY FIX
			$("#touchPad").html("");
			$("#touchPad").html(CONTROL_SIGNAL.html.touchNav);
				
			// ENABLE TOUCH UI TO APPEAR AFTER TRANSITION OUT
			CONTROL_SIGNAL.firstTouch = true;
		}
		
		if(BATTLE_NAV.game.result === "WIN")
		{
			edit_x = theBattle.playerStore.x_return;
			edit_y = theBattle.playerStore.y_return;
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
		{
			edit_x = MAP_PLAYER.storeEntryPos.x;
			edit_y = MAP_PLAYER.storeEntryPos.y;
		}
		
		
		
		player_css = 	{
							"-webkit-transform"	: "translate(" + edit_x + "px, " + edit_y + "px)",
							"transform"			: "translate(" + edit_x + "px, " + edit_y + "px)"
						};
		
		$("#" + MAP_PLAYER.playerMover).css(player_css);
		
			
		// RETURN ORIGINAL CONTROL POSITIONS
		MAP_PLAYER.pos_x = MAP_PLAYER.cur_x = edit_x;
		MAP_PLAYER.pos_y = MAP_PLAYER.cur_y = edit_y;	
	}
	
	function battleOver_returnWorld()
	{
		var css;
		
		css = 	{
					"-webkit-transform" : "translateX(-100%)",
					"transform" 		: "translateX(-100%)"
				};		
	
		$(".tween-battleScreen")[0].addEventListener("webkitTransitionEnd", battleOver_returnWorldEnd, false);
		$(".tween-battleScreen")[0].addEventListener("transitionend", battleOver_returnWorldEnd, false);
	
		$("#display_inner_info #battleScreen").css(css);
	}
	
	function battleOver_returnWorldEnd(event)
	{
		trace("battleOver_returnWorldEnd(); ----------");
		
		trace(event);
		
		trace("battleOver_returnWorldEnd(); ----------");
				
		$(".tween-battleScreen")[0].removeEventListener("webkitTransitionEnd", battleOver_returnWorldEnd, false);
		$(".tween-battleScreen")[0].removeEventListener("transitionend", battleOver_returnWorldEnd, false);
		
		battleOver_cleanUp();
	}
	
	function battleOver_cleanUp()
	{
		$("#display_inner_info #battleScreen").html("");
		$("#display_inner_info #battleScreen").removeAttr("style");
		
		moveStageTest();		
	}
	
	function digGrave(dead_obj)
	{
		var grave = {};
		
		grave.w = dead_obj.buildData.w;
		grave.h = dead_obj.buildData.h;
		grave.ref = "_enemy_grave" + grave.w + "x" + grave.h;
		grave.html = html_lib_use(grave.ref, false, true);
		
		$(dead_obj.buildData.container).append(grave.html);
		$(dead_obj.buildData.container + " #" + grave.ref).attr("id", dead_obj.id);
		
		$("#" + dead_obj.id).css(dead_obj.buildData.css);
		
		enemies_ARR[dead_obj.array_index].rendered = true;
				
		delete grave;
/*
		var grave_w = dead_obj.buildData.w;
		var grave_h = dead_obj.buildData.h;
		
		var grave_asset = "_enemy_grave" + grave_w + "x" + grave_h;
		
		var grave_html = html_lib_use(grave_asset, false, true);
		
		$(dead_obj.buildData.container).append(grave_html);
		$(dead_obj.buildData.container + " #" + grave_asset).attr("id", dead_obj.id);
		
		$("#" + dead_obj.id).css(dead_obj.buildData.css);
		
		dead_obj.rendered = true;
*/
	}
	
	
	
	
	
	
	
/*
	function battleOver_delay(event)
	{
		trace(event);
		trace("battleOver_delay();");
		
		var delay_return;
		
		
		// EVENT ISSUE
		// $(".tween-microBattle_endSky")[0].removeEventListener("webkitTransitionEnd", battleOver_delay, false);
		// $(".tween-microBattle_endSky")[0].removeEventListener("transitionend", battleOver_delay, false);
		// $(event.target)[0].removeEventListener("webkitTransitionEnd", battleOver_delay, false);
		// $(event.target)[0].removeEventListener("transitionend", battleOver_delay, false);
		// EVENT ISSUE
		
		// $("#microBattle_resultWipe_wrapper")[0].removeEventListener("transitionend", battleOver_delay, false);
		
		if(BATTLE_NAV.game.result === "WIN")
		{
			enemies_ARR[ROM.enemy.character.array_index].alive = false
			
			// $("#microBattle_resultWipe_wrapper .microBattle_endSky_sunMoon_sprite_win")[0].removeEventListener("webkitTransitionEnd", battleOver_delay, false);
			// $("#microBattle_resultWipe_wrapper .microBattle_endSky_sunMoon_sprite_win")[0].removeEventListener("transitionend", battleOver_delay, false);
			
			battleOver_delayEnd();				
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
		{
			zombie_cloudInit();
			
			// $("#microBattle_resultWipe_wrapper .microBattle_endSky_sunMoon_sprite_lose")[0].removeEventListener("webkitTransitionEnd", battleOver_delay, false);
			// $("#microBattle_resultWipe_wrapper .microBattle_endSky_sunMoon_sprite_lose")[0].removeEventListener("transitionend", battleOver_delay, false);			
		}
		
		// delay_return = setTimeout(battleOver_delayEnd, 2 * 1000);
	}
*/
	
/*
	function zombie_cloudInit()
	{
		$("#microBattle_player_wrapper .actionCloud").html(actionCloud_html);
		
		zombie_cloud_0();		
	}
*/
	
/*
	function zombie_cloud_0()
	{
		var delay_sequence;
		
		$("#microBattle_player_wrapper .player-sprite .actionCloudMain-1").css("visibility", "visible");
		
		$("#microBattle_player_wrapper .player-sprite .actionCloudMain-1 .actionCloudSprite-outer").addClass("tween-actionCloudSpriteOuterAlt");
		
		$("#microBattle_player_wrapper .player-sprite .actionCloudMain-1 .actionCloudSprite-inner").addClass("tween-actionCloudSpriteInner");
		
		delay_sequence = setTimeout(zombie_cloud_1, 0.2 * 1000);
	}
*/
	
/*
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
*/
	
/*
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
*/
	
/*
	function zombie_cloud_2()
	{
		$("#microBattle_player_wrapper .actionCloud").css("opacity", "0");
		
		$("#microBattle_player_wrapper .tween-actionCloud")[0].addEventListener("webkitTransitionEnd", zombie_cloudEnd, false);
		$("#microBattle_player_wrapper .tween-actionCloud")[0].addEventListener("transitionend", zombie_cloudEnd, false);
	}
*/
	
/*
	function zombie_cloudEnd(event)
	{
		var delay_sequence;
		
		$("#microBattle_player_wrapper .tween-actionCloud")[0].removeEventListener("webkitTransitionEnd", zombie_cloudEnd, false);
		$("#microBattle_player_wrapper .tween-actionCloud")[0].removeEventListener("transitionend", zombie_cloudEnd, false);		
	
		$("#microBattle_player_wrapper .actionCloud").remove();
		
		delay_sequence = setTimeout(zombie_face, 1 * 1000);
	}
*/
	
/*
	function zombie_face()
	{
		$("#player1 .map-goat-head").removeClass("mapPlayer_head_dead").addClass("mapPlayer_head_default");
		
		zombie_objectCreate();
	}
*/
	
/*
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
		
		var nz = new enemy(new_zombie, ".enemy-area", enemies_ARR.length);
		
		nz.create();
		
		enemies_ARR.push(nz);
		
		html_lib_empty();
		
		delay_sequence = setTimeout(battleOver_delayEnd, 2 * 1000);
		
		trace(enemies_ARR);
	}
*/
	
/*
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
*/
	
/*
	function battleOver_win()
	{
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).html("");
		
		$("#display_inner_info #battleScreen").addClass("tween-battleScreen");
		
		battleOver_add_additionals();
	}
*/
	
/*
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
*/
	
/*
	function battleOver_add_additionals()
	{
		if(BATTLE_NAV.game.result === "WIN")
		{
			$("#" + enemies_ARR[ROM.enemy.character.array_index].id).html(theBattle.html.grave);
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
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
		}
		
		battleOver_returnToMapInit();		
	}
*/
	
/*
	function battleOver_returnToMapInit()
	{
		trace("battleOver_returnToMapInit();");
		
		var css;
		
		css = 	{
					"-webkit-transform" : "translateX(-100%)",
					"transform" 		: "translateX(-100%)"
				};
				
		if(BATTLE_NAV.game.result === "LOSE")
		{
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
		}
		
		$("#display_inner_info #battleScreen").css(css);
		
		$(".tween-battleScreen")[0].addEventListener("webkitTransitionEnd", battleOver_returnToMapEnd, false);
		$(".tween-battleScreen")[0].addEventListener("transitionend", battleOver_returnToMapEnd, false);
	}
*/
	
/*
	function battleOver_returnToMapEnd(event)
	{
		trace("battleOver_returnToMapEnd();");
		trace(event);
		
		$(".tween-battleScreen")[0].removeEventListener("webkitTransitionEnd", battleOver_returnToMapEnd, false);
		$(".tween-battleScreen")[0].removeEventListener("transitionend", battleOver_returnToMapEnd, false);
		
		$("#display_inner_info #battleScreen").html("");
		$("#display_inner_info #battleScreen").removeAttr("style");
		
		moveStageTest();			
	}
*/

	
	
	
	

	
	
	
	
	