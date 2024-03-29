aup.PicTileGrid = Backbone.Model.extend({
	defaults: {
		offset: 	0,
		limit: 		30,
		filter: 	"all",
		sort: 		"date",
		user: 		null,

		max_timestamp: 0,
		
		loading: 	false,
		sleeped: 	true,
		scrollload: true,
		timestamp_offset: false,
		addphoto:   false,

	},

	initialize: function (options) {
		this.collection = new aup.PicTileCollection();

		this.collection.on("load:success", function () {
							this.set("offset", this.get("offset") + this.get("limit"));
							if(this.collection.models && this.collection.models.length) {
								this.set('max_timestamp', _.last(this.collection.models).get('timestamp'));
							}
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

		this.view = new aup.PicTileGridView({
			collection:this.collection, 
			model: this
		});

		aup.on("geo_position:ready", this.needMore, this);
		this.on("needmore", this.needMore, this);


		if(this.get("scrollload")) {
			aup.on("pagebottom:reached", function () {
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
			if(!(data.sort == "location" && !aup.user.settings.get("geo_position"))) {

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
					var geo_position = aup.user.settings.get("geo_position");
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

				if(!data.user) {
					delete data.user;
				}

				if(this.get('timestamp_offset') && (data.sort === 'date' || !!data.sort)) {
					delete data.offset;
				} else {
					delete data.max_timestamp;
				}


				// clear out unnesessary fields
				delete data.loading;
				delete data.sleeped;
				delete data.scrollload;
				delete data.timestamp_offset;
				delete data.addphoto;

				this.collection.fetch({data: data});
			} 
		}
	},

	reset: function () {
		this.set("offset", this.defaults.offset);
		this.set("max_timestamp", Math.ceil((new Date()).getTime()/1000));
		this.collection.reset();
		this.trigger("needmore");
		return false;
	},

	reload: function () {
		this.reset();
		this.trigger("needmore");
	},

	activate: function() {
		this.set("offset", this.defaults.offset);
		this.set("max_timestamp", Math.ceil((new Date()).getTime()/1000));
		this.set("sleeped", false);
		this.trigger("needmore");
	},

	sleep: function() {
		this.set("sleeped", true);
	},
});