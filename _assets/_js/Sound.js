	var soundEffects_pedal;

	var soundLevelTriggers_ARR;

	function sound_prep()
	{
			/////// HACK FOR iOS
			createjs.WebAudioPlugin.playEmptySound();
			/////// HACK FOR iOS
	}


	function sound_init_entry(callBack)
	{
		soundEffects_pedal = {};

		soundEffects_pedal.main = {};

   	if(callBack)
   	{
     		soundEffects_pedal.main.soundSetupCallBack = callBack;
     	}

		var soundTest_support = createjs.Sound.initializeDefaultPlugins();

		if(soundTest_support == false || soundTest_support == undefined || soundTest_support == null)
		{
			trace("NO_SOUND_SUPPORT");

			soundEffects_pedal = null;

			// QUICK RETURN
			soundEffects_pedal.main.soundSetupCallBack();
		}

		if(soundTest_support == true)
		{
   		trace("SOUND_SUPPORT");

     		sound_createManifestArray();
		}
	}

	function sound_createManifestArray()
	{
		soundEffects_pedal.main.fileCount = 0;

		// soundEffects_pedal.main.assetsPath = "_assets/_sound/";

		soundEffects_pedal.main.assetsPath = Logic.dat_ROM._SOUND.soundSource;

	   // CONSIDER JSON
	   /*
	   soundEffects_pedal.main.manifest =	[
				            							{src:"bg_forest.ogg", id:"BGM_BG_FOREST"},
															{src:"bg_sea.ogg", id:"BGM_BG_SEA"},
															{src:"fx_splash.ogg", id:"BGM_FX_SPLASH"},
															{src:"fx_crow.ogg", id:"BGM_FX_CROW"},
															{src:"fx_squeak.ogg", id:"BGM_FX_RABBIT"},
															{src:"fx_moo.ogg", id:"BGM_FX_WHALE"},
															{src:"fx_trees.ogg", id:"BGM_FX_TREES"}
														];*/

		soundEffects_pedal.main.manifest = Logic.dat_ROM._SOUND.soundAssets;

		sound_init_finish();
	}

	function sound_init_finish()
	{
		// add other extensions to try loading if the src file extension is not supported
		createjs.Sound.alternateExtensions = ["mp3"];

		// add an event listener for when load is completed
		createjs.Sound.addEventListener("fileload", createjs.proxy(sound_loaded, this));

		createjs.Sound.registerManifest(soundEffects_pedal.main.manifest, soundEffects_pedal.main.assetsPath);

		soundEffects_pedal.main.playCountMax = 6;
		soundEffects_pedal.main.enterFrame_in = null;
		soundEffects_pedal.main.enterFrame_out = null;
		soundEffects_pedal.main.fadeValue = 0.01;


		soundEffects_pedal.main.fadeType = "";

		soundEffects_pedal.soundListLevel = new Array();
	}

	function sound_loaded(event)
	{
		trace(event);

		soundEffects_pedal.main.fileCount ++;

		if(soundEffects_pedal.main.fileCount == soundEffects_pedal.main.manifest.length)
		{
			sound_list_refresh();

			sound_prepLevel();

			// SAFETY - FLUSH
			soundEffects_pedal.main.fileCount = 0;

			createjs.Sound.removeEventListener("fileload", createjs.proxy(sound_loaded, this));

			if(soundEffects_pedal.main.soundSetupCallBack)
			{
				soundEffects_pedal.main.soundSetupCallBack();
			}
		}
	}

var sound_level_trigger = function(settings, num, container)
{
		this.settings = settings;
		this.container = container;
		this.buildData = {};
		this.num = num;
};

