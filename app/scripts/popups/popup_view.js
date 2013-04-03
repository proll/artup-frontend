whp.PopupView = Backbone.View.extend({
	template: "popups/popup",
	className: 'popup',
	events: {
		"click .popup__close": "hide"
	},
	options : {},
	defaults: {
		content: "",
		class: "",
		width: ""
	},
	_rendered: false,
	$fader: null,

	initialize: function(options){
		this.template = whp.Templates.get(this.template);
		 _.defaults(this.options, this.defaults);
		 this.transitionEvent = $.support.transition && $.support.transition.end;
		 _.bindAll(this, "show", "showFader", "hideFader", "showPopup", "hidePopup");
		this.on("fader:show", function(){
			this.showPopup();
		}, this);

		this.on("fader:hide", function(){
			this.trigger("hide");
		}, this);
		
		this.on("popup:show", function(){
			this.trigger("show");
		}, this);
		
		this.on("popup:hide", function(){
			this.hideFader();
		}, this);

		var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
							  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		window.requestAnimationFrame = requestAnimationFrame;
	},

	render: function(){
		if(this._rendered) return this.$el;
		var content = this.options.content;
		
		if(_.isObject(content) || !content){
			this.options.content = "<div id='placeholder"+this.cid+"'>";
		}
		
		this.$el.append(this.template(this.options));
		this.setContent(content);
		this._rendered = true;
		return this.$el;
	},

	hide: function(){
		this.hidePopup();
		$("body").css("overflow", "auto");
	},

	createFader: function(){
		if(this.$fader) return this.$fader;
		
		if( !$("#fader").length ) {
			$("body").append("<div id='fader' class='in'></div>");	
		}
		this.$fader = $("#fader");
		return  this.$fader;
	},

	showFader: function(){
		if(!this.$fader){ this.createFader() };
		if(this.transitionEvent){
			var that = this;
			this.$fader.show().toggleClass("in", true);
			setTimeout( function(){
				that.$fader.removeClass("in");
				that.$fader.one(that.transitionEvent, function(evt){
					if(evt.target == that.$fader[0])
						that.trigger("fader:show");
				});
			},1);
		}else{
			this.$fader.removeClass("in");
			that.trigger("fader:show");
		}
	},

	hideFader: function(){
		if(this.transitionEvent){
			var that = this;
			this.$fader.toggleClass("in", true);
			this.$fader.one(that.transitionEvent, function(evt){
				if(evt.target == that.$fader[0]){
					that.$fader.hide();
					that.trigger("fader:hide");
				}
			});
		}else{
			this.$fader.hide();
			this.trigger("fader:hide");
		}
	},
	
	showPopup: function(){
		var $body = $(document.body);
		$body.append(this.render());
		$body.css("overflow", "hidden");
		if(this.transitionEvent){
			var that = this;
			that.$el.toggleClass("in", true);
			setTimeout( function(){
				that.$el.removeClass("in");
				that.$el.one(that.transitionEvent, function(evt){
					if(evt.target == that.$el[0])
						that.trigger("popup:show");
				});
			}, 1);
		}else{
			that.trigger("popup:show");
		}
	},

	hidePopup: function(){
		if(this.transitionEvent){
			var that = this;
			that.$el.toggleClass("in", true);
			this.$el.one(that.transitionEvent, function(evt){
				if(evt.target == that.$el[0]){
					that.$el.detach();
					that.trigger("popup:hide");
				}
			});
		}else{
			this.$el.detach();
			that.trigger("popup:hide");
		}
	},

	show: function(){
		this.showFader();
	},

	scroll: function(amount){
		this.$el.animate({
			'scrollTop': amount
		}, 200);
	},

	setContent: function(content){
		if(content) { 
			this.options.content = content;
			if (this._rendered) {
				this.$el.find('.popup__content').empty().append(content);
			} else {
				this.$el.find("#placeholder"+this.cid).replaceWith(content);
			}
		};
	},

	setWidth: function(width){
		if (width) {
			this.options.width = width;
			this.$el.find('.popup__inner').toggleClass().addClass('popup__inner')
				.addClass('span' + width);
		}
	}
},{
	showOnlyFader: function(callback){
		var transitionEvent = $.support.transition && $.support.transition.end;

		if(!$("#fader").length) {
			$("body").append("<div id='fader' class='in'></div>");
		}

		var fader = $("#fader");

		if(transitionEvent){
			var that = this;
			fader.show().toggleClass("in", true);
			setTimeout( function(){
				fader.removeClass("in");
				fader.one(transitionEvent, function(evt){
					if(evt.target == fader[0] && callback)
						callback();
				});
			},1);
		} else {
			fader.removeClass("in");
			callback();
		}
	},

	hideOnlyFader: function(callback){
		var transitionEvent = $.support.transition && $.support.transition.end;

		if(!$("#fader").length) return true;

		var fader = $("#fader");

		if(transitionEvent){
			var that = this;
			fader.toggleClass("in", true);
			fader.one(transitionEvent, function(evt){
				if(evt.target == fader[0]) {
					fader.hide();
					callback && callback();
				}
			});
		} else {
			fader.toggleClass("in", true);
			fader.hide();
			callback && callback();
		}
	}
});