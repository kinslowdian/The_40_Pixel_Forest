	
	var ROM;
	
	// reference as ME.
	var player_1 = {};
	
	var player_2;
	
	var battleNavButtonARR = new Array();
	
	var finalBattle = false;
	
	var navExist = false;
	
	var battleNavButtonARR = new Array();
	
	var introBattle = true;
	
	var Logic;
	
	var battleNav_HTML;
	var battleNavFight_HTML;
	
	var y_hide;
	var y_show;
	
	var y_hide_css;
	var y_show_css;
	
	var battleEndStatus;
	
	function NEW_GAME()
	{
		ROM = new GAME();
		
		ROM.pressPlayOnTape();
		
		battleNavCreate_css();
		
		battleNavInit();
		
		navExist ? setup_Nav() : create_Nav();
	}
	
	function battleNavCreate_css()
	{
		y_hide = -211;
		y_show = 0;
		
		y_hide_css = 	{
							"-webkit-transform"	: "translateY(" + y_hide + "px)",
							"transform"			: "translateY(" + y_hide + "px)"
						};
							
		y_show_css = 	{
							"-webkit-transform"	: "translateY(" + y_show + "px)",
							"transform"			: "translateY(" + y_show + "px)"
						};		
	}
	
	function create_Nav()
	{
		$(document)[0].addEventListener("EVENT_HTML_LOADED", create_NavDone, false);
		
		var lf = Logic.dat_ROM["_HTML-EXT"]["file_battles"]["file"];
		var lh = new load_HTML(lf, $("#battles"));
	}
	
	function create_NavDone(event)
	{
		$(document)[0].removeEventListener("EVENT_HTML_LOADED", create_NavDone, false);
		
		// stops flickker
		$("#battles > div").removeClass("safety");
		
		navExist = true;
		
		setup_Nav();
	}
		
	function setup_Nav()
	{
		trace("setup_Nav(); / init");
		
		battleNav_HTML = $("#battle-nav").html();
		
		battleNavFight_HTML = $("#battle-nav-fight").html();
		$("#battle-nav-fight").html("");
	}
	
	function init_difficulty_data()
	{
		Logic = new Object();
		
		Logic.dat_FILE = "setup.json";
		Logic.dat_ROM;
		Logic.dat_COMPLETE = loaded_difficulty_data;
		
		get_JSON(Logic);
	}
	
	function loaded_difficulty_data()
	{
		trace(Logic.dat_ROM);
		
		if(!ext_html_path)
		{
			ext_html_path = Logic.dat_ROM["_HTML-EXT"]["file_path"]["url"];
			
			trace(ext_html_path);
		}
		
		prepIntroDataInit();
	}
	
	
	function battleNavInit()
	{
		// alert("battleNavInit()!!!!!");
		
		// JSON
		// total areas, easy, med, hard, super, boss rounds
		battleEngine.init(3, 0, 40, 80, 120, 3);
		
		player_1_init();
	}
	
	function player_1_init()
	{
		player_1.level 			= 0;
		player_1.attack 		= 0;
		player_1.battle_class 	= "";
		player_1.win 			= false;
		player_1.status 		= "";				
			
		battleEngine.playerLevelSort(player_1);
	}
	
	function player_1_connect()
	{
		player_1.button_0 		= $("#battle-stone");
		player_1.button_1 		= $("#battle-paper");
		player_1.button_2 		= $("#battle-scissors");
	}
	
	function player_1_purge()
	{
		player_1.attack = 0;
		player_1.win = false;		
	}
	
	function player_1_player_2_battle(player_e)
	{
		var result;
		
		battleEngine.playerLevelSort(player_e);
		
		// TO DETECT BOSS FIGHTS:
		finalBattle ? result = battleEngine.battle(player_1, player_e, true) : result = battleEngine.battle(player_1, player_e, false);
	
		
		trace("BATTLE CHECK!!! == ");
		trace(result);
		
		if(result.status_player)
		{
			StonePaperScissorsEndLogic(result.status_player);
		}
	
		else
		{
			trace("BATTLE OBJECT RETRUNED A FAULT");
		}
		
		
/*
		switch(result.status_player)
		{
			case "WIN":
			{
				// send signal WIN to cloud
				
				break;
			}
			
			case "DRAW":
			{
				// send signal DRAW to cloud
				
				break;
			}
			
			case "LOSE":
			{
				// send signal LOSE to cloud
				
				break;
			}
			
			default:
			{
				trace("BATTLE OBJECT RETRUNED A FAULT");
			}	
		}
*/
	}
	
	function battleCompleteTrackker()
	{
		var allDead = battleEngine.enemyAllDeadCheck(enemyArray, "boss", GAME_LEVEL);
		
		if(allDead.enemy_level_dead)
		{
			// LEVEL CLEARED	
		}
		
		if(allDead.enemy_game_dead)
		{
			if(!finalBattle)
			{
				finalBattle = true;
				
				// PATH TO BOSS IS OPEN	
			}				
		}
	}
	
	
	
	
	
	
	/// clean
	
	function cloudDisplay()
	{
		$("#info-cloud p").text(Logic.dat_ROM["_LOGIC"]["messages"]["txt_BEG"]);
		
		$("#battle-cloud").css(y_show_css);
		
		
		$("#eventFill").addClass("flood-full eventFill-color-dark");
		$("#eventFill").css("visibility", "visible");
		$("#eventFill").css("opacity", "1");
		
		$(".tween-battle-cloud")[0].addEventListener("webkitTransitionEnd", StonePaperScissorsCloudInPlace, false);
		$(".tween-battle-cloud")[0].addEventListener("transitionend", StonePaperScissorsCloudInPlace, false);		
		
		if(introBattle)
		{
			// alert("if(introBattle)");
			
			// hard written setting
			//battleInfo("BOSS", true, 1000); //1000
			
			// player_1_player_2_battle(player_e);
			
			// fake boss
			ROM.enemy = {};
			ROM.enemy.buildData = {};
			ROM.enemy.buildData.charHead = "BOSS";
		}
		
		else
		{
			normalBattle();
		}
	}
	
	function normalBattle()
	{
		$("#battle-nav").html(battleNav_HTML);
		
		// BREAK_POINT
		// player_1_player_2_battle(ROM.enemy);
		
		// BY-PASS
		// battleInfo(GAME.enemy.buildData.charHead, false, 1000);
	}
	
	// BY-PASS
