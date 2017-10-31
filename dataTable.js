var dt = function(){

  var LoadPowerGen = function(app){
    $.get("data/powerGen.php", function(data){
      var genData = JSON.parse(data);
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