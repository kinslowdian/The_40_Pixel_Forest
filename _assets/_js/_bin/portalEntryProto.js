	function portalEntry(hitPortal)
	{
		for(var i in portals)
		{
			if(portals[i].id === hitPortal)
			{
				if(portals[i].j_type === "LEVEL")
				{
					if(portals[i].j_to_num != null)
					{
						PORTAL_LEVEL_TRAVEL = true;
										
						GAME.portalEnterThrough = portals[i].j_to_num;				
					}
									
					MAP_PLAYER.changeLevel = true;
									
					GAME.mapLevel = portals[i].j_to;
				}						
								
				if(portals[i].j_type === "STAGE")
				{
					MAP_PLAYER.changeLevel = false;
				}
								
				for(var j in portals)
				{
					if(portals[i].travel === portals[j].name)
					{
						MAP_PLAYER.portalObj = portals[j];
					}
				}
			}
		}
	}