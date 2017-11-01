var dt = function(){

  var LoadPowerGen = function(app){
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
        return;
      }
      var genData = JSON.parse(data);
      app.dataTable.length = genData.length;
      var keyArr = [];
      for(key in genData[0]){
        keyArr.push(key);
      }
      var rowArr = [];
      for(var i=0;i<genData.length;i++){
        rowArr.push(genData[i]);
      }
      app.dataTable.keys = keyArr;
      app.dataTable.rows = rowArr;
    });
  };

  var LoadTraffic = function(app){
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
        return;
      }
      var json = JSON.parse(data);
      app.dataTable.length = json.length;
      var keyArr = [];
      for(key in json[0]){
        keyArr.push(key);
      }
      var rowArr = [];
      for(var i=0;i<json.length;i++){
        rowArr.push(json[i]);
      }
      app.dataTable.keys = keyArr;
      app.dataTable.rows = rowArr;
    });
  };

  var LoadCEMS = function(app){
    var url = "data/cems.php";
    url += "?date="+app.dateSelect;
    url += "&hour="+app.hourSelect;
    url += "&item="+app.dataTable.opSelect;
    console.log(url);
    $.get(url, function(data){
      //console.log(data);
      if(!data){
        app.dataTable.keys = [];
        app.dataTable.rows = [];
        return;
      }
      var json = JSON.parse(data);
      app.dataTable.length = json.length;
      var keyArr = [];
      for(key in json[0]){
        keyArr.push(key);
      }
      var rowArr = [];
      for(var i=0;i<json.length;i++){
        rowArr.push(json[i]);
      }
      app.dataTable.keys = keyArr;
      app.dataTable.rows = rowArr;
    });
  };

  return {
    LoadPowerGen: LoadPowerGen,
    LoadTraffic: LoadTraffic,
    LoadCEMS: LoadCEMS
  };
}();