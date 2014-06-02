	
	/* --- JSON */
	
	/* --- HTML */
	
	var Logic;
	
	var ext_html_path;
	
	var ext_html_data;
	
	var json_local_root = "_assets/_data/";
	
	var event_htmlLoaded = document.createEvent("Event");
	
	event_htmlLoaded.initEvent("EVENT_HTML_LOADED", true, true);
	
	// --------------------------------------------- JSON
	
	function gameData_get()
	{
		Logic = new Object();
		
		Logic.dat_FILE = "setup.json";
		Logic.dat_ROM;
		Logic.dat_COMPLETE = gameData_get_loaded;
		
		get_JSON(Logic);
	}
	
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
		
	function gameData_get_loaded()
	{
		// var save_ARR = new Array();
		
		if(!ext_html_path)
		{
			ext_html_path = Logic.dat_ROM["_HTML-EXT"]["file_path"]["url"];
		}
		
		// HACK
		temp_callback_json();
		// HACK
	}	
	
	// --------------------------------------------- JSON
	
	
	// --------------------------------------------- HTML
	
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
				
			// firing the event
			exit_frame = setTimeout(function(){ document.dispatchEvent(event_htmlLoaded); }, 20);
		});				
	}	
	
	function html_lib_init()
	{
		$(document).get(0).addEventListener("EVENT_HTML_LOADED", html_lib_loaded, false);
		
		var lf = Logic.dat_ROM["_HTML-EXT"]["file_lib"]["file"];
		var lh = new load_HTML(lf, $("#memory"));		
	}
	
	function html_lib_loaded(event)
	{
		$(document).get(0).removeEventListener("EVENT_HTML_LOADED", html_lib_loaded, false);
		
		html_lib_store();
	}
	
	function html_lib_store()
	{	
		ext_html_data = $("#memory").html();
		
		temp_callback_html();
	}
	
	function html_lib_use(html_class)
	{
		var html;
		
		html = $("#memory ." + html_class).html();
		
		return html;
	}
	
	function html_lib_empty()
	{
		$("#memory").html("");
	}
	
	function html_lib_reuse()
	{
		$("#memory").html(ext_html_data);
	}	
	
	// --------------------------------------------- HTML