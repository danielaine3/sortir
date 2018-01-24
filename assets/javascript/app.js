var eventLat=[];
var eventLng=[];
var dateSelector=[];
var moreInfo=[];
var eventName=[];
var coords=[];
var map;
var latLng;
var marker;
var myLat;
var myLng;
var infoWindow;
var pickedEvent=[];
var pickedLat;
var pickedLng;

function clickMyEvent(){

  $(".myEvent").on("click", function() {
      pickedLat = ($(this).attr("data-LatValue"));
      pickedLng = ($(this).attr("data-LngValue"));
      alert("My event latitude: " + pickedLat + "My event longitude: " + pickedLng);
  });
}

//================== Lodash Error Handling ==================================
//function parseLodash(str){
//return _.attempt(JSON.parse.bind(null, str));
//}
//================== on-click AJAX Call ==================================
$("#find-event").on("click", function(event) {
  // prevent event default behavior
  event.preventDefault();
  //wait x seconds until the data from Ajax loads and then show the map
  setTimeout(initMap, 4000);
//=============== Search Form Inputs  ============================
var location = $("#location-input").val().trim();
console.log(location);
var date = $("#event-date").val();
// console.log(date)
var category = $("#event-category").val();
// console.log(category)

//============ Search Form Jquery Menus  =========================
$(document).ready(function() {
  $('select').material_select();
});
// //Empty form before next search
// $(".input-field").clear();
//Empty table before populating with new event information
$("#event-table").empty();
// ================  queryURL using $ajax ======================
var queryURL = "https://cors-anywhere.herokuapp.com/api.eventful.com/json/events/search?app_key=54CPdHQQ4wTp4fM7&location=" + location+ "&date="+ date + "&category" + category + "&limit=10";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function(response) {
    for (var i=0; i<10; i++){
      console.log(JSON.parse(response));
      //Find Longitude and Latitude of the event
      eventLat[i] = JSON.parse(response).events.event[i].latitude;
      // console.log("Lat of event " + [i+1] + " = " + eventLat[i]);
      eventLat.push(eventLat[i]);
      eventLng[i] = JSON.parse(response).events.event[i].longitude;
      // console.log("Lng of event " + [i+1] + " = " + eventLng[i]);
      eventLng.push(eventLng[i]);
      //================ Table Population ===============================
      //Print date
      dateSelector[i] = JSON.parse(response).events.event[i].start_time;
      //$("#eventDate").text("Event date information for the table:  " + dateSelector[i]);
      //Print URL of the event -CHANGE TO LINK?
      moreInfo[i]= JSON.parse(response).events.event[i].venue_url;
      //$("#moreInfo").text("Event URL information for the table:  " + moreInfo[i]);
      //Event Name
      eventName[i]= JSON.parse(response).events.event[i].title;
      //$("#eventName").text("Event name information for the table:  " + eventName[i]);   

      var row = $("<tr class='event-row'>")
        .append($("<td>" + [i+1] + "</td>"))
        .append ($("<td>" + dateSelector[i] + "</td>"))
        .append($("<td>" + eventName[i] + "</td>"))
        .append($("<td>" + moreInfo[i] + "</td>"))
        // .append($("<td>" + [i+1] + "</td>"));
        pickedEvent[i]=$("<button>").addClass("myEvent");
        pickedEvent[i].attr("data-LatValue", eventLat[i]);
        pickedEvent[i].attr("data-LngValue", eventLng[i]);
        pickedEvent[i].text("Go to #" + (i+1) + " event");
      row.append($("<td>").append(pickedEvent[i]));
      $("#event-table").append(row);
    }; 
    
    clickMyEvent();
  });
  //print arrays of Lattitude and Longitude
  // console.log("Latitude array = " + eventLat);
  // console.log("Longitude array = " + eventLng);
});

//================== Display events on GoogleMap =============================
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: new google.maps.LatLng(eventLat[0], eventLng[0]),
    //mapTypeId: 'terrain'
  });
  for (var i=0; i<5; i++){
  latLng = new google.maps.LatLng(eventLat[i], eventLng[i]);
  marker = new google.maps.Marker({
      position: latLng,
      map: map
  });
};
//================== Display current location on GoogleMap ====================
  infoWindow = new google.maps.InfoWindow;
  // HTML5 geolocation.
  if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    myLat = position.coords.latitude;
    myLng = position.coords.longitude;
    $("#myLat").html("My location latitude: " + myLat);
    $("#myLng").html("My location longitude: " + myLng);
    //======this shows My location on the map
    infoWindow.setPosition(pos);
    infoWindow.setContent('Location found.');
    infoWindow.open(map);
    map.setCenter(pos);
  }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
  });
  } else {
  // when Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
  };  
};
//Checking if information from the maps is available after x seconds 
function getMapCoor() {
  console.log("My event lattitude = " + pickedLat);
  console.log("My event longitude = " + pickedLng);
  console.log("My latitude = " + myLat);
  console.log("My longitude = " + myLng);
  };
setTimeout(getMapCoor, 20000);

//===================  Lyft API and AJAX request ========================
function displayLyft(){
  var OPTIONS = {
    scriptSrc: 'assets/lyft/dist/lyftWebButton.min.js',
    namespace: '',
    clientId: 'ttOsHDUkxRyS',
    clientToken: 'mTjSJFlEwRRmoMVo/loVl70RVsu/m2fkSlb6aeFp94q9ovNq9FRkTttsluEbv6Fv35Q2pSH41W/MjK8GG8iutze2x5MMB8+YPHXHr9Yief/gzJQN8kdXcHA=',
    location: {
      pickup: {
        latitude: myLat,
        longitude: myLng,
      }, 
      destination: {
        latitude: pickedLat,
        longitude: pickedLng,
      },
    },
    parentElement: document.getElementById('lyft-web-button-parent'),
    queryParams: {
      credits: ''
    },
    theme: 'multicolor large',
  };
  (function(t) {
    var n = this.window,
    e = this.document;
    n.lyftInstanceIndex = n.lyftInstanceIndex || 0;
    var a = t.parentElement,
    c = e.createElement("script");
    c.async = !0, c.onload = function() {
    n.lyftInstanceIndex++;
    var e = t.namespace ? "lyftWebButton" + t.namespace + n.lyftInstanceIndex : "lyftWebButton" + n.lyftInstanceIndex;
    n[e] = n.lyftWebButton, t.objectName = e, n[e].initialize(t)
  }, c.src = t.scriptSrc, a.insertBefore(c, a.childNodes[0])
  }).call(this, OPTIONS);
};
//Display fare estimate to page
//=======================
 setTimeout(displayLyft, 22000);

 //Display fare estimate in button once user selects an event from table
 //======================
// $(".myEvent").on("click", function(){
//   $("#lyft-web-button-parent").empty();
//   console.log("Div Emptied");
//   displayLyft();
// });

