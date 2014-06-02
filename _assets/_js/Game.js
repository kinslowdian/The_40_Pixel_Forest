	
	$(document).ready( function(){ gameFirstInit(); } );
	
	function gameFirstInit()
	{
		alert("READY");
	}
	
	function phoneRotate(event)
	{
		var base_css;
		
		if(event != null || event != undefined)
		{
			touchOffsetUpdate();
		}
		
		if(window.innerWidth < window.innerHeight)
		{
			trace("DISPLAY_OK");
			
			$("#displayErrorWrapper .displayError").removeClass("displayErrorShow").addClass("displayErrorHide");
		
			base_css = 	{
							"-webkit-transition-delay"	: "0.6s",
							"transition-delay" 			: "0.6s",
							"opacity"					: "0"
						};
		}
		
		else
		{
			trace("DISPLAY_FAIL");
			
			$("#displayErrorWrapper .displayError").removeClass("displayErrorHide").addClass("displayErrorShow");

			base_css = 	{
							"-webkit-transition-delay"	: "0s",
							"transition-delay" 			: "0s",
							"opacity"					: "1"
						};
		}
		
		$("#displayErrorWrapper .displayError-base").css(base_css);
	}