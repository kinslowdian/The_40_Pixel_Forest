// modify this to rebuild browsers
		
		
		for(var i in BUILD_PORTAL)
		{
			if(BUILD_PORTAL[i].buildData.id === PORTAL)
			{
				for(var j in BUILD_PORTAL[i].star_ARR)
				{
					if(TARG === BUILD_PORTAL[i].star_ARR[j].star_id)
					{
						$("#" + BUILD_PORTAL[i].star_ARR[j].star_id).remove();
						
						if(BUILD_PORTAL[i].starArea.starCont_run)
						{
							BUILD_PORTAL[i].star_ARR[j].initValue(false);
							starBuild(BUILD_PORTAL[i], j);							
						}
					}
				}
			}
		}
		
		function rebuildStarsInit()
		{
			for(var i in BUILD_PORTAL)
			{
				reBuildStars(BUILD_PORTAL[i]);
			}
		}
		
		
		function reBuildStars(portal_obj)
		{
			portal_obj.starArea = new StarCont(portal_obj.buildData.id, $("#" + portal_obj.buildData.id).width(), $("#" + portal_obj.buildData.id).height(), portal_obj.buildData.starMass);
			
			starConstruct(portal_obj);			
		}
		
		BUILD_PORTAL[i] >
		
		
		
		
		$("#" + obj.starArea.starCont_id + " .starSpace").html("");

