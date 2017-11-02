var g_DT = function(){
  var powerStation = {"coal":{},"cogen":{},"ippcoal":{},"lng":{},"ipplng":{},"oil":{},"diesel":{}};
  var trafficSite = {};
  var cemsComp = {"KHH":{},"TXG":{},"ILA":{},"CYQ":{},"TNN":{},"YUN":{},"CHA":{},"TAO":{},"TPQ":{},"TPE":{},"HSQ":{}};
  var cemsItem = {};

  var InitSites = function(){
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
    });

    $.get("data/trafficSite.php", function(data){
      if(!data) return;
      json = JSON.parse(data);
      for(var i=0;i<json.length;i++){
        var site = json[i];
        trafficSite[site.id] = site;
      }
      //console.log(trafficSite);
    });

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
    });

    $.get("data/cemsItem.php", function(data){
      if(!data) return;
      json = JSON.parse(data);
      for(var i=0;i<json.length;i++){
        var item = json[i];
        cemsItem[item.id] = item;
      }
      //console.log(cemsItem);
    });
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
        return;
      }
      var genData = JSON.parse(data);
      app.dataTable.length = genData.length;
      var keyArr = [{name:"機組名稱",value:"name"},
        {name:"淨發電量(MV)",value:"gen"},
        {name:"利用率(%)",value:"percent"},
        {name:"備註",value:"remark"},
        {name:"時間",value:"time"}];
      var rowArr = [];
      var stations = powerStation[app.dataTable.opSelect];
      for(var i=0;i<genData.length;i++){
        var d = genData[i];
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
        return;
      }
      var json = JSON.parse(data);
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
        return;
      }
      var json = JSON.parse(data);
      app.dataTable.length = json.length;
      var keyArr = [{name:"公司",value:"compName"},
        {name:"裝置編號",value:"p_no"},
        {name:"項目",value:"itemName"},
        {name:"數值",value:"value"},
        {name:"時間",value:"time"}];
      var rowArr = [];
      var comps = cemsComp[app.dataTable.opSelect];
      for(var i=0;i<json.length;i++){
        var d = json[i];
        var site = comps[d.c_no];
        var item = cemsItem[d.item];
        if(!site || !item) continue;
        var record = {};
        record["compName"] = site.name;
        record["p_no"] = d.p_no;
        record["itemName"] = item.desp;
        record["value"] = d.value+" ("+item.unit+")";
        record["time"] = g_Util.DateToString(new Date(d.time),"HH:mm");
        rowArr.push(record);
      }
      app.dataTable.keys = keyArr;
      app.dataTable.rows = rowArr;
      app.dataTable.loading = false;
    });
  };

  //==============init=================
  InitSites();

  return {
    LoadPowerGen: LoadPowerGen,
    LoadTraffic: LoadTraffic,
    LoadCEMS: LoadCEMS
  };
}();