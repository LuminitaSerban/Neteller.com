(function($) {
	//on load
	$(window).on('load', function () {
	
	});

	//on ready
	$(document).ready(function() {
		//run modals
		$('.getModal').on('click', function(e){
			e.preventDefault();
			let target_modal = $(this).attr('href');
			if (!target_modal) {
				target_modal = $(this).data('modal');
			}
			$(target_modal).arcticmodal({
				beforeOpen: function() {
					$(target_modal).addClass('openEffect');
					$(target_modal).removeClass('closeEffect');
				},
				beforeClose: function() {
					$(target_modal).removeClass('openEffect');
					$(target_modal).addClass('closeEffect');
				}
			});
			return false;
		});

		//scroll to anchors
		$('.scrolling').click(function(){
			let target = $(this).attr('href').match('#');
			target = target.input.slice(target['index']);
			$('html, body').animate({scrollTop: $(target).offset().top}, 500);
			return false;
		});
		
		//masked input
		const phoneMask = ['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]; // +7 (___) ___-__-__
		// const phoneMask = ['+', '3', '7', '3', ' ', '(', /\d/, /\d/, ')', ' ', /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]; // +373 (__) __-__-__
		const phoneInputs = document.querySelectorAll('input[name=phone]');
		phoneInputs.forEach(function(phoneInput) {
			vanillaTextMask.maskInput({
				inputElement: phoneInput,
				mask: phoneMask,
				placeholderChar: '_',
				// showMask: true
			});
		});

		// hide placeholder on focus and return it on blur
		$('input, textarea').focus(function () {
			$(this).data('placeholder', $(this).attr('placeholder'));
			$(this).attr('placeholder', '');
		});
		$('input, textarea').blur(function () {
			$(this).attr('placeholder', $(this).data('placeholder'));
		});

		/********************  forms  *********************/  
		$('form').on('submit', function(){
			const form = $(this);
			const formFields = form.find('input, textarea').filter('[required]:visible');
			let formIsValid = true;
			formFields.css('outline', 'none'); //reset errors
			formFields.each(function(){
				if (($(this).val() === "") || (($(this).attr('name') === 'phone') && $(this).val().includes('_'))) {
					$(this).css('outline','1px solid red'); 
					formIsValid = false;
				}
			});

			if(formIsValid) {
				const send_data = form.serialize(); // +"&send_to_email="+from_back.send_to_email;

				$.ajax({
					type: "POST",
					url: 'send.php', // from_back.send_url
					data: send_data,
					success: function (data) {
						$.arcticmodal('close');
						$('#modal-success').arcticmodal();
					},
					error: function (xhr, str) {
						alert("Error, try again!");
					}
				});
			}
			
			return false;
		});


	}); //END on ready

})(jQuery);