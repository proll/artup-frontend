whp.CommentPaneView = Backbone.View.extend({
	tagName: 'div',
	className: 'comment-pane',
	template: 'blocks/comment-pane',

	events: {
		'click .comment-pane__more': 'moreClick',
		'click .comment-pane__add':  'inputFocus'
	},

	initialize: function(options){
		this.collection = options.collection;
		this.collection.on('add', 			this.addComment, this)
						.on('load:start', 	this.showStartLoad, this)
						.on('load:success', this.hideStartLoad, this)
						.on('load:error', 	this.hideStartLoad, this);

		this.model = options.model;

		this.render();
	},

	render: function(){
		var template = whp.Templates.get(this.template);
		this.$el.html(template(this.model.toJSON()));

		this.$cont = 	this.$el.find('.comment-pane__container');
		this.$spinner = this.$el.find('.comment-pane__spinner');
		this.$more =	this.$el.find('.comment-pane__more');
		this.$total =	this.$el.find('.comment-pane__total');

		this.showStartLoad();

		this.$input = this.$el.find('textarea');
		this.$input.autosize();

		var _this = this;
		this.$input.bind('keypress', function (e){
		 	if (e.keyCode === 13 && !e.altKey){
				_this.addMyComment();
				return false;
			}


		});
	},

	addComment: function (model, collection, options) {
		if( !!options && options.at === 0 ) {
			this.$cont.append(model.view.$el);
		} else {
			this.$cont.prepend(model.view.$el);
		}
	},



	addMyComment: function() {
		var text = $.trim(this.$input.val());
		if(!text || this.model.get('adding')) return;

		this.model.addMyComment( text );

		// clear textarea
		this.$input.val('');
		this.$input.blur();
		this.$input.trigger('autosize');

		this.incTotal();
	},

	incTotal: function () {
		// increment comment counter
		this.$el.toggleClass('comment-pane_empty', false);
		this.$el.toggleClass('comment-pane_my-comment', true);
		var total = this.$total.data('total') || 0;
		total++;
		this.$total.data('total', total);

		this.$total.text(total + ' ' + Handlebars.helpers._decl_en(total, this.$total.data('decl')))
	},

	inputFocus: function() {
		this.$input.focus();
		return this;
	},

	showStartLoad: function () {
		this.$el.toggleClass('comment-pane_loading', true);
	},

	hideStartLoad: function () {

		if(!this.collection.length) {
			this.$el.toggleClass('comment-pane_empty', true);
		} else {
			this.$el.toggleClass('comment-pane_empty', false);
		}

		if(this.collection.more) {
			this.$el.toggleClass('comment-pane_can-more', true);
		} else {
			this.$el.toggleClass('comment-pane_can-more', false);
		}

		this.$el.toggleClass('comment-pane_loading', false);
	},

	moreClick: function() {
		this.model.trigger('needmore');
	},

	remove: function() {
		this.$input.unbind('keypress');
		this.stopListening();
		this.$el.remove();
	}
});