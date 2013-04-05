aup.pages.profile = {

	urlStr : "profile",

    urlStr2 : "user",
	title : "Profile",
	rndEnable : false,
	inited : false,
	mainObject : null,
	params : null,
	
	
	curUserId : 0,
	userObject : null,
	avatarPic : null,
	
	follow : false,
	subscribersCount : 0,
	subscriptionsCount : 0,
	pointsCount : 0,
	
	bk : null,
	
	
	mainObject : null,	
	
	//states
	timelineObject : null,	
	timelineCont : null,
	
	storiesObject : null,
	storiesCont : null,
	
	subscribersObject : null,
	subscribersCont : null,

    newfacesObject : null,
	subscriptionsObject : null,
	subscriptionsCont : null,


	
	privateObject : null,
	privateCont : null,
	
	
	bkImage : null,
	bkContainer : null,
	
	timelineButton : null,
	storiesButton : null,
	privateButton : null,
	
	
	states : [],
	curState : -1,
	defaultState : 0,

    active : false,

    bkMove : {
        moving : false,

        moveButton : null,
        moveOkButton : null,
        moveCancelButton : null,

        loadInd : null,
        moveInd : null,

        drUgEnable : false,
        timer : new Timer(1000/30, 0),

        bkPos : 0,
        bkStart : 0,

        buttonsCont : null,

        start : {
            x : 0,
            y : 0
        },

        cur : {
            x : 0,
            y : 0
        }
    },


    restoreParams : null,
    window1 : null,



	
		
	init: function ()
	{
		this.mainObject = id$('profile');
		
		//fedd object init
		this.timelineCont = $(this.mainObject).find(".timeline_box");		
		this.timelineObject = aup_timeline_proto();		
		//this.timelineObject.prefix = this.urlStr2+"/"+aup.auth.status.id;
		this.timelineObject.lastposRelated = false;
		this.timelineObject.showEvents = false;
		this.timelineObject.displayLastVisit = false;
		this.timelineObject.controlCanvas = false;
        this.timelineObject.showLoadingOnstart = true;
        this.timelineObject.parent = this;
        this.timelineObject.showEmpty = true;
		this.timelineObject.init( this.timelineCont );

        this.bkMove.buttonsCont = $(this.mainObject).find(".profile_bk_buttons");
        this.bkMove.deactiveButton = $(this.mainObject).find(".profile_bk_move_control");
        this.bkMove.activeButton = $(this.mainObject).find(".profile_bk_move_control_active");
        this.bkMove.moveButton = $(this.mainObject).find(".profile_bk_move");
        this.bkMove.moveButton.click(bind(this.startMove, this));
        this.bkMove.moveOkButton = $(this.mainObject).find(".profile_bk_ok");
        this.bkMove.moveOkButton.click(bind(this.applyMove, this));
        this.bkMove.moveCancelButton = $(this.mainObject).find(".profile_bk_cancel");
        this.bkMove.moveCancelButton.click(bind(this.cancelMove, this));

        this.moveButtons(0);


        this.bkMove.loadInd = $(this.mainObject).find(".profile_bk_loading");
        this.bkMove.moveInd = $(this.mainObject).find(".profile_bk_move2");

        this.bkMove.deactiveButton.css({ display : 'none' });
        this.bkMove.activeButton.css({ display : 'none' });

        this.bkMove.loadInd.css({ display : 'none' });
        this.bkMove.moveInd.css({ display : 'none' });
		
		
		this.storiesCont = $(this.mainObject).find(".rolloutstory_box");		
		this.storiesObject = aup_rolloutstory_proto();
        this.storiesObject.showEmpty = true;
		this.storiesObject.init( this.storiesCont );
		
		
		this.privateCont = $(this.mainObject).find(".private_box");
		this.privateObject = new aup_feed_proto();	
		this.privateObject.changeUrl = true;
        this.privateObject.useGalleryPhoto = true;
		this.privateObject.init(this.privateCont);	
		
		
		
		var fButton = $(this.mainObject).find(".profile_black_plate2");
		$(fButton[1]).click(bind(function() { this.detectState("subscribers"); },this));
		$(fButton[0]).click(bind(function() { this.detectState("subscriptions"); },this));
		
		var pButton = $(this.mainObject).find(".profile_black_plate").css({display : 'none'});
		$(pButton).click(bind( function (e) {this.hideSubWindows(); this.pointsHelper.shClick(); cancelEvent(e);}, this));
		
		
		
		this.subscribersCont = $(this.mainObject).find(".subscribers_box");		
		this.subscribersObject = aup_subscribers_proto();
		this.subscribersObject.onSubscribe = bind(this.onSubscribeCallback, this);
		this.subscribersObject.onDeSubscribe = bind(this.onSubscribeCallback, this);
		this.subscribersObject.init( this.subscribersCont );
        this.subscribersObject.onDataLoaded = bind(this.onSubscribeData, this);

        this.subscriptionsCont = $(this.mainObject).find(".subscriptions_box");

        this.newfacesObject = aup_newfaces_proto();
        this.newfacesObject.onSubscribe = bind(this.onNewfacesCallback, this);
        this.newfacesObject.onDeSubscribe = bind(this.onNewfacesCallback, this);
        this.newfacesObject.onDataLoad = bind(this.onNewFacesData, this);
        this.newfacesObject.init( this.subscriptionsCont );

		

		this.subscriptionsObject = aup_subscribers_proto();
		this.subscriptionsObject.onSubscribe = bind(this.onSubscriptionCallback, this);
		this.subscriptionsObject.onDeSubscribe = bind(this.onSubscriptionCallback, this);
		this.subscriptionsObject.init( this.subscriptionsCont );
        this.subscriptionsObject.onDataLoaded = bind(this.onSubscriptionsData, this);






        this.window1 = $("#set_name");
        this.window1.buttonShow = $(this.mainObject).find(".edit_name_ico");
        this.window1.buttonShow.click(bind(this.clickChangeName, this));
        this.window1.activeSet = false;
        this.window1.css({ position : 'fixed' });
        this.window1.click(bind(function(event) {
            event.stopPropagation();
        }, this));
        this.window1.errorMessageTimeout = -1;
        this.window1.error_meassage = this.window1.find(".form_error_message");
        this.window1.showErrMsg = bind(function(_txt)
            {
                this.error_meassage.text(_txt);
                this.hideMsg();
            }
            ,this.window1);
        this.window1.hideMsg = bind(function()
            {
                if (this.errorMessageTimeout!=-1)
                    clearTimeout(this.errorMessageTimeout);
                this.errorMessageTimeout = setTimeout(bind(function() {  this.error_meassage.text(""); this.error_meassage.errorMessageTimeout = -1; }, this),2000);
            }
            ,this.window1);
        this.window1.proceedBtn = this.window1.find(".form_confirm_button");
        this.window1.proceedBtn.click(bind(this.setName, this));

        var inputs = this.window1.find(".form_input_field_sign");
        this.window1.input_fn = $(inputs[0]);
        this.window1.input_ln = $(inputs[1]);




		///////////////////
		
		
		this.bkImage = $(this.mainObject).find(".profile_background_img");
        this.setUpBk(this.bkImage);
        $(document).mouseup(bind(this.bkMouseUp, this));
        $(document).mousemove(bind(this.bkMouseMove, this));

		this.bkContainer = $(this.mainObject).find(".profile_background_cont");
		
		var a = null;
		
		//setup buttons
		this.timelineButton = $(this.mainObject).find(".profile_sub_timeline_0");
		this.timelineButton.click(bind(function() { this.detectState(""); },this));
		
		this.storiesButton = $(this.mainObject).find(".profile_sub_stories_0");
		this.storiesButton.click(bind(function() { this.detectState("stories"); },this));
		
		this.privateButton = $(this.mainObject).find(".profile_sub_private_0");
		this.privateButton.click(bind(function() { this.detectState("private"); },this));
		
		
		//set up states
		//timeline
		a = { 	N : 0,
				urlPrefix : "",
				show : bind(function()
				{
                    //aup.stats.trackPageChange("/user/"+this.curUserId+"/");
					this.timelineCont.css({ display : 'block' });
					this.timelineObject.show(0);
				}, this),
				hide : bind(function()
				{
					this.timelineObject.hide();
					this.timelineCont.css({ display : 'none' });
				}, this),
                restore : bind(function()
                {
                    if (aup.controller.removedList.length>0)
                    {
                        this.timelineObject.rebuildTimeline(aup.controller.removedList, this.restoreParams);
                    }else{
                        this.timelineObject.restore();
                    }

                    this.timelineCont.css({ display : 'block' });
                }, this),
				cont : this.timelineCont,
				
				button : this.timelineButton,
				classPrefix : "profile_sub_timeline_"
			}
		this.states.push(a);
		
		//stories
		a = { 	N : 1,
				urlPrefix : "stories",
				show : bind(function()
				{
                    //aup.stats.trackPageChange("/user/"+this.curUserId+"/stories/");
					this.storiesCont.css({ display : 'block' });
					this.storiesObject.show();
				}, this),
				hide : bind(function()
				{
					this.storiesObject.hide();
					this.storiesCont.css({ display : 'none' });
				}, this),
                restore : bind(function()
                {
                    if (aup.controller.removedList.length>0)
                    {
                        this.storiesObject.show();
                    }else{
                        this.storiesObject.restore();
                    }

                    this.storiesCont.css({ display : 'block' });
                }, this),
				cont : this.storiesCont,
				
				button : this.storiesButton,
				classPrefix : "profile_sub_stories_"
			}
		this.states.push(a);
		
		//subscribers
		a = { 	N : 2,
				urlPrefix : "subscribers",
				show : bind(function()
				{
                    //aup.stats.trackPageChange("/user/"+this.curUserId+"/subscribers/");
					this.subscribersCont.css({ display : 'block' });
					this.subscribersObject.show();
				}, this),
				hide : bind(function()
				{
					this.subscribersObject.hide();
					this.subscribersCont.css({ display : 'none' });
				}, this),
                restore : bind(function()
                {
                    this.subscribersObject.restore();
                    this.subscribersCont.css({ display : 'block' });
                }, this),
				cont : this.subscribersCont,
				
				button : null,
				classPrefix : null
			}
		this.states.push(a);
		
		//subscriptions
		a = { 	N : 3,
				urlPrefix : "subscriptions",
				show : bind(function()
				{
                    //aup.stats.trackPageChange("/user/"+this.curUserId+"/subscriptions/");
					this.subscriptionsCont.css({ display : 'block' });

					this.subscriptionsObject.show();
                    this.newfacesObject.show();
				}, this),
				hide : bind(function()
				{
					this.subscriptionsObject.hide();
                    this.newfacesObject.hide();

					this.subscriptionsCont.css({ display : 'none' });
				}, this),
                restore : bind(function()
                {
                    this.subscriptionsCont.css({ display : 'block' });

                    this.subscriptionsObject.restore();
                    this.newfacesObject.restore();

                }, this),
				cont : this.subscriptionsCont,
				
				button : null,
				classPrefix : null
			}
		this.states.push(a);
		
		//private
		//subscriptions
		a = { 	N : 4,
				urlPrefix : "private",
				show : bind(function()
				{
                    //aup.stats.trackPageChange("/user/"+this.curUserId+"/private/");
					this.privateCont.css({ display : 'block' });
					this.privateObject.show(0);
				}, this),
				hide : bind(function()
				{
					this.privateObject.hide();
					this.privateCont.css({ display : 'none' });
				}, this),

                restore : bind(function()
                {
                    this.privateCont.css({ display : 'block' });
                    if (aup.controller.removedList.length>0)
                    {
                        log("AFTER REMOVE!!");
                        this.privateObject.show(0);
                    }else{
                        this.privateObject.restore();
                    }
                }, this),

				cont : this.privateCont,
				
				button : this.privateButton,
				classPrefix : "profile_sub_private_"
			}
		this.states.push(a);
		
		
		
		this.curState = 0;
		this.defaultState = 0;
		
		this.pointsHelper.init( this.mainObject );

        this.resetRestore();


        this.newFaces.parent = this;
        this.newFaces.init();

        this.popupWindow.parent = this;
        this.popupWindow.init();

		
		this.inited = true;
	},

    clickChangeName : function(e)
    {
        this.window1.css({display:"block"});
        aup.main_fader.show();

        //positions
        var scrollTop = getScrollTop();


        if (browser.ie)
        {
            this.window1.css({ position : 'absolute' });
            this.window1.css({ top : (scrollTop + (aup.screenH - this.window1.height())*0.5 )+'px', left : (aup.screenWl-285)*0.5 +'px' });
        }else
            this.window1.css({ top : (aup.screenH - this.window1.height())*0.5 +'px', left : (aup.screenWl-285)*0.5 +'px' });

        this.window1.input_fn.val(aup.auth.userObject.first_name);
        this.window1.input_ln.val(aup.auth.userObject.last_name);
        //this.window1.setState1();
        //this.window1.page1.input_pass.focus();

        return cancelEvent(e);
    },

    setName :function(e)
    {
        var fn = this.window1.input_fn.val();
        var ln = this.window1.input_ln.val();

        if (fn.length==0)
        {
            this.window1.showErrMsg("Enter your first and last name");
            this.window1.input_fn.focus();
            return false;
        }

        if (ln.length==0)
        {
            this.window1.showErrMsg("Enter your first and last name");
            this.window1.input_ln.focus();
            return false;
        }


        $.ajax({
            url:aup.netcalls.setNameCall,
            data : { r : Math.random(), first_name : fn, last_name : ln },
            timeout:aup.netTimeOut,
            success:bind(this.onsetNameOk, this),
            error:bind(this.onsetNameFail, this)
        });

    },

    onsetNameOk : function(response)
    {
        this.window1.activeSet = false;
        var resp = getObjectJson(response);
        if (resp.error)
        {
            this.window1.showErrMsg("Something went wrong!");
            this.mail_input.focus();
            return false;
        }

        this.hideWindow1();
        aup.controller.reloadPage();
    },

    onsetNameFail : function(e)
    {
        this.window1.activeSet = false;
        this.window1.showErrMsg("Something went wrong!");
    },



    hideWindow1 : function()
    {
        if (this.window1.css("display") == 'none')
            return false;

        log("hideWindow2");
        this.window1.css({display:"none"});
        aup.main_fader.hide();
    },


    onSubscriptionsData : function(resp)
    {
        var respC = resp.followers;
        if (!respC)
            respC = resp.followings;

        this.subscriptionsCount = respC.total;
        this.setFollowersLabels();
    },

    onSubscribeData : function(resp)
    {
        var respC = resp.followers;
        if (!respC)
            respC = resp.followings;

        this.subscribersCount = respC.total;
        this.setFollowersLabels();
    },
	
	hideSubWindows : function ()
	{
		aup.pages.profile.pointsHelper.hide();
	},

    bkMouseDown : function (e)
    {
        if (!this.bkMove.moving)
            return false;

        this.bkMove.drUgEnable = true;

        $('#status2').html(e.pageX +', '+ e.pageY);

        this.bkMove.start.x = e.pageX;
        this.bkMove.start.y = e.pageY;
        this.bkMove.bkStart = this.bkMove.bkPos;

        return cancelEvent(e);
    },


    bkMouseUp : function (e)
    {
        if (!this.bkMove.moving)
            return false;

        if (!this.active)
            return false;


        this.bkMove.drUgEnable = false;
    },
    bkMouseMove : function (e)
    {
        if (!this.bkMove.moving)
            return false;

        if (!this.active)
            return false;

        if (!this.bkMove.drUgEnable)
            return false;

        this.bkMove.cur.x = e.pageX;
        this.bkMove.cur.y = e.pageY;

        var mVec = { x : this.bkMove.cur.x-this.bkMove.start.x, y : this.bkMove.cur.y-this.bkMove.start.y};

        this.bkSetPos(this.bkMove.bkStart + 2*mVec.y);
    },



    cancelMove : function()
    {
        this.bkMove.moving = false;
        this.bkMove.drUgEnable = false;

        this.setBk();
    },

    setUpBk : function(_el)
    {
      _el.mousedown(bind(this.bkMouseDown, this));
    },

    applyMove : function()
    {
        var a = document.createElement("img");
        setClass(a, "profile_background_img");
        var parent = this.bkImage.parent();
        this.bkImage.remove();
        this.bkImage = $(a);
        this.setUpBk(this.bkImage);
        $(parent).append(a);

        this.bkMove.deactiveButton.css({ display : 'none' });
        this.bkMove.activeButton.css({ display : 'none' });
        this.bkMove.loadInd.css({ display : 'none' });
        this.bkMove.moveInd.css({ display : 'none' });
        this.bkMove.moving = false;
        this.bkMove.drUgEnable = false;
        this.bkImage.css({visibility : 'hidden'});

        this.bkContainer.css({ 'background-image' : 'url(/gui/loading_ani.gif?aup16)'});
        setClass(this.bkImage, "profile_background_img");


        $.ajax({
            url: aup.netcalls.shiftBkCall ,
            data : { y : -this.bkMove.bkPos },
            timeout : aup.netTimeOut,
            success: bind(this.applyCallback, this),
            error: bind(this.applyCallback, this)
        });
    },

    applyCallback : function(response)
    {
        var resp = getObjectJson(response);

        this.userObject.background['i1000x314'] = resp.background;
        this.setBk();
    },
    //1
    startMove : function()
    {
        if (!this.bk)
            return false;

        //this.bkMove.moving = true;
        this.bkMove.deactiveButton.css({ display : 'none' });
        this.bkMove.activeButton.css({ display : 'none' });

        this.bkMove.loadInd.css({ display : 'block' });
        this.bkMove.moveInd.css({ display : 'none' });


        setOnLoadIMG(this.bk['i1000x1000'], bind(this.imgLoaded, this));


    },

    bkSetPos : function(_y)
    {
        var _nY = Math.max( -(1000-314), Math.min(0,_y));
        this.bkMove.bkPos = _nY;
        this.bkImage.css({ top : _nY+'px'});
    },

    //2
    imgLoaded : function()
    {
        this.bkMove.moving = true;
        setClass(this.bkImage, "profile_background_img_move");
        this.bkImage.attr('src', this.bk['i1000x1000']).css({ visibility: 'visible', height : 1000+'px', width: 1000+'px'});
        this.bkSetPos(0);

        this.bkMove.deactiveButton.css({ display : 'none' });
        this.bkMove.activeButton.css({ display : 'block' });

        //this.profile_moveButton.css({ display : 'none' });
        this.bkMove.loadInd.css({ display : 'none' });
        this.bkMove.moveInd.css({ display : 'block' });
    },

	
	show: function (_q)
	{
		//_q - query string
		var q = _q;
		if (!q)
			q = "/";		
		var params = q.split("/");
		this.params = params;

        if (String(document.location).indexOf("/profile")>-1)
        {
            if (!aup.auth.status)
            {
                aup.controller.navigateTo("popular/");
                return false;
            }else{
                aup.controller.navigateTo("user/"+aup.auth.status.id);
            }
        }




        this.resetRestore();


		this.curUserId = aup.auth.status.id;	
		this.timelineObject.controlUrl = aup.netcalls.timelineCallUrl+"?user="+this.curUserId;
		this.storiesObject.controlUrl = aup.netcalls.storiesUserCall+"?user="+this.curUserId;
		
		this.subscribersObject.controlUrl = aup.netcalls.followersCall+"?user="+this.curUserId;
		this.subscriptionsObject.controlUrl = aup.netcalls.followingsCall+"?user="+this.curUserId;

        this.newfacesObject.controlUrl = aup.netcalls.newFacesCall;
		
		this.privateObject.controlUrl = aup.netcalls.userPhotosCall+"?user="+this.curUserId+"&area=private";

        this.privateObject.urlPrefix = this.urlStr2+"/"+aup.auth.status.id;
        this.timelineObject.prefix = this.urlStr2+"/"+aup.auth.status.id;



        this.bkMove.drUgEnable = false;
        this.bkMove.bk_moving = false;

        this.bkMove.deactiveButton.css({ display : 'none' });
        this.bkMove.activeButton.css({ display : 'none' });

        this.bkMove.loadInd.css({ display : 'none' });
        this.bkMove.moveInd.css({ display : 'none' });
		

		this.getProfile();
	},


    onContentHeightChange : function(e)
    {

    },

    resetRestore : function()
    {
        this.restoreParams = {
            scrollpos : 0,
            setScroll : false
        };
    },

    //std for each module control functions
    restore: function (e)
    {
        //_q - query string
        var q = e;
        if (!q)
            q = "/";
        var params = q.split("/");
        this.params = params;



        if (this.bkMove.bk_moving)
        {
            this.setBk();
        }

        if (this.restoreParams.timelineRestoreResponse)
        {
            this.timelineObject.onData(this.restoreParams.timelineRestoreResponse,  this.timelineObject.startPage);
            this.restoreParams.timelineRestoreResponse = null;
        }

        this.restoreParams.setScroll = true;

        aup.controller.showCanvas();

        var chStr = "";
        if (params.length>1)
            chStr = params[1];

        if (this.states[this.curState].urlPrefix != chStr)
        {
            this.detectState(chStr, true);
        }else{
            //restore prototypes
            this.states[this.curState].restore();
        }
    },


	hide: function (_q)
	{
        this.restoreParams.scrollpos = $(document).scrollTop();
        log("PROFILE HIDE = ["+this.restoreParams.scrollpos+"]");
        this.active = false;
		this.timelineObject.hide();

        this.subscribersObject.hide();
        this.subscriptionsObject.hide();
        this.newfacesObject.hide();
        this.storiesObject.hide();

        this.popupWindow.hide();
	},
	
	
	getProfile: function ()
	{		
		$.ajax({
			  url: aup.netcalls.getProfileCall,
              data : { user : this.curUserId, r : Math.random() },
			  timeout : aup.netTimeOut,
			  success: bind(this.onData, this),
			  error: bind(this.onError, this)
		});
	},
	
	
	onData : function (response, status, xhr)
	{
        if (!this.active)
            return false;

		window.scroll(0,0);
		var resp = getObjectJson(response);		
		if (resp.error)
		{
			log("aup/pages/user : get picture error = ["+resp.error.code+"]");
			if (!aup.errors.hasNetError(resp))
			{
				aup.controller.showErrorPage();
			}
			return false;
		}	
		
		this.userObject = resp.user;
		this.timelineObject.userObject = this.userObject;
		
		
		this.newFaces.show();

		this.setProfile(resp);
		this.setTitle(resp);

        this.active = true;
		aup.controller.showCanvas();
		
		var qStr = "";
		if (this.params.length>1)
			qStr = this.params[1];


        log("!!!!!!!!!!!!!!!!!!!!!!!!! = ["+qStr+"]");
		this.detectState(qStr);
		//this.timelineObject.show(0);
		//this.storiesObject.show(0);
	},
	
	
	onError : function (e)
	{
		log("aup/pages/user: Error while loading actual data! : ["+e+"]");
	},	
	
	
	setProfile : function (resp)
	{
		if (resp.user.photo)
			ava = resp.user.photo['i106x106'];
		this.setAvatar(ava);	
				
		var a = $(this.mainObject).find( ".profile_name_label" );	
		a.text(resp.user.name);
        //a.text("MMMMMMMMMMMMMMMMMMMMMMMM MMMMMMMMMMMMMMMMMMMMMMMM");
		
		this.follow = resp.user.follow;

		
	
		this.subscribersCount = resp.user.followers_count;
		this.subscriptionsCount = resp.user.followings_count;
		this.pointsCount = resp.user.points ;
		
		this.subscribersObject.setName("Subscribers");
		this.subscriptionsObject.setName("Subscriptions");
        this.newfacesObject.setName("New faces");

		
		this.bk = resp.user.background;
        this.setBk();
	
		this.setFollowersLabels();
		//points
		
		
		a = $(this.mainObject).find( ".profile_avatar_image" );
		var ava = null;
	},
	
	setBk : function ()
	{
		var _link = "http://"+aup.domain+"/gui/profile_default_bk.jpg";
		if (this.bk)
		{
            _link = this.bk['i1000x314'];
            this.bkMove.deactiveButton.css({ display : 'block' });
            this.bkMove.activeButton.css({ display : 'none' });
		}else{
            this.bkMove.deactiveButton.css({ display : 'none' });
            this.bkMove.activeButton.css({ display : 'none' });
        }

        this.bkMove.loadInd.css({ display : 'none' });
        this.bkMove.moveInd.css({ display : 'none' });

        this.bkMove.moving = false;
        this.bkMove.drUgEnable = false;

        this.bkContainer.css({ 'background-image' : 'url(/gui/loading_ani.gif?aup16)'});
        setClass(this.bkImage, "profile_background_img");
        this.bkImage.css({  height : 314+'px', width: 1000+'px', top:0+'px'});
        setImageOnload(this.bkImage, _link, this.bkContainer );
	},
	
	
	setFollowersLabels : function ()
	{
		var lcds = $(this.mainObject).find(".profile_n_label");
		this.followersLCD = $(lcds[1]);
		this.followingsLCD = $(lcds[0]);
		this.pointsLCD = $(lcds[2]);
		
		//followers
		this.followersLCD.text(this.subscribersCount + " subscribers");
		if (this.subscribersCount==1)
			this.followersLCD.text(this.subscribersCount + " subscriber");
			
		//following
		this.followingsLCD.text(this.subscriptionsCount + " subscriptions");
		if (this.subscriptionsCount==1)
			this.followingsLCD.text(this.subscriptionsCount + " subscription");
			
		this.pointsLCD.text(this.pointsCount + " points");
		if (this.pointsCount==1)
			this.pointsLCD.text(this.pointsCount + " point");
	},
	
	
	setAvatar : function (_str)
	{
		if (!_str)
		{
			if (this.avatarPic)
			{
				$(this.avatarPic).remove();
				this.avatarPic = null;
			}
		}else{
			if (this.avatarPic)
			{
				$(this.avatarPic).remove();
				this.avatarPic = null;
			}
			
			var a  = $(this.mainObject).find( ".profile_avatar_image_cont" );	
			
			this.avatarPic = document.createElement("img");
			setClass(this.avatarPic, "profile_avatar_img");	
			this.avatarPic.src = _str;
			a.append(this.avatarPic);
		}
	},
	
	
	
	onSubscribeCallback : function (_a)
	{
        this.subscriptionsCount = this.subscriptionsCount+_a;
		this.setFollowersLabels();
	},
	
	onSubscriptionCallback : function (_a)
	{
		this.subscriptionsCount = this.subscriptionsCount+_a;
		this.setFollowersLabels();
	},


    onNewfacesCallback : function (obj)
    {
        if (obj.target.parent.curTotal == 0)
        {
            if (this.newFaces.active)
                this.popupWindow.hide();
        }


        if (!obj.follow)
        {
            this.subscriptionsObject.removeElement(obj.target.uid);
        }
        //aup.resetH();
        //this.subscriptionsObject.addElement(_a);
    },


    onNewFacesData : function(resp)
    {
        if (this.newFaces.userL != resp.newfaces.total)
        {
            this.newFaces.showCallBack(resp);
            this.subscriptionsObject.refresh();
        }
        //aup.resetH();
    },
	
	
	
	setTitle : function (resp)
	{
		this.title = resp.user.name;	 
		aup.controller.setTitle(); 
	},
	
	detectState : function (q, _NotChangeLink)
	{
		var startState = this.curState;
		var newState = this.defaultState;
		for (var i=0; i<this.states.length; i++)
		{
			if (this.states[i].urlPrefix == q)
			{
				newState = i;
				break;
			}
		}

		//switch to
		this.curState = newState;
		for (var i=0; i<this.states.length; i++)
		{
			if (i == newState)
			{
				this.states[i].show();
				if (this.states[i].button)
					setClass(this.states[i].button,  this.states[i].classPrefix+"1");				
			}else{
				this.states[i].hide();
				if (this.states[i].button)
					setClass(this.states[i].button,  this.states[i].classPrefix+"0");
			}
		}

		if (startState != newState)
		{
			var stateStr = "";
			if (this.curState>-1)
			{
				if (this.states[this.curState].urlPrefix != "")
					stateStr  = this.states[this.curState].urlPrefix+"/";
			}
			var urla = this.urlStr2+"/"+aup.auth.status.id+"/"+stateStr;
            if (!_NotChangeLink)
            {
			    setLink( "http://" + aup.domain + "/" + urla);
            }
		}
        aup.shares.hideAct2();
		//aup.resetH();
	},

    moveButtons : function(_dY)
    {
        this.bkMove.buttonsCont.css({ top : _dY + 8 + 'px'});
    },
	
	
	
	pointsHelper : {
	
		inited : false,
		
		windCont : null,
		linkElem : null,
		
				
		//init function
		init: function (_el)
		{		
			this.linkElem = _el
			this.windCont = $(_el).find( ".points_window" ).get()[0];	
			this.inited = true;
		},
		
		show: function ()
		{
			this.windCont.style.display = "block";
			this.setPos();		
			//aup.resetH();
		},


        shClick: function (_q)
        {
            if (this.windCont.style.display == 'none')
                this.show()
            else
                this.hide();
        },

		
		setPos: function ()
		{
			this.windCont.style.left = -(this.windCont.offsetWidth)*0.5 + 20 +'px';
			this.windCont.style.top = 38+'px';
		},

        clickButton: function (e)
        {
            if (this.windCont.style.display == "none")
            {
                //show
                this.show();
            }else{
                //hide
                this.hide();
            }
            return cancelEvent(e);
        },

		hide: function ()
		{
			this.windCont.style.display = "none";
		}



	},


    newFaces : {
        parent : null,
        mainObject : null,
        oneUser : false,
        userId : 0,
        userL : 0,

        active : false,

        init : function(){
            this.mainObject = $("#newfaces_slider_cont").clone();
            this.mainObject.removeAttr("id");

            this.mainObject.ava = this.mainObject.find(".timeline_header_avatar_img");
            this.mainObject.ava_cont = this.mainObject.find(".timeline_a_ava_holder");
            this.mainObject.text_label = this.mainObject.find(".newfaces_text");

            var buttons = this.mainObject.find(".profile_button_newfaces");

            this.mainObject.button_viewAll = $(buttons[1]);
            this.mainObject.button_viewAll.label = this.mainObject.button_viewAll.find(".profile_button_newfaces_label");
            this.mainObject.button_close = $(buttons[0]);
            this.mainObject.button_close.label = this.mainObject.button_close.find(".profile_button_newfaces_label");

            this.mainObject.button_close.click(bind(this.button2_click, this));
            this.mainObject.button_viewAll.click(bind(this.button1_click, this));
        },

        followResponse: function(response)
        {
            this.parent.popupWindow.hide();
        },


        button1_click : function(e)
        {
            if (this.oneUser)
            {
                var call = aup.netcalls.followCall;
                aup.opengraph.makeFolowAction(this.userId);
                $.ajax({
                    url: call,
                    data : { user : this.userId, r : Math.random() },
                    timeout : aup.netTimeOut,
                    success: bind(this.followResponse, this),
                    error: bind(this.followError, this)
                });
            }else{
                this.parent.detectState("subscriptions");
                this.parent.popupWindow.hide();
            }
        },

        button2_click : function (e)
        {
            if (this.oneUser)
            {
                var call = aup.netcalls.unfollowCall;
                $.ajax({
                    url: call,
                    data : { user : this.userId, r : Math.random() },
                    timeout : aup.netTimeOut,
                    success: bind(this.followResponse, this),
                    error: bind(this.followError, this)
                });
            }else{
                this.hide();
            }
        },

        followError: function(e)
        {
            log("Follow error");
        },


        show : function () {

            this.getInfo();
            this.active = true;
        },

        hide : function () {
            this.parent.popupWindow.hide();
            this.active = false;
        },



        getInfo : function()
        {
            this.userL = 0;
            $.ajax({
                url: aup.netcalls.newFacesCall ,
                data : { r : Math.random() },
                timeout : aup.netTimeOut,
                success: bind(this.showCallBack, this),
                error: bind(this.showCallBackErr, this)
            });
        },

        showCallBack : function (response)
        {
            var resp = getObjectJson(response);
            if (resp.error)
            {
                log("aup/pages/user : get picture error = ["+resp.error.code+"]");
                if (!aup.errors.hasNetError(resp))
                {
                    aup.controller.showErrorPage();
                }
                return false;
            }
            this.userL = resp.newfaces.total;

            if (resp.newfaces.total>0)
            {
               // this.mainObject.ava =
                //this.mainObject.ava_cont = this.mainObject.find(".timeline_a_ava_holder");

                if (resp.newfaces.list[0].photo)
                {
                    this.mainObject.ava.attr("src", resp.newfaces.list[0].photo['i106x106']);
                }else{
                    this.mainObject.ava.attr("src", "/gui/profile_no_ava49.jpg");
                }


                var str = "<a class='newfaces_text' style='top:0px;' href='"+aup.links.getUserProfileLink(resp.newfaces.list[0].id)+"'><b>"+resp.newfaces.list[0].name+"</b></a>";
                this.oneUser = true;
                if (resp.newfaces.list.length>1)
                {
                    this.oneUser = false;
                    if (resp.newfaces.list.length== 2)
                    {
                        str = str +" and 1 other person";
                    }else{
                        str = str +" and "+(resp.newfaces.list.length-1)+" other people";
                    }
                }
                str = str + " joined WeHeartPics";

                if (this.oneUser)
                {
                    this.userId = resp.newfaces.list[0].id;
                    this.mainObject.button_close.label.text("Remove");
                    this.mainObject.button_viewAll.label.text("Ok");
                }else{
                    this.mainObject.button_close.label.text("Close");
                    this.mainObject.button_viewAll.label.text("View all");
                }

                this.mainObject.text_label.html(str);

                addIntelloLinks( this.mainObject.text_label );
                this.parent.popupWindow.setContentAfterHide(this.mainObject);
            }
        },

        showCallBackErr : function (response)
        {
            log("new faces fail");
        }
    },


    popupWindow : {
        parent : null,
        mainObject : null,
        timer : new Timer(1000/35, 9),
        cP : 0,
        p0 : 0,
        p1 : 1.0,
        contentH : 55,

        content : null,
        content2 : null,


        init : function()
        {
            this.timer.onTimerEvent = bind(this.timerMove, this);
            this.mainObject = $(this.parent.mainObject).find(".photobig_slider");
        },

        timerMove : function(e)
        {
            var A = e.currentCount/e.repeatCount;
            if (this.p0<this.p1)
            {
                var B = Math.pow( Math.sin(Math.PI*0.5*A), 0.18);
            }else{
                var B = Math.sin(Math.PI*0.5*A);
            }

            this.cP = (1-B)*this.p0 + B*this.p1;
            this.mainObject.css({ height : this.contentH*this.cP + 'px'});

            this.parent.moveButtons(this.contentH*this.cP);

            if (A == 1)
            {
                if (this.cP == 0)
                {
                    if (this.content2)
                    {
                        this.setContent(this.content2);
                    }
                }
            }
        },

        setContentAfterHide : function(_el)
        {
            if (this.cP!=0.0)
            {
                //
                this.content2 = _el;
                this.hide();
            }else{
                if (this.content)
                    this.content.detach();

                this.content = _el;
                this.mainObject.append(this.content);
                this.show();
            }
        },

        setContent : function(_el)
        {
            if (this.content)
                this.content.detach();

            this.content = _el;
            this.mainObject.append(this.content);

            if (this.content2)
            {
                this.show();
                this.content2 = null;
            }
        },

        show : function()
        {
            this.p0 = this.cP;
            this.p1 = 1.0;

            this.timer.reset();
            this.timer.start();
        },

        hide : function()
        {
            this.p0 = this.cP;
            this.p1 = 0.0;

            this.timer.reset();
            this.timer.start();
        }
    }
}



