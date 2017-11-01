
var app = new Vue({
  el: "#app",
  data: {
  	sourceList: [
  		{name: "火力發電廠", value: "power"},
  		{name: "國道交通(ETC)", value: "traffic"},
  		{name: "監測系統(CEMS)", value: "cems"},
  	],
    sourceSelect: "",
    dateSelect: "",
    hourSelect: "",
    dataTable: {
      opTitle: "",
      opSelect: "",
      opList: [],
      keys: [],
      rows: [],
      length: 0
    }
  },
  created: function () {
  	var now = new Date();
  	this.sourceSelect = this.sourceList[0].value;
  	this.dateSelect = util.DateToString(now,"YYYY-MM-dd");
  	this.hourSelect = util.DateToString(now,"HH");
    //this.dateSelect = "2017-10-27";
    //this.hourSelect = "15";

    this.ChangeSource();
  },
  methods: {
  	ChangeSource: function(){
  		console.log("change source: "+this.sourceSelect);
      var op = [];
      
      var UpdateOP = function(op){
        if(op.length > 0) this.dataTable.opSelect = op[0].value;
        else this.dataTable.opSelect = "";
        this.dataTable.opList = op;
        this.UpdateData();
      }.bind(this);

      switch(this.sourceSelect){
        case "power":
          this.dataTable.opTitle = "發電類型:";
          op.push({name: "燃煤", value: "coal"});
          op.push({name: "氣電共生", value: "cogen"});
          op.push({name: "民營電廠-燃煤", value: "ippcoal"});
          op.push({name: "燃氣", value: "lng"});
          op.push({name: "民營電廠-燃氣", value: "ipplng"});
          op.push({name: "重油", value: "oil"});
          op.push({name: "輕油", value: "diesel"});
          UpdateOP(op);
          break;
        case "traffic":
          this.dataTable.opTitle = "車輛類型:";
          op.push({name: "小客車", value: "小客車"});
          op.push({name: "小貨車", value: "小貨車"});
          op.push({name: "大客車", value: "大客車"});
          op.push({name: "大貨車", value: "大貨車"});
          op.push({name: "聯結車", value: "聯結車"});
          UpdateOP(op);
          break;
        case "cems":
          this.dataTable.opTitle = "監測項目:";
          $.get("/data/cemsItem.php", function(data){
            if(!data) return;
            var json = JSON.parse(data);
            var op = [];
            for(var i=0;i<json.length;i++){
              op.push({name:json[i].desp, value:json[i].id});
            }
            UpdateOP(op);
          });
          break;
      }
      
  	},
  	ChangeDate: function(){
  		console.log("change date: "+this.dateSelect);
      this.UpdateData();
      
  	},
  	ChangeHour: function(){
  		console.log("change hour: "+this.hourSelect);
      this.UpdateData();
  	},
    ChangeDataOption: function(){
      console.log("change data option"+this.dataTable.opSelect);
      this.UpdateData();
    },
    UpdateData: function(){
      switch(this.sourceSelect){
        case "power": dt.LoadPowerGen(this); break;
        case "traffic": dt.LoadTraffic(this); break;
        case "cems": dt.LoadCEMS(this); break;
      }
    }
  }
});


window.addEventListener('load', function() {
	
});