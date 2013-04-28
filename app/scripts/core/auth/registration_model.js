aup.Registration = Backbone.Model.extend({
	url: 		"http://api.artupp.ru/v1/users/",

	initialize: function (){},


	fetch: function(user_obj){
		var that = this;
		$.ajax({
			type: 'POST',
			url:  _.toSafeUrl(this.url),
			dataType: 'json',
			data: {
				email : 	user_obj.login, 
				password : 	user_obj.password,
				name: 		user_obj.first_name + ' ' + user_obj.last_name
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
				this.trigger("error", {description:"Something went wrong ("+resp.error+")"});
			} else {
				this.trigger("registration:success");
				this.trigger("auth:success", 
					{
						response: resp,
						user: resp.user, 
						session:{ token: resp.result.token, uid: resp.result.user.id }
					}
				);
			}
		} else {
			this.trigger("error", {description:"Something went wrong"});
		}
		// aup.controller.setTitle();
	},

	error : function(e) {
		this.trigger("error", {description:"Something went wrong"});
	}
});