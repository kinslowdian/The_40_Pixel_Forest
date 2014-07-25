	
	/* --- PRE_BATTLE_OPTIONS */
	
	var preBattleOptions;
	
	/* --- KEYBOARD_PRE_BATTLE_NAV */
	
	var keyboardPreBattle;
	
	/* --- THE_BATTLE */
	
	var theBattle;
	
	/* --- MICRO_BATTLE */
	
	var firstBattle = true;
	
	/* --- BATTLE_NAV */
	
	var BATTLE_NAV;
	
	/* --- KEYBOARD_BATTLE_NAV */
	
	var keyboardBattleNav;
	
	/* --- BATTLE_USER_INFO */
	
	/* --- SPACE_SQUID */
	
	var spaceSquidsUse = false;
	
	/* --- BATTLE_END */
	
	var battleEnd_mountains;
	
	/* --- BATTLE_OVER */
	
	
	///////////////////////////////// --- PRE_BATTLE_OPTIONS
	
	function preBattleOptions_init()
	{
		preBattleOptions = {};
		
		preBattleOptions.choice = "";
		
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
		
		$("#display_wrapper #display_inner_info #enemyScreen").html(html);
		
		html_lib_empty();
		
		
		$("#display_inner_info #battleScreenFade").addClass("battleScreenFade_first");
		$("#display_inner_info #battleScreenFade").addClass("battleScreenFade_use");
		
		
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
		title_enemy_level = ROM.enemy.character.sword.skill.toUpperCase() + " " + "level " + ROM.enemy.character.rating;
		
		css = 	{
					"width"		: ROM.enemy.character.buildData.w + "px",
					"height"	: ROM.enemy.character.buildData.h + "px"
				};
		
		// UPDATE WITH LOGIC... MAINLY LEVEL
		
		title_player_name = "you as a goat";
		title_player_level = MAP_PLAYER.sword.skill.toUpperCase() + " " + "level " + MAP_PLAYER.rating;
		
		$("#enemyScreen .preBattle_title_enemy .preBattle_title_name").text(title_enemy_name.toUpperCase());
		$("#enemyScreen .preBattle_title_enemy .preBattle_title_level").text(title_enemy_level.toUpperCase());
		
		$("#enemyScreen .preBattle_title_player .preBattle_title_name").text(title_player_name.toUpperCase());
		$("#enemyScreen .preBattle_title_player .preBattle_title_level").text(title_player_level.toUpperCase());
		
		
		$("#enemyScreen .preBattle_enemy").css(css);
		
		$("#enemyScreen .preBattle_enemy").html(ROM.enemy.character.buildData.html);
	}
	
	function preBattleOptions_show()
	{
		var css_screen;
		var css_fader;
		
		css_screen = {
						"-webkit-transform"	: "translateY(0%)",
						"transform"			: "translateY(0%)"
					};
		
		css_fader = {
						"-webkit-transition-delay" 	: "0s",
						"transition-delay" 			: "0s",
						"opacity" 					: "1"
					};
		
		$(".tween-preBattle_options")[0].addEventListener("webkitTransitionEnd", preBattleOptions_run, false);
		$(".tween-preBattle_options")[0].addEventListener("transitionend", preBattleOptions_run, false);
				
		$("#display_inner_info #battleScreenFade").addClass("tween-battleScreenFade");
		
		$("#display_inner_info #battleScreenFade").css(css_fader);
		
		$("#enemyScreen .preBattle_options").css(css_screen);
	
		preBattleOptions_fallAway();		
	}
	
	function preBattleOptions_fallAway()
	{
		var css;
		
		css = 	{
					"-webkit-transform"	: "scale(0.4)",
					"transform"			: "scale(0.4)"	
				};
				
		$(".stage-view-y").css(css);		
	}

	function preBattleOptions_hide(y_percent) // 100 || -100
	{
		var css;
		
		css = 	{
					"-webkit-transform"	: "translateY(" + y_percent + "%)",
					"transform"			: "translateY(" + y_percent + "%)"
				};
		
		
		$(".tween-battleScreenFade")[0].addEventListener("webkitTransitionEnd", preBattleOptions_purge, false);
		$(".tween-battleScreenFade")[0].addEventListener("transitionend", preBattleOptions_purge, false);
				
		$("#enemyScreen .preBattle_options").css(css);
	
		if(preBattleOptions.choice === "RUN")
		{
			$("#display_inner_info #battleScreenFade").css("opacity", "0");	
		}
		
		if(preBattleOptions.choice === "ATTACK")
		{
			$("#microBattle_transition").css("opacity", "0");
		}
		
	}
	
	function preBattleOptions_run(event)
	{
		$(".tween-preBattle_options")[0].removeEventListener("webkitTransitionEnd", preBattleOptions_run, false);
		$(".tween-preBattle_options")[0].removeEventListener("transitionend", preBattleOptions_run, false);	
		
		
		$("#display_inner_info #battleScreenFade").removeAttr("style");
		$("#display_inner_info #battleScreenFade").removeAttr("class");	
		
		
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
			
			keyboardPreBattle_init();		
		}
		
		$("#display_wrapper #display_inner_world").html("");
	}
	
	function preBattleOptions_action(event)
	{
		var css;
		
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
			
			keyboardPreBattle_off();			
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
				preBattleOptions.choice = "ATTACK";
				
				preBattleOptions_actionAttack();
				
				break;
			}
			
			case "preBattle_run":
			{
				preBattleOptions.choice = "RUN";
				
				preBattleOptions_actionRun();
				
				break;
			}
			
			default:
			{
				preBattleOptions.choice = "ATTACK";
				
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
		
		preBattleOptions_showOption();		
	}
	
	function preBattleOptions_actionRun()
	{
		$("#enemyScreen .preBattle_enemy .map-enemy_40x40-head").addClass("map-enemy_40x40_head_happy");
				
		$("#enemyScreen .preBattle_title_player .preBattle_title_name").css("opacity", "0");
		$("#enemyScreen .preBattle_title_player .preBattle_title_level").css("opacity", "0");
				
		$("#enemyScreen .preBattle_title_enemy").css("opacity", "0");
		
		preBattleOptions_showOption();		
	}
	
	function preBattleOptions_showOption()
	{
		preBattleOptions.delay = setTimeout(preBattleOptions_route, 1.4 * 1000);
	}
	
	function preBattleOptions_route()
	{		
		if(preBattleOptions.choice === "ATTACK")
		{
			theBattle_init(preBattleOptions);
			
			theBattle_build();
			
			preBattleOptions_hide(-100);
		}
		
		if(preBattleOptions.choice === "RUN")
		{
			$("#display_wrapper #display_inner_world").html(preBattleOptions.html.display_inner_world);
			
			$("#display_inner_info #battleScreenFade").addClass("battleScreenFade_use");
			$("#display_inner_info #battleScreenFade").addClass("tween-battleScreenFade");
			
			
			if(CONTROL_SIGNAL.enableTouch)
			{
				// TOUCH UI DISPLAY FIX
				$("#touchPad").html("");
				$("#touchPad").html(CONTROL_SIGNAL.html.touchNav);
				
				// ENABLE TOUCH UI TO APPEAR AFTER TRANSITION OUT
				CONTROL_SIGNAL.firstTouch = true;
			}
			
			// RETURN ORIGINAL CONTROL POSITIONS
			MAP_PLAYER.pos_x = MAP_PLAYER.cur_x = preBattleOptions.playerStore.x_return;
			MAP_PLAYER.pos_y = MAP_PLAYER.cur_y = preBattleOptions.playerStore.y_return;
			
			preBattleOptions_hide(100);
		}
	}

	function preBattleOptions_purge(event)
	{
		$(".tween-battleScreenFade")[0].removeEventListener("webkitTransitionEnd", preBattleOptions_purge, false);
		$(".tween-battleScreenFade")[0].removeEventListener("transitionend", preBattleOptions_purge, false);	
		
		$("#display_wrapper #display_inner_info #enemyScreen").html("");

		
		if(preBattleOptions.choice === "ATTACK")
		{
			$("#microBattle_transition").removeAttr("style");
			$("#microBattle_transition").removeAttr("class");
			
			microBattleSequence_init();
		}
		
		if(preBattleOptions.choice === "RUN")
		{
			$("#display_inner_info #battleScreenFade").removeAttr("style");
			$("#display_inner_info #battleScreenFade").removeAttr("class");			
			
			// SET UP CONTROLS + HITTEST
			hitTest_init();
			
			MAP_PLAYER.listen = true;
			
			control_switch(true);	
		}
		
		// FLUSH OBJECT
		preBattleOptions = {};
		
		keyboardPreBattle = {};		
	}
	
	///////////////////////////////// --- PRE_BATTLE_OPTIONS
	
	
	
	
	///////////////////////////////// --- KEYBOARD_PRE_BATTLE_NAV
	
	function keyboardPreBattle_init()
	{
		keyboardPreBattle = {};
		
		keyboardPreBattle.countTap = "DEFAULT";
		
		keyboardPreBattle.currentFocus = "";
		
		keyboardPreBattle.signal = {};
		
		keyboardPreBattle.signal.signal0 = $("#preBattle_attack");
		keyboardPreBattle.signal.signal1 = $("#preBattle_run");
		
		keyboardPreBattle.css = {};
		
		keyboardPreBattle.css.def	= 	{
											"-webkit-transform" : "translateY(0px)",
											"transform" 		: "translateY(0px)",
											"color" 			: "white"			
										};
										
		keyboardPreBattle.css.hit0	= 	{
											"-webkit-transform" : "translateY(14px)",
											"transform" 		: "translateY(14px)",
											"color" 			: "#ff0070"		
										};
										
		keyboardPreBattle.css.hit1	= 	{
											"-webkit-transform" : "translateY(14px)",
											"transform" 		: "translateY(14px)",
											"color" 			: "#17e69d"		
										};
										
		keyboardPreBattle.css.exit	= 	{
											"-webkit-transform" : "translateY(0px)",
											"transform" 		: "translateY(0px)"	
										};
		
		keyboardPreBattle.listening = true;
										
		$(window)[0].addEventListener("keyup", keyboardPreBattle_event, false);		
	}
	
	function keyboardPreBattle_event(event)
	{
		// LEFT + DOWN
		if(event.keyCode == 37 || event.keyCode == 40)
		{
			if(keyboardPreBattle.countTap === "DEFAULT")
			{
				keyboardPreBattle.countTap = 0;
			}
			
			else
			{
				keyboardPreBattle.countTap --;
			}
			
			if(keyboardPreBattle.countTap < 0)
			{
				keyboardPreBattle.countTap = 1;
			}
			
			keyboardPreBattle_highLight();
		}
		
		// RIGHT + UP
		if(event.keyCode == 39 || event.keyCode == 38)
		{
			if(keyboardPreBattle.countTap === "DEFAULT")
			{
				keyboardPreBattle.countTap = 0;
			}
			
			else
			{
				keyboardPreBattle.countTap ++;
			}
			
			if(keyboardPreBattle.countTap > 1)
			{
				keyboardPreBattle.countTap = 0;
			}
			
			keyboardPreBattle_highLight();			
		}
		
		if(event.keyCode == 13 || event.keyCode == 32)
		{
			if(keyboardPreBattle.countTap !== "DEFAULT")
			{
				keyboardPreBattle_select();
			}
			
			else
			{
				keyboardPreBattle.countTap = 0;
				
				keyboardPreBattle_highLight();
			}
		}
	}
	
	
	function keyboardPreBattle_highLight()
	{
		var keyboardSelect = keyboardPreBattle.signal["signal" + keyboardPreBattle.countTap];
		
		var keyboardSelect_id = keyboardSelect[0].id;
		
		
		if(!keyboardPreBattle.currentFocus)
		{
			keyboardPreBattle.currentFocus = keyboardSelect_id;
			
			$("#" + keyboardSelect_id).css(keyboardPreBattle.css["hit" + keyboardPreBattle.countTap]);
		}
		
		else
		{
			$("#" + keyboardSelect_id).css(keyboardPreBattle.css["hit" + keyboardPreBattle.countTap]);
			$("#" + keyboardPreBattle.currentFocus).css(keyboardPreBattle.css.def);
			
			keyboardPreBattle.currentFocus = keyboardSelect_id;
		}
	}
	
	function keyboardPreBattle_select()
	{
		keyboardPreBattle_off();		
		
		var fake_event;
		
		fake_event = {};
		fake_event.target = {};
		fake_event.target.id = keyboardPreBattle.currentFocus;
		
		$("#" + keyboardPreBattle.currentFocus).css(keyboardPreBattle.css.exit);
		
		preBattleOptions_action(fake_event);	
	}
	
	function keyboardPreBattle_off()
	{
		if(keyboardPreBattle.listening)
		{
			keyboardPreBattle.listening = false;
			$(window)[0].removeEventListener("keyup", keyboardPreBattle_event, false);
		}		
	}	
	
	///////////////////////////////// --- KEYBOARD_PRE_BATTLE_NAV
	
		
	
	
	///////////////////////////////// --- THE_BATTLE
	
	function theBattle_init(obj)
	{
		theBattle = {};
		
		theBattle.html = {};
		theBattle.html.display_inner_world = obj.html.display_inner_world;
		
		theBattle.html.navWrapper = "";
		theBattle.html.fadeWrapper = "";
		theBattle.html.wipeWrapper = "";
		
		theBattle.html.zombie = "";
		
		
		theBattle.grave = {};
		theBattle.grave.w = ROM.enemy.character.buildData.w;
		theBattle.grave.h = ROM.enemy.character.buildData.h;
		theBattle.grave.ref = "_enemy_grave" + theBattle.grave.w + "x" + theBattle.grave.h;
		theBattle.grave.html = "";
		
		theBattle.playerStore = {};
		
		theBattle.playerStore.x_return = obj.playerStore.x_return;
		theBattle.playerStore.y_return = obj.playerStore.y_return;
		
		trace("!!!!! ----------- LEVEL OB???? :");
		trace(LEVEL_MAIN);
	}
	
	function theBattle_build()
	{
		var html;
		
		html_lib_reuse();
		
		html = html_lib_use("_level_battle", true, true);
		
		$("#display_wrapper #display_inner_info #battleScreen").html(html);
		
		theBattle.grave.html = html_lib_use(theBattle.grave.ref, false, true);
		
		theBattle.html.zombie = html_lib_use("_enemy_zombie", false, true);
		
		html_lib_empty();
		
		$("#microBattle_transition").addClass("battleScreenFade_use");
		$("#microBattle_transition").addClass("tween-battleScreenFade");
		
		
		screenUpdateInit(true);
		
		// WATCH FOR CONFLICT WITH INTRO
		timerList_init();
	
		microBattleSequence_storeData();
	}
	
	///////////////////////////////// --- THE_BATTLE
	
	
	
	
	///////////////////////////////// --- MICRO_BATTLE */
	
	function microBattleSequence_storeData()
	{
		theBattle.html.navWrapper = $("#microBattle_nav_wrapper").html();
		theBattle.html.fadeWrapper = $("#microBattle_fade_wrapper").html();
		theBattle.html.wipeWrapper = $("#microBattle_resultWipe_wrapper").html();
		
		$("#microBattle_nav_wrapper").html("");
		$("#microBattle_fade_wrapper").html("");
		$("#microBattle_resultWipe_wrapper").html("");
		
		$("#microBattle_player_wrapper #player2").addClass("enemy_" + ROM.enemy.character.enemyType);	
	}
	
	function microBattleSequence_init()
	{
		var mbs_delay;
		
		mbs_delay = new AnimationTimer();
		
		timerList_add(mbs_delay);
		mbs_delay.time(1, microBattleSequence_boss);	
	}
	
	function microBattleSequence_boss()
	{
		var mbs_delay;
		
		$("#bossWatching .boss-head > div").removeClass("boss-face-default").addClass("boss-face-happy");
		$("#bossWatching .boss-armL-Cont").addClass("boss-armL-Cont-UP");
		$("#bossWatching .boss-armR-Cont").addClass("boss-armL-Cont-UP");
		
		mbs_delay = new AnimationTimer();
		
		timerList_add(mbs_delay);
		mbs_delay.time(0.5, microBattleSequence_scrollDown);
	}
	
	function microBattleSequence_scrollDown()
	{
		var mbs_css;
		var mbs_scroll = -1560; // -1480; // -1640;
		
		mbs_css = 	{
						"-webkit-transform"	: "translateY(" + mbs_scroll + "px)",
						"transform"			: "translateY(" + mbs_scroll + "px)"
					};
				
		$(".stage-view-y").css(mbs_css);
		
		$("#microBattle_wrapper .stage-view-y")[0].addEventListener("webkitTransitionEnd", microBattleSequence_inView, false);
		$("#microBattle_wrapper .stage-view-y")[0].addEventListener("transitionend", microBattleSequence_inView, false);
	}
	
	function microBattleSequence_inView(event)
	{
		$("#microBattle_wrapper .stage-view-y")[0].removeEventListener("webkitTransitionEnd", microBattleSequence_inView, false);
		$("#microBattle_wrapper .stage-view-y")[0].removeEventListener("transitionend", microBattleSequence_inView, false);
		
		microBattleSequence_addData();
	}
	
	function microBattleSequence_addData()
	{
		$("#microBattle_nav_wrapper").html(theBattle.html.navWrapper);
		$("#microBattle_fade_wrapper").html(theBattle.html.fadeWrapper);
		
		microBattleSequence_sceneReady();	
	}
	
	function microBattleSequence_sceneReady()
	{
		var mbs_level_delay;
		
		// DISPLAY FIX
		screenUpdateInit(true);
		// DISPLAY FIX
		
		spaceSquids_setup();
		
		mbs_level_delay = new AnimationTimer();
		
		timerList_add(mbs_level_delay);
		mbs_level_delay.time(1.5, microBattleSequence_levelFlashIn);		
	}
	
	function microBattleSequence_levelFlashIn()
	{
		$(".microBattle_fade_flash").addClass("tween-microBattle_fade_flash");
		
		$(".tween-microBattle_fade_flash")[0].addEventListener("webkitTransitionEnd", microBattleSequence_levelFlashOut, false);
		$(".tween-microBattle_fade_flash")[0].addEventListener("transitionend", microBattleSequence_levelFlashOut, false);
		
		$(".microBattle_fade_flash").css("opacity", 1);
	}
	
	function microBattleSequence_levelFlashOut(event)
	{
		$(".tween-microBattle_fade_flash")[0].removeEventListener("webkitTransitionEnd", microBattleSequence_levelFlashOut, false);
		$(".tween-microBattle_fade_flash")[0].removeEventListener("transitionend", microBattleSequence_levelFlashOut, false);
		
		$(".microBattle_fade_main").css("visibility", "visible");
		
		$(".tween-microBattle_fade_flash")[0].addEventListener("webkitTransitionEnd", microBattleSequence_levelFlashEnd, false);
		$(".tween-microBattle_fade_flash")[0].addEventListener("transitionend", microBattleSequence_levelFlashEnd, false);
		
		$(".microBattle_fade_flash").css("opacity", 0);		
	}
	
	function microBattleSequence_levelFlashEnd(event)
	{
		$(".tween-microBattle_fade_flash")[0].removeEventListener("webkitTransitionEnd", microBattleSequence_levelFlashEnd, false);
		$(".tween-microBattle_fade_flash")[0].removeEventListener("transitionend", microBattleSequence_levelFlashEnd, false);
		
		$(".microBattle_fade_flash").remove();
		
		$(".tween-microBattleWeatherFade")[0].addEventListener("webkitTransitionEnd", microBattleSequence_startBattle, false);
		$(".tween-microBattleWeatherFade")[0].addEventListener("transitionend", microBattleSequence_startBattle, false);
		
		$(".microBattle_weather").css("opacity", "0");
		
		if(spaceSquidsUse)
		{
			spaceSquids_animationStart();	
		}		
	}
	
