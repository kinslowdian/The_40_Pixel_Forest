
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
	}
	
	
	
	
	
	
	