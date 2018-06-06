
var g_Analysis = new Vue({
  el: "#analysis",
  data: {
    imagePath: "http://140.110.141.247/PMfpj/pm25pj/",
  	sourceList: [
  		{category: "觀測", item:[
        {name: "日均值", file: "Observation", minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "3:00+風向", file: "Obs_wind3", minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "9:00+風向", file: "Obs_wind9", minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "15:00+風向", file: "Obs_wind15", minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "21:00+風向", file: "Obs_wind21", minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
      ]},
      {category: "逆軌跡", item:[
        {name: "btraj+U+Oversea", file: "bU+oversea",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "cal-abs(b)", file: "b_cal_obs",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "Pmf_b", file: "PMf_b",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "btraj+oversea", file: "b+oversea",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "Pmf_bU", file: "PMf_bU",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
      ]},
  		{category: "來源分析", item:[
        {name: "PMfstrS", file: "PMfstrS",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "PMfstrL", file: "PMfstrL",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "PMfstrA", file: "PMfstrA",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "oversea", file: "oversea",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9}
      ]},
      {category: "風向", item:[
        {name: "3:00", file: "WindDir3", minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "9:00", file: "WindDir9", minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "15:00", file: "WindDir15", minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "21:00", file: "WindDir21", minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
      ]},
      {category: "氣溫", item:[
        {name: "EPA", file: "EpaTemp",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "CWB", file: "CwbTemp",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9}
      ]},
      {category: "降雨", item:[
        {name: "EPA", file: "EpaPwat",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9},
        {name: "CWB", file: "CwbPwat",minLat:21.6,minLng:119.1,maxLat:25.7,maxLng:122.9}
      ]},
      {category: "NCEP", item:[
        {name: "風向 2:00", file: "NcepWind1",minLat:5.2,minLng:107.8,maxLat:42.2,maxLng:142.3},
        {name: "風向 8:00", file: "NcepWind2",minLat:5.2,minLng:107.8,maxLat:42.2,maxLng:142.3},
        {name: "風向 14:00", file: "NcepWind3",minLat:5.2,minLng:107.8,maxLat:42.2,maxLng:142.3},
        {name: "風向 20:00", file: "NcepWind4",minLat:5.2,minLng:107.8,maxLat:42.2,maxLng:142.3},
        {name: "氣溫", file: "NcepTemp",minLat:-17.5,minLng:105,maxLat:62.9,maxLng:186},
        {name: "降雨", file: "NcepRain",minLat:-17.5,minLng:105,maxLat:62.9,maxLng:186},
      ]},
  	],
    catIndex: [0,1,2],
    itemIndex: [0,0,0],
    dateSelect: "",
    imageSrc:["","",""],
    overlay:[null,null,null],
    opacity: 0.8
  },
  created: function () {
    var now = moment("2018-01-01");
    this.dateSelect = now.format("YYYY-MM-DD");
  	this.UpdateImage();
  },
  methods: {
  	ChangeDate: function(){
  		this.UpdateImage();
  	},
    UpdateImage: function(){

      for(var i=0;i<this.imageSrc.length;i++){
        var catID = this.catIndex[i];
        var itemID = this.itemIndex[i];
        var item = this.sourceList[catID].item[itemID];
        var d = this.dateSelect.split("-").join("");
        var file = this.imagePath+d+"/"+d+item.file+".jpg";
        this.imageSrc[i] = file;

        if(this.overlay[i]){
          this.overlay[i].setImage(file);
          this.overlay[i].setOpacity(this.opacity);
          var bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(item.minLat, item.minLng),
            new google.maps.LatLng(item.maxLat, item.maxLng));

          this.overlay[i].setBound(bounds);
        }
        
      }
      
      //console.log(this.imageSrc);
      //不加的話image換圖會delay
      this.$forceUpdate();
    },
    InitMap: function(){
      var loc = {lat: 23.682094, lng: 121, zoom: 7};
      var taiwan = new google.maps.LatLng(loc.lat,loc.lng);

      for(var i=0;i<this.overlay.length;i++){
        var map = new google.maps.Map(document.getElementById('mapA'+(i+1)), {
          center: taiwan,
          zoom: loc.zoom,
          scaleControl: true,
          disableDefaultUI: true
        });
        this.overlay[i] = new USGSOverlay(map);
      }
      
      this.UpdateImage();
    },
    ChangeCategory: function(index){
      this.itemIndex[index] = 0;
      this.UpdateImage();
    },
    ChangeItem: function(index){
      this.UpdateImage();
    }
  }
});


window.addEventListener('load', function() {
  $('.slide-3col').slick({
    dots: true,
    infinite: false,
    speed: 700,
    autoplay: false,
    autoplaySpeed: 10000,
    swipe: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {breakpoint: 1024,settings: {slidesToShow: 2}},
      {breakpoint: 600,settings: {slidesToShow: 1}}
    ]
  });

	$(".top-menu").click(function(){
    var toggleMenu = $(".toggle-menu");
    var mode = toggleMenu.css("display");
    if(mode == "none") toggleMenu.css("display","block");
    else if(mode == "block") toggleMenu.css("display","none");
  });

  g_Analysis.InitMap();

});