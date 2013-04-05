aup.Post = Backbone.Model.extend({
	defaults: {
		type: "PHOTO",
		group: 4334856,
		user: {},
		photo: {
			id: 688607,
			story: {
				type: "DAILY",
				pinterest_hashtags: "#Daily #Story #feet",
				id: 909,
				name: "My legs"
			},
			site_url: 	"http://weheartpics.com/photo/688607/",
			i106x106: 	"http://img.weheartpics.com/photo/106x106/688607.jpg",
			i160x160: 	"http://img.weheartpics.com/photo/160x160/688607.jpg",
			i212x212: 	"http://img.weheartpics.com/photo/212x212/688607.jpg",
			i320x320: 	"http://img.weheartpics.com/photo/320x320/688607.jpg",
			i400x400: 	"http://img.weheartpics.com/photo/400x400/688607.jpg",
			i480x480: 	"http://img.weheartpics.com/photo/480x480/688607.jpg",
			i640x640: 	"http://img.weheartpics.com/photo/640x640/688607.jpg",
			i1000x1000: "http://img.weheartpics.com/photo/1000x1000/688607.jpg",
			like: 4,
			timestamp: 1363775313,
			caption: "",
			delta: 4,
			comments_count: 0,
			user: {
				tw_name: "photokatastrofa",
				id: 150219,
				is_awesome: false,
				name: "Rashid Galiev"
			},
			wasvote: 0,
			usertags: [ ]
		},
		timestamp: 1363775315
	},
	initialize: function (options) {
		this.view = new aup.PostView({model:this});
		this.view.on("post:loaderror", this.remove, this);
	},
	fetch: function () {
		this.view.render();
	},

	remove: function () {
		this.stopListening();
		this.clear({silent: true});
		this.view.remove();
	}
});