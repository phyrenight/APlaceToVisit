var map, markers = [], marker;
function displayPlaces(name){
	console.log(name);
	this.name = name;
}

    $(document).ready(function() {
    function JapanPlaces() {
        /*this.places = [
              {
              	name : "Japan",
              	address: "Japan",
              	coords : {lat : "0" ,lng :"0"}
              },
              {
	            name : "Osaka Aquarium Kaiyuan",
	            address : "1+Chome-1-10+Kaigandori,+Minato+Ward,+Osaka,+Osaka+Prefecture+552-0022,+Japan",
                coords : {lat :"0", lng : "0"}
              },
              {
	            name : "Akihabara",
	            address : "Akihabara,+Japan",
	            coords : { lat : "0", lng : "0"}
              },
              {
	            name : "Nijo Castle",
	            address : "541+Nijojocho,+Nakagyo+Ward,+Kyoto,+Kyoto+Prefecture+604-8301,+Japan",
                coords : { lat: "35.0130361", lng : "135.7503697"}
              },
              {
	            name : "Shibuya Crossing", // chase seen in fast and furious tokyo drift before Hanso death
	            address : "2-29-1+Dogenzaka,+Shibuya-ku,+Tokyo,+Japan",
	            coords : { lat: "35.6595885", lng: "139.6986289"}
              },
              {
	            name : "KaiKay",
	            address :"23-7+Maruyamacho,+Shibuya,+Tokyo,+Japan",
	            coords : {lat: "35.6617773",lng: "139.7040506"}
              }];*/
    
    this.spots = ko.observableArray([
    	new displayPlaces(places[0]['name']),
    	new displayPlaces(places[1]['name']),
    	new displayPlaces(places[2]['name']),
    	new displayPlaces(places[3]['name']),
    	new displayPlaces(places[4]['name']),
    	//new displayPlaces(this.places[5]['name']),
    	]);
        }

ko.applyBindings(new JapanPlaces());



});
places = [
              {
	            name : "Osaka Aquarium Kaiyuan",
	            address : "1 Chome-1-10 Kaigandori, Minato Ward, Osaka, Osaka Prefecture 552-0022, Japan",
                coords : {lat : 34.6550348, lng : 135.4288895}
              },
              {
	            name : "Akihabara",
	            address : "Akihabara, Japan",
	            coords : { lat : 35.7020691, lng : 139.7753269}
              },
              {
	            name : "Nijo Castle",
	            address : "541 Nijojocho, Nakagyo Ward, Kyoto, Kyoto Prefecture 604-8301, Japan",
                coords : { lat : 35.0130361, lng : 135.7503697}
              },
              {
	            name : "Shibuya Crossing", // chase seen in fast and furious tokyo drift before Hanso death
	            address : "2-29-1 Dogenzaka, Shibuya-ku, Tokyo, Japan",
	            coords : { lat : 35.6595885, lng : 139.6986289}
              },
              {
	            name : "KaiKay",
	            address :"23-7 Maruyamacho, Shibuya, Tokyo, Japan",
	            coords : {lat : 35.6617773,lng : 139.7040506}
              }];

 //  var address = "Japan"

/*function convertToCoords(address){
	console.log(address)
	url = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyBTHibygVGMEj52ZJ2O2THkcn93bFc7YHM";

    $.getJSON(url, function(data) {
        var latt = data['results'][0]['geometry']['location']['lat'];
        var longi = data['results'][0]['geometry']['location']['lng'];
        console.log(latt);
        console.log(longi);
        initMap(latt, longi);
    });
}*/

function initMap(){
	console.log("1st");
      var mapDiv = document.getElementById('map')
      map = new google.maps.Map(mapDiv, {

      center: {lat : 36.204824 ,lng : 138.252924},
      zoom: 6
      });
      makeMapMarker()
   // makeMapMarker({lat:latt, lng: longi}, map)
/*
    var marker = new google.maps.Marker({
    position: {lat : latt, lng : longi},
    map:map,
    title : "Japan"
    });
    markers.push(marker);
    marker.setMap(map)
*/}

function makeMapMarker() {
  //  marker = []

  for(i in places){
    console.log(places[i].coords)
    place = places[i];
    marker = new google.maps.Marker({
    position: places[i].coords,
    map:map,
    title: places[i].name

    });
/*    var contentString = "<div>" + places[i].name + "</div>"+
                         "<div>"+ places[i].address +"</div>";
    var infoWindow = new google.maps.InfoWindow({
    	content : contentString
    });
  //  marker.addListener('click', (function(place){
  //  	infoWindow.open(map,marker);
  //  })(place));*/

    google.maps.event.addListener(marker, 'click', (function(marker, i){
	    var contentString = "<div>"+ marker.title + "</div>" + 
	                        "<div>" + places[i].address + "</div>";
	    var infoWindow = new google.maps.InfoWindow({
            content : contentString,
            closeBoxUrl: ""
          });
	    infoWindow.content = contentString;
	    return function(){
	    	infoWindow.open(map, marker);
	    }
    })(marker, i));
    markers.push(marker);
  }
    marker.setMap(map)
}
