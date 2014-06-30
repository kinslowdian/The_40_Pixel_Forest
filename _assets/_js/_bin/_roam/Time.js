	/* @kinslowdian -- http://www.simonkinslow.com -- 2013 */
	
	var TIME;
	
	var GameTime = function()
	{
		this.data;
		this.refreshRate = 20;
		this.daylight;
		this.ticker = setInterval(function(obj){ obj.checkTime(); }, this.refreshRate, this);
		this.daylightset;
	};
	
	GameTime.prototype.checkTime = function()
	{
		this.data = new Date();
		this.data_h = this.data.getHours();
	    
	    if(this.data_h != this.h)
	    {
	        this.h = this.data_h;
	        
	        timeCheck();
	        
	        if(this.refreshRate < 1000)
	        {
	            this.refreshRate = 1000;
	        }
	    }
	};
	
	GameTime.prototype.killTime = function()
	{
	    clearInterval(this.ticker);
	};
	
	function initTime()
	{
		TIME = new GameTime();
		
		$("#dev").bind("click", timeHack);
	}
	
	var timeJumpARR = new Array();
	var timeSel = 0;
	
	timeJumpARR = [22, 6, 8, 19];
	
	
	
	function timeHack(event)
	{
		// $("#dev").unbind("click", timeHack);
		
		TIME.killTime();
		
		
		
		TIME.h = timeJumpARR[timeSel];
		
		// alert("TIME - H " + TIME.h);
		
		timeSel++;
		
		if(timeSel >= timeJumpARR.length)
		{
			timeSel = 0;
		}
				
		timeCheck();
	}
	
	function cancelTime()
	{
		TIME.killTime();
		
		TIME = null;
	}
	
	
	function timeCheck()
	{
	    var change = false;
	    
	    if(TIME.h >= 0 && TIME.h < 5)
	    {
	        if(TIME.daylight != "NIGHT")
	        {
	           TIME.daylight = "NIGHT";
	           
	           change = true;
	        }
	    }
	    
	    if(TIME.h >= 5 && TIME.h < 8)
	    {
	        if(TIME.daylight != "MORNING")
	        {
	           TIME.daylight = "MORNING";
	           
	           change = true;
	        }
	    }
	    
	    if(TIME.h >= 8 && TIME.h < 17)
	    {
	        if(TIME.daylight != "DAY")
	        {
	           TIME.daylight = "DAY";
	           
	           change = true; 
	        }
	    }
	    
	    if(TIME.h >= 17 && TIME.h < 20)
	    {
	        if(TIME.daylight != "EVENING")
	        {
	           TIME.daylight = "EVENING";
	           
	           change = true;
	        }
	    }
	    
	    if(TIME.h >= 20 && TIME.h <= 23)
	    {
	        if(TIME.daylight != "NIGHT")
	        {
	           TIME.daylight = "NIGHT";
	           
	           change = true; 
	        }
	    }
	    
	    if(change)
	    {
		    updateMapDayLight();
	    }
	}
	
	function updateMapDayLight()
	{ 
		if(TIME.daylightset)
		{
			$(".dayLight").removeClass("dayLight-" + TIME.daylightset).addClass("dayLight-" + TIME.daylight);
			
			dayTimeTitleInit();
		}
		
		else
		{
			$(".dayLight").addClass("dayLight-" + TIME.daylight);
		}
		
		TIME.daylightset = TIME.daylight;
	}