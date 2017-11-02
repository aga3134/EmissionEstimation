var g_DM = (function(){
	
	function InitMap() {
		var loc = {lat: 23.682094, lng: 120.7764642, zoom: 7};
		var taiwan = new google.maps.LatLng(loc.lat,loc.lng);

		map = new google.maps.Map(document.getElementById('dataMap'), {
		  center: taiwan,
		  zoom: loc.zoom,
		  scaleControl: true,
		  //mapTypeId: google.maps.MapTypeId.SATELLITE
		  //mapTypeId: google.maps.MapTypeId.TERRAIN
		});
	}

	//==============init=================
	google.maps.event.addDomListener(window, 'load', InitMap);

	return {};
})();
