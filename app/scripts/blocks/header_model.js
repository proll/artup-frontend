aup.Header = Backbone.Model.extend({
	defaults:{
		items:{
			photofeed:{
				title: 	"Photofeed",
				description: "Here you can find hot photo reports from friends"
			},
			explore:{
				title: 	"Explore",
				description: 	"Here you can find hot photo reports from friends"
			},
			popular:{
				title: 	"Popular",
				description: 	"The most popular photos for last 24 hours"
			},
			about:{
				title: 	"About",
				description: 	"Here you can find hot photo reports from friends"
			},
			notifications:{
				title: 	"Notifications",
				description: 	"Here you can find hot photo reports from friends"
			},
			dialogs:{
				title: 	"Dialogs",
				description: 	"Here you can find hot photo reports from friends"
			},
			default:{
				title: 	"Default",
				description: 	"So i'm so default"
			}
		},
		currentItem: "photofeed"
	},
	
	// TODO: доделать currentItem должен корелировать с items..active
	initialize: function(){
		this.view = new aup.HeaderView({model: this});
		// aup.on("auth:success", 	this.setUser, this);
		// aup.on("user:update", 	this.setUser, this);
	},

	changeItem: function (itemName) {
		if(!!this.get("items")[itemName]) {
			this.set("currentItem",itemName);
		} else {
			this.set("currentItem", "default");
		}
	}
	// ,

	// setUser: function(userObj){
	// 	if(!!this.get("user")) {
	// 		var tObj = _.extend({}, this.get("user"))
	// 		userObj = _.extend(tObj, userObj);
	// 	} else {
	// 		userObj = _.extend({}, userObj)
	// 	}
	// 	this.set("user", userObj);
	// }
});