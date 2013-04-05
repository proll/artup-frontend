aup.StoryMenu = Backbone.Model.extend({
	url: "/api/story_tree/",
	defaults:{
		sort: "date",
		filter: "all",
		category: "whole",
		story: "whole",

		current_id: "allph",
		current_name: "All photos",
		is_default: true
	},


	initialize: function (options) {

		this.on("change:sort", function () {
			if(!this.get("sort")) 
				this.set("sort", this.defaults.sort);
		}, this);

		this.on("change:filter", function () {
			if(!this.get("filter")) 
				this.set("filter", this.defaults.filter);
		}, this);
		this.on("change:category", function () {
			if(!this.get("category")) 
				this.set("category", this.defaults.category);
		}, this);

		this.on("change:story", function () {
			if(!this.get("story")) 
				this.set("story", this.defaults.story);
		}, this);


		this.on("change", function () {
			this.changeCurrent();
			this.daily_list.set({
				sort: this.get("sort"),
				filter: this.get("filter"),
				story: 	this.get("story"),
			});
		}, this);

		this.on("load:success", function () {
			this.daily_list.activate();
		}, this);

		this.on("activate", function () {
			this.daily_list.activate();
		}, this);

		this.on("sleep", function () {
			this.daily_list.sleep();
		}, this);

		this.view = new aup.StoryMenuView({
			model: this
		});

		this.daily_list = new aup.DailyListMenu(options);
	},


	fetch: function (options) {
		options = options || {};
		options.type = "post";
		options.success  	= _.bind(this.success, this);
		options.error  		= _.bind(this.error, this);

		return Backbone.Model.prototype.fetch.call(this, options);
	},


	changeCurrent: function () {
		if( this.get("category") == this.defaults.category && this.get("story") == this.defaults.story ) {

			this.set("current_id",   this.defaults.current_id, {silent: true});
			this.set("current_name", this.defaults.current_name, {silent: true});
			this.set("is_default", true, {silent: true});

		} else if (this.get("category") == "daily"){
			// TODO: HACK story name get
			// think about refactor dailylist menu
			var txt = this.daily_list.view.$el.find(".story-menu__item-"+this.get("story")).text();
			if(!!txt) {
				this.set("current_id", 		false, 			{silent: true});
				this.set("current_name", 	this.daily_list.view.$el.find(".story-menu__item-"+this.get("story")).text(), 	{silent: true});
			} else {
				this.set("current_id", 		"daily", 			{silent: true});
				this.set("current_name", 	"Daily Stories", 	{silent: true});
			}
			this.set("is_default", false, {silent: true});

		} else if ( !!this.get("storycats") ) {

			var category = _.find( this.get("storycats"), {id: parseInt(this.get("category"))} );
			if(!!category) {
				if( this.get("story") == this.defaults.story ) {
						this.set("current_id", 		category.id, 	{silent: true});
						this.set("current_name", 	category.name, 	{silent: true});
				} else {
						var story = _.find(category.stories, {id: parseInt( this.get("story") )});
						this.set("current_id", 		false, 			{silent: true});
						this.set("current_name", 	story.name, 	{silent: true});
				}
			}
			this.set("is_default", false, {silent: true});

		}
	},



	success: function (model, response, options) {
		response = _.toJSON(response);
		if(!response.error) {
			this.trigger("load:success");
		} else {
			this.trigger("load:error");
		}
	},


	error: function (model, xhr, options) {
		this.trigger("load:error")
	}, 


	activate: function () {
		this.trigger("activate");
	},

	sleep: function () {
		this.trigger("sleep");
	}
});