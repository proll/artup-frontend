whp.Navbar = Backbone.Model.extend({
	defaults:{
		user: null,
		items:[
			{
				title: 	"Photofeed",
				name: 	"photofeed",
				link: "/photofeed",
				active: true
			},
			{
				title: 	"Explore",
				name: 	"explore",
				link: "/explore",
			},
			{
				title: 	"Popular",
				name: 	"popular",
				link: "/explore/5/41/popular/all/",
			},
		],
		currentItem: "photofeed",
	},
	
	// TODO: доделать currentItem должен корелировать с items..active
	initialize: function(){
		this.view = new whp.NavbarView({model: this});
	}
});