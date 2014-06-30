	// --------------------------------------------- JSON TOOL
	
	var json_local_root = "_assets/_data/";
	
	function get_JSON(obj)
	{
		var json_request = new XMLHttpRequest();
		var json_method = "GET"; //other option is POST
		var json_url = json_local_root + obj.dat_FILE; //file
		var json_async = true;
		
		json_request.open(json_method, json_url, json_async);
			
		json_request.onload = function()
		{
			obj.dat_ROM = JSON.parse(this.responseText);
				
			obj.dat_COMPLETE();
		};
			
		json_request.send();
	}
	
	// --------------------------------------------- JSON TOOL