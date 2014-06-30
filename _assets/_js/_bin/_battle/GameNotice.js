
	var noticeControl;

	
	function noticeRequest()
	{
		noticeInit();
		noticeSetup();		
	}
	
	function noticePurge()
	{
		noticeControl = null;
	}
	
	function noticeInit()
	{
		noticeControl = {};
		
		noticeControl = {
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
	
	function noticeSetup()
	{
		// ALT_THIS
		noticeControl.noticePopulate(data["noticeMessages"]["noticeMess_intro"], ".notice-msg p");
		noticeControl.charArmsCSS(".battleCute-warrior-arm-left .battleCute-warrior-arm-sprite", ".battleCute-warrior-arm-right .battleCute-warrior-arm-sprite", "battleCute-warrior-armsUp", "battleCute-warrior-armsDown");
		// ALT_THIS
		noticeControl.charArmsInit("UP", "UP", extFunct, "noticeControl");
		noticeControl.charArmsSetup("DOWN", true);
		noticeControl.noticeHeightSet([".notice-trees-top", ".notice-msg", ".notice-you", ".notice-trees-btm"], ".notice-container");
		noticeControl.readTimerInit(3);		
	}
	
	// ALT_THIS
	
	function extFunct()
	{
		alert("VAMPYRE");
		
		noticePurge();
	}
	
	