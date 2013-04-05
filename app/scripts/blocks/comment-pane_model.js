aup.CommentPane = Backbone.Model.extend({
	url: "/api/photo/comment/add/",
	defaults: {
		offset: 	0,
		limit: 		3,
		order: 		"DESC",
		photo_id: 	0,
		
		loading: 	false,
		adding: 	false,
		sleeped: 	true,

		next_limit: 100,
	},

	initialize: function (options) {

		this.collection = new aup.CommentCollection();

		this.collection.on("load:success", function () {
					this.set("offset", this.get("offset") + this.get("limit"));
					this.set("loading", false);
				}, this)
				.on("load:error", function () {
					console.error("pic_grid:load:error")
					this.set("loading", false);
				}, this)
				.on("load:start", function () {
					this.set("loading", true);
				}, this)
				.on("reset", this.resetComments, this);

		this.on("addcomment:start", function () {
				this.set('adding', true);
			},this)
			.on("addcomment:success", function () {
				this.set('adding', false);
			},this)
			.on("addcomment:error", function () {
				this.set('adding', false);
			},this)

		this.view = new aup.CommentPaneView({
			collection: this.collection, 
			model: this
		});

		this.on("needmore", this.needMore, this);

		this.activate();
	},

	resetComments: function  (collection, options) {
		_.each(options.previousModels, function (model, key, list) {
			model.remove();	
		})
		this.collection.more = true;
	},

	needMore: function () {
		if(!this.get("loading") && !this.get("sleeped")) {

			// oldschool hack params compute
			var data = _.extend({}, this.toJSON());

			// case if we want to load more in the second time
			if( data.next_limit != data.limit && data.offset != 0 ) {
				data.limit = data.next_limit;
			}

			data.photo = data.photo_id;
			delete data.photo_id;
			delete data.loading;
			delete data.sleeped;
			delete data.next_limit;

			this.collection.fetch({data: data});
		}
	},

	remove: function () {
		this.collection.reset();

		this.stopListening();
		this.view.remove();
		this.clear({silent: true});

		return false;
	},

	activate: function() {
		this.set("sleeped", false);
		this.trigger("needmore");
		return this;
	},

	sleep: function() {
		this.set("sleeped", true);
		return this;
	},



	// add my new comment
	addMyComment: function(text) {
		var new_comment = new aup.Comment({
			date: (new Date()).getTime()/1000,
			text: text,
			user: aup.app.user.settings.get("user")
		})
		this.collection.unshift(new_comment);
		this.addComment(text);
		return this;
	},

	addComment: function(text) {
		var options = {};
		options.type = "post";
		options.data = options.data || {
			photo: this.get("photo_id"),
			text: text,
		};

		options.success  	= _.bind(this.addSuccess, this);
		options.error  		= _.bind(this.addError, this);

		this.trigger("addcomment:start");

		return Backbone.Model.prototype.fetch.call(this, options);	
	},

	addSuccess: function (collection, response, options) {
		response = _.toJSON(response);
		if(!response.error) {
			this.trigger("addcomment:success");
		} else {
			this.trigger("addcomment:error");
		}
	},

	addError: function (collection, xhr, options) {
		this.trigger("addcomment:error")
	},


});