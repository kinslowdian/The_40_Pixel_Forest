	
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
		
		alert("event_globalFade_IN();");
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
		//$(fader.obj).css("visibility", "hidden");
	 	// $(fader.obj).removeClass("flood-full");
	 	$(fader.obj).removeAttr("class");
	 	//$(fader.obj).removeClass(fader.colorClass);
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
	
	
	
	