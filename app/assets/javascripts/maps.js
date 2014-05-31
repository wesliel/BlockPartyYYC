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
		mapConfig = [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"stylers":[{"hue":"#00aaff"},{"saturation":-100},{"gamma":2.15},{"lightness":12}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":24}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":57}]}],
		mapObj = null,
		markerList = [],
		latLngList = [],
		infoWindowList = {},
		infoWindowObj = null,
		infoWindowTemplate = $('[data-template="infowindow"]'),
		infoWindowWidth = '350';
;

	function _gpsHandler(position) {
		mapCenter = {'lat': position.coords.latitude, 'lng': position.coords.longitude};
		mapZoom = 15;
		_initMap();
	}

	function _attachInfoWindow(marker, num, markerData) {
		google.maps.event.addListener(marker, 'click', function() {
			var infoWindowContent;

			// If the infowindow content is not rendered already, render and save it
			if (infoWindowList[markerData['id']]) {
				infoWindowContent = infoWindowList[markerData['id']];
			} else {
				infoWindowContent = infoWindowTemplate.clone().html();
				infoWindowContent = infoWindowContent
					.replace(/\[event_type\]/g, markerData['event_type'])
					.replace(/\[title\]/g, markerData['title'])
					.replace(/\[address\]/g, markerData['address'])
					.replace(/\[date\]/g, markerData['date'])
					.replace(/\[community\]/g, markerData['community'])
					.replace(/\[start_time\]/g, markerData['start_time'])
					.replace(/\[end_time\]/g, markerData['end_time'])
					.replace(/\[user_name\]/g, markerData['user']['name']);

				infoWindowList[markerData['id']] = infoWindowContent;
			}

			infoWindowObj.close();
			infoWindowObj.setContent(infoWindowContent);
			infoWindowObj.open(marker.get('map'), marker);
		})
	}

	function _initMap() {
		mapObj = new google.maps.Map(document.getElementById('map'), {
			zoom: mapZoom,
			center: new google.maps.LatLng(mapCenter.lat, mapCenter.lng),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: mapConfig
  	});

  	if (eventData) {
			infoWindowObj = new google.maps.InfoWindow({
				content: "content",
				maxWidth: infoWindowWidth,
				minWidth: infoWindowWidth
			});

  		for (var i = 0; i < eventData.length; i++) {
  			markerList.push(new google.maps.Marker({
  				position: new google.maps.LatLng( eventData[i]['lat'], eventData[i]['long']),
  				map: mapObj,
  				title: eventData[i]['title']
  			}));

  			_attachInfoWindow(markerList[i], i, eventData[i]);
  		}
  	}
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