whp_rolloutstory_proto = function () { return {
	//controller parametres
	inited : false,
	
	//main objects
	mainObject  : null,
	mainCont : null,
	mainCanvas : null, 
	
	//templates
	templ_HeadStory : null,
	templ_PageImage : null,
	templ_Page : null,
	templ_Line : null,
	
	onSubscribe : null,
	onDeSubscribe : null,
	//cur variables
	lines : [],
	curLine : null,
	
	emptyElement : null,

	//data loading parametres
	controlUrl : "",	
	loading : false,
	initLoad : false,
	
	scrollToParams : {
		scroll : false,
		p0 : 0,
		p1 : 0
	},


    loadingBar : null,
    emptyTemplate : null,
    showEmpty : false,

	//feed_empty_template_medium
	//init function
	init: function (_cont)
	{
		this.mainObject = id$('rolloutstory_template');
		this.mainObject = $(this.mainObject).clone();
		this.mainObject.removeAttr('id');
		this.mainObject.css({display : 'none'});
		
		//templates
        this.emptyTemplate = $("#timeline_empty_template").clone();
        this.emptyTemplate.removeAttr('id');

		this.templ_HeadStory = $('#rolloutstory_headstory').clone();
		this.templ_HeadStory.removeAttr('id');
		
		this.templ_PageImage = $('#rolloutstory_pageimage').clone();
		this.templ_PageImage.removeAttr('id');
		
		this.templ_Page = $('#rolloutstory_page').clone();
		this.templ_Page.removeAttr('id');
		
		this.templ_Line = $('#rolloutstory_line').clone();
		this.templ_Line.removeAttr('id');
		
		this.emptyElement = $('#feed_empty_template_medium');
		this.emptyElement = this.emptyElement.clone();
        this.setUpemptyElement(this.emptyTemplate);

		//main
		this.mainCont = $(_cont);
		this.mainCont.append(this.mainObject);

        this.loadingBar = $("#notifications_loading_tab");
        this.loadingBar.css({ display : 'block', margin : 'auto', width: 50+'px'});

		//canvas
		this.mainCanvas = this.mainObject.find(".rolloutstory_container");
		
		$(this.photoContainer).append(this.emptyElement);
		$(this.emptyElement).css({display : 'none' });
		
		this.inited = true;
	},

    setUpemptyElement : function(_elem)
    {
        _elem.defText = "Your e-mail address...";
        _elem.input = _elem.find(".timeline_empty_enter");
        _elem.input.val(_elem.defText);
        _elem.inputs = _elem.find(".timeline_empty_inputs");
        _elem.outputs = _elem.find(".timeline_empty_inputs");
        _elem.parent = this;


        _elem.formButton = _elem.find(".timeline_empty_notify_0");
        if (_elem.formButton.length == 0)
            _elem.formButton = _elem.find(".timeline_empty_notify_1");

        _elem.activeSend = false;

        _elem.input.focus(bind(this.onFocus, _elem));
        _elem.input.blur(bind(this.onBlur, _elem));
        _elem.input.keyup(bind(this.checkInput, _elem));

        _elem.formButton.click(bind(this.sendRequest, _elem));

        setClass(_elem.formButton, "timeline_empty_notify_0");


        _elem.downloadButtonT = _elem.find(".timeline_empty_download_iphone");

        _elem.downloadButtonT.click(function() { WHP.stats.trackDownload("DOWNLOAD_STORIES_EMPTY") });
    },

    sendRequest : function(e)
    {
        if (this.activeSend)
            return false;

        if (!validateEmail(this.input.val()))
            return false;

        $.ajax({
            url:WHP.netcalls.promoCall,
            data : { r : Math.random(), email :  this.input.val() },
            timeout:WHP.netTimeOut,
            success:bind(this.parent.promoOk, this),
            error:bind(this.parent.promoFail, this)
        });
    },

    promoOk : function(e)
    {
        this.inputs.css({display : 'none'});
        setClass(this.outputs, "timeline_empty_output");
        this.outputs.css({display : 'block' }).html("We will email you when<br/>it is ready. See you soon!");
        this.activeSend = false;
    },

    promoFail : function (e)
    {
        this.inputs.css({display : 'block'});
        setClass(this.outputs, "timeline_empty_output_fail");
        this.outputs.css({display : 'block' }).html("Failed! Please, try again!");
        this.activeSend = false;
    },



    checkInput : function(e)
    {
        if (validateEmail(this.input.val()))
        {
            setClass(this.formButton, "timeline_empty_notify_1");
        }else{
            setClass(this.formButton, "timeline_empty_notify_0");
        }
    },


    onFocus : function(e)
    {
        if (this.input.val() == this.defText)
            this.input.val("");
    },

    onBlur : function(e)
    {
        if (this.input.val() == "")
            this.input.val(this.defText);
    },



    restore : function()
    {
        this.active = true;

    },
	
	show: function(_offset)
	{
		this.active = true;
		this.clearCanvas();
        this.mainObject.append(this.loadingBar);
		this.loadElements();
	},
	
	hide: function()
	{
		this.active = false;
	},
	
	loadElements: function()
	{
		if (this.loading)
			return false;
			
		if (!this.initLoad)
			WHP.controller.scrollToPos(0,0);
			
		if (this.mainObject.css('display') != 'block')
			this.mainObject.css({display : 'block'});


			
		this.loading = true;
		$.ajax({
			  url: this.controlUrl,
			  data : { r : Math.random() },
			  timeout : WHP.netTimeOut,
			  success: bind(this.onData, this),
			  error: bind(this.onError, this)
		});
	},
	
	onData: function(response)
	{
		this.loading = false;

        if (!this.active)
            return false;
		
		var resp = getObjectJson(response);		
		if (resp.error)
		{
			log("WHP/timeline_prot : error while loading page data! Err =["+response+"]");
			if (!WHP.errors.hasNetError(resp))
			{
				WHP.controller.showErrorPage();
			}
			return false;
		}

        log("START = ["+resp.dailies.length+"] ["+resp.storycats.length+"]");

        if (resp.dailies.length>0)
        {
            var daily = {
                id : 'daily',
                name : 'Daily',
                stories_completed : resp.dailies.length,
                stories_count : resp.dailies.length,
                stories : resp.dailies
            };
            resp.storycats.push(daily);
        }


		
		var curLine = null;
		for (var i=0; i<resp.storycats.length;i++)
		{
			if (i % 3 == 0)
				curLine = this.addLine();
				
			var elem = this.createHeadStory(resp.storycats[i]);
			elem.parentLine = curLine;
			curLine.addHead(elem);
		}



        log("HERE!");
        this.loadingBar.remove();
		if (resp.storycats.length == 0)
		{

            log("L = [0]");
            if (this.showEmpty)
            {
                log("SET EMPTY!!");
                WHP.stats.trackEmptyStories();
                this.mainCanvas.append(this.emptyTemplate);
            }else{
                this.mainCanvas.append(this.emptyElement);
                this.emptyElement.css({display : 'block' });
            }

		}else{
			this.emptyElement.css({display : 'none' });
            this.emptyElement.detach();
            this.emptyTemplate.detach();
		}
		
		
		//log(response);
		//WHP.resetH();
		this.initLoad = false;
	},
	
	addLine : function()
	{
		var a = this.newLine();
		this.lines.push(a);
		this.mainCanvas.append(a);
		return a;
	},
	
	createHeadStory: function(resp)
	{
		pageBorders = 28;
		pageUp = 38;
		photoH = 231;
		
		var a = this.templ_HeadStory.clone();
		a.titleLCD = a.find(".profile_stories_elem_header_tittle");
		a.descCD = a.find(".profile_stories_elem_header_desc");
		a.image = a.find(".imgcollage_template_like_212_img");
		a.image_cont = a.find(".imgcollage_template_like_212_img_cont");
		a.click(bind(this.getStoryContent,a));
		
		a.id = resp.id;
		a.pages = [];
		
		
		a.titleLCD.text(resp.name);
		
		a.parentLine = null;


		var photoN = 0;	
		var totalH = pageBorders;
		var thumbPhoto = resp.stories[0].photos[0];		
		for (var i=0; i < resp.stories.length; i++)
		{
			var page = this.newPage();
			page.id = resp.stories[i].id;
			page.titleLCD.text(resp.stories[i].name);
			photoN += resp.stories[i].photos.length;
			if (thumbPhoto.id < resp.stories[i].photos[0].id)
				thumbPhoto = resp.stories[i].photos[0];
			for (var k=0; k<resp.stories[i].photos.length; k++)
			{
				var elem = this.createPageImage(resp.stories[i].photos[k]);
                elem.parent = page;
                elem.N = new Number(k);
				page.elements.push(elem);
				page.contentCanvas.append(elem);
			}
			
			totalH += pageUp + photoH*Math.ceil(resp.stories[i].photos.length/4);
			a.pages.push(page);
		}
		
		a.contentH = totalH;
		var desc = photoN+" ";
		
		if (photoN>1)
			desc += "photos in "
		else
			desc += "photo in ";
			
		if (resp.stories.length == 1)
			desc += resp.stories.length+" category"
		else
			desc += resp.stories.length+" categories";




        setImageOnload(a.image, thumbPhoto['i212x212'], a.image_cont);
		a.descCD.text(desc);
		
		//a.story_id =
		
		return a;
	},
	
	getStoryContent : function()
	{
		log("getStoryContent");
		log("["+this.parentLine.curElem +"] [ "+ this.positionN+"]     ["+this.parentLine.h_p1 +"] [ "+ this.parentLine.contentH+"]")
		if ((this.parentLine.curElem != this.positionN) && (this.parentLine.h_p1 == this.parentLine.contentH) && (this.parentLine.contentH!=0))
		{
			log("!!!!RESIZE");
			this.parentLine.setN(this.positionN);
			
			//fill rnd data			
			this.parentLine.clearContent();
			this.parentLine.setLineContent();
			
			//resize
			this.parentLine.resizeContent();
		}else{
			if (this.parentLine.h_p1 == 0)
			{
				log("!!!!SHOW");
				this.parentLine.setHeadNfast( this.positionN );
				this.parentLine.showContent(this.parentLine.contentH);


                if (browser.ie)
                {
                    setTimeout(bind(function() {
                        var scrollPos = this.parentLine.offset().top-90 + getScrollTop();
                        log("scrollto = ["+scrollPos+"] ["+getScrollTop()+"]");
                        WHP.smoothScrollTo(0, scrollPos, null, true);
                    }, this), 200);
                }else{
                    var scrollPos = this.parentLine.offset().top-90;
                    log("scrollto = ["+scrollPos+"]");
                    WHP.smoothScrollTo(0, scrollPos, null, true);

                }


				
			}else{
				log("!!!!HIDE");
				this.parentLine.hideContent();
			}
		}
	},

    getPhotoPage : function()
    {
        var _arr = [];
        for (var i=0; i<this.parent.elements.length; i++)
        {
            log("i = ["+i+"]");
            _arr.push({ photo : this.parent.elements[i].response });
        }

        log("CURN = ["+this.N+"]");
        WHP.pages.photo.imagesList.setContent(_arr, this.N);
        //WHP.controller.navigateTo(this.site_url);
    },
	
	createPageImage: function(resp)
	{
		var a = this.templ_PageImage.clone();
		a.image = a.find(".img_template_like_160_img");
		a.image_link = a.find(".timeline_a_ava_holder");
		a.image_cont = a.find(".img_template_like_160_img_cont");
		a.likesLCD = a.find(".feedgrid_hearts_lcd");
		a.likesLCD_cont = a.find(".feedgrid_heart_0");
        a.fader = a.find(".img_template_like_160_img_fader");
        a.fader.css({ display : 'none'});

        a.response = resp;
        a.parent = null;
		
		//var likes = Math.max(0, Math.round(Math.random()*1200-100));
		var likes = resp.like;
		a.likesLCD.text( NformatMin( likes ) );


        if (resp.wasvote==1)
        {
            setClass(a.likesLCD_cont, "feedgrid_heart_1");
        }

        setImageOnload(a.image, resp['i212x212'], a.image_cont, bind(this.faderHider, a));
        a.site_url = WHP.links.getPhotoLink(resp.id);
        a.image_link.click(bind(this.getPhotoPage, a));
		a.image_link.attr('href', a.site_url);

		//a.likesCount =
		//a.dislikesCount =
		//a.photo_id =
		return a;
	},

    faderHider : function()
    {
       this.fader.css({display : ''});
    },
	
	newPage: function()
	{
		var a = this.templ_Page.clone();
		a.titleLCD = a.find(".page_template_header");
		a.contentCanvas = a.find(".page_template_container");
		a.elements = [];
		
		return a;
	},
	
	newLine: function()
	{
		var a = this.templ_Line.clone();
		a.parent = this;
		a.headCanvas = a.find(".stories_line_cont");
		a.contentCanvas = a.find(".story_line_rollover_place_cont");
		a.contentCont = a.find(".story_line_rollover_place");
		a.elementsV = a.find(".story_line_top_v");
		

		//H rollover
		a.contentCont.css({ height : 0 });
		a.elementsV.css({visibility : 'hidden'});
		
		a.moveHTimer = new Timer(1000/30, 10);
		a.moveHTimer.onTimerEvent = bind( this.moveHevent, a);
		a.h_cur = 0;
		a.h_p0 = 0;
		a.h_p1 = 0;
		a.contentH = 0;
		
		a.showContent = bind(this.showContent, a);
		a.hideContent = bind(this.hideContent, a);
		a.resizeContent = bind(this.resizeContent, a);
		//arrays
		a.headElements = [];
		a.contentElements = [];
		
		//clear containers
		a.clearHead = bind(this.clearHead_line, a);
		a.clearContent = bind(this.clearContent_line, a);
		a.clearAll = bind(this.clearLineContent, a);
		
		//add to containers
		a.addHead = bind(this.addHead_line, a);
		a.addContent = bind(this.addContent_line, a);
		a.setLineContent = bind(this.setLineContent, a);
		
		//V move
		a.curElem = -1;
		a.setN = bind(this.setHeadN, a);
		a.setHeadNfast = bind(this.setHeadNfast, a);
		a.moveVTimer = new Timer(1000/30, 10);
		a.moveVTimer.onTimerEvent = bind( this.moveVevent, a);
		a.v_cur = 0;
		a.v_p0 = 0;
		a.v_p1 = 0;
		
		return a;
	},
	
	clearLineContent : function()
	{
		this.clearHead();
		this.clearContent();
	},
	
	setLineContent : function(_N)
	{
		log("Cur elem = ["+this.headElements[this.curElem].pages.length+"]");
		for (var i=0; i< this.headElements[this.curElem].pages.length; i++)
		{
			this.addContent(this.headElements[this.curElem].pages[i]);
		}
		addIntelloLinks(this.contentCanvas);	
		this.contentH = this.headElements[this.curElem].contentH;
	},
	
	
	resizeContent : function()
	{
		log("resizeContent");
		//timers
		this.parent.scrollToParams.scroll = false;
		this.h_p0 = this.h_cur;
		this.h_p1 = this.contentH;
		this.moveHTimer.reset();
		this.moveHTimer.repeatCount = Math.round(Math.abs(this.h_p0-this.h_p1)/100) + 10;
		this.moveHTimer.start();
	},
	
	showContent : function()
	{
		log("ShowContent");		
		//if (this.parent.curLine != null)
		//	this.parent.curLine.hideContent();
		this.parent.curLine = this;
		this.parent.scrollToParams.scroll = true;
		
		this.parent.scrollToParams.p0 = $(document).scrollTop();
		this.parent.scrollToParams.p1 = this.parent.curLine.offset().top;
		
		this.clearContent();
		this.setLineContent();
		
		//timers
		this.h_p0 = this.h_cur;
		this.h_p1 = this.contentH;
		this.moveHTimer.reset();
		this.moveHTimer.repeatCount = Math.round(Math.abs(this.h_p0-this.h_p1)/100) + 10;
		this.moveHTimer.start();
		
		this.moveVTimer.stop();
	},
	
	hideContent : function()
	{
		log("HideContent");
		this.curElem = -1;
		this.parent.scrollToParams.scroll = false;
		
		this.h_p0 = this.h_cur;
		this.h_p1 = 0;
		this.moveHTimer.reset();
		this.moveHTimer.start();
		
		this.moveVTimer.stop();
	},
	
	moveHevent : function(e)
	{
		var A = e.currentCount/e.repeatCount;
		//var B = Math.sin(Math.PI*0.5*A);
		var B = (Math.sin(Math.PI*(A-0.5))+1)*0.5;
		this.h_cur = (1-B)*this.h_p0  + B*this.h_p1;
		
		this.contentCont.css({ height : this.h_cur });
		
		if (this.parent.scrollToParams.scroll)
		{
			this.parent.scrollToParams.p1 = this.parent.curLine.offset().top-80;
			var newPos = (1-B)*this.parent.scrollToParams.p0 + B*this.parent.scrollToParams.p1;
			//window.scrollTo(0, newPos);
		}
		
		
		
		
		//V display 
		if ( this.h_cur>30 )
		{
			if (this.elementsV.css('visibility') != 'visible')
				this.elementsV.css({visibility : 'visible'});
		}else{
			if (this.elementsV.css('visibility') != 'hidden')
				this.elementsV.css({visibility : 'hidden'});
		}

        if (A==1)
        {
            //WHP.resetH();
        }
	},
	
	
	
	moveVevent : function(e)
	{
		var A = e.currentCount/e.repeatCount;
		var B = Math.sin(Math.PI*0.5*A);
		this.v_cur = (1-B)*this.v_p0  + B*this.v_p1;
		
		this.elementsV.css({ left : this.v_cur + 'px' });
	},
	
	setHeadN : function(_N)
	{
		log("SetHeadN");
		this.curElem = _N;
		var b = 140;
		var a = 263+51;
		
	
		this.v_p0 = this.v_cur;
		this.v_p1 = (a*this.curElem+b);
		
		this.moveVTimer.reset();
		this.moveVTimer.start();
	},
	
	setHeadNfast : function(_K)
	{
		this.curElem = _K;
		var b = 140;
		var a = 263+51;
		
		this.v_cur = (a*this.curElem+b);
		this.elementsV.css({ left : this.v_cur + 'px' });
	},
	
	
	addHead_line: function(_elem)
	{
		_elem.positionN = parseInt(new Number(this.headElements.length));
		this.headElements.push(_elem);
		this.headCanvas.append(_elem);
	},
	
	addContent_line: function(_elem)
	{
		_elem.positionN = parseInt(new Number(this.contentElements.length));
		this.contentElements.push(_elem);
		this.contentCanvas.append(_elem);
	},
	
	clearHead_line: function()
	{
		while( this.headElements.length > 0 )
		{
			var a = this.headElements.pop();
			a.remove();
		}
	},
	
	clearContent_line: function()
	{
		while( this.contentElements.length > 0 )
		{
			var a = this.contentElements.pop();
			a.remove();
		}
	},
	
	onError: function(response)
	{
		var status = response['status'];
		log("WHP/timeline_prot : error status = ["+status+"]");
		this.loading = false;
		if (status!=0)
		{
			log("Reload data");
			this.loadElements();
		}
		//WHP.controller.showErrorPage();
	},
	
	clearCanvas: function()
	{
		//remove pages
		while(this.lines.length>0)
		{
			var a = this.lines.pop();
			a.remove();
		}
		$(this.emptyElement).css({display : 'none'});
	}
}
}



