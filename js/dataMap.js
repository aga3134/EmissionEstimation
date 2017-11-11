var g_DM = (function(){

	var map;
	var epaSite = [];
	var epaArray = [];
	var weatherStation = [];
	var weatherArray = [];
	
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

	function InitSites(app){
		$.get("data/epaSite.php", function(data){
	        if(!data) return;
	        json = JSON.parse(data);
	        for(var i=0;i<json.length;i++){
	          var site = json[i];
	          epaSite[site.id] = site;
	        }
	        //console.log(epaSite);
	        $.get("data/weatherStation.php", function(data){
		        if(!data) return;
		        json = JSON.parse(data);
		        for(var i=0;i<json.length;i++){
		          var station = json[i];
		          weatherStation[station.id] = station;
		        }
		        //console.log(weatherStation);
		        app.UpdateMap();
	    	});
    	});
	}

	function CLearDataInMap(arr){
		for(var key in arr){
			arr[key].setOptions({
	    		map: null
	    	});
		}
	}

	

	function UpdateAirData(app){
		function AQIValueToColor(v){
			if(v <= 50) return "#00e800";
			else if(v <= 100) return "#ffff00";
			else if(v <= 150) return "#ff7e00";
			else if(v <= 200) return "#ff0000";
			else if(v <= 300) return "#8f3f97";
			else if(v <= 500) return "#7e0023";
			else return "#000000";
		}

		CLearDataInMap(epaArray);
		var url = "data/epaData.php";
	    url += "?date="+app.dateSelect;
	    url += "&hour="+app.hourSelect;
	    $.get(url, function(data){
	    	if(!data){
				epaArray = [];
				return;
			}
			var epaData = JSON.parse(data);
			for(var i=0;i<epaData.length;i++){
				var d = epaData[i];
				var site = epaSite[d.siteName];
				var pos = {lat: parseFloat(site.lat), lng: parseFloat(site.lng)};

				var circle = new google.maps.Circle({
					center: pos,
            		radius: 2000,
            		strokeColor: "#000000",
					strokeWeight: 1,
					strokeOpacity: 0.5,
					fillColor: AQIValueToColor(d.AQI),
					fillOpacity: 0.5,
					zIndex: 2,
					map: map
				});
				//circle.listener = circle.addListener('click', clickFn(data,i,time));
				epaArray[d.siteName] = circle;
			}
	    });
	}

	function UpdateWeather(app){
		function GenArrow(loc, wDir, wSpeed, scale){
			var arrow = [];
			var theta = wDir*Math.PI/180;
			var mag = wSpeed*scale;
			//console.log(wDir);
			//console.log(-Math.cos(theta)+","+-Math.sin(theta));

			var a1 = (wDir+150)*Math.PI/180;
			var a2 = (wDir+270)*Math.PI/180;
			var as = 0.01;

			arrow[0] = loc;
			arrow[1] = {lat: loc.lat()-mag*Math.cos(theta), lng: loc.lng()-mag*Math.sin(theta)};
			arrow[2] = {lat: arrow[1].lat-as*Math.cos(a1), lng: arrow[1].lng-as*Math.sin(a1)};
			arrow[3] = {lat: arrow[2].lat-as*Math.cos(a2), lng: arrow[2].lng-as*Math.sin(a2)};
			arrow[4] = {lat: arrow[1].lat, lng: arrow[1].lng};
			return arrow;
		}

		CLearDataInMap(weatherArray);
		var url = "data/weatherData.php";
	    url += "?date="+app.dateSelect;
	    url += "&hour="+app.hourSelect;
	    $.get(url, function(data){
	    	if(!data){
				weatherArray = [];
				return;
			}
			//台灣的位置經緯度差1度約差111公里，風速1 m/s = 0.6km/10min
			//1 m/s風速每10分鐘可將空汙吹動0.0054度 => 箭頭長度約為此風速下30分鐘空汙移動距離
			var arrowScale = 0.0162;
			var weatherData = JSON.parse(data);
			for(var i=0;i<weatherData.length;i++){
				var d = weatherData[i];
				if(d.wSpeed <= 0) continue;
				var station = weatherStation[d.stationID];
				var loc = new google.maps.LatLng(parseFloat(station.lat), parseFloat(station.lng));

				var arrow = new google.maps.Polyline({
					path: GenArrow(loc, parseFloat(d.wDir), parseFloat(d.wSpeed), arrowScale),
					geodesic: true,
					strokeColor: '#0000FF',
					strokeWeight: 1,
					map: map,
					zIndex: 3
				});
				weatherArray[d.stationID] = arrow;
			}
	    });
	}

	function UpdatePower(app){

	}

	function UpdateTraffic(app){

	}

	function UpdateCEMS(app){

	}

	//==============init=================
	google.maps.event.addDomListener(window, 'load', InitMap);

	return {
		InitSites: InitSites,
		UpdateAirData: UpdateAirData,
		UpdateWeather: UpdateWeather,
		UpdatePower: UpdatePower,
		UpdateTraffic: UpdateTraffic,
		UpdateCEMS: UpdateCEMS
	};
})();