/*
	function battleInfo(ID, SUPER, LEVEL)
	{
		ME = new Player1();
		
		ME.setupBattle(ID, SUPER, LEVEL);
	}
*/
			
	function StonePaperScissorsCloudInPlace(event)
	{
		// ME.connect();
		
		player_1_connect();	
		
		$(".tween-battle-cloud")[0].removeEventListener("webkitTransitionEnd", StonePaperScissorsCloudInPlace, false);
		$(".tween-battle-cloud")[0].removeEventListener("transitionend", StonePaperScissorsCloudInPlace, false);	
			
		StonePaperScissorsControls(true);
	}
			
	function StonePaperScissorsControls(run)
	{
		if(run)
		{
			for(var i = 0; i < 3; i++)
			{
				if(OS === "MOUSE_TOUCH")
				{
					$(player_1["button_" + i]).css("cursor", "pointer");
					
					$(player_1["button_" + i])[0].addEventListener("click", StonePaperScissorsEvent, false);
					
					$(player_1["button_" + i])[0].addEventListener("mouseover", StonePaperScissorsMouseEvent, false);
					$(player_1["button_" + i])[0].addEventListener("mouseout", StonePaperScissorsMouseEvent, false);
				}
						
				if(OS === "TOUCH" || OS === "TOUCH_TABLET")
				{
					$(player_1["button_" + i])[0].addEventListener("touchend", StonePaperScissorsEvent, false);
				}
			}
		}
		
		else
		{
			for(var j = 0; j < 3; j++)
			{
				if(OS === "MOUSE_TOUCH")
				{
					$(player_1["button_" + j]).css("cursor", "default");
					
					$(player_1["button_" + j])[0].removeEventListener("click", StonePaperScissorsEvent, false);
					
					$(player_1["button_" + j])[0].removeEventListener("mouseover", StonePaperScissorsMouseEvent, false);
					$(player_1["button_" + j])[0].removeEventListener("mouseout", StonePaperScissorsMouseEvent, false);
				}
						
				if(OS === "TOUCH" || OS === "TOUCH_TABLET")
				{
					$(player_1["button_" + j])[0].removeEventListener("touchend", StonePaperScissorsEvent, false);
				}
			}			
		}
	}
	
	function StonePaperScissorsMouseEvent(event)
	{
		event.type === "mouseover" ? $(event.target).css("opacity", "0.5") : $(event.target).css("opacity", "1");
	}
			
	function StonePaperScissorsEvent(event)
	{
		StonePaperScissorsControls(false);
		
		$(event.target).css("opacity", "1");
		
		$("#info-cloud").css("opacity", "0");
				
		var ID = event.target.parentElement.id; 
				
		$("#" + ID + " .battleNavShock").css("opacity", 1);
		$("#" + ID + " div[class*='battleNavSprite-']").addClass("tween-battle-selected");
		
		
		// ME.player1_STRIKE = workable_ID(ID);
		
		player_1.selection = workable_ID(ID);
		
		if(introBattle)
		{
			StonePaperScissorsEndLogic("LOSE");
		}
		
		else
		{
			player_1_player_2_battle(ROM.enemy);
		}
		
/*
		if(!introBattle)
		{
			player_1_player_2_battle(ROM.enemy);	
		}
*/
		
		
		var choiceDelay = new AnimationTimer();
		choiceDelay.time(1, removeChoiceButtons);
		
		// StonePaperScissorsLogic();		
	}
	
	function workable_ID(mess)
	{
		var a = mess.slice(mess.search("-") + 1, mess.length);
		var b = a.toUpperCase();
		
		return b;
	}
	
	function StonePaperScissorsEndLogic(result_id)
	{
		battleEndStatus = result_id;
		
		player_2 = {};
		
		switch(result_id)
		{
			case "WIN":
			{
				if(player_1.selection === "STONE")
				{
					player_2.selection = "SCISSORS";
				}
				
				if(player_1.selection === "PAPER")
				{
					player_2.selection = "STONE";
				}
				
				if(player_1.selection === "SCISSORS")
				{
					player_2.selection = "PAPER";
				}
				
				break;
			}
			
			case "LOSE":
			{
				if(player_1.selection === "STONE")
				{
					player_2.selection = "PAPER";
				}
				
				if(player_1.selection === "PAPER")
				{
					player_2.selection = "SCISSORS";
				}
				
				if(player_1.selection === "SCISSORS")
				{
					player_2.selection = "STONE";
				}
				
				break;
			}
			
			case "DRAW":
			{
				player_2.selection = player_1.selection;
				
				break;
			}
		}
	}
	
