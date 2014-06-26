	trace("Temp.js being used -- remove from final build / release");
	
	
	var keyboardPreBattle;
	
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
										
		keyboardPreBattle.css.end	= 	{
											"-webkit-transform" : "translateY(0px)",
											"transform" 		: "translateY(0px)"	
										};
										
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
		$(window)[0].removeEventListener("keyup", keyboardPreBattle_event, false);
		
		// var keyboardSelect = keyboardPreBattle.signal["signal" + keyboardPreBattle.countTap];
		
		// var keyboardSelect_id = keyboardSelect[0].id;		
		
		var fake_event;
		
		// keyboardPreBattle.currentFocus = keyboardSelect_id;
		
		fake_event = {};
		fake_event.target = {};
		fake_event.target.id = keyboardPreBattle.currentFocus;
		
		$("#" + keyboardPreBattle.currentFocus).css(keyboardPreBattle.css.end);
		
		preBattleOptions_action(fake_event);
		
		// $("#" + keyboardPreBattle.currentFocus).css(keyboardPreBattle.css.def);
		
		// SEND TO PREBATTLE FUNCTION
		// battleNav_selection(keyboardPreBattle.currentFocus);		
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




	
	
	
	

	
	
	
	
	