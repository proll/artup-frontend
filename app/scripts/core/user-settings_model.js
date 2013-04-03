whp.UserSettings = Backbone.Model.extend({
	url: "/api/auth/me/",

	defaults: {
		geo_position: null,
		// account: {
		// 	login: "gpolushkin@gmail.com"},
		// social: {
		// 	facebook: {uid: 670638880}
		// },
		// user: {
		// 	bio: "",
		// 	first_name: "Gleb",
		// 	last_name: "P",
		// 	name: "Gleb P",
		// 	photo: {
		// 		i212x212: "http://img.weheartpics.com/photo/212x212/574899.jpg",
		// 		i400x400: "http://img.weheartpics.com/photo/400x400/574899.jpg",
		// 		i160x160: "http://img.weheartpics.com/photo/160x160/574899.jpg",
		// 		i106x106: "http://img.weheartpics.com/photo/106x106/574899.jpg",
		// 		i480x480: "http://img.weheartpics.com/photo/480x480/574899.jpg",
		// 		i640x640: "http://img.weheartpics.com/photo/640x640/574899.jpg",
		// 		i1000x1000: "http://img.weheartpics.com/photo/1000x1000/574899.jpg",
		// 		i320x320: "http://img.weheartpics.com/photo/320x320/574899.jpg",
		// 		id: 574899
		// 	},
		// 	fb_id: 670638880,
		// 	fb_name: "Gleb Polushkin",
		// 	followers_count: 3,
		// 	photos_count: 8,
		// 	followings_count: 4,
		// 	free_sms_count: 3,
		// 	background: {
		// 		i1000x314: "http://img.weheartpics.com/profile/bg/1000x314/93870.jpg?ts=1358367158",
		// 		i640x640: "http://img.weheartpics.com/profile/bg/640x640/93870.jpg?ts=1358367158",
		// 		i480x480: "http://img.weheartpics.com/profile/bg/480x480/93870.jpg?ts=1358367158",
		// 		i320x320: "http://img.weheartpics.com/profile/bg/320x320/93870.jpg?ts=1358367158",
		// 		i1000x1000: "http://img.weheartpics.com/profile/bg/1000x1000/93870.jpg?ts=1358367158"
		// 	},
		// 	events: 6,
		// 	id: 93870,
		// 	is_awesome: false
		// },
		// settings: {
		// 	opengraph: true
		// }
	},

	fetch: function(){
		var that = this;
		$.ajax({
			type: 'GET',
			url: _.toSafeUrl(this.url),
			dataType: 'json'
		})
		.success(function(response, status, xhr){
			that.success(response, status, xhr);
		})
		.error(function(response, status, xhr){
			that.error(data);
		})
	},

	success: function (response, status, xhr) {
		var user_info = _.toJSON(response);	
		if (!!user_info.error){
			//user id and token arent actual
			this.trigger("error", {description: "WHP/auth : check state ERROR after netcall!"})
		} else {
			this.set(user_info);
			this.trigger("usersettings:ready", user_info)
		}
	},

	error: function(response, status, xhr){
		this.trigger("error", {description: "WHP/auth : check state ERROR self!"})
	},

	getGeoPosition: function () {
		if(!this.get("geo_position")) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(_.bind(this.getGeoSuccess, this), _.bind(this.getGeoError, this));
			} else {
				error('not supported');
			}
		}
	},

	getGeoSuccess: function (position) {
		this.set("geo_position", position);
	},

	getGeoError: function (txt) {
		whp.error(txt)
	}
});