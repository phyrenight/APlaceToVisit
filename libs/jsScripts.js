var map, markers = [], marker;
function displayPlaces(name){
	var self = this;
	console.log(typeof name);
		self.name =  name;
}

$(document).ready(function() {
    function JapanPlaces() {
    	var self = this;
        self.places = ko.observableArray([
        	new displayPlaces(places[0]['names']),
        	new displayPlaces(places[1]['names']),
        		new displayPlaces(places[2]['names'])]);

     self.query = ko.observable("");
    	self.spots = ko.computed(function(){
    		var search = self.query().toLowerCase();
    	    return ko.utils.arrayFilter(self.places, function(tempplaces){
                  return places.toLowerCase().indexOf(search) >= 0;
    	    });
    	    	//if(places[i].names.toLowerCase().indexOf(search.toLowerCase()) >= 0){
    	    	//	self.places.push(new displayPlaces(places[i].names));
    	    	//}
    	    		//console.log(self.places.length)
    	    //}	
    	    
    });
    }

ko.applyBindings(new JapanPlaces());
});
places = [
              {
	            names : "Osaka Aquarium Kaiyuan",
	            address : "1 Chome-1-10 Kaigandori, Minato Ward, Osaka, Osaka Prefecture 552-0022, Japan",
                coords : {lat : 34.6550348, lng : 135.4288895}
              },
              {
	            names : "Akihabara",
	            address : "Akihabara, Japan",
	            coords : { lat : 35.7020691, lng : 139.7753269}
              },
              {
	            names : "Nijo Castle",
	            address : "541 Nijojocho, Nakagyo Ward, Kyoto, Kyoto Prefecture 604-8301, Japan",
                coords : { lat : 35.0130361, lng : 135.7503697}
              },
              {
	            names : "Shibuya Crossing", // chase seen in fast and furious tokyo drift before Hanso death
	            address : "2-29-1 Dogenzaka, Shibuya-ku, Tokyo, Japan",
	            coords : { lat : 35.6595885, lng : 139.6986289}
              },
              {
	            names : "KaiKay",
	            address :"23-7 Maruyamacho, Shibuya, Tokyo, Japan",
	            coords : {lat : 35.6617773,lng : 139.7040506}
              }];

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
      var mapDiv = document.getElementById('map')
      map = new google.maps.Map(mapDiv, {
      center: {lat : 36.204824 ,lng : 138.252924},
      zoom: 6
      });
   //   makeMapMarker()
}

function makeMapMarker() {

    for(i in places){
        marker = new google.maps.Marker({
        position: places[i].coords,
        map:map,
        title: places[i].name
    });
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
// apis
// nytimes api
nyTimesURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
nyTimesURL += '?' + $.param({"api-key": "b30fd01ee378467091f2076b2edc1c07",
                             'q': "Japan"});
        /*$.getJSON(nyTimeUrl, function(data){
        	var i = 0;
        	while(i < data['response']['docs'].length){
        		  content = data['response']['docs'][i];
// add html element        		  .append("<li class=''><a href='"+ content['web_url']+
        		  	"'>"+ content['headline']['main']+"</a><p>"
        		  	+content['snippet']+"</p></li>");
        		  i += 1;
        	}
        })error( function() { 
// add html element              .append("<h1>Ny times can not load data</h1>")
        });*/

// yelp api