whp.PageView = Backbone.View.extend({
	el: "#whp-container",
	template: "",
	renderedHtml: null,

	initialize: function(options){
		if(!(options && options.template)){
			whp.error("Page must have a template");
			return;
		}
		this.template = whp.Templates.get(options.template);
		this.createDom();
	},

	createDom : function(){},

	render: function(){
		if (this.renderedHtml) {
			this.$el.append(this.renderedHtml);
		} else {
			var tmpDiv = $('<div></div>')
				.addClass('page-' + this.model.get('name'))
				.html(this.template(this.model.toJSON()));
			this.trigger("page:preRender", tmpDiv);
			this.$el.html(tmpDiv);
		}

		/**
		 * описываем в модели метод enterDocument
		 * выполнится после того как page отрисован
		 */
		this.model.enterDocument();
		this.trigger("page:render", this.model);
		this.trigger("enterDocument", this.model);
	},
	remove: function(){
		console.log("page remove");
		this.renderedHtml = this.$el.find('.page-' + this.model.get('name')).detach();
	}
});