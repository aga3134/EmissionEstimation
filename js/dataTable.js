var g_DT = function(){
  var powerStation = {"coal":{},"cogen":{},"ippcoal":{},"lng":{},"ipplng":{},"oil":{},"diesel":{}};
  var trafficSite = {};
  var cemsComp = {"高雄市":{},"台中市":{},"宜蘭縣":{},"嘉義縣":{},"台南市":{},"雲林縣":{},"彰化縣":{},
    "桃園市":{},"新北市":{},"台北市":{},"新竹縣":{},"基隆市":{},"花蓮縣":{},"苗栗縣":{}};
  var cemsItem = {};
  var cemsStatus = {};
  var mapData = [];

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
            g_APP.UpdateTable();
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

  function GenMapPowerData(data){
    mapData = [];
    if(!data || g_APP.sourceSelect != "power") return;

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

    //發電單位是功率MV，對時間應該取平均而不是加總。這邊用加總是方便之後計算平均值
    for(var i=0;i<data.length;i++){
      var d = data[i];
      var station = mapData[d.stationID];
      if(!station) continue;
      station.genSum += parseFloat(d.powerGen);
      station.genNum++;
    }
    //console.log(mapData);
    g_DM.UpdatePower(mapData);
  }

  function GenMapTrafficData(data){
    mapData = [];
    if(!data || g_APP.sourceSelect != "traffic") return;

    for(var key in trafficSite){
      var site = trafficSite[key];
      mapData[site.id] = site;
      mapData[site.id].dir = site.id[site.id.length-1];
      mapData[site.id].totalAmount = 0;
      mapData[site.id].totalNum = 0;
      mapData[site.id].type = g_APP.dataTable.opSelect;
    }

    for(var i=0;i<data.length;i++){
      var d = data[i];
      var site = mapData[d.siteID];
      if(!site) continue;
      site.totalAmount += parseInt(d.amount);
      site.totalNum++;
    }
    //console.log(mapData);
    g_DM.UpdateTraffic(mapData);
  }

  function GenMapCEMSData(data){
    mapData = [];
    if(!data || g_APP.sourceSelect != "cems") return;

    var compArr = cemsComp[g_APP.dataTable.opSelect];
    for(var key in compArr){
      var comp = compArr[key];
      mapData[comp.id] = comp;
      mapData[comp.id].p_no = [];
      mapData[comp.id].city = g_APP.dataTable.opSelect;
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
    g_DM.UpdateCEMS(mapData);
  }

  var LoadPowerGen = function(){
    g_APP.dataTable.loading = true;
    var url = "data/powerGen.php";
    url += "?date="+g_APP.dateSelect;
    url += "&hour="+g_APP.hourSelect;
    url += "&type="+g_APP.dataTable.opSelect;
    //console.log(url);
    $.get(url, function(data){
      //console.log(data);
      if(!data){
        g_APP.dataTable.keys = [];
        g_APP.dataTable.rows = [];
        g_APP.dataTable.loading = false;
        mapData = [];
        return;
      }
      var json = JSON.parse(data);
      GenMapPowerData(json);
      g_APP.dataTable.length = json.length;
      var keyArr = [{name:"機組名稱",value:"name"},
        {name:"淨發電量(MW)",value:"gen"},
        {name:"利用率(%)",value:"percent"},
        {name:"備註",value:"remark"},
        {name:"時間",value:"time"}];
      var rowArr = [];
      var stations = powerStation[g_APP.dataTable.opSelect];
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
      g_APP.dataTable.keys = keyArr;
      g_APP.dataTable.rows = rowArr;
      g_APP.dataTable.loading = false;
      g_APP.UpdateFilterRows();
    });
  };

  var LoadTraffic = function(){
    g_APP.dataTable.loading = true;
    var url = "data/traffic.php";
    url += "?date="+g_APP.dateSelect;
    url += "&hour="+g_APP.hourSelect;
    url += "&type="+g_APP.dataTable.opSelect;
    //console.log(url);
    $.get(url, function(data){
      //console.log(data);
      if(!data){
        g_APP.dataTable.keys = [];
        g_APP.dataTable.rows = [];
        g_APP.dataTable.loading = false;
        mapData = [];
        return;
      }
      var json = JSON.parse(data);
      GenMapTrafficData(json);
      g_APP.dataTable.length = json.length;

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
      g_APP.dataTable.keys = keyArr;
      g_APP.dataTable.rows = rowArr;
      g_APP.dataTable.loading = false;
      g_APP.UpdateFilterRows();
    });
  };

  var LoadCEMS = function(){
    g_APP.dataTable.loading = true;
    var url = "data/cems.php";
    url += "?date="+g_APP.dateSelect;
    url += "&hour="+g_APP.hourSelect;
    url += "&city="+g_APP.dataTable.opSelect;
    //console.log(url);
    $.get(url, function(data){
      //console.log(data);
      if(!data){
        g_APP.dataTable.keys = [];
        g_APP.dataTable.rows = [];
        g_APP.dataTable.loading = false;
        mapData = [];
        return;
      }
      var json = JSON.parse(data);
      GenMapCEMSData(json);
      g_APP.dataTable.length = json.length;
      var keyArr = [{name:"公司",value:"compName"},
        {name:"裝置編號",value:"p_no"},
        {name:"項目",value:"itemName"},
        {name:"數值",value:"value"},
        {name:"時間",value:"time"},
        {name:"狀態",value:"status"}];
      var rowArr = [];
      var comps = cemsComp[g_APP.dataTable.opSelect];
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
      g_APP.dataTable.keys = keyArr;
      g_APP.dataTable.rows = rowArr;
      g_APP.dataTable.loading = false;
      g_APP.UpdateFilterRows();
    });
  };

  var LoadCEMSEmission = function(){
    g_APP.dataTable.loading = true;
    var url = "data/cemsEmission.php";
    url += "?date="+g_APP.dateSelect;
    url += "&hour="+g_APP.hourSelect;
    url += "&city="+g_APP.dataTable.opSelect;
    //console.log(url);
    $.get(url, function(data){
      //console.log(data);
      if(!data){
        g_APP.dataTable.keys = [];
        g_APP.dataTable.rows = [];
        g_APP.dataTable.loading = false;
        mapData = [];
        return;
      }
      var json = JSON.parse(data);
      GenMapCEMSData(json);
      g_APP.dataTable.length = json.length;
      var keyArr = [{name:"公司",value:"compName"},
        {name:"裝置編號",value:"p_no"},
        {name:"SOx",value:"EMI_SOx"},
        {name:"NOx",value:"EMI_NOx"},
        {name:"CO",value:"EMI_CO"},
        {name:"VOC",value:"EMI_CH4"},
        {name:"時間",value:"dateTime"}];
      var rowArr = [];
      var comps = cemsComp[g_APP.dataTable.opSelect];
      for(var i=0;i<json.length;i++){
        var d = json[i];
        var site = comps[d.c_no];
        if(!site) continue;
        var record = {};
        record["compName"] = site.name;
        record["p_no"] = d.p_no;
        record["EMI_SOx"] = d.EMI_SOx;
        if(record["EMI_SOx"]){
          record["EMI_SOx"] += " (公噸/小時)";
        }
        record["EMI_NOx"] = d.EMI_NOx;
        if(record["EMI_NOx"]){
          record["EMI_NOx"] += " (公噸/小時)";
        }
        record["EMI_CO"] = d.EMI_CO;
        if(record["EMI_CO"]){
          record["EMI_CO"] += " (公噸/小時)";
        }
        record["EMI_CH4"] = d.EMI_CH4;
        if(record["EMI_CH4"]){
          record["EMI_CH4"] += " (公噸/小時)";
        }
        record["dateTime"] = g_Util.DateToString(new Date(d.dateTime),"HH:mm");
        rowArr.push(record);
      }
      g_APP.dataTable.keys = keyArr;
      g_APP.dataTable.rows = rowArr;
      g_APP.dataTable.loading = false;
      g_APP.UpdateFilterRows();
    });
  };

  //==============init=================
  

  return {
    InitSites: InitSites,
    LoadPowerGen: LoadPowerGen,
    LoadTraffic: LoadTraffic,
    LoadCEMS: LoadCEMS,
    LoadCEMSEmission: LoadCEMSEmission
  };
}();