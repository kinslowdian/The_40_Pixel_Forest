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


	/////////////////////////// BATTLE NAV UPDATE
	
	function battleNav_init_extended()
	{
		BATTLE_NAV.animation = {};
		BATTLE_NAV.animation.html = {};
		
		// BATTLE_NAV.game = {};
		// BATTLE_NAV.game.result = "LOSE";
		
		test_punchAttackInit();		
	}
	
	function test_punchAttackInit()
	{	
		BATTLE_NAV.animation.punchTotal = 10;
		BATTLE_NAV.animation.smashed = false;
		
		BATTLE_NAV.animation.playheadDelay = new AnimationTimer();
		timerList_add(BATTLE_NAV.animation.playheadDelay);
		
		BATTLE_NAV.animation.firstPunch = false;
		BATTLE_NAV.animation.resultRound = false;
		
		BATTLE_NAV.animation.sequenceFlow = "START_PLAYER1";
		
		BATTLE_NAV.animation.html.superPunch = $(".battleNav-superPunch").html();
		
		$(".battleNav-superPunch").html("");
	}
	
	function test_punchPositionInit()
	{
		// $("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("webkitTransitionEnd", test_punchPositionEnd, false);
		// $("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("transitionend", test_punchPositionEnd, false);
		
		// $(".battleNav-player-inner").addClass("battleNav-player-StartPos");
		
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("webkitTransitionEnd", test_punchPositionScream, false);
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("transitionend", test_punchPositionScream, false);
		
		$(".battleNav-player-head-main").addClass("tween-battleNav-smash");
		
		$(".battleNav-player-body").addClass("tween-battleNav-smash");
		
		$(".battleNav-player-legs").addClass("tween-battleNav-smash");
		
		$(".battleNav-player-shockSprite").addClass("tween-battleNav-player-shockSprite");		
		
		$(".battleNav-player-inner").addClass("battleNav-player-ThreatPos");
	}
	
	function test_punchPositionScream(event)
	{
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("webkitTransitionEnd", test_punchPositionScream, false);
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("transitionend", test_punchPositionScream, false);		
		
		$(".battleNav-player-hands").addClass("tween-battleNav-player-handsSuper");
			
		$(".battleNav-player-head").addClass("tween-battleNav-player-headWeak");
			
		$(".battleNav-player-hands").addClass("tween-battleNav-player-handsWeak");
			
		$(".battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-normal").addClass("battleNav-player-eyesSprite-sad");
			
		$(".battleNav-player-head-main").addClass("battleNav-smash-head");
			
		$(".battleNav-player-body").addClass("battleNav-smash-body");
			
		$(".battleNav-player-shockSprite").css("visibility", "visible");
		
		// BATTLE_NAV.animation.playheadDelay = setTimeout(test_punchPositionScreamEnd, 1 * 1000);		
		BATTLE_NAV.animation.playheadDelay.time(1, test_punchPositionScreamEnd);
	}
	
	function test_punchPositionScreamEnd()
	{
		$("#battleNav-player1 .battleNav-player-body")[0].addEventListener("webkitTransitionEnd", test_punchPositionReturn, false);
		$("#battleNav-player1 .battleNav-player-body")[0].addEventListener("transitionEnd", test_punchPositionReturn, false);
		
		$(".battleNav-player-hands").removeClass("tween-battleNav-player-handsSuper");
			
		$(".battleNav-player-head").removeClass("tween-battleNav-player-headWeak");
			
		$(".battleNav-player-hands").removeClass("tween-battleNav-player-handsWeak");
			
		$(".battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-sad").addClass("battleNav-player-eyesSprite-normal");
			
		$(".battleNav-player-head-main").removeClass("battleNav-smash-head");
			
		$(".battleNav-player-body").removeClass("battleNav-smash-body");
			
		$(".battleNav-player-shockSprite").css("visibility", "hidden");		
	}
	
	function test_punchPositionReturn(event)
	{
		$("#battleNav-player1 .battleNav-player-body")[0].removeEventListener("webkitTransitionEnd", test_punchPositionReturn, false);
		$("#battleNav-player1 .battleNav-player-body")[0].removeEventListener("transitionEnd", test_punchPositionReturn, false);
		
		$(".battleNav-player-head-main").removeClass("tween-battleNav-smash");
		
		$(".battleNav-player-body").removeClass("tween-battleNav-smash");
		
		$(".battleNav-player-legs").removeClass("tween-battleNav-smash");
		
		$(".battleNav-player-shockSprite").removeClass("tween-battleNav-player-shockSprite");
		
		
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("webkitTransitionEnd", test_punchPositionEnd, false);
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("transitionend", test_punchPositionEnd, false);
		
		$(".battleNav-player-inner").addClass("battleNav-player-StartPos");
	}
	
	function test_punchPositionEnd(event)
	{
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("webkitTransitionEnd", test_punchPositionEnd, false);
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("transitionend", test_punchPositionEnd, false);
		
		test_punchAttackControl("BEGIN");		
	}
	
	function test_punchAttackControl(playhead)
	{
		// var playheadDelay;
		
		switch(BATTLE_NAV.animation.sequenceFlow)
		{
			case "START_PLAYER1":
			{
				if(playhead === "BEGIN")
				{
					BATTLE_NAV.animation.firstPunch = true;
					
					test_punchAttackSet(1);
				}
				
				if(playhead === "FINISH")
				{
					BATTLE_NAV.animation.sequenceFlow = "START_PLAYER2";
					
					test_punchAttackControl("BEGIN");
				}
				
				break;
			}
			
			case "START_PLAYER2":
			{
				if(playhead === "BEGIN")
				{
					BATTLE_NAV.animation.firstPunch = true;
					
					test_punchAttackSet(2);
				}
				
				if(playhead === "FINISH")
				{
					// 2 X FIGHT ROUND
/*
					BATTLE_NAV.animation.sequenceFlow = "RETURN_PLAYER1";
					
					test_punchAttackControl("BEGIN");
*/
				
					// 1 X FIGHT ROUND
					
					BATTLE_NAV.animation.sequenceFlow = "OPTIONS";
					
					test_punchAttackControl("BEGIN");	
					
				}
				
				break;				
			}
			
			case "RETURN_PLAYER1":
			{
				if(playhead === "BEGIN")
				{
					test_punchAttackSet(1);
				}
				
				if(playhead === "FINISH")
				{
					BATTLE_NAV.animation.sequenceFlow = "RETURN_PLAYER2";
					
					test_punchAttackControl("BEGIN");					
				}
				
				break;
			}
			
			case "RETURN_PLAYER2":
			{
				if(playhead === "BEGIN")
				{
					test_punchAttackSet(2);
				}
				
				if(playhead === "FINISH")
				{
					BATTLE_NAV.animation.sequenceFlow = "OPTIONS";
					
					test_punchAttackControl("BEGIN");					
				}
				
				break;
			}
			
			case "OPTIONS":
			{
				if(playhead === "BEGIN")
				{
					$(".battleNav-player-speech").removeClass("battleNav-player-speech-hide").addClass("battleNav-player-speech-show");
					
					battleUserInfo_fight_sequence();
					
					// BATTLE_NAV.animation.playheadDelay = setTimeout(test_punchAttackControl, 1000, "FINISH");
					
					// BREAK!!!!
					// BATTLE_NAV.animation.playheadDelay.time(1, test_punchAttackControl, "FINISH");
				}
				
				if(playhead === "FINISH")
				{
					BATTLE_NAV.animation.sequenceFlow = "FINISH_THEM";
					
					test_punchAttackControl("BEGIN");
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
						
						test_punchAttackSet(1);
					}
					
					if(BATTLE_NAV.game.result === "LOSE")
					{
						BATTLE_NAV.animation.resultRound = true;
						
						test_punchAttackSet(2);
					}
					
					if(BATTLE_NAV.game.result === "DRAW")
					{
						$(".battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-normal").addClass("battleNav-player-eyesSprite-sad");
						
						$(".battleNav-player-choice-eyes").removeClass("battleNav-player-choice-eyes-normal").addClass("battleNav-player-choice-eyes-sad");
						
						
						// BATTLE_NAV.animation.playheadDelay = setTimeout(test_punchAttackControl, 500, "FINISH");
						BATTLE_NAV.animation.playheadDelay.time(0.5, test_punchAttackControl, "FINISH");
					}
				}
				
				if(playhead === "FINISH")
				{
					$(".battleNav-player-inner").removeClass("battleNav-player-StartPos");
					
					if(BATTLE_NAV.game.result === "DRAW")
					{
						$(".battleNav-player-speech").removeClass("battleNav-player-speech-show").addClass("battleNav-player-speech-hide");
						
						$(".battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-sad").addClass("battleNav-player-eyesSprite-normal");
						
						$(".battleNav-player-choice-eyes").removeClass("battleNav-player-choice-eyes-sad").addClass("battleNav-player-choice-eyes-normal");
						
						BATTLE_NAV.animation.sequenceFlow = "ANOTHER_ROUND";
						
						BATTLE_NAV.animation.playheadDelay.time(0.5, test_punchAttackControl);	
					
						// ANOTHER ROUND
					}
					
					else
					{
						// END SCREEN
						
						$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("webkitTransitionEnd", test_punchAttackFightOver, false);
						$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].addEventListener("transitionend", test_punchAttackFightOver, false);
					}
				}
				
				break;
			}
			
			case "ANOTHER_ROUND":
			{
				hack_battleResultsEnd();
				
				break;
			}
		}
	}
	
	function test_punchAttackSet(attackerReq)
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
		
		test_punchAttackApply();			
	}
	
	function test_punchAttackApply()
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
		}
		
		for(var i = 0; i < BATTLE_NAV.animation.punchTotal; i++)
		{
			var delay = i * 0.2;
			var stall = setTimeout(test_punchAttackAdd, delay * 1000, i);
		}
	}
	
	function test_punchAttackAdd(num)
	{
		var exitFrame;
		
		var css;
		
		$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-superPunch").append(BATTLE_NAV.animation.html.superPunch);
		
		$("#" + BATTLE_NAV.animation.punch_id_attack + " ._PUNCH").addClass("SUPER-PUNCH" + num);
		$("#" + BATTLE_NAV.animation.punch_id_attack + " ." + "SUPER-PUNCH" + num).removeClass("_PUNCH");
		
		css = 	{
					"-webkit-animation-duration" : "0.1s !important",
					"animation-duration" : "0.1s !important"
				};
		
		if(num === BATTLE_NAV.animation.punchTotal - 1)
		{
			$("#" + BATTLE_NAV.animation.punch_id_attack + " ." + "SUPER-PUNCH" + num).addClass("KILLER-PUNCH");	
		}
	
		exitFrame = setTimeout(test_punchAttackFire, 20, $("#" + BATTLE_NAV.animation.punch_id_attack + " ." + "SUPER-PUNCH" + num));
	}
	
	function test_punchAttackFire(div)
	{
		$(div)[0].addEventListener("webkitTransitionEnd", test_punchAttackFireEnd, false);
		$(div)[0].addEventListener("transitionend", test_punchAttackFireEnd, false);
		
		$(div).addClass("battleNav-superPunchAttack");
	}
	
	function test_punchAttackFireEnd(event)
	{
		var _classList = event.target.classList.toString();
		var removeBlow;
		
		$(event.target)[0].removeEventListener("webkitTransitionEnd", test_punchAttackFireEnd, false);
		$(event.target)[0].removeEventListener("transitionend", test_punchAttackFireEnd, false);
		
		if(BATTLE_NAV.animation.firstPunch)
		{
			BATTLE_NAV.animation.firstPunch = false;
			
			if(BATTLE_NAV.animation.punch_id_attack === "battleNav-player1")
			{
				battleUserInfo_punchPlayer1();	
			}
			
			if(BATTLE_NAV.animation.punch_id_attack === "battleNav-player2")
			{
				battleUserInfo_punchPlayer2();	
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
		
		if(_classList.search("KILLER-PUNCH") === -1)
		{
			test_puchAttackReturn(event);			
		}
		
		else
		{
			$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-player-hands").removeClass("tween-battleNav-player-handsSuper");
			
			
			
			$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-hands").removeClass("tween-battleNav-player-handsWeak");
			$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head").removeClass("tween-battleNav-player-headWeak");
			
			
			$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-shockSprite").removeClass("tween-battleNav-player-shockSprite");
			
			$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-shock").addClass("tween-battleNav-player-shock");	
			
			if(BATTLE_NAV.animation.resultRound)
			{
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-eyesSprite").removeClass("battleNav-player-eyesSprite-sad").addClass("battleNav-player-eyesSprite-happy");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head-main").addClass("battleNav-smash-head-KILLER");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body").addClass("battleNav-smash-body-KILLER");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-legs").addClass("battleNav-smash-legs-KILLER");
				
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-choice-eyes").removeClass("battleNav-player-choice-eyes-sad").addClass("battleNav-player-choice-eyes-happy");
				
				removeBlow = setTimeout(test_puchAttackReturn, 800, event);
			}
			
			else
			{
				removeBlow = setTimeout(test_puchAttackReturn, 300, event);
			}
			
			
			
		}
	}
	
	function test_puchAttackReturn(event)
	{
		$(event.target)[0].addEventListener("webkitTransitionEnd", test_punchAttackComplete, false);
		$(event.target)[0].addEventListener("transitionend", test_punchAttackComplete, false);
				
		$(event.target).removeClass("battleNav-superPunchAttack").addClass("battleNav-superPunchReturn");		
	}
	
	function test_punchAttackComplete(event)
	{
		$(event.target)[0].removeEventListener("webkitTransitionEnd", test_punchAttackComplete, false);
		$(event.target)[0].removeEventListener("transitionend", test_punchAttackComplete, false);
		
		$(event.target).remove();
		
		if($("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-superPunch div").length === 0)
		{
			$("#" + BATTLE_NAV.animation.punch_id_attack).removeClass("battleNav-superPunchAttacker");
			
			$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-player-eyes").removeClass("battleNav-player-eyes-lookF");
			
			$("#" + BATTLE_NAV.animation.punch_id_attack + " .battleNav-player-hands").addClass("tween-battleNav-player-hands");
		
			if(BATTLE_NAV.animation.smashed)
			{
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body")[0].addEventListener("webkitTransitionEnd", test_punchAttackPurge, false);
				$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body")[0].addEventListener("transitionend", test_punchAttackPurge, false);
				
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
	
	function test_punchAttackPurge(event)
	{
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body")[0].removeEventListener("webkitTransitionEnd", test_punchAttackPurge, false);
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body")[0].removeEventListener("transitionend", test_punchAttackPurge, false);
		
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-head-main").removeClass("tween-battleNav-smash");
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-body").removeClass("tween-battleNav-smash");
		$("#" + BATTLE_NAV.animation.punch_id_victim + " .battleNav-player-legs").removeClass("tween-battleNav-smash");		
	
		test_punchAttackReplay();
	}
	
	function test_punchAttackReplay()
	{
		// BATTLE_NAV.animation.playheadDelay = setTimeout(test_punchAttackControl, 0.4 * 1000, "FINISH");
		BATTLE_NAV.animation.playheadDelay.time(0.4, test_punchAttackControl, "FINISH");
	}
	
	function test_punchAttackFightOver(event)
	{
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("webkitTransitionEnd", test_punchAttackFightOver, false);
		$("#battleNav-player1 .tween-battleNav-player-StartPos")[0].removeEventListener("transitionend", test_punchAttackFightOver, false);
						
		hack_battleResultsEnd();		
	}
	
	
	
	/////// HACKS
	
	function hack_startBattleCountDown()
	{
		/* battleUserInfo_vs(); */
		
/* AMEND */
/*
		battleUserInfo_vs();
		
		$(".battleNav-player-eyes").removeClass("battleNav-player-eyes-lookF").addClass("battleNav-player-eyes-lookC");
		
		$(".battleNav-player-eyes").removeClass("battleNav-player-eyes-lookF").addClass("battleNav-player-eyes-lookC");
*/


/* AMEND */
		
		battleUserInfo_preFight();
		
		$("#battle-nav-playerBird .battleCute-bird-board").addClass("tween-battleCute-bird-countDown");
		
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].addEventListener("webkitAnimationEnd", hack_startBattleCountDownSequence, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].addEventListener("animationend", hack_startBattleCountDownSequence, false);		
	}
	
	function hack_startBattleCountDownSequence(event)
	{
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].removeEventListener("webkitAnimationEnd", hack_startBattleCountDownSequence, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-left .battleCute-bird-board")[0].removeEventListener("animationend", hack_startBattleCountDownSequence, false);
	 	
	 	battleUserInfo_fight();
	 	
	 	$("#battle-nav-playerBird .battleCute-bird-arm-inner").addClass("tween-battleCute-bird-arm-main-fire");
	 			
	 	$("#battle-nav-playerBird .battleCute-eyes-sprite").removeClass("battleCute-eyes-norm").addClass("battleCute-eyes-happy");
	 	
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main").addClass("tween-battleCute-bird-arm-main-intoFly");
	 			
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].addEventListener("webkitAnimationEnd", hack_clearStageForFightInit, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].addEventListener("animationend", hack_clearStageForFightInit, false);
	 	
	 	
	 	/* AMEND */
	 	// $("#info-cloud p").text(BATTLE_NAV.navText.txt_START.toUpperCase());
	 	
	 	// $("#info-cloud").css("opacity", "1");		
	 	/* AMEND */
	}
	
	function hack_clearStageForFightInit(event)
	{
	 	var clearStage;
	 	
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].removeEventListener("webkitAnimationEnd", hack_clearStageForFightInit, false);
	 	$("#battle-nav-playerBird .battleCute-bird-arm-main")[0].removeEventListener("animationend", hack_clearStageForFightInit, false);
	 	
	 	clearStage = new AnimationTimer();
	 	timerList_add(clearStage);
	 	clearStage.time(1, hack_clearStageForFight);	
	}
	
	function hack_clearStageForFight()
	{
		/* $("#info-cloud").css("opacity", "0"); */
		
		$("#battle-nav-playerBird .battleCute-bird-arm-main").removeClass("tween-battleCute-bird-arm-main-intoFly").addClass("tween-battleCute-bird-arm-main");
	 			
	 	$("#battle-nav-playerBird").addClass("tween-bird-flapAway");	
	
	 	$("#battle-nav-playerBird")[0].addEventListener("webkitAnimationEnd", hack_clearedStage, false);
	 	$("#battle-nav-playerBird")[0].addEventListener("animationend", hack_clearedStage, false);		
	}
	
	function hack_clearedStage(event)
	{
		var winLoseDisplay;
		
	 	/* $("#info-cloud p").text(BATTLE_NAV.navText["txt_" + BATTLE_NAV.game.result].toUpperCase()); */
	 	
	 	$("#battle-nav-playerBird")[0].removeEventListener("webkitAnimationEnd", hack_clearedStage, false);
	 	$("#battle-nav-playerBird")[0].removeEventListener("animationend", hack_clearedStage, false);
	 	
/*
		$(".battleNav-player-eyes").removeClass("battleNav-player-eyes-lookF").addClass("battleNav-player-eyes-lookC");
		
		$(".battleNav-player-eyes").removeClass("battleNav-player-eyes-lookF").addClass("battleNav-player-eyes-lookC");
*/
		
		test_punchPositionInit();
		
		$("#battle-nav-playerBird").remove(); 			
	 	
/* AMEND */
/*
		$("#battle-nav-player1 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-C").addClass("battleCute-eyes-look-R");
		$("#battle-nav-player2 .battleCute-warrior-head .battleCute-eyes-sprite").removeClass("battleCute-eyes-look-C").addClass("battleCute-eyes-look-L");	
*/ 
/* AMEND */	
	 	

/* AMEND */	 	
/*
	 	$("#battle-nav-player1 .battleCute-speak-left").css("opacity", "1");
	 	$("#battle-nav-player2 .battleCute-speak-right").css("opacity", "1");
*/
/* AMEND */
	 	
	 	
	 	/* battleUserInfo_enemy(); */
	 	
/*
	 	winLoseDisplay = new AnimationTimer();
	 	timerList_add(winLoseDisplay);
	 	winLoseDisplay.time(2, battleNav_battleResults);
*/		
	}
	
	function hack_battleResultsEnd()
	{
		var exitFrame;
		
		trace("ANOTHER-ROUND --- function0()");
		
		if(BATTLE_NAV.game.result === "WIN" || BATTLE_NAV.game.result === "LOSE")
		{
			exitFrame = new AnimationTimer();
			timerList_add(exitFrame);
			exitFrame.time(0.02, battleNav_battleOver);
		}
		
		else
		{
			trace("ANOTHER-ROUND --- function1()");
			
			$("#battle-nav-fight").css(BATTLE_NAV.settings.y_hide);
			
			$(".tween-battle-nav-fight")[0].addEventListener("webkitTransitionEnd", hack_anotherRound, false);
			$(".tween-battle-nav-fight")[0].addEventListener("transitionend", hack_anotherRound, false);			
		}		
	}
	
	
	
	function hack_anotherRound(event)
	{
		var exitFrame;
		
		$(".tween-battle-nav-fight")[0].removeEventListener("webkitTransitionEnd", hack_anotherRound, false);
		$(".tween-battle-nav-fight")[0].removeEventListener("transitionend", hack_anotherRound, false);
		
		trace("ANOTHER-ROUND --- function2()");
		
		$("#battle-nav-fight").html("");
		
		$("#battle-nav").html(BATTLE_NAV.html.navOptions);
		
		BATTLE_NAV.animation.resultRound = false;
		
		BATTLE_NAV.animation.sequenceFlow = "START_PLAYER1";
		
		battleNav_getValues();
		
		exitFrame = setTimeout(fromHereToSafety, 1000);
	}
	
	function fromHereToSafety()
	{
		$("#info-cloud p").text(BATTLE_NAV.navText.txt_AGAIN.toUpperCase());
		
		$("#battle-nav").removeClass("battle-nav-hide").addClass("battle-nav-show");
		
		battleUserInfo_anotherRound();
		
		$(".tween-battle-nav")[0].addEventListener("webkitTransitionEnd", hack_anotherRoundInPlace, false);
		$(".tween-battle-nav")[0].addEventListener("transitionend", hack_anotherRoundInPlace, false);		
	}
	
	function hack_anotherRoundInPlace(event)
	{
		$(".tween-battle-nav")[0].removeEventListener("webkitTransitionEnd", hack_anotherRoundInPlace, false);
		$(".tween-battle-nav")[0].removeEventListener("transitionend", hack_anotherRoundInPlace, false);
		
		$("#info-cloud").css("opacity", "1");
		
		battleNav_control(true);			
	}
		
	
	/////// HACKS
	
	
	
	
	
	/////////////////////////// BATTLE NAV UPDATE
	
	

	
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




	
	
	
	

	
	
	
	
	