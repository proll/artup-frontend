aup.PicTile = Backbone.Model.extend({
	defaults: {
		src: '',
		// "id": XXX,
		// "name": "Pencil Icon PSD",
		// "description": "I made this for fun."
		// "price": 100,
		// "currency": "rur",
		// "url_short": "https://host.ru/l/XXX",
		// "url": [исходная ссылка],
		// "url_qr": "https://host.ru/assets/qr-link-XXX.png",
		// "url_preview": [url на предпросмотр],
		// "with_preview": [если url_preview задан, имеет значение 1, иначе 0],
		// "active": 1,
		// "user": {
		// 	"name": "some",
		// 	"id": <user_id>,
		// }
	},
	initialize: function (options) {
		this.view = new aup.PicTileView({model:this});
		this.view.on('pictile:loaderror', this.remove, this);
	},
	fetch: function () {
		this.set('width',  Math.round(Math.random() * 80) + 160);
		this.set('src', this.get('url_preview'));
	},

	remove: function () {
		this.stopListening();
		this.clear({silent: true});
		this.view.remove();
	}
});