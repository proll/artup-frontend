$(function(){
	var $err = $('.err'),
		$invite_form = 	$('.invite-form'),
		$invite_email = $('.invite-email'),
		$invite_btn = 	$('.invite-btn');

		// lodash extention
		_.isEmail = function (email) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email)
		};

		var error = function(err) {
			$err.text(err);
			$err.css({
				opacity: 1
			})
		};

		var errorReq = function() {
			error('Что-то пошло не так');
		};

		var successReq = function(data) {
			if(!data.success) {
				error('Что-то не так с вашим адресом попробуйте другой');
			} else {
				$('html').toggleClass('herro', true);

				setTimeout(function(){
					$('.invite-info-herro').css({
						opacity: 1
					})
				},100)
				

			}

		}
 
		var invite = function() {
			var email = $invite_email.val();
			if(!$.trim(email)) {
				error("Введите пожалуйста адрес");
				$invite_email.focus();
			} else if(!_.isEmail(email)) {
				error("Неверно введен адрес");
				$invite_email.focus();
			} else {
				$.ajax({
					url: 	'http://api.artupp.ru/v1/auth/invite',
					type: 	'POST',
					data : {  
						email: email,
						info: ''
					},
					success: 	_.bind(successReq, this),
					error: 		_.bind(errorReq, this)
				});
			}
			return false;
		}

		$invite_btn.on('click', _.bind(invite, this));
		$invite_form.on('submit', _.bind(invite, this));
})