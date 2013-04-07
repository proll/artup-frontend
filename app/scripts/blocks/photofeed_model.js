aup.Photofeed = Backbone.Model.extend({
	defaults: {
		offset: 	0,
		limit: 		15,
		loading: 	false,
		sleeped: 	false,
		scrollload: true
	},

	initialize: function (options) {
		this.collection = new aup.PostCollection();

		this.collection.on("load:success", function () {
			this.set("offset", this.get("offset") + this.get("limit"));
			this.set("loading", false);
		}, this);
		this.collection.on("load:error", function () {
			console.error("photofeed:load:error")
			this.set("loading", false);
		}, this)
		this.collection.on("load:start", function () {
			this.set("loading", true);
		}, this)
		this.collection.on("add", this.addPic, this);
		this.collection.on("reset", this.resetPosts, this);

		this.view = new aup.PhotofeedView({
			collection:this.collection, 
			model: this
		});

		this.on("needmore", this.needMore, this);

		if(this.get("scrollload")) {
			aup.on("pagebottom:reached", function () {
				this.trigger("needmore");
			}, this);
		}

		this.trigger("needmore");
	},

	addPic: function (model, collection, options) {
		model.fetch();
	},

	resetPosts: function  (collection, options) {
		_.each(options.previousModels, function (model, key, list) {
			model.remove();	
		})
		this.collection.more = true;
	},

	needMore: function () {
		if(!this.get("loading") && !this.get("sleeped")) {
			var data = _.extend({},this.toJSON());
			this.collection.fetch({data: data});
		}
	},

	reset: function () {
		this.set("offset", this.defaults.offset);
		this.collection.reset();
		this.trigger("needmore");
		return false;
	},


	activate: function() {
		this.set("sleeped", false);
	},

	sleep: function() {
		this.set("sleeped", true);
	},
});