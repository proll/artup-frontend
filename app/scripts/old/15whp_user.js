aup.pages.user = {
	urlStr : "user",
	title : "User",
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
	
	subscriptionsObject : null,
	subscriptionsCont : null,
	
	
	
	followButton : null,
	
	bkImage : null,
	bkContainer : null,
	
	timelineButton : null,
	storiesButton : null,
	privateButton : null,
	
	
	states : [],
	curState : -1,
	defaultState : 0,

    restoreParams : null,


	init: function ()
	{
		this.mainObject = id$('user');
		
		//fedd object init
		this.timelineCont = $(this.mainObject).find(".timeline_box");		
		this.timelineObject = aup_timeline_proto();		
		this.timelineObject.prefix = this.urlStr;
		this.timelineObject.lastposRelated = false;
		this.timelineObject.showEvents = false;
		this.timelineObject.displayLastVisit = false;
		this.timelineObject.controlCanvas = false;
        this.timelineObject.showLoadingOnstart = true;
        this.timelineObject.parent = this;
		this.timelineObject.init( this.timelineCont );
		
		
		this.storiesCont = $(this.mainObject).find(".rolloutstory_box");		
		this.storiesObject = aup_rolloutstory_proto();
		this.storiesObject.init( this.storiesCont );
		
		var fButton = $(this.mainObject).find(".profile_black_plate2");
		$(fButton[1]).click(bind(function() { this.detectState("subscribers"); },this));
		$(fButton[0]).click(bind(function() { this.detectState("subscriptions"); },this));
		
		var pButton = $(this.mainObject).find(".profile_black_plate").css({display : 'none'});
		$(pButton).click(bind( function (e) {this.hideSubWindows(); this.pointsHelper.show(); cancelEvent(e);}, this));
		
		
		
		this.subscribersCont = $(this.mainObject).find(".subscribers_box");		
		this.subscribersObject = aup_subscribers_proto();
		this.subscribersObject.onSubscribe = bind(this.onSubscribeCallback, this);
		this.subscribersObject.onDeSubscribe = bind(this.onSubscribeCallback, this);
		this.subscribersObject.init( this.subscribersCont );
        this.subscribersObject.onDataLoaded = bind(this.onSubscribeData, this);
		
		
		
		this.subscriptionsCont = $(this.mainObject).find(".subscriptions_box");		
		this.subscriptionsObject = aup_subscribers_proto();
		this.subscriptionsObject.onSubscribe = bind(this.onSubscriptionCallback, this);
		this.subscriptionsObject.onDeSubscribe = bind(this.onSubscriptionCallback, this);
		this.subscriptionsObject.init( this.subscriptionsCont );
        this.subscriptionsObject.onDataLoaded = bind(this.onSubscriptionsData, this);
		///////////////////
		
		
		this.followButton = $(this.mainObject).find(".control_button");
		this.followButton.click(bind(this.clickFollowBut, this));
		
		this.bkImage = $(this.mainObject).find(".profile_background_img");
		this.bkContainer = $(this.mainObject).find(".profile_background_cont");
		
		var a = null;
		
		//setup buttons
		this.timelineButton = $(this.mainObject).find(".profile_sub_timeline_0");
		this.timelineButton.click(bind(function() { this.detectState(""); },this));
		
		this.storiesButton = $(this.mainObject).find(".profile_sub_stories_0");
		this.storiesButton.click(bind(function() { this.detectState("stories"); },this));

		
		
		//set up states
		//timeline
        a = { 	N : 0,
            urlPrefix : "",
            show : bind(function()
            {
                //aup.stats.trackPageChange("/"+this.urlStr+"/"+this.curUserId+"/");
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
                //aup.stats.trackPageChange("/"+this.urlStr+"/"+this.curUserId+"/stories/");
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
                //aup.stats.trackPageChange("/"+this.urlStr+"/"+this.curUserId+"/subscribers/");
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
                //aup.stats.trackPageChange("/"+this.urlStr+"/"+this.curUserId+"/subscriptions/");
                this.subscriptionsCont.css({ display : 'block' });
                this.subscriptionsObject.show();
            }, this),
            hide : bind(function()
            {
                this.subscriptionsObject.hide();
                this.subscriptionsCont.css({ display : 'none' });
            }, this),
            restore : bind(function()
            {
                this.subscriptionsCont.css({ display : 'block' });
                this.subscriptionsObject.restore();
            }, this),
            cont : this.subscriptionsCont,

            button : null,
            classPrefix : null
        }
        this.states.push(a);


        this.resetRestore();
		
		this.curState = 0;
		this.defaultState = 0;
		
		this.pointsHelper.init( this.mainObject );
		
		this.inited = true;
	},
	
	hideSubWindows : function ()
	{
		aup.pages.user.pointsHelper.hide();
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

	show: function (_q)
	{
		//_q - query string
		var q = _q;
		if (!q)
			q = "/";		
		var params = q.split("/");
		var userId = parseInt(params[0]);
		if (isNaN(userId))
		{
			log("aup/user : parametres error");
			this.curPageId = null;
			aup.controller.showErrorPage(2);
			return false;
		}
		this.params = params;

        this.resetRestore();
		
			
		if (aup.auth.status)
		if (userId == aup.auth.status.id)
		{
            aup.controller.getPage(aup.controller.pages[3].urlStr+"/"+q);
            return false;
		}
		
		
		
		this.curUserId = userId;	
		this.timelineObject.controlUrl = aup.netcalls.timelineCallUrl+"?user="+userId;
		this.storiesObject.controlUrl = aup.netcalls.storiesUserCall+"?user="+userId;
		
		
		this.subscribersObject.controlUrl = aup.netcalls.followersCall+"?user="+userId;
		this.subscriptionsObject.controlUrl = aup.netcalls.followingsCall+"?user="+userId;


		this.getProfile();
	},

    onContentHeightChange : function(e)
    {
        if (this.restoreParams.setScroll)
        {
            window.scrollTo(0,this.restoreParams.scrollpos);
            aup.menu.setShadow(this.restoreParams.scrollpos);
            this.restoreParams.setScroll = false;
        }
    },

    resetRestore : function()
    {
        this.restoreParams = {
            scrollpos : 0,
            setScroll : false,
            user : 0
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
        var userId = parseInt(params[0]);

        log("RESTORE!!! restore id =["+userId+"] ["+this.restoreParams.user+"] userId = ["+this.curUserId+"]");


        if (aup.auth.status)
        if (userId == aup.auth.status.id)
        {
            aup.controller.getPage(aup.controller.pages[3].urlStr+"/"+q, true);
            //aup.controller.pages[3].restore(e);

            //log("RESTORE PROFILE");
            return false;
        }

        if (userId!=this.restoreParams.user)
        {
            this.show(e);
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


        setTimeout(bind(function() {
            if (this.restoreParams.setScroll)
            {
                window.scrollTo(0,this.restoreParams.scrollpos);
                aup.menu.setShadow(this.restoreParams.scrollpos);
                this.restoreParams.setScroll = false;
            }
        }, this), 100)
    },


    hide: function (_q)
    {
        this.restoreParams.scrollpos = $(document).scrollTop();
        this.restoreParams.user = this.curUserId;

		this.timelineObject.hide();
        this.subscribersObject.hide();
        this.subscriptionsObject.hide();
        this.storiesObject.hide();
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

        resp.user = aup.auth.escapeUser(resp.user);
		this.userObject = resp.user;
		this.timelineObject.userObject = this.userObject;
		
		this.setProfile(resp);
		this.setTitle(resp);
		aup.controller.showCanvas();
		
		var qStr = "";
		if (this.params.length>1)
			qStr = this.params[1];

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
		
		this.follow = resp.user.follow;
		this.setButtonLabel();

		
	
		this.subscribersCount = resp.user.followers_count;
		this.subscriptionsCount = resp.user.followings_count;
		this.pointsCount = resp.user.points ;
		
		this.subscribersObject.setName("Subscribers");
		this.subscriptionsObject.setName("Subscriptions");
		
		
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
		}
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
	
	
	setButtonLabel: function (_q)
	{
		var labl = $(this.followButton).find(".control_button_label");
		if (aup.auth.status)
		{
			
			if (this.follow)
				labl.html("Remove")
			else
				labl.html("Subscribe");
			
			//this.followButton.css({ visibility : 'visible' });
		}else{
			labl.html("Subscribe");
			//this.followButton.css({ visibility : 'hidden' });
		}		
	},
	
	
	clickFollowBut: function (e)
	{
		if (!aup.auth.status)
		{
            aup.loginMenus.showLoginMenu();
			return false;	
		}
		
		var call = aup.netcalls.followCall;
		
		if (this.follow)
        {
			call = aup.netcalls.unfollowCall;
        }else{
            aup.opengraph.makeFolowAction(this.curUserId);
        }
		
		var labl = $(this.followButton).find(".control_button_label");
		labl.html("<div class='button_loading'></div>");	
		$.ajax({
			  url: call+"?r="+Math.random() ,
              data : { user : this.curUserId },
			  timeout : aup.netTimeOut,
			  success: bind(this.onFollowButCall, this),
			  error: bind(this.onError, this)
		});
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

	
	
	onFollowButCall: function (response)
	{
		var resp = getObjectJson(response);			
		if (resp.error)
		{
			aup.errors.hasNetError(resp);
			return false;
		}


		if (resp.status == "OK")
		{
			this.follow = !this.follow;
			
			if (this.follow)
				this.subscribersCount++
			else
				this.subscribersCount--;
			
			this.setFollowersLabels();
			this.setButtonLabel();
		}
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
			var urla = this.urlStr+"/"+this.curUserId+"/"+stateStr;
            if (!_NotChangeLink)
            {
                setLink( "http://" + aup.domain + "/" + urla);
            }
		}

        aup.shares.hideAct2();
		//aup.resetH();
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
	}

}


