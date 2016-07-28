
function convertToCoords(address){
	url = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyBTHibygVGMEj52ZJ2O2THkcn93bFc7YHM";

    $.getJSON(url, function(data) {
        console.log(data);
        //console.log(data)['results'][0]['geometry']['location'];
        var latt = data['results'][0]['geometry']['location']['lat'];
        var longi = data['results'][0]['geometry']['location']['lng'];
        initMap(latt, longi);
    });
}

function initMap(latt = 44.540, longi = -78.546){
      var mapDiv = document.getElementById('map')
      var map = new google.maps.Map(mapDiv, {
      center: {lat: latt, lng: longi},
      zoom: 8 
      });
}

// initMap()
 convertToCoords();