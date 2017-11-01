
var app = new Vue({
  el: "#app",
  data: {
  	sourceList: [
  		{name: "火力發電廠"},
  		{name: "國道交通(ETC)"},
  		{name: "監測系統(CEMS)"},
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
  	this.sourceSelect = this.sourceList[0].name;
  	this.dateSelect = util.DateToString(now,"YYYY-MM-dd");
  	this.hourSelect = util.DateToString(now,"HH");
    //this.dateSelect = "2017-10-27";
    //this.hourSelect = "15";

    this.ChangeSource();
    this.LoadPowerGen();
  },
  methods: {
  	ChangeSource: function(){
  		console.log("change source: "+this.sourceSelect);
      var op = [];
      switch(this.sourceSelect){
        case "火力發電廠":
          this.dataTable.opTitle = "發電類型:";
          op.push({name: "燃煤", value: "coal"});
          op.push({name: "氣電共生", value: "cogen"});
          op.push({name: "民營電廠-燃煤", value: "ippcoal"});
          op.push({name: "燃氣", value: "lng"});
          op.push({name: "民營電廠-燃氣", value: "ipplng"});
          op.push({name: "重油", value: "oil"});
          op.push({name: "輕油", value: "diesel"});
          break;
      }
      this.dataTable.opSelect = op[0].value;
      this.dataTable.opList = op;
  	},
  	ChangeDate: function(){
  		console.log("change date: "+this.dateSelect);
      dt.LoadPowerGen(this);
  	},
  	ChangeHour: function(){
  		console.log("change hour: "+this.hourSelect);
  	},
    ChangeDataOption: function(){
      console.log("change data option"+this.dataTable.opSelect);
      dt.LoadPowerGen(this);
    },
    LoadPowerGen: function(){
      dt.LoadPowerGen(this);
    }
  }
});


window.addEventListener('load', function() {
	
});