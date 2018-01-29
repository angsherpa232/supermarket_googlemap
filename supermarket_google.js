//Global Variables
var Google_key = "AIzaSyDBRx0crV33B-rLPoQr7SkYl4_ZrUOZzig";
var OWP_key    = "8c8a482f0c519bcc56bf79715ea71154";
var place_key = "AIzaSyBjN60X3EA4xEVSVX0IZbk0v9LTifb4d24";
var marker_key = "AIzaSyDwYzV2yuVk92w2fHyYNZPTHhEQ9Gflc_8";
var markets;
var marker;


// Refresh Button
$(document).on("click", "#refresh", function() {
    //Prevent default behaviour
    event.preventDefault();

    //1. Get Current Location
    $.post("https://www.googleapis.com/geolocation/v1/geolocate?key="+Google_key,
        function (response) {
            lat = response.location.lat;
            console.log(typeof(lat));
            lng = response.location.lng;
            call_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+lat+","+lng+
            "&radius=1000&types=supermarket&key="+place_key;
            $.getJSON(call_url,
                function (data) {
                    //Process Response from OpenWeatherMaps API Call
                    markets = data.results;
                    console.log(data);
                    //Remove previous stations
                    $('#market_list li').remove();
                    //Add new markets to the list
                    $.each(markets, function(index,market) {
                        $('#market_list').append(
                            '<li><a id="to_details" href="#">'+market.name+
                            '<span id="'+index+'" class="ui-li-count">'+Math.round(market.rating)+'</span>'+
                            '</a></li>');
                    });
                    //Refresh list content
                    $('#market_list').listview('refresh');
            });
    })
});

$(document).on('pagebeforeshow','#home', function () {
   $(document).on('click','#to_details',function (e) {
       e.preventDefault();
       e.stopImmediatePropagation();
       //Store the market Description
       currentMarket = markets[e.target.children[0].id];
       console.log(currentMarket);
       //Change to Details Page
       $.mobile.changePage("#details");
   })
});

//Update Details Page
$(document).on('pagebeforeshow', '#details', function(e) {
  e.preventDefault();
  //$('#marketName').text(currentMarket.name);
  $('#marketIcon').attr('src', currentMarket.icon)
  $('#marketName').text(currentMarket.name);
  $('#marketVicinity').text('Vicinity: ' + currentMarket.vicinity);
  if ("opening_hours" in currentMarket){
  $('#marketOpen').text('Open now: ' + currentMarket.opening_hours.open_now);
  } else {
  $('#marketOpen').text('Open now: ' + 'Not Available');
  }
  $('#marketIco').text('Types: ' + currentMarket.types[0]);
});

//Provides the available detail of chosen supermarket
   $(document).on('click','#to_details',function (e) {
       e.preventDefault();
       e.stopImmediatePropagation();
       //Store the current market Description
       currentMarket = markets[e.target.children[0].id];
       //Change to Details Page
       $.mobile.changePage("#details");
   })

//Calls the google map with AJAX
$(document).on('pagebeforeshow','#mapPage', function () {
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/js?key="+marker_key,
    dataType: "script",
    success: initMap
  });
});

//Loads the map with marker
function initMap() {
  var map_holder = {lat: currentMarket.geometry.location.lat, lng:currentMarket.geometry.location.lng};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: map_holder
  });
  marker = new google.maps.Marker({
    map: map,
    animation: google.maps.Animation.BOUNCE,
    position: map_holder,
    label: currentMarket.name,
    draggable: true
  });
}

$(document).on('click', '#market_map', function(f) {
  f.preventDefault();
  f.stopImmediatePropagation();
  $.mobile.changePage("#mapPage");
});

//Swap with empty object for another map call
$(document).on("click", "#backButton", function() {
  window.google= {};
  //google.maps = {};
});
