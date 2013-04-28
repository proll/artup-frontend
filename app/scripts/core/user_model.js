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
		var uid 	= localStorage.getItem("aup_uid");
			token 	= localStorage.getItem("aup_token");

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
		localStorage.setItem("aup_uid", user_obj.session.uid);
		localStorage.setItem("aup_token", user_obj.session.token);
		this.set(user_obj.session);
	},


	clearSession: function () {
		localStorage.setItem("aup_uid", "");
		localStorage.setItem("aup_token", "");
		this.set({uid:"", token:""});
	}
});