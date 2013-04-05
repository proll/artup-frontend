aup.HeaderView = Backbone.View.extend({
	template: "blocks/header",
	el: ".page-header",

	initialize: function(){
		this.template = aup.Templates.get(this.template);
		this.render();
		this.model.on("change:currentItem", this.render, this);
	},
	render: function(){
		var template = this.template( this.model.get("items")[this.model.get("currentItem")] );	
		
		if( this.model.get("currentItem").title == this.model.defaults.currentItem.title ) {
			this.$el.toggleClass("hidden", true);
		} else {
			this.$el.toggleClass("hidden", false);
		}

		this.$el.html(template);
	}
});

