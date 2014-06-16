	
	$(document).ready( function(){ gameFirstInit(); } );
	
	var ROM;
	
	function phoneRotate(event)
	{
		var base_css;
		
		if(event != null || event != undefined)
		{
			touchOffsetUpdate();
		}
		
		if(window.innerWidth < window.innerHeight)
		{
			trace("DISPLAY_OK");
			
			$("#displayErrorWrapper .displayError").removeClass("displayErrorShow").addClass("displayErrorHide");
		
			base_css = 	{
							"-webkit-transition-delay"	: "0.6s",
							"transition-delay" 			: "0.6s",
							"opacity"					: "0"
						};
		}
		
		else
		{
			trace("DISPLAY_FAIL");
			
			$("#displayErrorWrapper .displayError").removeClass("displayErrorHide").addClass("displayErrorShow");

			base_css = 	{
							"-webkit-transition-delay"	: "0s",
							"transition-delay" 			: "0s",
							"opacity"					: "1"
						};
		}
		
		$("#displayErrorWrapper .displayError-base").css(base_css);
	}
	
	function gameFirstInit()
	{
		ROM = {};
		
		ROM.mapLevel = 0;
		
		ROM.game = {};
		
		checkDevice();
		
		gameData_get(gameData_found);
	}
	
	function gameData_found()
	{
		var diff = Logic.dat_ROM._LOGIC.difficulty;
		
		var levelCount = 0;
		
		for(var levelData in Logic.dat_ROM._LEVELS)
		{
			levelCount++;
		}
		
		battleEngine.init(levelCount, diff.easy, diff.medium, diff.hard, diff.max);
		
		
		html_lib_init(gameHTML_found);
	}
	
	function gameHTML_found()
	{
		display_init();
		
		init_startScreen();
	}
	
	function init_startScreen()
	{
		// HACK
		plug_intro();
	}
	
	function plug_intro()
	{
		// HACK
		init_intro();
	}
	
	function init_intro()
	{
		// HACK
		plug_mainGame();
	}
	
	function plug_mainGame()
	{
		var html_gameLevel;
		
		html_lib_reuse();
		
		html_gameLevel = html_lib_use("_level_game", true, true);
		
		
		$("#display_wrapper").html(html_gameLevel);
		
		init_mainGame();
	}
	
	function init_mainGame()
	{
		mapPlayer_init("player-block", "tween-player-block", "tween-player-walkX", "tween-player-walkY", "tween-mapPlayerWalk_stop", "tween-mapPlayerWalk_loop", "map-goat", "preHitTest");
		
		trace(MAP_PLAYER);
		
		level_init();
		
		controlSignal_init();
		
		screenUpdateInit(true);
		
		var temp = setTimeout(start_mainGame, 1000);
		
		// newLevel();	
	}
	
	function start_mainGame()
	{
		mapPlayer_entry();
		portalScreen_init();
	}
