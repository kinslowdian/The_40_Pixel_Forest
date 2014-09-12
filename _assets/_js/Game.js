
	$(document).ready( function(){ gameFirstInit(); } );

	var ROM;

	var errorMessages = {};


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
			if($("#displayErrorWrapper .message p").text() !== errorMessages.touch)
			{
				$("#displayErrorWrapper .message p").text(errorMessages.touch);
			}

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

		//////////// debug.js
		debug_init();
		//////////// debug.js
	}

	function gameData_found()
	{
		var diff = Logic.dat_ROM._LOGIC.difficulty;

		var levelCount = 0;

		for(var levelData in Logic.dat_ROM._LEVELS)
		{
			levelCount++;
		}

		errorMessages.touch 	= Logic.dat_ROM["_ERRORS"]["touch"]["txt"];
		errorMessages.keyboard 	= Logic.dat_ROM["_ERRORS"]["keyboard"]["txt"];

		battleEngine.init(levelCount, diff.easy, diff.medium, diff.hard, diff.max);


		html_lib_init(gameHTML_found);
	}

	function gameHTML_found()
	{
		// sound_init();

		sound_init_entry(soundData_found);
	}

	function soundData_found()
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

		var temp = setTimeout(preloader_remove, 1000);

		// newLevel();
	}

	function preloader_remove()
	{
		$("#preload-wrapper")[0].addEventListener("webkitTransitionEnd", start_mainGame, false);
		$("#preload-wrapper")[0].addEventListener("transitionend", start_mainGame, false);

		$("#preload-wrapper").css("opacity", "0");

	}

	function start_mainGame(event)
	{
		$("#preload-wrapper")[0].removeEventListener("webkitTransitionEnd", start_mainGame, false);
		$("#preload-wrapper")[0].removeEventListener("transitionend", start_mainGame, false);

		$("#preload-wrapper").remove();

		mapPlayer_entry();
		portalScreen_init();

		// NOT FINAL
		sound_play("level_bg_forest");
	}
