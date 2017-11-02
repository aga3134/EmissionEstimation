
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
      length: 0,
      loading: false
    }
  },
  created: function () {
  	var now = new Date();
  	this.sourceSelect = this.sourceList[0].value;
  	this.dateSelect = g_Util.DateToString(now,"YYYY-MM-dd");
  	this.hourSelect = g_Util.DateToString(now,"HH");
    //this.dateSelect = "2017-10-27";
    //this.hourSelect = "15";
    g_DT.InitSites(this);
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
          this.dataTable.opTitle = "城市:";
          op.push({name: "高雄", value: "KHH"});
          op.push({name: "台中", value: "TXG"});
          op.push({name: "宜蘭", value: "ILA"});
          op.push({name: "嘉義", value: "CYQ"});
          op.push({name: "台南", value: "TNN"});
          op.push({name: "雲林", value: "YUN"});
          op.push({name: "彰化", value: "CHA"});
          op.push({name: "桃園", value: "TAO"});
          op.push({name: "新北", value: "TPQ"});
          op.push({name: "台北", value: "TPE"});
          op.push({name: "新竹", value: "HSQ"});
          UpdateOP(op);
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
        case "power": g_DT.LoadPowerGen(this); break;
        case "traffic": g_DT.LoadTraffic(this); break;
        case "cems": g_DT.LoadCEMS(this); break;
      }
    }
  }
});


window.addEventListener('load', function() {
	
});