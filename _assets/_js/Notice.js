	
	var noticeInUse = false;
	
	var noticeDataNode;
	
	// var NoticeFunctions;
	
	var NoticeControl;
	
	function noticeDataGet(messageID)
	{
		noticeDataNode = Logic.dat_ROM["_MESSAGES"]["notice" + messageID];
		
		initNotice();
		noticeSetup();
	}
	
/*
	function noticeGameCom(endFunctionMessageSwitch, endFunctionFade)
	{
		NoticeFunctions = {};
		
		NoticeFunctions	=	{
								endMess		:	null,
								
								endFade		: 	null,
								
								set_endMess	:	function(f)
												{
													this.endMess = f;	
												},
												
								set_endFade	:	function(f)
												{
													this.endFade = f;
												},
								
								run_endMess	:	function()
												{
													this.endMess();
												},
												
								run_endFade	:	function()
												{
													this.endFade();
												}
							};
							
		// use program default
		if(endFunctionMessageSwitch[0] === true)
		{
			NoticeFunctions.set_endMess = noticeFadeOut;
		}
		
		// use custom [false, customFunction]
		else
		{
			NoticeFunctions.set_endMess = endFunctionMessageSwitch[1];
		}
		
		
		NoticeFunctions.set_endFade = endFunctionFade;
		
	}
*/
	
	function noticeSetup()
	{
		if(!noticeInUse)
		{
			noticeInUse = true;
			
			NoticeControl.noticePopulate(noticeDataNode.noticeMess_text, ".notice-msg p");
			NoticeControl.charArmsCSS(".battleCute-warrior-arm-left .battleCute-warrior-arm-sprite", ".battleCute-warrior-arm-right .battleCute-warrior-arm-sprite", "battleCute-warrior-armsUp", "battleCute-warrior-armsDown");
			NoticeControl.charArmsInit(noticeDataNode.charArms_0_LR.l, noticeDataNode.charArms_0_LR.r, window[noticeDataNode.mess_function], "NoticeControl");
			NoticeControl.charArmsSetup(noticeDataNode.charArms_1_LR.dir, noticeDataNode.charArms_1_LR.both, noticeDataNode.charArms_1_LR.arm);
			NoticeControl.noticeHeightSet([".notice-trees-top", ".notice-msg", ".notice-you", ".notice-trees-btm"], ".notice-container");
			// NoticeControl.readTimerInit(noticeDataNode.noticeMess_time);
			
			// call global fade		
		}
	}
	
	// call after fade
	
	function noticeStart()
	{
		NoticeControl.readTimerInit(noticeDataNode.noticeMess_time);
	}
	
	function noticeFadeOut() //listed in JSON === noticeDataNode.mess_function
	{
		globalFade_IN("white", window[noticeDataNode.fade_function]);
	}
	
	function noticePurge()
	{
		NoticeFunctions = null;
		
		NoticeControl = null;
		
		noticeInUse = false;
		
		// trace(NoticeControl);
	}

	
	
	function initNotice()
	{
		NoticeControl = {};
		
		NoticeControl = {
							baseName		:	"",
							
							armSelectorL	:	"",
							
							armSelectorR	:	"",
							
							armMoveU		:	"",
							
							armMoveD		:	"",
							
							charArmStateL	:	"",
							
							charArmStateR	:	"",
							
							charEndControl	:	null,	
							
							charArmsStore	:	null,
							
							charArmsCSS		:	function(cl, cr, cu, cd)
												{
													this.armSelectorL = cl;
													this.armSelectorR = cr;
													
													this.armMoveU = cu;
													this.armMoveD = cd;	
												},
							
							charArmsInit	:	function(armL, armR, doEnd, baseName)
												{
													this.charArmStateL = armL;
													this.charArmStateR = armR;
													
													this.charEndControl = {};
													
													this.charEndControl.fired = false;
													this.charEndControl.funct = doEnd;
													
													this.baseName = baseName;	
													
													// LEFT
													
													if(this.charArmStateL === "UP")
													{
														$(this.armSelectorL).addClass(this.armMoveU);
													}
													
													else
													{
														$(this.armSelectorL).addClass(this.armMoveD);
													}
													
													// RIGHT
													
													if(this.charArmStateR === "UP")
													{
														$(this.armSelectorR).addClass(this.armMoveU);
													}
													
													else
													{
														$(this.armSelectorR).addClass(this.armMoveD);
													}
												
												},
							
							charArmsSetup	:	function(dir, both, arm)
												{
													this.charArmsStore = {};
													
													this.charArmsStore.dir = dir;
													
													
													if(!both && arm)
													{
														this.charArmsStore.both = false;
														
														this.charArmsStore.arm = arm;
													}
													
													else
													{
														this.charArmsStore.both = true;
													}													
												},
							
							charArmsRun		:	function()
												{
													// BOTH
													
													if(this.charArmsStore.both)
													{
														// IF UP AND ARMS DOWN
														
														if(this.charArmsStore.dir === "UP")
														{
															if(this.charArmStateL === "DOWN")
															{
																this.charArmStateL = "UP";
																
																$(this.armSelectorL).removeClass(this.armMoveD).addClass(this.armMoveU);
															}
															
															if(this.charArmStateR === "DOWN")
															{
																this.charArmStateR = "UP";
																	
																$(this.armSelectorR).removeClass(this.armMoveD).addClass(this.armMoveU);	
															}
														}
														
														// IF DOWN AND ARMS UP

														if(this.charArmsStore.dir === "DOWN")
														{
															if(this.charArmStateL === "UP")
															{
																this.charArmStateL = "DOWN";
																
																$(this.armSelectorL).removeClass(this.armMoveU).addClass(this.armMoveD);
															}
															
															if(this.charArmStateR === "UP")
															{
																this.charArmStateR = "DOWN";
																
																$(this.armSelectorR).removeClass(this.armMoveU).addClass(this.armMoveD);		
															}
														}
													}
													
													// SINGLE
													
													else
													{
														// IF UP AND ARMS DOWN
														
														//LEFT
														if(this.charArmsStore.arm === "LEFT")
														{
															if(this.charArmsStore.dir === "UP" && this.charArmStateL === "DOWN")
															{
																this.charArmStateL = "UP";
																
																$(this.armSelectorL).removeClass(this.armMoveD).addClass(this.armMoveU);
															}
														}
														
														//RIGHT
														
														if(this.charArmsStore.arm === "RIGHT")
														{
															if(this.charArmsStore.dir === "UP" && this.charArmStateR === "DOWN")
															{
																this.charArmStateR = "UP";
																
																$(this.armSelectorR).removeClass(this.armMoveD).addClass(this.armMoveU);
															}												
														}
														
														// IF DOWN AND ARMS UP
														
														//LEFT
														if(this.charArmsStore.arm === "LEFT")
														{
															if(this.charArmsStore.dir === "DOWN" && this.charArmStateL === "UP")
															{
																this.charArmStateL = "DOWN";
																
																$(this.armSelectorL).removeClass(this.armMoveU).addClass(this.armMoveD);
															}
														}
														
														//RIGHT
														
														if(this.charArmsStore.arm === "RIGHT")
														{
															if(this.charArmsStore.dir === "DOWN" && this.charArmStateR === "UP")
															{
																this.charArmStateR = "DOWN";
																
																$(this.armSelectorR).removeClass(this.armMoveU).addClass(this.armMoveD);
															}												
														}
													
													}
													
													$(this.armSelectorL).attr("data-parentClass", this.baseName);
													
													$(this.armSelectorR).attr("data-parentClass", this.baseName);
													
													$(this.armSelectorL)[0].addEventListener("webkitTransitionEnd", this.charArmsEnd, false);
													
													$(this.armSelectorR)[0].addEventListener("webkitTransitionEnd", this.charArmsEnd, false);
												},
												
							charArmsEnd		:	function(event)
												{
													// out of scope hack to get entry to original object via the listing in window
													
													var _MAIN = window[$(this).attr("data-parentClass")];
													
													$(_MAIN.armSelectorL).removeAttr("data-parentClass");
													
													$(_MAIN.armSelectorR).removeAttr("data-parentClass");
													
													$(_MAIN.armSelectorL)[0].removeEventListener("webkitTransitionEnd", _MAIN.charArmsEnd, false);
													
													$(_MAIN.armSelectorR)[0].removeEventListener("webkitTransitionEnd", _MAIN.charArmsEnd, false);
													
													if(!_MAIN.charEndControl.fired)
													{
														_MAIN.charEndControl.fired = true;
														_MAIN.charEndControl.funct();
													}
													
												},
							
							noticeContent	:	"",
							
							noticePopulate	:	function(str, target)
												{
													this.noticeContent = str;
													
													$(target).text(this.noticeContent);
												},
												
							noticeHeight	:	0,
												
							noticeHeightSet	:	function(elms, target)
												{
													var elms_ARR = elms;	
													
													var heightFit_css;
													
													for(var i = 0; i < elms_ARR.length; i++)
													{
														this.noticeHeight += $(elms_ARR[i]).outerHeight(true);
													}
													
													trace(this.noticeHeight);
													
													
													if(this.noticeHeight > DISPLAY._height)
													{
														
														this.noticeHeight -= ($(".notice-trees-tile").outerHeight(true) * 2);
														
														heightFit_css = {
																			"height"		: "0px",
																			"visibility"	: "hidden"
																		};
													
														$(".notice-trees-tile").css(heightFit_css);
													}
													
													
													$(target).css("height", this.noticeHeight + "px");
												},
							
							readTimerCom	:	null,
								
							readTimerRun	:	false,
							
							readTimerInit	:	function(sec)
											 	{ 
													if(!this.readTimerRun)
													{
														this.readTimerRun = true;
														this.readTimerCom = setTimeout(this.readTimerEnd, sec * 1000, this); // pass (this) to keep scope
													} 
												},
												
							readTimerCancel	:	function()
												{
													if(this.readTimerRun)
													{
														clearInterval(this.readTimerCom);
														
														this.readTimerRun = false;
													}
												},
							
							readTimerEnd	:	function(parentLink) // parentLink to keep scope from setTimeout
												{
													parentLink.readTimerRun = false;
													
													parentLink.charArmsRun();
												}
						};
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
//////////////////////////////////////////////////////////////////////////	
	
	
/*
	var Notice;
	
	function NoticeSetup(data)
	{
		trace("NoticeSetup(data);");
		trace(data);
		
		var css;
		
		css = 	{
					"-webkit-transform"	: "translateY(" + -DISPLAY._height + "px)",
					"transform"			: "translateY(" + -DISPLAY._height + "px)"
				};
		
		$(".notice-player-main").css(css);
		
		Notice = new Object();
		
		Notice.playerAsleep 	= false;
		Notice.btnID 			= data.btnID;
		Notice.btnText_ARR 		= data.btnText_ARR;
		Notice.btnHandler 		= data.btnHandler;
		Notice.noticeText0 		= data.noticeText0;
		Notice.noticeText1 		= data.noticeText1;
		Notice.noticeID			= data.noticeID;
		
		$(".noticeWrapper").attr("id", Notice.noticeID);
		
		$(".notice-btn").attr("onclick", Notice.btnHandler);
	
		$(".notice-btn").each(function(index)
		{
			$(this).attr("id", Notice.btnID + $(this).attr("data-btnID"));
			$(this).text(Notice.btnText_ARR[index]);
		});
		
		for(var i = 0; i < 2; i++)
		{
			$(".noticeRaccoon-mid p:nth-child(" + (i + 1) + ")").text(Notice["noticeText" + i]);
		}
	}
	
	function NoticeShow()
	{
		var css;
		
		css = 	{
					"-webkit-transform"	: "translateY(0px)",
					"transform"			: "translateY(0px)"
				};
		
		$(".notice-player-main").css(css);		
		
		$(".notice-player-main").get(0).addEventListener("webkitTransitionEnd",  NoticeShowDetails, false);
		$(".notice-player-main").get(0).addEventListener("transitionend",  NoticeShowDetails, false);
	}
	
	function NoticeShowDetails(event)
	{
		var css_r;
		
		$(".notice-player-main").get(0).removeEventListener("webkitTransitionEnd",  NoticeShowDetails, false);
		$(".notice-player-main").get(0).removeEventListener("transitionend",  NoticeShowDetails, false);
		
		css_r = 	{
						"-webkit-transform"	: "translateY(20px)",
						"transform"			: "translateY(20px)"					
					};
								
		$(".rabbitSpriteHolder").css(css_r);
		
		$(".notice-options").css("opacity", "1");
		
		$(".noticeRaccoon").css("opacity", "1");		
	}
	
	function NoticeAction(event)
	{
		trace(event);
		
		var TARG = event.target.id;
		
		var css_p;
		var css_r;
		
		switch(TARG)
		{
			case Notice.btnID + "0":
			{
				trace("user == sleep");
				
				if(!Notice.playerAsleep)
				{
					Notice.playerAsleep = true;
					
					$(".notice-player-eyes").removeClass("notice-player-eyes-0").addClass("notice-player-eyes-1");
				
					css_r = 	{
									"-webkit-transform"	: "translateY(0px)",
									"transform"			: "translateY(0px)"					
								};
								
					$(".rabbitSpriteHolder").css(css_r);
				}
				
				break;
			}
			
			case Notice.btnID + "1":
			{
				
				$(".notice-btn").each(function(index)
				{
					$(this).removeAttr("onclick");
					$(this).css("pointer-events", "none");
					$(this).css("cursor", "auto");
				});
				
				trace("user == get up");
				
				css_p = 	{
								"-webkit-transform"	: "translateY(-10px)",
								"transform"			: "translateY(-10px)"
							};
				
				if(Notice.playerAsleep)
				{
					Notice.playerAsleep = false;
					
					$(".notice-player-eyes").removeClass("notice-player-eyes-1").addClass("notice-player-eyes-0");
					
					css_r = 	{
									"-webkit-transform"	: "translateY(20px)",
									"transform"			: "translateY(20px)"					
								};
								
					$(".rabbitSpriteHolder").css(css_r);
				}
				
				$(".notice-player").css(css_p);
				
				$(".notice-player").get(0).addEventListener("webkitTransitionEnd", NoticeTransitionEnd, false);
				$(".notice-player").get(0).addEventListener("transitionend", NoticeTransitionEnd, false);
				
				break;
			}
			
			default:
			{
				
			}
		}
	}
	
	function NoticeTransitionEnd(event)
	{
		$(".notice-player").get(0).removeEventListener("webkitTransitionEnd", NoticeTransitionEnd, false);
		$(".notice-player").get(0).removeEventListener("transitionend", NoticeTransitionEnd, false);		
	
		var NoticeEndDelay = new AnimationTimer();
		NoticeEndDelay.time(0.5, NoticeFadeOut);
	}
*/
	
/*
	function NoticeFadeOut()
	{
		trace("NoticeFadeOut();");
		
		globalFade_IN("white", NoticeFullyFinished);
	}
*/

/*
	function NoticeFullyFinished()
	{	
		$("#" + Notice.noticeID).remove();
		
		// define other routes switch?
		
		gameAreaClear();
		
		prepGameMapInit();
	}
*/
	