aup.NavbarView = Backbone.View.extend({
	template: "blocks/navbar",
	el: ".navbar-header",
	_navItemPrefix:"navbar__item-",
	_navMiscPrefix:"nav__",

	events: {
		"click .nav__login>a": "login",
		"click .nav__logout>a": "logout",
		"click .nav__profile-drop>a": "toggleDrop",

		"click li>a": "mobileToggleDrop"
	},

	initialize: function(){
		this.template = aup.Templates.get(this.template);
		this.render();
		this.model.on("change:currentItem", this.changeItem, this);
		// aup.on("auth:required auth:not-required", this.render, this);
		aup.on("usersettings:ready", this.toggleAuth, this);
		aup.on("auth:clear", this.toggleUnauth, this);
		
	},
	render: function(){
		var template = this.template( this.model.toJSON() );	
		this.$el.html(template);
		this.$user_name = 	this.$el.find(".nav__profile-name");
		this.$user_avatar = this.$el.find(".i-no-avatar");
		$("html").on("click.navbar", _.bind(this.hideDrop, this));
	},

	toggleAuth: function(user_obj) {
		if(this.$user_name && this.$user_avatar) {
			this.$user_name.text(user_obj.user.name);
			if(!!user_obj.user.photo) {
				this.$user_avatar.html('<img src="'+user_obj.user.photo.i106x106+'" width="30" height="30"/>')
				
			}
		}
		this.$el.toggleClass("logged", true);
	},

	toggleUnauth: function() {
		if(this.$user_name && this.$user_avatar) {
			this.$user_name.text("");
			this.$user_avatar.html('');
		}
		this.$el.toggleClass("logged", false);
	},

	toggleDrop: function() {
		this.$el.toggleClass("open");
		return false;
	},

	mobileToggleDrop: function() {
		var is_mobile = $(window).width() < 650;
		if(is_mobile) {
			this.toggleDrop();
		}
	},

	hideDrop: function() {
		var is_mobile = $(window).width() < 650;
		if(!is_mobile) {
			this.$el.toggleClass("open", false);
		}
	},

	changeItem: function(model, opts) {
		var itemname = model.get("currentItem");
		console.log(itemname)
		this.$el.find(".nav li").toggleClass("active", false);
		this.$el.find(".nav li."+this._navItemPrefix+itemname).toggleClass("active", true);
		this.$el.find(".nav li."+this._navMiscPrefix+itemname).toggleClass("active", true);
	},

	login: function () {
		this.model.trigger("auth:show");
		return false;
	},

	logout: function () {
		this.model.trigger("navbar:logout");
		return false;
	}

});

