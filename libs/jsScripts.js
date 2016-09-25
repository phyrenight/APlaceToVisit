
var map, lastMarker  = null;

var places = [
              {
                names : "Osaka Aquarium Kaiyuan",
                address : "1 Chome-1-10 Kaigandori, Minato Ward, Osaka, Osaka Prefecture 552-0022, Japan",
                coords : {lat : 34.6550348, lng : 135.4288895},
                category : "tourist",
              },
              {
                names : "Nijo Castle",
                address : "541 Nijojocho, Nakagyo Ward, Kyoto, Kyoto Prefecture 604-8301, Japan",
                coords : { lat : 35.0130361, lng : 135.7503697},
                category : "tourist",
              },
              {
                names : "KaiKaya",
                address :"23-7 Maruyamacho, Shibuya, Tokyo, Japan",
                coords : {lat : 35.6617773,lng : 139.7040506},
                category : "shop",
              },
              {
                names : "Gamers",
                address : "1-14-7, Sotokanda, Chiyoda-ku, Tokyo, 101-0021",
                coords : {lat : 35.69835,lng : 139.7716411},
                category : "shop",
              },
              {
                names : "Ichiran Shibuya",
                address : "1-22-7 Jinnan Sibuya-ku Tokyo-to 150-0041",
                coords : {lat : 35.6665006,lng : 139.6975192},
                category : "shop",
              }];

function Local(dataObj){
  var self = this;
  self.names = dataObj.names;
  self.address = dataObj.address;
  self.coords = dataObj.coords;
  self.category = dataObj.category;
  self.marker = "";
  self.infowindow = "";
}

var ViewModel = function(Map){
  var self = this;
  self.query = ko.observable("")

  self.allPlaces = ko.observableArray();
  places.forEach(function(place){
    self.allPlaces.push(new Local(place))
  });
  
  for(var i = 0; i < (places.length); i++){
    self.allPlaces()[i].marker = Map.makeMapMarker(places[i]);
    console.log(self.allPlaces())
  }

    for(var i = 0; i < (places.length); i++){
    self.allPlaces()[i].infowindow = Map.makeInfoWindow(allPlaces()[i]);
    console.log(self.allPlaces())
  }

  /*places.forEach(function(place){
    self.allPlaces.marker.push(Map.makeMapMarker(place))
    console.log(self.allPlaces())
  });*/
  self.doSomething = function(place){
    markerAnimation(place);
  }

  self.showPlaces = ko.computed(function(){
  var placesArray = [];
  var search = self.query().toLowerCase();
    var newArray = ko.utils.arrayFilter(self.allPlaces(), function(item){
      if(item.names.toLowerCase().indexOf(search) > -1){
        var value = true
        placesArray.push(item);
        return value;
      }
    });
    Map.makeMapMarker(placesArray);
    return newArray;
  }, ViewModel);
}

/*function get_details(places) {
  // displays content to page based on places.category
  if(places.category == "shop"){
    yelpApi(places);
    changeMapCenter(places);
  }
  else if(places.category == "tourist"){
    wikiApi(places);
    changeMapCenter(places);
  }
  else{
    nyTimesApi();
  }
}*/

function initMap(){
  // gets google map
  var mapDiv = document.getElementById('map')
  map = new google.maps.Map(mapDiv, {
    center: {lat : 36.204824 ,lng : 138.252924},
    zoom: 6
  });
 // nyTimesApi();

  this.makeMapMarker = function(places) {
   // clearMarkers();
    // place maps marker on the map

    marker = [];
  //  for(var i in places){
      marker = new google.maps.Marker({
        position: places.coords,
        map:map,
        animation: null,
        title: places.names
      });
     /* google.maps.event.addListener(marker, 'click', (function info(marker){
        // put infowindow and on/off for marker bounce
        var contentString = "<div>"+ marker.title + "</div>" + 
                          "<div>" + places.address + "</div>";
        var infoWindow = new google.maps.InfoWindow({
          content : contentString,
          closeBoxUrl: ""
        });
        console.log("hello");
        infoWindow.content = contentString;
        return function(){
        //  get_details(places[i])
          infoWindows = infoWindow;
      //    stopAnimation(i);
        }
      })(marker));*/
    //  markers.push(marker);
    //} 
    //marker.setAnimation(google.maps.Animation.BOUNCE);
    marker.setMap(map)
    return marker;
  }
  this.makeInfoWindow = function(place){
    var marker = place.marker
    var infoWindow;
    google.maps.event.addListener(marker, 'click', (function info(marker){
    // put infowindow and on/off for marker bounce
      var contentString = "<div>"+ marker.title + "</div>" + 
                        "<div>" + place.address + "</div>";
      infoWindow = new google.maps.InfoWindow({
        content : contentString,
        closeBoxUrl: ""
      });
      infoWindow.content = contentString;
      return function(){
        //  get_details(places[i])
        //infoWindow.open(map, marker);
            markerAnimation(place);
      }
    })(marker));
    return infoWindow;
  }
}

