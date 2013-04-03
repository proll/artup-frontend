whp.PicTileGrid = Backbone.Model.extend({
	defaults: {
		offset: 	0,
		limit: 		30,
		filter: 	"all",
		sort: 		"date",
		user: 		null,
		
		loading: 	false,
		sleeped: 	true,
		scrollload: true,
		addphoto:   true,

	},

	initialize: function (options) {
		this.collection = new whp.PicTileCollection();

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
						.on("add", this.addPic, this)
						.on("reset", this.resetPics, this);

		this.view = new whp.PicTileGridView({
			collection:this.collection, 
			model: this
		});

		whp.on("geo_position:ready", this.needMore, this);
		this.on("needmore", this.needMore, this);


		if(this.get("scrollload")) {
			whp.on("pagebottom:reached", function () {
				this.trigger("needmore");
			}, this);
		}
	},

	addPic: function (model, collection, options) {
		model.fetch();
	},

	resetPics: function  (collection, options) {
		_.each(options.previousModels, function (model, key, list) {
			model.remove();	
		})
		this.collection.more = true;
	},

	needMore: function () {
		if(!this.get("loading") && !this.get("sleeped")) {
			// oldschool hack params compute
			var data = _.extend({},this.toJSON());
			if(!(data.sort == "location" && !whp.user.settings.get("geo_position"))) {

				// case if we show first pic-tile with addphoto
				if(data.addphoto && data.offset == 0) {
					data.limit--;
					this.set("offset", -1);
				}


				if(data.filter == "all"){
					delete data.filter;
				} else if(data.filter == "my"){
					data.filter = "user";
				}
				if(data.sort == "popular") data.sort = "trend";
				if(data.sort == "location") {
					var geo_position = whp.user.settings.get("geo_position");
					if(!!geo_position) {
						data.location = '{"longitude":' + geo_position.coords.longitude + ',"latitude":' + geo_position.coords.latitude + '}';
					}
				}

				if(data.category=="whole" || data.category=="daily") {
					delete data.category;
				}

				if(data.story=="whole") {
					delete data.story;
				}

				if(data.filter != "user" && data.filter != "friends" || !data.user) {
					delete data.user;
				}

				this.collection.fetch({data: data});
			} 
		}
	},

	reset: function () {
		this.set("offset", this.defaults.offset);
		this.collection.reset();
		this.trigger("needmore");
		return false;
	},

	reload: function () {
		this.reset();
		this.trigger("needmore");
	},

	activate: function() {
		this.set("sleeped", false);
		this.trigger("needmore");
	},

	sleep: function() {
		this.set("sleeped", true);
	},
});