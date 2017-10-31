
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
      keys: [],
      rows: []
    }
  },
  created: function () {
  	var now = new Date();
  	this.sourceSelect = this.sourceList[0].name;
  	this.dateSelect = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
  	this.hourSelect = now.getHours();

    this.LoadPowerGen();
  },
  methods: {
  	ChangeSource: function(){
  		console.log("change source: "+this.sourceSelect);
  	},
  	ChangeDate: function(){
  		console.log("change date: "+this.dateSelect);
  	},
  	ChangeHour: function(){
  		console.log("change hour: "+this.hourSelect);
  	},
    LoadPowerGen: function(){
      dt.LoadPowerGen(this);
    }
  }
});


window.addEventListener('load', function() {
	
});