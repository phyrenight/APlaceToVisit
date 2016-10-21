var map, viewModel, lastMarker = null;

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

  this.get_details = function() {
  // displays content to page based on places.category
  var data = {marker: self.marker, coords: self.coords, infowindow: self.infowindow};
  if(self.category == "shop"){
    yelpApi(self.names);
  }
  else if(self.category == "tourist"){
    wikiApi(self.names);
  }
  else{
    nyTimesApi();
  }
  markerAnimation(data);
};

}

var ViewModel = function(Map){
  var self = this;
  self.query = ko.observable("");
  self.apiDetails = ko.observable();
  self.apiError = ko.observable(false);

  self.allPlaces = ko.observableArray();
  places.forEach(function(place){
    self.allPlaces.push(new Local(place));
  });

  for(let i = 0; i < (places.length); i++){
    self.allPlaces()[i].marker = Map.makeMapMarker(places[i]);
  }

  for(let i = 0; i < (places.length); i++){
    self.allPlaces()[i].infowindow = Map.makeInfoWindow(self.allPlaces()[i]);
  }

  self.showPlaces = ko.computed(function(){
  var search = self.query().toLowerCase();
    var newArray = ko.utils.arrayFilter(self.allPlaces(), function(item){
      if(item.names.toLowerCase().indexOf(search) > -1){
        var value = true;
        item.marker.setVisible(true);
        return value;
      }else{
        item.marker.setVisible(false);
      }
    });
    return newArray;
  }, ViewModel);
};

function initMap(){
  // gets google map
  var mapDiv = document.getElementById("map");
  map = new google.maps.Map(mapDiv, {
    center: {lat : 36.204824 ,lng : 138.252924},
    zoom: 6
  });
  nyTimesApi();

  this.makeMapMarker = function(places) {
    // place maps marker on the map
    marker = [];
    marker = new google.maps.Marker({
      position: places.coords,
      map:map,
      animation: null,
      title: places.names
    });

    marker.setMap(map);
    return marker;
  };
  this.makeInfoWindow = function(place){
    var marker = place.marker;
    var infoWindow;
    google.maps.event.addListener(marker, "click", (function info(marker){
    // put infowindow and on/off for marker bounce
      var contentString = "<div>"+ marker.title + "</div>" +
                        "<div>" + place.address + "</div>";
      infoWindow = new google.maps.InfoWindow({
        content : contentString,
        closeBoxUrl: ""
      });
      infoWindow.content = contentString;
      return function(){
            place.get_details();
      };
    })(marker));
    return infoWindow;
  };
}

var markerAnimation = function(place){
  var marker = place.marker;
  if(marker.getAnimation() !== null){
    place.infowindow.close();
    marker.setAnimation(null);
  }else{
    if(lastMarker !== null){
      lastMarker.infowindow.close();
      lastMarker.marker.setAnimation(null);
    }
    place.infowindow.open(map, marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    changeMapCenter(place);
    lastMarker = place;
  }
};

var changeMapCenter = function(place){
  // zooms and centers map
  map.setCenter({lat: place.coords.lat, lng: place.coords.lng});
  map.setZoom(10);
};

// apis
// nytimes api
function nyTimesApi(){
  var nyTimesTimeout = setTimeout(function(){
    alert("Ny Times api failed to load.");
  }, 8000);
  var nyTimesURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  nyTimesURL += "?" + $.param({"api-key": "b30fd01ee378467091f2076b2edc1c07",
                             "q": "Japan"});
  $.getJSON(nyTimesURL, function(nyData){
     // display(response)
      var i = 0;
      var nyLinks = [];
      nyLinks.push("<h4>Api used: Ny Times");
      while(i < nyData.response.docs.length){
        content = nyData.response.docs[i];
        nyLinks.push("<li class=''><a href='"+ content.web_url+
        "'target='_blank'>"+ content.headline.main+"</a><p>"+
        content.snippet+"</p></li>");
        i += 1;
        clearTimeout(nyTimesTimeout);
      viewModel.apiDetails(nyLinks);
      }
  })
}

//wikipedia

function wikiApi(place){
  var wikiRequestTimeout = setTimeout(function() {
    alert("Wiki api did not load.");
  }, 8000);

  var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
  place +"&format=json&callback=wikiCallback";
  $.ajax({
    url: wikiURL,
    dataType: "jsonp",
    success: function(response){
      var url = "<a href='"+ response[3][0]+"'>"+response[1]+"</a>";
      var api = "<h4>Api used: Wikipedia</h4>";
      var description = "<p>"+response[2]+"</p>";
      var data = api+url+description;
      clearTimeout(wikiRequestTimeout);
      viewModel.apiDetails(data);
    }
  });
}

//random generator used for Yelp api
function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}
//Yelp
function yelpApi(place) {

  var yelpHTML = "";

  var parameters = {
    term: place,
    location: "japan",
    oauth_consumer_key : yelp_consumer_key,
    oauth_token : yelp_token,
    oauth_signature_method : "HMAC-SHA1",
    oauth_timestamp : Math.floor(Date.now()/1000),
    oauth_nonce : nonce_generate(),
    oauth_version: "1.0",
    callback: "cb"
  };
  var EncodeSignature = oauthSignature.generate("GET", yelpURL, parameters, yelp_consumer_secret, yelp_token_secret);
  parameters.oauth_signature = EncodeSignature;
  var setting = {
    url: yelpURL,
    data:parameters,
    cache: true,
    dataType: "jsonp",
    jsonCallback: "cb",
    success: function(response){
      var apiUsed = "<h4>Api used: Yelp!</h4>";
      yelpHTML = apiUsed+"<img src='"+response.businesses[0].image_url+"'><h1>"+
      response.businesses[0].name+"</h1><img src='"+
      response.businesses[0].rating_img_url+"'><p>Address: "+
      response.businesses[0].location.display_address[0]+" "+response.businesses[0].location.display_address[1]+
      "</p><p>"+response.businesses[0].location.display_address[2]+" "+response.businesses[0].location.display_address[3]+
      " "+response.businesses[0].location.display_address[4]+"</p><p>phone number: "+response.businesses[0].phone+
      "</p>Url: <a href='"+response.businesses[0].url+"' target='_blank'>yelp page</a><h3>*"+response.businesses[0].snippet_text+"</h3>";
      viewModel.apiDetails(yelpHTML);
    },
    error: function(error){
      alert(error);
    }
  };
  $.ajax(setting);
}
var start = function() {
  var Map = new initMap();
  viewModel = new ViewModel(Map);
  ko.applyBindings(viewModel);
};