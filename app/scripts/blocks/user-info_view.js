aup.UserInfoView = Backbone.View.extend({
	template: 'blocks/user-info',
	tagName: 'div',
	className: 'user-info',

	initialize: function(options){
		if(!!options.template) {
			this.template = options.template;
		}
		this.template = aup.Templates.get(this.template);
		this.model.on('load:success', this.render, this);
		this.model.on('change:sleeped', this.reset, this);
	},

	render: function(){
		var template = this.template(this.model.toJSON());
		this.$el.html(template);

		// var nm = this.model.get('user').name;
		// if( nm ) {
		// 	$('header h1').html(nm);
		// }

		// this.lazy_loader = new aup.LazyLoader();
		// this.lazy_loader.load(this.$el);
	},

	reset: function() {
		// delete this.lazy_loader;
		this.undelegateEvents();
		this.$el.html('');
	}
});

