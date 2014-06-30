var battleEngine = 	{
						track_draw	: 0,
						track_win	: 0,
						track_lose	: 0,
						track_play	: 0,
						
						playerLevelSettings : null,
						
						bossBattleRound : 0,
						bossBattleRoundMax : 0,
						
						battlesComplete : false,
						
						areasClearedStatus : null,
						
						init : function(areas, e, m, h, s, rounds)
						{
							this.playerLevelSettings = {};
							
							this.playerLevelSettings = {
															easy		: e,
															medium		: m,
															high		: h,
															max_super	: s
														};
							
							this.areasClearedStatus = new Array();
							
							for(var i = 0; i < areas; i++)
							{
								this.areasClearedStatus.push(false);
							}
							
							this.bossBattleRoundMax = rounds;
							
							// alert("BATTLE ENGINE INIT");
						},
						
						playerLevelSort : function(player_ob)
						{
							if(player_ob.level >= this.playerLevelSettings.easy && player_ob.level < this.playerLevelSettings.medium)
							{
								player_ob.battle_class = "APPRENTICE";
								player_ob.fullStrike = 51;
								player_ob.magic = 5;
							}
					
							else if(player_ob.level >= this.playerLevelSettings.medium && player_ob.level < this.playerLevelSettings.high)
							{	
								player_ob.battle_class = "KNIGHT";
								player_ob.fullStrike = 71;
								player_ob.magic = 40;
							}
					
							else if(player_ob.level >= this.playerLevelSettings.high && player_ob.level < this.playerLevelSettings.max_super)
							{		
								player_ob.battle_class = "MASTER";
								player_ob.fullStrike = 91;
								player_ob.magic = 60;
							}
					
							else
							{
								player_ob.battle_class = "LORD";
								player_ob.fullStrike = 101;
								player_ob.magic = 80;
							}			
						},
											
						playerProgress : function(player_win, player_lose, enemy)
						{
							var updateLevel = false;
							var updateValue;
							
							if(player_win.level > player_lose.level)
							{
								updateLevel = false;
							}
							
							if(player_win.level === player_lose.level)
							{
								updateLevel = true;
								updateValue = player_win.level += 1;
							}
							
							if(player_win.level < player_lose.level)
							{
								updateLevel = true;
								
								if(enemy)
								{
									updateValue = player_win.level += player_lose.level;
								}
								
								else
								{
									updateValue = player_win.level += Math.round(player_lose.level * 0.25); //0.5	
								}
							}
							
							if(updateLevel)
							{
								player_win.level = updateValue;
								
								this.playerLevelSort(player_win);
							}							
						},
						
						battle : function(player_ob, enemy_ob, boss)
						{
							var battleData = {};
							
							var finalMagic = 0;
							
							var levelDrop = 0;
							
							this.track_play ++;
							
							// IF CLASS === "MASTER && MASTER"
							
							if(player_ob.battle_class === enemy_ob.battle_class)
							{
								if(player_ob.level >= enemy_ob.level)
								{
									// IF PLAYER_1 LEVEL IS GREATER BY 20 THEY GET FULL MAGIC
									
									if(Math.abs(player_ob.level - enemy_ob.level) > 20)
									{
										finalMagic = player_ob.magic;
									}
									
									// IF PLAYER_1 LEVEL IS ONLY SLIGHTLY GREATER THEY GET LESS MAGIC
									
									else if(Math.abs(player_ob.level - enemy_ob.level) > 10)
									{
										finalMagic = Math.floor(player_ob.magic * 0.25);
									}
									
									// FOR LESS EXPERIENCE AT THAT LEVEL
									else
									{
										finalMagic = Math.floor(player_ob.magic * 0.5);
									}	
								}
								
								else
								{
									finalMagic = Math.floor(player_ob.magic * 0.5);
								}
							}
							
							else
							{
								finalMagic = player_1.magic;
							}
							
							battleData.player_attack = Math.floor(Math.random() * (player_ob.fullStrike - finalMagic) + finalMagic);
							battleData.enemy_attack = Math.floor(Math.random() * (enemy_ob.fullStrike - enemy_ob.magic) + enemy_ob.magic);
							
							if(cheatMode)
							{
								battleData.enemy_attack = -1;
							}
							
							if(autoLose)
							{
								battleData.enemy_attack = 1000;
							}
							
							
							//////// ---------- DRAW
							
							
							if(battleData.player_attack === battleData.enemy_attack)
							{
								battleData.status_player = battleData.status_enemy = "DRAW";
								
								this.track_draw ++;
							}
							
							//////// ---------- WIN
							
							if(battleData.player_attack > battleData.enemy_attack)
							{
								battleData.status_player = "WIN";
								battleData.status_enemy = "LOSE";
								
								this.playerProgress(player_ob, enemy_ob, false);
								
								if(boss)
								{
									if(this.bossBattleRound < this.bossBattleRoundMax)
									{
										this.bossBattleRound++;
										
										alert("BOSS LOSE " + this.bossBattleRound);
									}
									
									if(this.bossBattleRound === this.bossBattleRoundMax)
									{
										// alert("BOSS FULLY LOSE");
										
										enemy_ob.alive = false;
										// enemy_ob.active = false;
										
										this.battlesComplete = true;										
									}
									
								}
								
								else
								{
									enemy_ob.alive = false;
									//enemy_ob.active = false;
								}
								
								this.playerLevelSort(player_ob);
								
								this.track_win ++;
							}
							
							//////// ---------- LOSE
							
							else
							{
								battleData.status_player = "LOSE";
								battleData.status_enemy = "WIN";
								
								levelDrop = Math.round(Math.abs(player_ob.level - player_ob.level * 0.4));
								
								this.playerProgress(enemy_ob, player_ob, true, levelDrop);
								
								this.playerLevelSort(enemy_ob);
								
								this.track_lose ++;					
							}
							
							
							return battleData;
						},
						
/*
						enemyDeadCheck : function(checkArray, area)
						{
							var deathData = new Array();
							
							for(var i in checkArray)
							{
								if(enemyArray[i].area === area)
								{
									if(!checkArray[i].alive)
									{
										deathData.push(checkArray[i].id);
									}
								}
							}
							
							return deathData;	
						},
*/
						
						enemyAllDeadCheck : function(checkArray, ignore_id, area)
						{
							var deathData = {};
							
							deathData.enemy_level_dead = true;
							deathData.enemy_game_dead = true;
							
							
							for(var i in checkArray)
							{
								if(checkArray[i]._id != ignore_id)
								{
									if(checkArray[i].area === area)
									{
/*
										if(checkArray[i].alive || checkArray[i].active)
										{
											deathData.enemy_level_dead = false;
											
											break;
										}
*/
										if(checkArray[i].alive)
										{
											deathData.enemy_level_dead = false;
											
											break;
										}

									}	
								}
							}
							
							trace(this.areasClearedStatus);
							trace(deathData.enemy_level_dead);
							
							if(deathData.enemy_level_dead)
							{
								this.areasClearedStatus[area] = true;
								
								for(var j in this.areasClearedStatus)
								{
									if(!this.areasClearedStatus[j])
									{
										deathData.enemy_game_dead = false;
									
										break;
									}
								} 
							}
							
							else
							{
								deathData.enemy_game_dead = false;
							}
							
							return deathData;
						}
					};