aup.Photo = Backbone.Model.extend({
	base_url: "http://api.artupp.ru/v1/links/",
	url: "http://api.artupp.ru/v1/links/",
	defaults: {
		sleeped: true,
		id: 0,
		// photo: {
		// 	story: {
		// 		storycat: {
		// 			pinterest_hashtags: "#WorkAndStudy",
		// 			id: 4,
		// 			name: "Work & Study"
		// 		},
		// 		type: "STORY",
		// 		pinterest_hashtags: "#MyOffice",
		// 		id: 34,
		// 		name: "My office"
		// 	},
		// 	i106x106: "http://img.weheartpics.com/photo/106x106/705413.jpg",
		// 	i160x160: "http://img.weheartpics.com/photo/160x160/705413.jpg",
		// 	i212x212: "http://img.weheartpics.com/photo/212x212/705413.jpg",
		// 	i320x320: "http://img.weheartpics.com/photo/320x320/705413.jpg",
		// 	i400x400: "http://img.weheartpics.com/photo/400x400/705413.jpg",
		// 	i480x480: "http://img.weheartpics.com/photo/480x480/705413.jpg",
		// 	i640x640: "http://img.weheartpics.com/photo/640x640/705413.jpg",
		// 	i1000x1000: "http://img.weheartpics.com/photo/1000x1000/705413.jpg",
		// 	like: 33,
		// 	timestamp: 1364371188,
		// 	usertags: [ ],
		// 	site_url: "http://weheartpics.com/photo/705413/",
		// 	caption: "We're always on top of the latest news #newspaper #morning",
		// 	delta: 33,
		// 	comments_count: 0,
		// 	user: {
		// 		awesome_account: {
		// 			color: 0,
		// 			glow: false
		// 		},
		// 		tw_name: "WeHeartPicsCom",
		// 		id: 6176,
		// 		is_awesome: true,
		// 		name: "We Heart Pics"
		// 	},
		// 	wasvote: 0,
		// 	id: 705413,
		// 	location: {
		// 		name: "",
		// 		longitude: 37.6213,
		// 		foursquare_id: null,
		// 		address: "Россия, Москва",
		// 		latitude: 55.7054,
		// 		id: 28683
		// 	}
		// }
	},

	initialize: function (options) {
		var template = 'blocks/photo';
		if(_.isPhone()) {
			template = 'blocks/photo_phone';
		}

		this.view = new aup.PhotoView({template:template, model:this});
		this.on("load:success", this.initMisc, this)
	},


	initMisc: function () {
//		this.photo_likers = new aup.PhotoLikers({
//			id: 		this.get("id"),
//			//likers_count: 	this.get("photo").like,
//			photo_model: 	this
//		})
//		this.view.addLikers(this.photo_likers);

//		this.photo_comments = new aup.CommentPane({
//			id: 		this.get("photo_id"),
//			limit:          6,
//			total: 			this.get("photo").comments_count
//		});
//		this.view.addComments(this.photo_comments);

//		this.photo_share = new aup.PhotoShare({
//			photo_id: 			this.get("photo_id"),
//			photo_link: 		this.get('photo').i1000x1000,
//			photo_sm_link: 		this.get('photo').i106x106,
//			link: 				this.get('photo').site_url,
//			story_name: 		this.get('photo').story.name,
//			caption: 			this.get('photo').caption,
//			user: 				this.get('photo').user,
//			story: 				this.get('photo').story,
//			apple_store_link: 	'http://itunes.apple.com/app/weheartpics/id488515478?mt=8',
//		});
//		this.view.addShare(this.photo_share);

		this.trigger('photo:ready');
	},

	fetch: function (options) {
		options = options || {};
		options.type = "get";
		this.url = this.base_url + this.get("id");
		options.data = options.data || {};

		options.success  	= _.bind(this.success, this);
		options.error  		= _.bind(this.error, this);

		this.trigger("load:start");

		return Backbone.Collection.prototype.fetch.call(this, options);
	},

	success: function (collection, response, options) {
		response = _.toJSON(response);
		this.set(response);
		if(!response.error) {
			this.trigger("load:success");
		} else {
			this.trigger("load:error");
		}
	},

	error: function (collection, xhr, options) {
		this.trigger("load:error")
	},

	reset: function () {
//		 this.set("offset", this.defaults.offset);
//		 this.collection.reset();
//		 this.trigger("needmore");
		return false;
	},

	activate: function() {
		this.set("sleeped", false);
		this.fetch();
	},

	sleep: function() {
		this.set("sleeped", true);
	},

//	addVote: function() {
//		if(aup.is_needauth()) {
//			return false;
//		} else {
//			this.get("photo").like++;
//			this.get("photo").wasvote = 1;
//			this.vote(1);
//			return this;
//		}
//
//	},

//	removeVote: function() {
//		this.get("photo").like--;
//		this.get("photo").wasvote = 0;
//		this.vote(0);
//	},

//
//	// TODO: Have to do secure call of ajax
//	// without repeat requests
//	vote: function(is_like) {
//		$.ajax({
//			url: 	'/api/photo/vote/',
//			type: 	'POST',
//			data : {
//				photo: 	this.get("id"),
//				like: 	is_like
//			},
//			timeout: 30000
//		});
//
//		this.trigger("update:vote", {vote_count: this.get("photo").like, my: is_like});
//	},

	remove: function () {
//		this.photo_likers.remove();
//		this.photo_comments.remove();
//		this.photo_share.remove();

		this.stopListening();
		this.clear({silent: true});
		this.view.remove();
	},
});