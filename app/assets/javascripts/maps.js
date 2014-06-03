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
		markerPaths = {},
		markerList = [],
		latLngList = [],
		infoWindowList = {},
		infoWindowObj = null,
		infoWindowTemplate = $('[data-template="infowindow"]'),
		infoWindowWidth = '350',
		Marker = null,
		MarkerLabel = null;

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
					.replace(/\[id\]/g, markerData['id'])
					.replace(/\[event_type\]/g, markerData['event_type'])
					.replace(/\[title\]/g, markerData['title'])
					.replace(/\[address\]/g, markerData['address'])
					.replace(/\[date\]/g, markerData['date'])
					.replace(/\[community\]/g, markerData['community'])
					.replace(/\[start_time\]/g, markerData['start_time'])
					.replace(/\[end_time\]/g, markerData['end_time'])
					.replace(/\[user_name\]/g, markerData['user']['name'])
					.replace(/\[all_age\]/g, markerData['all_age'] === 0 ? '' : 'all_age')
					.replace(/\[alcohol\]/g, markerData['alcohol'] === 0 ? '' : 'alcohol');

				infoWindowList[markerData['id']] = infoWindowContent;
			}

			infoWindowObj.close();
			infoWindowObj.setContent(infoWindowContent);
			infoWindowObj.open(marker.get('map'), marker);
		});
	}

	function _initMap() {
		function _buildMarker(markerData, index) {
			markerList.push(
				new MarkerWithLabel({
  				position: new google.maps.LatLng( markerData['lat'], markerData['long']),
  				map: mapObj,
  				title: markerData['title'],
  				zIndex: 9,
  				icon: markerPaths[markerData['event_type'].toLowerCase()],
  				labelContent: '<i class="icon-' + markerData['event_type'].toLowerCase() + '"></i>',
  				labelClass: 'marker-label ' + markerData['event_type'].toLowerCase(),
  				labelAnchor: new google.maps.Point(6.6, 35),
  				labelInBackground: false
				})
			);

			_attachInfoWindow(markerList[index], index, markerData);
		}

		markerPaths = {
			'bbq': {
				path: 'M 16.1,0C7.2,0,0,7.2,0,16.1c0,2.2,0.4,4.3,1.2,6.2h0l0,0c0.2,0.6,14.9,30.3,14.9,30.3l14.2-28.8c1.2-2.3,1.9-4.9,1.9-7.6C32.2,7.2,25,0,16.1,0 z',
				fillColor: '#4a494a',
				fillOpacity: 1,
				strokeWeight: 0,
				scale: 0.75,
				anchor: new google.maps.Point(16, 54)
			},
			'potluck': {
				path: 'M 16.1,0C7.2,0,0,7.2,0,16.1c0,2.2,0.4,4.3,1.2,6.2h0l0,0c0.2,0.6,14.9,30.3,14.9,30.3l14.2-28.8c1.2-2.3,1.9-4.9,1.9-7.6C32.2,7.2,25,0,16.1,0 z',
				fillColor: '#e96144',
				fillOpacity: 1,
				strokeWeight: 0,
				scale: 0.75,
				anchor: new google.maps.Point(16, 54)
			},
			'picnic': {
				path: 'M 16.1,0C7.2,0,0,7.2,0,16.1c0,2.2,0.4,4.3,1.2,6.2h0l0,0c0.2,0.6,14.9,30.3,14.9,30.3l14.2-28.8c1.2-2.3,1.9-4.9,1.9-7.6C32.2,7.2,25,0,16.1,0 z',
				fillColor: '#f1e979',
				fillOpacity: 1,
				strokeWeight: 0,
				scale: 0.75,
				anchor: new google.maps.Point(16, 54)
			},
			'catered': {
				path: 'M 16.1,0C7.2,0,0,7.2,0,16.1c0,2.2,0.4,4.3,1.2,6.2h0l0,0c0.2,0.6,14.9,30.3,14.9,30.3l14.2-28.8c1.2-2.3,1.9-4.9,1.9-7.6C32.2,7.2,25,0,16.1,0 z',
				fillColor: '#72cac7',
				fillOpacity: 1,
				strokeWeight: 0,
				scale: 0.75,
				anchor: new google.maps.Point(16, 54)
			}
		};

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

			if ((typeof eventData.length).toLowerCase() === "undefined") {
				_buildMarker(eventData, 0);
				mapObj.setZoom(16);
				mapObj.panTo(markerList[0].position);
			} else if ((typeof eventData.length).toLowerCase() === "number") {
	  		for (var i = 0; i < eventData.length; i++) {
	  			_buildMarker(eventData[i], i);
	  		}
			}
  	}
	}

	return {
		init: function() {

			$('body').append(
				$('<script>').attr({
					'type': 'text/javascript',
					'src': 'https://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerwithlabel/src/markerwithlabel_packed.js'
				})
			);

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