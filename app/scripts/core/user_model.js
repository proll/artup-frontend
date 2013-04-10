aup.User = Backbone.Model.extend({
	cookie_time : 365,

	defaults: {
		status: "",
		uid: "",
		token: ""
	},

	settings: null,


	initialize: function(){

		this.settings = new aup.UserSettings;
		this.settings.getGeoPosition();
		
		this.settings.on("error", function(err) {
			this.trigger("user:error", err);
		}, this)
		// переопрашиваем параметры пользователя если только меняется токен
		this.on("change:token", function (argument) {
			this.settings.fetch();
		}, this);

		this.getSession();

		
		/* Global events */
		aup.on("auth:success", 	this.setSession, 	this);
		aup.on("auth:clear", 	this.clearSession, 	this);
	},

	getSession: function () {
		var uid 	= _.getCookie("uid"),
			token 	= _.getCookie("token");

		if(!!uid && !!token) {
			this.set({
				uid: uid,
				token: token
			})
		}
	},

	is_auth: function() {
		return !!this.get('token');
	},

	setSession: function(user_obj) {
		_.setCookie("uid",	user_obj.session.uid,	this.cookie_time);
		_.setCookie("token",user_obj.session.token,	this.cookie_time);
		this.set(user_obj.session);
	},


	clearSession: function () {
		_.clearCookie("uid");
		_.clearCookie("token");	
		this.set({uid:"", token:""});
	}
});