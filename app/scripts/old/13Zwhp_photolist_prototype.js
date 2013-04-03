
whp_photolist_prototype = function () { return {
    //main nav
    position : 0,
    elements : [],

    //display elements
    rollover_plate : null,
    parent : null,
    active : false,

    //     net vars
    callUrl : "",
    userUrl : false,

    offset : 0,
    limit : 32,
    limit_left : 4,         //this more than next V
    limitStep : 28,
    preloadEdgeLimit : 2,
    total : 0,
    loadingActive : false,


    //while loading
    direction : 1,

    applyAction : false,
    nextPhoto : 0,


    init : function()
    {
        this.limitStep = this.limit-this.limit_left;
        this.rollover_plate.backward_button.click( bind( function() { this.setPosition(-1); }, this));
        this.rollover_plate.forward_button.click( bind( function() { this.setPosition(1); }, this));
        this.loadList.parent = this;
    },

    loadList : {
        parent : null,
        arr : null,
        active : false,
        nToLoad : 0,
        phace : 0,
        offset : 0,
        total : 0,

        startOffset : 0,


        loadImages : function(_offset, _start)
        {
            if (this.active)
                return false;

            this.arr = null;
            this.active = true;

            this.nToLoad = Math.min(this.parent.limitStep + this.parent.limit-this.parent.elements.length, this.parent.total);
            if (this.nToLoad < this.parent.limitStep)
                this.offset = 0
            else
                this.offset = _offset;

            this.startOffset = this.offset;
            this.phace = 0;

            log("this.nToLoad = ["+this.nToLoad+"]");

            log("0 Load offset = ["+this.offset+"] ["+this.nToLoad+"]");
            $.ajax({
                url:this.parent.callUrl,
                data : { offset : this.offset, limit : this.nToLoad, r : Math.random() },
                timeout:WHP.netTimeOut,
                success:bind(this.onData, this),
                error:bind(this.onError, this)
            });
        },
        onError : function(response)
        {
            this.active = false;
        },

        onData : function (response) {


            var resp = getObjectJson(response);
            if (resp.error) {
                return false;
            }

            //popular
            var pResp = resp.photos;
            var pList = resp.photos.list;
            var pTotal = resp.photos.total;

            this.total = pTotal;

            if (this.phace == 0)
            {

                this.nToLoad = Math.max(0, this.nToLoad - pList.length);
                log("RESULT p.length = [ "+pList.length+"] toload = ["+this.nToLoad+"]");
                this.arr = [];

                for (var i=0; i<pList.length; i++)
                    this.arr.push( { photo : pList[i], offset : this.offset+i });

                if (this.nToLoad == 0)
                {
                    this.active = false;
                    this.parent.appendData(this.arr);
                    return true;
                }

                this.offset = limitPos(this.offset + pList.length, this.parent.total);
                this.phace++;
                log("1 Load offset = ["+this.offset+"] ["+this.nToLoad+"]");
                $.ajax({
                    url:this.parent.callUrl,
                    data : { offset : this.offset, limit : this.nToLoad, r : Math.random() },
                    timeout:WHP.netTimeOut,
                    success:bind(this.onData, this),
                    error:bind(this.onError, this)
                });
                return true;
            }else{
                log("PHACE2");
                for (var i=0; i<pList.length; i++)
                    this.arr.push( { photo : pList[i], offset : this.offset+i });

                this.nToLoad = Math.max(0, this.nToLoad - pList.length);
                this.active = false;
                this.parent.appendData(this.arr);


            }
        }
    },

    setPosition : function(_N)
    {
        log("SETPOSITION = ["+_N+"]");
        var newPos = this.position+_N;

        this.applyAction = false;
        this.nextPhoto = 0;

        //have 2do
        if (!this.userUrl || (this.userUrl && (this.elements.length == this.total)))
        {
            //limited pos
            log("NOT LOADING ["+this.elements.length+"] ["+this.total+"]");
            this.position = limitPos(newPos, this.elements.length);
            //showPhoto
            this.setParentPhoto(this.position);
            return true;
        }

        var edge = false;
        if ( ((this.position<=this.preloadEdgeLimit) && (_N<0)) || ((this.position>=this.elements.length-this.preloadEdgeLimit) && (_N>0)))
        {
            if ((this.position==0) || (this.position==this.elements.length-1))
            {
                edge = true;
                this.applyAction = true;
            }


            var newOffset = this.offset;
            if (this.position<=this.preloadEdgeLimit)
            {
                newOffset = newOffset-this.limitStep;
                this.nextPhoto = -1;
                this.direction = -1;
            }else{
                newOffset = newOffset+this.elements.length;
                this.nextPhoto = 1;
                this.direction = 1;
            }
            newOffset = limitPos(newOffset, this.total);

            if (!this.loadList.active)
            {

                this.loadList.loadImages(newOffset);
            }
        }
        if (edge)
            return false;

        newPos =  Math.max(0, Math.min(this.elements.length-1, newPos));

        this.position = newPos;
        this.setParentPhoto(this.position);


        return true;
    },

    appendData : function(_arr)
    {
        this.total = this.loadList.total;

        var lengthDelt = this.limit - this.elements.length;

        if (this.total < this.limit)
        {
            log("STORY L < LIMIT! ["+this.total+" - "+this.limit+"]");
            this.elements = _arr;
            this.position = limitPos(this.offset+this.position);
            this.offset = 0;

        }else{
            if (this.direction>0)
            {
                this.elements.splice(0,_arr.length-lengthDelt);
                this.offset = this.loadList.startOffset - this.elements.length;
                this.elements = this.elements.concat(_arr);
                this.position = this.position-_arr.length;
            }else if (this.direction<0){
                this.elements.splice(this.elements.length-_arr.length+lengthDelt,_arr.length);
                this.elements = _arr.concat(this.elements);
                this.position = this.position+_arr.length;
                this.offset = this.loadList.startOffset;
            }
        }
        this.viewCheck();

        log("newL = ["+this.elements.length+"] ["+this.limit+"] +["+_arr.length+"]");

        if (this.applyAction)
        {
            //Move next
            this.setPosition(this.nextPhoto);
        }
    },

    onData : function (response) {
        this.loadingActive = false;

        var resp = getObjectJson(response);
        if (resp.error) {
            return false;
        }


        //popular
        var pResp = resp.photos;
        var pList = resp.photos.list;
        var pTotal = resp.photos.total;


        var newArr = [];
        for (var i = 0; i < pList.length; i++)
        {
            newArr.push({ photo : pList[i] });
        }

        var newArrL = newArr.length;

        if (this.newLoadType<0)
        {
            this.elements.splice(this.preloadL+1, newArrL);
            this.elements = $.merge( newArr, this.elements);

            this.position = this.position + newArrL;
            this.curOffset = this.newOffset;
        }else if (this.newLoadType>0){
            this.elements.splice(0,newArrL);
            this.elements = $.merge( this.elements, newArr);

            this.position = this.position - newArrL;
            this.curOffset = this.curOffset + newArrL;
        }


        this.viewCheck();
    },



    loadStartData : function()
    {
        this.offset = Math.max(0, this.offset-this.limit_left);
        this.loadingActive = true;

        $.ajax({
            url:this.callUrl,
            data : { offset : this.offset, limit : this.limit, r : Math.random() },
            timeout:WHP.netTimeOut,
            success:bind(this.onDataStart, this),
            error:bind(this.onError, this)
        });
    },


    onDataStart : function (response) {
        this.loadingActive = false;

        var resp = getObjectJson(response);
        if (resp.error) {
            return false;
        }

        //popular
        var pResp = resp.photos;
        var pList = resp.photos.list;
        var pTotal = resp.photos.total;

        ///check
        var found = false;
        this.total = pTotal;
        var Arr = [];
        for (var i = 0; i < pList.length; i++)
        {
            if (pList[i].id == this.elements[0].id)
            {
                Arr.push({ photo : this.elements[0], offset : this.offset+i +" X " });
                this.position = new Number(i);
                found = true;
            }else{
                Arr.push({ photo : pList[i], offset : this.offset+i +" X " });
            }
        }

        if (!found)
        {
            log("PhotoWasnt found!");
            Arr.splice(0,0,this.elements[0]);
            this.position = 0;
        }

        this.elements = Arr;
        this.viewCheck();
    },



    setParentPhoto : function(_pos)
    {
        //scrollTo comments
        var a = this.parent;
        a.scrollToComments = false;
        a.curPageId = this.elements[_pos].photo.id;
        a.curPageObject = this.elements[_pos];
        a.comments.clearComments();
        a.share.resetShare(true);
        setClass(this.parent.mainImage.image_cont, "photobig_image_container_0");
        a.createNewImage();

        a.mainImage.infoCont.css({ visibility : 'hidden'});
        a.mainImage.likeShadow.css({ visibility : 'hidden'});

        a.onData(this.parent.curPageObject);
        WHP.pages.photo.setHearts();
        this.viewCheck();

        setLinkReplace(WHP.links.getPhotoLink(this.elements[_pos].photo.id), null);
    },




    getCurPhotoPos : function()
    {
        if (this.userUrl)
            return limitPos(this.position + this.offset, this.total) ;
        return this.position;
    },

    getCurrentTotal : function()
    {
        if (this.userUrl)
            return this.total;
        return this.elements.length;
    },

    viewCheck : function()
    {
        var a = this.rollover_plate;
        a.move_label.html((this.getCurPhotoPos()+1)+"/"+this.getCurrentTotal());
    },

    checkDisplay : function ()
    {
        if (!this.userUrl)
            if (this.elements.length>1)
            {
                this.viewCheck();
                this.active = true;
            }else{
                this.active = false;
            }
    },


    setContentLink : function (_e, _pos, _call)
    {
        this.elements = [];

        this.elements.push(_e);

        this.viewCheck();
        this.active = true;
        this.userUrl = true;


        this.total = _pos;
        this.offset = _pos;
        this.callUrl = _call;



        this.loadStartData();
    },

    setContent : function (_e, _pos)
    {
        this.elements = _e;
        if (typeof(_pos)=='undefined')
            this.position = 0
        else
            this.position = _pos;

        this.viewCheck();


        if (this.elements.length>1)
        {
            this.active = true;
        }else{
            this.active = false;
        }

        this.curPhotoOffset = _pos;
        this.total = _e.length;
        this.userUrl = false;
    },

    clear : function ()
    {
        this.elements = [];
        this.rollover_plate.hide();
    }

}
}


