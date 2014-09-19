	trace("Temp.js being used -- remove from final build / release");


	function smasher()
	{
		var css;

		css = 	{
/*
					"-webkit-transform-origin"	: "50% 50%",
					"transform-origin"			: "50% 50%",
*/
					"-webkit-transform"			: "scale(0.4)",
					"transform"					: "scale(0.4)"
				};

		$(".microBattle_fade_main").css(css);
		$(".stage-view-y").css(css);
	}


/*
	function battleUserInfo_place()
	{
		var set_css;

		var set_y = $("#battle-cloud").height();

		var set_h = Math.abs(set_y - document.height);

		set_css	= 	{
						"height"	: set_h + "px",
						"top"		: set_y + "px"
					};


		$("#microBattle_darkness .microBattle_darkness_info").css(set_css);
	}
*/


	/////////////////////////// KEYBOARD HINT

	var keyboardHint;


	function keyboardHint_init(use)
	{
		if(use)
		{
			keyboardHint = {};

			keyboardHint.firstInit = true;
			keyboardHint.delay_show = null;
			keyboardHint.delay_hide = null;
			keyboardHint.inView = false;
			keyboardHint.waitingForPress = false;

			keyboardHint.randomPress = new Array();
			keyboardHint.randomPress = ["keyboardHint_pressU", "keyboardHint_pressD", "keyboardHint_pressL", "keyboardHint_pressR"];
		}

		else
		{
			$(".keyboardHint_wrapper").remove();
		}
	}

	function keyboardHint_run()
	{
		if(!keyboardHint.waitingForPress)
		{
			keyboardHint.waitingForPress = true;

			$(".keyboardHint_pressBtn").addClass(keyboardHint.randomPress[Math.floor(Math.random() * keyboardHint.randomPress.length)]);

			keyboardHint.delay_show = setTimeout(keyboardHint_switch, 2 * 1000, true);
		}
	}

	function keyboardHint_cancel()
	{
		clearTimeout(keyboardHint.delay_show);
		clearTimeout(keyboardHint.delay_hide);

		if(keyboardHint.inView)
		{
			keyboardHint_switch(false);
		}
	}

	function keyboardHint_switch(use)
	{
		if(use && !keyboardHint.inView)
		{
			keyboardHint.inView = true;

			$(".keyboardHint_wrapper").css("opacity", "1");

			keyboardHint.delay_hide = setTimeout(keyboardHint_switch, 10 * 1000, false);
		}

		else
		{
			keyboardHint.inView = false;

			keyboardHint.waitingForPress = false;

			$(".keyboardHint_wrapper").css("opacity", "0");

			$(".keyboardHint_wrapper")[0].addEventListener("webkitTransitionEnd", keyboardHint_purge, false);
			$(".keyboardHint_wrapper")[0].addEventListener("transitionEnd", keyboardHint_purge, false);
		}
	}

	function keyboardHint_purge(event)
	{
		$(".keyboardHint_wrapper")[0].removeEventListener("webkitTransitionEnd", keyboardHint_purge, false);
		$(".keyboardHint_wrapper")[0].removeEventListener("transitionEnd", keyboardHint_purge, false);

		$(".keyboardHint_wrapper").remove();

		delete keyboardHint;
	}


	/////////////////////////// KEYBOARD HINT


	var battleEngine = 	{
							gameStats : null,

							difficulty : null,

							levelsCleared : new Array(),

							init	: function(levelTotal, diff_e, diff_m, diff_h, diff_s) // BOSS ROUNDS ???
							{
								this.gameStats = {};

								this.gameStats.win 		= 0;
								this.gameStats.lose		= 0;
								this.gameStats.draw		= 0;
								this.gameStats.play		= 0;

								this.difficulty = {};

								this.difficulty.easy 	= diff_e;
								this.difficulty.medium 	= diff_m;
								this.difficulty.hard	= diff_h;
								this.difficulty.max		= diff_s;

								for(var i = 0; i < levelTotal; i++)
								{
									this.levelsCleared.push(false);
								}
							},

							playerLevelSort	: function(player_ob)
							{
								player_ob.sword = {};

								// EASY
								if(player_ob.rating >= this.difficulty.easy && player_ob.rating < this.difficulty.medium)
								{
									player_ob.sword.skill 		= "apprentice";
									player_ob.sword.fullStrike 	= 51;
									player_ob.sword.magic 		= 5;
								}

								// MEDIUM
								else if(player_ob.rating >= this.difficulty.medium && player_ob.rating < this.difficulty.hard)
								{
									player_ob.sword.skill 		= "knight";
									player_ob.sword.fullStrike 	= 71;
									player_ob.sword.magic 		= 40;
								}

								// HARD
								else if(player_ob.rating >= this.difficulty.hard && player_ob.rating < this.difficulty.max)
								{
									player_ob.sword.skill 		= "master";
									player_ob.sword.fullStrike 	= 91;
									player_ob.sword.magic 		= 60;
								}

								// SUPER
								else
								{
									player_ob.sword.skill 		= "lord";
									player_ob.sword.fullStrike 	= 101;
									player_ob.sword.magic 		= 80;
								}

							},

							playerProgress : function(player_ob_win, player_ob_lose, playerIsEnemy)
							{
								var ratingUpdate = false;
								var updateValue = 0;

								if(player_ob_win.rating > player_ob_lose.rating)
								{
									ratingUpdate = false;
								}

								if(player_ob_win.rating == player_ob_lose.rating)
								{
									ratingUpdate = true;
									updateValue = player_ob_win.rating += 1;
								}

								if(player_ob_win.rating < player_ob_lose.rating)
								{
									ratingUpdate = true;

									if(playerIsEnemy)
									{
										updateValue = player_ob_win.rating += player_ob_lose.rating;
									}

									else
									{
										updateValue = player_ob_win.rating += Math.round(player_ob_lose.rating * 0.25); // * 0.5
									}
								}

								if(ratingUpdate)
								{
									player_ob_win.rating = updateValue;

									this.playerLevelSort(player_ob_win);
								}
							},

							battle : function(player_ob, enemy_ob, playerIsBoss)
							{
								var battle_resultString = "";

								var battle_data = {};

								var finalMagic = 0;
								var ratingDrop = 0;

								this.gameStats.play++;


								if(player_ob.sword.skill === enemy_ob.sword.skill)
								{
									if(player_ob.rating >= enemy_ob.rating)
									{
										// IF player_ob LEVEL IS GREATER BY 20 THEY GET FULL MAGIC

										if(Math.abs(player_ob.rating - enemy_ob.rating) > 20)
										{
											finalMagic = player_ob.sword.magic;
										}

										// IF player_ob LEVEL IS ONLY SLIGHTLY GREATER THEY GET LESS MAGIC

										else if(Math.abs(player_ob.rating - enemy_ob.rating) > 10)
										{
											finalMagic = Math.floor(player_ob.sword.magic * 0.25); // 0.25 ??
										}

										// FOR LESS EXPERIENCE AT THAT LEVEL

										else
										{
											finalMagic = Math.floor(player_ob.sword.magic * 0.5); // 0.5 ??
										}
									}

									else
									{
										finalMagic = Math.floor(player_ob.sword.magic * 0.5);
									}
								}

								else
								{
									finalMagic = player_ob.sword.magic;
								}

								battle_data.attack_p = Math.floor(Math.random() * (player_ob.sword.fullStrike - finalMagic) + finalMagic);
								battle_data.attack_e = Math.floor(Math.random() * (enemy_ob.sword.fullStrike - enemy_ob.sword.magic) + enemy_ob.sword.magic);

								//////// ---------- DRAW

								if(battle_data.attack_p === battle_data.attack_e)
								{
									battle_resultString = "DRAW";

									this.gameStats.draw++;
								}

								//////// ---------- WIN

								if(battle_data.attack_p > battle_data.attack_e)
								{
									if(playerIsBoss)
									{

									}

									else
									{
										battle_resultString = "WIN";

										this.playerProgress(player_ob, enemy_ob, false);
										this.playerLevelSort(player_ob);

										this.gameStats.win++;
									}
								}

								//////// ---------- LOSE

								else
								{
									if(playerIsBoss)
									{

									}

									else
									{
										battle_resultString = "LOSE";

										ratingDrop = Math.round(Math.abs(player_ob.rating - (player_ob.rating * 0.4)));

										player_ob.rating = ratingDrop;

										this.playerProgress(enemy_ob, player_ob, false);
										this.playerLevelSort(enemy_ob);

										this.gameStats.lose++;

									}
								}

								return battle_resultString;
							},

							levelClearedCheck : function(list_enemy, list_num)
							{
								var clearCheck = {};

								clearCheck.cleared_level = true;
								clearCheck.cleared_all = true;

								for(var check in list_enemy)
								{
									if(list_enemy[check].spawn == list_num)
									{
										if(list_enemy[check].alive)
										{
											clearCheck.cleared_level = false;
										}
									}
								}

								if(clearCheck.cleared_level)
								{
									this.levelsCleared[list_num] = true;
								}

								for(var all in this.levelsCleared)
								{
									if(!this.levelsCleared[all])
									{
										clearCheck.cleared_all	= false;
									}
								}

								return clearCheck;
							}
						};


