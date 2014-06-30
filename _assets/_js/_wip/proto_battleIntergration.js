			var trace = function(str){ console.log(str); };
			
			
			var enemyArray = new Array();
			
			var player_1 = {};
			
			// var playerLevelSettings = {};
			
			var bossDefeat = 0;
			var bossDefeatWin = 3;
			
			
			var level_0_data;
			var level_1_data;
			
			var GAME_LEVEL = 0;
			
			var bossSet = false;
			
			var rom = {};
			
			var finalBattle = false;
			
			function init(event)
			{
				trace(event);
				
				battleEngine.init(3, 0, 40, 80, 120, 3);
				
				
/*
				playerLevelSettings = 	{
											easy		: 0,
											medium		: 40,
											high		: 80,
											max_super	: 120
										};
*/
				
				rom.levels = 3;
				rom.completed = new Array();
				
				for(var i = 0; i < rom.levels; i++)
				{
					rom.completed.push(false);
				}
				
				buildData();
				
				init_player1()
				
				populate();
				
				$(".num-plug").each(function(i)
				{
					$(this)[0].addEventListener("click", changeLevel, false);
				});
			}
			
			function changeLevel(event)
			{
				var _id = event.target.id;
				
				var level_cur = GAME_LEVEL;
				
				var level_new;
				
				switch(_id)
				{
					case "level1":
					{
						level_new = 0;
						
						break;
					}
					
					case "level2":
					{
						level_new = 1;
						
						break;
					}
					
					case "level3":
					{
						level_new = 2;
						
						break;
					}
				}
				
				if(GAME_LEVEL != level_new)
				{
					GAME_LEVEL = level_new;
					
					clearLevel();	
				}
			}
			
			function clearLevel()
			{
				$("#stage #pilgrims").html("");
				
				populate();
			}
			
			function buildData()
			{
				level_0_data = new Array();
				level_1_data = new Array();
				
				level_0_data = [0, 4, 6, 2, 8, 10, 22, 12, 33, 97, 17, 18];
				level_1_data = [100, 22, 24, 23, 29, 28, 10, 16, 26, 44, 98, 97, 96, 95];
				level_2_data = [300, 21, 22, 23, 24, 100, 94, 98];
			}
			
			function init_player1()
			{
				player_1.level 			= 0;
				player_1.attack 		= 0;
				player_1.battle_class 	= "";
				player_1.win 			= false;
				player_1.status 		= "";				
			
				battleEngine.playerLevelSort(player_1);
			}
			
			function purge_player1()
			{
				player_1.attack = 0;
				player_1.win = false;
			}
			
			
			// ADD REWRITE TO TILE
			
			function populate()
			{
				var l = 0;
				
				var rewrite = false;
				
				var levelData = window["level_" + GAME_LEVEL + "_data"];
				
				trace("populate();");
				trace(levelData);
				
				for(var i = 0; i < levelData.length; i++)
				{
					var string_id = "box_" + GAME_LEVEL + "_" + i;
					//var string_lv = Math.floor(Math.random() * (playerLevelSettings.high - playerLevelSettings.easy) + playerLevelSettings.easy);
					
					var string_lv = 0;
					var writeObject;
					
					for(var j in enemyArray)
					{
						if(enemyArray[j]._id === string_id)
						{
							rewrite = true;
							
							writeObject = enemyArray[j];
							
							break;
						}
					}
					
					rewrite ? string_lv = writeObject.level : string_lv = levelData[i];
					
					
					
					
					var enemyHTML = '<div id="' + string_id + '" class="box" data-level="' + string_lv + '"><div class="sprite"><p class="lv">00</p></div><div class="box-inner"><div class="box-meter"></div></div></div>';
				
					$("#stage #pilgrims").append(enemyHTML);
				}
			
				setup();
			}
			
			function setup()
			{
				$(".box").each(function(i)
				{
					var _id = $(this).attr("id");
					
					var rewrite = false;
					
					// $(this).on("click", clickEvent);
					
					$(this)[0].addEventListener("click", clickEvent, false);
					
					$(this).css("cursor", "pointer");
					
					for(var j in enemyArray)
					{
						if(enemyArray[j]._id === _id)
						{
							rewrite = true;
							
							break;
						}
					}
					
					
					if(!rewrite)
					{
						var E = {};
						
						E._id = _id;
						E.level = parseInt($("#" + E._id).attr("data-level"));
						E.alive = true;
						E.active = true;
						E.area = GAME_LEVEL;
						
						// $("#" + E._id + " .lv").text(E.level);
						
						enemyArray.push(E);
					}
				});
				
				// level display on characters
				
				for(var i in enemyArray)
				{
					if(enemyArray[i].area === GAME_LEVEL)
					{
						$("#" + enemyArray[i]._id + " .lv").text(enemyArray[i].level);
					}
				}
				
				
				if(!bossSet)
				{
					bossSet = true;
				
					var B = {};
				
					B._id = "boss";
					B.level = parseInt($("#" + B._id).attr("data-level"));
					B.alive = true;
					B.active = true;
					
					// $("#" + B._id).on("click", clickEvent);
					
					$("#" + B._id)[0].addEventListener("click", clickEvent, false);
					
					$("#" + B._id).css("cursor", "pointer");
					
					$("#" + B._id + " .lv").text(B.level);
						
					enemyArray.push(B);	
				}			
				
				splitDifficulty();
				
				$("#superPill")[0].addEventListener("click", superPillEat, false);
				
				checkAliveInit();
			}
			
			function checkAliveInit()
			{
				for(var i in enemyArray)
				{
					if(enemyArray[i].area === GAME_LEVEL)
					{
						checkAlive(enemyArray[i]);
					}
				}
			}
			
			function checkAlive(player_e)
			{
				var kill_css;
				
				if(!player_e.alive || !player_e.active)
				{
					kill_css = 	{
									"opacity" : 0,
									"cursor" : "auto"
								};
					
					$("#" + player_e._id).css(kill_css);
					
					$("#" + player_e._id)[0].removeEventListener("click", clickEvent, false);
				}
			}
			
			function superPillEat(event)
			{
				player_1.level += 100;
				
				battleEngine.playerLevelSort(player_1);
				
				updateDisplay(enemyArray[0]);
			}
			
			function splitDifficulty()
			{
				for(var i in enemyArray)
				{
					battleEngine.playerLevelSort(enemyArray[i]);
					
					showEnemyPower(enemyArray[i]);
				}
			}
			
			
			function showEnemyPower(player_e)
			{
				var meter_css;
				var meter_scale;
				
				if(player_e.alive)
				{
					if(player_e.battle_class === "APPRENTICE")
					{
						meter_scale = 0.25;
					}
						
					else if(player_e.battle_class === "KNIGHT")
					{
						meter_scale = 0.5;
					}
						
					else if(player_e.battle_class === "MASTER")
					{		
						meter_scale = 0.75;
					}
						
					else if(player_e.battle_class === "LORD")
					{
						meter_scale = 1;
					}
					
					meter_css = {
									"-webkit-transform"	: "scaleX(" + meter_scale + ")",
									"transform"			: "scaleX(" + meter_scale + ")"
								};
						
					$("#" + player_e._id + " .box-inner .box-meter").css(meter_css);					
				}
			}			

			
			function clickEvent(event)
			{
				for(var i in enemyArray)
				{
					if(event.target.id === enemyArray[i]._id)
					{
						sortEnemy(enemyArray[i]);
						
						break;
					}
				}
			}
			
			
			function sortEnemy(player_e)
			{
				// var result = battleEngine.battle(player_1, player_e, false);
				
				var result;
				
				finalBattle ? result = battleEngine.battle(player_1, player_e, true) : result = battleEngine.battle(player_1, player_e, false);
				
				// trace(result);
				// trace(battleEngine);
				
				switch(result.status_player)
				{
					case "WIN":
					{
						if(player_e._id !== "boss")
						{
							$("#" + player_e._id).css("opacity", 0);	
							
							// checkEnemyDeaths();
						
							checkEnemyDeathsBasic();
						}
						
						if(player_e._id === "boss")
						{
								
						}
						
						if(battleEngine.battlesComplete)
						{
							$("#" + player_e._id).css("opacity", 0);
							
							alert("COMPLETE");
						}
						
						
						break;
					}
					
					case "DRAW":
					{
						
						break;
					}
					
					case "LOSE":
					{
						// battleEngine.playerLevelSort(player_e);
							
						showEnemyPower(player_e);
						
						$("#" + player_e._id + " .lv").text(player_e.level);
						
						break;
					}
					
					default:
					{
						trace("OBJECT RETURN FAULT");
					}
				}
				
				updateDisplay(player_e);
				
				track_rating();
				
				
			}
			
			function checkEnemyDeathsBasic()
			{
				var allDead = battleEngine.enemyAllDeadCheck(enemyArray, "boss", GAME_LEVEL);
				
				trace("!!!! allDead object >");
				trace(allDead);

				if(allDead.enemy_level_dead)
				{
					// alert("LEVEL CLEARED");
				}
				
				
				if(allDead.enemy_game_dead)
				{
					// alert("BOSS PREP");
					
					if(!finalBattle)
					{
						finalBattle = true;
							
						bossTime();	
					}	
				}


/*
				if(allDead)
				{
					if(!finalBattle)
					{
						finalBattle = true;
							
						bossTime();	
					}					
				}
*/
			}
			
			function checkEnemyDeaths()
			{
				var enemy_level_dead = true;
				var enemy_game_dead = true;
				
				for(var i in enemyArray)
				{
					if(enemyArray[i]._id != "boss")
					{
						if(enemyArray[i].area === GAME_LEVEL)
						{
							if(enemyArray[i].alive || enemyArray[i].active)
							{
								enemy_level_dead = false;
							
								break;
							}
						}
					}
				}
				
				if(enemy_level_dead)
				{
					rom.completed[GAME_LEVEL] = true;
					
					for(var j in rom.completed)
					{
						if(!rom.completed[j])
						{
							enemy_game_dead = false;
						}
					}
					
					if(enemy_game_dead)
					{
						// alert("BRING IN BOSS");
					
						if(!finalBattle)
						{
							finalBattle = true;
							
							bossTime();	
						}
					}
				}
				
				trace(rom.completed);
			}
			
			function bossTime()
			{
				var boss_css;
				
				boss_css	= 	{
									"-webkit-transform"	: "translateY(0px)",
									"transform"			: "translateY(0px)"
								};
				
				$("#boss").css(boss_css);
			}
			
			
			function updateDisplay(player_e)
			{
				$("#info_p1 .level").text(player_1.level);
				$("#info_p2 .level").text(player_e.level);
				
				$("#info_p1 .class").text(player_1.battle_class);
				$("#info_p2 .class").text(player_e.battle_class);
				
				$("#info_p1 .num").text(player_1.attack);
				$("#info_p2 .num").text(player_e.attack);
			
			}
			
			function track_rating()
			{
				var bar_css;
							
				var bar_scale =  Math.round((battleEngine.track_win / battleEngine.track_play) * 100) * 0.01;
							
				bar_css = 	{
								"-webkit-transform"	: "scaleX(" + bar_scale + ")",
								"transform"			: "scaleX(" + bar_scale + ")"
							};
							
				$("#finalScore #scoreMeter #scoreMeterBar").css(bar_css);				
			}