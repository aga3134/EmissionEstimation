var dt = function(){

  var LoadPowerGen = function(app){
    var url = "data/powerGen.php";
    url += "?date="+app.dateSelect;
    url += "&type="+app.dataTable.opSelect;
    console.log(url);
    $.get(url, function(data){
      //console.log(data);
      if(!data) return;
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
  }

  return {
    LoadPowerGen: LoadPowerGen
  };
}();