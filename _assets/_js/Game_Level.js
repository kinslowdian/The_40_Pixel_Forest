	
	var LEVEL_MAIN;
	
	var enemyData_ARR = new Array();
	
	var enemies_ARR = new Array();
	
	var enemiesBorn = false;
	
	var LEVEL = function(settings)
	{
		this.settings = settings;
		this.buildData = {};
		this.titleData = {};
	}
	
	LEVEL.prototype.create = function()
	{
		this.levelNumber 			= this.settings.n; 
		this.weather				= this.settings.weather;
		this.landType				= this.settings.land;
		
		this.buildData.entry_fall	= this.settings.entry_fall;
		this.buildData.fall_x		= this.settings.fall_x;
		this.buildData.fall_y		= this.settings.fall_y;
		this.buildData.direction	= this.settings.fall_d;
		
		this.titleData.top			= this.settings.title_top;
		this.titleData.btm			= this.settings.title_btm;
	
		delete this.settings;
	}	
	
	var level_create_basic = function(settings, num, set, container)
	{
		this.settings = settings;
		this.container = container;
		this.buildData = {};
		this.num = num;
		this.set = set;	
	};
	
	level_create_basic.prototype.create = function()
	{
		this.buildData.block_x	= this.settings.x * 80;
		this.buildData.block_y	= this.settings.y * 80;
		this.buildData.block_w	= this.settings.w * 80;
		this.buildData.block_h	= this.settings.h * 80;
		this.buildData.id		= "level" + ROM.mapLevel + "_" + this.set + this.num;
		this.buildData.pixels	= this.settings.p;
		
		if(this.buildData.pixels.search("collideCheck-field") > -1)
		{
			this.buildData.html 	= '<div id="' + this.buildData.id + '" class="' + this.buildData.pixels + '" data-npc="edge"></div>';
		}
		
		else
		{
			this.buildData.html 	= '<div id="' + this.buildData.id + '" class="' + this.buildData.pixels + '"></div>';
		}
		
		this.buildData.css		= 	{
										"width"				: this.buildData.block_w + "px",
										"height"			: this.buildData.block_h + "px",
										"position"			: "absolute",
										"-webkit-transform"	: "translate(" + this.buildData.block_x + "px, " + this.buildData.block_y + "px)",
										"transform"			: "translate(" + this.buildData.block_x + "px, " + this.buildData.block_y + "px)"
									};
								
		$(this.container).append(this.buildData.html);
		$(this.container + " #" + this.buildData.id).css(this.buildData.css);
		
		delete this.settings;		
	};
	
	var backgroundExtras = function(settings, container)
	{
		this.settings 				= settings;
		this.buildData				= {};
		this.buildData.artType		= this.settings.t;
		this.buildData.html			= html_lib_use("_" + this.buildData.artType, false, true);
		this.buildData.container 	= container; 
	};
	
	backgroundExtras.prototype.create = function()
	{	
		this.id					= this.settings.n;
		
		this.buildData.block_x 	= this.settings.x;
		this.buildData.block_y 	= this.settings.y;
		this.buildData.w 		= this.settings.w * 80;
		this.buildData.h 		= this.settings.h * 80;
		this.buildData.x		= this.buildData.block_x * 80;
		this.buildData.y 		= this.buildData.block_y * 80;
		
		this.buildData.css	=	{
									"-webkit-transform"	: "translate(" + this.buildData.x + "px, " + this.buildData.y + "px)",
									"transform"			: "translate(" + this.buildData.x + "px, " + this.buildData.y + "px)"
								};
								
								
		$(this.buildData.container).append(this.buildData.html);
		$(this.buildData.container + " #_" + this.buildData.artType).attr("id", this.id);
			
		$("#" + this.id).css(this.buildData.css);
		
		delete this.settings;
	};
	
	var enemy = function(settings, container, num)
	{
		this.settings				= settings;
		this.buildData				= {};
		this.buildData.container	= container;
		this.alive					= true;
		this.rendered				= false;
		this.array_index			= num;
	};
	
	enemy.prototype.create = function()
	{
		this.id 				= this.settings.n;
		this.enemyType 			= this.settings.t;
		this.spawn				= this.settings.spawn;
		this.rating				= this.settings.l;
		this.name				= this.settings.known;
		
		this.buildData.block_x 	= this.settings.x;
		this.buildData.block_y 	= this.settings.y;
		this.buildData.x		= this.buildData.block_x * 80;
		this.buildData.y 		= this.buildData.block_y * 80;
		this.buildData.w 		= this.settings.w * 80;
		this.buildData.h 		= this.settings.h * 80;
		
		this.buildData.html		= html_lib_use("_enemy_" + this.enemyType, false, true);
		
		this.buildData.css		=	{
										"-webkit-transform"	: "translate(" + this.buildData.x + "px, " + this.buildData.y + "px)",
										"transform"			: "translate(" + this.buildData.x + "px, " + this.buildData.y + "px)"
									};
		
		battleEngine.playerLevelSort(this);
									
		delete this.settings;	
	};
	
	enemy.prototype.build = function()
	{
		$(this.buildData.container).append(this.buildData.html);
		$(this.buildData.container + " #_enemy_" + this.enemyType).attr("id", this.id);
			
		$("#" + this.id).css(this.buildData.css);
		
		trace("RENDER ISSUE :: " + "#" + this.id);
		trace(this.buildData.css);
		
		this.rendered = true;		
	};
	
	function enemyRead()
	{
		for(var levelData in Logic.dat_ROM["_LEVELS"])
		{
			for(var i in Logic.dat_ROM["_LEVELS"][levelData]["enemyPlayers"]["ENEMY"])
			{
				enemyData_ARR.push(Logic.dat_ROM["_LEVELS"][levelData]["enemyPlayers"]["ENEMY"][i]);
			}
		}
		
		var enemy_count = 0;
		
		for(var j in enemyData_ARR)
		{
			var e = new enemy(enemyData_ARR[j], ".enemy-area", enemy_count);
			
			e.create();
			
			enemies_ARR.push(e);
			
			enemy_count++;
		}
		
		trace(enemies_ARR);
		
		enemiesBorn = true;				
	}
	
	function enemy_forcePosition(obj)
	{
		var css_data;
		
		css_data = obj.buildData.css;
		
		return css_data;
	}
			
	function level_init()
	{
		LEVEL_MAIN = new LEVEL(Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["levelSettings"]);
		
		LEVEL_MAIN.create();		
		
		// RESET SCREEN MOVE?
		
		// SET UP LEVEL INFO NOTICE
		
		if(game_levelChange)
		{
			game_levelChange = false;
		}
		
		level_form();
		
		// ADD LATER - if() COULD BE BUGGY
		
/*
		if(game_introEntrance)
		{
			level_player_setup();
		}
*/
		
		level_player_setup();
	}
	
	function level_form()
	{
		var i;
		
		
		if(Graphics.html.data)
		{
			html_lib_reuse();
		}
		
		level_weather();
		
		decayBuild();
		
		// FLOOR COLOUR
		
		$(".field-floor > div").addClass(Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["texture"]["FLOOR"]["class"]);
		
		// OUTER BACKGROUND
		
		$("#roam_content").addClass(Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["texture"]["OUTER"]["class"]);
		
		// TREES BUSHES
		
		i = 0;
		
		for(var object_bush in Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["texture"]["BUSH"])
		{
			var b = new level_create_basic(Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["texture"]["BUSH"][object_bush], i, "BUSH", ".field-area");
			
			b.create();
			
			i++;
		}
		
		// FLOWERS
		
		i = 0;
		
		for(var object_flower in Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["texture"]["FLOWER_LIGHT"])
		{
			var f = new level_create_basic(Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["texture"]["FLOWER_LIGHT"][object_flower], i, "FLOWER_LIGHT", ".field-area");
			
			f.create();
			
			i++;			
		}
		
		// BACKGROUND EXTRAS
		
		for(var object_bg in Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["clearing"])
		{
			var b = new backgroundExtras(Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["clearing"][object_bg], ".woodland-areas");
			
			b.create();
		}
		
		// PORTALS (PRE-READ)
		
		if(!portalsOpened)
		{
			portalRead();
			
			portalsOpened = true;
		}
		
		for(var object_portal in portals_ARR)
		{
			if(ROM.mapLevel == portals_ARR[object_portal].spawn)
			{
				portals_ARR[object_portal].build();	
			}
		}
		
		// ENEMIES (PRE-READ)
		
		if(!enemiesBorn)
		{
			enemiesBorn = true;
			
			enemyRead();
		}
		
		for(var object_enemy in enemies_ARR)
		{
			if(ROM.mapLevel == enemies_ARR[object_enemy].spawn)
			{
				if(enemies_ARR[object_enemy].alive)
				{
					if(!enemies_ARR[object_enemy].rendered)
					{
						enemies_ARR[object_enemy].build();	
					}
				}
				
				else
				{
					digGrave(enemies_ARR[object_enemy]);
				}	
			}	
		}		
		
		html_lib_empty();	
	}
	
	function digGrave(dead_obj)
	{
		var grave = {};
		
		grave.w = dead_obj.buildData.w;
		grave.h = dead_obj.buildData.h;
		grave.ref = "_enemy_grave" + grave.w + "x" + grave.h;
		grave.html = html_lib_use(grave.ref, false, true);
		
		$(dead_obj.buildData.container).append(grave.html);
		$(dead_obj.buildData.container + " #" + grave.ref).attr("id", dead_obj.id);
		
		$("#" + dead_obj.id).css(dead_obj.buildData.css);
		
		// GRAVE FIX
		$("#" + dead_obj.id).addClass("field-floor-" + LEVEL_MAIN.landType);
		// GRAVE FIX
		
		enemies_ARR[dead_obj.array_index].rendered = true;
				
		delete grave;
	}
	
	function level_weather()
	{
		var weather_use = true;
		
		var html_data;
		var html_cont;
		
		if(LEVEL_MAIN.weather === "CLEAR")
		{
			weather_use = false;
		}
		
		else
		{
			if(LEVEL_MAIN.weather === "SNOW")
			{
				html_data = html_lib_use("_weather_data_SNOW", false, true);	
				html_cont = ".weather-snow";
			}
			
			if(LEVEL_MAIN.weather === "RAIN")
			{
				html_data = html_lib_use("_weather_data_RAIN", false, true);	
				html_cont = ".weather-rain";				
			}
			
			if(LEVEL_MAIN.weather === "WIND")
			{
				html_data = html_lib_use("_weather_data_WIND", false, true);	
				html_cont = ".weather-wind";				
			}
		}
		
		if(weather_use)
		{
			$(html_cont).html(html_data);
		}
	}
	
	function decayBuild()
	{
		var decayLength = Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["decay_L"].length;
		
		for(var i = 0; i < decayLength; i++)
		{
			var final_class_L = Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["decay_L"][i].cut;
			var final_class_R = Logic.dat_ROM["_LEVELS"]["level" + ROM.mapLevel]["decay_R"][i].cut;
			
			$(".woodland-darkness-left .landDecayBlock_" + i).addClass(final_class_L);
			
			$(".woodland-darkness-right .landDecayBlock_" + i).addClass(final_class_R);
		}
	}
	
	function level_player_setup()
	{
		trace("level_player_setup();");
		
		if(LEVEL_MAIN.buildData.entry_fall === "YES" && game_introEntrance)
		{
			trace("CATCH");
			
			game_introEntrance = false;
			
			mapPlayer_spawn(LEVEL_MAIN.buildData.fall_x, LEVEL_MAIN.buildData.fall_y, LEVEL_MAIN.buildData.direction, true);
			
			trace(LEVEL_MAIN);
		}
		
		else
		{
			portalExit();
		}
	}
	
	function level_clear()
	{
		var find_bgPixels 		= $("#roam_content").attr("class");
		
		var get_bgPixels_BEG 	= find_bgPixels.search("pixels");
		var get_bgPixels_END 	= find_bgPixels.length;
		var get_bgPixels 		= find_bgPixels.substr(get_bgPixels_BEG, get_bgPixels_END); 
		
		$(".field-floor > div").removeAttr("class");
		
		$(".enemy-area").html("");
		$(".portal-area").html("");
		$(".field-area").html("");
		
		$(".woodland-areas").html("");
		
		$("#space .weather-snow").html("");
		$("#space .weather-rain").html("");
		$("#space .weather-wind").html("");
		
		
		$("#roam_content").removeClass(get_bgPixels);
		$(".field-floor > div").removeAttr("class");
		
		
		for(var object_enemy in enemies_ARR)
		{
			if(enemies_ARR[object_enemy].rendered)
			{
				enemies_ARR[object_enemy].rendered = false;
			}	
		}
	}