var markerAnimation = function(place){
  var marker = place.marker;
  console.log(marker)
  if(marker.getAnimation() != null){
    place.infowindow.close();
    marker.setAnimation(null);
  }else{
    if(lastMarker != null){
      lastMarker.infowindow.close();
      lastMarker.marker.setAnimation(null);
    }
  place.infowindow.open(map, marker);
  marker.setAnimation(google.maps.Animation.BOUNCE);
  changeMapCenter(place)
  lastMarker = place
  }
}

/*
function clearMarkers(maps){
  // clears map markers
  for (var i = 0; i < markers.length; i++){
    markers[i].setMap(maps);
  }
}
*/
var changeMapCenter = function(place){
  // zooms and centers map
  map.setCenter({lat: place.coords.lat, lng: place.coords.lng});
  map.setZoom(10);
}
/*
// apis
// nytimes api
function nyTimesApi(){
  var $details = $('#details');
  nyTimesURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  nyTimesURL += '?' + $.param({"api-key": "b30fd01ee378467091f2076b2edc1c07",
                             'q': "Japan"});
  $.getJSON(nyTimesURL, function(data){
      var i = 0;
      $details.empty().append();
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

//wikipedia
function wikiApi(places){
  var place = places.names;
  var $details = $('#details');
  $details.empty();
  var wikiRequestTimeout = setTimeout(function() {
    alert("failed to get wiki data");
  }, 8000);

  var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
  place +"&format=json&callback=wikiCallback";
  $.ajax({
    url: wikiURL,
    dataType: 'jsonp',
    success: function(response) {
      var articleList = response[1];
      var url = "<a href='"+ response[3][0]+"'>"+response[1]+"</a>";
      var api = "<h4>Api used: Wikipedia</h4>"
      var description = "<p>"+response[2]+"</p>" 
      $details.append(api+url+description);
      clearTimeout(wikiRequestTimeout);
    }
  });
}
//random generator used for Yelp api
function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}
//Yelp 
function yelpApi(places) {
  var $details = $('#details');
  var yelpHTML = "";

  parameters = {
    term: places.names,
    location: 'japan',
    oauth_consumer_key : yelp_consumer_key,
    oauth_token : yelp_token,
    oauth_signature_method : "HMAC-SHA1",
    oauth_timestamp : Math.floor(Date.now()/1000),
    oauth_nonce : nonce_generate(),
    oauth_version: "1.0",
    callback: "cb"
  }
  var EncodeSignature = oauthSignature.generate('GET', yelpURL, parameters, yelp_consumer_secret, yelp_token_secret);
  parameters.oauth_signature = EncodeSignature;  
  var setting = {
    url: yelpURL,
    data:parameters,
    cache: true,
    dataType: 'jsonp',
    jsonCallback: 'cb',
    success: function(data){
      yelpHTML = "<img src='"+data.businesses[0].image_url+"'><h1>"+
      data.businesses[0].name+"</h1><img src='"+
      data.businesses[0].rating_img_url+"'><p>Address: "+
      data.businesses[0].location.display_address[0]+" "+data.businesses[0].location.display_address[1]+
      "</p><p>"+data.businesses[0].location.display_address[2]+" "+data.businesses[0].location.display_address[3]+
      " "+data.businesses[0].location.display_address[4]+"</p><p>phone number: "+data.businesses[0].phone+
      "</p>Url: <a href='"+data.businesses[0].categories.url+"'>yelp page</a><h3>*"+data.businesses[0].snippet_text+"</h3>";
      
      $details.empty().append(yelpHTML);
    },
    error: function(error){
      alert(error);
    }
  }
  $.ajax(setting);
}*/
var start = function() {
  var Map = new initMap();
  var viewModel = ViewModel(Map)
  ko.applyBindings(viewModel);
}