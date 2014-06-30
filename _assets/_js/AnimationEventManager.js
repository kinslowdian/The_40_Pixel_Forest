	
	// --------------------------------------------- TIMER
	
	var timerListMain;
		
	var AnimationTimersMain = function()
	{
		this.timerList = new Array();
	};
	
	AnimationTimersMain.prototype.listFlush = function()
	{
		for(var i in this.timerList)
		{	
			delete this.timerList[i];
		}
		
		this.timerList = [];
	};
		
	AnimationTimersMain.prototype.listTimer = function(ob)
	{
		this.timerList.push(ob);	
	};
		
	AnimationTimersMain.prototype.cancelAll = function()
	{
		for(var i in this.timerList)
		{
			this.timerList[i].cancel();
		}
	};
		
	var AnimationTimer = function()
	{
 		this._AT;
 	};
 			
 	AnimationTimer.prototype.time = function(s, f, p)
 	{
 		p == undefined ? this._AT = setTimeout(f, s * 1000) : this._AT = setTimeout(f, s * 1000, p);
 	};
 		
 	AnimationTimer.prototype.cancel = function()
 	{
	 	clearTimeout(this._AT);	
	};
	
	function timerList_init()
	{
		timerListMain = new AnimationTimersMain();
	}
	
	function timerList_add(ob)
	{
		if(timerListMain != null || timerListMain != undefined)
		{
			if(ob != null || ob != undefined)
			{
				timerListMain.listTimer(ob);	
			}
		}
	}
	
	function timerList_stopAll()
	{
		timerListMain.cancelAll();
	}
	
	function timerList_destroy()
	{	
		timerListMain.listFlush();
		
		timerListMain = null;
	}
	
	
	// --------------------------------------------- CSS EVENTS
	
	// animationEventManager("#box0", "TRANSITION", "onEnd");
	
	// animationEventManager(".box", "ANIMATION", "onEnd");
	
	/*
	function onEnd(event)
	{
		if($(event.target).attr("data-animationlink"))
		{
			animationEventKill($(event.target).attr("data-animationlink"));
		}	
	}
	*/
	
		
	function animationEventManager(div, anim_t, anim_f)
	{
		var dynamicFunction;
					
		if(div != undefined || div != null || div)
		{
			$(div).attr("data-animationlink", div);
			$(div).attr("data-animationtype", anim_t);
			$(div).attr("data-animationfunction", anim_f);
						
			dynamicFunction = window[anim_f];
						
			if(anim_t === "TRANSITION")
			{
				$(div)[0].addEventListener("webkitTransitionEnd", dynamicFunction, false); 
				$(div)[0].addEventListener("transitionend", dynamicFunction, false);
			}
					    
			if(anim_t === "ANIMATION")
			{
				$(div)[0].addEventListener("webkitAnimationEnd", dynamicFunction, false); 
				$(div)[0].addEventListener("animationend", dynamicFunction, false); 
			}
		}
	}
				
	function animationEventKillAll(container)
	{
		$(container + " div").each(function(i, div)
		{
			if($(div).attr("data-animationlink"))
			{
				animationEventKill($(div).attr("data-animationlink"));	
			}
		});
	}
	
	function animationEventKill(div)
	{
		var dynamicName;
		var dynamicEvent;
		var dynamicFunction;
					
		dynamicName			= 	$(div).attr("data-animationlink");
		dynamicEvent 		= 	$(div).attr("data-animationtype")
		dynamicFunction 	= 	window[$(div).attr("data-animationfunction")];
							
							
		if(dynamicEvent === "TRANSITION")
		{
			$(dynamicName)[0].removeEventListener("webkitTransitionEnd", dynamicFunction, false);
			$(dynamicName)[0].removeEventListener("transitionend", dynamicFunction, false);
		}
							
		if(dynamicEvent === "ANIMATION")
		{
			$(dynamicName)[0].removeEventListener("webkitAnimationEnd", dynamicFunction, false);
			$(dynamicName)[0].removeEventListener("animationend", dynamicFunction, false); 							
		}
	}