sound_level_trigger.prototype.create = function()
{
		this.soundPrefs = this.settings.sound_prefs;
		this.instance_class = this.settings.instance_class;

		this.buildData.block_x	= this.settings.x * 80;
		this.buildData.block_y	= this.settings.y * 80;
		this.buildData.block_w	= this.settings.w * 80;
		this.buildData.block_h	= this.settings.h * 80;
		this.buildData.id		= "level" + ROM.mapLevel + "_soundTrigger_" + this.num;

		this.buildData.html 	= '<div id="' + this.buildData.id + '" class="sound_trigger collideCheck-field" data-npc="sound"></div>';


		this.buildData.css		= 	{
										"width"				: this.buildData.block_w + "px",
										"height"			: this.buildData.block_h + "px",
										"position"			: "absolute",
										"-webkit-transform"	: "translate(" + this.buildData.block_x + "px, " + this.buildData.block_y + "px)",
										"transform"			: "translate(" + this.buildData.block_x + "px, " + this.buildData.block_y + "px)"
									};

		$(this.container).append(this.buildData.html);
		$(this.container + " #" + this.buildData.id).css(this.buildData.css);
		$(this.container + " #" + this.buildData.id).addClass(this.instance_class);

		delete this.settings;
}

	function sound_list(soundRef, soundSettings, soundOptions)
	{
		soundEffects_pedal.soundList[soundRef] = {};

		soundEffects_pedal.soundList[soundRef].ref = soundRef;

		soundEffects_pedal.soundList[soundRef].instance = null;

		soundEffects_pedal.soundList[soundRef].settings = {};
		soundEffects_pedal.soundList[soundRef].settings = soundSettings;

		soundEffects_pedal.soundList[soundRef].options = {};
		soundEffects_pedal.soundList[soundRef].options = soundOptions;

		soundEffects_pedal.soundList[soundRef].exists = false;

		soundEffects_pedal.soundList[soundRef].eventTimer = null;


		sound_run(soundRef);
	}

	function sound_list_refresh()
	{
		soundEffects_pedal.soundList = {};
	}

	function sound_prepLevel()
	{
			// JSON FOR LOOP

			for(var i in Logic.dat_ROM._SOUND.soundList)
			{
				var soundListData = Logic.dat_ROM._SOUND.soundList[i];

				sound_list(soundListData.name,
				{
					id: soundListData.id,
				  loop: soundListData.loop,
				  volume: soundListData.volume
				},

				{
				  paused:soundListData.paused,
				  storeInstance: soundListData.storeInstance,
				  singleChannel: soundListData.singleChannel
				 });
			}

			/*
			sound_list("level_bg_forest", {id: "BGM_BG_FOREST", loop: -1, volume: 1}, {paused:true, storeInstance: true, singleChannel: true});

			sound_list("level_bg_sea", {id: "BGM_BG_SEA", loop: -1, volume: 0}, {paused:true, storeInstance: true, singleChannel: true});

			sound_list("fx_splash", {id: "BGM_FX_SPLASH", loop: -1, volume: 0.05}, {paused:true, storeInstance: true, singleChannel: true});
			sound_list("fx_crow", {id: "BGM_FX_CROW", loop: 0, volume: 1}, {paused:true, storeInstance: true, singleChannel: false});
			sound_list("fx_rabbit", {id: "BGM_FX_RABBIT", loop: 0, volume: 0.06}, {paused:true, storeInstance: true, singleChannel: false});
			sound_list("fx_whale", {id: "BGM_FX_WHALE", loop: 0, volume: 1}, {paused:true, storeInstance: true, singleChannel: true});

			sound_list("fx_trees", {id: "BGM_FX_TREES", loop: 0, volume: 1}, {paused:true, storeInstance: true, singleChannel: false});*/
	}

	function sound_run(soundRef)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];

		//Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)

		var instance = createjs.Sound.play(_SOUND.settings.id, createjs.Sound.INTERRUPT_NONE, 0, 0, _SOUND.settings.loop, _SOUND.settings.volume);

		if(instance == null || instance.playState == createjs.Sound.PLAY_FAILED)
		{
			_SOUND.exists = false;

			return;
		}

		else
		{
			_SOUND.exists = true;

			_SOUND.playCount = 0;

			if(_SOUND.options.paused)
			{
				instance.stop();
			}

			if(_SOUND.options.storeInstance)
			{
				_SOUND.instance = instance;

				_SOUND.instance.uniqueId = soundRef;

				_SOUND.instance.addEventListener("complete", sound_end);
			}
		}
	}

	function sound_play(soundRef, callBackStart, callBackEnd)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];

		if(_SOUND != undefined)
		{
			for(var s in soundEffects_pedal.soundListLevel)
			{
				if(soundEffects_pedal.soundListLevel[s] !== soundRef)
				{
					soundEffects_pedal.soundListLevel.push(soundRef);
				}
			}

			if(_SOUND.instance.playState === "playFinished" || !_SOUND.options.singleChannel && _SOUND.playCount < soundEffects_pedal.main.playCountMax)
			{
				_SOUND.instance = createjs.Sound.play(_SOUND.settings.id, createjs.Sound.INTERRUPT_NONE, 0, 0, _SOUND.settings.loop, _SOUND.settings.volume);

				_SOUND.instance.uniqueId = soundRef;

				if(callBackStart)
				{
					if(callBackStart.call_params)
					{
						callBackStart.call_funct.apply(this, callBackStart.call_params);
					}

					else
					{
						callBackStart.call_funct();
					}
				}

				if(callBackEnd)
				{
					_SOUND.onEndCallBack = callBackEnd;
				}

				_SOUND.playCount++;

				if(_SOUND.options.singleChannel || _SOUND.playCount >= soundEffects_pedal.main.playCountMax)
				{
					_SOUND.instance.addEventListener("complete", sound_end);
				}
			}
		}
	}

	function sound_end(event)
	{
		var _SOUND = soundEffects_pedal.soundList[event.target.uniqueId];

		_SOUND.playCount = 0;

		_SOUND.instance.removeEventListener("complete", sound_end);

		// POSSIBLE BUG
		_SOUND.eventTimer = null;

		if(_SOUND.onEndCallBack)
		{
			if(_SOUND.onEndCallBack.call_params)
			{
				_SOUND.onEndCallBack.call_funct.apply(this, _SOUND.onEndCallBack.call_params);
			}

			else
			{
				_SOUND.onEndCallBack.call_funct();
			}

			delete _SOUND.onEndCallBack;
		}
	}

	function sound_stop(soundRef)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];

		if(_SOUND.instance != null || _SOUND.instance != undefined)
		{
			_SOUND.instance.stop();
		}
	}

	function sound_volume(soundRef, soundVolume)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];

		if(_SOUND.instance != null || _SOUND.instance != undefined)
		{
			_SOUND.instance.setVolume(soundVolume);
		}
	}

	function sound_fadeInit(soundRef, volTarget, onEnd)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];

		if(_SOUND.instance != null || _SOUND.instance != undefined)
		{

			// RESET ACTIONS
			clearInterval(soundEffects_pedal.main.enterFrame_in);
			clearInterval(soundEffects_pedal.main.enterFrame_out);

			sound_defineFadeType(soundRef, volTarget);

			if(soundEffects_pedal.main.fadeType === "IN") // fadeType
			{
				// sound_fadeInit("sound_name", 1, "IN", {call_funct: end_function, call_params: ["parameter0", 1, object2]});

				soundEffects_pedal.main.enterFrame_in = setInterval(sound_fadeRun, 20, _SOUND.instance, volTarget, soundRef, onEnd);
			}

			if(soundEffects_pedal.main.fadeType === "OUT") // fadeType
			{
				// sound_fadeInit("sound_name", 0, "OUT", {call_funct: end_function});

				soundEffects_pedal.main.enterFrame_out = setInterval(sound_fadeRun, 20, _SOUND.instance, volTarget, soundRef, onEnd);
			}
		}
	}

	function sound_defineFadeType(soundRef, volTarget)
	{
		var _SOUND = soundEffects_pedal.soundList[soundRef];
		var vol = _SOUND.instance.getVolume();

		soundEffects_pedal.main.fadeType = "";

		if((volTarget * 100) > Math.round(vol * 100))
		{
			soundEffects_pedal.main.fadeType = "IN";
		}

		if((volTarget * 100) < Math.round(vol * 100))
		{
			soundEffects_pedal.main.fadeType = "OUT";
		}
	}



	function sound_fadeRun(soundInstance, volTarget, soundRef, onEnd)
	{
		var vol = soundInstance.getVolume();

		// var ft = "";

		// if(volTarget > Math.round(vol * 100))
		// {
		// 	ft = "IN";
		// }

		// if(volTarget < Math.round(vol * 100))
		// {
		// 	ft = "OUT";
		// }

		// trace("start vol === " + vol + " || " + Math.round(vol * 100) + " autoFade == " + soundEffects_pedal.main.fadeType);

		//// IN

		if(soundEffects_pedal.main.fadeType === "IN") // fadeType
		{
			if(vol < volTarget)
			{
				soundInstance.setVolume(vol += soundEffects_pedal.main.fadeValue);
			}

			else
			{
				clearInterval(soundEffects_pedal.main.enterFrame_in);

				soundInstance.setVolume(volTarget);

				if(onEnd)
				{
					if(onEnd.call_params)
					{
						// .apply CONVERTS PARAMS IN OBJECT INTO A READABLE FUNCTION
						onEnd.call_funct.apply(this, onEnd.call_params);
					}

					else
					{
						// BASIC FUNCTION
						onEnd.call_funct();
					}
				}
			}
		}


		//// OUT

		if(soundEffects_pedal.main.fadeType === "OUT") // fadeType
		{

			if(vol > volTarget)
			{
				soundInstance.setVolume(vol -= soundEffects_pedal.main.fadeValue);
			}

			else
			{
				clearInterval(soundEffects_pedal.main.enterFrame_out);

				soundInstance.setVolume(volTarget);

				if(Math.round(vol * 100) <= 0)
				{
					sound_stop(soundRef);
				}

				if(onEnd)
				{
					if(onEnd.call_params)
					{
						// .apply CONVERTS PARAMS IN OBJECT INTO A READABLE FUNCTION
						onEnd.call_funct.apply(this, onEnd.call_params);
					}

					else
					{
						onEnd.call_funct();
					}
				}
			}
		}
	}

	function sound_fadeInitGlobal(volTarget, onEnd)
	{
		var vol = createjs.Sound.getVolume();

		// RESET ACTIONS
		clearInterval(soundEffects_pedal.main.enterFrame_in);
		clearInterval(soundEffects_pedal.main.enterFrame_out);

		soundEffects_pedal.main.fadeType = "";

		if((volTarget * 100) > Math.round(vol * 100))
		{
			soundEffects_pedal.main.fadeType = "IN";
		}

		if((volTarget * 100) < Math.round(vol * 100))
		{
			soundEffects_pedal.main.fadeType = "OUT";
		}

		if(soundEffects_pedal.main.fadeType === "IN") // fadeType
		{
			soundEffects_pedal.main.enterFrame_in = setInterval(sound_fadeRunGlobal, 20, volTarget, onEnd);
		}

		if(soundEffects_pedal.main.fadeType === "OUT") // fadeType
		{
			soundEffects_pedal.main.enterFrame_out = setInterval(sound_fadeRunGlobal, 20, volTarget, onEnd);
		}
	}

	function sound_fadeRunGlobal(volTarget, onEnd)
	{
		var vol = createjs.Sound.getVolume();

		//// IN

		if(soundEffects_pedal.main.fadeType === "IN") // fadeType
		{
			if(vol < volTarget)
			{
				createjs.Sound.setVolume(vol += soundEffects_pedal.main.fadeValue);
			}

			else
			{
				clearInterval(soundEffects_pedal.main.enterFrame_in);

				createjs.Sound.setVolume(volTarget);

				if(onEnd)
				{
					if(onEnd.call_params)
					{
						// .apply CONVERTS PARAMS IN OBJECT INTO A READABLE FUNCTION
						onEnd.call_funct.apply(this, onEnd.call_params);
					}

					else
					{
						// BASIC FUNCTION
						onEnd.call_funct();
					}
				}
			}
		}


		//// OUT

		if(soundEffects_pedal.main.fadeType === "OUT") // fadeType
		{

			if(vol > volTarget)
			{
				createjs.Sound.setVolume(vol -= soundEffects_pedal.main.fadeValue);
			}

			else
			{
				clearInterval(soundEffects_pedal.main.enterFrame_out);

				createjs.Sound.setVolume(volTarget);

				if(onEnd)
				{
					if(onEnd.call_params)
					{
						// .apply CONVERTS PARAMS IN OBJECT INTO A READABLE FUNCTION
						onEnd.call_funct.apply(this, onEnd.call_params);
					}

					else
					{
						onEnd.call_funct();
					}
				}
			}
		}
	}

