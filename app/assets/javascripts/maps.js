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
			markerList.push([
				new google.maps.Marker({
  				position: new google.maps.LatLng( markerData['lat'], markerData['long']),
  				map: mapObj,
  				icon: markerPaths[markerData['event_type'].toLowerCase()]['base'],
  				title: markerData['title']
				}),
				new google.maps.Marker({
  				position: new google.maps.LatLng( markerData['lat'], markerData['long']),
  				map: mapObj,
  				icon: markerPaths[markerData['event_type'].toLowerCase()]['top'],
  				title: markerData['title']
				})
			]);

			_attachInfoWindow(markerList[index][0], index, markerData);
			_attachInfoWindow(markerList[index][1], index, markerData);
		}

		markerPaths = {
			'bbq': {
				base: {
					path: 'M 16.1,0C7.2,0,0,7.2,0,16.1c0,2.2,0.4,4.3,1.2,6.2h0l0,0c0.2,0.6,14.9,30.3,14.9,30.3l14.2-28.8c1.2-2.3,1.9-4.9,1.9-7.6C32.2,7.2,25,0,16.1,0 z',
					fillColor: '#ffffff',
					fillOpacity: 1,
					strokeWeight: 0,
					scale: 0.75,
					anchor: new google.maps.Point(16, 54)
				},
				top: {
					path: 'M306,363.321c-11.059,0-20.005,8.947-20.005,20.005c0,2.733,0.497,5.343,1.491,7.704c0.249,0.746,18.514,37.649,18.514,37.649l17.644-35.785c1.491-2.858,2.361-6.088,2.361-9.443C326.005,372.268,317.059,363.321,306,363.321z M309.106,373.51h1.118v2.982h1.118v2.982h-1.118v-2.982h-1.118V373.51zM305.875,373.51h1.119v2.982h1.118v2.982h-1.118v-2.982h-1.119V373.51z M302.769,373.51h1.118v2.982h0.994v2.982h-1.118v-2.982h-0.994V373.51z M315.691,383.078c0,0.124,0,0.124,0,0.249c0,2.609-1.863,4.97-4.598,6.088l0.497,1.367h0.125c1.242,0,2.236,0.994,2.236,2.237c0,1.242-0.994,2.236-2.236,2.236c-1.243,0-2.237-0.994-2.237-2.236c0-0.125,0-0.373,0.125-0.622h-5.592l-1.243,2.858h-1.367l2.361-5.591c-2.733-1.118-4.722-3.23-4.846-5.84h-2.485v-1.119h2.485v-1.615h16.774V383.078z',
					fillColor: '#4a494a',
					fillOpacity: 1,
					strokeWeight: 0,
					scale: 0.70,
					anchor: new google.maps.Point(305, 429)
				}
			},
			'potluck': {
				base: {
					path: 'M 16.1,0C7.2,0,0,7.2,0,16.1c0,2.2,0.4,4.3,1.2,6.2h0l0,0c0.2,0.6,14.9,30.3,14.9,30.3l14.2-28.8c1.2-2.3,1.9-4.9,1.9-7.6C32.2,7.2,25,0,16.1,0 z',
					fillColor: '#72cac7',
					fillOpacity: 1,
					strokeWeight: 0,
					scale: 0.75,
					anchor: new google.maps.Point(16, 54)
				},
				top: {
					path: 'M 16.1,0C7.2,0,0,7.2,0,16.1c0,2.2,0.4,4.3,1.2,6.2h0l0,0c0.2,0.6,14.9,30.3,14.9,30.3l14.2-28.8c1.2-2.3,1.9-4.9,1.9-7.6C32.2,7.2,25,0,16.1,0 z',
					fillColor: '#4a494a',
					fillOpacity: 1,
					strokeWeight: 0,
					scale: 0.75,
					anchor: new google.maps.Point(16, 54)
				}
			},
			'picnic': {
				base: {
					path: 'M 16.1,0C7.2,0,0,7.2,0,16.1c0,2.2,0.4,4.3,1.2,6.2h0l0,0c0.2,0.6,14.9,30.3,14.9,30.3l14.2-28.8c1.2-2.3,1.9-4.9,1.9-7.6C32.2,7.2,25,0,16.1,0 z',
					fillColor: '#4a494a',
					fillOpacity: 1,
					strokeWeight: 0,
					scale: 0.75,
					anchor: new google.maps.Point(16, 54)
				},
				top: {
					path: 'M40.01,0C17.893,0,0,17.893,0,40.01c0,5.467,0.994,10.686,2.982,15.407c0.497,1.491,37.027,75.297,37.027,75.297l35.288-71.57c2.982-5.715,4.722-12.177,4.722-18.887C80.019,17.893,62.126,0,40.01,0zM62.623,37.276h-3.479l-1.74,16.898h-16.65h-1.242h-16.65l-1.739-16.898h-3.479v-4.722h8.449L40.01,20.129l13.916,12.425v0.249h8.697V37.276z',
					fillColor: '#f1e979',
					fillOpacity: 1,
					strokeWeight: 0,
					scale: 0.33,
					anchor: new google.maps.Point(40, 128)
				}
			},
			'catered': {
				base: {
					path: 'M 16.1,0C7.2,0,0,7.2,0,16.1c0,2.2,0.4,4.3,1.2,6.2h0l0,0c0.2,0.6,14.9,30.3,14.9,30.3l14.2-28.8c1.2-2.3,1.9-4.9,1.9-7.6C32.2,7.2,25,0,16.1,0 z',
					fillColor: '#4a494a',
					fillOpacity: 1,
					strokeWeight: 0,
					scale: 0.8,
					anchor: new google.maps.Point(16, 55)
				},				
				top: {
					path: 'M84,0.675c-11.059,0-20.005,8.946-20.005,20.005c0,2.734,0.497,5.343,1.491,7.704C65.734,29.129,84,66.033,84,66.033l17.644-35.786c1.491-2.858,2.361-6.088,2.361-9.443C104.005,9.621,95.059,0.675,84,0.675zM82.881,12.604c0,0,0,0,0-0.125c0-0.621,0.497-1.118,1.119-1.118c0.621,0,1.118,0.497,1.118,1.118v0.125c4.97,0.497,8.698,4.722,8.698,9.692H74.184C74.184,17.325,78.035,13.101,82.881,12.604z M94.934,25.775H73.065v-1.491h21.869V25.775z',
					fillColor: '#72cac7',
					fillOpacity: 1,
					strokeWeight: 0,
					scale: 0.68,
					anchor: new google.maps.Point(84, 67)
				}				
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
				mapObj.panTo(markerList[0][0].position);
			} else if ((typeof eventData.length).toLowerCase() === "number") {
	  		for (var i = 0; i < eventData.length; i++) {
	  			_buildMarker(eventData[i], i);
	  		}
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