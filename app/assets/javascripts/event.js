/*
* For example of the API call, load this URL in browser:
* http://maps.google.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=false
*/

//= require jquery.anagram-validation.0.2.min
//= require foundation-datepicker

var partyPinEvents = partyPinEvents || (function() {
	var mapUrl = 'http://maps.google.com/maps/api/geocode/json';

	return {
		changeHandler: function(event) {
			var
				$this = $(this),
				$form = $(this).closest('form'),
				address = $this.val().replace(' ', '+');

			$this.removeClass('processed');

			if (address.indexOf('Calgary') === -1) {
				address += ',+Calgary,+AB,+Canada';
			}

			$.ajax({
				type: 'get',
				url: mapUrl + '?address=' + address + '&sensor=false',
				success: function(data, status, xhr) {
					var dataObj = data.results[0];
					$form.find('[name*="[lat]"]').val(dataObj.geometry.location.lat);
					$form.find('[name*="[long]"]').val(dataObj.geometry.location.lng);
					$this.addClass('processed');
				}
			});
		}
	};
}());

$(document).ready(function() {
	$('form').anagramValidation({
		'patterns': {
			'date': {'pattern': '^\\d{1,2}/\\d{1,2}/\\d{4}$', 'message': 'Please enter a valid date'},
			'time': {'pattern': '^\\d{1,2}:\\d{2}(((AM)|(PM))|((am)|(pm)))$', 'message': 'Please enter a valid time'}
		},
		'inactive-class': 'disabled'
	});

	$('form [name*="[address]"]')
		.on('change input blur', partyPinEvents.changeHandler)
		.on('keyup', function(event) {
			$(this).removeClass('processed');
		});

	$('form [name*="[date]"]').fdatepicker();

	$('a.delete').on('click', function(event) {
		event.preventDefault();

		$(this).siblings('.confirm').slideDown();
	});

	$('.confirm a.no').on('click', function(event) {
		event.preventDefault();

		$(this).closest('.confirm').slideUp();
	});

});