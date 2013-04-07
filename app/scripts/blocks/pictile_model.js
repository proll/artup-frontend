aup.PicTile = Backbone.Model.extend({
	defaults: {
		src: "",
		caption: "",
		comments_count: 0,
		i106x106: "http://img.weheartpics.com/photo/106x106/638255.jpg",
		i160x160: "http://img.weheartpics.com/photo/160x160/638255.jpg",
		i212x212: "http://img.weheartpics.com/photo/212x212/638255.jpg",
		i320x320: "http://img.weheartpics.com/photo/320x320/638255.jpg",
		i400x400: "http://img.weheartpics.com/photo/400x400/638255.jpg",
		i480x480: "http://img.weheartpics.com/photo/480x480/638255.jpg",
		i640x640: "http://img.weheartpics.com/photo/640x640/638255.jpg",
		i1000x1000: "http://img.weheartpics.com/photo/1000x1000/638255.jpg",
		id: 0,
		lazy: true,
		like: 0,
		site_url: "",
		timestamp: 1361882917
	},
	initialize: function (options) {
		this.view = new aup.PicTileView({model:this});
		this.view.on("pictile:loaderror", this.remove, this);
	},
	fetch: function () {
		this.set('width',  Math.round(Math.random() * 80) + 160);
		this.set('timestamp',  Math.round( this.get('timestamp') / (Math.random() * 1000000)) );
		this.set("src", this.get("i212x212"));
	},

	remove: function () {
		this.stopListening();
		this.clear({silent: true});
		this.view.remove();
	}
});