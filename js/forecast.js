
var g_Forecast = new Vue({
  el: "#forecast",
  data: {
  	sourceList: [
  		{name: "觀測資料", value: "observe"},
  		{name: "GTx", value: "forecast"},
  		{name: "GTx+AI", value: "corrected"},
  	],
    dateSelect: "2017-12-01",
    imageSrc:{
      "observe":["","",""],
      "forecast":["","",""],
      "corrected":["","",""]
    },
  },
  created: function () {
  	this.UpdateImage();
  },
  methods: {
  	ChangeDate: function(){
  		this.UpdateImage();
  	},
    NextDate: function(){
      var day = moment(this.dateSelect, "YYYY-MM-DD");
      day.add(1, 'days');
      this.dateSelect = day.format("YYYY-MM-DD");
    },
    PrevDate: function(){
      var day = moment(this.dateSelect, "YYYY-MM-DD");
      day.add(-1, 'days');
      this.dateSelect = day.format("YYYY-MM-DD");
    },
    UpdateImage: function(){
      for(var s in this.imageSrc){
        var p = "gen/image/"+s+"/";
        for(var i=0;i<this.imageSrc[s].length;i++){
          var targetDay = moment(this.dateSelect, "YYYY-MM-DD");
          targetDay.add(i, 'days');
          var f = s+"_F"+(i+1)+"_";
          f += targetDay.format("YYYY-MM-DD")+".jpg";
          this.imageSrc[s][i] = p+f;
          //$("#F"+(i+1)).attr("src",p+f);
        }
      }
      
      //console.log(this.imageSrc);
      //不加的話image換圖會delay
      this.$forceUpdate();
    }
  }
});


window.addEventListener('load', function() {
  $('.slide-3col').slick({
    dots: true,
    infinite: false,
    speed: 700,
    autoplay: true,
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
});