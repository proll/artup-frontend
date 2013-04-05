aup_timeline_proto = function () { return {
	//controller parametres
	inited : false,
	active : false,
	
	
	//data loading parametres
	controlUrl : "",
	prefix : "",

    parent : null,
	

	lasttimeshtamp : 0,
	curOffset : 0,
	curTotal : 0,
	lastTotal : 0,
	curNew : 0,
	elementsLimit : 30,
    pagesN : 0,

	pages : [],
	curPage : null,
	startPage : null,

	loading : false,
	actMargin : 120,
	step_top : 20,
	step_bottom : 100,
	startY : 0,
	lastMargin : 0,



	//templates
    loadingBar : null,


    templatePhoto : null,
	templateStory : null,
	templateLike : null,
	templateFollow : null,


	templateLastvisit: null,
	lastVisitSetted : false,

	templateLikeSmall : null,
	templateFollowSmall : null,

	notifiesObject : null,

	templatePage : null,

	//html elements
	mainCont : null,
	mainObject : null,
	mainCanvas : null,
	clocksInd : null,

	userObject : null,

	//template id/classes
	templateLayout : "template_timeline",
	showEvents : true,
	controlCanvas : true,
	lastposRelated : true,
	displayLastVisit : true,
    showLoadingOnstart : false,

	controlUrl : "",
	initLoad : false,

    onErrorEvent : null,

    blocks_canvas : null,
    emptyTemplate : null,
    emptyTemplate2 : null,

    curTLcall : 0,
    jqxhr : null,

    usePosRecalAfterRebuild : false,
    showEmpty : false,



    restoreParams : null,

	//init function
	init: function (_cont)
	{
		this.mainObject = id$('timeline_template');
		this.mainObject = $(this.mainObject).clone();
		this.mainObject.removeAttr('id');
		this.mainObject.css({display : 'none'});

		this.blocks_canvas = $(this.mainObject).find(".blocks_canvas");
		//templates
		this.templatePhoto = $('#timeline_template_photo').clone();
		this.templatePhoto.removeAttr('id');

		this.templateStory = $('#timeline_template_story').clone();
		this.templateStory.removeAttr('id');

		this.templateLastvisit = $('#timeline_template_lastvisit').clone();
		this.templateLastvisit.removeAttr('id');

		this.templateLike = $('#timeline_template_like').clone();
		this.templateLike.removeAttr('id');


		this.templateLike.removeAttr('id');

		this.templateFollow = $('#timeline_template_follow').clone();
		this.templateFollow.removeAttr('id');

		this.templateLikeSmall = $('#timeline_template_like_elem').clone();
		this.templateLikeSmall.removeAttr('id');

		this.templateFollowSmall = $('#timeline_template_follow_elem').clone();
		this.templateFollowSmall.removeAttr('id');


		this.templatePage = $('#timeline_page_template').clone();
		this.templatePage.removeAttr('id');


        this.emptyTemplate = $("#timeline_empty_template").clone();
        this.emptyTemplate.removeAttr('id');

        this.emptyTemplate2 = $("#feed_empty_template_medium").clone();
        this.emptyTemplate2.removeAttr('id');


        this.setUpemptyElement(this.emptyTemplate);

		//objects
		this.notifiesObject = $('#timeline_template_new_notif').clone();
		this.notifiesObject.removeAttr('id');

		this.clocksInd = $(this.mainObject).find( ".timeline_clocks" );
		this.HasJoined = $(this.mainObject).find( ".timeline_join" );

		this.mainCanvas = $(this.mainObject).find( ".timeline_main_container" );

		this.mainCont = $(_cont);
		this.mainCont.append(this.mainObject);



        this.loadingBar = $("#notifications_loading_tab").clone().removeAttr('id');
        this.loadingBar.css({ display : 'block', margin : 'auto', width: 50+'px'});





		//add scroll event for end check
		//var mousewheelevt = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";

		AddHandler(window, "scroll", bind(this.scrollEvent,this));

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

        if (this.showEvents)
        {
            _elem.downloadButtonT.click(function() { aup.stats.trackDownload("DOWNLOAD_TIMELINE_MAIN_EMPTY") });
        }else{
            _elem.downloadButtonT.click(function() { aup.stats.trackDownload("DOWNLOAD_TIMELINE_USER_EMPTY") });
        }
    },

    sendRequest : function(e)
    {
        if (this.activeSend)
            return false;

        if (!validateEmail(this.input.val()))
            return false;


        $.ajax({
            url:aup.netcalls.promoCall,
            data : { r : Math.random(), email :  this.input.val() },
            timeout:aup.netTimeOut,
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

        if (this.parent.restoreParams.setScroll)
        {
            setTimeout(bind(function() {
                if (this.restoreParams.setScroll)
                {
                    window.scrollTo(0,this.restoreParams.scrollpos);
                    aup.menu.setShadow(this.restoreParams.scrollpos);
                    this.restoreParams.setScroll = false;
                }
            }, this.parent), 100);
        }
    },

	show: function(_offset)
	{
        this.curTLcall++;
        this.active = true;
		this.curOffset = _offset;
		this.curTotal = 0;
		this.curNew = 0;
		this.lasttimeshtamp = 0;
        this.pagesN = 0;

		this.startY = 0;
		this.lastMargin = 0;
		this.clearCanvas();
		this.initLoad = true;

        if (this.jqxhr)
            this.jqxhr.abort();

        this.loading = false;
        this.jqxhr = null;

		this.clocksInd.css({ display : 'none'});
		this.HasJoined.css({ display : 'none'});



		this.addNewPage();


        if (this.showLoadingOnstart)
        {
            this.startPage.mainCanvas.append(this.loadingBar).css({ display : 'block'});
        }

		this.loadElements();
	},

	hide: function()
	{
        log("TRACK TL = ["+this.active+"]");
        if (!this.active)
            return false;
		this.active = false;



        aup.stats.trackTimeline(this.showEvents, this.pagesN);
	},

	loadElements: function()
	{
		if (this.controlUrl == "")
			return false;

		if (this.loading)
			return false;

		if ((this.curOffset >= this.curTotal) && (this.curOffset!=0))
			return false;

		if (!this.initLoad && (this.curTotal==0))
			return false;

		if (this.initLoad)
            aup.controller.scrollToPos(0, 0);

		if (this.mainObject.css('display') != 'block')
			this.mainObject.css({display : 'block'});



        this.pagesN++;
		this.loading = true;
		var canvas = this.startPage;
        var curCall = new Number(this.curTLcall);
		this.jqxhr = $.ajax({
			  url: this.controlUrl,
			  timeout : aup.netTimeOut,
			  data : { offset : this.curOffset, limit : this.elementsLimit, r : Math.random() },
			  success: bind(function(resp) { this.onData(resp, canvas, curCall); } , this),
			  error: bind(this.onError, this)
			});
	},

	onData: function(response, canvas, _nCall)
	{
        if (this.curTLcall != _nCall)
        {
            log("WRONG TIMELINE CALL! = ["+this.curTLcall+"] ["+_nCall+"]");
            return false;
        }


		this.loading = false;
        var resp = getObjectJson(response);

        if (!this.active)
        {
            log("set timelineRestoreResponse!") ;
            if (this.parent)
            if (this.parent.restoreParams)
                this.parent.restoreParams.timelineRestoreResponse = resp;

            log("parent = ["+this.parent+"] ["+this.parent.restoreParams+"] ["+this.parent.restoreParams.timelineRestoreResponse+"]");
            log("timelineRestoreResponse = ["+this.parent.restoreParams.timelineRestoreResponse+"]");
            return false;
        }


		if (resp.error)
		{
			log("aup/timeline_prot : error while loading page data! Err =["+response+"]");
			if (!aup.errors.hasNetError(resp))
			{
                if (this.onErrorEvent)
                {
                    var e = { error : 'DATA_ERROR' };
                    this.onErrorEvent(e);
                }
				//aup.controller.showErrorPage();
			}
			return false;
		}




        if (this.showLoadingOnstart)
            this.loadingBar.detach();



		if (this.controlCanvas)
            aup.controller.showCanvas();



		if (this.curOffset == 0)
		{
			//check is it ok?
			if (!resp.feed)
				return false;

			this.curTotal = resp.feed.total;
            this.lastVisitSetted = false;

			//last total
			if (this.lastposRelated)
			{
				var cookiename = "tl_lstt_"+this.prefix;
				var last = getCookie( cookiename );
				if (last!=null)
				{
					this.lastTotal = parseInt(last);
				}else{
					this.lastTotal = this.curTotal;
				}
				//this.lastTotal--;
				delCookie(cookiename);
				setCookieMin(cookiename,this.lastTotal,24*60);
			}else{
				this.lastTotal = this.curTotal;
			}


            if (this.curTotal == 0)
            //if (true)
            {
                setClass(this.mainObject,"blocks_canvas_empty");
                if (this.showEmpty)
                {
                    aup.stats.trackEmptyTimeline(this.showEvents);
                    this.curPage.mainCanvas.append(this.emptyTemplate);
                }else{
                    this.curPage.mainCanvas.append(this.emptyTemplate2);
                }


                aup.controller.scrollToPos(0, 0);
                this.clocksInd.css({ display : 'none'});
                this.initLoad = false;
                return false;
            }else{
                setClass(this.mainObject,"blocks_canvas");
                this.emptyTemplate.detach();
                this.emptyTemplate2.detach();
            }



			if (this.showEvents)
			{
				if (Math.abs(this.curTotal-this.lastTotal) % 2 == 0)
				{
					this.notifiesObject.addClass("timeline_float_right");
				}else{
					this.notifiesObject.addClass("timeline_float_left");
				}
				this.curPage.mainCanvas.append(this.notifiesObject);
			}


			this.curNew = resp.feed.newcount;
			this.lasttimeshtamp = resp.feed.last_visit_timestamp*1000;
			if (this.showEvents)
			{
				var lcd = this.notifiesObject.find(".events_number_cont");
				lcd.empty();
				var nGlyphs = printNotify19(this.curNew,lcd);

				var timeShtampLCDblock = this.notifiesObject.find(".events_n_container");
                var comment = this.notifiesObject.find(".events_text_container");

				var ts = 24;
				//timeShtampLCDblock.css({left : (3-nGlyphs+1)*ts + 'px'});
                timeShtampLCDblock.css({left : 13 + 'px'});
                comment.css({ left : 79 + (nGlyphs-2)*20 +'px'})
                //100px



				var str =  "New events since your last visit <br/>";
				str = str + getDateDelt(this.lasttimeshtamp)+" ago";
				comment.html(str);
			}
		}else{
			this.curTotal = resp.feed.total;

            if (this.curTotal > resp.feed.total)
            {
                log("Recall width offset = ["+(this.curTotal-resp.feed.total)+"]");
                this.curOffset = this.curOffset - (this.curTotal-resp.feed.total);


                log("Get lastTotal = ["+this.lastTotal+"]");
                this.lastTotal = Math.max(0, this.lastTotal - ((this.curTotal-resp.feed.total) % 2));
                log("Set lastTotal = ["+this.lastTotal+"]");
                //delCookie(cookiename);
                //setCookieMin(cookiename,this.lastTotal,24*60);

                this.curTotal = resp.feed.total;
                this.loadElements();
                return false;
            }
        }

        var lastTimeshtamp = 0;
        if (this.pages[0].elements.length>0)
            lastTimeshtamp = this.pages[0].elements[this.pages[0].elements.length-1].timeshtamp;


        var listAdded = 0;
		for (var i=0; i<resp.feed.list.length; i++)
        {
            //this.addBlock(resp.feed.list[i], canvas);
            if (true)
            {
                if (lastTimeshtamp>0)
                {
                    if (resp.feed.list[i].timestamp*1000 < lastTimeshtamp)
                    {
                        listAdded++;
                        this.addBlock(resp.feed.list[i], canvas);
                    }
                }else{
                    listAdded++;
                    this.addBlock(resp.feed.list[i], canvas);
                }
            }
        }
        log("COUNT = [ "+listAdded+" / "+resp.feed.list.length+" ]");

		if (this.initLoad)
            aup.controller.scrollToPos(0, 0);

		this.curOffset = this.curOffset + resp.feed.list.length;


		if (this.curOffset >= this.curTotal)
		{
			this.clocksInd.css({ display : 'none'});
			this.HasJoined.css({ display : 'block'});
			var label = this.HasJoined.find(".timeline_joined_template_label");

            //user name in timeline
			var userName = "";
			if (this.userObject)
                userName = this.userObject.name
            else
                if (aup.auth.userObject)
                    userName = aup.auth.userObject.name;

			var textL = userName+" joined WeHeartPics";
			label.html(textL);
			//end
		}else
			this.clocksInd.css({ display : 'block'});


		//log(response);
        this.initLoad = false;
	},


	addBlock : function( _resp, _canvas)
	{
		var b = null;

		if (this.displayLastVisit)
		if ((this.lasttimeshtamp>_resp.timestamp*1000) && (!this.lastVisitSetted))
		{
			if (_canvas.elements.length>0)
			{
				b = this.fillLastVisit();
				_canvas.mainCanvas.append(b);
			}
			this.lastVisitSetted = true;
		}

		if (_resp.type == "PHOTO")
		{
			b = this.createPhoto(_resp);
		}else if (_resp.type == "STORY")
		{
			b = this.createStory(_resp);
		}else if (_resp.type == "LIKE")
		{
			b = this.createLike(_resp);
		}else if (_resp.type == "FOLLOW")
		{
			b = this.createFollow(_resp);
		}else{
			log("aup/timeline_prot : undeclarated type of element = ["+_resp.type+"]");
			return false;
		}

		this.appendBlock(b, _canvas);
	},

	addNewPage : function()
	{
		var newPage = this.templatePage.clone();
		newPage.mainCanvas = newPage.find(".timeline_page_cont");
		//setClass(newPage, "timeline_main_block");

		//vars
		newPage.elements = [];
		newPage.startY = 0;
		newPage.actMargin = this.actMargin;
		newPage.lastMargin = 0;


		if (this.pages.length == 0)
		{
			this.mainCanvas.append(newPage);
			this.startPage = newPage;
		}else{
			newPage.insertBefore(this.curPage);
			newPage.showSepLine();
		}

		this.pages.push(newPage);
		this.curPage = newPage;
	},

	showSepLine : function()
	{
		this.pageSeparator.css({display : 'block'});
		//this.css({'margin-top' : 16+'px'});
	},

	appendBlock: function(_b,_canvas)
	{
		var prevYend = 0;
		if (_canvas.elements.length>0)
		{
			var pos =_canvas.elements[_canvas.elements.length-1].position();
			prevYend = pos.top;
		}


		if ( (Math.abs(this.curTotal-this.lastTotal) - _canvas.elements.length) % 2 == 0)
		{
			_b.addClass("timeline_float_left");

			setFCK_FF_BKx(_b.find(".timeline_v_plate"), -20);
		}else{
			_b.addClass("timeline_float_right");

			setFCK_FF_BKx(_b.find(".timeline_v_plate"), 0);
		}

		_canvas.mainCanvas.append(_b);

		var posC = _b.position();


		if (_canvas.elements.length == 0)
		{
			_canvas.startY = posC.top;
			var step = _canvas.actMargin;
		}else{
			var step = posC.top - prevYend - _canvas.lastMargin;
		}

		var marginH = 0;
		if (step < _canvas.actMargin)
		{
			marginH = Math.max(_canvas.actMargin - step,0);
			_b.css({ 'margin-top' : marginH+ 'px'});
		}
        _b.positionTL = posC.top + marginH;

		_canvas.lastMargin = marginH;

		    _canvas.elements.push(_b);


		//line continue
		//var h = posC.top-this.startY+_b.height() + this.step_bottom + this.step_top + marginH;
		//this.lineObject.css({ height :  h + 'px', top : -this.step_top + 'px' });
	},

	fillLastVisit: function()
	{
		var a = this.templateLastvisit;
		a.timeShtampLCD = a.find(".timeline_lastvisit_label");
		a.timeShtampLCD.text("Your last visit was "+getDateDelt(this.lasttimeshtamp)+" ago");
		a.timeshtamp = this.lasttimeshtamp;
		return a;
	},

	createPhoto: function(_resp)
	{

		var user = _resp.user;
		if ((this.userObject) && (!user))
			user = this.userObject;

		var a = this.templatePhoto.clone();
		setFCK_FF_BKy(a.find(".timeline_v_plate"), 0);

        a.eType = "photo";
		a.parent = this;
		a.timeshtamp = _resp.timestamp*1000;
		a.uid = _resp.photo.user.id;
        a.caption = a.find(".timeline_caption");
        a.captionText = a.find(".timeline_caption_text");
        if (_resp.photo.caption)
        {
            a.captionText.text(_resp.photo.caption);
        }else{
            a.caption.css({ display : 'none'});
        }


		//set time
		a.timeShtampLCD = a.find(".timeline_timeshtamp");
		a.timeShtampLCD.text(getTimeFormatedTl(_resp.timestamp*1000));


		a.likesCount = _resp.photo.like;
		a.commentsCount = _resp.photo.comments_count;
		a.wasVote = _resp.photo.wasvote;
		a.photo_id = _resp.photo.id;


		//title
		a.titleLCD = $(a).find( ".timeline_header_text_cont" );
		var storyName = _resp.photo.story;

		if (typeof(storyName) == 'undefined')
		{
			storyName = "Draft";
			storyLink = aup.links.getUserProfileLink(user.id)+"drafts/";
		}else{
			storyLink = aup.links.getScenarioLink(storyName.id);
            if (storyName.type=="UNSORTED")
            {
                storyName = storyName.name;
            }else if (storyName.type=="TIMELINE")
            {
                storyName = "Snapshot";
            }else{
                storyName = storyName.name;
            }
		}

        if (_resp.photo.story.type=="TIMELINE")
        {
            storyName = "<span class='tl_theme_text_na' style='font-size:16px;font-weight:bold;'>"+storyName+"</span><br/>";
        }else{
            storyName = getTrimmedTextToSize(storyName,20,279,true);
            storyName = "<a class='tl_theme_text' style='font-size:16px;font-weight:bold;' href='"+storyLink+"'>"+storyName+"</a><br/>";

        }

        storyName = storyName + "by <a class='feed_author_name' style='font-size:16px' href='"+aup.links.getUserProfileLink(user.id)+"' >"+user.name+"</a>";
		a.titleLCD.html(storyName);

		//avatar image
		a.avatarLCD = $(a).find( ".timeline_header_avatar_img" );
        if (user.photo)
        {
            $(a).find( ".timeline_header_avatar").css({ 'background-image':'none'});
            setImageOnload(a.avatarLCD, user.photo['i106x106']);
        }else{
            a.avatarLCD.css({ visibility: 'hidden'});
        }



		//profile link
		a.avatarLCD_link = $(a).find( ".timeline_a_ava_holder" );
		a.avatarLCD_link.attr('href', aup.links.getUserProfileLink(_resp.photo.user.id));


		//photo
		a.photo = $(a).find( ".timeline_template_photo_img" );

        setImageOnload(a.photo, _resp.photo['i400x400'], $(a).find( ".timeline_template_photobody" ));

		//image link
		a.photo_link = $(a).find( ".timeline_a_image_holder" );
		a.photo_link.attr('href', aup.links.getPhotoLink(_resp.photo.id));

		//controls
		a.likesAction = bind(this.likeAct, a);
		a.setViewLikes = bind(this.setViewLikes, a);


		a.likesControl = a.find(".timeline_likes_ico_0");
		a.likesControl.click(function(e) { a.likesAction(1); return cancelEvent(e); });

		a.setViewLikes();

		//comments count
		a.commentsControl = a.find(".timeline_comments_ico");
		a.commentsControl.find(".timeline_comments_label").text(NformatMin(a.commentsCount));
		a.commentsControl.click(bind(function() {

			aup.controller.navigateTo(aup.links.getPhotoLink(a.photo_id, true));
			},a));


		//add links
		addIntelloLinks(a);

		return a;
	},



	setViewLikes: function()
	{
        if (aup.auth.status)
        {
            var wL = this.wasVote;
        }else{
            var wL = 0;
        }

        this.likesControl.removeClass().addClass("timeline_likes_ico_"+wL);
		this.likesControl.find(".timeline_likes_label").text(NformatMin(this.likesCount));
	},

	likeAct: function(_vote)
	{
        if (!aup.auth.status)
        {
            aup.loginMenus.showLoginMenu();
            return false;
        }


		if (this.wasVote == 1)
			this.likesCount--;

		if (this.wasVote == _vote)
		{
			this.wasVote = 0;
		}else{
			this.wasVote = _vote;
            this.likesCount++;
		}
		this.setViewLikes();
		aup.actions.likes.likePhoto(this.photo_id, this.wasVote, "LIKE_TIMELINE");
	},


	createLike: function(_resp)
	{
		var user = _resp.user;
		if ((this.userObject) && (!user))
			user = this.userObject;

		var a = this.templateLike.clone();
		setFCK_FF_BKy(a.find(".timeline_v_plate"), -21);

        a.eType = "like";
		a.parent = this;
		a.timeshtamp = _resp.timestamp*1000;
		a.uid = user.id;

		//set time
		a.timeShtampLCD = a.find(".timeline_timeshtamp");
		a.timeShtampLCD.text(getTimeFormatedTl(_resp.timestamp*1000));

        a.user = user;

		//title
		a.titleLCD = $(a).find( ".timeline_header_text_cont" );
		var storyName = "<a class='feed_author_name' style='font-size:16px' href='"+aup.links.getUserProfileLink(user.id)+"' >"+user.name+"</a><br/>";
		storyName = storyName + "<span style='font-size:15px;'>liked "+_resp.photos.length;
		if (_resp.photos.length>1)
			storyName = storyName + " photos"
		else
			storyName = storyName + " photo";
		storyName = storyName + "</span>";
		a.titleLCD.html(storyName);

		//avatar image
		a.avatarLCD = $(a).find( ".timeline_header_avatar_img" );
        if (user.photo)
        {
            $(a).find( ".timeline_header_avatar").css({ 'background-image':'none'});
            setImageOnload(a.avatarLCD, user.photo['i106x106']);
        }else{
            a.avatarLCD.css({ visibility: 'hidden'});
        }


		//profile link
		a.avatarLCD_link = $(a).find( ".timeline_a_ava_holder" );
		a.avatarLCD_link.attr('href', aup.links.getUserProfileLink(user.id));
		a.paginL = $(a).find( ".timeline_elem_pagin_l" );
		a.paginL.click(function () { a.slidePage(-1); });
		a.paginR = $(a).find( ".timeline_elem_pagin_r" );
		a.paginR.click(function () { a.slidePage(1); });
		a.pageInd = $(a).find( ".timeline_elem_pagin_ind" );

		//animation variables
		a.animationTimer = new Timer(1000/38,30);
		a.animationTimer.onTimerEvent = bind(this.animationSlide, a);

		a.p0 = 0;
		a.p1 = 0;
		a.pC = 0;

		a.labelC = 0;

		a.curPage = 0;
		a.lastPage = 0;
		a.pageN = 6;

		//canvas etc.
		a.canvas = $(a).find( ".timeline_template_like_canvas" );
		a.addLikedImage = bind(this.addLikedImage,a);
		a.checkPaginState = bind(this.checkPaginState,a);
		a.slidePage = bind(this.slidePage,a);

		a.images = [];
		a.images_count = _resp.photos.length;
		a.pages = [];


		for (var i=0; i<_resp.photos.length; i++)
		{
            _resp.photos[i].Ncur = new Number(i);
			a.addLikedImage(_resp.photos[i], i);
		}

		a.checkPaginState();
		//add links
		addIntelloLinks(a);

		return a;
	},

    getPhotoPage : function()
    {
        var _arr = [];
        for (var i=0; i<this.parent.images.length; i++)
        {
            _arr.push({ photo : this.parent.images[i].response });
        }

        log("CURN = ["+this.N+"]");
        aup.pages.photo.imagesList.setContent(_arr, this.N);
    },

	addLikedImage: function(_resp, _N)
	{
		var a = this.parent.templateLikeSmall.clone();
		a.image = $(a).find( ".timeline_like_img" );
        //a.imageObj = _resp;
        setImageOnload(a.image,  _resp['i106x106'], a.find( ".timeline_template_like_img_cont" ));


		a.image_link = $(a).find( ".timeline_a_ava_holder" );

        a.site_url = aup.links.getPhotoLink(_resp.id);
        a.image_link.attr('href', a.site_url);
        a.image_link.click(bind(this.parent.getPhotoPage, a));
        a.parent = this;
        a.N = _resp.Ncur;
        a.response = _resp;
        a.photo_id = _resp.id;

		var _w = 397;
		var curP = null;
		if (this.images.length % this.pageN == 0)
		{
			var newPage = $(document.createElement("div"));
			newPage.addClass("timeline_template_like_page");
			newPage.css({ width : _w+'px'});
			this.canvas.append(newPage);
			this.pages.push(newPage);
		}
		curP = this.pages[this.pages.length-1];
		//add links
		//addIntelloLinks(a);

		if (((this.images.length % this.pageN) < Math.round(this.pageN*0.5)) && (this.images_count>Math.round(this.pageN*0.5)))
		{
			a.css({ 'margin-bottom' : 15 + 'px'});
		}

		curP.append(a);
		this.images.push(a);
	},


	slidePage: function(_a)
	{
		if ((_a>0) && (this.curPage == this.lastPage))
			return false;
		if ((_a<0) && (this.curPage == 0))
			return false;

		if (Math.abs(this.pages[this.curPage+_a].position().left - this.pC)>800)
			return false;

		this.curPage = this.curPage + _a;
		this.p0 = this.pC;
		this.p1 = this.pages[this.curPage].position().left;

		if (this.pageInd.css('display') != 'block')
		{
			setAlpha(this.pageInd, 0);
			this.pageInd.css({ display : 'block' });
		}

		var s1 =  (this.curPage*this.pageN+1);
		var s2 = Math.min( (this.curPage+1)*this.pageN, this.images_count);
		var str = "";
		if (s1==s2)
		{
			str = s1;
		}else{
			str = s1+" - "+s2;
		}
		this.pageInd.find(".timeline_elem_pagin_ind_label").text(str);

		this.animationTimer.reset();
		this.animationTimer.start();
		this.checkPaginState();
	},

	animationSlide: function(e)
	{
		var A = e.currentCount/e.repeatCount;
		//var B = (Math.sin(Math.PI*(A-0.5))+1)*0.5;

		//A1 - for movement
		var dA1 = 0.3;
		var A1 = A/(1-dA1);
		if (A1>1)
			A1 = 1;

		var dA = 0.3;
		var dY = 0.06;
		if (A1<1-dA1)
		{
			var arg = A1/(1-dA1);
			var B = Math.sin(Math.PI*0.5*arg)*(1+dY);
		}else{
			//var arg = (A-1+dA)/dA;
			//var B = 1 + (Math.cos(Math.PI*arg)+1)*0.5*dY;
			var arg = (A1-1+dA)/dA1;
			var B = 1 + Math.cos(1*Math.PI*arg)*dY*(1-arg);
		}
		//var B = Math.sin(Math.PI*A*0.5);
		this.pC = (1-B)*this.p0 + B*this.p1;


		//C for label
		var dC = 0.1;
		C = this.labelC;
		if (A<dC)
		{
			C = C + 1/(e.repeatCount*dC);
		}else if (A>1-dC)
		{
			C = C - 1/(e.repeatCount*dC);
		}
		C = Math.min(C,1);
		C = Math.max(C,0);

		this.labelC = C;
		setAlpha(this.pageInd, this.labelC);
		this.canvas.css({ left : -this.pC + 'px'});

		if (e.currentCount == e.repeatCount)
		{
			this.pageInd.css({ display : 'none' });
		}
	},

	checkPaginState: function()
	{
		this.lastPage = Math.ceil(this.images.length/this.pageN);
		if (this.images.length/this.pageN-this.lastPage > 0)
			this.lastPage++;

		if (this.images.length<=this.pageN)
		{
			this.paginL.css({display : 'none'});
			this.paginR.css({display : 'none'});
		}else{
			this.paginL.css({display : 'block'});
			this.paginR.css({display : 'block'});

			//hide pagings of page
			if (this.curPage==0)
				this.paginL.css({display : 'none'});

			//get last page
			if (this.curPage == this.lastPage-1)
				this.paginR.css({display : 'none'});
		}
	},


	createFollow: function(_resp)
	{
		var user = _resp.user;
		if ((this.userObject) && (!user))
			user = this.userObject;

		var a = this.templateFollow.clone();
		setFCK_FF_BKy(a.find(".timeline_v_plate"), -21);

        a.eType = "follow";
		a.parent = this;
		a.timeshtamp = _resp.timestamp*1000;
		a.uid = user.id;

		//set time
		a.timeShtampLCD = a.find(".timeline_timeshtamp");
		a.timeShtampLCD.text(getTimeFormatedTl(_resp.timestamp*1000));

		//title
		a.titleLCD = $(a).find( ".timeline_header_text_cont" );
		var storyName = "<a class='feed_author_name' style='font-size:16px' href='"+aup.links.getUserProfileLink(user.id)+"' >"+user.name+"</a><br/>";
		storyName = storyName + "<span style='font-size:15px;'>subscribed to</span>";
		a.titleLCD.html(storyName);

		//avatar image
		a.avatarLCD = $(a).find( ".timeline_header_avatar_img" );
        if (user.photo)
        {
            $(a).find( ".timeline_header_avatar").css({ 'background-image':'none'});
            setImageOnload(a.avatarLCD, user.photo['i106x106']);
        }else{
            a.avatarLCD.css({ visibility: 'hidden'});
        }

		//profile link
		a.avatarLCD_link = $(a).find( ".timeline_a_ava_holder" );
		a.avatarLCD_link.attr('href', aup.links.getUserProfileLink(user.id));
		a.paginL = $(a).find( ".timeline_elem_pagin_l" );
		a.paginL.click(function () { a.slidePage(-1); });
		a.paginR = $(a).find( ".timeline_elem_pagin_r" );
		a.paginR.click(function () { a.slidePage(1); });
		a.pageInd = $(a).find( ".timeline_elem_pagin_ind" );

		//animation variables
		a.animationTimer = new Timer(1000/38,30);
		a.animationTimer.onTimerEvent = bind(this.animationSlide, a);

		a.p0 = 0;
		a.p1 = 0;
		a.pC = 0;
		a.labelC = 0;
		a.curPage = 0;
		a.lastPage = 0;
		a.pageN = 3;

		//canvas etc.
		a.canvas = $(a).find( ".timeline_template_follow_canvas" );
		a.addFollowedUser = bind(this.addFollowedUser,a);
		a.checkPaginState = bind(this.checkPaginState,a);
		a.slidePage = bind(this.slidePage,a);
		a.images = [];
		a.images_count = _resp.users.length;
		a.pages = [];

		for (var i=0; i<_resp.users.length; i++)
		{
			a.addFollowedUser(_resp.users[i]);
		}

		a.checkPaginState();
		//add links
		addIntelloLinks(a);

		return a;
	},

	addFollowedUser: function(_resp)
	{
		var a = this.parent.templateFollowSmall.clone();
		a.image = $(a).find( ".timeline_template_follow_ava" );

		if (_resp.photo)
            setImageOnload(a.image, _resp.photo['i106x106'])
        else
            setImageOnload(a.image, "/gui/profile_no_ava72.jpg?aup16");


		a.image_link = $(a).find( ".timeline_a_ava_holder" );
		a.image_link.attr('href', aup.links.getUserProfileLink(_resp.id));

		a.name_label = $(a).find( ".timeline_template_follow_label" );
		a.name_label.html("<a class='feed_author_name' style='font-size:16px' href='"+aup.links.getUserProfileLink(_resp.id)+"'>"+_resp.name+"</a>");

		var _w = 397;
		var curP = null;
		if (this.images.length % 3 == 0)
		{
			var newPage = $(document.createElement("div"));
			newPage.addClass("timeline_template_follow_page");
			newPage.css({ width : _w+'px'});
			this.canvas.append(newPage);
			this.pages.push(newPage);
		}
		curP = this.pages[this.pages.length-1];

		curP.append(a);
		this.images.push(a);
	},

	createStory: function(_resp)
	{
		var user = _resp.user;
		if ((this.userObject) && (!user))
			user = this.userObject;

		var a = this.templateStory.clone();
		setFCK_FF_BKy(a.find(".timeline_v_plate"), -60);

        a.eType = "story";
		a.parent = this;
		a.timeshtamp = _resp.timestamp*1000;
		a.uid = user.id;

		//set time
		a.timeShtampLCD = a.find(".timeline_timeshtamp");
		a.timeShtampLCD.text(getTimeFormatedTl(_resp.timestamp*1000));

		//title
		a.titleLCD = $(a).find( ".timeline_header_text_cont" );
		var storyName = getTrimmedTextToSize(_resp.story.name,20,279,true);
		var storyLink = aup.links.getScenarioLink(_resp.story.id);
		
		storyName = "<a class='tl_theme_text' style='font-size:16px;font-weight:bold;' href='"+storyLink+"'>"+storyName+"</a><br/>";
		storyName = storyName + "by <a class='feed_author_name' style='font-size:16px' href='"+aup.links.getUserProfileLink(user.id)+"' >"+user.name+"</a>";
		a.titleLCD.html(storyName);
		
		//avatar image
		a.avatarLCD = $(a).find( ".timeline_header_avatar_img" );

		if (user.photo)
        {
            $(a).find( ".timeline_header_avatar").css({ 'background-image':'none'});
            setImageOnload(a.avatarLCD, user.photo['i106x106']);
        }else{
            a.avatarLCD.css({ visibility: 'hidden'});
        }


		//profile link
		a.avatarLCD_link = $(a).find( ".timeline_a_ava_holder" );
		a.avatarLCD_link.attr('href', aup.links.getUserProfileLink(user.uid));
		
			
		//photo
		a.photo = $(a).find( ".timeline_template_story_img" );
        setImageOnload(a.photo, _resp.story['i480x120'], $(a).find( ".timeline_template_storybody" ));
		
		//image link
		a.photo_link = $(a).find( ".timeline_a_image_holder" );
		a.photo_link.attr('href', storyLink);
		
		//add links
		addIntelloLinks(a);
		
		return a;
	},
	
	
	
	onError: function(response)
	{
		var status = response['status'];
		log("aup/timeline_prot : error status = ["+status+"]");
		this.loading = false;
		if (status!=0)
		{
			this.loadElements();
		}
		//aup.controller.showErrorPage();
	},
	
	scrollEvent: function(e)
	{
		if (!this.active)
			return false;
			
		var sensitivity = 800;

        if (!this.initLoad && (this.curTotal>0))
		if ( getScrollTop() + aup.screenH - $(document).height() > -sensitivity )
		{
			//log("end");	
			this.loadElements();
		}
	},



    rebuildTimeline : function (_removedList, _restoreParams)
    {
        var curI = 0;
        log("------------------------");
        log("START REBUILD!");
        log("REMOVE ELEMENTS!");
        this.restoreParams = _restoreParams;

        var removedElems = 0;
        var removedHBefore = 0;
        var removedH = 0;
        while (curI<this.pages[0].elements.length)
        {
            var needDel = false;
            var curElem = this.pages[0].elements[curI];
            if (curElem.eType == "like")
            {
                //check likes
                var i=0;
                var removedLikes = 0;
                while (i<curElem.images.length)
                {
                    if (_removedList.indexOf(curElem.images[i].photo_id)>-1)
                    {
                        curElem.images[i].remove();
                        curElem.images.splice(i,1);
                        removedLikes++;

                        var storyName = "<a class='feed_author_name' style='font-size:16px' href='"+aup.links.getUserProfileLink(curElem.user.id)+"' >"+curElem.user.name+"</a><br/>";
                        storyName = storyName + "<span style='font-size:15px;'>liked "+curElem.images.length;
                        if (curElem.images.length>1)
                            storyName = storyName + " photos"
                        else
                            storyName = storyName + " photo";
                        storyName = storyName + "</span>";
                        curElem.titleLCD.html(storyName);

                    }else{
                        i++;
                    }
                }


                //remove if no images
                if (curElem.images.length == 0)
                {
                    needDel = true;
                    log("REMOVE FROM TL LIKE");
                }else if (removedLikes>0){
                    //rebuild pages
                    log("REBUILD PAGES");
                    this.rebuildLikes(curElem);
                }
            }else if (curElem.eType == "photo")
            {
                if (_removedList.indexOf(curElem.photo_id)>-1)
                     needDel = true;
            }

            if (needDel)
            {
                removedElems++;
                log("REMOVE");
                if (curElem.positionTL<_restoreParams.scrollpos)
                    removedHBefore += curElem.outerHeight();
                removedH += curElem.outerHeight();
                curElem.remove();
                this.pages[0].elements.splice(curI,1);
            }else{
                curI++;
            }
        }
        log("DELT = ["+removedHBefore+"]");

        this.restoreParams.scrollpos = Math.max(0, this.restoreParams.scrollpos - removedHBefore);

        log("TS = ["+this.pages[0].elements[0].timeshtamp+"] LAST = ["+this.lasttimeshtamp+"]");
        if (this.pages[0].elements.length>0)
        if (this.displayLastVisit)
        if (this.lastVisitSetted)
        if (this.lasttimeshtamp>this.pages[0].elements[0].timeshtamp)
        {
            //remove lastVisitlie
            log("LAST VISIT REMOVED");

            this.templateLastvisit.detach();
        }

        this.offset = Math.max(0, this.offset - removedElems);
        if (this.usePosRecalAfterRebuild)
            this.curTotal = Math.max(0, this.curTotal - removedElems);


        //set timeout
        setTimeout(bind(this.rebuild2, this), 100);
    },

    rebuild2 : function()
    {
        if (this.showEvents)
        {
            this.notifiesObject.removeClass("timeline_float_right");
            this.notifiesObject.removeClass("timeline_float_left");
            if (Math.abs(this.curTotal-this.lastTotal) % 2 == 0)
            {
                this.notifiesObject.addClass("timeline_float_right");
            }else{
                this.notifiesObject.addClass("timeline_float_left");
            }
        }

        this.pages[0].startY = 0;
        this.pages[0].lastMargin = 0;


        for (var i=0; i<this.pages[0].elements.length;i++)
        {
            this.pages[0].elements[i].css({ 'margin-top' : 0+'px', display : 'none' });
        }

        for (var i=0; i<this.pages[0].elements.length;i++)
        {
            this.reappendBlock(this.pages[0].elements[i],this.pages[0], i);
        }

        window.scrollTo(0,this.restoreParams.scrollpos);
        aup.menu.setShadow(this.restoreParams.scrollpos);
    },



    reappendBlock: function(_b,_canvas, _n)
    {
        var prevYend = 0;
        if (_n>0)
        {
            var pos =_canvas.elements[_n-1].position();
            prevYend = pos.top;
        }



        _b.removeClass("timeline_float_left");
        _b.removeClass("timeline_float_right");

        if ( (Math.abs(this.curTotal-this.lastTotal) - _n) % 2 == 0)
        {
            _b.addClass("timeline_float_left");

            setFCK_FF_BKx(_b.find(".timeline_v_plate"), -20);
        }else{
            _b.addClass("timeline_float_right");

            setFCK_FF_BKx(_b.find(".timeline_v_plate"), 0);
        }

        _b.css({ display : '' });

        var posC = _b.position();


        if (_n == 0)
        {
            _canvas.startY = posC.top;
            var step = _canvas.actMargin;
        }else{
            var step = posC.top - prevYend - _canvas.lastMargin;
        }

        var marginH = 0;
        if (step < _canvas.actMargin)
        {
            marginH = Math.max(_canvas.actMargin - step,0);
            _b.css({ 'margin-top' : marginH+ 'px'});
        }
        _b.positionTL = posC.top + marginH;

        _canvas.lastMargin = marginH;
    },



    rebuildLikes: function(_elem)
    {
        for (var i=0; i<_elem.images.length; i++)
        {
            var curPage =  Math.floor(i/_elem.pageN);
            _elem.pages[curPage].append(_elem.images[i]);
        }

        var totalPages = _elem.pages.length;
        var maxPages = Math.ceil(_elem.images.length/_elem.pageN);
        if (totalPages>maxPages)
        {
            //remove pages
            log("remove pages >> N = ["+(totalPages-maxPages)+"]");
            while(_elem.pages.length>maxPages)
            {
                var a = _elem.pages.pop();
                a.remove();
            }
        }

        _elem.checkPaginState();
        _elem.slidePage(-_elem.curPage);
    },


	
	setNotifies: function(_offset)
	{
		
	},
	
	clearCanvas: function()
	{
		//remove pages
		while(this.pages.length>0)
		{
			var a = this.pages.pop();
			for (var i=0; i<a.elements.length; i++)
				a.elements[i].remove();
			a.remove();
		}
		//clear notif
		if (this.showEvents)
		{
			this.notifiesObject.removeClass("timeline_float_right");
			this.notifiesObject.removeClass("timeline_float_left");
			this.notifiesObject.remove();
		}
	}
}
}





