/*
* 
* Google maps configuration and maps handler
*
*/

;var partyPinMaps = partyPinMaps || (function() {
	var
		mapCenter = {'lat': 51.013117, 'lng': -114.0741556},
		mapKey = 'AIzaSyDuCUyFZETD3wtyTCi07Z_HaczhvZiyXxI',
		mapZoom = 11,
		mapConfig = [
			{
				'featureType': 'water',
				'elementType': 'geometry',
				'stylers': [{'color':'#004358'}]
			},
			{
				'featureType': 'landscape',
				'elementType': 'geometry',
				'stylers': [{'color':'#1f8a70'}]
			},
			{
				'featureType': 'poi',
				'elementType': 'geometry',
				'stylers': [{'color':'#1f8a70'}]
			},
			{
				'featureType': 'road.highway',
				'elementType': 'geometry',
				'stylers': [{'color':'#fd7400'}]
			},
			{
				'featureType': 'road.arterial',
				'elementType': 'geometry',
				'stylers': [{'color':'#1f8a70'}, {'lightness':-20}]
			},
			{
				'featureType': 'road.local',
				'elementType': 'geometry',
				'stylers': [{'color':'#1f8a70'}, {'lightness':-17}]
			},
			{
				'elementType': 'labels.text.stroke',
				'stylers': [{'color':'#ffffff'}, {'visibility':'on'}, {'weight':0.9}]
			},
			{
				'elementType': 'labels.text.fill',
				'stylers': [{'visibility':'on'}, {'color':'#ffffff'}]
			},
			{
				'featureType': 'poi',
				'elementType': 'labels',
				'stylers': [{'visibility':'simplified'}]
			},
			{
				'elementType': 'labels.icon',
				'stylers': [{'visibility':'off'}]
			},
			{
				'featureType': 'transit',
				'elementType': 'geometry',
				'stylers': [{'color':'#1f8a70'}, {'lightness':-10}]
			},
			{},
			{
				'featureType': 'administrative',
				'elementType': 'geometry',
				'stylers': [{'color':'#1f8a70'}, {'weight':0.7}]
			}
		],
		mapObj = null;

	function _gpsHandler(position) {
		mapCenter = {'lat': position.coords.latitude, 'lng': position.coords.longitude};
		mapZoom = 15;
		_initMap();
	}

	function _initMap() {
		mapObj = new google.maps.Map(document.getElementById('map'), {
			zoom: mapZoom,
			center: new google.maps.LatLng(mapCenter.lat, mapCenter.lng),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: mapConfig
  	});
	}

	return {
		init: function() {
			if (navigator.geolocation) {
			  navigator.geolocation.getCurrentPosition(_gpsHandler, _initMap);
			} else {
				_initMap();
			}
		}
	};
}());

$(document).ready(function() {
	if ($('#map').length > 0) {
		$('body').append(
			$('<script>').attr({
				'type': 'text/javascript',
				'src': 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=partyPinMaps.init'
			})
		);
	}
});