/*
	function microBattleSequence_fadeOutLevel()
	{
		var css;
		
		css = 	{
					"-webkit-transform" : "translateY(0%)",
					"transform"			: "translateY(0%)"
				};
				
		$(".microBattle_fade_main").css(css);
		
		$(".microBattle_weather").css("opacity", "0");
		
		$(".tween-microBattleWeatherFade")[0].addEventListener("webkitTransitionEnd", microBattleSequence_startBattle, false);
		$(".tween-microBattleWeatherFade")[0].addEventListener("transitionend", microBattleSequence_startBattle, false);
		
		if(spaceSquidsUse)
		{
			spaceSquids_animationStart();	
		}
	}
*/
	
	function microBattleSequence_startBattle(event)
	{
		$(".tween-microBattleWeatherFade")[0].removeEventListener("webkitTransitionEnd", microBattleSequence_startBattle, false);
		$(".tween-microBattleWeatherFade")[0].removeEventListener("transitionend", microBattleSequence_startBattle, false);
		
		$("#microBattle_player_wrapper").addClass("microBattle_player_wrapper_focus");
		
		$("#microBattle_wrapper").html("");
		
		battleNav_init();
		
		battleNav_show();
	}	
	
	///////////////////////////////// --- MICRO_BATTLE */
	
	
	
	
	///////////////////////////////// --- BATTLE_NAV */
	
	
	function battleNav_init()
	{
		BATTLE_NAV = {};
		
		BATTLE_NAV.settings = {};
		
		BATTLE_NAV.settings.y_max = 211;
		
		BATTLE_NAV.settings.y_hide = 	{
											"-webkit-transform" : "translateY(" + -BATTLE_NAV.settings.y_max + "px)",
											"transform" 		: "translateY(" + -BATTLE_NAV.settings.y_max + "px)"
										};
								
		BATTLE_NAV.settings.y_show = 	{
											"-webkit-transform" : "translateY(0px)",
											"transform" 		: "translateY(0px)"			
										};
		
		BATTLE_NAV.settings.options_show = "battle-nav-show";
		BATTLE_NAV.settings.options_hide = "battle-nav-hide";								
		BATTLE_NAV.settings.options_tween = "tween-battle-nav";
				
		BATTLE_NAV.options = {};
		
		
		BATTLE_NAV.player_1 = {};
		BATTLE_NAV.player_2 = {};
		
		BATTLE_NAV.player_1.headType = "goat";
		
		BATTLE_NAV.player_2.headType = ROM.enemy.character.enemyType; // "bird"
		
		
		BATTLE_NAV.game = {};
		
		// BATTLE_NAV.game.result = "WIN";
		
		BATTLE_NAV.html = {};
		
		BATTLE_NAV.html.navOptions = $("#battle-nav").html();
		BATTLE_NAV.html.navBattle = "";
		
		BATTLE_NAV.navText = {};
		
		BATTLE_NAV.navText.txt_BEGIN	= Logic.dat_ROM["_LOGIC"]["messages"].txt_BEG;
		BATTLE_NAV.navText.txt_START 	= Logic.dat_ROM["_LOGIC"]["messages"].txt_STR;
		BATTLE_NAV.navText.txt_LOSE 	= Logic.dat_ROM["_LOGIC"]["messages"].txt_LOSE;
		BATTLE_NAV.navText.txt_DRAW 	= Logic.dat_ROM["_LOGIC"]["messages"].txt_DRAW;
		BATTLE_NAV.navText.txt_WIN		= Logic.dat_ROM["_LOGIC"]["messages"].txt_WIN;
		BATTLE_NAV.navText.txt_AGAIN 	= Logic.dat_ROM["_LOGIC"]["messages"].txt_AGN;
		
		
		BATTLE_NAV.fightText = {};
		
		BATTLE_NAV.fightText.txt_BEG	= Logic.dat_ROM["_LOGIC"]["battle"]["fight"].txt_BEG;
		BATTLE_NAV.fightText.txt_PRE	= Logic.dat_ROM["_LOGIC"]["battle"]["fight"].txt_PRE;
		BATTLE_NAV.fightText.txt_BAT	= Logic.dat_ROM["_LOGIC"]["battle"]["fight"].txt_BAT;
		BATTLE_NAV.fightText.txt_AGN	= Logic.dat_ROM["_LOGIC"]["battle"]["fight"].txt_AGN;
		
		
		BATTLE_NAV.animation = {};
		BATTLE_NAV.animation.html = {};
		
		BATTLE_NAV.animation.punchTotal = 10;
		BATTLE_NAV.animation.smashed = false;
		
		BATTLE_NAV.animation.playheadDelay = new AnimationTimer();
		timerList_add(BATTLE_NAV.animation.playheadDelay);
		
		BATTLE_NAV.animation.firstPunch = false;
		BATTLE_NAV.animation.resultRound = false;
		
		BATTLE_NAV.animation.sequenceFlow = "START_PLAYER1";
		
		BATTLE_NAV.animation.html.superPunch = $(".battleNav-superPunch").html();
		
		$(".battleNav-superPunch").html("");			
		
		
		battleNav_getValues();
	}
	
	function battleNav_getValues()
	{
		BATTLE_NAV.options.stone 	= {};
		BATTLE_NAV.options.paper 	= {};
		BATTLE_NAV.options.scissors = {};
		
		BATTLE_NAV.options.stone.source 	= $("#battle-nav #battle-stone");
		BATTLE_NAV.options.paper.source 	= $("#battle-nav #battle-paper");
		BATTLE_NAV.options.scissors.source 	= $("#battle-nav #battle-scissors");
		
		BATTLE_NAV.options.stone.scaled		= false;
		BATTLE_NAV.options.paper.scaled		= false;
		BATTLE_NAV.options.scissors.scaled 	= false;
		
		BATTLE_NAV.options.stone.index		= 0;
		BATTLE_NAV.options.paper.index		= 1;
		BATTLE_NAV.options.scissors.index	= 2;
		
		// BATTLE_NAV.player_1.head = $("#battle-nav-player1 .battleCute-warrior-head");
		// BATTLE_NAV.player_2.head = $("#battle-nav-player2 .battleCute-warrior-head");
	}
	
	function battleNav_show()
	{
		$("#info-cloud p").text(BATTLE_NAV.navText.txt_BEGIN.toUpperCase());
		
		$(".tween-battle-cloud")[0].addEventListener("webkitTransitionEnd", battleNav_inView, false);
		$(".tween-battle-cloud")[0].addEventListener("transitionend", battleNav_inView, false);
				
		$("#battle-cloud").css(BATTLE_NAV.settings.y_show);		
	}
	
	function battleNav_inView(event)
	{
		$(".tween-battle-cloud")[0].removeEventListener("webkitTransitionEnd", battleNav_inView, false);
		$(".tween-battle-cloud")[0].removeEventListener("transitionend", battleNav_inView, false);
		
		if(firstBattle)
		{
			battleNav_hintDisplayInit();
		}
		
		else
		{
			battleNav_normalInit();				
		}
	}
	
	function battleNav_hintDisplayInit()
	{
		for(var i = 0; i < 3; i++)
		{
			var css;
			var delay = i * 0.1;
			
			css = 	{
						"-webkit-transition-delay"	: delay + "s",
						"transition-delay"			: delay + "s",
						"-webkit-transform" 		: "scale(1)",
						"transform"					: "scale(1)"
					};
					
			$("#battle-hint-" + i).css(css);
		}
		
		$("#battle-hint-2")[0].addEventListener("webkitTransitionEnd", battleNav_hintDisplayShow, false);
		$("#battle-hint-2")[0].addEventListener("transitionend", battleNav_hintDisplayShow, false);		
	}
	
	function battleNav_hintDisplayShow(event)
	{
		var hintDelay;
		
		$("#battle-hint-2")[0].removeEventListener("webkitTransitionEnd", battleNav_hintDisplayShow, false);
		$("#battle-hint-2")[0].removeEventListener("transitionend", battleNav_hintDisplayShow, false);
		
		$("#battle-nav .battleNavShock").css("opacity", "1");
		
		hintDelay = new AnimationTimer();
		
		timerList_add(hintDelay);
		hintDelay.time(2.5, battleNav_hintDisplayHide);		
	}
	
	function battleNav_hintDisplayHide()
	{
		$("#battle-nav .battleNavShock").css("opacity", "0");
		
		for(var i = 0; i < 3; i++)
		{
			var css;
			var sel = Math.abs(i - 2);
			var delay = i * 0.1;
			
			css = 	{
						"-webkit-transition-delay"	: delay + "s",
						"transition-delay"			: delay + "s",
						"-webkit-transform" 		: "scale(0)",
						"transform"					: "scale(0)"
					};
					
			$("#battle-hint-" + sel).css(css);
		}
		
		$("#battle-hint-0")[0].addEventListener("webkitTransitionEnd", battleNav_hintDisplayRemove, false);
		$("#battle-hint-0")[0].addEventListener("transitionend", battleNav_hintDisplayRemove, false);	
	}
	
	function battleNav_hintDisplayRemove(event)
	{
		$("#battle-hint-0")[0].removeEventListener("webkitTransitionEnd", battleNav_hintDisplayRemove, false);
		$("#battle-hint-0")[0].removeEventListener("transitionend", battleNav_hintDisplayRemove, false);
		
		$("#battle-hint").remove();
		
		// TOO EARLY SET TO FALSE?
		firstBattle = false;
		
		battleNav_normalInit();		
	}
	
	function battleNav_normalInit()
	{
		$("#player1 .map-goat-head").removeClass("mapPlayer_head_default").addClass("mapPlayer_head_fear");
		$("#player2 .map-enemy_40x40-head").removeClass("map-enemy_40x40_head_default").addClass("map-enemy_40x40_head_fear");
		
		
		// $("#microBattle_darkness").css("visibility", "visible");	
		// $("#microBattle_darkness").css("opacity", "1");		
		
		battleUserInfo_textEngine("START", false);
		
		battleNav_control(true);			
	}
	
	function battleNav_control(run)
	{
		// IF ELSE FOR TOUCH OR MOUSE NEEDED FOR EVENTS MOUSE ONLY
		
		for(var optionItem in BATTLE_NAV.options)
		{
			if(run)
			{
				if(CONTROL_SIGNAL.enableTouch)
				{
					$(BATTLE_NAV.options[optionItem].source)[0].addEventListener("touchend", battleNav_controlEvent, false);
				}
				
				else
				{
					$(BATTLE_NAV.options[optionItem].source).css("cursor", "pointer");
					
					$(BATTLE_NAV.options[optionItem].source)[0].addEventListener("mouseover", battleNav_controlEvent, false);	
					$(BATTLE_NAV.options[optionItem].source)[0].addEventListener("mouseout", battleNav_controlEvent, false);	
					$(BATTLE_NAV.options[optionItem].source)[0].addEventListener("click", battleNav_controlEvent, false);
					
					keyboardBattleNav_init();		
				}
				
				$(BATTLE_NAV.options[optionItem].source).css("pointer-events", "auto");
			}
			
			else
			{
				if(CONTROL_SIGNAL.enableTouch)
				{
					$(BATTLE_NAV.options[optionItem].source)[0].removeEventListener("touchend", battleNav_controlEvent, false);
				}
				
				else
				{
					$(BATTLE_NAV.options[optionItem].source).css("cursor", "default");
					
					$(BATTLE_NAV.options[optionItem].source)[0].removeEventListener("mouseover", battleNav_controlEvent, false);	
					$(BATTLE_NAV.options[optionItem].source)[0].removeEventListener("mouseout", battleNav_controlEvent, false);	
					$(BATTLE_NAV.options[optionItem].source)[0].removeEventListener("click", battleNav_controlEvent, false);
					
					keyboardBattleNav_off();	
				}
				
				$(BATTLE_NAV.options[optionItem].source).css("pointer-events", "none");				
			}
		}
	}
	
	function battleNav_controlEvent(event)
	{
		event.preventDefault();
		
		switch(event.type)
		{
			case "mouseover":
			{
				$("#" + event.target.parentNode.id).css(keyboardBattleNav.css.hit);
				
				battleNav_mouseRollCheck(event.target.parentNode.id, event.type);
				
				break;
			}
			
			case "mouseout":
			{
				$("#" + event.target.parentNode.id).css(keyboardBattleNav.css.def);
				
				battleNav_mouseRollCheck(event.target.parentNode.id, event.type);
				
				break;
			}
			
			case "click":
			{
				$("#" + event.target.parentNode.id).css(keyboardBattleNav.css.def);
				
				battleNav_selection(event.target.parentNode.id); //parentElement ?
				
				break;
			}
			
			case "touchend":
			{
				battleNav_selection(event.target.parentNode.id); //parentElement ?
				
				break;
			}
		}
	}
	

