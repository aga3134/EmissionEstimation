
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
    g_DM.InitSites(this);
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
        this.UpdateTable();
        this.UpdateMap();
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
          op.push({name: "高雄市", value: "高雄市"});
          op.push({name: "台中市", value: "台中市"});
          op.push({name: "宜蘭縣", value: "宜蘭縣"});
          op.push({name: "嘉義縣", value: "嘉義縣"});
          op.push({name: "台南市", value: "台南市"});
          op.push({name: "雲林縣", value: "雲林縣"});
          op.push({name: "彰化縣", value: "彰化縣"});
          op.push({name: "桃園市", value: "桃園市"});
          op.push({name: "新北市", value: "新北市"});
          op.push({name: "台北市", value: "台北市"});
          op.push({name: "新竹縣", value: "新竹縣"});
          op.push({name: "基隆市", value: "基隆市"});
          op.push({name: "花蓮縣", value: "花蓮縣"});
          op.push({name: "苗栗縣", value: "苗栗縣"});
          UpdateOP(op);
          break;
      }
      
  	},
  	ChangeDate: function(){
  		console.log("change date: "+this.dateSelect);
      this.UpdateTable();
      this.UpdateMap();
  	},
  	ChangeHour: function(){
  		console.log("change hour: "+this.hourSelect);
      this.UpdateTable();
      this.UpdateMap();
  	},
    ChangeDataOption: function(){
      console.log("change data option"+this.dataTable.opSelect);
      this.UpdateTable();
      this.UpdateMap();
    },
    UpdateTable: function(){
      switch(this.sourceSelect){
        case "power":
          g_DT.LoadPowerGen(this);
          break;
        case "traffic":
          g_DT.LoadTraffic(this);
          break;
        case "cems":
          g_DT.LoadCEMS(this);
          break;
      }
    },
    UpdateMap: function(){
      g_DM.UpdateAirData(this);
      g_DM.UpdateWeather(this);
    }
  }
});


window.addEventListener('load', function() {
	
});