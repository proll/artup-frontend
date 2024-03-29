aup.AuthView = Backbone.View.extend({
	el: ".auth-popup",
	template: "popups/auth",
	rendered: false,

	events: {
		"click .auth-popup_close": "hide",

		// unmark all error inputs 
		"keypress :input": 	"errorInputUnmark",
		"click :input": 	"errorInputUnmark",

		// clicks to social
		"click .login-via-fb"	: "loginFB",
		"click .login-via-tw"	: "loginTW",
		"click .login-via-vk"	: "loginVK",

		// login form
		"click .login-via-email": 				"showLoginByEmailForm",
		"click .auth-popup__login-email_back": 	"hideLoginByEmailForm",
		"click .auth-popup__login-email_ok": 	"postSigninForm",
		"submit .auth-popup__login-email>form": "postSigninForm",

		"keyup #login-email": 	"switchPostButton",
		"keyup #login-password": "switchForgotPassword",

		// registration form
		"keyup #registration-email": 				"errorRegistrationHide",
		"keyup #registration-password": 			"errorRegistrationHide",
		"click 	.auth-popup__registration_next": 	"registrationNext",
		"submit .auth-popup__registration>form": 	"registrationNext",

		"click 	.auth-popup__registration_back": 		"hideRegistrationStep2Form",

		"keyup #registration-first_name": 				"errorRegistrationStep2Hide",
		"keyup #registration-last_name": 				"errorRegistrationStep2Hide",
		"click 	.auth-popup__registration_ok": 			"postRegistrationForm",
		"submit .auth-popup__registration-names>form": 	"postRegistrationForm",
	},

	initialize: function(options){
		this.template = aup.Templates.get(this.template);
	},

	render: function(){
		if (!this.rendered) {
			this.rendered = true;
			this.$el.append( this.template(this.model.toJSON()));
			this.$login_email_container = 	this.$el.find(".auth-popup__login-email");
			this.$login_email_form = 	this.$el.find(".auth-popup__login-email form");
			this.$login_email_forget = 	this.$el.find(".auth-popup__login-email_forgot");
			this.$login_email_ok = 		this.$el.find(".auth-popup__login-email_ok");
			this.$login_email = 	this.$login_email_form.find("#login-email");
			this.$login_password = 	this.$login_email_form.find("#login-password");
			this.$login_error = 	this.$el.find(".auth-popup__login-error");

			this.on("error:signin", this.errorSignin, this);
			this.model.signin.on("error", this.errorSignin, this);

			this.$registration_form = 	this.$el.find(".auth-popup__registration form");
			this.$registration_email = 	this.$registration_form.find("#registration-email");
			this.$registration_password = 	this.$registration_form.find("#registration-password");
			this.$registration_error = 	this.$el.find(".auth-popup__registration-error");

			this.$registration_step2_container  = 	this.$el.find(".auth-popup__registration-names");
			this.$registration_step2_form  = 		this.$el.find(".auth-popup__registration-names form");
			this.$registration_first_name = 		this.$registration_step2_form.find("#registration-first_name");
			this.$registration_last_name = 			this.$registration_step2_form.find("#registration-last_name");
			this.$registration_step2_error = 		this.$el.find(".auth-popup__registration-names-error");

			this.on("error:registration", 		this.errorRegistration, this);
			this.on("error:registration:step2", this.errorRegistrationStep2, this);
			this.model.registration.on("error", this.errorRegistrationStep2, this);


			this.model.on("auth:success",						this.hide, this);
			this.model.registration.on("registration:pending", 	this.hide, this);

			this.model.on("auth:show", this.show, this);
		}


	},

	show: function () {
		console.log(this.$el)
		this.$el.toggleClass("hide", false);
		return false;
	},

	hide: function () {
		this.$el.toggleClass("hide", true);
		return false;
	},


	// social Login = registration
	loginFB: function () {
		this.model.FB.login(event);
		return false;
	},

	loginTW: function () {
		this.model.TW.login(event);
		return false;
	},

	loginVK: function () {
		this.model.VK.login(event);
		return false;
	},


	// Login by email
	showLoginByEmailForm: function (e) {
		this.$login_email_container.fadeIn();
		return false;
	},

	hideLoginByEmailForm: function (e) {
		this.$login_email_container.fadeOut();
		return false;
	},

	switchForgotPassword: function (e) {
		this.errorSigninHide(e);
		if (e.target.value) {
			this.$login_email_forget.fadeIn();
		} else {
			this.$login_email_forget.fadeOut();
		}
	},

	switchPostButton: function (e) {
		this.errorSigninHide(e);
		if (e.target.value) {
			this.$login_email_ok.fadeIn();
		} else {
			this.$login_email_ok.fadeOut();
		}
	},

	postSigninForm: function (e) {
		e.preventDefault();
		e.stopPropagation();

		var login = 	this.$login_email.val(),
			password = 	this.$login_password.val();
		// validation
		if(!_.isEmail(login)) {
			this.trigger("error:signin", {type: "login", description:"Doesn't look like a valid email!"})
		} else if (!password){
			this.trigger("error:signin", {type: "password", description:"Do you have an empty password?"})
		} else {
			this.model.signin.login(
				{
					login: 		login, 
					password: 	password
				});
		}
		return false;
	},

	errorSignin: function(err) {
		if(err.type == "password") {
			this.$login_password.focus();
		} else  {
			this.$login_email.focus();
		}
		this.$login_error.text(err.description);
		this.$login_error.fadeIn();
	},

	errorSigninHide: function (e) {
		if(!!e && !!e.keyCode && e.keyCode == 13) return false;
		this.$login_error.hide();
		return false;
	},


	// Registration
	registrationNext: function (e) {
		e.preventDefault();
		e.stopPropagation();

		var login = 	this.$registration_email.val(),
			password = 	this.$registration_password.val();
		// validation
		if(!_.isEmail(login)) {
			this.trigger("error:registration", {type: "login", description:"Doesn't look like a valid email!"})
		} else if (password.length < 6){
			this.trigger("error:registration", {type: "password", description:"Please use at least 6 characters"})
		} else if (password.length > 16){
			this.trigger("error:registration", {type: "password", description:"You can't use more than 16 characters"})
		} else {
			this.showRegistrationStep2Form();
		}
		return false;
	},

	showRegistrationStep2Form: function (e) {
		this.$registration_step2_container.fadeIn();
		return false;
	},

	hideRegistrationStep2Form: function (e) {
		this.errorRegistrationStep2Hide(e)
		this.$registration_step2_container.fadeOut();
		return false;
	},

	errorRegistration: function(err) {
		if(err.type == "password") {
			this.errorInputMark(this.$registration_password);
			this.$registration_password.focus();
		} else  {
			this.errorInputMark(this.$registration_email);
			this.$registration_email.focus();
		}
		this.$registration_error.text(err.description);
		this.$registration_error.fadeIn();
	},

	errorRegistrationHide: function (e) {
		if(!!e && !!e.keyCode && e.keyCode == 13) return false;
		this.$registration_error.hide();
		return false;
	},



	postRegistrationForm: function (e) {
		e.preventDefault();
		e.stopPropagation();

		var login = 	this.$registration_email.val(),
			password = 	this.$registration_password.val(),
			first_name = 	this.$registration_first_name.val(),
			last_name = 	this.$registration_last_name.val();
		// validation
		// with validating email and password justfor sure
		if(!_.isEmail(login)) {
			this.trigger("error:registration:step2", {type: "login", description:"Doesn't look like a valid email!"});
		} else if (password.length < 6){
			this.trigger("error:registration:step2", {type: "password", description:"Please use at least 6 characters"});
		} else if (password.length > 16){
			this.trigger("error:registration:step2", {type: "password", description:"You can't use more than 16 characters"});
		} else if (!first_name) {
			this.trigger("error:registration:step2", {type: "first_name", description:"Enter your first name"});
		} else if (!last_name) {
			this.trigger("error:registration:step2", {type: "last_name", description:"Enter your last name"});
		} else {
			this.model.registration.fetch(
				{
					login: 		login, 
					password: 	password,
					first_name: first_name,
					last_name: 	last_name
				});
		}
		return false;
	},

	errorRegistrationStep2: function(err) {
		if(err.type == "first_name") {
			this.errorInputMark(this.$registration_first_name);
			this.$registration_first_name.focus();
		} else if(err.type == "last_name") {
			this.errorInputMark(this.$registration_last_name);
			this.$registration_last_name.focus();
		}
		this.$registration_step2_error.text(err.description);
		this.$registration_step2_error.fadeIn();
	},

	errorRegistrationStep2Hide: function (e) {
		if(!!e && !!e.keyCode && e.keyCode == 13) return false;
		this.$registration_step2_error.hide();
		return false;
	},

	errorInputMark: function ($el) {
		$el.toggleClass("input_error", true)
	},
	errorInputUnmark: function (e) {
		this.$el.find(":input").toggleClass("input_error", false)
	}
});