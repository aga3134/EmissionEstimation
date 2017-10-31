var powerGen = new Vue({
  el: "#powerGen",
  data: {
    powerGen: ""
  }
})


window.addEventListener('load', function() {
	$.get("data/powerGen.php", function(data){
		console.log(data);
		powerGen.powerGen = data;
	});
});