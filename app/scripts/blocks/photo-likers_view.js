whp.PhotoLikersView = Backbone.View.extend({
	template: 	'blocks/photo-likers',
	tagName: 	'div',
	className: 	'photo-likers',
	$image: null,
	image: null,

	initialize: function(options){
		this.template = whp.Templates.get(this.template);

		this.model.on('load:success', this.render, this);
		this.model.on('update:vote', this.updateTotal, this);
	},

	render: function(){
		var template = this.template(this.model.toJSON());
		this.$el.html(template);

		this.$total = this.$el.find('.photo-likers__total');
	},

	updateTotal: function(options) {
		if(!!options){
			// increment comment counter
			this.$el.toggleClass('photo-likers_my-vote', !!options.my);
			var total = options.vote_count;
			this.$total.data('total', total);

			this.$total.text(total + ' ' + Handlebars.helpers._decl_en(total, this.$total.data('decl')))	
		}
	}
	
});

