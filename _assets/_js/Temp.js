	trace("Temp.js being used -- remove from final build / release");
	
	
	function test_EXT_HTML()
	{
		var hh;
		
		html_lib_reuse();
		
		hh = html_lib_use("_test", true, true);
		
		trace(hh);
	}
	
	
	
	
	
	
	
	var preBattleOptions;
	
	function preBattleOptions_init()
	{
		preBattleOptions = {};
		
		preBattleOptions.delay = null;
		
		preBattleOptions.html = {};
		preBattleOptions.html.display_inner_world = $("#display_wrapper #display_inner_world").html();
		
		preBattleOptions.playerStore = {};
		
		preBattleOptions.playerStore.x_return = MAP_PLAYER.cur_x;
		preBattleOptions.playerStore.y_return = MAP_PLAYER.cur_y;
	}
	
	function preBattleOptions_build()
	{
		var html;
		
		html_lib_reuse();
		
		html = html_lib_use("_preBattle_options", true, true);
		
		$("#enemyScreen").html(html);
		
		html_lib_empty();
		
		preBattleOptions_populate();
	}
	
	function preBattleOptions_populate()
	{
		var css;
		
		var title_enemy_name = "";
		var title_enemy_level = "";
		
		var title_player_name = "";
		var title_player_level = "";
		
		title_enemy_name = ROM.enemy.character.name;
		title_enemy_level = "level " + ROM.enemy.character.rating;
		
		css = 	{
					"width"		: ROM.enemy.character.buildData.w + "px",
					"height"	: ROM.enemy.character.buildData.h + "px"
				};
		
		// UPDATE WITH LOGIC... MAINLY LEVEL
		
		title_player_name = "you as a goat";
		title_player_level = "level " + 0;
		
		$("#enemyScreen .preBattle_title_enemy .preBattle_title_name").text(title_enemy_name.toUpperCase());
		$("#enemyScreen .preBattle_title_enemy .preBattle_title_level").text(title_enemy_level.toUpperCase());
		
		$("#enemyScreen .preBattle_title_player .preBattle_title_name").text(title_player_name.toUpperCase());
		$("#enemyScreen .preBattle_title_player .preBattle_title_level").text(title_player_level.toUpperCase());
		
		
		$("#enemyScreen .preBattle_enemy").css(css);
		
		$("#enemyScreen .preBattle_enemy").html(ROM.enemy.character.buildData.html);
	}
	
	function preBattleOptions_show()
	{
		var css;
		
		css = 	{
					"-webkit-transform"	: "translateY(0%)",
					"transform"			: "translateY(0%)"
				};
				
		$(".tween-preBattle_options")[0].addEventListener("webkitTransitionEnd", preBattleOptions_run, false);
		$(".tween-preBattle_options")[0].addEventListener("transitionend", preBattleOptions_run, false);
				
		$("#enemyScreen .preBattle_options").css(css);
	}
	
	function preBattleOptions_hide()
	{
		var css;
		
		css = 	{
					"-webkit-transform"	: "translateY(-100%)",
					"transform"			: "translateY(-100%)"
				};
				
		$(".tween-preBattle_options")[0].addEventListener("webkitTransitionEnd", preBattleOptions_purge, false);
		$(".tween-preBattle_options")[0].addEventListener("transitionend", preBattleOptions_purge, false);
				
		$("#enemyScreen .preBattle_options").css(css);
	}
	
	function preBattleOptions_run(event)
	{
		$(".tween-preBattle_options")[0].removeEventListener("webkitTransitionEnd", preBattleOptions_run, false);
		$(".tween-preBattle_options")[0].removeEventListener("transitionend", preBattleOptions_run, false);		
		
		if(CONTROL_SIGNAL.enableTouch)
		{
			$("#preBattle_attack")[0].addEventListener("touchend", preBattleOptions_action, false);
			$("#preBattle_run")[0].addEventListener("touchend", preBattleOptions_action, false);
			
			$(".preBattle_enemy")[0].addEventListener("touchend", preBattleOptions_action, false);	
		}
		
		else
		{
			$("#preBattle_attack")[0].addEventListener("click", preBattleOptions_action, false);
			$("#preBattle_run")[0].addEventListener("click", preBattleOptions_action, false);
			
			$(".preBattle_enemy")[0].addEventListener("click", preBattleOptions_action, false);			
		}
		
		$("#display_wrapper #display_inner_world").html("");
	}
	
	function preBattleOptions_action(event)
	{
		var css;
		
		trace(event);
		
		if(CONTROL_SIGNAL.enableTouch)
		{
			$("#preBattle_attack")[0].removeEventListener("touchend", preBattleOptions_action, false);
			$("#preBattle_run")[0].removeEventListener("touchend", preBattleOptions_action, false);
			
			$(".preBattle_enemy")[0].removeEventListener("touchend", preBattleOptions_action, false);	
		}
		
		else
		{
			$("#preBattle_attack")[0].removeEventListener("click", preBattleOptions_action, false);
			$("#preBattle_run")[0].removeEventListener("click", preBattleOptions_action, false);
			
			$(".preBattle_enemy")[0].removeEventListener("click", preBattleOptions_action, false);			
		}
		
		css = 	{
					"cursor" : "default",
					"pointer-events" : "none"
				};
		
		$("#preBattle_attack").css(css);
		$("#preBattle_run").css(css);
		
		$(".preBattle_enemy").css(css);
		
		switch(event.target.id)
		{
			case "preBattle_attack":
			{
				trace("ATTACK");
				
				preBattleOptions_actionAttack();
				
				break;
			}
			
			case "preBattle_run":
			{
				trace("RUN");
				
				preBattleOptions_actionRun();
				
				break;
			}
			
			default:
			{
				trace("ATTACK-DEFAULT");
				
				preBattleOptions_actionAttack();
			}
		}
	}
	
	function preBattleOptions_actionAttack()
	{
		$("#enemyScreen .preBattle_enemy .map-enemy_40x40-head").addClass("map-enemy_40x40_head_fear");
				
		$("#enemyScreen .preBattle_title_enemy .preBattle_title_name").css("opacity", "0");
		$("#enemyScreen .preBattle_title_enemy .preBattle_title_level").css("opacity", "0");
				
		$("#enemyScreen .preBattle_title_player").css("opacity", "0");
		
		preBattleOptions_showOption("ATTACK");		
	}
	
	function preBattleOptions_actionRun()
	{
		$("#enemyScreen .preBattle_enemy .map-enemy_40x40-head").addClass("map-enemy_40x40_head_happy");
				
		$("#enemyScreen .preBattle_title_player .preBattle_title_name").css("opacity", "0");
		$("#enemyScreen .preBattle_title_player .preBattle_title_level").css("opacity", "0");
				
		$("#enemyScreen .preBattle_title_enemy").css("opacity", "0");
		
		preBattleOptions_showOption("RUN");		
	}
	
	function preBattleOptions_showOption(route)
	{
		preBattleOptions.delay = setTimeout(preBattleOptions_route, 1.4 * 1000, route);
	}
	
	function preBattleOptions_route(route)
	{
		// var css;
		
		if(route === "ATTACK")
		{
			
		}
		
		if(route === "RUN")
		{
			$("#display_wrapper #display_inner_world").html(preBattleOptions.html.display_inner_world);
			
			if(CONTROL_SIGNAL.enableTouch)
			{
				// TOUCH UI DISPLAY FIX
				$("#touchPad").html("");
				$("#touchPad").html(CONTROL_SIGNAL.html.touchNav);
				
				// ENABLE TOUCH UI TO APPEAR AFTER TRANSITION OUT
				CONTROL_SIGNAL.firstTouch = true;
			}
			
			MAP_PLAYER.pos_x = MAP_PLAYER.cur_x = preBattleOptions.playerStore.x_return;
			MAP_PLAYER.pos_y = MAP_PLAYER.cur_y = preBattleOptions.playerStore.y_return;
			
/*
			css = 	{
						"-webkit-transform"	: "translate(" + MAP_PLAYER.pos_x + "px, " + MAP_PLAYER.pos_y + "px)",
						"transform"			: "translate(" + MAP_PLAYER.pos_x + "px, " + MAP_PLAYER.pos_y + "px)"
					};
			
			$("#" + MAP_PLAYER.hitTestArea).css(css);
*/
			
			preBattleOptions_hide();
		}
	}
	
	function preBattleOptions_purge(event)
	{
		$(".tween-preBattle_options")[0].removeEventListener("webkitTransitionEnd", preBattleOptions_purge, false);
		$(".tween-preBattle_options")[0].removeEventListener("transitionend", preBattleOptions_purge, false);
		
		$("#display_wrapper #display_inner_info #enemyScreen").html("");
		
		hitTest_init();
		
		// HIT_TEST.hit_enemy = false;
		
		// hitTest();
		
		MAP_PLAYER.listen = true;
		
		// hitTest_init();
		
		// NO_HIT_TEST = true;
		
		control_switch(true);
		
/*
		trace("!!!! -------------------- preBattleOptions_purge();");
		
		trace(MAP_PLAYER);
		trace(CONTROL_SIGNAL);
		trace(HIT_TEST);
		
		trace("!!!! -------------------- preBattleOptions_purge();");
*/
		
/*
		if(CONTROL_SIGNAL.enableTouch)
		{
			touchDisplay(null);	
		}
*/
		
		preBattleOptions = {};		
	}