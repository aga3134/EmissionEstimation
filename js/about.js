window.addEventListener('load', function() {
	$(".top-menu").click(function(){
    var toggleMenu = $(".toggle-menu");
    var mode = toggleMenu.css("display");
    if(mode == "none") toggleMenu.css("display","block");
    else if(mode == "block") toggleMenu.css("display","none");
  });
});