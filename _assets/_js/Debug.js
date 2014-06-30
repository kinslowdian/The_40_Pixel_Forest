	/* REMOVE trace(); FROM ALL SCRIPTS WHEN BUILT */
	
	var trace = function(str)
				{ 
					console.log(str); 
				};
				
	var NO_HIT_TEST = false;
	
	var BREAK_CODE = false;
	
	function breakCode()
	{
		BREAK_CODE = true;
	}