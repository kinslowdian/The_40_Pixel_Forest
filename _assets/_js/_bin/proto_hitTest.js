	var HIT_TEST;
	
	function hitTest_build()
	{
		HIT_TEST = {};
		HIT_TEST.hits = null;
		
		HIT_TEST.hit_enemy_target = "";
		HIT_TEST.hit_portal_target = "";
		
		HIT_TEST.hit_edge = false;
		HIT_TEST.hit_enemy = false;	
		HIT_TEST.hit_portal = false;	
	}
	
	function hitTest_init()
	{
		var hit_id = "";
		
		// SETUP - INIT
		
		HIT_TEST.hits = $(".preHitTest .collideCheck-player").collision(".collideCheck-field");
		
		if(HIT_TEST.hits[0] != undefined || HIT_TEST.hits[0] != null)
		{
			hit_id = $(HIT_TEST.hits[0]).attr("id");
			
			// PLAYER HITS ENEMY
						
			if($("#" + hit_id).attr("data-npc") === "enemy")
			{
				HIT_TEST.hit_enemy	= true;
				
				HIT_TEST.hit_enemy_target = hit_id;
				
				nonAlert("HIT ENEMY " + HIT_TEST.hit_enemy_target);
				
				controlsCancel(false);
				
				playerInBattle = true;
			
				enemySearch(HIT_TEST.hit_enemy_target);
				
				mapPlayerMoveX();
				mapPlayerMoveY();
			}
			
			// PLAYER HITS PORTAL
			else if($("#" + hit_id).attr("data-gameObject") === "portal")
			{
				HIT_TEST.hit_portal	= true;
				
				HIT_TEST.hit_portal_target = $(HIT_TEST.hits[0]).attr("id");
				
				controlsCancel(false);
				
				playerInPortal = true;
				
				portalEntry(HIT_TEST.hit_portal_target);
				
				$(".player-area").css("opacity", 0);
				
				mapPlayerMoveX();
				mapPlayerMoveY();
				
				
				nonAlert("HIT PORTAL " + HIT_TEST.hit_portal_target);				
			}
			
			// PLAYER HITS EDGE
			
			else
			{
				HIT_TEST.hit_edge = true;
				
				MAP_PLAYER.x = MAP_PLAYER.current_x;
				MAP_PLAYER.y = MAP_PLAYER.current_y;
				
				revert_XY();	
			
				nonAlert("HIT EDGE");
			}
		}

		
		else
		{
			HIT_TEST.hit_edge = false;
			HIT_TEST.hit_enemy = false;
			HIT_TEST.hit_portal	= false;
			
			mapPlayerMoveX();
			mapPlayerMoveY();
			
			nonAlert("HIT NOTHING");
		}
	}