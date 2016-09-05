$( ".cross" ).hide();
$( "#placeMenu" ).hide();
$( ".hamburger" ).click(function() {
	$( "#placeMenu" ).slideToggle("slow", function() {
	    $(".hamburger").hide();
	    $(".cross").show();
	});
});
console.log("hamburger")
$(".cross").click(function() {
	$("#placeMenu").slideToggle("slow", function() {
	    $(".cross").hide();
	    $(".hamburger").show();
	});
});