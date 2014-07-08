	/* REMOVE trace(); FROM ALL SCRIPTS WHEN BUILT */
	
	var trace = function(str)
				{ 
					console.log(str); 
				};
				
	var debug = {};
	
	debug.touch = false;
	debug.hitTest = false
	debug.forceBreak = false;