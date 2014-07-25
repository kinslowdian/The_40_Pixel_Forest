	/* REMOVE trace(); FROM ALL SCRIPTS WHEN BUILT */
	
	var trace = function(str)
				{ 
					console.log(str); 
				};
				
	var debug = {};
	
	debug.touch = false;
	debug.hitTest = false
	debug.forceBreak = false;
	debug.useHard = false;
	
	var traceHard = function(str)
	{
		if($("#debug"))
		{
			$("#debug p").text(str);
		}	
	};
	
	function debug_init()
	{
		if(!debug.useHard)
		{
			$("#debug").remove();
		}
	}