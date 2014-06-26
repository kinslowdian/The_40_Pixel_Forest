	
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
		mbs_level_delay.time(1.5, microBattleSequence_fadeOutLevel);		
	}
	
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
	
	function microBattleSequence_startBattle(event)
	{
		$(".tween-microBattleWeatherFade")[0].removeEventListener("webkitTransitionEnd", microBattleSequence_startBattle, false);
		$(".tween-microBattleWeatherFade")[0].removeEventListener("transitionend", microBattleSequence_startBattle, false);
		
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
		
		
		battleNav_getValues();
	}
	
	function battleNav_getValues()
	{
		BATTLE_NAV.options.stone = $("#battle-nav #battle-stone");
		BATTLE_NAV.options.paper = $("#battle-nav #battle-paper");
		BATTLE_NAV.options.scissors = $("#battle-nav #battle-scissors");
		
		BATTLE_NAV.player_1.head = $("#battle-nav-player1 .battleCute-warrior-head");
		BATTLE_NAV.player_2.head = $("#battle-nav-player2 .battleCute-warrior-head");		
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
		
		battleUserInfo_start();
		
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
					$(BATTLE_NAV.options[optionItem])[0].addEventListener("touchend", battleNav_controlEvent, false);
				}
				
				else
				{
					$(BATTLE_NAV.options[optionItem]).css("cursor", "pointer");
					
					$(BATTLE_NAV.options[optionItem])[0].addEventListener("mouseover", battleNav_controlEvent, false);	
					$(BATTLE_NAV.options[optionItem])[0].addEventListener("mouseout", battleNav_controlEvent, false);	
					$(BATTLE_NAV.options[optionItem])[0].addEventListener("click", battleNav_controlEvent, false);
					
					keyboardBattleNav_init();		
				}
				
				$(BATTLE_NAV.options[optionItem]).css("pointer-events", "auto");
			}
			
			else
			{
				if(CONTROL_SIGNAL.enableTouch)
				{
					$(BATTLE_NAV.options[optionItem])[0].removeEventListener("touchend", battleNav_controlEvent, false);
				}
				
				else
				{
					$(BATTLE_NAV.options[optionItem]).css("cursor", "default");
					
					$(BATTLE_NAV.options[optionItem])[0].removeEventListener("mouseover", battleNav_controlEvent, false);	
					$(BATTLE_NAV.options[optionItem])[0].removeEventListener("mouseout", battleNav_controlEvent, false);	
					$(BATTLE_NAV.options[optionItem])[0].removeEventListener("click", battleNav_controlEvent, false);
					
					keyboardBattleNav_off();	
				}
				
				$(BATTLE_NAV.options[optionItem]).css("pointer-events", "none");				
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
				
				break;
			}
			
			case "mouseout":
			{
				$("#" + event.target.parentNode.id).css(keyboardBattleNav.css.def);
				
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

/*
	function battleNav_mouseRollCheck(div)
	{
		for(var optionItem in BATTLE_NAV.options)
		{
			if(div !== BATTLE_NAV.options[optionItem][0].id && BATTLE_NAV.options[optionItem].scaled = true)
			{
				BATTLE_NAV.options[optionItem].scaled = false;
				
				$("#" + BATTLE_NAV.options[optionItem][0].id).css(keyboardBattleNav.css.def);
			}
			
			else
			{
				BATTLE_NAV.options[optionItem].scaled = true;
			}	
		} 
	}
*/

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
			if($(BATTLE_NAV.options[optionItem])[0].id !== selected)
			{
				$("#" + BATTLE_NAV.options[optionItem][0].id).css("opacity", 0.2);
			}
		}
		
		battleUserInfo_player();
		
		// LOGIC
		battleNav_logicRequest();
		
		selectionDelay = new AnimationTimer();
		
		timerList_add(selectionDelay);
		selectionDelay.time(1, battleNav_removeSelection);
	}
	
	function battleNav_logicRequest()
	{
		// BATTLE_NAV.game.result = battleEngine.battle(MAP_PLAYER, ROM.enemy.character, false);
		
		BATTLE_NAV.game.result = "WIN";
			
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
		
		
		$(BATTLE_NAV.player_1.head).addClass("battleCute-warrior-head-" + BATTLE_NAV.player_1.headType);
		$(BATTLE_NAV.player_2.head).addClass("battleCute-warrior-head-" + BATTLE_NAV.player_2.headType);
		
		$("#battle-nav-player1 .battleCute-eyes-sprite").addClass("battleCute-eyes-look-R");
		$("#battle-nav-player2 .battleCute-eyes-sprite").addClass("battleCute-eyes-look-L");
		
		$("#battle-nav-fight").addClass("tween-battle-nav-fight");
		
		BATTLE_NAV.html.navBattle = $("#battle-nav-fight").html();
		

		
		battleNav_speechBubbles();
	}
	
	function battleNav_speechBubbles()
	{
		$("#battle-nav-player1 .battleCute-speak-icon").addClass("battleCute-" + BATTLE_NAV.player_1.selection);
		$("#battle-nav-player2 .battleCute-speak-icon").addClass("battleCute-" + BATTLE_NAV.player_2.selection);
	
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
		
/*
		intoCountDownDelay = new AnimationTimer();
		timerList_add(intoCountDownDelay);
		intoCountDownDelay.time(1, battleNav_startBattleCountDown);
*/
		battleNav_startBattleCountDown();
		
	}
	
	function battleNav_startBattleCountDown()
	{
		battleUserInfo_vs();
		
		
		$("#battle-nav-player1 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-R").addClass("battleCute-eyes-look-C");
		
		$("#battle-nav-player2 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-L").addClass("battleCute-eyes-look-C");
		
		
		
		
		$("#battle-nav-playerBird .battleCute-bird-board").addClass("tween-battleCute-bird-countDown");
		
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].addEventListener("webkitAnimationEnd", battleNav_startBattleCountDownSequence, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].addEventListener("animationend", battleNav_startBattleCountDownSequence, false);		
	}
	
	function battleNav_startBattleCountDownSequence(event)
	{
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].removeEventListener("webkitAnimationEnd", battleNav_startBattleCountDownSequence, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].removeEventListener("animationend", battleNav_startBattleCountDownSequence, false);
	 	
	 	$("#battle-nav-playerBird .battleCute-bird-arm-inner").addClass("tween-battleCute-bird-arm-main-fire");
	 			
	 	$("#battle-nav-playerBird .battleCute-eyes-sprite").removeClass("battleCute-eyes-norm").addClass("battleCute-eyes-happy");
	 	
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main").addClass("tween-battleCute-bird-arm-main-intoFly");
	 			
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].addEventListener("webkitAnimationEnd", battleNav_clearStageForFightInit, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].addEventListener("animationend", battleNav_clearStageForFightInit, false);
	 	
	 	$("#info-cloud p").text(BATTLE_NAV.navText.txt_START.toUpperCase());
	 	
	 	$("#info-cloud").css("opacity", "1");		
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
		$("#info-cloud").css("opacity", "0");
		
		$("#battle-nav-playerBird .battleCute-bird-arm-main").removeClass("tween-battleCute-bird-arm-main-intoFly").addClass("tween-battleCute-bird-arm-main");
	 			
	 	$("#battle-nav-playerBird").addClass("tween-bird-flapAway");	
	
	 	$("#battle-nav-playerBird")[0].addEventListener("webkitAnimationEnd", battleNav_clearedStage, false);
	 	$("#battle-nav-playerBird")[0].addEventListener("animationend", battleNav_clearedStage, false);		
	}
	
	function battleNav_clearedStage(event)
	{
		var winLoseDisplay;
		
	 	$("#info-cloud p").text(BATTLE_NAV.navText["txt_" + BATTLE_NAV.game.result].toUpperCase());
	 	
	 	$("#battle-nav-playerBird")[0].removeEventListener("webkitAnimationEnd", battleNav_clearedStage, false);
	 	$("#battle-nav-playerBird")[0].removeEventListener("animationend", battleNav_clearedStage, false);		
	 	
		$("#battle-nav-player1 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-C").addClass("battleCute-eyes-look-R");
		$("#battle-nav-player2 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-C").addClass("battleCute-eyes-look-L");	 	
	 	
	 	
	 	$("#battle-nav-player1 .battleCute-speak-left").css("opacity", "1");
	 	$("#battle-nav-player2 .battleCute-speak-right").css("opacity", "1");
	 	
	 	
	 	battleUserInfo_enemy();
	 	
	 	winLoseDisplay = new AnimationTimer();
	 	timerList_add(winLoseDisplay);
	 	winLoseDisplay.time(2, battleNav_battleResults);		
	}
	
	function battleNav_battleResults()
	{
		var resultsEndDelay;
		
		$("#info-cloud").css("opacity", "1");
		
		$("#battle-nav-player1 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-R").addClass("battleCute-eyes-look-C");
		$("#battle-nav-player2 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-L").addClass("battleCute-eyes-look-C");
		
		
		switch(BATTLE_NAV.game.result)
		{
			case "LOSE":
			{
				$("#battle-nav-player1 .battleCute-cloud").css("opacity", "1").addClass("tween-battleCute-Cloud");	 			
	 			$("#battle-nav-player1 .battleCute-tears").css("opacity", "1");
	 			$("#battle-nav-player1 .battleCute-warrior-arm > div").removeClass("battleCute-warrior-armsDown").addClass("battleCute-warrior-armsUp");
	 			
	 			$("#battle-nav-player2 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-norm").addClass("battleCute-eyes-happy");
	 			
				$("#player1 .map-goat-head").removeClass("mapPlayer_head_default").addClass("mapPlayer_head_dead");
				$("#player2 .map-enemy_40x40-head").removeClass("map-enemy_40x40_head_default").addClass("map-enemy_40x40_head_happy");
				
				break;
			}
			
			case "WIN":
			{
				$("#battle-nav-player2 .battleCute-cloud").css("opacity", "1").addClass("tween-battleCute-Cloud");	 			
	 			$("#battle-nav-player2 .battleCute-tears").css("opacity", "1");
	 			$("#battle-nav-player2 .battleCute-warrior-arm > div").removeClass("battleCute-warrior-armsDown").addClass("battleCute-warrior-armsUp");
	 			
	 			$("#battle-nav-player1 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-norm").addClass("battleCute-eyes-happy");
	 			
				$("#player1 .map-goat-head").removeClass("mapPlayer_head_default").addClass("mapPlayer_head_happy");
				$("#player2 .map-enemy_40x40-head").removeClass("map-enemy_40x40_head_default").addClass("map-enemy_40x40_head_dead");
	 							
				break;
			}
			
			case "DRAW":
			{
				$("#battle-nav-player1 .battleCute-warrior-arm > div").removeClass("battleCute-warrior-armsDown").addClass("battleCute-warrior-armsUp");
				$("#battle-nav-player2 .battleCute-warrior-arm > div").removeClass("battleCute-warrior-armsDown").addClass("battleCute-warrior-armsUp");
				
				$("#player1 .map-goat-head").removeClass("mapPlayer_head_default").addClass("mapPlayer_head_fear");
				$("#player2 .map-enemy_40x40-head").removeClass("map-enemy_40x40_head_default").addClass("map-enemy_40x40_head_fear");				
				
				break;
			}
			
		}
		
		battleUserInfo_result();
		
		resultsEndDelay = new AnimationTimer();
		timerList_add(resultsEndDelay);
		resultsEndDelay.time(2, battleNav_battleResultsEndInit);		
	}
	
	function battleNav_battleResultsEndInit()
	{
		$("#info-cloud").css("opacity", "0");
		
		$(".tween-info-cloud")[0].addEventListener("webkitTransitionEnd", battleNav_battleResultsEnd, false);
		$(".tween-info-cloud")[0].addEventListener("transitionend", battleNav_battleResultsEnd, false);
	}
	
	function battleNav_battleResultsEnd(event)
	{
		var exitFrame;
		
		$(".tween-info-cloud")[0].removeEventListener("webkitTransitionEnd", battleNav_battleResultsEnd, false);
		$(".tween-info-cloud")[0].removeEventListener("transitionend", battleNav_battleResultsEnd, false);
		
		if(BATTLE_NAV.game.result === "WIN" || BATTLE_NAV.game.result === "LOSE")
		{
			exitFrame = new AnimationTimer();
			timerList_add(exitFrame);
			exitFrame.time(0.02, battleNav_battleOver);
		}
		
		else
		{
			$("#battle-nav-fight").css(BATTLE_NAV.settings.y_hide);
			
			$(".tween-battle-nav-fight")[0].addEventListener("webkitTransitionEnd", battleNav_anotherRound, false);
			$(".tween-battle-nav-fight")[0].addEventListener("transitionend", battleNav_anotherRound, false);			
		}		
	}
	
	function battleNav_anotherRound(event)
	{
		$(".tween-battle-nav-fight")[0].removeEventListener("webkitTransitionEnd", battleNav_anotherRound, false);
		$(".tween-battle-nav-fight")[0].removeEventListener("transitionend", battleNav_anotherRound, false);
		
		$("#battle-nav-fight").html("");
		
		$("#battle-nav").html(BATTLE_NAV.html.navOptions);
		
		battleNav_getValues();
		
		$("#info-cloud p").text(BATTLE_NAV.navText.txt_AGAIN.toUpperCase());
		
		$("#battle-nav").removeClass("battle-nav-hide").addClass("battle-nav-show");
		
		battleUserInfo_anotherRound();
		
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
		var keyboardSelect = keyboardBattleNav.signal["signal" + keyboardBattleNav.countTap];
		
		var keyboardSelect_id = keyboardSelect[0].id;
		
		
		if(!keyboardBattleNav.currentFocus)
		{
			keyboardBattleNav.currentFocus = keyboardSelect_id;
			
			$("#" + keyboardSelect_id).css(keyboardBattleNav.css.hit);
		}
		
		else
		{
			$("#" + keyboardSelect_id).css(keyboardBattleNav.css.hit);
			$("#" + keyboardBattleNav.currentFocus).css(keyboardBattleNav.css.def);
			
			keyboardBattleNav.currentFocus = keyboardSelect_id;
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
				battleUserInfo_textEngine("", "microBattle_darkness_info_text_DRAW", "YOUR TURN");
				
				break;
			}
			
			case "PLAYER1":
			{
				battleUserInfo_textEngine("microBattle_darkness_info_text_DRAW", "microBattle_darkness_info_text_WIN", BATTLE_NAV.player_1.selection.toUpperCase());
				
				break;
			}
			
			case "VS":
			{
				battleUserInfo_textEngine("microBattle_darkness_info_text_WIN", "microBattle_darkness_info_text_DRAW", "VS", "", "tween-microBattle_darkness_mega");
				
				break;
			}
			
			case "PLAYER2":
			{
				battleUserInfo_textEngine("microBattle_darkness_info_text_DRAW", "microBattle_darkness_info_text_LOSE", BATTLE_NAV.player_2.selection.toUpperCase(), "tween-microBattle_darkness_mega");
				
				break;
			}
			
			case "RESULT":
			{
				battleUserInfo_textEngine("microBattle_darkness_info_text_LOSE", "microBattle_darkness_info_text_" + BATTLE_NAV.game.result, BATTLE_NAV.game.result, "", "tween-microBattle_darkness_mega");
				
				break;
			}
			
			case "ANOTHER":
			{
				battleUserInfo_textEngine("microBattle_darkness_info_text_" + BATTLE_NAV.game.result, "microBattle_darkness_info_text_DRAW", "YOUR TURN", "tween-microBattle_darkness_mega");
				
				break;
			}
		}
	}
	
	function battleUserInfo_textEngine(rem_class, add_class, new_text, rem_extra, add_extra)
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
	
	
	function battleUserInfo_start()
	{
		battleUserInfo_messaging("START", false);
		
		$("#microBattle_darkness").css("visibility", "visible");	
		$("#microBattle_darkness").css("opacity", "1");
	}
	
	function battleUserInfo_player()
	{
		battleUserInfo_messaging("PLAYER1", true);
	}
	
	function battleUserInfo_vs()
	{
		battleUserInfo_messaging("VS", true);
	}
	
	function battleUserInfo_enemy()
	{
		battleUserInfo_messaging("PLAYER2", true);
	}
	
	function battleUserInfo_result()
	{
		battleUserInfo_messaging("RESULT", true);
		
		if(BATTLE_NAV.game.result === "WIN")
		{
			battleUserInfo_crowdAdd("#player1");
		}
		
		if(BATTLE_NAV.game.result === "LOSE")
		{
			battleUserInfo_crowdAdd("#player2", "enemy_" + ROM.enemy.character.enemyType);
		}
	}
	
	function battleUserInfo_anotherRound()
	{
		battleUserInfo_messaging("ANOTHER", true);
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
					"-webkit-transform" : "translateY(" + crowd_y + "px)"
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
		var final_y = 240;
		
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
					"transform" : "translateY(" + DISPLAY._height + "px)"
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
		
		$("#microBattle_resultWipe_content .microBattle_castle_goat").addClass("microBattle_castle_goat_WIN");
		
		$("#microBattle_resultWipe_content .microBattle_sunMoon").addClass("microBattle_sunMoon_WIN");
		
		$("#microBattle_resultWipe_content .microBattle_zombie").addClass("microBattle_zombie_WIN");
		
		$("#microBattle_resultWipe_content .microBattle_growField").addClass("microBattle_growField_WIN");
		
		
		// TWEENS
		$("#microBattle_resultWipe_content .microBattle_castle_flag").addClass("tween-microBattle_castle_flag");
		
		$("#microBattle_resultWipe_content .microBattle_castle_goat").addClass("tween-microBattle_castle_goat");
	}
	
	function battleEnd_showEndSequence_LOSE_set()
	{
		// SETTINGS
		$("#microBattle_resultWipe_content .microBattle_castle_tower").addClass("microBattle_castle_tower_LOSE");
		
		$("#microBattle_resultWipe_content .microBattle_castle_flag").addClass("microBattle_castle_flag_LOSE");
		
		$("#microBattle_resultWipe_content .microBattle_castle_goat").addClass("microBattle_castle_goat_LOSE");
		
		$("#microBattle_resultWipe_content .microBattle_zombie").addClass("microBattle_zombie_LOSE");
		
		$("#microBattle_resultWipe_content .microBattle_sunMoon").addClass("microBattle_sunMoon_LOSE");
		
		$("#microBattle_resultWipe_content .microBattle_growField").addClass("microBattle_growField_LOSE");
		
		// TWEENS
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
		
		css = 	{
					"-webkit-transform" : "translateY(0)",
					"transform"			: "translateY(0)"
				};
		
		$("#microBattle_resultWipe_content .microBattle_castle_flag_WIN").css(css);
		$("#microBattle_resultWipe_content .microBattle_castle_goat_WIN").css(css);
		
		$("#microBattle_resultWipe_content .microBattle_growField").css(css);
		$("#microBattle_resultWipe_content .microBattle_growField").css("opacity", "1");		
	
		$("#microBattle_resultWipe_content .microBattle_growField")[0].addEventListener("webkitTransitionEnd", battleEnd_completeEvents, false);
		$("#microBattle_resultWipe_content .microBattle_growField")[0].addEventListener("transitionend", battleEnd_completeEvents, false);
	}
	
	// LOSE
	
	function battleEnd_showEndSequence_LOSE_stage0()
	{
		var css;
		
		var zombie_y;
		
		zombie_y = $("#microBattle_resultWipe_content .microBattle_endField").height();
		
		css = 	{
					"-webkit-transform" : "translateY(" + zombie_y + "px)",
					"transform"			: "translateY(" + zombie_y + "px)"
				};
				
		$("#microBattle_resultWipe_content .microBattle_zombie_walk").css(css);
		
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
	
	
	
	