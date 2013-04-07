aup.DailyListMenu = Backbone.Model.extend({
	url: "/api/story/daily/list/",
	defaults:{
		offset: 	0,
		limit: 		14,
		filter: 	"all",
		sort: 		"date",
		loading: 	false,
		sleeped: 	false,
		scrollload: true,

		stories: null,
		story: "whole",
	},


	initialize: function (options) {
		this.on("change:story", function () {
			if(!this.get("story")) 
				this.set("story", this.defaults.story);
		}, this);


		this.view = new aup.DailyListMenuView({
			model: this
		});

		this.fetch();
	},


	fetch: function (options) {
		this.set("loading", true);

		options = options || {};
		options.type = "post";
		options.data = options.data || {
			offset: 	this.get("offset"),
			limit: 		this.get("limit"),
		};

		// console.log(options)


		options.success  	= _.bind(this.success, this);
		options.error  		= _.bind(this.error, this);

		return Backbone.Model.prototype.fetch.call(this, options);
	},


	success: function (model, response, options) {
		response = _.toJSON(response);
		if(!response.error) {
			this.trigger("load:success");
		} else {
			this.trigger("load:error");
		}
		this.set("loading", false);
	},


	error: function (model, xhr, options) {
		this.trigger("load:error")
		this.set("loading", false);
	}, 


	activate: function () {
		this.set("sleeped", false);
		this.trigger("activate");
	},

	sleep: function () {
		this.set("sleeped", true);
		this.trigger("sleep");
	}
});