function sound_level_trigger_event(sound_hit)
{
	var levelSoundItem;

	soundEffects_pedal.soundListLevel = new Array();

	for(var i in soundLevelTriggers_ARR)
	{
		levelSoundItem = soundLevelTriggers_ARR[i];

		if(sound_hit === levelSoundItem.buildData.id)
		{

			for(var rawSoundFunction in levelSoundItem.soundPrefs)
			{
				var levelSoundFunction = window[levelSoundItem.soundPrefs[rawSoundFunction].call_funct];
				var levelSoundParameters = levelSoundItem.soundPrefs[rawSoundFunction].call_params;

				levelSoundFunction.apply(this, levelSoundParameters);
			}
		}
	}

	trace("PLAY SOUND ??? " + sound_hit);
}

function sound_levelClear()
{
	for(var s in soundEffects_pedal.soundListLevel)
	{
		sound_stop(soundEffects_pedal.soundListLevel[s]);
	}

	// FLUSH LEVEL SOUNDS
	soundEffects_pedal.soundListLevel = new Array();
}


function sound_level_background()
{
	for(var object_sound in Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["sound_level"])
	{
		var levelSoundItem = Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["sound_level"][object_sound];

		var levelSoundFunction = window[levelSoundItem.call_funct];
		var levelSoundParameters = levelSoundItem.call_params;

		levelSoundFunction.apply(this, levelSoundParameters);
	}
}

	function sound_purge()
	{
		for(var soundOBJ in soundEffects_pedal.soundList)
		{
			sound_stop(soundEffects_pedal.soundList[soundOBJ].ref);
		}

		sound_refreshList();
	}

	function sound_refreshList()
	{

	}


	/*
	var soundMain;

	var soundEffects_pedal;

	function sound_init()
	{
		soundMain = {};

		if(!createjs.Sound.initializeDefaultPlugins())
		{
			soundMain.available = false;
		}

		else
		{
			soundMain.fileCount = 0;

			soundMain.available = true;

			// TURN TO JSON
			soundMain.assetsPath = "_assets/_sound/";

			// TURN TO JSON + .ogg FILES
			soundMain.manifest	=	[
										{src:"bg_forest.mp3", id:"BGM_BG_FOREST"},
										{src:"fx_splash.mp3", id:"BGM_FX_SPLASH"},
										{src:"bgm_tune.mp3", id:"BGM_TUNE"}
									];

			// OTHER FILETYPES FOR NON SUPPORT OF THE ABOVE
			createjs.Sound.alternateExtensions = ["mp3"];
			createjs.Sound.addEventListener("fileload", createjs.proxy(sound_loaded, this));
			createjs.Sound.registerManifest(soundMain.manifest, soundMain.assetsPath);
		}
	}

	function sound_loaded(event)
	{
		soundMain.fileCount ++;

		if(soundMain.fileCount == soundMain.manifest.length)
		{
			soundMain.fileCount = 0;

			sound_list(true, "level_tune",
			{
				target: {id: "BGM_TUNE", loop:Infinity, volume: 1},
				paused: true,
				returnInstance: true
			});

			sound_list(false, "level_bg_forest",
			{
				target: {id: "BGM_BG_FOREST", loop: Infinity, volume: 1},
				paused: true,
				returnInstance: true
			});

			sound_list(false, "fx_splash",
			{
				target: {id: "BGM_FX_SPLASH", loop: 0, volume: 1},
				paused: true,
				returnInstance: true
			});

			// CALL BACK HERE

			soundData_found();
		}
	}

	function sound_list(pedal_new, pedal_id, pedal_params)
	{
		if(pedal_new || !soundEffects_pedal)
		{
			soundEffects_pedal = {};
		}

		soundEffects_pedal[pedal_id] = {};
		soundEffects_pedal[pedal_id] = sound_run(pedal_params.target, pedal_params.paused, pedal_params.returnInstance);
	}

	function sound_register()
	{
		/////// HACK FOR iOS
		createjs.WebAudioPlugin.playEmptySound();
		/////// HACK FOR iOS
	}

	function sound_run(target, paused, returnInstance)
	{
		var instance = createjs.Sound.play(target.id, createjs.Sound.INTERRUPT_NONE, 0, 0, target.loop, target.volume);

		if(instance == null || instance.playState == createjs.Sound.PLAY_FAILED)
		{
			return;
		}

		else
		{
			if(paused)
			{
				instance.stop();
			}

			if(returnInstance)
			{
				return instance;
			}
		}

		instance.addEventListener("complete", function(instance)
		{

		});
	}

	function sound_volume(soundID, newVolume)
	{
		// CALL : sound_volume("soundEffects_pedal.objectName", 0.0 - 1.0);

		if(soundEffects_pedal[soundID])
		{
			soundEffects_pedal[soundID].setVolume(newVolume);
		}
	}

	function sound_play(soundID)
	{
		// CALL : sound_play("soundEffects_pedal.objectName");

		if(soundEffects_pedal[soundID])
		{
			soundEffects_pedal[soundID].play();
		}
	}

	function sound_stop(soundID)
	{
		// CALL : sound_stop("soundEffects_pedal.objectName");

		if(soundEffects_pedal[soundID])
		{
			soundEffects_pedal[soundID].stop();
		}
	}

	function sound_purge(full)
	{
		for(var soundOBJ in soundEffects_pedal)
		{
			soundEffects_pedal[soundOBJ].stop();
		}

		if(full)
		{
			soundEffects_pedal = {};
		}
	}*/






