var g_DT = function(){
  var powerStation = {"coal":{},"cogen":{},"ippcoal":{},"lng":{},"ipplng":{},"oil":{},"diesel":{}};
  var trafficSite = {};
  var cemsComp = {"高雄市":{},"台中市":{},"宜蘭縣":{},"嘉義縣":{},"台南市":{},"雲林縣":{},"彰化縣":{},
    "桃園市":{},"新北市":{},"台北市":{},"新竹縣":{},"基隆市":{},"花蓮縣":{},"苗栗縣":{}};
  var cemsItem = {};
  var cemsStatus = {};
  var mapData = [];

  var InitSites = function(app){
    $.get("data/powerStation.php", function(data){
      if(!data) return;
      json = JSON.parse(data);
      for(var i=0;i<json.length;i++){
        var station = json[i];
        if(station.type in powerStation){
          powerStation[station.type][station.id] = station;
        }
      }
      //console.log(powerStation);
      $.get("data/trafficSite.php", function(data){
        if(!data) return;
        json = JSON.parse(data);
        for(var i=0;i<json.length;i++){
          var site = json[i];
          trafficSite[site.id] = site;
        }
        //console.log(trafficSite);
        $.get("data/cemsComp.php", function(data){
          if(!data) return;
          json = JSON.parse(data);
          for(var i=0;i<json.length;i++){
            var comp = json[i];
            if(comp.city in cemsComp){
              cemsComp[comp.city][comp.id] = comp;
            }
          }
          //console.log(cemsComp);
          $.get("data/cemsItem.php", function(data){
            if(!data) return;
            json = JSON.parse(data);
            for(var i=0;i<json.length;i++){
              var item = json[i];
              cemsItem[item.id] = item;
            }
            //console.log(cemsItem);
            app.UpdateTable();
          });

          $.get("data/cemsStatus.php", function(data){
            if(!data) return;
            json = JSON.parse(data);
            for(var i=0;i<json.length;i++){
              var status = json[i];
              cemsStatus[status.statusCode] = status;
            }
            //console.log(cemsStatus);
          });


        });
      });
    });

  }

  function GenMapPowerData(app,data){
    mapData = [];
    if(!data || app.sourceSelect != "power") return;

    for(var key in powerStation){
      var powerType = powerStation[key];
      for(var id in powerType){
        var station = powerType[id];
        mapData[station.id] = station;
        mapData[station.id].genSum = 0;
        mapData[station.id].genNum = 0;
        mapData[station.id].type = key;
      }
    }

    for(var i=0;i<data.length;i++){
      var d = data[i];
      var station = mapData[d.stationID];
      if(!station) continue;
      station.genSum += parseFloat(d.powerGen);
      station.genNum++;
    }
    //console.log(mapData);
    g_DM.UpdatePower(app, mapData);
  }

  function GenMapTrafficData(app,data){
    mapData = [];
    if(!data || app.sourceSelect != "traffic") return;

    for(var key in trafficSite){
      var site = trafficSite[key];
      mapData[site.id] = site;
      mapData[site.id].dir = site.id[site.id.length-1];
      mapData[site.id].totalAmount = 0;
      mapData[site.id].totalNum = 0;
      mapData[site.id].type = app.dataTable.opSelect;
    }

    for(var i=0;i<data.length;i++){
      var d = data[i];
      var site = mapData[d.siteID];
      if(!site) continue;
      site.totalAmount += parseInt(d.amount);
      site.totalNum++;
    }
    //console.log(mapData);
    g_DM.UpdateTraffic(app, mapData);
  }

  function GenMapCEMSData(app,data){
    mapData = [];
    if(!data || app.sourceSelect != "cems") return;

    var compArr = cemsComp[app.dataTable.opSelect];
    for(var key in compArr){
      var comp = compArr[key];
      mapData[comp.id] = comp;
      mapData[comp.id].p_no = [];
      mapData[comp.id].city = app.dataTable.opSelect;
    }

    for(var i=0;i<data.length;i++){
      var d = data[i];
      var comp = mapData[d.c_no];
      if(!comp) continue;
      if(comp.p_no[d.p_no]){
        var p = comp.p_no[d.p_no];
        if(p[d.item]){
          p[d.item].valueSum += parseFloat(d.value);
          p[d.item].valueNum++;
        }
        else{
          var item = {valueSum: parseFloat(d.value), valueNum: 1};
          p[d.item] = item;
        }
      }
      else{
        var p = {};
        var item = {valueSum: parseFloat(d.value), valueNum: 1};
        p[d.item] = item;
        comp.p_no[d.p_no] = p;
      }
    }
    //console.log(mapData);
    g_DM.UpdateCEMS(app, mapData);
  }

  var LoadPowerGen = function(app){
    app.dataTable.loading = true;
    var url = "data/powerGen.php";
    url += "?date="+app.dateSelect;
    url += "&hour="+app.hourSelect;
    url += "&type="+app.dataTable.opSelect;
    console.log(url);
    $.get(url, function(data){
      //console.log(data);
      if(!data){
        app.dataTable.keys = [];
        app.dataTable.rows = [];
        app.dataTable.loading = false;
        mapData = [];
        return;
      }
      var json = JSON.parse(data);
      GenMapPowerData(app,json);
      app.dataTable.length = json.length;
      var keyArr = [{name:"機組名稱",value:"name"},
        {name:"淨發電量(MW)",value:"gen"},
        {name:"利用率(%)",value:"percent"},
        {name:"備註",value:"remark"},
        {name:"時間",value:"time"}];
      var rowArr = [];
      var stations = powerStation[app.dataTable.opSelect];
      for(var i=0;i<json.length;i++){
        var d = json[i];
        var station = stations[d.stationID];
        if(!station) continue;
        var record = {};
        record["name"] = station.name;
        record["gen"] = d.powerGen;
        record["percent"] = (100*d.powerGen/station.capacity).toFixed(2);
        record["remark"] = d.remark;
        record["time"] = g_Util.DateToString(new Date(d.time),"HH:mm");
        rowArr.push(record);
      }
      app.dataTable.keys = keyArr;
      app.dataTable.rows = rowArr;
      app.dataTable.loading = false;
    });
  };

  var LoadTraffic = function(app){
    app.dataTable.loading = true;
    var url = "data/traffic.php";
    url += "?date="+app.dateSelect;
    url += "&hour="+app.hourSelect;
    url += "&type="+app.dataTable.opSelect;
    console.log(url);
    $.get(url, function(data){
      //console.log(data);
      if(!data){
        app.dataTable.keys = [];
        app.dataTable.rows = [];
        app.dataTable.loading = false;
        mapData = [];
        return;
      }
      var json = JSON.parse(data);
      GenMapTrafficData(app,json);
      app.dataTable.length = json.length;

      var keyArr = [{name:"國道別",value:"highway"},
        {name:"交流道",value:"interchange",isLong:true},
        {name:"方向",value:"dir"},
        {name:"數量(輛)",value:"amount"},
        {name:"時間",value:"time"}];
      var rowArr = [];
      for(var i=0;i<json.length;i++){
        var d = json[i];
        var site = trafficSite[d.siteID];
        if(!site) continue;
        var record = {};
        record["highway"] = site.highway;
        record["interchange"] = site.interchange;
        record["dir"] = d.dir;
        record["amount"] = d.amount;
        record["time"] = g_Util.DateToString(new Date(d.time),"HH:mm");
        rowArr.push(record);
      }
      app.dataTable.keys = keyArr;
      app.dataTable.rows = rowArr;
      app.dataTable.loading = false;
    });
  };

  var LoadCEMS = function(app){
    app.dataTable.loading = true;
    var url = "data/cems.php";
    url += "?date="+app.dateSelect;
    url += "&hour="+app.hourSelect;
    url += "&city="+app.dataTable.opSelect;
    console.log(url);
    $.get(url, function(data){
      //console.log(data);
      if(!data){
        app.dataTable.keys = [];
        app.dataTable.rows = [];
        app.dataTable.loading = false;
        mapData = [];
        return;
      }
      var json = JSON.parse(data);
      GenMapCEMSData(app,json);
      app.dataTable.length = json.length;
      var keyArr = [{name:"公司",value:"compName"},
        {name:"裝置編號",value:"p_no"},
        {name:"項目",value:"itemName"},
        {name:"數值",value:"value"},
        {name:"時間",value:"time"},
        {name:"狀態",value:"status"}];
      var rowArr = [];
      var comps = cemsComp[app.dataTable.opSelect];
      for(var i=0;i<json.length;i++){
        var d = json[i];
        var site = comps[d.c_no];
        var item = cemsItem[d.item.trim()];
        if(!site || !item) continue;
        var record = {};
        record["compName"] = site.name;
        record["p_no"] = d.p_no;
        record["itemName"] = item.desp;
        record["value"] = d.value+" ("+item.unit+")";
        record["time"] = g_Util.DateToString(new Date(d.time),"HH:mm");
        record["status"] = cemsStatus[d.statusCode].desp;
        rowArr.push(record);
      }
      app.dataTable.keys = keyArr;
      app.dataTable.rows = rowArr;
      app.dataTable.loading = false;
    });
  };

  //==============init=================
  

  return {
    InitSites: InitSites,
    LoadPowerGen: LoadPowerGen,
    LoadTraffic: LoadTraffic,
    LoadCEMS: LoadCEMS
  };
}();