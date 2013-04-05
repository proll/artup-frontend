 aup.controller = {
	inited : false,	
	started : false,

    redirecting : false,
	pages : [],
	
	curPage : null,

	mainCanvas : null,
	errorPage : null,

    loadingBar : null,
	
	detectURLchangeTimer : new Timer(500, 0),
	history : [],
	
	visible : false,
	
	slideShadowTimer : new Timer(1000/30, 10),
	slideShadowP0 : 0,
	slideShadowP1 : 0,
	
	firstPop : true,

    afterRemoveBack : false,

    initLocation : '',

    removedList : [],
	
	reloadPage: function ()
	{
        if (browser.ie)
        {

            var hashLink = getLinkNormolizedHash();
            if (hashLink.length==0)
                urla = getLinkNormolized();
            else
                urla = hashLink;

            urla = urla.replace(aup.domain, "");

            if (urla.indexOf("?")>-1)
                urla = urla.substring(0, urla.indexOf("?"));
            urla = urla.replace("http://"+aup.domain+"/","");
            urla = urla.replace("https://"+aup.domain+"/","");
            urla = urla.replace("//"+aup.domain+"/","");
            this.navigateTo(urla);
        }else{
            var url = new String(document.location);
            url = url.replace("http://"+aup.domain+"/","");
            url = url.replace("https://"+aup.domain+"/","");
            url = url.replace("//"+aup.domain+"/","");
            this.navigateTo(url);
        }
	},
	
	onChangeAuthState: function (_auth)
	{
        aup.serviceMessages.onAuthChange(_auth);
        aup.timelineMessages.onAuthChange(_auth);

		if (_auth)
		{
            if (this.curPage)
			{
				if (this.curPage.onAuthChange)
					this.curPage.onAuthChange(true)
				else
					this.reloadPage();
			}else{
				this.reloadPage();
			}


		}else{
            aup.loginMenus.loginWindowWind.reset(true);
            aup.loginMenus.loginWindowWind2.reset(true);
			this.navigateTo("/");
		}

        aup.menu.currentMenuPos();
        this.setTitle();
	},
	
	showErrorPage: function (_message)
	{
        if (typeof(_message) != 'undefined')
        {
            this.errorPage.setView(_message);
        }else{
            this.errorPage.setView(0);
        }

		this.getPage(this.errorPage.urlStr);
	},

	navigateTo: function (_url, _doNotChangeLink, _restorePrev)
	{
        $(".main-header-l10n").hide();

		var urla = _url;
		if (typeof(urla) == 'undefined')
		{
			//hash link has a higher prioritet
			var hashLink = getLinkNormolizedHash();			
			if (hashLink.length==0)
				urla = getLinkNormolized();	
			else
				urla = hashLink;			
			
			//remove special symbols
			if (urla.indexOf("?")>-1)
				urla = urla.substring(0, urla.indexOf("?"));

            urla = urla.replace(aup.domain, "");
				
			if (document.location.hash.length>0)
			{
				if (browser.ie)
				{
					//set redirect for ie
					if (!_doNotChangeLink)	
					if (!this.started)
                    {
						//document.location = "http://" + aup.domain + "/" + urla;
                        //return false;
                    }
				}else{
					//change link for other browsers	
					if (!_doNotChangeLink)
						setLink( "//" + aup.domain + "/" + urla);
				}				
			}
		}else{
            log(urla);
            urla = urla.replace("https://"+aup.domain,"");
			urla = urla.replace("http://"+aup.domain,"");	
			urla = urla.replace("http://weheartpics.com","");
            urla = urla.replace("//"+aup.domain+"/","");
			//remove ?query
			if (urla.indexOf("?")>-1)
				urla = urla.substring(0, urla.indexOf("?"));

			urla = normolizeLink(urla);

            urla = urla.replace(aup.domain, "");
			if (!_doNotChangeLink)
            {
                var histObj = { url : getcurPageId(), object : this.curPage.restoreParams };
                this.history.push(histObj);
                if (typeof(this.curPage.restoreParams) == "undefined")
                {
                    setLink( "//" + aup.domain + "/" + urla);
                }else{
                    setLink( "//" + aup.domain + "/" + urla, this.curPage.restoreParams);
                }
            }
		}


		//load content
		log("aup/controller : get = ["+urla+"]");
		this.getPage(urla, _restorePrev);
	},
	
	getPage: function (_str, _restorePrev)
	{
		var normStr = _str;
		normStr = normolizeLink( normStr );

        this.current_page = normStr;
        if (this.current_page && this.current_page.indexOf("photo") < 0) { // если это не лендинг и не фото
            aup.download.init();
        }

        log("GET = ["+_str+"]");

		var switchPage = null;
		
		//show start page with no parametres
		if (normStr.length == 0)
		{
			log("aup/controller : redirect to main = ["+this.getMainPage().urlStr+"]");
            switchPage = this.getMainPage();

			setLink( "//" + aup.domain + "/" + switchPage.urlStr);
		}

		if (!switchPage)
		{
			var maxLength = 0;			
			var nPage = 0;	//404
            var founded = false;
			switchPage = this.pages[nPage];

			for (var i=0; i<this.pages.length; i++)
			{
				//maxL for maximum match strings
				var maxL = Math.min(normStr.length, this.pages[i].urlStr.length);
				//for urls like http://aup.com/controlstr
				var shortUrl = (normStr.indexOf(this.pages[i].urlStr)==0) && (maxL>maxLength) && (normStr.length == this.pages[i].urlStr.length);
				//for urls like http://aup.com/controlstr/
				var longUrl = (normStr.indexOf(this.pages[i].urlStr+"/")==0) && (maxL>maxLength);


				if (shortUrl || longUrl)
				{
					maxLength = maxL;
					nPage = i;
                    founded = true;
				}
			}

			
			var query = "";
			if (nPage != 0)
            {
				query = normStr.substring(maxLength+1, normStr.length);
            }else if (!founded){
                this.errorPage.setView(2);
            }
			
			
			switchPage = this.pages[nPage];
		}
		
		
		if (switchPage!=null)
		{
			//take off old page
			this.clearCurPage();
			//set new
			this.setPage(switchPage,true,query,_restorePrev);

            //service_messages
            aup.serviceMessages.checkVisible();
            aup.timelineMessages.checkVisible();
		}			
		
		aup.curHash = new String(document.location.hash);
		return true;
	},	
	
	clearCurPage: function ()
	{
		if (this.curPage != null)
		{
			if (typeof(this.curPage.hide) != 'undefined')
            {
				this.curPage.hide();
                this.curPage.active = false;
            }
            log("clearCurPage");
            this.hideCanvas();
            if (this.curPage.mainObject.parentNode)
			{
				while(this.mainCanvas.childNodes.length>0)
					this.mainCanvas.removeChild(this.mainCanvas.childNodes[0]);
				
			}
		}
	},
	
	setPage: function (switchPage, _useQ, query, _restorePrev)
	{
        aup.loginMenus.hideMenus();

		aup.menu.currentMenuPos();
		//show new page
		this.curPage = switchPage;

        //
        aup.shares.hideAct2();




        if (_useQ)
        {
            // log("Get sum = ["+(_restorePrev && (typeof(this.curPage.restore) != 'undefined'))+"] ["+typeof(this.curPage.restore)+"]");
            if (_restorePrev && (typeof(this.curPage.restore) != 'undefined'))
            {
                this.curPage.restore(query);
            }else{
                this.curPage.show(query);
            }
        }


		//set up rnd button
		if (this.curPage.rndEnable)
		{
			$(aup.menu.randomButton).css({ display : 'block' });
		}else{
			$(aup.menu.randomButton).css({ display : 'none' });
		}
		this.mainCanvas.appendChild(this.curPage.mainObject);

        this.curPage.active = true;
        this.setTitle();
	},
	
	detectURLchange: function ()
	{
		var newLink = new String(document.location.hash);
		if (newLink.valueOf() != aup.curHash.valueOf())
		{
            if (this.history.length>1)
            {
                if (this.history[this.history.length-2].url == getcurPageId())
                {
                    //var histObj = { url : getcurPageId(), object : this.curPage.restoreParams}
                    //this.history.push(histObj);
                    aup.curHash = newLink;
                    this.popState(this.history[this.history.length-2]);
                    return false;
                }
            }
			this.navigateTo();
			aup.curHash = newLink;
		}
	},
	
	setTitle: function()
	{
		var str = this.curPage.title;		
		if (typeof(str) == 'undefined')
			str = "";
		
		aup.docTitle = aup.pageTitle;
		setDocTitle(aup.docTitle);
	},
	
	init: function (_settings)
	{

		if (this.inited)
			return true;

        this.initLocation = new String(document.location);
			
		this.pages.push(aup.pages.error404);   //0
		this.pages.push(aup.pages.photoPopular);   //1
		this.pages.push(aup.pages.photo);   //2
		this.pages.push(aup.pages.profile);  //3
		this.pages.push(aup.pages.user);   //4
		this.pages.push(aup.pages.timeline);     //5
		this.pages.push(aup.pages.story);  //6
		this.pages.push(aup.pages.stories);      //7
        this.pages.push(aup.pages.landing);  //8
        this.pages.push(aup.pages.settings);  //9
        //registration
        this.pages.push(aup.pages.getstarted);  //10
        this.pages.push(aup.pages.findfriends);   //11
        this.pages.push(aup.pages.confirmation);   //12
        this.pages.push(aup.pages.resendpw);    //13

        this.pages.push(aup.pages.aup);    //14
        this.pages.push(aup.pages.setpassword);    //15

		for (var i=0; i<this.pages.length; i++)
		{
            log("urlStr = ["+this.pages[i].urlStr+"]");
			this.pages[i].init();			
		}
		
		this.mainCanvas = document.getElementById(aup.canvasContId);
        this.loadingBar = $( "#loading_tab" );


		//set error page
		this.errorPage = this.pages[0];
		//set main page



        if (_settings)
            aup.pages.settings.onData(_settings);

		//get start page
		this.navigateTo();
		this.started = true;		
		aup.curHash = new String(document.location.hash);

        if (browser.ie)
        {
            this.detectURLchangeTimer.onTimerEvent = bind(this.detectURLchange, this);
            this.detectURLchangeTimer.start();
        }
		//AddHandler(window, 'popstate', this.popState, this);	
		
		//var popped = ('state' in window.history), initialURL = location.href;
		$(window).bind('popstate', bind(this.popState, this));
        $(window).bind('beforeunload', bind(this.terminateEvent, this));

//        aup.download.checkVersions();
		//slide shadow
		this.slideShadowTimer.onTimerEvent = bind(this.shadowTimerEvent, this);
		aup.resize();
		this.inited = true;


        //ipad
        if (browser.ipad)
        {
            aup.shadows.tile.css({ visibility: 'hidden'});
            aup.shadows.vtop.css({ visibility: 'hidden'});
            $(aup.menu.randomButton).css({ right : -68+'px' });
        }


	},
	
	shadowTimerEvent: function(e)
	{
		var A = e.currentCount/e.repeatCount;
		var B = Math.sin(Math.PI*0.5*A);
		var C = (1-B)*this.slideShadowP0 + B*this.slideShadowP1;
		aup.menu.setShadowA(C);
	},
	
	setShadowAuto: function()
	{
		this.slideShadowTimer.reset();
		this.slideShadowP0 = aup.menu.menuShadow.alpha;
		this.slideShadowP1 = 0;
		this.slideShadowTimer.start();
		//var top = $(document).scrollTop();
		//aup.menu.setShadow(top);
	},

    terminateEvent : function(e)
    {
        if (typeof(this.curPage.hide) != 'undefined')
        {
            this.curPage.hide();
        }

    },
	
	popState: function(e)
	{
		log("LINKS > onpopstate event = ["+document.location+"] ["+history.length+"] ["+ globalSetLinksN +"] ["+this.initLocation+"]");


        if ((globalSetLinksN == 0) && (document.location.valueOf() == this.initLocation.valueOf()))
        {
            log("INIT LOAD!");
            return false;
        }


		//var browserA = (browser.chrome || browser.safari || browser.firefox || browser.opera);
        this.firstPop = false;
		if ((!this.firstPop && !browser.ie) || browser.ie)
        {
            var mstate = null;

            if (browser.ie)
            {
                mstate = e.object;
            }else{
                mstate = e.originalEvent.state;
            }


            for (var key in mstate)
                log("mstate['"+key+"'] = ["+mstate[key]+"]");

			this.navigateTo(new String(document.location).valueOf(), true, mstate);
            aup.controller.removedList = [];
        }


		this.firstPop = false;
        this.afterRemoveBack = false;
	},
	showCanvas: function()
	{
        //return false;
		if (this.visible)
			return false;

        log("SHOWCANVAS");
		this.visible = true;
        this.loadingBar.css({ display : 'none' });
		setClass(this.mainCanvas, "content_visible");

        aup.footer.css({ visibility: "visible"});

        aup.changeContentH(null, true);

		this.setShadowAuto();
        this.setTitle();


        aup.serviceMessages.checkVisible();
        aup.timelineMessages.checkVisible();
	},
	hideCanvas: function()
	{
		if (!this.visible)
			return false;
			
		this.visible = false;
        this.loadingBar.css({ display : 'block' });
		setClass(this.mainCanvas, "content_hidden");
        $(".main-header-l10n").hide();
        aup.shares.hideAct2();

        aup.footer.css({ visibility: "hidden"});

		//aup.resetH();

		this.setShadowAuto();
        this.setTitle();
        log("HIDECANVAS");
	},

    getMainPage : function()
    {
        var a = this.pages[8];
        if (aup.auth.status)
        {
            if (this.history.length>0)
            {
                a = this.pages[8];
            }else{
                a = this.pages[5];
            }
        }


        return a;
    },
	
	scrollToPos: function(_x, _y)
	{
		this.setShadowAuto();
		window.scrollTo(0,0);
	}
}

//special object for all displays


