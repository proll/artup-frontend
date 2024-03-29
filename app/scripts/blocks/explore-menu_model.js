aup.ExploreMenu = Backbone.Model.extend({
	defaults:{
		sorts:[
			{
				name: "date",
				title: "Дата"
			},
			{
				name: "location",
				title: "Гео"
			},
			{
				name: "popular",
				title: "Популярное"
			}
		],
		filters:[
			{
				name: "all",
				title: "Все"
			},
			{
				name: "friends",
				title: "Около"
			},
			{
				name: "my",
				title: "Моё"
			}
		],
		sort: "date",
		filter: "all",
		story: "whole",
		category: "whole",
	},

	initialize: function (options) {

		if(!!options.filter && !!options.sort) {
			console.log(options)
		}

		this.on("change:sort", function () {
			if(!this.get("sort")) 
				this.set("sort", this.defaults.sort);
		}, this);

		this.on("change:filter", function () {
			if(!this.get("filter")) 
				this.set("filter", this.defaults.filter);
		}, this);

		this.on("change:story", function () {
			if(!this.get("story")) 
				this.set("story", this.defaults.story);
		}, this);

		this.on("change:category", function () {
			if(!this.get("category")) 
				this.set("category", this.defaults.category);
		}, this);

		this.view = new aup.ExploreMenuView({
			model: this
		});
	},
});