/*
	// MIGHT BE USEFUL LATER

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
*/


	///////////////// DISPLAY

/*
	if(mountains != null || mountains != undefined)
	{
		battleEnd_alignMountains_measure();
	}
*/

	///////////////// DISPLAY



function test_return_show()
{
	if(BATTLE_NAV.game.result === "WIN")
	{
		$(".return_wrapper .failScreen_wrapper").remove();
	}

	if(BATTLE_NAV.game.result === "LOSE")
	{

	}

	$(".return_wrapper").addClass("return_wrapper_show");

	$(".tween-return_wrapper")[0].addEventListener("webkitTransitionEnd", test_return_showEnd, false);
	$(".tween-return_wrapper")[0].addEventListener("transitionend", test_return_showEnd, false);
}

function test_return_showEnd(event)
{
	$(".tween-return_wrapper")[0].removeEventListener("webkitTransitionEnd", test_return_showEnd, false);
	$(".tween-return_wrapper")[0].removeEventListener("transitionend", test_return_showEnd, false);

	// COPIED FROM battleNav_memorySave();

		$("#microBattle_nav_wrapper").html("");
		$("#microBattle_fade_wrapper").html("");

		$("#enemyScreen").html("");
		$("#microBattle_player_wrapper").remove();
		$("#microBattle_wrapper").remove();


		battleUserInfo_crowdPurge();

		if(BATTLE_NAV.game.result === "WIN")
		{
			test_battleEnd_returnToGame();
		}

		if(BATTLE_NAV.game.result === "LOSE")
		{
			failScreen_showZombie();
		}
}



		function failScreen_showZombie()
		{
			$(".failScreen_zombie")[0].addEventListener("webkitTransitionEnd", failScreen_showTitle, false);
			$(".failScreen_zombie")[0].addEventListener("transitionend", failScreen_showTitle, false);

			$(".failScreen_zombie").addClass("failScreen_zombie_show");
		}

		function failScreen_showTitle(event)
		{
			$(".failScreen_zombie")[0].removeEventListener("webkitTransitionEnd", failScreen_showTitle, false);
			$(".failScreen_zombie")[0].removeEventListener("transitionend", failScreen_showTitle, false);

			$(".failScreen_title_top")[0].addEventListener("webkitTransitionEnd", failScreen_end, false);
			$(".failScreen_title_top")[0].addEventListener("transitionend", failScreen_end, false);

			$(".failScreen_title_top").addClass("failScreen_title_top_show");
		}

		function failScreen_end(event)
		{
			var fse_end_delay;

			$(".failScreen_title_top")[0].removeEventListener("webkitTransitionEnd", failScreen_end, false);
			$(".failScreen_title_top")[0].removeEventListener("transitionend", failScreen_end, false);

			$(".failScreen_zombie .map-enemy_40x40-head").addClass("mapPlayer_head_fear");

			fse_end_delay = new AnimationTimer();

			timerList_add(fse_end_delay);
			fse_end_delay.time(1.5, test_battleEnd_returnToGame);

		}







	function test_battleEnd_returnToGame()
	{
		$("#display_wrapper #display_inner_world").html(theBattle.html.display_inner_world);

		// RETURN HOOK


		/*
		$("#display_inner_info #battleScreen").addClass("tween-battleScreen");

		$("#display_inner_info #battleScreenFade").addClass("battleScreenFade_use");
		$("#display_inner_info #battleScreenFade").addClass("tween-battleScreenFade");
		*/

		// RETURN HOOK

		if(BATTLE_NAV.game.result === "WIN")
		{
			enemies_ARR[ROM.enemy.character.array_index].alive = false;

			ROM.game.statusInfo = battleEngine.levelClearedCheck(enemies_ARR, ROM.mapLevel);

			// alert("LEVEL CLEARED === " + ROM.game.statusInfo.cleared_level + " COMPLETED === " + ROM.game.statusInfo.cleared_all);

			test_battleOver_returnWin();
		}

		if(BATTLE_NAV.game.result === "LOSE")
		{
			test_battleOver_returnLose();
		}
	}


	function test_battleOver_returnWin()
	{
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).html("");
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).html(theBattle.grave.html);
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).removeAttr("data-npc");
		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).removeClass("collideCheck-field");

		$("#" + theBattle.grave.ref).removeAttr("id");

		$("#" + enemies_ARR[ROM.enemy.character.array_index].id).addClass("field-floor-" + LEVEL_MAIN.landType);

		test_battleOver_setControlsBasic();

		test_battleOver_prepareForReturn();
	}



	function test_battleOver_returnLose()
	{
		$("#microBattle_player_wrapper #player1").html("");
		$("#microBattle_player_wrapper #player1").html(theBattle.html.zombie);
		$("#microBattle_player_wrapper #player1 #_enemy_zombie").removeAttr("id");

		test_battleOver_zombie();
	}

	function test_battleOver_zombie()
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

		// battleOver_prepareForReturn();

		test_battleOver_setControlsBasic();

		test_battleOver_prepareForReturn();

	}









	function test_battleOver_setControlsBasic()
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

	function test_battleOver_prepareForReturn()
	{
		$(".tween-return_wrapper")[0].addEventListener("webkitTransitionEnd", test_battleOver_cleanup, false);
		$(".tween-return_wrapper")[0].addEventListener("transitionend", test_battleOver_cleanup, false);

		$(".return_wrapper").removeClass("return_wrapper_show");
	}

	function test_battleOver_cleanup(event)
	{
		$(".tween-return_wrapper")[0].removeEventListener("webkitTransitionEnd", test_battleOver_cleanup, false);
		$(".tween-return_wrapper")[0].removeEventListener("transitionend", test_battleOver_cleanup, false);

		$("#display_inner_info #battleScreen").html("");
		$("#display_inner_info #battleScreen").removeAttr("style");

		$("#display_inner_info #battleScreenFade").removeAttr("style");
		$("#display_inner_info #battleScreenFade").removeAttr("class");

		// REMOVE ALL TIMERS FROM THIS ANIMATION FLOW
		timerList_stopAll();
		timerList_destroy();

		moveStageTest();
	}


// $("#display_wrapper #display_inner_world").html(theBattle.html.display_inner_world);









