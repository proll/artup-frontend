aup.pages.photo = {
    urlStr:"photo", //temp name for error page
    title:"",
    rndEnable:true,
    inited:false,
    mainObject:null,


    curPageId:null,
    curPageObject:null,


    mainImage:null,

    commentsCont : null,
    commentTemplateId : "template_photobig_comment",
    commentTemplate : null,
    commentMargin : 20,

    defaultStep : -28,


    photoGetTry : 0,
    photoGetMaxTries : 30,

    scrollToComments : false,

    postCommentNow : false,


    imagesList : null,



    init:function () {
        this.mainObject = id$('photo');

        this.commentsCont = $(this.mainObject).find( ".photobig_comments_container" );
        this.commentTemplate = document.getElementById(this.commentTemplateId);
        this.commentTemplate.removeAttribute('id');





        this.mainImage = $(this.mainObject).find(".photobig_photo_container");
        this.mainImage.parent = this;
        this.mainImage.shadow = $(this.mainObject).find(".photobig_shadow");

        this.mainImage.authorLCD = $(this.mainObject).find(".photobig_author_name");
        this.mainImage.scenarioLCD = $(this.mainObject).find(".photobig_theme_text");




        this.mainImage.rollover_plate = $(this.mainObject).find(".photobig_slider");
        var a = this.mainImage.rollover_plate;
        a.parentObject = this;
        a.parent = this.mainImage;
        a.show = bind(function() { this.showPlate(1) }, this.mainImage.rollover_plate);
        a.hide = bind(function() { this.showPlate(-1) }, this.mainImage.rollover_plate);
        a.showPlate = bind(this.showPlate, this.mainImage.rollover_plate);
        a.showControls = bind(this.showControls, this.mainImage.rollover_plate);
        this.mainImage.controls_container_block = $(this.mainObject).find(".controls_container_block");
        a.timer = new Timer(1000/35, 9);
        a.labels = $(this.mainObject).find(".labels");
        a.labels_timer = new Timer(1000/35, 3);
        a.labels_timer.onTimerEvent = bind(this.controlsHider,this.mainImage.rollover_plate);
        a.hC = 0;
        a.h0 = 0;
        a.h1 = 0;

        a.timer.onTimerEvent = bind(this.plateRolloverEvent,   this.mainImage.rollover_plate);
        a.cP = 0.0;
        a.p0 = 0.0;
        a.p1 = 0.0;
        a.backward_button = $(this.mainObject).find(".photobig_backward");
        a.forward_button = $(this.mainObject).find(".photobig_forward");
        a.move_label = $(this.mainObject).find(".photobig_label");
        a.removeIco = $(this.mainObject).find(".remove_image_ico");

        this.mainImage.likeShadow = $(this.mainObject).find(".photobig_like_shadow");


        this.imagesList = new aup_photolist_prototype();
        this.imagesList.rollover_plate =  a;
        this.mainImage.infoCont = $(this.mainObject).find(".photobig_text_container");
        this.imagesList.parent = this;
        this.imagesList.init();



        this.mainImage.imageHolder = $(this.mainObject).find(".photobig_image_container");
        this.mainImage.image = null;
        this.mainImage.image_cont = $(this.mainObject).find(".photobig_image_container_0");


        var startL = this.defaultStep;
        var shareElems = $(this.mainObject).find(".photobig_share_elem");
        shareElems.css({right: startL + 'px'});

        this.mainImage.shareCont = $(this.mainObject).find(".photobig_share_buttons_cont");

        this.mainImage.share_pt = $(shareElems[2]);
        this.mainImage.share_pt_ico = $(this.mainObject).find(".photobig_share_pt_0");
        this.setRolloverElem( this.mainImage.share_pt);

        this.mainImage.share_tw = $(shareElems[1]);
        this.mainImage.share_tw_ico = $(this.mainObject).find(".photobig_share_tw_0");
        this.setRolloverElem( this.mainImage.share_tw);

        this.mainImage.share_fb = $(shareElems[0]);
        this.mainImage.share_fb_ico = $(this.mainObject).find(".photobig_share_fb_0");
        this.setRolloverElem( this.mainImage.share_fb);




        a.mouseleave(bind(
            function(e){
               //cancelEvent(e);
            }, this.mainImage.rollover_plate));
        a.mouseenter(bind(
            function(e){
               cancelEvent(e);
            }, this.mainImage.rollover_plate));




        this.mainImage.controls_container_block.mouseleave(bind(
            function(e){
                if (this.parent.imagesList.active)
                    this.rollover_plate.showPlate(-1);

            }, this.mainImage));
        this.mainImage.controls_container_block.mouseenter(bind(
            function(e){
                if ((this.parent.imagesList.active) && (this.parent.imagesList.elements.length>1))
                    this.rollover_plate.showPlate(1);

            }, this.mainImage));



        this.mainImage.like_button = $(this.mainObject).find(".photobig_likes_0");
        this.mainImage.like_button.click( bind(this.clickLike, this));
        this.mainImage.like_button_label = $(this.mainObject).find(".photobig_likes_label");
        if (browser.firefox)
            this.mainImage.like_button_label.css({ left : 2+'px', top: 23+'px'});
        this.mainImage.setViewLikes = bind(this.setViewLikes, this);



        this.share.parent = this;
        this.comments.parent = this;
        this.likeLists.parent = this;
        this.removePhoto.parent = this;

        this.share.init();
        this.comments.init();
        this.likeLists.init();
        this.removePhoto.init();


        addIntelloLinks(this.mainImage);

        this.inited = true;
    },




    show:function (_q) {

        //_q - query string
        var q = _q;
        if (!q)
            q = "/";
        var params = q.split("/");
        var pageId = parseInt(params[0]);
        if (isNaN(pageId)) {
            log("aup/pages/photo : parametres error");
            this.curPageId = null;
            aup.controller.showErrorPage(1);
            return false;
        }


        //scrollTo comments
        this.scrollToComments = false;
        if (params.length > 1) {
            if (params[1].toLowerCase() == "comments")
                this.scrollToComments = true;
        }

        log("Scroll to comments = ["+this.scrollToComments+"]");


        this.curPageId = pageId;
        this.curPageObject = null;

        this.comments.clearComments();


        this.share.resetShare();


        this.imagesList.checkDisplay();

        this.removePhoto.checkButtonVisibility();
        this.getPicture();
        aup.pages.photo.setHearts();

        $('#photobackbutton').css({ visibility: aup.controller.history.length > 0 ? 'visible' : 'hidden'});

    },

    hide : function()
    {
        $('#photobackbutton').css({ visibility: 'hidden'});
        this.imagesList.clear();
    },

    createNewImage : function()
    {
        if (this.mainImage.image!=null)
        {
            this.mainImage.image.removeAttr("src");
            this.mainImage.image.remove();
        }

        this.mainImage.image = $(document.createElement("img"));
        setClass(this.mainImage.image, "photobig_image");
        this.mainImage.imageHolder.append(this.mainImage.image);
        this.mainImage.image.css({ visibility: 'hidden'});
    },

    getPicture:function (_NOTresetShare, _N) {
        if (!_NOTresetShare)
            this.mainImage.shareCont.css({display : 'none'});

        setClass(this.mainImage.image_cont, "photobig_image_container_0");
        //this.createNewImage();

        //clear
        this.mainImage.infoCont.css({ visibility : 'hidden'});
        this.mainImage.likeShadow.css({ visibility : 'hidden'});


        var Ncur = new Number(this.curPageId);
        if (typeof(Ncur) == 'undefined')
            Ncur = this.imagesList.position;

        this.removePhoto.checkButtonVisibility();

        $('#photobackbutton').css({ visibility: aup.controller.history.length > 0 ? 'visible' : 'hidden'});

        var self = this;
        $.ajax({
            url:aup.netcalls.photoInfoCall,
            data : { r : Math.random(), photo : this.curPageId },
            timeout:aup.netTimeOut,
            dataType: "json",
            success: function (e) {
                console.debug("API/PHOTO1111", e);
                self.onData(e, Ncur)
            },
            error: bind(this.onError, this)
        });
    },

    onError: function(response)
    {
        var status = response['status'];
        log("aup/timeline_prot : error status = ["+status+"]");
        this.loading = false;
        if (status!=0)
        {
            this.photoGetTry++;
            if (this.photoGetTry >= this.photoGetMaxTries)
            {
                aup.controller.showErrorPage(1);
                return false;
            }else{
                setTimeout(bind(this.getPicture,this), 1000*3.0);
            }
        }else{
            aup.controller.showErrorPage();
        }
        //
    },

    setTitle : function()
    {
        this.title = this.getStoryName(this.curPageObject.photo.story)+" by "+this.curPageObject.photo.user.name;
        aup.controller.setTitle();

    },

    onData:function (response, Ncur)
    {
        console.debug("API/PHOTO!!!", response);

        if (!this.active)
            return false;

        this.photoGetTry = 0;
        aup.controller.scrollToPos(0,0);
        var resp = getObjectJson(response);
        if (resp.error) {
            log("aup/pages/photo : got picture error = [" + resp.error.code + "]");
            if (!aup.errors.hasNetError(resp)) {
                aup.controller.showErrorPage(1);
            }
            return false;
        }

        if (!resp.photo.user) {
            var self = this;
            $.ajax({
                url:aup.netcalls.photoInfoCall,
                data : { r : Math.random(), photo : resp.photo.id },
                timeout:aup.netTimeOut,
                dataType: "json",
                success: function (e) {
                    self.onData(e, Ncur)
                },
                error: bind(this.onError, this)
            });
            return false;
        }

       // this.curPageId = resp.photo.id;
        this.curPageObject = resp;

        this.setSizes();
        this.setImage(resp);
        this.mainImage.infoCont.css({ visibility : 'visible'});

        this.share.getNewShareButton();

        if (resp.photo.comments_count>0)
        {
            this.comments.getComments();
        }else{
            //no comments now!!
            log("NOCOMMETNS!");
            $(this.comments.newCommentContainer).css({ display : 'none' });
            this.comments.displayCommentBlock();
            this.comments.loadingComments = false;
            this.comments.lastParent = 0;
            this.comments.lastIndex = 0;
            this.comments.commentsTotal = 0;
            aup.pages.photo.setHearts();
            this.comments.setWrappers();
            this.comments.checkScrollToComments();
            //this.comments.comments.commentsCurrent = this.comments.commentsCurrent + this.comments.getCurrentRootComments(resp.comments.list);
            this.comments.displayCommentBlock();
        }


        this.likeLists.getLikesLists();

        this.removePhoto.checkButtonVisibility();

        aup.controller.showCanvas();

        if (resp.photo.comments_count==0)
        {
            this.comments.checkScrollToComments();
        }


        this.setTitle();
    },


    setSizes : function ()
    {
        var max_imageS = 810;
        var min_imageS = 512;

        var screenH = aup.screenHl;

        var screen_step = 140;
        var round_step = 12;
        var bottom_step = 70;

        var imageS = screenH - screen_step - round_step - bottom_step;
        imageS = Math.min(max_imageS, Math.max(min_imageS, imageS));


        this.mainImage.shadow.css({width : imageS+2*round_step + 'px', display : ''});
        this.mainImage.image_cont.css({width : imageS + 'px', height : imageS + 'px'});
        this.mainImage.css({ width : imageS+2*round_step + 'px', height : imageS + round_step + bottom_step+'px', display : ''});
    },


    loadImage : function(_id)
    {
        if (_id != this.curPageId)
            return false;

        setClass(this.mainImage.image_cont, "photobig_image_container_1");
        this.mainImage.image.attr('src', this.curPageObject.photo['i1000x1000']);
        this.mainImage.image.css({ visibility: 'visible'});
        this.mainImage.likeShadow.css({ visibility: 'visible'});
    },



    controlsHider : function(e)
    {
        var A = e.currentCount/e.repeatCount;

        this.hC = (1-A)*this.h0 + A*this.h1;
        setAlpha(this.labels, this.hC);
    },

    showControls : function(_a)
    {
        if (_a)
        {
            this.h0 = this.hC;
            this.h1 = 1.0;
        }else{
            this.h0 = this.hC;
            this.h1 = 0.0;
        }
        this.labels_timer.reset();
        this.labels_timer.start();
    },

    showPlate : function (_a)
    {
        this.p0 = this.cP;
        if (_a>0)
        {
            this.p1 = 1.0;
        }else{
            this.showControls(false);
            this.p1 = 0.0;
        }

        this.timer.reset();
        this.timer.start();
    },

    plateRolloverEvent : function(e)
    {
        var A = e.currentCount/e.repeatCount;
        if (this.p0<this.p1)
        {
            var B = Math.pow( Math.sin(Math.PI*0.5*A), 0.18);
        }else{
            var B = Math.sin(Math.PI*0.5*A);
        }


        this.cP = (1-B)*this.p0 + B*this.p1;

        this.css({ height : 64*this.cP + 'px'});


        if (A>0.5)
        {
            if (this.p0<this.p1)
            {
                if (this.h0>=this.h1)
                {
                    this.showControls(true);
                }
            }
        }else{
            if (this.p0>this.p1)
            {
                if (this.h0<=this.h1)
                {
                    this.showControls(false);
                }
            }
        }
    },


    setRolloverElem : function(_elem)
    {
        if (_elem.rolloverElem)
            return false;

        _elem.rolloverElem = {
            timer : new Timer(1000/30, 6),
            cP : 0,
            p0 : 0,
            p1 : 0
        }
        _elem.disableBack = false;
        _elem.letsMove = bind(this.shareButtonMove, _elem);
        _elem.rolloverElem.timer.onTimerEvent = bind(this.shareButtonEventRollover, _elem);
        _elem.shareButtonMove = bind(this.shareButtonMove, _elem);
        _elem.disableAndMove = bind(this.disableAndMove, _elem);
        _elem.resetPos = bind(this.resetPos, _elem);

        _elem.mouseover(bind(function() { this.shareButtonMove(1); }, _elem));
        _elem.mouseout(bind(function() { this.shareButtonMove(-1); }, _elem));

    },

    resetPos : function()
    {
        this.rolloverElem.cP = 0;
        this.css({ right:  aup.pages.photo.defaultStep + 'px'});
        this.disableBack = false;
    },

    disableAndMove : function()
    {
        this.shareButtonMove(1);
        this.disableBack = true;
    },

    shareButtonMove : function(_a)
    {
        if (this.disableBack && (this.rolloverElem.p1 == 1))
            return false;

        this.rolloverElem.p0 = this.rolloverElem.cP;
        if (_a>0)
        {
            this.rolloverElem.p1 = 1.0;
        }else{
            this.rolloverElem.p1 = 0.0;
        }
        this.rolloverElem.timer.reset();
        this.rolloverElem.timer.start();
    },

    shareButtonEventRollover : function(e)
    {
        var A = e.currentCount/e.repeatCount;
        var B = Math.sin(Math.PI*0.5*A);

        this.rolloverElem.cP = (1-B)*this.rolloverElem.p0 + B*this.rolloverElem.p1;
        this.css({ right: -this.rolloverElem.cP*18 + aup.pages.photo.defaultStep + 'px'});
    },

    getStoryName : function (resp)
    {
        var storyName = "";
        if (resp)
        {
            if (resp.type=="STORY")
            {
                storyName = resp.name;
                this.mainImage.shareCont.css({display : 'block'});
            }else if (resp.type == "PRIVATE")
            {
                storyName = "Private photo";
                this.mainImage.shareCont.css({display : 'none'});
            }else if (resp.type == "TIMELINE")
            {
                storyName = "Snapshot";
                this.mainImage.shareCont.css({display : 'block'});
            }else if (resp.type == "DAILY")
            {
                storyName = resp.name;
                this.mainImage.shareCont.css({display : 'block'});
            }else if (resp.type == "USERSTORY")
            {
                storyName = resp.name;
                this.mainImage.shareCont.css({display : 'block'});
            }else if (resp.type == "UNSORTED")
            {
                storyName = resp.name;
                this.mainImage.shareCont.css({display : 'block'});
            }
        }else{
            storyName = "Other";
        }
        return storyName;
    },

    setImage : function(_resp)
    {
        log("SetImage");
        log(_resp);
        this.mainImage.authorLCD.text(_resp.photo.user.name);
        this.mainImage.authorLCD.attr("href", aup.links.getUserProfileLink(_resp.photo.user.id));

        var timeS = this.mainImage.find(".photobig_timeshtamp");
        timeS.text(getTimeFormatedTl(_resp.photo.timestamp*1000));

        var caption = $(this.mainObject).find(".photobig_timeshtamp");
        var textCaption = $(this.mainObject).find(".timeline_caption_text_photo");
        if (_resp.photo.caption)
        {
            textCaption.text(_resp.photo.caption);
            textCaption.css({display :'block'});
        }else{
            textCaption.css({display :'none'});
        }

        var storyName = this.getStoryName(_resp.photo.story);
        if (_resp.photo.story.type == "PRIVATE")
        {
            this.mainImage.shareCont.css({display : 'none'});
        }else{
            this.mainImage.shareCont.css({display : 'block'});
        }

        this.mainImage.scenarioLCD.text(storyName);
        if (_resp.photo.story.type == "TIMELINE")
        {
            setClass(this.mainImage.scenarioLCD,"photobig_theme_text_na");
            this.mainImage.scenarioLCD.removeAttr("href");
        }else{
            setClass(this.mainImage.scenarioLCD,"photobig_theme_text");
            this.mainImage.scenarioLCD.attr("href", aup.links.getScenarioLink(_resp.photo.story.id));
        }

        this.mainImage.setViewLikes();

        setClass(this.mainImage.image_cont, "photobig_image_container_0");

        this.createNewImage();
        var _id = new Number(this.curPageId);
        setImageOnload(this.mainImage.image, _resp.photo['i1000x1000'], null, bind(function() { this.loadImage(_id); }, this));
    },

    clickLike: function()
    {
        if (!aup.auth.status)
        {
            aup.loginMenus.showLoginMenu();
            return false;
        }

        var wasVote = this.curPageObject.photo.wasvote;
        if (wasVote == 1)
            this.curPageObject.photo.like--;

        if (wasVote == 1)
        {
            wasVote = 0;
        }else{
            wasVote = 1;
            this.curPageObject.photo.like++;
        }
        this.curPageObject.photo.wasvote = wasVote;

        this.mainImage.setViewLikes();
        this.likeLists.setLikesMe();
        aup.actions.likes.likePhoto(this.curPageObject.photo.id, this.curPageObject.photo.wasvote, "LIKE_PHOTO");
    },

    setViewLikes: function()
    {
        var wasvote = 0;
        if (typeof(this.curPageObject.photo.wasvote) != 'undefined')
            wasvote = this.curPageObject.photo.wasvote;

        setClass(this.mainImage.like_button, "photobig_likes_"+wasvote);
        this.mainImage.like_button_label.text(NformatMin(this.curPageObject.photo.like));
    },

    setHearts : function ()
    {
        var hasComments = this.comments.commentsList.length > 0;

        var hasLikes = (this.likeLists.likes.length > 0);
        if (aup.pages.photo.curPageObject)
        if (aup.pages.photo.curPageObject.photo)
             hasLikes =  hasLikes || (aup.pages.photo.curPageObject.photo.wasvote!=0);

        var hasNewComment = (this.comments.newCommentContainer.style.display == 'block') && (this.comments.newCommentContainer.parentNode!=null);

        var commentsAre = hasNewComment || hasComments;
       // $(heartSplitters[0]).css( { display : 'block' });


        //new wrapper
        if (commentsAre)
            this.comments.addCommentCont.wrapper.css({ display : 'block'})
        else
            this.comments.addCommentCont.wrapper.css({ display : 'none'});

        //hearts
        var heartSplitters = $(aup.pages.photo.mainObject).find( ".heart_split_container" );
        if (hasLikes)
        {
            $(heartSplitters[1]).css( { display : 'block' });
        }else{
            $(heartSplitters[1]).css( { display : 'none' });
        }
    },



    ///share
    share : {
        shareTW : null,

        shareFBsubscribeAssgned : false,
        shareTWsubscribeAssgned : false,


        sharedFB : false,
        sharedTW : false,
        sharedPT : false,
        parent : null,

        sharePageId : 0,

        pTwindow : null,
        pTurlChecker : new Timer(100,0),

        resetShare : function ()
        {
            setClass(this.parent.mainImage.share_tw_ico, "photobig_share_tw_0");
            setClass(this.parent.mainImage.share_fb_ico, "photobig_share_fb_0");
            this.sharePageId = aup.pages.photo.curPageId;
            this.sharedFB = false;
            this.sharedTW = false;
            this.sharedPT = false;
            this.parent.mainImage.share_fb.resetPos();
            this.parent.mainImage.share_tw.resetPos();
        },

        onFBCallback : function (e)
        {
            if ((e) && (this.sharePageId == aup.pages.photo.curPageId))
            {
                this.sharedFB = true;
                this.parent.mainImage.share_fb.disableAndMove();
                setClass(this.parent.mainImage.share_fb_ico, "photobig_share_fb_1");

                aup.stats.trackShare("SHARE_FACEBOOK", aup.pages.photo.curPageId);
            }
            return true;
        },

        onTWCallback : function (e)
        {
            if (this.sharePageId == aup.pages.photo.curPageId)
            {
                this.sharedTW = true;
                this.parent.mainImage.share_tw.disableAndMove();
                setClass(this.parent.mainImage.share_tw_ico, "photobig_share_tw_1");

                aup.stats.trackShare("SHARE_TWITTER", aup.pages.photo.curPageId);
            }
            return true;
        },

        getStoryName : function (_resp)
        {
            var ret = _resp.story.name;
            if (_resp.story.type == "UNSORTED")
                ret = _resp.story.name;

            return ret;
        },

        getNewShareButton : function (e)
        {
            if (this.sharedTW)
                return false;

            var url = "http:" + aup.links.getPhotoLink(this.parent.curPageObject.photo.id);

            var p = [];
            p.push("[pic] ");//0
            if (this.parent.curPageObject.photo.caption)
            {
                p.push(this.parent.curPageObject.photo.caption+" - "); //1
            }else{
                p.push("");
            }
            p.push(this.getStoryName(this.parent.curPageObject.photo)+" ");//2
            if (this.parent.curPageObject.photo.user.tw_name)
            {
                p.push("by @"+ this.parent.curPageObject.photo.user.tw_name+" ");       //3
            }else{
                p.push("by "+ this.parent.curPageObject.photo.user.name+" ");
            }
            p.push(url); //4   +13 symbols
            p.push(" %23aup");       //5



            log("share ->  ["+p.join("").length+"] ["+p.join("")+"]");

            if (p.join("")>140)
            {
                p.splice(5,1);
                log("1* ["+p.join("").length+"] ["+p.join("")+"]");
                //aup
                if (p.join("")>140)
                {
                    //pic
                    p.splice(0,1);
                    log("1* ["+p.join("").length+"] ["+p.join("")+"]");
                    if (p.join("")>140)
                    {
                        //storyname
                        p.splice(1,1);
                        p[0] = p[0].substring(0, p[0].lastIndexOf(" - "));
                        log("1* ["+p.join("").length+"] ["+p.join("")+"]");
                        if (p.join("")>140)
                        {
                            //user
                            p.splice(1,1);
                            log("1* ["+p.join("").length+"] ["+p.join("")+"]");

                            if (p.join("")>140)
                            {
                                p[0] = p[0].substring(0, 140-p[1].length-4)+"... ";
                            }
                        }
                    }
                }
            }

            this.shareTW.href = "http://twitter.com/intent/tweet?text="+p.join("");
        },

        clickTW : function(e)
        {
            this.setShareEvents();


        },

        clickFB : function(e)
        {
            log("CLICK FB!");
            if (this.sharedFB)
                return false;

            var pic = this.parent.curPageObject.photo['i106x106'];
            var url = "http:"+aup.links.getPhotoLink(this.parent.curPageObject.photo.id);
            var storyName = this.parent.getStoryName(this.parent.curPageObject.photo.story);

            /*
            if (_resp.photo.story.type == "TIMELINE")
            {
                storyName = "Other";
            }else{
                storyName = _resp.photo.story.name;
            }*/

            FB.ui({
                method: "feed",
                display: "popup",
                link: url,
                name: storyName,
                caption: "WeHeartPics.com",
                description : "",
                actions: [
                    { name: 'Get WeHeartPics', link: aup.apple_store_link }
                ],
                picture: pic
            }, bind(this.onFBCallback, this));
        },


        clickPT : function(e)
        {
            if (this.sharedPT)
                return false;

            this.pTwindow = openWindow2("Create pin", 600, 420);
            this.pTurlChecker.start();

            var img = this.parent.curPageObject.photo['i1000x1000'];
            var url = "http://"+aup.links.getPhotoLink(this.parent.curPageObject.photo.id);
            var title = this.parent.getStoryName(this.parent.curPageObject.photo.story);


            var p = [];
            if (this.parent.curPageObject.photo.caption)
            {
                p.push(this.parent.curPageObject.photo.caption+" - "); //0
            }else{
                p.push("");
            }


            p.push(this.getStoryName(this.parent.curPageObject.photo)+" ");//1


            if (aup.auth.status)
            if (this.parent.curPageObject.photo.user.id != aup.auth.status.id)
            {
                p.push("by "+ this.parent.curPageObject.photo.user.name+" ");
            }


            if (this.parent.curPageObject.photo.story)
            {
                p.push(this.parent.curPageObject.photo.story.pinterest_hashtags+" ");
                if (this.parent.curPageObject.photo.story.storycat)
                    p.push(this.parent.curPageObject.photo.story.storycat.pinterest_hashtags);
            }else{
                p.push(this.parent.curPageObject.photo.story.pinterest_hashtags+" ");
            }
            p.push(" #GetWeHeartPics");       //5
            var desc = p.join("");
            while (desc.indexOf("#")>-1)
                desc = desc.replace("#","%23");


            var link = "http://pinterest.com/pin/create/bookmarklet/?media="+img+"&url="+url+"&title="+title+"&is_video=false&description="+desc;
            this.pTwindow.location = link;

            aup.stats.trackShare("SHARE_PINTEREST", aup.pages.photo.curPageId);
            //http://pinterest.com/pin/create/bookmarklet/

        },

        onPTCallback : function (e)
        {
            if (this.sharePageId == aup.pages.photo.curPageId)
            {
                this.sharedPT = true;
                this.parent.mainImage.share_tw.disableAndMove();
                setClass(this.parent.mainImage.share_tw_ico, "photobig_share_pt_1");
            }
            return true;
        },



        setShareEvents : function ()
        {
            if ((typeof(twttr) != 'undefined') && (!this.shareTWsubscribeAssgned))
            {
                twttr.events.bind('tweet', bind(this.onTWCallback,this));
                this.shareTWsubscribeAssgned = true;
            }
            if ((typeof(FB) != 'undefined') && (!this.shareFBsubscribeAssgned))
            {
                //FB.Event.subscribe('edge.create', bind(this.onFBCallback,this));
                this.shareFBsubscribeAssgned = true;
            }
        },

        ptChecker: function(e)
        {
            if (this.pTwindow)
            {
               // log("url = ["+this.pTwindow.location+"]");
            }else{
                e.target.reset();
            }
        },

        init : function()
        {
            this.shareTW = aup.pages.photo.mainImage.share_tw_ico.get()[0];
            this.shareTW.hasIntelloLinker = true;
            this.pTurlChecker.onTimerEvent = bind(this.ptChecker, this);
            this.setShareEvents();
        }
    },



    removePhoto : {
        icon : null,
        rWind : null,

        timer : new Timer(1000/30, 4),
        windA : {
            cP : 0,
            p0 : 0,
            p1 : 0,
            visible : false
        },

        parent : null,

        init : function()
        {
            this.icon = this.parent.mainImage.rollover_plate.removeIco;
            this.icon.click( bind(this.clickRemoveButton, this));


            this.rWind = $(this.parent.mainObject).find(".remove_window");
            setAlpha(this.rWind, 0);

            var buttons = this.rWind.find(".unfollow_button");

            this.rWind.yesButton = $(buttons[0]);
            this.rWind.yesButton.click(bind(this.yesClick, this));
            this.rWind.noButton = $(buttons[1]);
            this.rWind.noButton.click(bind(this.noClick, this));


            this.timer.onTimerEvent = bind(this.showHideTimer, this);
            this.checkButtonVisibility();
        },

        checkButtonVisibility : function()
        {
            var visible = this.chSmall();

            if (visible)
            {
                this.icon.css({display : 'block'});
            }else{
                this.icon.css({display : 'none'});
            }
        },

        chSmall : function ()
        {
            //return false;

            if (!aup.auth.status)
                return false;

            if (!this.parent.curPageObject)
                return false;

            if (aup.auth.status.id != this.parent.curPageObject.photo.user.id)
                return false;


            return true;
        },

        yesClick : function(e)
        {
            this.removePhoto();
            this.hide();

            return cancelEvent(e);
        },

        noClick : function(e)
        {
            this.hide();

            return cancelEvent(e);
        },

        showHideTimer : function(e)
        {
            var A = e.currentCount/e.repeatCount;


            this.windA.cP = (1-A)*this.windA.p0 + A*this.windA.p1;

            setAlpha(this.rWind, this.windA.cP);

            if (A == 1)
            {
                if (this.windA.cP == 0)
                    this.rWind.css({ display : 'none' });
            }
        },

        show : function()
        {
            if (!this.rWind)
                return false;

            if ( this.rWind.css('display') == 'none')
                this.rWind.css({ display : 'block' });

            this.windA.visible = true;

            this.windA.p0 = this.windA.cP;
            this.windA.p1 = 1.0;
            this.timer.reset();
            this.timer.start();
        },

        hide : function()
        {
            this.windA.visible = false;

            if (!this.rWind)
                return false;

            this.windA.p0 = this.windA.cP;
            this.windA.p1 = 0.0;
            this.timer.reset();
            this.timer.start();
        },

        clickRemoveButton : function(e)
        {
            if (!this.chSmall())
                return false;

            //showWind
            if (this.windA.visible)
                this.hide()
            else
                this.show();
        },

        removePhoto : function()
        {
            if (!this.chSmall())
                return false;



            var curPageId = this.parent.curPageObject.photo.id;

            //this.onData(null, curPageId);
            //return false;

            $.ajax({
                url:aup.netcalls.deletePhotoCall,
                data : { r : Math.random(), photo :  curPageId },
                timeout:aup.netTimeOut,
                success:bind(function (e) { this.onData(e, curPageId); }, this),
                error:bind(this.onError, this)
            });
        },

        moveto : function()
        {
            aup.controller.navigateTo(aup.links.getUserProfileLink(aup.auth.status.id));
            return false;
        },

        removePhotoList : function()
        {

            var lastPage = this.getPrevMainPage();
            var lastPopular = (lastPage.indexOf("popular") == 0);
            var il = this.parent.imagesList;

            log("----------------------");
            log("Get last not photo = ["+lastPage+"]");

            if (lastPopular)
            {
                log("1) POPULAR.LIST nextPhoto >");
                il.elements.splice(il.position,1);
                il.position = Math.min(il.elements.length-1,il.position);
                il.setPosition(0);

                return false;
            }

            if ((!il.userUrl) || (il.userUrl && (il.total<il.limit)))
            {
                log("PHOTO il.len = ["+il.elements.length+"]");
                log("2) NET.LIST+limited || NET.stack");
                if (il.elements.length <= 1)
                {
                    //last photo in stack was removed
                    this.stepBack();
                    //check
                }else{
                    //ok
                    il.elements.splice(il.position,1);
                    il.total--;
                    il.position = Math.min(il.elements.length-1,il.position);
                    //refresh photo
                    il.setPosition(0);
                }
                return false;
            }

            if (il.userUrl)
            {
                log("NET.LIST");

                il.elements.splice(il.position,1);
                il.total--;
                il.position = Math.min(il.elements.length-1,il.position);

                il.setPosition(0);
                return false;
            }

            log("OTHER");
            this.stepBack();

            //photo from timeline
            //unlimited net.stack



            log("----------------------");


        },

        stepBack : function()
        {
            aup.controller.afterRemoveBack = true;
            history.back();
        },

        getPrevMainPage : function()
        {
            var ret = null;
            var hist = aup.controller.history;

            for (var i = hist.length-1; i>=0; i--)
            {
                if (hist[i].url.indexOf("photo/")==-1)
                {
                    ret = hist[i].url;
                    break;
                }
            }

            return ret;
        },

        moveBack : function()
        {
            var hist = aup.controller.history;


            var retUrl = "";
            for (var i = hist.length-1; i>=0; i--)
            {
                if (hist[i].url.indexOf("photo/")==-1)
                {
                    retUrl = hist[i].url;
                    break;
                }
            }

            if (retUrl!="")
            {
                aup.controller.navigateTo(retUrl);
            }else{
                this.moveto();
            }
        },

        onData : function (response, removedId)
        {
            if (response)
            {
                var resp = getObjectJson(response);
                if (resp.error)
                {
                    if (!aup.errors.hasNetError(resp))
                    {
                        aup.controller.showErrorPage(1);
                    }
                    return false;
                }
            }

            aup.controller.removedList.push(removedId);


            var hist = aup.controller.history;

            //back to the main page if user opened only this photo
            if (hist.length == 0)
            {
                aup.controller.navigateTo("timeline");
                return false;
            }

            this.removePhotoList();
        },


        onError : function (response)
        {
            aup.controller.showErrorPage(1);
        }
    },




    comments : {
        commentsList : [],
        commentsTotal : 0,
        commentsCurrent : 0,
        charLimit : 1000,

        newCommentName : null,
        newCommentContainerId : "template_photobig_newcomment",
        newCommentContainer : null,
        newCommentTextInput : null,
        newCommentMessageCont : null,
        newCommentMessageWrapper : null,
        newCommentButtonOk : null,
        newCommentReply : null,
        newCommentTextInputC : null,


        loadingComments : false,

        loadingBar : null,


        addCommentCont : null,

        lastParent : 0,
        lastIndex : 0,

        inited : false,

        parent : null,


        getComments: function ()
        {
            this.loadingComments = true;

            $(this.newCommentContainer).css({ display : 'none' });

            var curId = new Number(this.parent.curPageId);
            $(aup.pages.photo.commentsCont).append(this.loadingBar);
            aup.actions.comments.getComments(aup.pages.photo.curPageId, bind(function (e) { if (curId == this.parent.curPageId) this.onData(e);}, this), bind(this.onErr, this));
            this.displayCommentBlock();
        },

        onErr : function(response)
        {
            this.loadingComments = false;
        },

        onData : function (response, status, xhr)
        {
            this.loadingComments = false;
            this.lastParent = 0;
            this.lastIndex = 0;
            var resp = getObjectJson(response);
            if (resp.error)
            {
                log("aup/pages/photo/comments : Err = ["+resp.error.code+"]");
                if (!aup.errors.hasNetError(resp))
                {
                    //aup.controller.showErrorPage();
                }
                return false;
            }

            this.loadingBar.detach();
            //positon delta
            var level1 = aup.pages.photo.commentMargin;
            this.commentsTotal = resp.comments.total;

            //set hearts

            aup.pages.photo.setHearts();


            var lastPr = 0;
            for (var i=0; i<resp.comments.list.length; i++)
            {
                var element_div = this.newComment(resp.comments.list[i]);
                if (element_div.level == 0)
                    this.lastParent = new Number(i);
                element_div.parentN = this.lastParent;
                element_div.index = parseInt(new Number(i));

                $(aup.pages.photo.commentsCont).append(element_div);
                this.commentsList.push(element_div);
            }

            aup.pages.photo.setHearts();
            this.setWrappers();
            this.commentsCurrent = this.commentsCurrent + this.getCurrentRootComments(resp.comments.list);



            this.checkScrollToComments();

            this.displayCommentBlock();

            if (this.commentsCurrent != this.commentsTotal)
            {
                //ther is another block of comments
            }else{
                //no more comments
            }
           // aup.resetH();
        },


        checkScrollToComments : function()
        {
            log("CHECK");
            if (aup.controller.visible)
            {
                log("VISIBLE");
                if (aup.pages.photo.scrollToComments)
                {
                    log("SCROLL");
                    var pos = $(this.addCommentCont).offset().top-86;
                    aup.smoothScrollTo(0, pos);
                }
                aup.pages.photo.scrollToComments = false;
            }

        },

        newComment : function (_comObj)
        {
            var element_div = $(aup.pages.photo.commentTemplate).clone();

            element_div.author = $(element_div).find( ".comment_username" );
            element_div.author.attr("href", aup.links.getUserProfileLink(_comObj.user.id));
            element_div.author.text(_comObj.user.name);

            element_div.timeShtamp = $(element_div).find( ".comment_info" );
            element_div.timeShtamp.text(getTimeFormated(parseInt(_comObj.date)*1000));

            element_div.commentBody = $(element_div).find( ".comment_body" );
            var mes = _comObj.text;
            while (mes.indexOf("<")>0)
                mes = mes.replace("<", "&lt;");
            while (mes.indexOf(">")>0)
                mes = mes.replace(">", "&gt;")



            element_div.commentBody.html(mes);
            element_div.commentBody.linkify();

            element_div.marginer = $(element_div).find( ".comments_container_marginer" );
            element_div.wrapper = $(element_div).find( ".line_wrapper" );

            element_div.comment_id = _comObj.id;
            element_div.level = _comObj.level;

            if (element_div.level != 0)
            {
                element_div.marginer.css( { 'margin-left' : aup.pages.photo.commentMargin} );
            }




            addIntelloLinks(element_div);
            return element_div;
        },

        getCurrentRootComments : function (_arr)
        {
            var ret = 0;
            if (!_arr)
                return -1;

            for (var i=0; i<_arr.length; i++)
            {
                if (_arr[i].level == 0)
                    ret++;
            }
            return ret;
        },
        clearComments : function ()
        {
            this.commentsTotal = 0;
            this.commentsCurrent = 0;
            while(this.commentsList.length>0)
            {
                var a = $(this.commentsList.pop());
                a.remove();
            }
            this.displayCommentBlock();
        },

        startPostComment : function (e)
        {
            if (!aup.auth.status)
            {
                aup.loginMenus.showLoginMenu();
                return false;
            }


            this.beginPost(null);
        },
        onCommentsSent : function (response)
        {
            var resp = getObjectJson(response);
            if (resp.error)
            {
                log("aup/pages/photo/comments : get post comment error = ["+resp.error.code+"]");
                if (!aup.errors.hasNetError(resp))
                {
                    //aup.controller.showErrorPage();
                }
                return false;
            }
            log("aup/pages/photo/comments : get comment ["+response+"]");
        },


        focusInput : function ()
        {
            this.newCommentTextInput.focus();
        },

        beginPost : function (_reply)
        {
            if (!aup.auth.status)
            {
                aup.loginMenus.showLoginMenu();
                return false;
            }

            var level1 = aup.pages.photo.commentMargin;
            var lastIndex = this.commentsList.length-1;
            if (_reply)
            {
                //get lastObject of comments block
                this.newCommentReply = _reply.comment_id;
                lastIndex = _reply.index.valueOf();

                var lI = lastIndex;
                if (_reply.level==0)
                    for (var i=lI+1; i < this.commentsList.length; i++)
                    {
                        if (this.commentsList[i].level == 1)
                            lI = i
                        else
                            break;
                    }
                lastIndex = lI;

                this.newCommentMessageMarginer.css({ 'margin-left' : level1 });
                this.setWrappers(	lastIndex, 1);
            }else{
                //root
                this.newCommentReply = null;
                this.newCommentMessageMarginer.css({ 'margin-left' : 0 });
                this.setWrappers(	lastIndex, 0);
            }
            $(this.newCommentContainer).css({ display : 'block' });
            this.newCommentTextInput.value = "";

            //this.newCommentUserName.innerHTML = aup.auth.userObject.name;
            this.commentOnKey();

            this.lastIndex = lastIndex;

            if (this.lastIndex>=0)
                $(this.newCommentContainer).insertAfter(this.commentsList[lastIndex])
            else
                $(aup.pages.photo.commentsCont).append(this.newCommentContainer);

            aup.pages.photo.setHearts();


            var s1 = $(document).scrollTop();
            var s2 = s1+aup.screenHl;

            var p1 = $(this.newCommentContainer).offset().top;
            var p2 = p1+$(this.newCommentContainer).height();

            if ((p1<s1) || (p1>s2) || (p2<s1) || (p2>s2))
            {
                newP = Math.max(0, p1-aup.screenHl*0.5);
                aup.smoothScrollTo( 0, newP, bind(this.focusInput, this));
            }else{
                this.newCommentTextInput.focus();
            }

            this.newCommentName.html(aup.auth.userObject.name+" :");
            this.newCommentName.attr('href', aup.links.getUserProfileLink(aup.auth.status.id));

            addIntelloLinks(this.newCommentContainer);

            //this.newCommentTextInput.focus();
        },

        commentOnKey : function (e)
        {
            var minH = 70;
            var charLimit = aup.pages.photo.comments.charLimit;
            var okButton = aup.pages.photo.comments.newCommentButtonOk;
            var input = aup.pages.photo.comments.newCommentTextInput;
            var inputC = aup.pages.photo.comments.newCommentTextInputC;
            var messageBox = aup.pages.photo.comments.newCommentMessageCont;
            var lengthI = input.value.length;
            var delt = charLimit - lengthI;

            //setHeight
            input.style.height = "auto";
            var h = input.scrollHeight;
            if (h<minH)
                h = minH;
            h = h + 20;
            input.style.height = h+'px';
            inputC.style.height = h+'px';


            if (delt<100)
                messageBox.style.visibility = "visible";
            else
                messageBox.style.visibility = "hidden";



            if ((lengthI>0) && ((lengthI <= charLimit)) && checkInputEmpty(input.value))
            {
                setClass(okButton, "fast_comment_ok");
                if (delt<100)
                    messageBox.style.visibility = "visible"
                else
                    messageBox.style.visibility = "hidden";
                if (delt>30)
                {
                    setClass(messageBox, "fast_comment_message_holder");
                }else{
                    setClass(messageBox, "fast_comment_message_holder_warning");
                }
            }else{
                setClass(okButton, "fast_comment_ok_disabled");
            }


            //formating message
            var mesPre = " characters left";
            if (delt==1)
            {
                mesPre = " character left";
            }
            messageBox.innerHTML = delt+mesPre;
        },

        postComment : function (e)
        {
            log("1post comment");
            if (this.postCommentNow)
                return false;

            log("2post comment");
            if (!aup.auth.status)
            {
                aup.loginMenus.showLoginMenu();
                return false;
            }


            log("3post comment");
            this.postCommentNow = true;
            var input = aup.pages.photo.comments.newCommentTextInput;
            var charLimit = aup.pages.photo.comments.charLimit;
            var photo_id = aup.pages.photo.curPageId;
            var reply = aup.pages.photo.comments.newCommentReply;

            if ((input.value.length <= charLimit) && (input.value.length>0))
            {
                log("4post comment");
                var comBody = messageCheckSPaces(input.value);
                aup.actions.comments.postComment( photo_id , reply, comBody, bind(this.postCommentCallback, aup.pages.photo.comments), bind(this.errcbComment, this));
            }
        },

        errcbComment : function(response)
        {
            this.postCommentNow = false;
        },

        postCommentCallback : function (response)
        {
            this.postCommentNow = false;
            var resp = getObjectJson(response);
            if (resp.error)
            {
                log("aup/pages/photo/likeLists : get lists error = ["+resp.error.code+"]");
                if (!aup.errors.hasNetError(resp))
                {
                    //aup.controller.showErrorPage();
                }
                return false;
            }

            var element_div = this.newComment(resp.comment);

            this.commentsList.splice(this.lastIndex+1,0,element_div);
            if (resp.comment.level == 0)
                this.lastParent = new Number(this.commentsList.length-1);
            //set indexes
            for (var i = 0; i<this.commentsList.length; i++)
                this.commentsList[i].index = parseInt(new Number(i));
            element_div.parentN = this.lastParent;

            this.setWrappers();
            $(element_div).insertAfter(this.newCommentContainer);
            $(this.newCommentContainer).remove();
            aup.pages.photo.setHearts();
            this.displayCommentBlock();
        },

        cancelComment : function (e)
        {
            var comments = aup.pages.photo.comments;
            comments.setWrappers();
            $(comments.newCommentContainer).remove();
            aup.pages.photo.setHearts();
        },

        setWrappers : function (_lastComment, _curLevel)
        {
            var level1 = aup.pages.photo.commentMargin;
            for (var i=0; i<this.commentsList.length; i++)
            {
                var element_div = this.commentsList[i];
                element_div.wrapper.css({ visibility : 'visible' });
                if (element_div.level == 1)
                {
                    element_div.wrapper.css({ 'margin-left' : level1 });
                    if (i < this.commentsList.length-1)
                        if (this.commentsList[i+1].level == 0)
                            element_div.wrapper.css({ 'margin-left' : 0 });
                }else{
                    element_div.wrapper.css({ 'margin-left' : 0 });
                }
            }

            if (this.commentsList.length>0)
                this.commentsList[this.commentsList.length-1].wrapper.css({ visibility : 'hidden' });

            if ( typeof(_lastComment) != 'undefined' )
            {
                if (_lastComment>0)
                {
                    var lastCom = this.commentsList[_lastComment];
                    lastCom.wrapper.css({ visibility : 'visible' });
                    if (lastCom.level == 0)
                    {
                        lastCom.wrapper.css({ 'margin-left' : 0 });
                    }else{
                        lastCom.wrapper.css({ 'margin-left' : level1 });
                    }
                }

                if (_lastComment == this.commentsList.length-1)
                {
                    if (_lastComment>-1)
                    {
                        var lastCom = this.commentsList[_lastComment];
                        lastCom.wrapper.css({ visibility : 'visible' });
                    }
                    this.newCommentMessageWrapper.css({ visibility : 'hidden' });
                }else{
                    this.newCommentMessageWrapper.css({ visibility : 'visible' });
                    if (_curLevel == 0)
                    {
                        this.newCommentMessageMarginer.css({ 'margin-left' : 0 });
                    }else{
                        this.newCommentMessageMarginer.css({ 'margin-left' : level1 });
                    }
                }
            }
        },

        displayCommentBlock : function()
        {
            if ( this.loadingComments )
            {
                this.addCommentCont.commentsCount.text("");
                this.addCommentCont.addNew.text("");
                return true;
            }

            if (this.commentsList.length>0)
            {
                if (this.commentsList.length==1)
                    this.addCommentCont.commentsCount.text("1 comment ")
                else
                    this.addCommentCont.commentsCount.text(this.commentsList.length+" comments ");

                this.addCommentCont.addNew.text("Add new");
            }else{
                this.addCommentCont.commentsCount.text("");
                this.addCommentCont.addNew.text("Add new comment");
            }
        },

        init : function ()
        {
            this.newCommentContainer = document.getElementById(this.newCommentContainerId);
            this.newCommentTextInput = $(this.newCommentContainer).find( ".photo_newcomment_commentinput" ).get()[0];
            this.newCommentTextInputC = $(this.newCommentContainer).find( ".comment_body" ).get()[0];
            this.newCommentTextInput.maxLength = this.charLimit;

            this.newCommentName = $(this.newCommentContainer).find( ".comment_username" );

            this.newCommentMessageCont = $(this.newCommentContainer).find( ".comment_info" ).get()[0];
            this.newCommentButtonOk = $(this.newCommentContainer).find( ".fast_comment_ok" ).get()[0];
            this.newCommentMessageMarginer = $(this.newCommentContainer).find( ".comments_container_marginer" );
            this.newCommentMessageWrapper = $(this.newCommentContainer).find( ".line_wrapper" );

            this.addCommentCont = $(this.parent.mainObject).find(".photobig_addcomment_container");
            this.addCommentCont.commentsCount = $(this.addCommentCont).find(".photobig_comments_count");
            this.addCommentCont.addNew = $(this.addCommentCont).find(".photobig_addnew");
            this.addCommentCont.addNew.click(bind(this.startPostComment,this));
            this.addCommentCont.wrapper = $(this.addCommentCont).find(".line_wrapper");

            this.loadingBar = $("#notifications_loading_tab").clone().removeAttr('id');
            this.loadingBar.css({ display : 'block', margin : 'auto', width: 50+'px'});



            this.inited = true;
        }
    },

    likeLists : {
        likes : [],
        likesReceived : false,

        listContainer : null,

        likesHeader : null,
        dislikesHeader : null,

        likesBody : null,
        dislikesBody : null,
        likesBodyC : null,
        dislikesBodyC : null,

        meLike : null,
        meDislike : null,
        parent : null,

        getLikesLists : function()
        {
            aup.pages.photo.likeLists.clearCanvas();
            aup.pages.photo.likeLists.listContainer.css({ display : 'none' });


            var curId = new Number(this.parent.curPageId);
            aup.actions.likes.getLikeList(    aup.pages.photo.curPageId, bind( function(e) {  if (curId == this.parent.curPageId) aup.pages.photo.likeLists.dataCallBack(e); }, aup.pages.photo.likeLists));
            //aup.actions.likes.getDislikeList( aup.pages.photo.curPageId, bind( this.dataCallBack, this));
        },

        dataCallBack : function(response)
        {
            var resp = getObjectJson(response);
            if (resp.error)
            {
                log("aup/pages/photo/likeLists : get lists error = ["+resp.error.code+"]");
                if (!aup.errors.hasNetError(resp))
                {
                    //aup.controller.showErrorPage();
                }
                return false;
            }

            for (var i=0; i<resp.likers.list.length; i++)
            {
                this.likes.push( resp.likers.list[i] );
            }

            this.likesReceived = true;


            var str = "";
            for (var i=0; i<this.likes.length; i++)
            {
                if (this.likes[i].name == aup.auth.userObject.name) continue;
                if (i!=this.likes.length-1)
                    str = str + "<a href='" + aup.links.getUserProfileLink(this.likes[i].id) + "' class='photobig_like_username'>"+this.likes[i].name+"</a>, "
                else
                    str = str + "<a href='" + aup.links.getUserProfileLink(this.likes[i].id) + "' class='photobig_like_username'>"+this.likes[i].name+"</a>";
            }
            this.likesBody.innerHTML = str;


            aup.pages.photo.likeLists.setLikesMe();
            aup.pages.photo.setHearts();

            addIntelloLinks(this.likesBody);

            //aup.resetH();
        },

        clearCanvas : function()
        {
            //clear
            while(this.likes.length>0)
            {
                var a = this.likes.pop();
                $(a).remove();
            }

            this.likesBody.innerHTML = "";
            this.likesReceived = false;
        },

        clearLikesMe : function()
        {
            aup.pages.photo.likeLists.meDislike.innerHTML = "";
            aup.pages.photo.likeLists.meLike.innerHTML = "";
        },

        setLikesMe : function()
        {
            if (aup.pages.photo.curPageObject == null)
                return false;

            if (aup.pages.photo.curPageObject.photo.wasvote > 0)
            {
                aup.pages.photo.likeLists.meDislike.innerHTML = "";
                if (aup.pages.photo.likeLists.likes.length >0)
                    aup.pages.photo.likeLists.meLike.innerHTML = "<a href='" + aup.links.getUserProfileLink(aup.auth.status.id) + "' class='photobig_like_username'>"+aup.auth.userObject.name+"</a>"+", "
                else
                    aup.pages.photo.likeLists.meLike.innerHTML = "<a href='" + aup.links.getUserProfileLink(aup.auth.status.id) + "' class='photobig_like_username'>"+aup.auth.userObject.name+"</a>";

                addIntelloLinks(aup.pages.photo.likeLists.meLike);
            }else{
                this.clearLikesMe();
            }

            //check likes displaying

            if ((this.likes.length>0) || (aup.pages.photo.curPageObject.photo.wasvote!=0))
            {
                this.listContainer.css({ display : 'block' });
            }else{
                this.listContainer.css({ display : 'none' });
            }

            aup.pages.photo.setHearts();
            aup.pages.photo.likeLists.checkLikesStatus();
        },
        checkLikesStatus : function()
        {
            var sourceLikes = aup.pages.photo.curPageObject.photo.like;

            if (sourceLikes == 1)
                aup.pages.photo.likeLists.likesHeader.innerHTML = sourceLikes + "&nbsp;Like"
            else
                aup.pages.photo.likeLists.likesHeader.innerHTML = sourceLikes + "&nbsp;Likes";

        },

        init : function()
        {
            this.listContainer = $(aup.pages.photo.mainObject).find( ".photobig_likesbox_holder");
            var obj = $(aup.pages.photo.mainObject).find( ".photobig_like_header" );
            this.likesHeader = obj[0];
            this.dislikesHeader = obj[1];

            var obj = $(aup.pages.photo.mainObject).find( ".photobig_like_body" );
            this.likesBodyC = obj[0];
            this.dislikesBodyC = obj[1];

            var obj = $(aup.pages.photo.mainObject).find( ".photobig_like_body_cont" );
            this.likesBody = obj[0];
            this.dislikesBody = obj[1];


            this.meLike = $(this.likesBodyC).find( ".photobig_like_username" ).get()[0];
            this.meDislike = $(this.dislikesBodyC).find( ".photobig_like_username" ).get()[0];
        }
    }
}


