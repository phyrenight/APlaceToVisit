var map, markers = [], marker;

var places = [
              {
	            names : "Osaka Aquarium Kaiyuan",
	            address : "1 Chome-1-10 Kaigandori, Minato Ward, Osaka, Osaka Prefecture 552-0022, Japan",
              coords : {lat : 34.6550348, lng : 135.4288895},
              category : "tourist"
              },
              {
	            names : "Akihabara",
	            address : "Akihabara, Japan",
	            coords : { lat : 35.7020691, lng : 139.7753269},
              category : "shop"
              },
              {
	            names : "Nijo Castle",
	            address : "541 Nijojocho, Nakagyo Ward, Kyoto, Kyoto Prefecture 604-8301, Japan",
              coords : { lat : 35.0130361, lng : 135.7503697},
              category : "tourist"
              },
              {
	            names : "Shibuya Crossing", // chase seen in fast and furious tokyo drift before Hanso death
	            address : "2-29-1 Dogenzaka, Shibuya-ku, Tokyo, Japan",
	            coords : { lat : 35.6595885, lng : 139.6986289},
              category : "tourist"
              },
              {
	            names : "KaiKaya",
	            address :"23-7 Maruyamacho, Shibuya, Tokyo, Japan",
	            coords : {lat : 35.6617773,lng : 139.7040506},
              category : "shop"
	          }];

function initMap(){
    var mapDiv = document.getElementById('map')
    map = new google.maps.Map(mapDiv, {
        center: {lat : 36.204824 ,lng : 138.252924},
        zoom: 6
    });
    nyTimesApi();
    makeMapMarker(places)
}

var viewModel = {
    query: ko.observable("")
};
var placesArray = [];
viewModel.places = ko.dependentObservable(function(){
    clearMarkers(null);
    var search = this.query().toLowerCase();
    return ko.utils.arrayFilter(places, function(places){
    	  if(places.names.toLowerCase().indexOf(search) >= 0){
            placesArray.push(places.names)
            makeMapMarker(places)
            return true;
        }
    });
}, viewModel);



function get_details(places) {
    console.log(places.names)
    if(places.category == "shop"){
        console.log(places.names);
    }
    else if(places.category == "tourist"){
        wikiApi(places);
    }
    else{
        nyTimesApi();
    }
}

/*
function convertToCoords(address){
	  console.log(address)
	  url = "https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyBTHibygVGMEj52ZJ2O2THkcn93bFc7YHM";

    $.getJSON(url, function(data) {
        var latt = data['results'][0]['geometry']['location']['lat'];
        var longi = data['results'][0]['geometry']['location']['lng'];
        console.log(latt);
        console.log(longi);
        initMap(latt, longi);
    });
}
*/

function makeMapMarker(places) {
    for(i in places){
        marker = new google.maps.Marker({
        position: places[i].coords,
        map:map,
        title: places[i].names
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
//        get_details(places[i])
	    	infoWindow.open(map, marker);
	          }
        })(marker, i));
    markers.push(marker);
    }
    marker.setMap(map)

}
function clearMarkers(maps){
      for (var i = 0; i < markers.length; i++){
        //  console.log(i);
          markers[i].setMap(maps);
      }
     // markers = []
}

// apis
// nytimes api
function nyTimesApi(){
  var $details = $('#details');
  nyTimesURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  nyTimesURL += '?' + $.param({"api-key": "b30fd01ee378467091f2076b2edc1c07",
                             'q': "Japan"});
        $.getJSON(nyTimesURL, function(data){
        	var i = 0;
        	while(i < data['response']['docs'].length){
        		  content = data['response']['docs'][i];
        		  $details.append("<li class=''><a href='"+ content['web_url']+
        		  	"'>"+ content['headline']['main']+"</a><p>"
        		  	+content['snippet']+"</p></li>");
        		  i += 1;
        	}
        }).error( function() { 
              $details.append("<h1>Ny times can not load data</h1>")
        });
}

function wikiApi(places){
  var place = places.names
  var $details = $('#details');
  var wikiRequestTimeout = setTimeout(function() {
    $details.text("failed to get wiki data");
  }, 8000);

  var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
  place +"&format=json&callback=wikiCallback";
  $.ajax({
    url: wikiURL,
    dataType: 'jsonp',
    success: function(response) {
      var articleList = response[1];

      for(var i = 0; i < articleList.length; i++){
        articleStr = articleList[i];
        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
        $details.append('<a href="' + url + '">' + articleStr +
                         '</a><hr>');
      };
      clearTimeout(wikiRequestTimeout);
    }
  });
}

function fourSquareApi(){
  /* fouraquare api
     args: place a location on a map
     return: a html li
  */
  $details = $('#details');
  var foursquareURL = "https://api.foursquare.com/v2/venues/search"
  var  CLIENTID = "?client_id=AOYLTGMM0BHFXEN5CKON1LFIFJCYYT3VTOIUZIKCTNSP3BVG";
  var CLIENTSECRET = "&client_secret=YXUWA5QW3LEF1HNJYHS0FAGDWQHHKPSW0WNL0R5O0PEGOV4L";
  var version = "&v=20130815"
  var longLatt = "&ll=35.0130361,135.7503697";
  var query= "&query=Nijo castle"
  var FQURL = foursquareURL + CLIENTID + CLIENTSECRET + version + longLatt + query;  

  $.getJSON(FQURL, function(data){
    var i = 0;
    console.log("byebye")
    console.log(data['response']['venues'][0])
    var venue_id = data['response']['venues'][0]['id']
    console.log(venue_id);
    var FQMenuURL = "https://api.foursquare.com/v2/venues/" + venue_id + "/menu"
    //$.getJSON(FQMenuURL, function(getmenu){
    //  console.log(getmenu)
   // })
    })
}
fourSquareApi()
//wikiApi()
// nyTimesApi()
// yelp api
ko.applyBindings(viewModel);