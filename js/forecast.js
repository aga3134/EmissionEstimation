
var g_Forecast = new Vue({
  el: "#forecast",
  data: {
  	sourceList: [
  		{name: "觀測資料", value: "observe"},
  		{name: "GTx", value: "gtx"},
  		{name: "GTx+AI", value: "gtx-ai"},
  	],
    sourceName: "",
    sourceValue: "",
    sourceIndex: 2,
    dateSelect: "2017-12-01",
    
  },
  created: function () {
  	this.ChangeSource();
  },
  methods: {
  	ChangeDate: function(){
  		
  	},
    ChangeSource: function(){
      this.sourceName = this.sourceList[this.sourceIndex].name;
      this.sourceValue = this.sourceList[this.sourceIndex].value;
    }
  }
});


window.addEventListener('load', function() {
  $('.slide-3col').slick({
    dots: true,
    infinite: false,
    speed: 700,
    autoplay: false,
    autoplaySpeed: 5000,
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