aup.Navbar = Backbone.Model.extend({
	defaults:{
		user: null,
		items:[
			{
				title: 	"Подбор картин",
				name: 	"explore",
				link: "/explore",
				active: true
			},
			{
				title: 	"Все о проекте",
				name: 	"about",
				link: "/about"
			},
		],
		currentItem: "explore",
	},
	
	// TODO: доделать currentItem должен корелировать с items..active
	initialize: function(){
		this.view = new aup.NavbarView({model: this});
	}
});