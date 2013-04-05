aup.Router = Backbone.Router.extend({
	_prevRoute: "",
	routes: {
		"": "default",
		"logout": "logout",
		"explore": "explore",
		"explore/": "explore",
		"explore/:category/:story/:sort/:filter/": "explore",
		"photofeed": "photofeed",
		"photofeed/": "photofeed",
		"photo/:photo/": "photo",
		"*default": "default"
	},


	explore: function () {
		// console.log("hello explore");
	},

	photofeed: function () {
		// console.log("hello photofeed");
	},

	photo: function () {
		// console.log("hello photo");
	},

	logout:function(){
		localStorage.clear();
		this.navigate("/");
		window.location.reload();
	},

	default: function(){
		console.log('no such route ', arguments);
		this.trigger("404", arguments);
		return false;
	},

	// Auto reset routes
	initialize: function(){
		_(this.routes).each(function(destination) {
			this.on("route:" + destination, function(){
				if(this._prevRoute && this._prevRoute != destination){
					this.trigger("reset", this._prevRoute, destination);
					this.trigger("reset:" + this._prevRoute);
				}
				this._prevRoute = destination;
			}, this)
		}, this);
	}

});