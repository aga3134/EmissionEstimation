var g_DM = (function(){
	var map;
	var epaSite = [];
	var epaArray = [];
	var epaMarker = [];
	var weatherStation = [];
	var weatherArray = [];

	var powerStation = [];
	var trafficSite = [];
	var cemsComp = [];

	var infoWindow = new google.maps.InfoWindow();
	
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
		var zoom = map.getZoom();
		var textSize = zoom>=11?((zoom-9)*8)+"px":"8px";
		for(var key in epaMarker){
			epaMarker[key].setOptions({
	    		map: strokeOpacity>0?map:null,
	    		label:{text: epaMarker[key].text, fontSize: textSize}
	    	});
		}
	}

	var InitMap = function() {
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

		g_APP.UpdateMap();
	}

	function InitSites(){
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
		        g_APP.ChangeSource();
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

	function UpdateAirData(){
		if(Object.keys(epaSite).length == 0) return;
		CLearDataInMap(epaArray);

		function clickFn(d){ 
			return function() {
				var str = "<p>測站: "+d.data.siteName+"<br>";
				//str += "時間: "+d.data.time+"<br>";
				str += "AQI: "+d.data.AQI+"<br>";
				str += "PM2.5: "+d.data.PM25+" (μg/m3)<br>";
				str += "PM10: "+d.data.PM10+" (μg/m3)<br>";
				str += "SO2: "+d.data.SO2+" (ppb)<br>";
				str += "NO: "+d.data.NO+" (ppb)<br>";
				str += "NO2: "+d.data.NO2+" (ppb)<br>";
				str += "NOx: "+d.data.NOx+" (ppb)<br>";
				str += "O3: "+d.data.O3+" (ppb)<br>";
				str += "CO: "+d.data.CO+" (ppm)</p>";
				infoWindow.setOptions({content: str, position: d.pos});
				infoWindow.open(map);
			};
		}
		if(infoWindow.getMap()){
			infoWindow.setOptions({map: null});
		}

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
		CLearDataInMap(epaMarker);
		var url = "data/epaData.php";
	    url += "?date="+g_APP.dateSelect;
	    url += "&hour="+g_APP.hourSelect;
	    $.get(url, function(data){
	    	if(!data){
				epaArray = [];
				return;
			}
			var radius = GetEPARadius();
			var strokeOpacity = radius>=5000?0:0.5;
			var epaData = JSON.parse(data);
			var showMap = g_APP.dataMap.showEPA?map:null;
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
					strokeOpacity: strokeOpacity,
					fillColor: AQIValueToColor(d.AQI),
					fillOpacity: 0.5,
					zIndex: 2,
					map: showMap
				});
				circle.listener = circle.addListener('click', clickFn({data:d, pos:pos}));
				epaArray[d.siteName] = circle;

				var labelText = parseInt(d.AQI).toString();
				var marker = new google.maps.Marker({
					position: pos,
					label: {
						text: labelText,
						color: 'black',
						fontSize: "8px"
					},
					map: strokeOpacity>0?showMap:null,
					icon: {
						url: "image/transparent.png",
						size: new google.maps.Size(8, 8),
						scaledSize: new google.maps.Size(8, 8),
						labelOrigin: new google.maps.Point(4, 8)
					}
				});
				marker.text = labelText;
				marker.listener = marker.addListener('click', clickFn({data:d, pos:pos}));
				epaMarker[d.siteName] = marker;
			}
	    });
	}

	function UpdateWeather(){
		if(Object.keys(weatherStation).length == 0) return;
		CLearDataInMap(weatherArray);

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
	    url += "?date="+g_APP.dateSelect;
	    url += "&hour="+g_APP.hourSelect;
	    $.get(url, function(data){
	    	if(!data){
				weatherArray = [];
				return;
			}
			//台灣的位置經緯度差1度約差111公里，風速1 m/s = 0.6km/10min
			//1 m/s風速每10分鐘可將空汙吹動0.0054度 => 箭頭長度約為此風速下30分鐘空汙移動距離
			var arrowScale = 0.0162;
			var weatherData = JSON.parse(data);
			var showMap = g_APP.dataMap.showWind?map:null;
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
					map: showMap,
					zIndex: 3
				});
				weatherArray[d.stationID] = arrow;
			}
	    });
	}

	function UpdatePower(data){
		function clickFn(d){ 
			return function() {
				var name = d.data.data[0].name.split("#")[0];
				var str = "<p>"+name+"發電廠<br>";
				str += "總發電量: "+parseInt(d.data.genSum)+" MW<br>";
				infoWindow.setOptions({content: str, position: d.pos});
				infoWindow.open(map);
			};
		}
		if(infoWindow.getMap()){
			infoWindow.setOptions({map: null});
		}

		CLearDataInMap(cemsComp);
		CLearDataInMap(trafficSite);
		CLearDataInMap(powerStation);
		//group by position
		var locArr = {};
		for(var key in data){
			var d = data[key];
			var key = d.lat+","+d.lng;
			if(locArr[key]){
				locArr[key].data.push(d);
				locArr[key].genSum += d.genSum;
				locArr[key].genNum += d.genNum;
			}
			else{
				locArr[key] = {};
				locArr[key].data = [d];
				locArr[key].genSum = d.genSum;
				locArr[key].genNum = d.genNum;
				locArr[key].lat = d.lat;
				locArr[key].lng = d.lng;
			}
		}
		//draw in map
		for(key in locArr){
			var d = locArr[key];
			//console.log(d);
			var loc = new google.maps.LatLng(d.lat, d.lng);
			var size = d.genNum==0?0:(5e-6*d.genSum);
			var coord = [
				{lat: loc.lat()-size, lng: loc.lng()-size},
				{lat: loc.lat()+size, lng: loc.lng()-size},
				{lat: loc.lat()+size, lng: loc.lng()+size},
				{lat: loc.lat()-size, lng: loc.lng()+size}
			];
			
			var rect = new google.maps.Polygon({
				paths: coord,
				strokeColor: '#000000',
				strokeWeight: 1,
				fillOpacity: 0,
				zIndex: 2,
				map: map
			});
			rect.listener = rect.addListener('click', clickFn({data:d,pos:loc}));
			powerStation[key] = rect;
		}
	}

	function UpdateTraffic(data){
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

		CLearDataInMap(cemsComp);
		CLearDataInMap(trafficSite);
		CLearDataInMap(powerStation);

		function clickFn(d){ 
			return function() {
				var str = "<p>"+d.data.type+"<br>";
				str += "車流總數: "+d.data.totalAmount+" 輛<br>";
				infoWindow.setOptions({content: str, position: d.pos});
				infoWindow.open(map);
			};
		}
		if(infoWindow.getMap()){
			infoWindow.setOptions({map: null});
		}

		for(var key in data){
			var d = data[key];
			var loc = new google.maps.LatLng(d.lat, d.lng);
			var size = d.totalAmount*5e-6;
			
			var coord = GenShape(loc,d.dir,size);
			
			var shape = new google.maps.Polygon({
				paths: coord,
				strokeColor: '#000000',
				strokeWeight: 1,
				fillOpacity: 0,
				zIndex: 2,
				map: map
			});
			shape.listener = shape.addListener('click', clickFn({data:d,pos:loc}));
			trafficSite[key] = shape;
			
		}
		
	}

	function UpdateCEMS(data){
		CLearDataInMap(cemsComp);
		CLearDataInMap(trafficSite);
		CLearDataInMap(powerStation);

		function clickFn(d){ 
			return function() {
				var str = "<p>"+d.data.name+"<br>";
				infoWindow.setOptions({content: str, position: d.pos});
				infoWindow.open(map);
			};
		}
		if(infoWindow.getMap()){
			infoWindow.setOptions({map: null});
		}

		var bounds = new google.maps.LatLngBounds();
		
		for(var key in data){
			var d = data[key];
			if((d.lat == 0 && d.lng == 0) || !d.lat || !d.lng) continue;

			var loc = new google.maps.LatLng(d.lat, d.lng);
			var size = 0.005;
			var coord = [
				{lat: loc.lat()-size, lng: loc.lng()-size},
				{lat: loc.lat()+size, lng: loc.lng()-size},
				{lat: loc.lat()+size, lng: loc.lng()+size},
				{lat: loc.lat()-size, lng: loc.lng()+size}
			];
			bounds.extend(coord[0]);
			bounds.extend(coord[2]);
			
			var rect = new google.maps.Polygon({
				paths: coord,
				strokeColor: '#000000',
				strokeWeight: 1,
				fillOpacity: 0,
				zIndex: 2,
				map: map
			});
			rect.listener = rect.addListener('click', clickFn({data:d,pos:loc}));
			cemsComp[key] = rect;
			
		}
		//console.log(bounds.getNorthEast().lat()+","+bounds.getNorthEast().lng());
		//console.log(bounds.getSouthWest().lat()+","+bounds.getSouthWest().lng());
		map.panToBounds(bounds);
		map.fitBounds(bounds);
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