////////////// FIX... NEEDS TO HAVE OBJECT BATTLE_NAV.options TO BE RE-WRITTEN
	
	function battleNav_mouseRollCheck(div, action)
	{
		for(var optionItem in BATTLE_NAV.options)
		{
			var optionTarget = BATTLE_NAV.options[optionItem];
			
			if(action === "mouseover")
			{
				if(div === optionTarget.source[0].id)
				{
					optionTarget.scaled = true;
				}
				
				if(div !== optionTarget.source[0].id && optionTarget.scaled)
				{
					optionTarget.scaled = false;
					
					$("#" + optionTarget.source[0].id).css(keyboardBattleNav.css.def);
				}	
			}
			
			if(action === "mouseout")
			{
				if(div === optionTarget.source[0].id)
				{
					optionTarget.scaled = false;
				}				
			}
		}
	}

////////////// FIX... NEEDS TO HAVE OBJECT BATTLE_NAV.options TO BE RE-WRITTEN
	
	function battleNav_selection(selected)
	{
		var selectionDelay;
		
		var unselected0;
		var unselected1;
		
		battleNav_control(false);
		
		$("#info-cloud").css("opacity", "0");
		
		if(selected === "battle-stone")
		{
			BATTLE_NAV.player_1.selection = "stone";
		}
		
		if(selected === "battle-paper")
		{
			BATTLE_NAV.player_1.selection = "paper";
		}
		
		if(selected === "battle-scissors")
		{
			BATTLE_NAV.player_1.selection = "scissors";
		}
		
		$("#" + selected + " .battleNavShock").css("opacity", 1);
		$("#" + selected + " div[class*='battleNavSprite-']").addClass("tween-battle-selected");
		
		
		for(var optionItem in BATTLE_NAV.options)
		{
			if($(BATTLE_NAV.options[optionItem].source)[0].id !== selected)
			{
				$("#" + BATTLE_NAV.options[optionItem].source[0].id).css("opacity", 0.2);
			}
		}
		
		battleUserInfo_textEngine("PLAYER1", true);
		
		// LOGIC
		battleNav_logicRequest();
		
		selectionDelay = new AnimationTimer();
		
		timerList_add(selectionDelay);
		selectionDelay.time(1, battleNav_removeSelection);
	}
	
	function battleNav_logicRequest()
	{
		// BATTLE_NAV.game.result = battleEngine.battle(MAP_PLAYER, ROM.enemy.character, false);
		
		BATTLE_NAV.game.result = "LOSE";
			
		battleNav_logicDisplay();
	}
	
	function battleNav_logicDisplay()
	{
		switch(BATTLE_NAV.game.result)
		{
			case "WIN":
			{
				if(BATTLE_NAV.player_1.selection === "stone")
				{
					BATTLE_NAV.player_2.selection = "scissors";
				}
				
				if(BATTLE_NAV.player_1.selection === "paper")
				{
					BATTLE_NAV.player_2.selection = "stone";
				}
				
				if(BATTLE_NAV.player_1.selection === "scissors")
				{
					BATTLE_NAV.player_2.selection = "paper";
				}
								
				break;
			}
			
			case "DRAW":
			{
				BATTLE_NAV.player_2.selection = BATTLE_NAV.player_1.selection;
				
				break;
			}
			
			case "LOSE":
			{
				if(BATTLE_NAV.player_1.selection === "stone")
				{
					BATTLE_NAV.player_2.selection = "paper";
				}
				
				if(BATTLE_NAV.player_1.selection === "paper")
				{
					BATTLE_NAV.player_2.selection = "scissors";
				}
				
				if(BATTLE_NAV.player_1.selection === "scissors")
				{
					BATTLE_NAV.player_2.selection = "stone";
				}
				
				break;
			}
		}
	}
	
	function battleNav_removeSelection()
	{
		$("." + BATTLE_NAV.settings.options_tween)[0].addEventListener("webkitTransitionEnd", battleNav_removeSelectionEnd, false);
		$("." + BATTLE_NAV.settings.options_tween)[0].addEventListener("transitionend", battleNav_removeSelectionEnd, false);
		
		$("#player1 .map-goat-head").removeClass("mapPlayer_head_fear").addClass("mapPlayer_head_default");
		$("#player2 .map-enemy_40x40-head").removeClass("map-enemy_40x40_head_fear").addClass("map-enemy_40x40_head_default");
		
		
		$("#battle-nav").removeClass(BATTLE_NAV.settings.options_show).addClass(BATTLE_NAV.settings.options_hide);
		
		battleUserInfo_textEngine("CLEAR", true);		
	}
	
	function battleNav_removeSelectionEnd(event)
	{
		$("." + BATTLE_NAV.settings.options_tween)[0].removeEventListener("webkitTransitionEnd", battleNav_removeSelectionEnd, false);
		$("." + BATTLE_NAV.settings.options_tween)[0].removeEventListener("transitionend", battleNav_removeSelectionEnd, false);
		
		if(BATTLE_NAV.html.navBattle == 0)
		{
			battleNav_populate();
		}
		
		else
		{
			$("#battle-nav-fight").html(BATTLE_NAV.html.navBattle);
			
			battleNav_speechBubbles();		
		}
	}
	
	function battleNav_populate()
	{
		$("#battle-nav").html("");
		
		$("#battle-nav-fight").addClass("tween-battle-nav-fight");
		
		BATTLE_NAV.html.navBattle = $("#battle-nav-fight").html();
		
		// HEADS
		$("#battleNav-player1 .battleNav-player-head").addClass("battleNav-player-head-" + BATTLE_NAV.player_1.headType);
		$("#battleNav-player2 .battleNav-player-head").addClass("battleNav-player-head-" + BATTLE_NAV.player_2.headType);
		
		// SPEECH
		$("#battleNav-player1 .battleNav-player-choice").addClass("battleNav-player-choice-" + BATTLE_NAV.player_1.selection.toUpperCase());
		$("#battleNav-player2 .battleNav-player-choice").addClass("battleNav-player-choice-" + BATTLE_NAV.player_2.selection.toUpperCase());		
		
		battleNav_speechBubbles();
	}
	
	function battleNav_speechBubbles()
	{
		battleNav_showBattle();
	}
	
	function battleNav_showBattle()
	{
		$("#battle-nav-fight").css(BATTLE_NAV.settings.y_show);
		
		$(".tween-battle-nav-fight")[0].addEventListener("webkitTransitionEnd", battleNav_showBattleInPlace, false);
		$(".tween-battle-nav-fight")[0].addEventListener("transitionend", battleNav_showBattleInPlace, false);		
	}
	
	function battleNav_showBattleInPlace(event)
	{
		var intoCountDownDelay;
		
		$(".tween-battle-nav-fight")[0].removeEventListener("webkitTransitionEnd", battleNav_showBattleInPlace, false);
		$(".tween-battle-nav-fight")[0].removeEventListener("transitionend", battleNav_showBattleInPlace, false);
		
		battleNav_startBattleCountDown();
	}
	
	function battleMini_punchPositionInit()
	{
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("webkitTransitionEnd", battleMini_punchPositionScream, false);
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("transitionend", battleMini_punchPositionScream, false);
		
		$(".battleNav-player-head-main").addClass("tween-battleNav-smash");
		
		$(".battleNav-player-body").addClass("tween-battleNav-smash");
		
		$(".battleNav-player-legs").addClass("tween-battleNav-smash");
		
		$(".battleNav-player-shockSprite").addClass("tween-battleNav-player-shockSprite");		
		
		$(".battleNav-player-inner").addClass("battleNav-player-ThreatPos");
	}
	
	function battleMini_punchPositionScream(event)
	{
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("webkitTransitionEnd", battleMini_punchPositionScream, false);
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("transitionend", battleMini_punchPositionScream, false);		
		
		$(".battleNav-player-hands").addClass("tween-battleNav-player-handsSuper");
			
		$(".battleNav-player-head").addClass("tween-battleNav-player-headWeak");
			
		$(".battleNav-player-hands").addClass("tween-battleNav-player-handsWeak");
			
		$(".battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-normal").addClass("battleNav-player-eyesSprite-sad");
			
		$(".battleNav-player-head-main").addClass("battleNav-smash-head");
			
		$(".battleNav-player-body").addClass("battleNav-smash-body");
			
		$(".battleNav-player-shockSprite").css("visibility", "visible");
				
		BATTLE_NAV.animation.playheadDelay.time(0.5, battleMini_punchPositionScreamEnd);
	}
	
	function battleMini_punchPositionScreamEnd()
	{
		$("#battleNav-player1 .battleNav-player-body")[0].addEventListener("webkitTransitionEnd", battleMini_punchPositionReturn, false);
		$("#battleNav-player1 .battleNav-player-body")[0].addEventListener("transitionEnd", battleMini_punchPositionReturn, false);
		
		battleUserInfo_textEngine("CLEAR", true);
		
		$(".battleNav-player-hands").removeClass("tween-battleNav-player-handsSuper");
			
		$(".battleNav-player-head").removeClass("tween-battleNav-player-headWeak");
			
		$(".battleNav-player-hands").removeClass("tween-battleNav-player-handsWeak");
			
		$(".battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-sad").addClass("battleNav-player-eyesSprite-normal");
			
		$(".battleNav-player-head-main").removeClass("battleNav-smash-head");
			
		$(".battleNav-player-body").removeClass("battleNav-smash-body");
			
		$(".battleNav-player-shockSprite").css("visibility", "hidden");		
	}
	
	function battleMini_punchPositionReturn(event)
	{
		$("#battleNav-player1 .battleNav-player-body")[0].removeEventListener("webkitTransitionEnd", battleMini_punchPositionReturn, false);
		$("#battleNav-player1 .battleNav-player-body")[0].removeEventListener("transitionEnd", battleMini_punchPositionReturn, false);
		
		$(".battleNav-player-head-main").removeClass("tween-battleNav-smash");
		
		$(".battleNav-player-body").removeClass("tween-battleNav-smash");
		
		$(".battleNav-player-legs").removeClass("tween-battleNav-smash");
		
		$(".battleNav-player-shockSprite").removeClass("tween-battleNav-player-shockSprite");
		
		
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("webkitTransitionEnd", battleMini_punchPositionEnd, false);
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("transitionend", battleMini_punchPositionEnd, false);
		
		$(".battleNav-player-inner").addClass("battleNav-player-StartPos");
	}
	
	function battleMini_punchPositionEnd(event)
	{
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("webkitTransitionEnd", battleMini_punchPositionEnd, false);
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("transitionend", battleMini_punchPositionEnd, false);
		
		battleMini_punchAttackControl("BEGIN");		
	}
	
	function battleMini_punchAttackControl(playhead)
	{
		switch(BATTLE_NAV.animation.sequenceFlow)
		{
			case "START_PLAYER1":
			{
				if(playhead === "BEGIN")
				{
					BATTLE_NAV.animation.firstPunch = true;
					
					battleMini_punchAttackSet(1);
					
					$("#player1 .map-goat-head").removeClass("mapPlayer_head_default").addClass("mapPlayer_head_happy");
					$("#player2 .map-enemy_40x40-head").removeClass("map-enemy_40x40_head_default").addClass("map-enemy_40x40_head_fear");
				}
				
				if(playhead === "FINISH")
				{
					BATTLE_NAV.animation.sequenceFlow = "START_PLAYER2";
					
					battleMini_punchAttackControl("BEGIN");
					
					$("#player1 .map-goat-head").removeClass("mapPlayer_head_happy").addClass("mapPlayer_head_default");
					$("#player2 .map-enemy_40x40-head").removeClass("map-enemy_40x40_head_fear").addClass("map-enemy_40x40_head_default");
				}
				
				break;
			}
			
			case "START_PLAYER2":
			{
				if(playhead === "BEGIN")
				{
					BATTLE_NAV.animation.firstPunch = true;
					
					battleMini_punchAttackSet(2);
					
					$("#player1 .map-goat-head").removeClass("mapPlayer_head_default").addClass("mapPlayer_head_fear");
					$("#player2 .map-enemy_40x40-head").removeClass("map-enemy_40x40_head_default").addClass("map-enemy_40x40_head_happy");
				}
				
				if(playhead === "FINISH")
				{
					// 1 X FIGHT ROUND
					
					BATTLE_NAV.animation.sequenceFlow = "OPTIONS";
					
					battleMini_punchAttackControl("BEGIN");	
					
					$("#player1 .map-goat-head").removeClass("mapPlayer_head_fear").addClass("mapPlayer_head_default");
					$("#player2 .map-enemy_40x40-head").removeClass("map-enemy_40x40_head_happy").addClass("map-enemy_40x40_head_default");					
				}
				
				break;				
			}
			
			case "OPTIONS":
			{
				if(playhead === "BEGIN")
				{
					$(".battleNav-player-speech").removeClass("battleNav-player-speech-hide").addClass("battleNav-player-speech-show");
					
					battleUserInfo_fightText_sequence();
				}
				
				if(playhead === "FINISH")
				{
					BATTLE_NAV.animation.sequenceFlow = "FINISH_THEM";
					
					battleMini_punchAttackControl("BEGIN");
				}
				
				break;
			}
			
			case "FINISH_THEM":
			{
				if(playhead === "BEGIN")
				{
					if(BATTLE_NAV.game.result === "WIN")
					{
						BATTLE_NAV.animation.resultRound = true;
						
						battleMini_punchAttackSet(1);
						
						$("#player1 .map-goat-head").removeClass("mapPlayer_head_default").addClass("mapPlayer_head_happy");
						$("#player2 .map-enemy_40x40-head").removeClass("map-enemy_40x40_head_default").addClass("map-enemy_40x40_head_dead");
					}
					
					if(BATTLE_NAV.game.result === "LOSE")
					{
						BATTLE_NAV.animation.resultRound = true;
						
						battleMini_punchAttackSet(2);
						
						$("#player1 .map-goat-head").removeClass("mapPlayer_head_default").addClass("mapPlayer_head_dead");
						$("#player2 .map-enemy_40x40-head").removeClass("map-enemy_40x40_head_default").addClass("map-enemy_40x40_head_happy");
					}
					
					if(BATTLE_NAV.game.result === "DRAW")
					{
						$(".battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-normal").addClass("battleNav-player-eyesSprite-sad");
						
						$(".battleNav-player-choice-eyes").removeClass("battleNav-player-choice-eyes-normal").addClass("battleNav-player-choice-eyes-sad");
						
						BATTLE_NAV.animation.playheadDelay.time(0.5, battleMini_punchAttackControl, "FINISH");
					}
				}
				
				if(playhead === "FINISH")
				{
					$(".battleNav-player-inner").removeClass("battleNav-player-StartPos");
					
					if(BATTLE_NAV.game.result === "DRAW")
					{
						// ANOTHER ROUND
						
						$(".battleNav-player-speech").removeClass("battleNav-player-speech-show").addClass("battleNav-player-speech-hide");
						
						$(".battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-sad").addClass("battleNav-player-eyesSprite-normal");
						
						$(".battleNav-player-choice-eyes").removeClass("battleNav-player-choice-eyes-sad").addClass("battleNav-player-choice-eyes-normal");
						
						BATTLE_NAV.animation.sequenceFlow = "ANOTHER_ROUND";
						
						BATTLE_NAV.animation.playheadDelay.time(0.5, battleMini_punchAttackControl);
					}
					
					else
					{
						// END SCREEN
						
						$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("webkitTransitionEnd", battleMini_punchAttackFightOver, false);
						$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("transitionend", battleMini_punchAttackFightOver, false);
					}
				}
				
				break;
			}
			
			case "ANOTHER_ROUND":
			{
				battleNav_battleResultsEnd();
				
				break;
			}
		}
	}
	
	function battleMini_punchAttackSet(attackerReq)
	{
		if(attackerReq === 1)
		{
			BATTLE_NAV.animation.punch_id_attack = "battleNav-player1";
			BATTLE_NAV.animation.punch_id_victim = "battleNav-player2";			
		}
		
		if(attackerReq === 2)
		{
			BATTLE_NAV.animation.punch_id_attack = "battleNav-player2";
			BATTLE_NAV.animation.punch_id_victim = "battleNav-player1";			
		}
		
		battleMini_punchAttackApply();			
	}
	
	function battleMini_punchAttackApply()
	{
		// ATTACKER
		
		$("#" + BATTLE_NAV.animation.punch_id_attack).addClass("battleNav-superPunchAttacker");
		
		$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-player-eyes").addClass("battleNav-player-eyes-lookF");
		
		$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-player-hands").removeClass("tween-battleNav-player-hands");
		
		// VICTIM
		
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head").removeClass("tween-battleNav-player-head");
		
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-hands").removeClass("tween-battleNav-player-hands");
		
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head-main").addClass("tween-battleNav-smash");
		
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body").addClass("tween-battleNav-smash");
		
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-legs").addClass("tween-battleNav-smash");
		
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-shockSprite").addClass("tween-battleNav-player-shockSprite");
		
		if(BATTLE_NAV.animation.resultRound)
		{
			$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-player-speech").removeClass("battleNav-player-speech-show").addClass("battleNav-player-speech-hide");
			
			if(BATTLE_NAV.game.result === "WIN")
			{
				$(".microBattle_darkness_crowd_main_40x40 .map-goat-head").addClass("mapPlayer_head_happy");				
			}
			
			if(BATTLE_NAV.game.result === "LOSE")
			{
				$(".microBattle_darkness_crowd_main_40x40 .map-enemy_40x40-head").addClass("map-enemy_40x40_head_happy");	
			}
		}

		for(var i = 0; i < BATTLE_NAV.animation.punchTotal; i++)
		{
			battleMini_punchAttackAdd(i, battleMini_createDelay(i * 0.2));
		}
	}
	
	function battleMini_createDelay(val)
	{
		var animationDelay = 	{
									"-webkit-transition-delay" 	: val + "s",
									"transition-delay" 			: val + "s"
								};
								
		return animationDelay;
	}


	function battleMini_punchAttackAdd(num, css)
	{
		var exitFrame;
		
		$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-superPunch").append(BATTLE_NAV.animation.html.superPunch);
		
		$("#" + BATTLE_NAV.animation.punch_id_attack + " ._PUNCH").addClass("SUPER-PUNCH" + num);
		$("#" + BATTLE_NAV.animation.punch_id_attack + " ." + "SUPER-PUNCH" + num).removeClass("_PUNCH");
		
		$("#" + BATTLE_NAV.animation.punch_id_attack + " ." + "SUPER-PUNCH" + num).attr("data-punchCount", num);
		
		
		$("#" + BATTLE_NAV.animation.punch_id_attack + " ." + "SUPER-PUNCH" + num).css(css);
		
		if(num === BATTLE_NAV.animation.punchTotal - 1)
		{
			$("#" + BATTLE_NAV.animation.punch_id_attack + " ." + "SUPER-PUNCH" + num).addClass("KILLER-PUNCH");
		}
	
		exitFrame = setTimeout(battleMini_punchAttackFire, 20, $("#" + BATTLE_NAV.animation.punch_id_attack + " ." + "SUPER-PUNCH" + num));
	}

	
	function battleMini_punchAttackFire(div)
	{
		$(div)[0].addEventListener("webkitTransitionEnd", battleMini_punchAttackFireEnd, false);
		$(div)[0].addEventListener("transitionend", battleMini_punchAttackFireEnd, false);
		
		$(div).addClass("battleNav-superPunchAttack");
	}
	
	function battleMini_punchAttackFireEnd(event)
	{
		var _classList = event.target.classList.toString();
		var removeBlow;
		var lastPunchFired = false;
		
		if(event.propertyName !== "opacity")
		{
			$(event.target)[0].removeEventListener("webkitTransitionEnd", battleMini_punchAttackFireEnd, false);
			$(event.target)[0].removeEventListener("transitionend", battleMini_punchAttackFireEnd, false);
			
			
			// REMOVES START PUNCH DELAY IN CSS
			$(event.target).removeAttr("style");
			
			
			if(BATTLE_NAV.animation.firstPunch)
			{
				BATTLE_NAV.animation.firstPunch = false;
				
				if(BATTLE_NAV.animation.punch_id_attack === "battleNav-player1")
				{
					battleUserInfo_textEngine("PUNCH_PLAYER1", true);	
				}
				
				if(BATTLE_NAV.animation.punch_id_attack === "battleNav-player2")
				{
					battleUserInfo_textEngine("PUNCH_PLAYER2", true);	
				}
			}
			
			
			if(!BATTLE_NAV.animation.smashed)
			{
				BATTLE_NAV.animation.smashed = true;
				
				$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-player-hands").addClass("tween-battleNav-player-handsSuper");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head").addClass("tween-battleNav-player-headWeak");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-hands").addClass("tween-battleNav-player-handsWeak");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-normal").addClass("battleNav-player-eyesSprite-sad");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head-main").addClass("battleNav-smash-head");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body").addClass("battleNav-smash-body");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-shockSprite").css("visibility", "visible");
				
				if(BATTLE_NAV.animation.resultRound)
				{
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-choice-eyes").removeClass("battleNav-player-choice-eyes-normal").addClass("battleNav-player-choice-eyes-sad");	
				}			
			}
			
			if(parseInt($(event.target).attr("data-punchCount")) === BATTLE_NAV.animation.punchTotal - 1)
			{
				lastPunchFired = true;
			}
			
			if(lastPunchFired)
			{
				$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-player-hands").removeClass("tween-battleNav-player-handsSuper");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-hands").removeClass("tween-battleNav-player-handsWeak");
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head").removeClass("tween-battleNav-player-headWeak");
				
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-shockSprite").removeClass("tween-battleNav-player-shockSprite");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-shock").addClass("tween-battleNav-player-shock");
				
				if(BATTLE_NAV.animation.punch_id_attack === "battleNav-player1")
				{
					battleUserInfo_textEngine("PUNCH_PLAYER1_HOLD", true);
				}	
				
				if(BATTLE_NAV.animation.punch_id_attack === "battleNav-player2")
				{
					battleUserInfo_textEngine("PUNCH_PLAYER2_HOLD", true);
				}	
				
				if(BATTLE_NAV.animation.resultRound)
				{
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-sad").addClass("battleNav-player-eyesSprite-happy");
					
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head-main").addClass("battleNav-smash-head-KILLER");
					
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body").addClass("battleNav-smash-body-KILLER");
					
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-legs").addClass("battleNav-smash-legs-KILLER");
					
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-choice-eyes").removeClass("battleNav-player-choice-eyes-sad").addClass("battleNav-player-choice-eyes-happy");
					
					// removeBlow = setTimeout(battleMini_puchAttackReturn, 900, event);
				
					BATTLE_NAV.animation.playheadDelay.time(0.8, battleMini_puchAttackReturn, event);
				}
				
				else
				{
					BATTLE_NAV.animation.playheadDelay.time(0.4, battleMini_puchAttackReturn, event);
				}
			}
	
			else
			{
				battleMini_puchAttackReturn(event);
			}

		}

	}
	
	// FAULTY WITH PASSING THE EVENT
	
	function battleMini_puchAttackReturn(event)
	{
		$(event.target)[0].addEventListener("webkitTransitionEnd", battleMini_punchAttackComplete, false);
		$(event.target)[0].addEventListener("transitionend", battleMini_punchAttackComplete, false);
				
		$(event.target).removeClass("battleNav-superPunchAttack").addClass("battleNav-superPunchReturn");		
	}
	
	function battleMini_punchAttackComplete(event)
	{
		var lastPunchComplete = false;
		
		if(event.propertyName !== "opacity")
		{
			$(event.target)[0].removeEventListener("webkitTransitionEnd", battleMini_punchAttackComplete, false);
			$(event.target)[0].removeEventListener("transitionend", battleMini_punchAttackComplete, false);
			
			if(parseInt($(event.target).attr("data-punchCount")) === BATTLE_NAV.animation.punchTotal - 1)
			{
				lastPunchComplete = true;
			}
			
			$(event.target).remove();
			
			if(lastPunchComplete)
			{
				// CHROME FIX
				if($("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-superPunch div").length > 0)
				{
					$(".battleNav-superPunchSprite").remove();
				}
				
				if(!BATTLE_NAV.animation.resultRound)
				{
					if(BATTLE_NAV.animation.punch_id_attack === "battleNav-player1")
					{
						battleUserInfo_textEngine("PUNCH_PLAYER1_CLEAR", true);
					}
					
					if(BATTLE_NAV.animation.punch_id_attack === "battleNav-player2")
					{
						battleUserInfo_textEngine("PUNCH_PLAYER2_CLEAR", true);	
					}
				}
			
				
				$("#" + BATTLE_NAV.animation.punch_id_attack).removeClass("battleNav-superPunchAttacker");
				
				$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-player-eyes").removeClass("battleNav-player-eyes-lookF");
				
				$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-player-hands").addClass("tween-battleNav-player-hands");
			
				if(BATTLE_NAV.animation.smashed)
				{
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body")[0].addEventListener("webkitTransitionEnd", battleMini_punchAttackPurge, false);
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body")[0].addEventListener("transitionend", battleMini_punchAttackPurge, false);
					
					if(BATTLE_NAV.animation.resultRound)
					{
						$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-normal").addClass("battleNav-player-eyesSprite-happy");
						
						$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-happy").addClass("battleNav-player-eyesSprite-sad");
					
						$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head-main").removeClass("battleNav-smash-head-KILLER");
						
						$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body").removeClass("battleNav-smash-body-KILLER");
						
						$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-legs").removeClass("battleNav-smash-legs-KILLER");
						
						$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-speech").removeClass("battleNav-player-speech-show").addClass("battleNav-player-speech-hide");
					}
					
					else
					{
						$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-sad").addClass("battleNav-player-eyesSprite-normal");
					}
					
					
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head").addClass("tween-battleNav-player-head");
					
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-hands").addClass("tween-battleNav-player-hands");
					
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head-main").removeClass("battleNav-smash-head");
					
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body").removeClass("battleNav-smash-body");
					
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-shockSprite").css("visibility", "hidden");
					
					$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-shock").removeClass("tween-battleNav-player-shock");	
					
					
					BATTLE_NAV.animation.smashed = false;
				}
			}
		}
	}
	
	function battleMini_punchAttackPurge(event)
	{
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body")[0].removeEventListener("webkitTransitionEnd", battleMini_punchAttackPurge, false);
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body")[0].removeEventListener("transitionend", battleMini_punchAttackPurge, false);
		
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head-main").removeClass("tween-battleNav-smash");
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body").removeClass("tween-battleNav-smash");
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-legs").removeClass("tween-battleNav-smash");		
	
		battleMini_punchAttackReplay();
	}
	
	function battleMini_punchAttackReplay()
	{
		BATTLE_NAV.animation.playheadDelay.time(0.4, battleMini_punchAttackControl, "FINISH");
	}
	
	function battleMini_punchAttackFightOver(event)
	{
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("webkitTransitionEnd", battleMini_punchAttackFightOver, false);
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("transitionend", battleMini_punchAttackFightOver, false);
						
		battleNav_battleResultsEnd();		
	}
	
	/////// MERGE
	
	function battleNav_startBattleCountDown()
	{
		battleUserInfo_textEngine("PRE_FIGHT", true);
		
		$("#battle-nav-playerBird .battleCute-bird-board").addClass("tween-battleCute-bird-countDown");
		
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].addEventListener("webkitAnimationEnd", battleNav_startBattleCountDownSequence, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].addEventListener("animationend", battleNav_startBattleCountDownSequence, false);		
	}
	
	function battleNav_startBattleCountDownSequence(event)
	{
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].removeEventListener("webkitAnimationEnd", battleNav_startBattleCountDownSequence, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].removeEventListener("animationend", battleNav_startBattleCountDownSequence, false);
	 	
	 	battleUserInfo_textEngine("FIGHT", true);
	 	
	 	$("#battle-nav-playerBird .battleCute-bird-arm-inner").addClass("tween-battleCute-bird-arm-main-fire");
	 			
	 	$("#battle-nav-playerBird .battleCute-bird-eyes-sprite").removeClass("battleCute-bird-eyes-norm").addClass("battleCute-bird-eyes-happy");
	 	
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main").addClass("tween-battleCute-bird-arm-main-intoFly");
	 			
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].addEventListener("webkitAnimationEnd", battleNav_clearStageForFightInit, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].addEventListener("animationend", battleNav_clearStageForFightInit, false);
	}
	
	function battleNav_clearStageForFightInit(event)
	{
	 	var clearStage;
	 	
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].removeEventListener("webkitAnimationEnd", battleNav_clearStageForFightInit, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].removeEventListener("animationend", battleNav_clearStageForFightInit, false);
	 	
	 	clearStage = new AnimationTimer();
	 	timerList_add(clearStage);
	 	clearStage.time(1, battleNav_clearStageForFight);	
	}
	
	function battleNav_clearStageForFight()
	{
		$("#battle-nav-playerBird .battleCute-bird-arm-main").removeClass("tween-battleCute-bird-arm-main-intoFly").addClass("tween-battleCute-bird-arm-main");
	 			
	 	$("#battle-nav-playerBird").addClass("tween-bird-flapAway");	
	
	 	$("#battle-nav-playerBird")[0].addEventListener("webkitAnimationEnd", battleNav_clearedStage, false);
	 	$("#battle-nav-playerBird")[0].addEventListener("animationend", battleNav_clearedStage, false);		
	}
	
	function battleNav_clearedStage(event)
	{
		var winLoseDisplay;
	 	
	 	$("#battle-nav-playerBird")[0].removeEventListener("webkitAnimationEnd", battleNav_clearedStage, false);
	 	$("#battle-nav-playerBird")[0].removeEventListener("animationend", battleNav_clearedStage, false);
		
		battleMini_punchPositionInit();
		
		$("#battle-nav-playerBird").remove();		
	}
	
	function battleNav_battleResultsEnd()
	{
		var exitFrame;
		
		if(BATTLE_NAV.game.result === "WIN" || BATTLE_NAV.game.result === "LOSE")
		{
			exitFrame = new AnimationTimer();
			timerList_add(exitFrame);
			exitFrame.time(0.02, battleNav_battleOver);
		}
		
		else
		{
			$("#battle-nav-fight").css(BATTLE_NAV.settings.y_hide);
			
			// battleUserInfo_textEngine("CLEAR", true);
			
			battleUserInfo_textEngine("SHAKE_CLEAR", true);
			
			$(".tween-battle-nav-fight")[0].addEventListener("webkitTransitionEnd", battleNav_anotherRound, false);
			$(".tween-battle-nav-fight")[0].addEventListener("transitionend", battleNav_anotherRound, false);			
		}		
	}
	
	function battleNav_anotherRound(event)
	{
		var exitFrame;
		
		$(".tween-battle-nav-fight")[0].removeEventListener("webkitTransitionEnd", battleNav_anotherRound, false);
		$(".tween-battle-nav-fight")[0].removeEventListener("transitionend", battleNav_anotherRound, false);
		
		trace("ANOTHER-ROUND --- function2()");
		
		$("#battle-nav-fight").html("");
		
		$("#battle-nav").html(BATTLE_NAV.html.navOptions);
		
		BATTLE_NAV.animation.resultRound = false;
		
		BATTLE_NAV.animation.sequenceFlow = "START_PLAYER1";
		
		battleNav_getValues();
		
		exitFrame = setTimeout(fromHereToSafety, 250);
	}
	
	function fromHereToSafety()
	{
		$("#info-cloud p").text(BATTLE_NAV.navText.txt_AGAIN.toUpperCase());
		
		$("#battle-nav").removeClass("battle-nav-hide").addClass("battle-nav-show");
		
		battleUserInfo_textEngine("ANOTHER", true);
		
		$(".tween-battle-nav")[0].addEventListener("webkitTransitionEnd", battleNav_anotherRoundInPlace, false);
		$(".tween-battle-nav")[0].addEventListener("transitionend", battleNav_anotherRoundInPlace, false);		
	}
	
	function battleNav_anotherRoundInPlace(event)
	{
		$(".tween-battle-nav")[0].removeEventListener("webkitTransitionEnd", battleNav_anotherRoundInPlace, false);
		$(".tween-battle-nav")[0].removeEventListener("transitionend", battleNav_anotherRoundInPlace, false);
		
		$("#info-cloud").css("opacity", "1");
		
		battleNav_control(true);			
	}
	
	function battleNav_battleOver()
	{
		$("#microBattle_resultWipe_wrapper").html(theBattle.html.wipeWrapper);
		
		battleEnd_setup();
		
		if(spaceSquidsUse)
		{
			// spaceSquids_animationReturn();	
		}
	
		battleNav_hide();		
	}
	
	function battleNav_hide()
	{
		$(".tween-battle-cloud")[0].addEventListener("webkitTransitionEnd", battleNav_outView, false);
		$(".tween-battle-cloud")[0].addEventListener("transitionend", battleNav_outView, false);
				
		$("#battle-cloud").css(BATTLE_NAV.settings.y_hide);		
	
		$("#microBattle_darkness").css("opacity", "0");
	}
	
	function battleNav_outView(event)
	{
		var css;
	
		$(".tween-battle-cloud")[0].removeEventListener("webkitTransitionEnd", battleNav_outView, false);
		$(".tween-battle-cloud")[0].removeEventListener("transitionend", battleNav_outView, false);
		
		
		$(".tween-microBattle_resultWipe_content")[0].addEventListener("webkitTransitionEnd", battleNav_memorySave, false);
		$(".tween-microBattle_resultWipe_content")[0].addEventListener("transitionend", battleNav_memorySave, false);
		
		css = 	{
					"-webkit-transform" : "translateY(0%)",
					"transform" 		: "translateY(0%)"
				};
		
		$("#microBattle_resultWipe_content").css(css);
	}


	function battleNav_memorySave(event)
	{
		var css;
		
		$(".tween-microBattle_resultWipe_content")[0].removeEventListener("webkitTransitionEnd", battleNav_memorySave, false);
		$(".tween-microBattle_resultWipe_content")[0].removeEventListener("transitionend", battleNav_memorySave, false);
		
		$("#microBattle_nav_wrapper").html("");
		$("#microBattle_fade_wrapper").html("");
		
		battleUserInfo_crowdPurge();		
	
		battleEnd_fadeIn();
	}
	
	///////////////////////////////// --- BATTLE_NAV */
	
	
	
	
	///////////////////////////////// --- KEYBOARD_BATTLE_NAV */
	
	function keyboardBattleNav_init()
	{
		keyboardBattleNav = {};
		
		keyboardBattleNav.countTap = "DEFAULT";
		
		keyboardBattleNav.signal = {};
		
		keyboardBattleNav.signal.signal0 = BATTLE_NAV.options.stone;
		keyboardBattleNav.signal.signal1 = BATTLE_NAV.options.paper;
		keyboardBattleNav.signal.signal2 = BATTLE_NAV.options.scissors;
		
		keyboardBattleNav.currentFocus = "";
		
		keyboardBattleNav.css = {};
		
		keyboardBattleNav.css.def	= 	{
											"-webkit-transform"	: "scale(1)",
											"transform" 		: "scale(1)"			
										};
										
		keyboardBattleNav.css.hit	= 	{
											"-webkit-transform"	: "scale(1.2)",
											"transform" 		: "scale(1.2)"			
										};
		
		
		keyboardBattleNav.listening = true;
		
		$(window)[0].addEventListener("keyup", keyboardBattleNav_event, false);
	}
	
	function keyboardBattleNav_event(event)
	{
		// LEFT + DOWN
		if(event.keyCode == 37 || event.keyCode == 40)
		{
			if(keyboardBattleNav.countTap === "DEFAULT")
			{
				keyboardBattleNav.countTap = 0;
			}
			
			else
			{
				keyboardBattleNav.countTap --;
			}
			
			if(keyboardBattleNav.countTap < 0)
			{
				keyboardBattleNav.countTap = 2;
			}
			
			keyboardBattleNav_highLight();
		}
		
		// RIGHT + UP
		if(event.keyCode == 39 || event.keyCode == 38)
		{
			if(keyboardBattleNav.countTap === "DEFAULT")
			{
				keyboardBattleNav.countTap = 0;
			}
			
			else
			{
				keyboardBattleNav.countTap ++;
			}
			
			if(keyboardBattleNav.countTap > 2)
			{
				keyboardBattleNav.countTap = 0;
			}
			
			keyboardBattleNav_highLight();			
		}
		
		if(event.keyCode == 13 || event.keyCode == 32)
		{
			if(keyboardBattleNav.countTap !== "DEFAULT")
			{
				keyboardBattleNav_select();
			}
		}
	}

	function keyboardBattleNav_highLight()
	{
		var keyboardSelect;
		
		var keyboardRevert;
		
		for(var optionItem in BATTLE_NAV.options)
		{
			if(keyboardBattleNav.countTap === BATTLE_NAV.options[optionItem].index)
			{
				keyboardSelect = BATTLE_NAV.options[optionItem];
			}
			
			if(keyboardBattleNav.currentFocus)
			{
				if(keyboardBattleNav.currentFocus === BATTLE_NAV.options[optionItem].source[0].id)
				{
					keyboardRevert = BATTLE_NAV.options[optionItem];
				}				
			}
		}
		
		if(!keyboardBattleNav.currentFocus)
		{
			keyboardSelect.scaled = true;
			
			$("#" + keyboardSelect.source[0].id).css(keyboardBattleNav.css.hit);
		
			keyboardBattleNav.currentFocus = keyboardSelect.source[0].id;
		}
		
		else
		{
			$("#" + keyboardSelect.source[0].id).css(keyboardBattleNav.css.hit);
			
			keyboardSelect.scaled = true;
			
			if(keyboardRevert)
			{
				$("#" + keyboardRevert.source[0].id).css(keyboardBattleNav.css.def);	
				
				keyboardRevert.scaled = false;
			}
			
			keyboardBattleNav.currentFocus = keyboardSelect.source[0].id;
		}
	}

	
	function keyboardBattleNav_select()
	{
		keyboardBattleNav_off();
		
		$("#" + keyboardBattleNav.currentFocus).css(keyboardBattleNav.css.def);
		
		battleNav_selection(keyboardBattleNav.currentFocus);		
	}
	
	function keyboardBattleNav_off()
	{
		if(keyboardBattleNav.listening)
		{
			keyboardBattleNav.listening = false;
			$(window)[0].removeEventListener("keyup", keyboardBattleNav_event, false);
		}		
	}		
	
	///////////////////////////////// --- KEYBOARD_BATTLE_NAV */	
	
	
	
	
	///////////////////////////////// --- BATTLE_USER_INFO */
	
	function battleUserInfo_randomPunch(playerType)
	{
		var batmanPunch;
		
		var punchLength = Logic.dat_ROM["_LOGIC"]["punches"][playerType]["punchList"].length;
		
		var punchSelect = Math.floor(Math.random() * punchLength);
		
		batmanPunch = Logic.dat_ROM["_LOGIC"]["punches"][playerType]["punchList"][punchSelect];
		
		return batmanPunch;
	}
	
	
	function battleUserInfo_textEngine(messageID, useFX)
	{
		if(messageID === "START")
		{
			$("#microBattle_darkness").css("visibility", "visible");	
			$("#microBattle_darkness").css("opacity", "1");
		}
		
		if(messageID === "RESULT")
		{
			if(BATTLE_NAV.game.result === "WIN")
			{
				battleUserInfo_crowdAdd("#player1");
			}
			
			if(BATTLE_NAV.game.result === "LOSE")
			{
				battleUserInfo_crowdAdd("#player2", "enemy_" + ROM.enemy.character.enemyType);
			}			
		}
		
		battleUserInfo_messaging(messageID, useFX);
	}
	
	
	function battleUserInfo_fightText_sequence()
	{
		var bui_fs_timer_vs = new AnimationTimer();
		var bui_fs_timer_p2 = new AnimationTimer();
		var bui_fs_timer_re = new AnimationTimer();
		var bui_fs_timer_fm = new AnimationTimer();
		
		timerList_add(bui_fs_timer_vs);
		timerList_add(bui_fs_timer_p2);
		timerList_add(bui_fs_timer_re);
		timerList_add(bui_fs_timer_fm);
		
		// battleUserInfo_textEngine("FIGHT_P1", true);
		
		battleUserInfo_messaging("FIGHT_P1", true);
		
		bui_fs_timer_vs.time(1, battleUserInfo_fightText_sequenceRun, "FIGHT_VS");
		bui_fs_timer_p2.time(2, battleUserInfo_fightText_sequenceRun, "FIGHT_P2");
		bui_fs_timer_re.time(3, battleUserInfo_fightText_sequenceRun, "RESULT");
		bui_fs_timer_fm.time(4, battleMini_punchAttackControl, "FINISH");
	}
	
	function battleUserInfo_fightText_sequenceRun(messageID)
	{
		if(messageID === "FIGHT_VS")
		{
			battleUserInfo_textEngine("FIGHT_VS", true);
		}
		
		if(messageID === "FIGHT_P2")
		{
			battleUserInfo_textEngine("FIGHT_P2", true);
		}
		
		if(messageID === "RESULT")
		{
			battleUserInfo_textEngine("RESULT", true);
		}
	}
	
	function battleUserInfo_messaging(flow_stage, lightning)
	{
		if(lightning)
		{
			$("#microBattle_darkness .microBattle_darkness_lightning").addClass("tween-microBattle_darkness_lightning");
			
			$(".tween-microBattle_darkness_lightning")[0].addEventListener("webkitAnimationEnd", battleUserInfo_cleanUp, false);
			$(".tween-microBattle_darkness_lightning")[0].addEventListener("animationend", battleUserInfo_cleanUp, false);			
		}
		
		switch(flow_stage)
		{
			case "START":
			{
				battleUserInfo_textEngineRun("", "microBattle_darkness_info_text_DRAW", BATTLE_NAV.fightText.txt_BEG.toUpperCase(), "", "tween-superPunchSpriteAmbient");
				
				break;
			}
			
			case "PLAYER1":
			{
				battleUserInfo_textEngineRun("microBattle_darkness_info_text_DRAW", "microBattle_darkness_info_text_WIN", BATTLE_NAV.player_1.selection.toUpperCase(), "", "tween-microBattle_darkness_mega");
				
				break;
			}
			
			case "PRE_FIGHT":
			{
				battleUserInfo_textEngineRun("microBattle_darkness_info_text_WIN", "microBattle_darkness_info_text_DRAW", BATTLE_NAV.fightText.txt_PRE.toUpperCase(), "", "tween-superPunchSpriteAmbient");
				
				break;
			}
			
			case "FIGHT":
			{
				battleUserInfo_textEngineRun("", "microBattle_darkness_info_text_DRAW", BATTLE_NAV.fightText.txt_BAT.toUpperCase(), "tween-superPunchSpriteAmbient", "tween-microBattle_darkness_mega");
			
				break;
			}
			
			case "PUNCH_PLAYER1":
			{
				battleUserInfo_textEngineRun("microBattle_darkness_info_text_DRAW", "microBattle_darkness_info_text_WIN", battleUserInfo_randomPunch("player1").toUpperCase(), "tween-microBattle_darkness_mega", "tween-microBattle_darkness_megaFranticR");
				
				break;
			}
			
			case "PUNCH_PLAYER1_HOLD":
			{
				battleUserInfo_textEngineRun("", "", battleUserInfo_randomPunch("player1").toUpperCase(), "tween-microBattle_darkness_megaFranticR", "tween-superPunchSpriteAmbient");
				
				break;
			}
			
			case "PUNCH_PLAYER1_CLEAR":
			{
				battleUserInfo_textEngineRun("", "", "", "tween-superPunchSpriteAmbient", "");
				
				break;
			}
			
			case "PUNCH_PLAYER2":
			{
				battleUserInfo_textEngineRun("microBattle_darkness_info_text_WIN", "microBattle_darkness_info_text_LOSE", battleUserInfo_randomPunch("player2").toUpperCase(), "tween-microBattle_darkness_megaFranticR", "tween-microBattle_darkness_megaFranticL");
				
				break;
			}
			
			case "PUNCH_PLAYER2_HOLD":
			{
				battleUserInfo_textEngineRun("", "", battleUserInfo_randomPunch("player2").toUpperCase(), "tween-microBattle_darkness_megaFranticL", "tween-superPunchSpriteAmbient");
				
				break;
			}
			
			case "PUNCH_PLAYER2_CLEAR":
			{
				battleUserInfo_textEngineRun("", "", "", "tween-superPunchSpriteAmbient", "");
				
				break;
			}
			
			case "FIGHT_P1":
			{
				battleUserInfo_textEngineRun("microBattle_darkness_info_text_LOSE", "microBattle_darkness_info_text_WIN", BATTLE_NAV.player_1.selection.toUpperCase(), "tween-microBattle_darkness_megaFranticL", "tween-microBattle_darkness_mega");
				
				break;
			}
			
			case "FIGHT_VS":
			{
				battleUserInfo_textEngineRun("microBattle_darkness_info_text_WIN", "microBattle_darkness_info_text_DRAW", "VS", "", "");
				
				break;
			}
			
			case "FIGHT_P2":
			{
				battleUserInfo_textEngineRun("microBattle_darkness_info_text_DRAW", "microBattle_darkness_info_text_LOSE", BATTLE_NAV.player_2.selection.toUpperCase(), "", "");
								
				break;
			}
			
			
			case "RESULT":
			{
				// battleUserInfo_textEngineRun("microBattle_darkness_info_text_LOSE", "microBattle_darkness_info_text_" + BATTLE_NAV.game.result, BATTLE_NAV.game.result, "", "");
				
				battleUserInfo_textEngineRun("microBattle_darkness_info_text_LOSE", "microBattle_darkness_info_text_" + BATTLE_NAV.game.result, BATTLE_NAV.game.result, "tween-microBattle_darkness_mega", "tween-superPunchSpriteAmbient");
				
				break;
			}
			
			case "SHAKE_CLEAR":
			{
				
				battleUserInfo_textEngineRun("", "", "", "tween-superPunchSpriteAmbient", "");
				
				break;
			}
			
			case "CLEAR":
			{
				battleUserInfo_textEngineRun("", "", "", "tween-microBattle_darkness_mega", "");
				
				break;
			}
			
			case "ANOTHER":
			{
				battleUserInfo_textEngineRun("microBattle_darkness_info_text_" + BATTLE_NAV.game.result, "microBattle_darkness_info_text_DRAW", BATTLE_NAV.fightText.txt_AGN.toUpperCase(), "", "tween-superPunchSpriteAmbient");
				
				break;
			}
		}
	}
	
	function battleUserInfo_textEngineRun(rem_class, add_class, new_text, rem_extra, add_extra) // REMOVE // ADD // TEXT // REMOVE PREV FX // ADD FX
	{
		$("#microBattle_darkness .microBattle_darkness_info_text").css("opacity", "0");
		$("#microBattle_darkness .microBattle_darkness_info_text").removeClass(rem_class);
		$("#microBattle_darkness .microBattle_darkness_info_text").addClass(add_class);
		$("#microBattle_darkness .microBattle_darkness_info_text").text(new_text);
		$("#microBattle_darkness .microBattle_darkness_info_text").css("opacity", "1");		
	
		if(rem_extra != null || rem_extra != undefined)
		{
			$("#microBattle_darkness .microBattle_darkness_info_text").removeClass(rem_extra);
		}

		if(add_extra != null || add_extra != undefined)
		{
			$("#microBattle_darkness .microBattle_darkness_info_text").addClass(add_extra);
		}
	}
	
	
	function battleUserInfo_cleanUp(event)
	{
		$(".tween-microBattle_darkness_lightning")[0].removeEventListener("webkitAnimationEnd", battleUserInfo_cleanUp, false);
		$(".tween-microBattle_darkness_lightning")[0].removeEventListener("animationend", battleUserInfo_cleanUp, false);
		
		$("#microBattle_darkness .microBattle_darkness_lightning").removeClass("tween-microBattle_darkness_lightning");
	}
	
	function battleUserInfo_crowdAdd(target, extra_class)
	{
		var crowd_sprite_holder = '<div id="crowd_sprite_holder" class="microBattle_darkness_crowd_sprite_40x40"></div>';
		var crowd_sprite_display = $(target).html();
		
		var css;
		var crowd_y = 10;
		
		for(var i = 0; i < 8; i++)
		{
			var crowd_id = "microBattle_darkness_crowd" + i;
			
			$(".microBattle_darkness_crowd_main_40x40").append(crowd_sprite_holder);
			
			$("#crowd_sprite_holder").attr("id", crowd_id);
			
			$("#" + crowd_id).html(crowd_sprite_display);
			
			if(extra_class !== null || extra_class !== undefined)
			{
				$("#" + crowd_id).addClass(extra_class);
			}
			
		}
		
		
		css = 	{
					"-webkit-transform" : "translateY(" + crowd_y + "px)",
					"transform" 		: "translateY(" + crowd_y + "px)"
				};
				
		$(".microBattle_darkness_crowd_main_40x40").css(css);
		
	}
	
	function battleUserInfo_crowdPurge()
	{
		$(".microBattle_darkness_crowd_main_40x40").html("");
	}	
	
	///////////////////////////////// --- BATTLE_USER_INFO */
	
	
	
	
	///////////////////////////////// --- SPACE_SQUID */
	
	function spaceSquids_setup()
	{
		if(DISPLAY._width < 480)
		{
			$("#spaceSquid0").remove();
			$("#spaceSquid1").remove();	
		
			spaceSquidsUse = false;
		}
		
		else
		{
			spaceSquidsUse = true;
			
			spaceSquids_animationInit();		
		}
	}
	
	function spaceSquids_animationInit()
	{
		var css;
		
		css	=	{
					"-webkit-transform" : "translateY(" + DISPLAY._height  + "px)",
					"transform" : "translateY(" + DISPLAY._height  + "px)"
				};
		
		$("#spaceSquid0").css(css);
		$("#spaceSquid1").css(css);	
	}
	
	function spaceSquids_animationStart()
	{
		var css;
		var final_y = 0;
		
		$("#spaceSquid0").addClass("tween-spaceSquidMain");
		$("#spaceSquid1").addClass("tween-spaceSquidMain");
		
		$(".tween-spaceSquidMain")[0].addEventListener("webkitTransitionEnd", spaceSquids_animationMid, false);
		$(".tween-spaceSquidMain")[0].addEventListener("transitionend", spaceSquids_animationMid, false);
		
		css	=	{
					"-webkit-transform" : "translateY(" + final_y + "px)",
					"transform" 		: "translateY(" + final_y + "px)"
				};
		
		$("#spaceSquid0").css(css);
		$("#spaceSquid1").css(css);
	}

	function spaceSquids_animationMid(event)
	{
		$(".tween-spaceSquidMain")[0].removeEventListener("webkitTransitionEnd", spaceSquids_animationMid, false);
		$(".tween-spaceSquidMain")[0].removeEventListener("transitionend", spaceSquids_animationMid, false);
		
		$("#spaceSquid0 .spaceSquid_legs0").addClass("tween-SpaceSquid_legsStop");
		$("#spaceSquid0 .spaceSquid_legs1").addClass("tween-SpaceSquid_legsStop");
		
		$("#spaceSquid1 .spaceSquid_legs0").addClass("tween-SpaceSquid_legsStop");
		$("#spaceSquid1 .spaceSquid_legs1").addClass("tween-SpaceSquid_legsStop");	
	}
	
	function spaceSquids_animationReturn()
	{
		var css;
		
		css	=	{
					"-webkit-transform" : "translateY(" + DISPLAY._height + "px)",
					"transform" 		: "translateY(" + DISPLAY._height + "px)"
				};
		
		$("#spaceSquid0 .spaceSquid_legs0").removeClass("tween-SpaceSquid_legsStop").addClass("tween-SpaceSquid_legsPlay");
		$("#spaceSquid0 .spaceSquid_legs1").removeClass("tween-SpaceSquid_legsStop").addClass("tween-SpaceSquid_legsPlay");
		
		$("#spaceSquid1 .spaceSquid_legs0").removeClass("tween-SpaceSquid_legsStop").addClass("tween-SpaceSquid_legsPlay");
		$("#spaceSquid1 .spaceSquid_legs1").removeClass("tween-SpaceSquid_legsStop").addClass("tween-SpaceSquid_legsPlay");
		
		
		$("#spaceSquid0").css(css);
		$("#spaceSquid1").css(css);
		
		$(".tween-spaceSquidMain")[0].addEventListener("webkitTransitionEnd", spaceSquids_animationEnd, false);
		$(".tween-spaceSquidMain")[0].addEventListener("transitionend", spaceSquids_animationEnd, false);				
	}
	
	function spaceSquids_animationEnd(event)
	{
		$(".tween-spaceSquidMain")[0].removeEventListener("webkitTransitionEnd", spaceSquids_animationEnd, false);
		$(".tween-spaceSquidMain")[0].removeEventListener("transitionend", spaceSquids_animationEnd, false);
		
		spaceSquidsUse = false;
		
		$("#spaceSquid0").removeClass("tween-spaceSquidMain");
		$("#spaceSquid1").removeClass("tween-spaceSquidMain");
	}
	
	///////////////////////////////// --- SPACE_SQUID */
	
	
	
	
	///////////////////////////////// --- BATTLE_END */
	
	function battleEnd_setup()
	{
		battleEnd_mountains = {};
		
		battleEnd_mountains.width_full 	= $("#microBattle_resultWipe_content .microBattle_endSky").width();
		battleEnd_mountains.width_side 	= $("#microBattle_resultWipe_content .microBattle_endSky_mountainL").width();
		battleEnd_mountains.width_center 	= $("#microBattle_resultWipe_content .microBattle_endSky_mountainC").width();
		
		battleEnd_mountains.space_available 	= 0;
		battleEnd_mountains.space_adjust 		= 0;
		
		battleEnd_showEndSequence();		
	}
	
	function battleEnd_showEndSequence()
	{
		if(BATTLE_NAV.game.result === "WIN")
		{
			battleEnd_showEndSequence_WIN_set();
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
		{
			battleEnd_showEndSequence_LOSE_set();
		}
		
		screenUpdate(null);
		
		$("#microBattle_resultWipe_content .microBattle_sunMoon_sprite").addClass("tween-microBattle_sunMoon_sprite");
	}
	
	function battleEnd_showEndSequence_WIN_set()
	{
		// SETTINGS
		$("#microBattle_resultWipe_content .microBattle_castle_tower").addClass("microBattle_castle_tower_WIN");
		
		$("#microBattle_resultWipe_content .microBattle_castle_flag").addClass("microBattle_castle_flag_WIN");
		
		$("#microBattle_resultWipe_content .microBattle_castle_watcher").addClass("microBattle_castle_goat_WIN");
		
		$("#microBattle_resultWipe_content .microBattle_sunMoon").addClass("microBattle_sunMoon_WIN");
		
		$("#microBattle_resultWipe_content .microBattle_zombie").addClass("microBattle_zombie_WIN");
		
		$("#microBattle_resultWipe_content .microBattle_growField").addClass("microBattle_growField_WIN");
		
		$("#microBattle_resultWipe_content .microBattle_castle_watcher_sprite").addClass("microBattle_castle_watcher_sprite_goat");
		
		
		// TWEENS
		$("#microBattle_resultWipe_content .microBattle_castle_flag").addClass("tween-microBattle_castle_flag");
		
		$("#microBattle_resultWipe_content .microBattle_castle_watcher").addClass("tween-microBattle_castle_goat");
	}
	
	function battleEnd_showEndSequence_LOSE_set()
	{
		var css_initSet_flag;
		var css_initSet_char;
		
		// SETTINGS
		$("#microBattle_resultWipe_content .microBattle_castle_tower").addClass("microBattle_castle_tower_LOSE");
		
		$("#microBattle_resultWipe_content .microBattle_castle_flag").addClass("microBattle_castle_flag_LOSE");
		
		$("#microBattle_resultWipe_content .microBattle_castle_watcher").addClass("microBattle_castle_enemy_WIN");
		
		$("#microBattle_resultWipe_content .microBattle_zombie").addClass("microBattle_zombie_LOSE");
		
		$("#microBattle_resultWipe_content .microBattle_sunMoon").addClass("microBattle_sunMoon_LOSE");
		
		$("#microBattle_resultWipe_content .microBattle_growField").addClass("microBattle_growField_LOSE");
		
		$("#microBattle_resultWipe_content .microBattle_castle_watcher_sprite").addClass("microBattle_castle_watcher_sprite_" + ROM.enemy.character.enemyType);
		
		css_initSet_flag = 	{
								"-webkit-transform"	: "translateY(0px)",
								"transform"			: "translateY(0px)"
							};
							
		css_initSet_char = 	{
								"-webkit-transform"	: "translateY(-4px)",
								"transform"			: "translateY(-4px)"
							};
					
		$(".microBattle_castle_flag_LOSE").css(css_initSet_flag);
		
		$(".microBattle_castle_enemy_WIN").css(css_initSet_char)		
		
		// TWEENS
		// $("#microBattle_resultWipe_content .microBattle_castle_flag").addClass("tween-microBattle_castle_flag");
		
		$("#microBattle_resultWipe_content .microBattle_zombie_walk").addClass("tween-microBattle_zombie_walk");
	}
	
	function battleEnd_fadeIn()
	{
/*
		$("#microBattle_resultWipe_content .microBattle_sunMoon_sprite").removeClass("microBattle_sunMoon_sprite_set").addClass("microBattle_sunMoon_sprite_rise");
		
		$(".tween-microBattle_sunMoon_sprite")[0].addEventListener("webkitTransitionEnd", battleEnd_showEndSequenceSkyInPlace, false);
		$(".tween-microBattle_sunMoon_sprite")[0].addEventListener("transitionend", battleEnd_showEndSequenceSkyInPlace, false);
*/		

		$(".tween-microBattle_resultWipe_fade")[0].addEventListener("webkitTransitionEnd", battleEnd_fadeInComplete, false);
		$(".tween-microBattle_resultWipe_fade")[0].addEventListener("transitionend", battleEnd_fadeInComplete, false);
		
		
		$("#microBattle_resultWipe_content .microBattle_resultWipe_fade").css("opacity", "0");
				
	}
	
	function battleEnd_fadeInComplete(event)
	{
		$(".tween-microBattle_resultWipe_fade")[0].removeEventListener("webkitTransitionEnd", battleEnd_fadeInComplete, false);
		$(".tween-microBattle_resultWipe_fade")[0].removeEventListener("transitionend", battleEnd_fadeInComplete, false);
		
		$("#microBattle_resultWipe_content .microBattle_sunMoon_sprite").removeClass("microBattle_sunMoon_sprite_set").addClass("microBattle_sunMoon_sprite_rise");
		
		$(".tween-microBattle_sunMoon_sprite")[0].addEventListener("webkitTransitionEnd", battleEnd_showEndSequenceSkyInPlace, false);
		$(".tween-microBattle_sunMoon_sprite")[0].addEventListener("transitionend", battleEnd_showEndSequenceSkyInPlace, false);		
	}
	
	function battleEnd_showEndSequenceSkyInPlace(event)
	{
		$(".tween-microBattle_sunMoon_sprite")[0].removeEventListener("webkitTransitionEnd", battleEnd_showEndSequenceSkyInPlace, false);
		$(".tween-microBattle_sunMoon_sprite")[0].removeEventListener("transitionend", battleEnd_showEndSequenceSkyInPlace, false);		
		
		if(BATTLE_NAV.game.result === "WIN")
		{
			battleEnd_showEndSequence_WIN_stage0();
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
		{
			battleEnd_showEndSequence_LOSE_stage0();
		}
	}
	
	// WIN
	
	function battleEnd_showEndSequence_WIN_stage0()
	{
		var css;
		var css_char;
		
		css = 	{
					"-webkit-transform" : "translateY(0)",
					"transform"			: "translateY(0)"
				};
				
				
		css_char = 	{
						"-webkit-transform" : "translateY(-4px)",
						"transform"			: "translateY(-4px)"			
					};
		
		$("#microBattle_resultWipe_content .microBattle_castle_flag_WIN").css(css);
		$("#microBattle_resultWipe_content .microBattle_castle_goat_WIN").css(css_char);
		
		$("#microBattle_resultWipe_content .microBattle_growField").css(css);
		$("#microBattle_resultWipe_content .microBattle_growField").css("opacity", "1");		
	
		$("#microBattle_resultWipe_content .microBattle_growField")[0].addEventListener("webkitTransitionEnd", battleEnd_completeEvents, false);
		$("#microBattle_resultWipe_content .microBattle_growField")[0].addEventListener("transitionend", battleEnd_completeEvents, false);
	}
	
	// LOSE
	
	function battleEnd_showEndSequence_LOSE_stage0()
	{
		var css;
		var css_char;
		var css_zombie;
		
		var zombie_y;
		
		zombie_y = $("#microBattle_resultWipe_content .microBattle_endField").height();
		
		css = 	{
					"-webkit-transform" : "translateY(0)",
					"transform"			: "translateY(0)"
				};		
		
		
		css_zombie = 	{
							"-webkit-transform" : "translateY(" + zombie_y + "px)",
							"transform"			: "translateY(" + zombie_y + "px)"
						};
						
		// $("#microBattle_resultWipe_content .microBattle_castle_flag_LOSE").css(css);
				
		$("#microBattle_resultWipe_content .microBattle_zombie_walk").css(css_zombie);
		
		$("#microBattle_resultWipe_content .microBattle_zombie_walk")[0].addEventListener("webkitTransitionEnd", battleEnd_completeEvents, false);
		$("#microBattle_resultWipe_content .microBattle_zombie_walk")[0].addEventListener("transitionend", battleEnd_completeEvents, false);
	}
	
	function battleEnd_completeEvents(event)
	{
		var bece_delay;	
		
		if(BATTLE_NAV.game.result === "WIN")
		{
			$("#microBattle_resultWipe_content .microBattle_growField")[0].removeEventListener("webkitTransitionEnd", battleEnd_completeEvents, false);
			$("#microBattle_resultWipe_content .microBattle_growField")[0].removeEventListener("transitionend", battleEnd_completeEvents, false);			
		
			bece_delay = new AnimationTimer();
			
			timerList_add(bece_delay);
			bece_delay.time(0.5, battleEnd_returnToGame);
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
		{
			$("#microBattle_resultWipe_content .microBattle_zombie_walk")[0].removeEventListener("webkitTransitionEnd", battleEnd_completeEvents, false);
			$("#microBattle_resultWipe_content .microBattle_zombie_walk")[0].removeEventListener("transitionend", battleEnd_completeEvents, false);
			
			battleEnd_returnToGame();			
		}
	}
	
	function battleEnd_returnToGame()
	{
		$("#display_wrapper #display_inner_world").html(theBattle.html.display_inner_world);
		
		// RETURN HOOK
		
		$("#display_inner_info #battleScreen").addClass("tween-battleScreen");
		
		$("#display_inner_info #battleScreenFade").addClass("battleScreenFade_use");
		$("#display_inner_info #battleScreenFade").addClass("tween-battleScreenFade");
		
		// RETURN HOOK
		
		if(BATTLE_NAV.game.result === "WIN")
		{
			enemies_ARR[ROM.enemy.character.array_index].alive = false;
			
			ROM.game.statusInfo = battleEngine.levelClearedCheck(enemies_ARR, ROM.mapLevel);
			
			alert("LEVEL CLEARED === " + ROM.game.statusInfo.cleared_level + " COMPLETED === " + ROM.game.statusInfo.cleared_all);
			
			battleOver_returnWin();
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
		{
			battleOver_returnLose();
		}		
	}
	
	function battleEnd_alignMountains_measure()
	{
		battleEnd_mountains.width_full = $("#microBattle_resultWipe_content .microBattle_endSky").width();
		
		battleEnd_mountains.space_available = Math.abs(Math.floor((battleEnd_mountains.width_full - battleEnd_mountains.width_center) * 0.5));
		
		if(battleEnd_mountains.space_available < battleEnd_mountains.width_side)
		{
			battleEnd_mountains.space_adjust = Math.abs(battleEnd_mountains.width_side - battleEnd_mountains.space_available);
			
			battleEnd_alignMountains_set($("#microBattle_resultWipe_content .microBattle_endSky_mountainL"), -battleEnd_mountains.space_adjust);
			battleEnd_alignMountains_set($("#microBattle_resultWipe_content .microBattle_endSky_mountainR"), battleEnd_mountains.space_adjust);
		}		
	}
	
	function battleEnd_alignMountains_set(mountain_div, mountain_x)
	{
		var css = 	{
						"-webkit-transform" : "translateX(" + mountain_x + "px)",
						"transform" 		: "translateX(" + mountain_x + "px)"
					};
					
		$(mountain_div).css(css);		
	}	
	
	///////////////////////////////// --- BATTLE_END */
	
	
	
	
	///////////////////////////////// --- BATTLE_OVER */
	
/*
	function battleOver_skySet(event)
	{
		$(".tween-microBattle_endSky")[0].removeEventListener("webkitTransitionEnd", battleOver_skySet, false);
		$(".tween-microBattle_endSky")[0].removeEventListener("transitionend", battleOver_skySet, false);
		
		$("#display_wrapper #display_inner_world").html(theBattle.html.display_inner_world);
		$("#display_inner_info #battleScreen").addClass("tween-battleScreen");
		
		if(BATTLE_NAV.game.result === "WIN")
		{
			enemies_ARR[ROM.enemy.character.array_index].alive = false;
			
			ROM.game.statusInfo = battleEngine.levelClearedCheck(enemies_ARR, ROM.mapLevel);
		
			trace("ROM.game!!! ::");
			trace(ROM.game);
			
			battleOver_returnWin();
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
		{
			battleOver_returnLose();
		}
	}
*/
	
	function battleOver_returnWin()
	{
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).html("");
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).html(theBattle.grave.html);
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).removeAttr("data-npc");
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).removeClass("collideCheck-field");
		
		$("#" + theBattle.grave.ref).removeAttr("id");
		
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).addClass("field-floor-" + LEVEL_MAIN.landType);
		
		battleOver_prepareForReturn();
	}
	
	function battleOver_returnLose()
	{
		$("#microBattle_player_wrapper #player1").html("");
		$("#microBattle_player_wrapper #player1").html(theBattle.html.zombie);
		$("#microBattle_player_wrapper #player1 #_enemy_zombie").removeAttr("id");
		
		battleOver_zombie();		
	}
	
	function battleOver_zombie()
	{
		var new_zombie = new Object();
		
		var count_zombie = 0;
		
		var graveOverlap = false;
		
		for(var enemyObj in enemies_ARR)
		{
			if(enemies_ARR[enemyObj].spawn === ROM.mapLevel)
			{
				var e_x = enemies_ARR[enemyObj].buildData.x;
				var e_y = enemies_ARR[enemyObj].buildData.y;
				
				if(theBattle.playerStore.x_return == e_x && theBattle.playerStore.y_return == e_y)
				{
					graveOverlap = true;
					
					break;
				}
				
				else
				{
					graveOverlap = false;
					
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
		}
		
		
		if(!graveOverlap)
		{
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
		}
		
		battleOver_prepareForReturn();	
	}
	
	function battleOver_prepareForReturn()
	{
		var delay_returnWorld;
		
		battleOver_setControlsBasic();
		
		delay_returnWorld = setTimeout(battleOver_returnWorld, 0.1 * 1000);
	
		// battleOver_returnWorld();
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
		
/*
		css = 	{
					"-webkit-transform" : "translateX(-100%)",
					"transform" 		: "translateX(-100%)"
				};	
*/

		css = 	{
					"-webkit-transform" : "translateY(100%)",
					"transform" 		: "translateY(100%)"
				};		
	
		// $(".tween-battleScreen")[0].addEventListener("webkitTransitionEnd", battleOver_returnWorldEnd, false);
		// $(".tween-battleScreen")[0].addEventListener("transitionend", battleOver_returnWorldEnd, false);
	
		// RETURN HOOK
		
		$("#display_inner_info #battleScreen").css(css);
		
		
		// ADD EVENT LISTENERS AND CLEAN FUNCTION
		
		$(".tween-battleScreenFade")[0].addEventListener("webkitTransitionEnd", battleOver_returnWorldEnd, false);
		$(".tween-battleScreenFade")[0].addEventListener("transitionend", battleOver_returnWorldEnd, false);
		
		$("#display_inner_info #battleScreenFade").css("opacity", "0");

		
		// RETURN HOOK
	}
	
	function battleOver_returnWorldEnd(event)
	{
		// $(".tween-battleScreen")[0].removeEventListener("webkitTransitionEnd", battleOver_returnWorldEnd, false);
		// $(".tween-battleScreen")[0].removeEventListener("transitionend", battleOver_returnWorldEnd, false);
		
		$(".tween-battleScreenFade")[0].removeEventListener("webkitTransitionEnd", battleOver_returnWorldEnd, false);
		$(".tween-battleScreenFade")[0].removeEventListener("transitionend", battleOver_returnWorldEnd, false);
		
		battleOver_cleanUp();
	}
	
	function battleOver_cleanUp()
	{
		$("#display_inner_info #battleScreen").html("");
		$("#display_inner_info #battleScreen").removeAttr("style");
		
		$("#display_inner_info #battleScreenFade").removeAttr("style");
		$("#display_inner_info #battleScreenFade").removeAttr("class");
		
		// FLUSH OBJECT
		theBattle = {};
		
		// FLUSH OBJECT
		battleEnd_mountains = null;
		
		// REMOVE ALL TIMERS FROM THIS ANIMATION FLOW
		timerList_stopAll();
		timerList_destroy();
		
		moveStageTest();		
	}
	
	///////////////////////////////// --- BATTLE_OVER */
	
	
	
	