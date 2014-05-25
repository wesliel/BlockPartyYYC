/*
* 
* Google maps configuration and maps handler
*
*/

var partyPinMaps = partyPinMaps || (function() {
	var
		mapKey = 'AIzaSyDuCUyFZETD3wtyTCi07Z_HaczhvZiyXxI',
		mapConfig = [{'featureType':'water','elementType':'geometry','stylers':[{'color':'#004358'}]},{'featureType':'landscape','elementType':'geometry','stylers':[{'color':'#1f8a70'}]},{'featureType':'poi','elementType':'geometry','stylers':[{'color':'#1f8a70'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#fd7400'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#1f8a70'},{'lightness':-20}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#1f8a70'},{'lightness':-17}]},{'elementType':'labels.text.stroke','stylers':[{'color':'#ffffff'},{'visibility':'on'},{'weight':0.9}]},{'elementType':'labels.text.fill','stylers':[{'visibility':'on'},{'color':'#ffffff'}]},{'featureType':'poi','elementType':'labels','stylers':[{'visibility':'simplified'}]},{'elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'transit','elementType':'geometry','stylers':[{'color':'#1f8a70'},{'lightness':-10}]},{},{'featureType':'administrative','elementType':'geometry','stylers':[{'color':'#1f8a70'},{'weight':0.7}]}],
		mapObj = null;

	return {
		init: function() {
			mapObj = new google.maps.Map(document.getElementById('map'), {
				zoom: 12,
				center: new google.maps.LatLng(51.013117,-114.0741556),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				styles: mapConfig
			});
		}
	};
}());

$(document).ready(function() {
	$('body').append(
		$('<script>').attr({
			'type': 'text/javascript',
			'src': 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=partyPinMaps.init'
		})
	);
});