	
	var LEVEL_MAIN;
	
	var LIB_DATA;
	
	var BUILD_PORTAL;
	
	var mapSnapShot_html;
	
	var action_map_fadeInto;
	var action_map_fadeOut;
	
	var PORTAL_COM;
	var portals;
	
	var enemies;
	
	
	//////////////////// OBJECTS - TILE + BUILD
	
	
	var LEVEL = function(settings)
	{
		this.settings = settings;
		this.buildData = {};
	}
	
	LEVEL.prototype.create = function()
	{
		this.buildData.levelNumber 	= this.settings.n; 
		this.buildData.block_w 		= this.settings.w * 80;
		this.buildData.block_h 		= this.settings.h * 80;
		this.buildData.weather		= this.settings.w;
		this.buildData.useTime		= this.settings.t;
		this.buildData.entry_x		= this.settings.entry_x;
		this.buildData.entry_y		= this.settings.entry_y;
		this.buildData.fall_x		= this.settings.fall_x;
		this.buildData.fall_y		= this.settings.fall_y;
		this.buildData.entry_d		= this.settings.entry_d;
		this.buildData.act			= this.settings.act;
		this.buildData.title		= this.settings.title;
	
		delete this.settings;
	}
	
	
	var levelBuild = function(settings, num, set, container)
	{
		this.settings = settings;
		this.container = container;
		this.buildData = {};
		this.num = num;
		this.set = set;	
	};
	
	levelBuild.prototype.create = function()
	{
		this.buildData.block_x	= this.settings.x * 80;
		this.buildData.block_y	= this.settings.y * 80;
		this.buildData.block_w	= this.settings.w * 80;
		this.buildData.block_h	= this.settings.h * 80;
		//this.buildData.id		= this.settings.n;
		this.buildData.id		= "level" + GAME.mapLevel + "_" + this.set + this.num;
		this.buildData.pixels	= this.settings.p;
		// WOULD BE GOOD TO DO A CHECK FOR HIT TESTING CLASS THEN ADD data-npc="edge"
		
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
	
	var woodlandClearings = function(settings, container, htmlData)
	{
		this.settings = settings;
		this.library = htmlData;
		this.container = container;
		this.buildData = {};
	};
	
	woodlandClearings.prototype.create = function()
	{
		var html_0;
		var html_1;
		
		this.buildData.block_x	= this.settings.x * 80;
		this.buildData.block_y	= this.settings.y * 80;
		this.buildData.block_w	= this.settings.w * 80;
		this.buildData.block_h	= this.settings.h * 80;
		this.buildData.id		= this.settings.n;
		this.buildData.charType = this.settings.t;
		this.buildData.html 	= html_data_use(this.library, "_" + this.buildData.charType);
		
		delete this.settings;
		delete this.library;
		
		html_0 	= '<div id="';
		html_1	= this.buildData.html.split(html_0);
		
		this.buildData.htmlFinal = html_0 + this.buildData.id + html_1[1];
		
		
		this.buildData.css		= 	{
										"-webkit-transform"	: "translate(" + this.buildData.block_x + "px, " + this.buildData.block_y + "px)",
										"transform"			: "translate(" + this.buildData.block_x + "px, " + this.buildData.block_y + "px)"
									};
		
		
		$(this.container).append(this.buildData.htmlFinal);
		
		
		$("#" + this.buildData.id).css(this.buildData.css);
	};
	
	var characterPlace = function(settings, container, htmlData)
	{
		this.settings = settings;
		this.library = htmlData;
		this.container = container;
		this.buildData = {};
	};
	
	characterPlace.prototype.create = function()
	{
		var html_0;
		var html_1;
		
		this.buildData.block_x	= this.settings.x * 80;
		this.buildData.block_y	= this.settings.y * 80;
		this.buildData.block_w	= this.settings.w * 80;
		this.buildData.block_h	= this.settings.h * 80;
		this.buildData.id		= this.settings.n;
		this.buildData.charType = this.settings.t;
		this.buildData.charHead = this.settings.head;
		this.buildData.html 	= html_data_use(this.library, "_" + this.buildData.charType);
		
		this.area = GAME.mapLevel;
		this.alive = true;
		this.level = this.settings.l;
		
		delete this.settings;
		delete this.library;
		
		html_0 	= '<div id="';
		html_1	= this.buildData.html.split(html_0);
		
		this.buildData.htmlFinal = html_0 + this.buildData.id + html_1[1];
		
		
		this.buildData.css		= 	{
										"-webkit-transform"	: "translate(" + this.buildData.block_x + "px, " + this.buildData.block_y + "px)",
										"transform"			: "translate(" + this.buildData.block_x + "px, " + this.buildData.block_y + "px)"
									};
		
		
		$(this.container).append(this.buildData.htmlFinal);
		
		
		$("#" + this.buildData.id).css(this.buildData.css);
		
		enemies.push(this);

	};
	
	var portalPlace = function(settings, num, container, htmlData)
	{
		this.settings = settings;
		this.library = htmlData;
		this.container = container;
		this.buildData = {};
		this.star_ARR = new Array();
		this.num = num;
	};
	
	portalPlace.prototype.create = function()
	{
		var html_0;
		var html_1;
		
		this.buildData.block_x			= this.settings.x * 80;
		this.buildData.block_y			= this.settings.y * 80;
		this.buildData.block_w			= this.settings.w * 80;
		this.buildData.block_h			= this.settings.h * 80;
		//this.buildData.id				= this.settings.n;
		this.buildData.id				= "level" + GAME.mapLevel + "_portal" + this.num;
		this.buildData.charType 		= this.settings.t;
		this.buildData.html 			= html_data_use(this.library, "_" + this.buildData.charType);
		this.buildData.collideInstance 	= this.settings.collideInstance;
		this.buildData.travel			= this.settings.travel;
		this.buildData.journey			= this.settings.journey;
		this.buildData.exitDir			= this.settings.exitDir;
		this.buildData.starMass			= this.settings.stars;
		
		
		if(this.settings.jump != null)
		{
			this.buildData.jump = this.settings.jump;
		}
		
		// COULD FAIL BECAUSE OF null
		if(this.settings.jump_portal != null)
		{
			this.buildData.enterThroughPortal = true;
			this.buildData.enterThroughPortal_num = this.settings.jump_portal;
		}
		
		else
		{
			this.buildData.enterThroughPortal = false;
		}
		
		delete this.settings;
		delete this.library; 

		html_0 	= '<div id="';
		html_1	= this.buildData.html.split(html_0);
		
		this.buildData.htmlFinal = html_0 + this.buildData.id + html_1[1];
		
		
		this.buildData.css		= 	{
										"-webkit-transform"	: "translate(" + this.buildData.block_x + "px, " + this.buildData.block_y + "px)",
										"transform"			: "translate(" + this.buildData.block_x + "px, " + this.buildData.block_y + "px)"
									};
		
		
		$(this.container).append(this.buildData.htmlFinal);
		
		$("#" + this.buildData.id).attr("data-collideInstance", this.buildData.collideInstance);
		$("#" + this.buildData.id).attr("data-travel", this.buildData.travel);
		$("#" + this.buildData.id).attr("data-exitDir", this.buildData.exitDir);
		$("#" + this.buildData.id).attr("data-x", this.buildData.block_x);
		$("#" + this.buildData.id).attr("data-y", this.buildData.block_y);
		$("#" + this.buildData.id).attr("data-journey", this.buildData.journey);
		$("#" + this.buildData.id).attr("data-jump", this.buildData.jump);
		
		if(this.buildData.enterThroughPortal)
		{
			$("#" + this.buildData.id).attr("data-jump-to", this.buildData.enterThroughPortal_num);
		}
		
		else
		{
			$("#" + this.buildData.id).removeAttr("data-jump-to");
		}
		

		$("#" + this.buildData.id).css(this.buildData.css);
		
									// (holder, w, h, mass) 	
		this.starArea = new StarCont(this.buildData.id, $("#" + this.buildData.id).width(), $("#" + this.buildData.id).height(), this.buildData.starMass);
		
		starConstruct(this);
	};
	
	
	//////////////////// OBJECTS - TILE + BUILD
	
	
	
	
	//////////////////// OBJECTS - PORTAL
	
	
	var Portal = function(div)
	{
		this.id			= $(div).attr("id");
		this.name		= $(div).attr("data-collideInstance");
		this.travel		= $(div).attr("data-travel");
		this.exit 		= $(div).attr("data-exitDir");
		this.x			= parseInt($(div).attr("data-x"));
		this.y			= parseInt($(div).attr("data-y"));
		this.w			= $(div).width();
		this.h			= $(div).height();
		this.cx			= Math.floor(this.w * 0.5) + this.x;
		this.cy			= Math.floor(this.h * 0.5) + this.y;
		this.j_type		= $(div).attr("data-journey");
		
		if($(div).attr("data-jump"))
		{
			this.j_to		= parseInt($(div).attr("data-jump"));
		}
		
		
		
		if($(div).attr("data-jump-to"))
		{
			this.j_to_num	= parseInt($(div).attr("data-jump-to"));	
		}
	
		$(div).removeAttr("data-collideInstance");
		$(div).removeAttr("data-travel");
		$(div).removeAttr("data-exitDir");
		$(div).removeAttr("data-x");
		$(div).removeAttr("data-y");
		$(div).removeAttr("data-journey");
		$(div).removeAttr("data-jump");
		$(div).removeAttr("data-jump-to");
	};
	
	
	
	
	var StarCont = function(holder, w, h, mass)
	{
		this.starCont_id 	= holder;
		this.starCont_w		= w;
		this.starCont_h		= h;
		this.starCont_mass	= mass;
		this.starCont_run	= true;
	};
	
	var Star = function(num, w, h, parentClass)
	{
		this.star_com			= parentClass;
		this.star_id 			= this.star_com.starCont_id + "_star" + num;
		this.star_boundary_w 	= w;
		this.star_boundary_h 	= h;
		this.use_starOpacityDepth = false;
	};
	
	Star.prototype.initValue = function(born)
	{
		this.star_size		= Math.round(Math.random() * (2 - 1) + 1);
		this.star_opacity 	= Math.round(Math.random() * (100 - 30) + 30) / 100;
		this.star_speed 	= Math.round(Math.random() * (12 - 4) + 4);
		this.star_off_sx	= Math.round(Math.random() * (20 - 5) + 5);
		// init x
		this.star_fx		= Math.floor(Math.random() * (this.star_boundary_w + 20)) + 10;
		// start x
		this.star_sx		= this.star_boundary_w + this.star_off_sx;
		// end x
		this.star_ex		= Math.round(Math.random() * (-10 - -20) + -20);
		this.star_sy		= Math.round(Math.random() * (this.star_boundary_h - 5) + 5);				
		
		this.ux				= 0;
		
		born ? this.ux = this.star_fx : this.ux = this.star_sx;
		
		this.use_starOpacityDepth ? this.star_opacity = this.star_opacity : this.star_opacity = 1;
		
/*
		this.star_outer_css	= 	{
									"-webkit-transform"		: "translate3d(0," + this.star_sy + "px, 0)",
									"transform"				: "translate3d(0," + this.star_sy + "px, 0)",
									"opacity"			: this.star_opacity,
									"z-index"			: this.star_id
								};
*/

		this.star_outer_css	= 	{
									"-webkit-transform"		: "translateY(" + this.star_sy + "px)",
									"transform"				: "translateY(" + this.star_sy + "px)",
									"opacity"				: this.star_opacity,
									"z-index"				: this.star_id
								};
								
		this.star_inner_css	=	{
									"width"					: this.star_size + "px",
									"height"				: this.star_size + "px"
								};
								
/*
		this.star_engine_css =	{
									"-webkit-transform"		: "translate3d(" + this.ux + "px, 0, 0)",
									"transform"				: "translate3d(" + this.ux + "px, 0, 0)",
									"-webkit-transition" 	: "-webkit-transform " + this.star_speed  + "s linear",
									"transition" 			: "transform " + this.star_speed  + "s linear"				
								};
*/

		this.star_engine_css =	{
									"-webkit-transform"		: "translateX(" + this.ux + "px)",
									"transform"				: "translateX(" + this.ux + "px)",
									"-webkit-transition" 	: "-webkit-transform " + this.star_speed  + "s linear",
									"transition" 			: "transform " + this.star_speed  + "s linear"				
								};
								
/*
		this.move_css		=	{
									"-webkit-transform"		: "translate3d(" + this.star_ex + "px, 0, 0)",
									"transform"				: "translate3d(" + this.star_ex + "px, 0, 0)"									
								};
*/

		this.move_css		=	{
									"-webkit-transform"		: "translateX(" + this.star_ex + "px)",
									"transform"				: "translateX(" + this.star_ex + "px)"									
								};
								
		this.html			= '<div id="' + this.star_id + '" class="starSpace-starHolder"><div class="starSpace-starSprite starSpace-starSprite-fill-basic"></div></div>';
		
	};
	
	Star.prototype.run = function()
	{
		this.d = setTimeout(starApply, 20, this);
	};
	
	
	//////////////////// OBJECTS - PORTAL
	
	
	
	
	//////////////////// FUNCTIONS BUILD + GAME AREA
	
	
	function start_bitmapAdventure()
	{
		gameAreaClear();
		
		prepGameMapInit();
		
		// CONTROL UPDATER
		
		controlNewLevel();
	}
	
	function prepGameMapInit()
	{
		$(document).get(0).addEventListener("EVENT_HTML_LOADED", prepGameMapDone, false);
		
		var lf = Logic.dat_ROM["_HTML-EXT"]["file_roam"]["file"];
		var lh = new load_HTML(lf, $("#memory"));		
	}
	
	function prepGameMapDone(event)
	{
		$(document).get(0).removeEventListener("EVENT_HTML_LOADED", prepGameMapDone, false);
		
		$("#gameDisp").append($("#memory").html());
		$("#memory").html("");
		
		
		prepGameMapRest();
	}
	
	
	function prepGameMapRest()
	{
		DISPLAY.tileWidth = 80;
		DISPLAY.tileHeight = 80;
		
		mapSnapShot_html = $("#wrapper-roam").html();
		
		// BUG?
		// $(window).resize(function(){ screenUpdate(); });
		
		// $(window).resize(screenUpdate);
		
		// $(window).on("resize", screenUpdate);
		
		screenUpdateInit();
		
		
		GAME.mapLevel = 0;
		
		prepHtmlLibInit();
	}
	
	function prepHtmlLibInit()
	{
		$(document).get(0).addEventListener("EVENT_HTML_LOADED", prepHtmlLibDone, false);
		
		var lf = Logic.dat_ROM["_HTML-EXT"]["file_lib"]["file"];
		var lh = new load_HTML(lf, $("#memory"));		
	}
	
	function prepHtmlLibDone(event)
	{
		$(document).get(0).removeEventListener("EVENT_HTML_LOADED", prepHtmlLibDone, false);
		
		html_lib_store();
	}
	
	
	function html_lib_store()
	{	
		LIB_DATA = $("#memory").html();
		
		levelInit();
	}
	
	function html_lib_reuse()
	{
		$("#memory").html(LIB_DATA);
		
		levelInit();
	}
	
	function html_data_use(dat, classBlock)
	{
		var cb;
		
		$("#memory").html($(dat).html());
		
		cb = $("#memory ." + classBlock).html();
		
		return cb;
		
	}
	
	function html_data_purge()
	{
		$("#memory").html('');
	}
	
	function levelInit()
	{
		// BUG?
		screenUpdate(null);
		
		
		// LEVEL MAIN
		
		LEVEL_MAIN = new LEVEL(Logic.dat_ROM["level" + GAME.mapLevel]["levelSettings"]);
		
		LEVEL_MAIN.create();
		
		levelInit_field();
	}
	
	
	function levelInit_field()
	{
		
		//---------------------- LEVEL_INFO_DISPLAY
		
		levelInfoBuild();
		
		//---------------------- LEVEL_INFO_DISPLAY
		
		
		var woodlandHeight = LEVEL_MAIN.buildData.block_h + DISPLAY.screenSections;
		var hitTestBlock_css;
		var levelFinish_css;
		
		
		$(".field").css("height", LEVEL_MAIN.buildData.block_h + "px");
		
		$(".woodland").css("height", woodlandHeight + "px");
		
		$(".woodland-bg .woodland-bg-border").css("height", LEVEL_MAIN.buildData.block_h + "px");
		
		$(".woodland-bg .woodland-bg-border").addClass("pixels_forest");
		
		levelFinish_css =	{
								"-webkit-transform"	: "translateY(" + LEVEL_MAIN.buildData.block_h + "px)",
								"transform"			: "translateY(" + LEVEL_MAIN.buildData.block_h + "px)"
							};
		
		
		hitTestBlock_css = 	{
								"-webkit-transform"	: "translateY(" + LEVEL_MAIN.buildData.block_h + "px)",
								"transform"			: "translateY(" + LEVEL_MAIN.buildData.block_h + "px)"
							};
		
		$(".fieldEdge-B").css(hitTestBlock_css);
		
		$(".woodland-bg .woodland-bg-levelFinish").css(levelFinish_css);
		
		
		DISPLAY.screenSectionCurrent = 0;
		DISPLAY.screenSectionMove = false;
		
		if(LEVEL_MAIN.buildData.useTime)
		{
			// realtime lighting removed
			// initTime();
		}
		
		levelInit_weather();
	}
	
	function levelInfoBuild()
	{
		var levelInfo_html = html_data_use(LIB_DATA, "_content-levelNotice");
		
		$("#stage-levelNotice").html(levelInfo_html);
	}
	
	function levelInit_weather()
	{
		
		for(var i in LEVEL_MAIN.buildData.weather)
		{
			switch(LEVEL_MAIN.buildData.weather[i].weather)
			{
				case "CLEAR":
				{
				
					break;
				}
				
				case "FOG":
				{
					fogInit();
					
					break;
				}
				
				case "RAIN":
				{
					rainingInit();
					
					break;
				}
				
				case "SNOW":
				{
					snowingInit(".weather-snow", "punchCloudPixels", "snowFlake-pink"); // "pixels_weather-snow", snowFlake-white"
					
					break;
				}
				
				case "WIND":
				{
					// 2, 4
					windInit(3, 1.5);
					
					break;
				}
			}
		}
		
		levelform();
	}

	function levelform()
	{
		var i;
		
		i = 0;
		
		// WALLS BUSHES
		$.each(Logic.dat_ROM["level" + GAME.mapLevel]["texture"]["BUSH"], function(item)
		{
			var b = new levelBuild(Logic.dat_ROM["level" + GAME.mapLevel]["texture"]["BUSH"][item], i, "BUSH", ".field-area");
			
			b.create();
			
			i++;
		});
		
		
		i = 0;
		
		// FLOWERS NON BLOCKING ART
		$.each(Logic.dat_ROM["level" + GAME.mapLevel]["texture"]["FLOWER_LIGHT"], function(item)
		{
			var f = new levelBuild(Logic.dat_ROM["level" + GAME.mapLevel]["texture"]["FLOWER_LIGHT"][item], i, "FLOWER_LIGHT", ".field-area");
			
			f.create();
			
			i++;
		});
		
		// SIDE AREAS
		$.each(Logic.dat_ROM["level" + GAME.mapLevel]["clearing"], function(item)
		{
			var c = new woodlandClearings(Logic.dat_ROM["level" + GAME.mapLevel]["clearing"][item], ".woodland-areas", LIB_DATA);
			
			c.create();
		});			
		
		enemies = new Array();
		
		// MAP ENEMY
		$.each(Logic.dat_ROM["level" + GAME.mapLevel]["enemyPlayers"]["ENEMY"], function(item)
		{
			var e = new characterPlace(Logic.dat_ROM["level" + GAME.mapLevel]["enemyPlayers"]["ENEMY"][item], ".enemy-area", LIB_DATA);
				
			e.create();
				
		});
		
		i = 0;
		
		BUILD_PORTAL = new Array();
		
		// PORTALS
		$.each(Logic.dat_ROM["level" + GAME.mapLevel]["portal"], function(item)
		{
			var p = new portalPlace(Logic.dat_ROM["level" + GAME.mapLevel]["portal"][item], i, ".portal-area", LIB_DATA);
			
			p.create();
			
			BUILD_PORTAL.push(p);
			
			i++;
		});	
		
		decayBuild();
		
		// call once all html data has been used
		html_data_purge();
		
		run();
	}
	
	function decayBuild()
	{
		var decayLength = Logic.dat_ROM["level" + GAME.mapLevel]["decay_L"].length;
		
		for(var i = 0; i < decayLength; i++)
		{
			var final_class_L = Logic.dat_ROM["level" + GAME.mapLevel]["decay_L"][i].cut;
			var final_class_R = Logic.dat_ROM["level" + GAME.mapLevel]["decay_R"][i].cut;
			
			$(".woodland-darkness-left .landDecayBlock_" + i).addClass(final_class_L);
			
			$(".woodland-darkness-right .landDecayBlock_" + i).addClass(final_class_R);
		}
	}	
	
	function run()
	{
		readPortals();
		
		mapPlayerPlace();
		
		levelInfoDisplay();
		
		globalFade_OUT(levelInfoDisplayInit);
	}

	function levelInfoDisplay()
	{
		$("#stage-levelNotice .levelNotice_text_act").text(LEVEL_MAIN.buildData.act.toUpperCase());
		$("#stage-levelNotice .levelNotice_text_title").text(LEVEL_MAIN.buildData.title.toUpperCase());
	}
	
	function levelInfoDisplayInit()
	{
		var levelInfoDisplaydelay;	
	
		levelInfoDisplaydelay = setTimeout(levelInfoDisplayTextRemove, 2.5 * 1000);
	}
	
	function levelInfoDisplayTextRemove()
	{
		$("#stage-levelNotice .levelNotice_text_title")[0].addEventListener("webkitTransitionEnd", levelInfoDisplayTextRemoveEnd, false);
		$("#stage-levelNotice .levelNotice_text_title")[0].addEventListener("transitionend", levelInfoDisplayTextRemoveEnd, false);
		
		$("#stage-levelNotice .levelNotice_text p").css("opacity", "0");
	}
	
	function levelInfoDisplayTextRemoveEnd(event)
	{
		$("#stage-levelNotice .levelNotice_text_title")[0].removeEventListener("webkitTransitionEnd", levelInfoDisplayTextRemoveEnd, false);
		$("#stage-levelNotice .levelNotice_text_title")[0].removeEventListener("transitionend", levelInfoDisplayTextRemoveEnd, false);
		
		// MOBILE-FIX
		screenUpdate(null);
		
		var fullRemoveDelay = setTimeout(levelInfoDisplayRemove, 500);		
	}
	
	function levelInfoDisplayRemove(event)
	{
		var levelInfoDisplay_css;
		
		$("#stage-levelNotice .content-levelNotice")[0].addEventListener("webkitTransitionEnd", levelInfoDisplayEvent, false);
		$("#stage-levelNotice .content-levelNotice")[0].addEventListener("transitionend", levelInfoDisplayEvent, false);		
		
		levelInfoDisplay_css	= 	{
										"-webkit-transform"	: "translateY(" + -DISPLAY._height + "px)",
										"transform"			: "translateY(" + -DISPLAY._height + "px)"
									};
		
		$("#stage-levelNotice .content-levelNotice").css(levelInfoDisplay_css);
		
		$("#stage-levelNotice .content-levelNoticeShadow").css("opacity", "0");
	}
	
	function levelInfoDisplayEvent(event)
	{
		$("#stage-levelNotice .content-levelNotice")[0].removeEventListener("webkitTransitionEnd", levelInfoDisplayEvent, false);
		$("#stage-levelNotice .content-levelNotice")[0].removeEventListener("transitionend", levelInfoDisplayEvent, false);		
	
	
		$("#stage-levelNotice .content-levelNotice").remove();
		$("#stage-levelNotice .content-levelNoticeShadow").remove();
		
		mapPlayerStartQuest();
	}

	//---------------------- LEVEL_INFO_DISPLAY

	
	
	
	function refreshRebuildLevel()
	{
		// clear weather
		
		mapWeatherClear();
		
		
		// clear portals
		
		// portalClear();
		
		portalClear(true);
		
		// clear arrays objects (Wind, Snow, Stars, Textures)
		
		// CALL ONCE?
		$("#wrapper-roam").html(mapSnapShot_html);
		
		NEW_LEVELER = true;
		
		LEVEL_MAIN = null;
		
		html_lib_reuse();
	}
	
	function screenUpdateInit()
	{
		DISPLAY.screenUpdateUse = true;
		
		$(window).on("resize", screenUpdate);
	}
	
	function screenUpdateCancel()
	{
		DISPLAY.screenUpdateUse = false;
		
		$(window).off("resize");
	}
	
	
	function screenUpdate(event)
	{
		trace("screenUpdate(); === " + event);
		trace(event);
		
		var css_x;
		var css_y;
		var x;
		var y;
		
		
		DISPLAY._width 			= window.screen.width;
		DISPLAY._height 		= window.screen.height;
		DISPLAY._width_row 		= Math.round(DISPLAY._width / DISPLAY.tileWidth);
		DISPLAY._height_row 	= Math.round(DISPLAY._height / DISPLAY.tileHeight);
		DISPLAY._width_fill 	= DISPLAY._width_row * DISPLAY.tileWidth;
		DISPLAY._height_fill	= DISPLAY._height_row * DISPLAY.tileHeight;
		
		if(DISPLAY.screenUpdateUse)
		{
			// fix blurring:
			DISPLAY.center_X		= Math.floor(($("#stage-roam").width() - $(".woodland").width()) * 0.5);
			
			DISPLAY.center_y	= 0;
			
	
			DISPLAY.center_X < 0 ? x = DISPLAY.center_X : x = 0;
			
			css_x = {
						"-webkit-transform"	: "translateX(" + x + "px)",
						"transform" 		: "translateX(" + x + "px)"
					};
				
			$(".stageCenter-x").css(css_x);
			
			
			DISPLAY.stageOffset = $(".woodland").offset().left;
			
			DISPLAY.viewHeight = document.height;
			
			DISPLAY.y = 0;	
			DISPLAY.current_y = 0;
			
			if(!DISPLAY.screenSections)
			{
				screenDivision();	
			}
		}
	}
	
	function screenDivision()
	{
		DISPLAY._height <= 480 ?  DISPLAY.screenSections = 240 : DISPLAY.screenSections = 400;
	}	
	
	
	//////////////////// FUNCTIONS BUILD + GAME AREA
	
	
	
	
	//////////////////// FUNCTIONS PORTAL
	
	
	function readPortals()
	{
		PORTAL_COM = {};
		
		portals = new Array();
		
		$(".portal").each(function(i)
		{
			var p = new Portal(this);
		
			portals.push(p);
		});
	}
	
	function starConstruct(obj)
	{
		
		for(var i = 0; i < obj.starArea.starCont_mass; i++)
		{
			var s = new Star(i, obj.starArea.starCont_w, obj.starArea.starCont_h, obj.starArea);
			
			
			s.initValue(true);
			
			obj.star_ARR.push(s);
			
			starBuild(obj, i);
		}
	}
	
	
	function starBuild(obj, v)
	{
		$("#" + obj.starArea.starCont_id + " .starSpace").append(obj.star_ARR[v].html);
		
		$("#" + obj.starArea.starCont_id + " #" + obj.star_ARR[v].star_id).css(obj.star_ARR[v].star_outer_css);
		
		$("#" + obj.starArea.starCont_id + " #" + obj.star_ARR[v].star_id + " .starSpace-starSprite").css(obj.star_ARR[v].star_inner_css);
		
		$("#" + obj.starArea.starCont_id + " #" + obj.star_ARR[v].star_id + " .starSpace-starSprite").css(obj.star_ARR[v].star_engine_css);
		
		obj.star_ARR[v].run();
	}

	
	function starApply(_s)
	{
		if(_s.star_com.starCont_run)
		{
			$("#" + _s.star_id + " .starSpace-starSprite").css(_s.move_css);
			$("#" + _s.star_id + " .starSpace-starSprite")[0].addEventListener("webkitTransitionEnd", starCycle, false); //get(0)	
			$("#" + _s.star_id + " .starSpace-starSprite")[0].addEventListener("transitionend", starCycle, false);	
		}
	}
	
	function starCancel(_s)
	{
		$("#" + _s.star_id + " .starSpace-starSprite")[0].removeEventListener("webkitTransitionEnd", starCycle, false);	
		$("#" + _s.star_id + " .starSpace-starSprite")[0].removeEventListener("transitionend", starCycle, false);			
	}
	
	
	function starCycle(event)
	{
		var PORTAL = event.target.parentElement.parentElement.parentElement.id;
		
		var TARG = event.target.parentElement.id;
		
		$("#" + TARG + " .starSpace-starSprite")[0].removeEventListener("webkitTransitionEnd", starCycle, false);	
		$("#" + TARG + " .starSpace-starSprite")[0].removeEventListener("transitionend", starCycle, false);	
		
		
		for(var i in BUILD_PORTAL)
		{
			if(BUILD_PORTAL[i].buildData.id === PORTAL)
			{
				for(var j in BUILD_PORTAL[i].star_ARR)
				{
					if(TARG === BUILD_PORTAL[i].star_ARR[j].star_id)
					{
						$("#" + BUILD_PORTAL[i].star_ARR[j].star_id).remove();
						
						if(BUILD_PORTAL[i].starArea.starCont_run)
						{
							BUILD_PORTAL[i].star_ARR[j].initValue(false);
							starBuild(BUILD_PORTAL[i], j);							
						}
					}
				}
			}
		}
	}
	
	function rebuildStarsInit()
	{
		for(var i in BUILD_PORTAL)
		{
			reBuildStars(BUILD_PORTAL[i]);
		}
	}
		
		
	function reBuildStars(portal_obj)
	{
		portal_obj.starArea = new StarCont(portal_obj.buildData.id, $("#" + portal_obj.buildData.id).width(), $("#" + portal_obj.buildData.id).height(), portal_obj.buildData.starMass);
			
		starConstruct(portal_obj);			
	}
	
/*
	function portalStarsHold()
	{
		for(var i in BUILD_PORTAL)
		{
			BUILD_PORTAL[i].starArea.starCont_run = false;
			
			for(var j in BUILD_PORTAL[i].star_ARR)
			{
				starCancel(BUILD_PORTAL[i].star_ARR[j]);
			}
		}
	}
*/
	
/*
	function portalStarsContinue()
	{
		for(var i in BUILD_PORTAL)
		{
			BUILD_PORTAL[i].starArea.starCont_run = true;
			
			for(var j in BUILD_PORTAL[i].star_ARR)
			{
				starApply(BUILD_PORTAL[i].star_ARR[j]);
			}
		}
		
	}
*/

// ORIGINAL
	
/*
	function portalClear()
	{
		var checkStar = true;
		
		
		for(var i in BUILD_PORTAL)
		{
			if(checkStar)
			{
				checkStar = false;
			}
			
			BUILD_PORTAL[i].starArea.starCont_run = false;
			
			for(var j in BUILD_PORTAL[i].star_ARR)
			{
				starCancel(BUILD_PORTAL[i].star_ARR[j]);
			}
			
			BUILD_PORTAL[i].star_ARR.length = 0;
		}
		
		BUILD_PORTAL.length = 0;
		
		portals.length = 0;
	}	
*/


	function portalClear(fullClear)
	{
		var checkStar = true;
		
		
		for(var i in BUILD_PORTAL)
		{
			if(checkStar)
			{
				checkStar = false;
			}
			
			BUILD_PORTAL[i].starArea.starCont_run = false;
			
			for(var j in BUILD_PORTAL[i].star_ARR)
			{
				starCancel(BUILD_PORTAL[i].star_ARR[j]);
			}
			
			BUILD_PORTAL[i].star_ARR.length = 0;
		
			if(!fullClear)
			{
				$("#" + BUILD_PORTAL[i].starArea.starCont_id + " .starSpace").html("");
			}
		}
		
		if(fullClear)
		{
			BUILD_PORTAL.length = 0;
		
			portals.length = 0;	
		}
	}	
	
	
	//////////////////// FUNCTIONS PORTAL
	
	
	
	
	
	