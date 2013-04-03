WHP.pages.stories = {
    //controller parametres
    urlStr:"stories",
    title:"Stories",
    rndEnable:true,
    inited:false,

    mainObject:null,

    responseObject : null,

    headElements:[],
    headCanvas:null,
    curElem:0,

    contentElements:[],


    storyIcoTemplate:null,

    dailyStoryTempl : null,


    storiesCont:null,
    storiesObject:null,
    storiesVobject:null,
    storyTemplateCanvas : null,

    storyTemplate:null,
    smallStoryTemplate:null,


    paginL : null,
    paginR : null,
    dailyStoriesCont:null,
    dailyStoriesCanvas:null,
    dailyStoriesElements : [],
    dailyStoriesObject:null,
    dailystoriesTemplate:null,
    dailyOffset : 0,
    dailyPagin : null,

    lastCallN:0,
    loadingBar : null,

    is_for_upload: false,

    restoreParams : null,

    showParams : {
        active : false,
        catId : -1,
        subCat : -1,

        scrollActive : false,
        scrollTo : 0
    },


    //init function
    init: function (is_for_upload) {
        var main_object_id = "stories";
        if (is_for_upload) {
            main_object_id = "upload_stories";
            this.is_for_upload = true;
        } else {
            main_object_id = "stories";
            this.is_for_upload = false;
        }

        this.mainObject = id$(main_object_id);
        this.canvas = $(this.mainObject).find(".stories_box");

        this.storyIcoTemplate = $('#story_menu_li').clone();
        this.storyIcoTemplate.removeAttr('id');

        this.dailyStoryTempl = $('#template_daily_elem').clone();
        this.dailyStoryTempl.removeAttr('id');


        this.loadingBar = $(this.mainObject).find(".notifications_loading_tab");
        this.loadingBar.css({ display : 'none', margin : 'auto'});


        this.headCanvas = $(this.mainObject).find(".stories_icons_cont");
        this.headCanvas.timer = new Timer(1000 / 30, 10);
        this.headCanvas.timer.onTimerEvent = bind(this.timerMoveVevent, this);
        this.headCanvas.cP = 0;
        this.headCanvas.p0 = 0;
        this.headCanvas.p1 = 0;

        this.dailystoriesTemplate = $('#dailystories').clone();
        this.dailystoriesTemplate.removeAttr('id');
        this.dailyStoriesCanvas = this.dailystoriesTemplate.find(".story_canvas");

        this.paginL = $( this.dailystoriesTemplate ).find( ".std_paging_left" );
        this.paginR = $( this.dailystoriesTemplate ).find( ".std_paging_right" );

        this.paginR.click(bind(function () { log("R"); this.getDailyPage(1); },this));
        this.paginL.click(bind(function () { this.getDailyPage(-1); },this));
        this.dailyPagin = $( this.dailystoriesTemplate ).find( ".paging_table");


        this.storiesVobject = $(this.mainObject).find(".stories_head_v");


        this.storyTemplate = $('#dailystories').clone();
        this.storyTemplate.removeAttr('id');
        this.storyTemplateCanvas = this.storyTemplate.find(".story_canvas");
        this.storyTemplate.find(".paging_table").remove();


        this.smallStoryTemplate = $("#template_story_elem").clone();
        this.smallStoryTemplate.removeAttr('id');

        this.storiesCont = $(this.mainObject).find(".stories_content");
        this.storiesCont.append(this.storyTemplate);


        this.dailyStoriesCont = $(this.mainObject).find(".dailystories_content");
        this.dailyStoriesCont.append(this.dailystoriesTemplate);

        this.resetRestore();

        this.inited = true;
    },


    //std for each module control functions
    show:function (_q) {
        $('#photobackbutton').css({ visibility: 'hidden'});
        WHP.l10n.localize_page("landing");

        //get parametres
        var q = _q;
        if (!q)
            q = "";


        var params = q.split("/");

        if (params.length>0)
        if (params[0]!="")
        {
            //get cat
            this.showParams.active = true;
            this.showParams.catId = params[0];
            if (params.length>1)
            {
                this.showParams.subCat = parseInt(params[1]);
                if (isNaN(this.showParams.subCat))
                {
                    this.showParams.subCat = -1;
                }
            }

        }else{
            this.showParams.active = false;
        }

        //get parametresf
        this.resetRestore();
        this.clearCanvas();
        this.loadCats();
    },

    loadCats:function () {
        //clear canvas
        this.jqxhr = $.ajax({
            url:WHP.netcalls.storiesCall,
            data:{ lang: WHP.l10n.locale, r : Math.random() },
            timeout:WHP.netTimeOut,
            success:bind(this.onData, this),
            error:bind(this.onError, this)
        });
    },
    onData:function (response) {
        WHP.controller.scrollToPos(0, 0);

        var resp = getObjectJson(response);
        if (resp.error) {
            log("WHP/pages/stories : error while loading page data! Err =[" + response + "]");
            if (!WHP.errors.hasNetError(resp)) {
                WHP.controller.showErrorPage();
            }
            return false;
        }
        this.responseObject = resp;

        if (false)
        {
            var orderer = [
                { id : 1, n : 0, ord : 0},  //About me
                { id : 2, n : 1, ord : 1},  //Friends and family
                { id : 3, n : 2, ord : 2},  //Home
                { id : 4, n : 3, ord : 4},  //Work and study
                { id : 5, n : 4, ord : 3},  //Places
                { id : 6, n : 5, ord : 5}]; //City

            orderer = orderer.sort(function(a, b){
                return (a.ord > b.ord) ? 1 : -1;
            });


            var nA = [];
            for (var i = 0; i<orderer.length; i++)
            {
                nA.push(resp.storycats[ orderer[i].n ]);
            }
            resp.storycats = nA;
        }


        this.clearCanvas();
        //setClass(element_div.ico, "stories_ico_"+resp.id);
        for (var i = 0; i < resp.storycats.length; i++) {
            var elem = this.getIcon();
            var obj = resp.storycats[i];

            elem.id = obj.id;
            elem.label.text(obj.name);
            elem.parent = this;
            //chrome bk bug

            setClass(elem.ico, "stories_ico_" + obj.id);
            elem.ico.css({ 'background-image': 'none'});

            this.headCanvas.append(elem);
            this.headElements.push(elem);
        }


        setTimeout( bind(function(){
            for (var i=0; i< this.headElements.length; i++)
            {
                this.headElements[i].ico.css({ 'background-image': ''});
            }
        },this), 150);


        //add Daily story
        var elem = this.getIcon();
        elem.label.text(WHP.l10n.localize_string("daily_story", "landing"));
        elem.id = "daily";
        elem.parent = this;
        setClass(elem.ico, "stories_ico_7");
        this.headCanvas.append(elem);
        this.headElements.push(elem);


        for (var i = 0; i < this.headElements.length; i++) {
            var a = this.headElements[i];
            a.curN = new Number(i);
            a.daily = false;
            a.click(bind(this.headElemClick, a));
        }


        this.headElements[0].css({ 'margin-left':12 + 'px'});
        this.headElements[this.headElements.length - 1].css({ 'margin-right':12 + 'px'});
        this.headElements[this.headElements.length - 1].daily = true;


        WHP.controller.showCanvas();
        //load content

        //get cur elem by id
        if (this.showParams.active)
        {
            this.curElem = this.getCatById(this.showParams.catId);
            if (this.curElem ==-1)
                this.curElem = 0;
        }else{
           this.curElem = 0;
        }

        this.setPosFast(this.curElem);
        this.headElements[this.curElem].click();
        //this.getContent(this.headElements[this.curElem].id);

        this.storiesVobject.css({ display:'block'});
        WHP.controller.setTitle();
        //WHP.resetH();
    },

    getCatById : function(_id)
    {
        var retN = -1;
        for (var i=0; i<this.headElements.length; i++)
        {
            if (_id == this.headElements[i].id)
            {
                retN = i;
                break;
            }
        }

        return retN;
    },

    onContentHeightChange : function(e)
    {
        if (this.restoreParams.setScroll)
        {
            window.scrollTo(0,this.restoreParams.scrollpos);
            WHP.menu.setShadow(this.restoreParams.scrollpos);
            this.restoreParams.setScroll = false;
        }


        if (this.showParams.scrollActive && this.showParams.active)
        {
            this.showParams.scrollActive = false;
            var scrollPos = elementOffset(this.contentElements[this.showParams.scrollTo]).top;
            //WHP.smoothScrollTo(0, scrollPos);
        }
    },

    restore: function (e)
    {
        this.restoreParams.setScroll = true;
        WHP.controller.showCanvas();
    },

    hide : function()
    {
        this.restoreParams.scrollpos = $(document).scrollTop();
    },

    resetRestore : function()
    {
        this.restoreParams = {
            scrollpos : 0,
            setScroll : false
        };
    },



    onError:function (response, status, xhr) {
        log("WHP/pages/stories : Error while loading actual data! Err = [" + response + "]");
    },


    getIcon:function () {
        var element_div = this.storyIcoTemplate.clone();
        element_div.ico = element_div.find(".profile_menu_li_ico");
        element_div.label = element_div.find(".profile_menu_li_text");

        return element_div;
    },

    setPosFast:function (_N) {
        WHP.shares.hideAct2();
        this.setLabelsActive(_N);
        var a = 124;
        var b = 57;

        var left = a * _N + b;
        this.curElem = _N;
        this.storiesVobject.css({ left:left + 'px'});
    },

    headElemClick:function (e) {
        WHP.shares.hideAct2();

        var curN = parseInt(this.curN);
        this.parent.setPosMotion(curN);

        if (this.daily)
        {
            setLinkReplace( WHP.links.getStoriesLinkDaily(), this.restoreParams);
            this.parent.getContentDaily();
        }else{
            if (this.loadingBar)
                this.loadingBar.css({ display : 'none'});
            setLinkReplace( WHP.links.getStoriesLink(this.id), this.restoreParams);
            this.parent.getContent(this.id);
        }

        WHP.shares.hideAct2();

    },

    timerMoveVevent:function (e) {
        var A = e.currentCount / e.repeatCount;
        var B = (Math.sin(Math.PI * (A - 0.5)) + 1) * 0.5;

        this.headCanvas.cP = (1 - B) * this.headCanvas.p0 + B * this.headCanvas.p1;
        this.storiesVobject.css({ 'left':this.headCanvas.cP + 'px'});
    },

    setLabelsActive : function(_N)
    {
        //profile_menu_li_active
        for (var i=0; i<this.headElements.length; i++)
        {
            if (_N == i)
            {
                setClass(this.headElements[i], "profile_menu_li_active");
            }else{
                setClass(this.headElements[i], "profile_menu_li");
            }
        }
    },

    setPosMotion:function (_N) {
        //WHP.stats.trackPageChange("/"+this.urlStr+"/"+this.headElements[_N].id+"/");
        this.setLabelsActive(_N);
        var a = 124;
        var b = 57;

        var left1 = this.headCanvas.cP;
        var left2 = a * _N + b;

        this.headCanvas.p0 = left1;
        this.headCanvas.p1 = left2;
        this.curElem = _N;

        this.headCanvas.timer.reset();
        this.headCanvas.timer.start();
    },

    getContent:function (_N) {
        this.lastCallN++;
        var k = this.lastCallN;
        this.clearContent();


        this.dailyStoriesCont.css({display : 'none'});
        this.storiesCont.css({display : 'block'});

        this.loadingBar.css({ display : 'none'});
        this.getContentResponse(this.responseObject.storycats[_N-1], k);
    },

    getContentResponse:function (response, _N) {
        if (_N != this.lastCallN)
            return false;

        var resp = getObjectJson(response);
        if (resp.error) {
            log("WHP/pages/stories : error while loading page data! Err =[" + response + "]");
            return false;
        }

        for (var i=0; i< resp.stories.length; i++)
        {
            //log("["+i+"] = ["+resp.tree[0].childs[i]+"]");
            var element_div = this.newStory(resp.stories[i]);

            this.storyTemplateCanvas.append(element_div);
            this.contentElements.push(element_div);
        }
        //WHP.resetH();
        addIntelloLinks(this.storyTemplateCanvas);
        return true;
    },


    getSubCatById : function(_id)
    {
        var ret = -1;
        for (var i=0; i<this.contentElements.length;i++)
        {
            if (this.contentElements[i].story_id == _id)
            {
                ret = i;
                break;
            }
        }
        return ret;
    },

    clearDailyCanvas:function()
    {
        while (this.dailyStoriesElements.length > 0) {
            var a = this.dailyStoriesElements.pop();
            a.remove();
        }
        $(this.paginR).addClass("hidden");
        $(this.paginL).addClass("hidden");
        this.dailystoriesTemplate.css({display : 'none'});
    },

    clearContent:function () {
        while (this.contentElements.length > 0) {
            var a = this.contentElements.pop();
            a.remove();
        }

    },

    clearCanvas:function () {
        //clear Content
        //clear head
        while (this.headElements.length > 0) {
            var a = this.headElements.pop();
            a.remove();
        }
        this.storiesVobject.css({ display:'none'});
    },



    createSmallStory:function (_resp) {
        var element_div = this.smallStoryTemplate.clone();

        element_div.label = $(element_div).find(".story_label_small");
        element_div.image = $(element_div).find(".story_img");
        element_div.mainImage  =  $(element_div).find(".template_story_elem_img");

        element_div.image.mouseenter(bind(this.mouseE, element_div));
        element_div.image.mouseleave(bind(this.mouseO, element_div));


        element_div.image_link = $(element_div).find(".feed_photo_link");
        element_div.new_ico = $(element_div).find(".story_new_ico");
        element_div.story_bk_fader = $(element_div).find(".story_bk_fader");

        element_div.image_src = _resp["i320x80"];

        setImageOnload(element_div.mainImage, element_div.image_src, null, bind(this.miniLoaded, element_div));

        element_div.label.text(_resp.name).css({ color:"#222"});
        element_div.id = _resp.id;

        if (this.is_for_upload) {
            element_div.image_link.attr('href', "#");
            element_div.image_link.click(function() { WHP.upload.completeUpload("story", element_div.id); });
        } else {
            element_div.image_link.attr('href', WHP.links.getScenarioLink(element_div.id));
            element_div.image_link.click(bind(function() { WHP.pages.story.linkBack = true; }, this));
        }

        if (_resp.is_new)
            element_div.new_ico.css({display:'block'});

        return element_div;
    },

    miniLoaded:function () {
        this.story_bk_fader.css({ 'background-image':'url(/gui/story_bk_fader.png?whp16)'});
        this.image.css({ 'background-image':'none' });
        this.label.css({ 'color' : "#ffffff" });
    },

    rollStory:function (e) {
        this.p0 = this.cP;
        if (this.p1 == 1.0) {
            this.p1 = 0.0;
            this.story_roll_but.shRollBut(false);
        } else {
            this.p1 = 1.0;
            this.story_roll_but.shRollBut(true);
            this.showElementsBlock(true);
        }

        this.timer.reset();
        this.timer.start();


        var scrollPos = elementOffset(this).top-70;
        WHP.smoothScrollTo(0, scrollPos, null, true);

        return cancelEvent(e);
    },

    getContentDaily:function () {
        this.lastCallN++;
        var k = this.lastCallN;
        this.clearContent();
        this.clearDailyCanvas();
        this.loadingBar.css({ display : 'block'});
        this.dailyOffset = 0;
        this.dailyTotal = 0;

        this.dailyStoriesCont.css({display : 'none'});
        this.loadingBar.css({ display : ''});
        this.storiesCont.css({display : 'none'});

        while(this.dailyStoriesElements.length>0)
        {
            var a =  this.dailyStoriesElements.pop();
            a.remove();
        }

        $.ajax({
            url:WHP.netcalls.dailyStories,
            data:{  r:Math.random() , offset : this.dailyOffset, limit : 14 },
            timeout:WHP.netTimeOut,
            success:bind(function (resp) {
                this.getContentDailyResponse(resp, k);
            }, this),
            error:bind(this.onError, this)
        });
    },



    getDailyPage:function (_a) {
        var newOffset = this.dailyOffset + _a*30;

        if ((newOffset>this.dailyTotal) || (newOffset < 0))
            return false;

        this.dailyStoriesCont.css({display : 'none'});
        this.loadingBar.css({ display : ''});

        this.dailyOffset = newOffset;

        this.lastCallN++;
        var k = this.lastCallN;

        while(this.dailyStoriesElements.length>0)
        {
            var a =  this.dailyStoriesElements.pop();
            a.remove();
        }

        $.ajax({
            url:WHP.netcalls.dailyStories,
            data:{  r:Math.random() , offset : this.dailyOffset, limit : 14 },
            timeout:WHP.netTimeOut,
            success:bind(function (resp) {
                this.getContentDailyResponse(resp, k);
            }, this),
            error:bind(this.onError, this)
        });
    },

    getContentDailyResponse:function (response, _N) {
        if (_N != this.lastCallN)
            return false;

        var resp = getObjectJson(response);
        if (resp.error) {
            log("WHP/pages/stories : error while loading page data! Err =[" + response + "]");
            return false;
        }

        this.loadingBar.css({ display : 'none'});
        this.dailyTotal = resp.stories.total;




        for (var i=0; i<resp.stories.list.length; i++)
        {
            //log("["+i+"] = ["+resp.tree[0].childs[i]+"]");
            var element_div = this.newDailyStory(resp.stories.list[i]);

            this.dailyStoriesCanvas.append(element_div);
            this.dailyStoriesElements.push(element_div);
        }


        //WHP.resetH();
        addIntelloLinks(this.dailyStoriesCanvas);
        this.checkDailyPagin();
        this.dailystoriesTemplate.css({display : 'block'});
        this.dailyStoriesCont.css({display : ''});


        return true;
    },

    checkDailyPagin : function ()
    {
        var imageLimit = 30;
        if (this.dailyTotal <= imageLimit)
        {
            this.paginL.addClass("hidden");
            this.paginR.addClass("hidden");
            this.dailyPagin.css({ display : 'none' });
        }else{
            this.dailyPagin.css({ display : '' });
            if (this.dailyOffset==0)
                this.paginL.addClass("hidden");
            else
                this.paginL.removeClass("hidden");

            if (this.dailyOffset >= this.dailyTotal-imageLimit )
                this.paginR.addClass("hidden")
            else
                this.paginR.removeClass("hidden");
        }

    },

    newStory : function (_resp)
    {
        var element_div = this.dailyStoryTempl.clone();
        element_div.label = $(element_div).find(".story_label_small");
        element_div.image = $(element_div).find(".story_img");
        element_div.mainImage = $(element_div).find(".template_story_elem_img");

        element_div.image.mouseenter(bind(this.mouseE, element_div));
        element_div.image.mouseleave(bind(this.mouseO, element_div));
        element_div.line_bottom = element_div.find(".story_bottom_line");
        element_div.line_bottom.css({ visibility: 'hidden' });

        element_div.image_link = $(element_div).find(".feed_photo_link");
        element_div.new_ico = $(element_div).find(".story_new_ico");
        element_div.story_bk_fader = $(element_div).find(".story_bk_fader");

        element_div.image_src = _resp["i320x80"];

        element_div.label.text(_resp.name).css({ color:"#222"});

        if (this.is_for_upload) {
            element_div.image_link.attr('href', "#");
            element_div.image_link.click(function() { WHP.upload.completeUpload("story", _resp.id); });
        } else {
            element_div.image_link.attr('href', WHP.links.getScenarioLink(_resp.id));
            element_div.image_link.click(bind(function() { WHP.pages.story.linkBack = true; }, this));
        }

        var newIco = $(element_div).find(".story_new_ico");
        var totalImg = $(element_div).find(".story_total_small");
        totalImg.remove();
        newIco.remove();



        if (_resp.is_new)
        {
            newIco.css({ display : 'block' });
        }else{
            newIco.css({ display : 'none' });
        }
        setImageOnload(element_div.mainImage, element_div.image_src, null, bind(this.miniLoadedDaily, element_div));


        return element_div;
    },

    newDailyStory : function (_resp)
    {
        var element_div = this.dailyStoryTempl.clone();
        element_div.label = $(element_div).find(".story_label_small");
        element_div.image = $(element_div).find(".story_img");
        element_div.mainImage = $(element_div).find(".template_story_elem_img");

        element_div.mOverAlpha = 1.0;
        element_div.mOutAlpha = 1.0;
        element_div.aC = element_div.mOutAlpha;
        element_div.a0 = 0;
        element_div.a1 = 0;
        element_div.timerAlpha = new Timer(1000/30, 4);
        element_div.timerAlpha.onTimerEvent = bind(this.level3alpha, element_div);
        setAlpha(element_div.image, element_div.mOutAlpha);
        element_div.image.mouseenter(bind(this.mouseE, element_div));
        element_div.image.mouseleave(bind(this.mouseO, element_div));
        element_div.line_bottom = element_div.find(".story_bottom_line");
        element_div.line_bottom.css({ visibility: 'hidden' });


        element_div.image_link = $(element_div).find(".feed_photo_link");
        element_div.new_ico = $(element_div).find(".story_new_ico");
        element_div.story_bk_fader = $(element_div).find(".story_bk_fader");

        element_div.image_src = _resp["i320x80"];

        element_div.label.text(_resp.name).css({ color:"#222"});

        if (this.is_for_upload) {
            element_div.image_link.attr('href', "#");
            element_div.image_link.click(function() { WHP.upload.completeUpload("story", _resp.id); });
        } else {
            element_div.image_link.attr('href', WHP.links.getScenarioLink(_resp.id));
            element_div.image_link.click(bind(function() { WHP.pages.story.linkBack = true; }, this));
        }


        var newIco = $(element_div).find(".story_new_ico");
        var totalImg = $(element_div).find(".story_total_small");
        totalImg.text(_resp.photos_count);



        if (_resp.is_new)
        {
            newIco.css({ display : 'block' });
        }else{
            newIco.css({ display : 'none' });
        }
        setImageOnload(element_div.mainImage, element_div.image_src, null, bind(this.miniLoadedDaily, element_div));


        return element_div;
    },

    mouseE : function()
    {
        if (this.loaded)
            this.line_bottom.css({ visibility: 'visible' });

    },

    mouseO : function()
    {
        if (this.loaded)
            this.line_bottom.css({ visibility: 'hidden' });
    },

    miniLoadedDaily:function () {
        //log("LOADED! = ["+this.image_src+"] ["+ this.story_bk_fader.css( 'background-image')+"] ["+this.image.css('background-image')+"]")
        this.story_bk_fader.css({ 'background-image':'url(/gui/story_bk_fader.png?whp16)'});
        this.image.css({ 'background-image':'url(' + this.image_src + ')' });
        this.label.css({ 'color' : "#ffffff" });
        this.loaded = true;
    }
}



