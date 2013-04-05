aup = {
	inited : false,


	photoObject : null,
	curPhotoId : 0,

	mainCanvas : null,
	image : null,
	likesLabel : null,
	commentsLabel : null,
	titleLabel : null,
	comments_block : null,

	imageLoadedb : false,
	commentsLoadedb : false,

	iphoneDownload : null,
	androidDownload : null,
	logoObject : null,
	wrapLine : null,
	sendButton : null,

	enter_input : null,
	notify_layer : null,
	nTimer : new Timer(1000/25, 10),
	rolloverState : {
		p0 : 0,
		p1 : 0,
		cP : 0
	},
	loading : false,

	domain : '',
	comments: [],


	downloadPage : null,
	photoPage : null,

	photoLoaded : false,

	showDownloadAndroid : true,
	andrCoockie : "disableAndroidshow",

	firstTime : true,

	// Language
	language : (navigator.language || navigator.systemLanguage || navigator.browserLanguage || navigator.userLanguage || 'en').substr(0, 2).toLowerCase(),

	onLoad: function (e)
	{


		var $body = $("body");

		if(this.language=="ru") {
			$body.toggleClass("aup-ru");
		} else if (this.language=="ko"){
			$body.toggleClass("aup-ko");
		} else {
			$body.toggleClass("aup-en");
		}

		if(browser.iphone) {
			$body.toggleClass("aup-iphone", true);
			if(browser.iosversion >= 6 && browser.safari && !browser.mchrome && !browser.opera && !browser.firefox) {
				$body.toggleClass("aup-iphone-6", true);
			}
		} else if (browser.android) {
			$body.toggleClass("aup-android", true);

		} else if(browser.wmobile || browser.symbian){
			$body.toggleClass("aup-other", true);
		}

		$(".app-bar-close").click(function (e) {
			$(this).parents(".app-bar").slideUp(100);
		})





		var show1 = getCookie(this.andrCoockie);
		//show1 = !(show1 == "true");
		show1 = true;

		this.showDownloadAndroid = show1;

		//get photo id
		this.domain = window.location.hostname;

		this.maincanvas = $("#maincanvas");
		this.downloadPage = $("#download_page");
		this.downloadPage.downloadButton = $("#dn_iphone");
		this.downloadPage.downloadButton.click(function() { _gaq.push(['_trackEvent', 'Download', 'click_mobile', "DOWNLOAD_MAINPAGE"]); });

		this.photoPage = $("#photo_page");
		this.photoPage.downloadButton = $("#download_bar_iphone").find(".button_label");
		this.photoPage.downloadButton.click(function() {  _gaq.push(['_trackEvent', 'Download', 'click_mobile', "DOWNLOAD_PHOTO"]); });

		var q = getLinkNormolized();

		var params = q.split("/");

		console.debug("PARAMS!: ", params);

		this.curPhotoId = parseInt(params[1]);


		window.addEventListener("orientationchange", bind(this.changeSize, this));
		window.addEventListener("resize", bind(this.changeSize, this));

		if (params[0].toLowerCase() == "aup")
		{
			if (params[1] == "signup_confirmed")
			{
				img = $("#fr");

				if (params.length>2)
				{
					var id = getCookie("id");
					var token = getCookie("token");
				}else{
					var id = params[2];
					var token = params[3];
				}


				img.attr("src", "weheartpics://auth/signup/"+id+"/"+token+"/");

			}


			if (params[1] == "signup_confirmed")
			{
				img = $("#fr");

				if (params.length>2)
				{
					var id = getCookie("uid");
					var token = getCookie("token");
				}else{
					var id = params[2];
					var token = params[3];
				}

				img.attr("src", "weheartpics://auth/signup/"+id+"/"+token+"/");

			}

			if (params[1] == "changepass")
			{
				img = $("#fr");

				var id = getCookie("uid");
				var token = getCookie("token");

				var code = params[2];
				var login = params[3];

				img.attr("src", "weheartpics://auth/changepass/"+id+"/"+token+"/"+code+"/"+login+"/");

			}



			if (params[1] == "signup_confirm_failed")
			{
				var nW = Math.max($(window).width(), 640);
				this.maincanvas.css( {width : nW });

				this.maincanvas.css( { display : ''} );

				var nH = Math.max($(window).height(), 900);
				this.maincanvas.css( {height : nH });

				this.maincanvas.css( { display : ''} );

				this.errorPage = $("#error_page");
				this.errorPic = $("#photo_page_code");



				//this.errorPage.css( { width : 100 });
				this.errorPage.css({ display :""});
				this.errorPic.attr("src", "/gui/failman_5.png");

				// window.scrollTo(0, 1);
				return false;
			}

			if (params[1] == "password_reset_failed")
			{
				var nW = Math.max($(window).width(), 640);
				this.maincanvas.css( {width : nW });

				this.maincanvas.css( { display : ''} );

				var nH = Math.max($(window).height(), 900);
				this.maincanvas.css( {height : nH });

				this.maincanvas.css( { display : ''} );

				this.errorPage = $("#error_page");
				this.errorPic = $("#photo_page_code");


				//this.errorPage.css( { width : 100 });
				this.errorPage.css({ display :""});
				this.errorPic.attr("src", "/gui/failman_4.png");


				// window.scrollTo(0, 1);
				return false;
			}
		}




		if (isNaN(this.curPhotoId) || (params[0].toLowerCase()!="photo"))
		{
			var nW = Math.max($(window).width(), 640);
			this.maincanvas.css( {width : nW });

			this.maincanvas.css( { display : ''} );

			var nH = Math.max($(window).height(), 900);
			this.maincanvas.css( {height : nH });
			this.downloadPage.css( { height: (nH-60), display : '', overflow : 'hidden'} );



			this.reRenderDownloadPage();


			this.scrollTimeout = setTimeout(bind(this.scrollMenu, this), 150);


			this.enter_input = $("#timeline_empty_mail_enter2");
			this.enter_input.click(bind(function() {
				if (this.parent.firstTime)
				{
					this.val("");
					this.parent.firstTime = false;
				}
			}, this.enter_input));
			this.enter_input.parent = this;

			this.sendButton = $("#download_android_button2");
			this.sendButton.click(bind(this.sendData, this));

			return false;
		}


		this.wrapLine = $(".wrapper_line");
		this.wrapLine.css({ display : 'none'});


		this.image = $("#main_image");
		this.likesLabel = $("#likesLabel");
		this.commentsLabel = $("#commentsLabel");
		this.titleLabel = $("#title_block");
		this.comments_block = $("#comments_block");

		this.commentTemplate = $("#comment_template").clone();
		this.commentTemplate.removeAttr("id");

		this.enter_input = $("#timeline_empty_mail_enter");
		this.enter_input.click(bind(function() {
			if (this.parent.firstTime)
			{
				this.val("");
				this.parent.firstTime = false;
			}
		}, this.enter_input));
		this.enter_input.parent = this;
		this.notify_layer = $("#notify_layer");
		this.notify_layer.css({ height : 0, display : 'none'});
		this.nTimer.onTimerEvent = bind(this.onNTimerEvent, this);

		this.iphoneDownload = $("#download_bar_iphone");
		this.androidDownload = $("#download_bar_android");
		this.androidDownload.click(bind(this.showNotifyLayer, this));

		this.sendButton = $("#download_android_button");
		this.sendButton.click(bind(this.sendData, this));

		this.logoObject = $("#logo_img");

		this.loadPhoto( this.curPhotoId );

	},

	loadPhoto : function(_id)
	{
		$.ajax({
			url: "http://"+this.domain+"/api/photo/",
			data : {  r : Math.random(), photo : _id  },
			timeout: 30000,
			success:bind(this.onData, this),
			error:bind(this.onError, this)
		});
	},

	onError: function(response)
	{
	},

	onData:function (response)
	{
		var resp = getObjectJson(response);
		if (resp.error) {

			var nW = Math.max($(window).width(), 640);
			this.maincanvas.css( {width : nW });

			this.maincanvas.css( { display : ''} );

			var nH = Math.max($(window).height(), 1134);
			this.maincanvas.css( {height : nH });
			this.downloadPage.css( { height: (nH-60), display : '', overflow : 'hidden'} );

			this.reRenderDownloadPage();

			this.scrollTimeout = setTimeout(bind(this.scrollMenu, this), 150);


			this.enter_input = $("#timeline_empty_mail_enter2");
			this.enter_input.click(bind(function() {
				if (this.parent.firstTime)
				{
					this.val("");
					this.parent.firstTime = false;
				}
			}, this.enter_input));
			this.enter_input.parent = this;

			this.sendButton = $("#download_android_button2");
			this.sendButton.click(bind(this.sendData, this));
			return false;
		}
		this.photoObject = resp;

		var func = bind(this.imageLoaded, this);


		this.image.load(function() {
			func();
		});
		this.image.attr({ src : this.photoObject.photo['i640x640']});

		if (this.image.get()[0].complete)
		{
			func();
		}
	},

	reRenderDownloadPage : function(){
		var $img = $(".app-img"),
			$link = $(".app-link");

		if(browser.iphone) {
			if(this.language=="ru") {
				$img.attr("src", "/mobile/gui/bg-iphone_ru.jpg");
			} else if (this.language=="ko"){
				$img.attr("src", "/mobile/gui/bg-iphone_ko.jpg");
			}
		} else if (browser.android) {
			$link.attr("href", "https://play.google.com/store/apps/details?id=com.weheartpics");

			if(this.language=="ru") {
				$img.attr("src", "/mobile/gui/bg-android_ru.jpg");
			} else if (this.language=="ko"){
				$img.attr("src", "/mobile/gui/bg-android_ko.jpg");
			} else {
				$img.attr("src", "/mobile/gui/bg-android_en.jpg");
			}
		}
	},

	getStoryName : function (resp)
	{
		var storyName = "";
		if (resp)
		{
			if (resp.type=="STORY")
			{
				storyName = resp.name;
			}else if (resp.type == "PRIVATE")
			{
				storyName = "Private photo";
			}else if (resp.type == "TIMELINE")
			{
				storyName = "Snapshot";
			}else if (resp.type == "DAILY")
			{
				storyName = resp.name;
			}else if (resp.type == "USERSTORY")
			{
				storyName = resp.name;
			}else if (resp.type == "UNSORTED")
			{
				storyName = resp.name;
			}
		}else{
			storyName = "Other";
		}
		return storyName;
	},

	imageLoaded:function(e)
	{
		if (this.imageLoadedb)
			return false;


		this.image.attr({ src : this.photoObject.photo['i640x640']});

		this.likesLabel.html(this.photoObject.photo.like);
		this.commentsLabel.html(this.photoObject.photo.comments_count);
		this.imageLoadedb = true;

		this.titleLabel.html("<span class='title_label'><b>"+this.getStoryName(this.photoObject.photo.story)+"</b><br/> by <span class='story_text'>"+this.photoObject.photo.user.name+"</span></span>");

		this.loadComments( this.curPhotoId );
	},


	loadComments : function(_id)
	{
		$.ajax({
			url: "http://"+this.domain+"/api/photo/comments/",
			data : { r : Math.random(), photo : _id },
			timeout : aup.netTimeOut,
			success: bind(this.commentsLoaded, this),
			error: bind(this.onError, this)
		});
	},

	getComment : function(resp)
	{
		var el_div = this.commentTemplate.clone();
		el_div.textBody = $(el_div).find(".comment_body");
		el_div.timeStamp = $(el_div).find(".comment_time");
		el_div.userName = $(el_div).find(".comment_username");
		el_div.line = $(el_div).find(".comment_bottom_line");

		el_div.textBody.text( resp.text );
		el_div.timeStamp.text( getTimeFormated(parseInt(resp.date)*1000)+" ago" );
		el_div.userName.text( resp.user.name );

		return el_div;
	},

	commentsLoaded : function(response)
	{
		var resp = getObjectJson(response);
		if (resp.error) {

			return false;
		}
		log(resp);

		for (var i=0; i<resp.comments.list.length; i++)
		{
			var elem = this.getComment(resp.comments.list[i]);
			if (resp.comments.list[i].level == 1)
				elem.css({ 'margin-left' : '30px' });
			log(resp.comments.list[i]);
			this.comments_block.append(elem);
			this.comments.push(elem);
		}



		this.commentsLoadedb = true;
		this.maincanvas.css( { display : ''} );
		this.photoPage.css( { display : ''} );
		if (browser.iphone)
		{
			this.iphoneDownload.css({ 'display' : 'block'});
			this.scrollTimeout = setTimeout(bind(this.scrollMenu, this), 150);
		}else{
			if (browser.android)
			if (this.showDownloadAndroid)
				this.androidDownload.css({ display : 'block' });
		}


	},

	showNotifyLayer : function()
	{
		this.rolloverState.p0 = this.rolloverState.cP;
		this.rolloverState.p1 = 1.0;

		this.nTimer.start();
		this.notify_layer.css({display : "block"});
		this.androidDownload.css({ display : 'none'});
		this.wrapLine.css({ display : 'block'});
	},


	onNTimerEvent : function(e)
	{
		var A = e.currentCount/e.repeatCount;
		var B = 0.5*(1 + Math.sin(Math.PI*(A-0.5)));

		this.rolloverState.cP = (1-B)*this.rolloverState.p0 + B*this.rolloverState.p1;

		this.notify_layer.css({ height : this.rolloverState.cP*140 + 'px'});

		if (A==1.0)
		{
			if (this.rolloverState.cP == 0.0)
			{
				this.notify_layer.css({display : "none"});
				this.wrapLine.css({ display : 'none'});
			}else{
				//this.enter_input.focus();
			}
		}
	},

	scrollTimeout : -1,
	scrollMenu : function()
	{
		// window.scrollTo(0, 1);
		this.changeSize();
	},

	sendData : function()
	{
		var mailStr = this.enter_input.val();

		if (!validateEmail(mailStr) || this.loading)
		{
			alert("Please enter correct email!");
			return false;
		}


		this.loading = true;
		$.ajax({
			url: "http://"+this.domain+"/api/promo/",
			data : { r : Math.random(), email :  mailStr},
			timeout:aup.netTimeOut,
			success:bind(this.mailResp, this),
			error:bind(this.errorMail, this)
		});
	},

	mailResp : function(response)
	{
		alert("Your email has been sent!");
		this.loading = false;
		setCookie(this.andrCoockie, "true", 365);

		this.rolloverState.p0 = this.rolloverState.cP;
		this.rolloverState.p1 = 0.0;
		this.nTimer.reset();
		this.nTimer.start();
	},

	errorMail : function(response)
	{
		this.loading = false;
		alert("We failed! Please try again later!");
	},

	changeSize : function()
	{

		if (browser.iphone)
		{
			var nW = Math.max($(window).width(), 640);
			var nH = Math.max($(window).height(), 1134);
			var sw = 67;

			this.maincanvas.css( {height : nH-sw });
			this.downloadPage.css( { height: nH-sw,  overflow : 'hidden'} );

		}else{

			var nW = 640;
			var nH = Math.max($(window).height(), 900);
			this.maincanvas.css( {width : nW, height : nH, margin: "0 auto" });
			this.downloadPage.css( { height: nH, width: "100%", overflow : 'hidden'} );

		}

	}
}





