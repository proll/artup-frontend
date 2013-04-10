aup.Router = Backbone.Router.extend({
	_previous_route: '',
	previous_route: '',

	current_route: '',
	
	_back_path: '',
	back_path: '',

	route_passed: 0,

	routes: {
		"": "default",
		"logout": "logout",
		"explore": "explore",
		"explore/": "explore",
		"explore/:category/:story/:sort/:filter/": "explore",
		"photofeed": "photofeed",
		"photofeed/": "photofeed",
		"photo/:photo/": "photo",
		"user/:user/": "user",
		
		"*default": "default",
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

	user: function () {
		// console.log("hello user");
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
				this.route_passed++;

				if(!this.back_path) {
				} else {

				}

				if(this._previous_route && this._previous_route != destination){
					this.trigger("reset", this._previous_route, destination, this._back_path);
					this.trigger("reset:" + this._previous_route);
				}
				this._previous_route = destination;
				this._back_path = Backbone.history.fragment;

			}, this)


		}, this);

		this.on('reset', function(_previous_route, destination, _back_path) {
			this.back_path = _back_path;
			this.current_route = destination;
			this.previous_route = _previous_route;
		})
	}

});