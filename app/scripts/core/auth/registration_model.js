whp.Registration = Backbone.Model.extend({
	url: 		"/api/auth/signup/",

	initialize: function (){},


	fetch: function(user_obj){
		var that = this;
		$.ajax({
			type: 'POST',
			url:  _.toSafeUrl(this.url),
			dataType: 'json',
			data: {
				login : user_obj.login, 
				passw : user_obj.password,
				first_name: user_obj.first_name,
				last_name: user_obj.last_name
			}
		})
		.success(function(response, status, xhr){
			that.success(response, status, xhr);
		})
		.error(function(response, status, xhr){
			that.error(response, status, xhr);
		})
	},

	success: function(response, status, xhr){
		var resp = _.toJSON(response);
		if (!!resp) {
			if (!!resp.error) {
				if (resp.error.code == "API_AlreadyInUse") {
					this.trigger("error", {type:"login", description:"This email already registered"});
				} else if (resp.error.code == "API_BadParams") {
					this.trigger("error", {description:"Enter your first and last name"});
				} else if (resp.error.code == "API_PendingConfirmation") {
					this.trigger("error", {description:"We have sent you an e-mail to confirm"});
				} else {
					this.trigger("error", {description:"Something went wrong"});
				}
				// TODO: может припилить переход на /confirmation если API_PendingConfirmation
			} else if(!!resp.state && resp.state == "PENDING_CONFIRMATION"){
				this.trigger("registration:pending");
			} else {
				this.trigger("registration:success");
				this.trigger("auth:success", 
					{
						response: resp,
						user: resp.user, 
						session:{ token: resp.user.token, uid: resp.user.id }
					}
				);
			}
		} else {
			this.trigger("error", {description:"Something went wrong"});
		}
		// WHP.controller.setTitle();
	},

	error : function(e) {
		this.trigger("error", {description:"Something went wrong"});
	}
});