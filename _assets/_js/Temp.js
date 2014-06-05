	trace("Temp.js being used -- remove from final build / release");
	

	function preBattleOptions_init()
	{
		gameState_HTML = "";
		
		gameState_HTML = $("#display_wrapper").html();
	}
	
	function preBattleOptions_build()
	{
		var html;
		
		html_lib_reuse();
		
		html = html_lib_use("_preBattle_options");
		
		$("#enemyScreen").html(html);
		
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
	
	function preBattleOptions_run(event)
	{
		$(".tween-preBattle_options")[0].removeEventListener("webkitTransitionEnd", preBattleOptions_run, false);
		$(".tween-preBattle_options")[0].removeEventListener("transitionend", preBattleOptions_run, false);		
		
		if(CONTROL_SIGNAL.enableTouch)
		{
			$("#preBattle_attack")[0].addEventListener("touchend", preBattleOptions_action, false);
			$("#preBattle_run")[0].addEventListener("touchend", preBattleOptions_action, false);	
		}
		
		else
		{
			$("#preBattle_attack")[0].addEventListener("click", preBattleOptions_action, false);
			$("#preBattle_run")[0].addEventListener("click", preBattleOptions_action, false);			
		}
	}
	
	function preBattleOptions_action(event)
	{
		var css;
		
		if(CONTROL_SIGNAL.enableTouch)
		{
			$("#preBattle_attack")[0].removeEventListener("touchend", preBattleOptions_action, false);
			$("#preBattle_run")[0].removeEventListener("touchend", preBattleOptions_action, false);	
		}
		
		else
		{
			$("#preBattle_attack")[0].removeEventListener("click", preBattleOptions_action, false);
			$("#preBattle_run")[0].removeEventListener("click", preBattleOptions_action, false);			
		}
		
		css = 	{
					"cursor" : "default",
					"pointer-events" : "none"
				};
		
		$("#preBattle_attack").css(css);
		$("#preBattle_run").css(css);
		
		switch(event.target.id)
		{
			case "preBattle_attack":
			{
				trace("ATTACK");
				
				$("#enemyScreen .preBattle_enemy .map-enemy_40x40-head").addClass("map-enemy_40x40_head_fear");
				
				$("#enemyScreen .preBattle_title_enemy .preBattle_title_name").css("opacity", "0");
				$("#enemyScreen .preBattle_title_enemy .preBattle_title_level").css("opacity", "0");
				
				$("#enemyScreen .preBattle_title_player").css("opacity", "0");
				
				break;
			}
			
			case "preBattle_run":
			{
				trace("RUN");
				
				$("#enemyScreen .preBattle_enemy .map-enemy_40x40-head").addClass("map-enemy_40x40_head_happy");
				
				$("#enemyScreen .preBattle_title_player .preBattle_title_name").css("opacity", "0");
				$("#enemyScreen .preBattle_title_player .preBattle_title_level").css("opacity", "0");
				
				$("#enemyScreen .preBattle_title_enemy").css("opacity", "0");
				
				break;
			}
		}
	}
	
	function test_refreshAfter()
	{
		$("#display_wrapper").html("");
		$("#display_wrapper").html(quickStoreHTML);
	}