/*
	function StonePaperScissorsLogic()
	{
		// Figure out main outcome
		
		var gameLogic = Math.floor(Math.random() * 100);
		
		// enemy leveling = 0 , 5, 10, 1000 (SUPER)
		
		// LOSE
		if(gameLogic >= Logic.dat_ROM["_LOGIC"]["player2_Level_" + ME.player2_LEVEL].rangeL[0] && gameLogic <= Logic.dat_ROM["_LOGIC"]["player2_Level_" + ME.player2_LEVEL].rangeL[1])
		{
			trace("logic == LOSE");
			
			ME.player2_EVENT = "WIN";
		}
		
		// DRAW	
		else if(gameLogic >= Logic.dat_ROM["_LOGIC"]["player2_Level_" + ME.player2_LEVEL].rangeD[0] && gameLogic <= Logic.dat_ROM["_LOGIC"]["player2_Level_" + ME.player2_LEVEL].rangeD[1])
		{
			trace("logic == DRAW");
			
			ME.player2_EVENT = "DRAW";
		}
		
		// WIN
		else if(gameLogic >= Logic.dat_ROM["_LOGIC"]["player2_Level_" + ME.player2_LEVEL].rangeW[0] && gameLogic <= Logic.dat_ROM["_LOGIC"]["player2_Level_" + ME.player2_LEVEL].rangeW[1])
		{
			trace("logic == WIN");
			
			ME.player2_EVENT = "LOSE";
		}
		
		// DRAW - FAULT
		else
		{
			trace("logic == DRAW / FAULT");
			
			ME.player2_EVENT = "DRAW";
		}
		
		// Choice to match outcome
		
		switch(ME.player2_EVENT)
		{
			case "WIN":
			{
				if(ME.player1_STRIKE === "STONE")
				{
					ME.player2_STRIKE = "PAPER";
				}
				
				if(ME.player1_STRIKE === "PAPER")
				{
					ME.player2_STRIKE = "SCISSORS";
				}
				
				if(ME.player1_STRIKE === "SCISSORS")
				{
					ME.player2_STRIKE = "STONE";
				}
				
				break;	
			}
			
			case "DRAW":
			{
				ME.player2_STRIKE = ME.player1_STRIKE;
								
				break;
			}
			
			case "LOSE":
			{
				if(ME.player1_STRIKE === "STONE")
				{
					ME.player2_STRIKE = "SCISSORS";
				}
				
				if(ME.player1_STRIKE === "PAPER")
				{
					ME.player2_STRIKE = "STONE";
				}
				
				if(ME.player1_STRIKE === "SCISSORS")
				{
					ME.player2_STRIKE = "PAPER";
				}
								
				break;
			}
		}
		
		trace("ME == " + ME.player1_STRIKE + " THEM == " + ME.player2_STRIKE);
	}
*/
	
	function addChoiceButtons()
	{
		$("#info-cloud").css("opacity", "1");
		$("#battle-nav").removeClass("battle-nav-hide").addClass("battle-nav-show");
	}
	
	
	function removeChoiceButtons()
	{
		trace("boom");
		
		$("#battle-nav")[0].addEventListener("webkitTransitionEnd", removeChoiceButtonsEnd, false);
		$("#battle-nav")[0].addEventListener("transitionend", removeChoiceButtonsEnd, false);
		
		$("#battle-nav").removeClass("battle-nav-show").addClass("battle-nav-hide");
		
		// $("#battle-nav")[0].addEventListener("webkitTransitionEnd", populateNavBattle, false);
		// $("#battle-nav")[0].addEventListener("transitionend", populateNavBattle, false);
		
		$("#info-cloud p").text(Logic.dat_ROM["_LOGIC"]["messages"]["txt_STR"]);
		
/*
		$("#battle-nav-fight").html(battleNavFight_HTML);
		
		$("#battle-nav-fight").css(y_hide_css);
*/
	}
	
	function removeChoiceButtonsEnd(event)
	{
		$("#battle-nav")[0].removeEventListener("webkitTransitionEnd", removeChoiceButtonsEnd, false);
		$("#battle-nav")[0].removeEventListener("transitionend", removeChoiceButtonsEnd, false);
		
		// $("#battle-nav-fight").css(y_hide_css);
		
		$("#battle-nav-fight").html(battleNavFight_HTML);	
		
		/* $("#battle-nav-fight").css("visibility", "visible"); */
		
		populateNavBattle();	
	}
	
	function populateNavBattle()
	{
		trace("GOOD");
		
/*
		$("#battle-nav")[0].removeEventListener("webkitTransitionEnd", populateNavBattle, false);
		$("#battle-nav")[0].removeEventListener("transitionend", populateNavBattle, false);
*/
		
		
		$("#battle-nav").html("");
		
		// P1 HEAD
		$("#battle-nav-player1 .battleCute-warrior-head").addClass("battleCute-warrior-head-goat");
		
		// P2 HEAD
		switch(ROM.enemy.buildData.charHead)
		{
			case "BOSS":
			{
				$("#battle-nav-player2 .battleCute-warrior-head").addClass("battleCute-warrior-head-boss");
				
				break;
			}
			
			// TEMP
			
			case "GRIZ":
			{
				$("#battle-nav-player2 .battleCute-warrior-head").addClass("battleCute-warrior-head-griz");
				
				break;
			}
			
			case "BIRD":
			{
				$("#battle-nav-player2 .battleCute-warrior-head").addClass("battleCute-warrior-head-bird");
				
				break;
			}
			
			// TEMP
		}
		
		// EYES
		
		$("#battle-nav-player1 .battleCute-warrior-head .battleCute-eyes-sprite").addClass("battleCute-eyes-look-R");
		
		$("#battle-nav-player2 .battleCute-warrior-head .battleCute-eyes-sprite").addClass("battleCute-eyes-look-L");
		
		alert("P1 = " + player_1.selection + " P2 = " + player_2.selection);
		
		// P1 SPEECH
		
		populateResultsDisplay(player_1.selection, "#battle-nav-player1");
			
		// P2 SPEECH
		populateResultsDisplay(player_2.selection, "#battle-nav-player2");
				
		$("#battle-nav-fight").addClass("tween-battle-nav-fight");
		
		// var d = setTimeout(showNavBattle, 1000);
				
		showNavBattle();
	}
	
	function populateResultsDisplay(store, id)
	{
		trace(id + " " + store);
		
		switch(store)
		{
			case "STONE":
			{
				$(id + " .battleCute-speak-icon").addClass("battleCute-stone");
				
				break;
			}
			
			case "PAPER":
			{
				$(id + " .battleCute-speak-icon").addClass("battleCute-paper");
				
				break;
			}
			
			case "SCISSORS":
			{
				$(id + " .battleCute-speak-icon").addClass("battleCute-scissors");
				
				break;
			}
		}		
	}
	
	
	function showNavBattle()
	{
		// $("#battle-nav-fight").removeClass("battle-nav-hide").addClass("battle-nav-show");
		
		$("#battle-nav-fight").css(y_show_css);
		
		$(".tween-battle-nav-fight")[0].addEventListener("webkitTransitionEnd", showNavBattleInPlace, false);
		$(".tween-battle-nav-fight")[0].addEventListener("transitionend", showNavBattleInPlace, false);
	}
	
	function showNavBattleInPlace(event)
	{
		$(".tween-battle-nav-fight")[0].removeEventListener("webkitTransitionEnd", showNavBattleInPlace, false);
		$(".tween-battle-nav-fight")[0].removeEventListener("transitionend", showNavBattleInPlace, false);
		
		var intoCountDownDelay = new AnimationTimer();
		intoCountDownDelay.time(1, startBattleCountDown);
	}
	
	function startBattleCountDown()
	{
		$("#battle-nav-player1 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-R").addClass("battleCute-eyes-look-C");
		
		$("#battle-nav-player2 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-L").addClass("battleCute-eyes-look-C");
		
		
		
		
		$("#battle-nav-playerBird .battleCute-bird-board").addClass("tween-battleCute-bird-countDown");
		
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].addEventListener("webkitAnimationEnd", startBattleCountingDown, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].addEventListener("animationend", startBattleCountingDown, false);		
	}
	
	function startBattleCountingDown(event)
	{
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].removeEventListener("webkitAnimationEnd", startBattleCountingDown, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].removeEventListener("animationend", startBattleCountingDown, false);
	 	
	 	$("#battle-nav-playerBird .battleCute-bird-arm-inner").addClass("tween-battleCute-bird-arm-main-fire");
	 			
	 	$("#battle-nav-playerBird .battleCute-eyes-sprite").removeClass("battleCute-eyes-norm").addClass("battleCute-eyes-happy");
	 	
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main").addClass("tween-battleCute-bird-arm-main-intoFly");
	 			
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].addEventListener("webkitAnimationEnd", clearStageForFightInit, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].addEventListener("animationend", clearStageForFightInit, false);
	 	
	 	$("#info-cloud").css("opacity", "1");
	 	
	}
	
	function clearStageForFightInit(event)
	{
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].removeEventListener("webkitAnimationEnd", clearStageForFightInit, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].removeEventListener("animationend", clearStageForFightInit, false);	
	 	
	 	var clearStage = new AnimationTimer();
	 	clearStage.time(1, clearStageForFight);			
	}
	
	function clearStageForFight()
	{
		$("#info-cloud").css("opacity", "0");
		
		$("#battle-nav-playerBird .battleCute-bird-arm-main").removeClass("tween-battleCute-bird-arm-main-intoFly").addClass("tween-battleCute-bird-arm-main");
	 			
	 	$("#battle-nav-playerBird").addClass("tween-bird-flapAway");	
	
	 	$("#battle-nav-playerBird")[0].addEventListener("webkitAnimationEnd", clearedStage, false);
	 	$("#battle-nav-playerBird")[0].addEventListener("animationend", clearedStage, false);
	}
	
	function clearedStage(event)
	{
	 	$("#info-cloud p").text(Logic.dat_ROM["_LOGIC"]["messages"]["txt_" + battleEndStatus]);
	 	
	 	$("#battle-nav-playerBird")[0].removeEventListener("webkitAnimationEnd", clearedStage, false);
	 	$("#battle-nav-playerBird")[0].removeEventListener("animationend", clearedStage, false);		
	 	
		$("#battle-nav-player1 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-C").addClass("battleCute-eyes-look-R");
		$("#battle-nav-player2 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-C").addClass("battleCute-eyes-look-L");	 	
	 	
	 	
	 	$("#battle-nav-player1 .battleCute-speak-left").css("opacity", "1");
	 	$("#battle-nav-player2 .battleCute-speak-right").css("opacity", "1");
	 	
	 	var winLoseDisplay = new AnimationTimer();
	 	winLoseDisplay.time(2, battleResults);
	}
	
	function battleResults()
	{
		$("#info-cloud").css("opacity", "1");
		
		$("#battle-nav-player1 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-R").addClass("battleCute-eyes-look-C");
		$("#battle-nav-player2 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-L").addClass("battleCute-eyes-look-C");
		
		alert(battleEndStatus);
		
		switch(battleEndStatus)
		{
			case "LOSE":
			{
				$("#battle-nav-player1 .battleCute-cloud").css("opacity", "1").addClass("tween-battleCute-Cloud");	 			
	 			$("#battle-nav-player1 .battleCute-tears").css("opacity", "1");
	 			$("#battle-nav-player1 .battleCute-warrior-arm > div").removeClass("battleCute-warrior-armsDown").addClass("battleCute-warrior-armsUp");
	 			
	 			$("#battle-nav-player2 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-norm").addClass("battleCute-eyes-happy");
				
				break;
			}
			
			case "WIN":
			{
				$("#battle-nav-player2 .battleCute-cloud").css("opacity", "1").addClass("tween-battleCute-Cloud");	 			
	 			$("#battle-nav-player2 .battleCute-tears").css("opacity", "1");
	 			$("#battle-nav-player2 .battleCute-warrior-arm > div").removeClass("battleCute-warrior-armsDown").addClass("battleCute-warrior-armsUp");
	 			
	 			$("#battle-nav-player1 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-norm").addClass("battleCute-eyes-happy");
	 							
				break;
			}
			
			case "DRAW":
			{
				$("#battle-nav-player1 .battleCute-warrior-arm > div").removeClass("battleCute-warrior-armsDown").addClass("battleCute-warrior-armsUp");
				$("#battle-nav-player2 .battleCute-warrior-arm > div").removeClass("battleCute-warrior-armsDown").addClass("battleCute-warrior-armsUp");				
				
				break;
			}
			
		}
		
		var resultsEndDelay = new AnimationTimer();
		resultsEndDelay.time(2, battleResultsEndInit); 
	}
	
	function battleResultsEndInit()
	{
		$("#info-cloud").css("opacity", "0");
		
		$("#info-cloud")[0].addEventListener("webkitTransitionEnd", battleResultsEnd, false);
		$("#info-cloud")[0].addEventListener("transitionend", battleResultsEnd, false);
	}
	
	function battleResultsEnd(event)
	{
		$("#info-cloud")[0].removeEventListener("webkitTransitionEnd", battleResultsEnd, false);
		$("#info-cloud")[0].removeEventListener("transitionend", battleResultsEnd, false);
		
		if(battleEndStatus === "WIN" || battleEndStatus === "LOSE")
		{
			battleEndStatus === "WIN" ? ROM.battle_RESULT = "WIN" : ROM.battle_RESULT = "LOSE";
			
			battleOver();
		}
		
		else
		{
			$("#battle-nav-fight").css(y_hide_css);
			
			$(".tween-battle-nav-fight")[0].addEventListener("webkitTransitionEnd", anotherRound, false);
			$(".tween-battle-nav-fight")[0].addEventListener("transitionend", anotherRound, false);			
		}
	}
	
	function anotherRound(event)
	{
		$(".tween-battle-nav-fight")[0].removeEventListener("webkitTransitionEnd", anotherRound, false);
		$(".tween-battle-nav-fight")[0].removeEventListener("transitionend", anotherRound, false);		
	
		$("#battle-nav-fight").html("");
		
		$("#battle-nav").html(battleNav_HTML);
		
		$("#info-cloud p").text(Logic.dat_ROM["_LOGIC"]["messages"]["txt_AGN"]);
		
		$("#battle-nav").removeClass("battle-nav-hide").addClass("battle-nav-show");
		
		$("#battle-nav")[0].addEventListener("webkitTransitionEnd", anotherRoundInPlace, false);
		$("#battle-nav")[0].addEventListener("transitionend", anotherRoundInPlace, false);
	}
	
	function anotherRoundInPlace(event)
	{
		$("#battle-nav")[0].removeEventListener("webkitTransitionEnd", anotherRoundInPlace, false);
		$("#battle-nav")[0].removeEventListener("transitionend", anotherRoundInPlace, false);
		
		$("#info-cloud").css("opacity", "1");
		
		// ME.connect();
		
		player_1_connect();
		
		StonePaperScissorsControls(true);
	}
	
	function battleOver()
	{

		// ANIMATION SWAP

/*
		$("#battle-cloud").removeClass("tween-battle-cloud-show").addClass("tween-battle-cloud-hide");
	
		$("#battle-cloud")[0].addEventListener("webkitAnimationEnd", battlePurge, false);
		$("#battle-cloud")[0].addEventListener("animationend", battlePurge, false);
*/
		
		
		// EVENT FIX
		// $("#battle-cloud")[0].addEventListener("webkitTransitionEnd", battlePurge, false);
		// $("#battle-cloud")[0].addEventListener("transitionend", battlePurge, false);
		
		$(".tween-battle-cloud")[0].addEventListener("webkitTransitionEnd", battlePurge, false);
		$(".tween-battle-cloud")[0].addEventListener("transitionend", battlePurge, false);		
		
		// $("#battle-cloud").removeClass("battle-cloud-show").addClass("battle-cloud-hide");
		
		$("#battle-cloud").css(y_hide_css);
		
		$("#eventFill").css("opacity", "0");	
	}
	
	function battlePurge(event)
	{
		trace("battlePurge();");
		trace(event.target);
		
		// HACK FIX
		
		if($(event.target).attr("id") === "battle-cloud")
		{
		
			/* alert("battlePurge();"); */
	/*
			$("#battle-cloud")[0].removeEventListener("webkitAnimationEnd", battlePurge, false);
			$("#battle-cloud")[0].removeEventListener("animationend", battlePurge, false);
	*/
	
			// EVENT FIX
			// $("#battle-cloud")[0].removeEventListener("webkitTransitionEnd", battlePurge, false);
			// $("#battle-cloud")[0].removeEventListener("transitionend", battlePurge, false);
			
			$(".tween-battle-cloud")[0].removeEventListener("webkitTransitionEnd", battlePurge, false);
			$(".tween-battle-cloud")[0].removeEventListener("transitionend", battlePurge, false);			
			
			/* $("#battle-cloud").removeClass("tween-battle-cloud"); */
			
			$("#battle-nav-fight").removeClass("battle-nav-show");
			
			
			$("#battle-nav").html("");
			$("#battle-nav-fight").html("");
			$("#battle-nav-fight").removeAttr("style");
			
/*
			battleNav_HTML = "";
			battleNavFight_HTML = "";
*/
			
			
			
			if(introBattle)
			{
				introBattle = false;
				
				endIntroBattle();
			}
			
			else
			{
				alert("NORMAL GAME RESULT");
				
				trace("ENEMY STATUS == ");
				trace(ROM.enemy);
				trace("PLAYER STATUS == ");
				trace(player_1);
				
				endBattleSceneAnimation();
			}
			
			
			
			$("#eventFill").removeClass("flood-full eventFill-color-dark");
			$("#eventFill").css("visibility", "hidden");
		}
	}
	
	function reset_battleEndStatus()
	{
		battleEndStatus = "";
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	