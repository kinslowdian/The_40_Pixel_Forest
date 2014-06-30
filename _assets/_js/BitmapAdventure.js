	/* @kinslowdian -- http://www.simonkinslow.com -- 2013 */
	
	$(document).ready(function(){ JS_READY(); });
	
	// --------------------------------------------- GAME OBJECT
	
	var GAME = function()
	{
		this.battle_RESULT;
	};
	
	GAME.prototype.pressPlayOnTape = function()
	{
		this.battle_RESULT = "";
	};
	
	// --------------------------------------------- GAME OBJECT
	
	// --------------------------------------------- HTML LOADER
	
	var event_htmlLoaded = document.createEvent("Event");
	
	event_htmlLoaded.initEvent("EVENT_HTML_LOADED", true, true);
	
	var ext_html_path;
	
	var load_HTML = function(_html, target)
	{
		var ext_html = ext_html_path + _html;
		var exit_frame;
				
		$(target).load(ext_html, function(html)
		{
			// adding parameters to the event
			event_htmlLoaded.fileLoaded = _html;
			event_htmlLoaded.data = html;
			event_htmlLoaded.dataContainer = target;
					
			$(target).html("");
					
			$(target).html(html);
					
			// stops flickker
			$("#" + $(target).attr("id") + " > div").addClass("safety");
				
			// firing the event
			exit_frame = setTimeout(function(){ document.dispatchEvent(event_htmlLoaded); }, 20);
		});				
	}	
	
	// --------------------------------------------- HTML LOADER
	
	// --------------------------------------------- FADER
	
	var fader;
	
	function globalFade_init()
	{
		fader = {};
		
		fader.obj = $("#fader");		
	}
	
	function globalFade_IN(fill, onComplete)
	{
		if(fader.colorClass)
		{
			$(fader.obj).removeClass(fader.colorClass).addClass("fader-fill-" + fill);
		}
		
		else
		{
			$(fader.obj).addClass("fader-fill-" + fill);			
		}
		
		fader.colorClass = "fader-fill-" + fill;
		
		$(fader.obj).css("visibility", "visible");
	 	$(fader.obj).addClass("flood-full");
	 	$(fader.obj).css("opacity", "1");
	 	
	 	if(onComplete)
	 	{
		 	fader.inFunct = onComplete;
		 	fader.inFunctCalled = false;
	 	}
	 	
	 	$(fader.obj).get(0).addEventListener("webkitTransitionEnd", event_globalFade_IN, false);
		$(fader.obj).get(0).addEventListener("transitionend", event_globalFade_IN, false);
	}
	
	function event_globalFade_IN(event)
	{
		$(fader.obj).get(0).removeEventListener("webkitTransitionEnd", event_globalFade_IN, false);
		$(fader.obj).get(0).removeEventListener("transitionend", event_globalFade_IN, false);		
	
		if(!fader.inFunctCalled)
		{
			fader.inFunctCalled = true;
			fader.inFunct();
		}
	}
	
	function globalFade_OUT(onComplete)
	{
		$(fader.obj).css("opacity", "0");
		
	 	$(fader.obj).get(0).addEventListener("webkitTransitionEnd", event_globalFade_OUT, false);
		$(fader.obj).get(0).addEventListener("transitionend", event_globalFade_OUT, false);
	
	 	if(onComplete)
	 	{
		 	fader.outFunct = onComplete;
		 	fader.outFunctCalled = false;
	 	}		
	}
	
	function event_globalFade_OUT()
	{
		$(fader.obj).get(0).removeEventListener("webkitTransitionEnd", event_globalFade_OUT, false);
		$(fader.obj).get(0).removeEventListener("transitionend", event_globalFade_OUT, false);
		
		if(!fader.outFunctCalled)
		{
			fader.outFunctCalled = true;
			fader.outFunct();			
		}
		
		globalFade_clear();	
	}
	
	function globalFade_clear()
	{
	 	$(fader.obj).removeAttr("class");
	 	$(fader.obj).removeAttr("style");
	 	
	 	
	 	fader.colorClass = "";
	 	
	 	if(fader.inFunct)
	 	{
	 		delete fader.inFunct;
	 	}
	 	
	 	if(fader.outFunct)
	 	{
	 		delete fader.outFunct;		
	 	}
	}
	
	// --------------------------------------------- FADER
	
	
	
	
	var OS;
	
	var DISPLAY;
	
	var userPresentClicked;
		
	var fallOff;
	
	var skipBtnUp = false;
	var skipRequest = false;
	var skipCancel = false;
	
	var deviceTest;
	
	function phoneRotate(event)
	{
		if(window.orientation === 0)
		{
			
		}
		
		else if(window.orientation === -90 || window.orientation === 90)
		{

		}
		
		else
		{

		}
		
		// FIX TOUCH CONTROLS THROUGH DEVICE ROTATION
		if(CONTROL_SIGNAL)
		{
			touchOffsetUpdate();	
		}
	}
	
	
	function JS_READY()
	{
		deviceTest = deviceTouchTest();
		
		DISPLAY = new Object();
		
		// DISPLAY._width = window.screen.availWidth;
		// DISPLAY._height = window.screen.availHeight;
		
		DISPLAY._width 			= window.screen.width;
		DISPLAY._height 		= window.screen.height;
		
		var NAV_PLATFORM = navigator.platform.toLowerCase();
		
		// iOS
				
		if(NAV_PLATFORM.search("iphone") > -1)
		{
			OS = "TOUCH";
		}
				
		else if(NAV_PLATFORM.search("ipad") > -1)
		{
			OS = "TOUCH_TABLET";
		}
		
		// android
		else if(NAV_PLATFORM.search("android") > -1)
		{
			window.screen.availWidth <= 320 ? OS = "TOUCH" : OS = "DEFINE_MOUSE_OR_TOUCH";
					
			if(OS === "DEFINE_MOUSE_OR_TOUCH")
			{
				var usingAndroidTouch = confirm("Are you using an Android Tablet?");
	
				usingAndroidTouch ? OS = "TOUCH_TABLET" : OS = "MOUSE_TOUCH";
			}
		}
		
		// desktop
		else
		{
			OS = "MOUSE_TOUCH";
		}
		
		trace(DISPLAY);
		
/*
		NEW_GAME();
		NEW_INTRO();
		NEW_START();
*/

		getStartData();
	}
	
	function deviceTouchTest()
	{
		return typeof window.ontouchstart;
	}
	
	function getStartData()
	{
		NEW_START();
		
		init_difficulty_data();
	}
	
	// JSON LOADED INTO HTML LOADED AND PREPPED
	function getStartDataFound()
	{
		trace("getStartDataFound();");
		
		NEW_GAME();
		NEW_INTRO();
		//NEW_START();
		
		$("#START-content").addClass("tween-START-content");
		
		showDeetsControl(0);
				
	}
	
	function NEW_START()
	{
		userPresentClicked = false;
		
		showDeetsControl(DISPLAY._height);
		
		// var prepShowDeetsDelay = new AnimationTimer();
		// prepShowDeetsDelay.time(0.5, prepShowDeets);		
		
		// var showDeetsDelay = new AnimationTimer();
		// showDeetsDelay.time(1, showDeetsControl, 0);
	}
	
	function prepShowDeets()
	{
		$("#START-content").addClass("tween-START-content");
	}
	
	function showDeetsControl(pos_y)
	{
		var pos_css;
		
		pos_css =	{
						"-webkit-transform"	: "translateY(" + pos_y + "px)",
						"transform"			: "translateY(" + pos_y + "px)"
					};
				
		$("#START-content").css(pos_css);
		
		$("#START-content").get(0).addEventListener("webkitTransitionEnd", displayHeader, false);
		$("#START-content").get(0).addEventListener("transitionend", displayHeader, false);		
	}
	
	function displayHeader(event)
	{
		$("#START-content").get(0).removeEventListener("webkitTransitionEnd", displayHeader, false);
		$("#START-content").get(0).removeEventListener("transitionend", displayHeader, false);			
	
		$("#START header").css("opacity", "1");
	}
	
	function userPresent(event)
	{
		if(!userPresentClicked)
		{
			userPresentClicked = true;
			
			var pos_css;
		
			pos_css = 	{
							"-webkit-transform"	: "translateY(0px)",
							"transform"			: "translateY(0px)"
						};
	
			$("#START-goat").css(pos_css);
			$("#START").css("background", "#ff0055");
			
			$("#START header").css("color", "#fff");
			
			$("#START").get(0).addEventListener("webkitTransitionEnd", removeStartScreenInit, false);
			$("#START").get(0).addEventListener("transitionend", removeStartScreenInit, false);
			
		}
	}
	
	function removeStartScreenInit(event)
	{
		$("#START").get(0).removeEventListener("webkitTransitionEnd", removeStartScreenInit, false);
		$("#START").get(0).removeEventListener("transitionend", removeStartScreenInit, false);
		
		globalFade_init();
		
		var removeStartScreenDelay = new AnimationTimer();
		removeStartScreenDelay.time(1, removeStartScreen);
	}
	
	
	
	function removeStartScreen()
	{
		globalFade_IN("white", purgeStartScreen);
	}
	
	function purgeStartScreen()
	{	
		$("#START").removeAttr('style');
		$("#START").html("");
		$("#START").css("visibility", "hidden");
		
		$(".start-extras").remove();
		
/*
		$("#START").html(" ");
		
		// CLEARS ALL STYLES!
		$("#START").removeAttr("style");
*/
		
		build_intro();
	}
	
	
	function gameAreaClear()
	{
		$("#gameDisp").html("");
	}
	
	function skipBtn_init()
	{
		var skipBtn_css;
		
		if(!skipBtnUp)
		{
			skipBtnUp = true;
			
			skipBtn_css = 	{
								"-webkit-transform"	: "translateY(0px)",
								"transform"			: "translateY(0px)"
							};
			
			// $("#skipIntro").css("opacity", 1);
			
			$("#skipIntro").css(skipBtn_css);
			
			$("#skipIntro").bind("click", skipBtn_event);
		}
	}
	
	function skipBtn_event(event)
	{
		var cancel_css;
		
		if(!skipRequest && !skipCancel)
		{
			skipRequest = true;
			$("#skipIntro").unbind("click", skipBtn_event);
			
			cancel_css = 	{
								"pointer-events"	:	"auto",
								"cursor"			:	"pointer"								
							};
			
			$("#skipIntro").css(cancel_css);
			
			skipButtonUsed();			
		}
	}
	
	function skipBtn_cancel()
	{
		var cancel_css;
		
		skipCancel = true;
		
		cancel_css = 	{
							"pointer-events"	: "auto",
							"cursor"			: "pointer",								
							"-webkit-transform"	: "translateY(0px)",
							"transform"			: "translateY(0px)"
						};
			
		$("#skipIntro").css(cancel_css);
		
		$("#skipIntro")[0].addEventListener("webkitTransitionEnd", skipBtn_tweenEnd, false);
		$("#skipIntro")[0].addEventListener("transitionend", skipBtn_tweenEnd, false);
	}
	
	function  skipBtn_tweenEnd(event)
	{
		$("#skipIntro")[0].removeEventListener("webkitTransitionEnd", skipBtn_tweenEnd, false);
		$("#skipIntro")[0].removeEventListener("transitionend", skipBtn_tweenEnd, false);
		
		skipBtn_remove();
	}
	
	function skipBtn_remove()
	{
		$("#skipIntro").remove();
	}