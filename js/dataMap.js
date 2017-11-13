var g_DM = (function(){

	var map;
	var epaSite = [];
	var epaArray = [];
	var weatherStation = [];
	var weatherArray = [];

	var powerStation = [];
	var trafficSite = [];
	var cemsComp = [];
	
	function GetEPARadius(){
		if(!map) return 2000;
		var zoom = 11-map.getZoom();
		if(zoom < 1) zoom = 1;
		if(zoom > 7) zoom = 7;
		return 500*Math.pow(2,zoom);
	}

	function UpdateZoom(){
		var radius = GetEPARadius();
		var strokeOpacity = radius>=5000?0:0.5;
		for(var key in epaArray){
			epaArray[key].setOptions({
	    		radius: radius,
	    		strokeOpacity: strokeOpacity
	    	});
		}
	}

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

		map.addListener('zoom_changed', function(){
			if(map.getZoom() < 5) map.setZoom(5);
			UpdateZoom();
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
		if(Object.keys(epaSite).length == 0) return;

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
			var radius = GetEPARadius();
			var epaData = JSON.parse(data);
			for(var i=0;i<epaData.length;i++){
				var d = epaData[i];
				var site = epaSite[d.siteName];
				if(!site) continue;
				var pos = {lat: parseFloat(site.lat), lng: parseFloat(site.lng)};

				var circle = new google.maps.Circle({
					center: pos,
            		radius: radius,
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
		if(Object.keys(weatherStation).length == 0) return;

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
				var station = weatherStation[d.stationID];
				if(!station || d.wSpeed <= 0) continue;
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

	function UpdatePower(app, data){
		console.log(data);
	}

	function UpdateTraffic(app, data){
		function GenShape(loc, dir, segLen){
			var shape = [];
			switch(dir){
				case "N":
					shape[0] = loc;
					shape[1] = {lat: loc.lat()+segLen, lng: loc.lng()};
					shape[2] = {lat: loc.lat()+segLen, lng: loc.lng()-0.7*segLen};
					shape[3] = {lat: loc.lat()+2.5*segLen, lng: loc.lng()+0.5*segLen};
					shape[4] = {lat: loc.lat()+segLen, lng: loc.lng()+1.7*segLen};
					shape[5] = {lat: loc.lat()+segLen, lng: loc.lng()+segLen};
					shape[6] = {lat: loc.lat(), lng: loc.lng()+segLen};
					shape[7] = loc;
					break;
				case "S":
					shape[0] = loc;
					shape[1] = {lat: loc.lat()-segLen, lng: loc.lng()};
					shape[2] = {lat: loc.lat()-segLen, lng: loc.lng()+0.7*segLen};
					shape[3] = {lat: loc.lat()-2.5*segLen, lng: loc.lng()-0.5*segLen};
					shape[4] = {lat: loc.lat()-segLen, lng: loc.lng()-1.7*segLen};
					shape[5] = {lat: loc.lat()-segLen, lng: loc.lng()-segLen};
					shape[6] = {lat: loc.lat(), lng: loc.lng()-segLen};
					shape[7] = loc;
					break;
			}
			return shape;
		}

		CLearDataInMap(trafficSite);

		for(var key in data){
			var d = data[key];
			var loc = new google.maps.LatLng(d.lat, d.lng);
			var size = d.totalAmount*1e-5;
			
			var coord = GenShape(loc,d.dir,size);
			
			var rect = new google.maps.Polygon({
				paths: coord,
				strokeColor: '#000000',
				strokeWeight: 1,
				fillOpacity: 0,
				zIndex: 2,
				map: map
			});
			//rect.listener = rect.addListener('click', clickFn(data,i,time));
			trafficSite[key] = rect;
			
		}
		
	}

	function UpdateCEMS(app, data){
		console.log(data);
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
