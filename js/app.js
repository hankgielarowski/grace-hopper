$(document).ready(function() {
  bandade.init();
});
var bandadeArray = "";
var bandade = {
  mainURL:'http://api.bandsintown.com/events/search?location=',
  eventLocationStore: [],
  init: function () {
    bandade.initStyling();
    bandade.initEvents();
    // initMap();
  },
  initStyling: function () {
  },
  initEvents: function () {
    $('#bandadeform').on('submit', bandade.locationSearch);
    $('#artist').on('submit', bandade.filterArtist);
    $('#venue').on('submit', bandade.filterVenue);
    $('#radius').on('submit', bandade.filterRadius);
    $('#back-button').on('click', bandade.backButton);
  },

  locationSearch: function () {
    event.preventDefault();
    $('.search-result').removeClass('inactive');
    bandade.getLocationData(bandade.createLocationURL());
    $('.search-results-info').text("All shows for: " + '"' + $("#bandade-search-input").val() + '"');
    $('#back-button').hide();
  },

  createLocationURL: function () {
    var searchTerm = $("#bandade-search-input").val();
    var locationURL = bandade.mainURL + searchTerm.replace(" ","+") + '&per_page=100&format=json&app_id=bandade';
    return locationURL;
  },

  addToDom: function (item) {
    $('.main').html('');
    _.each(item, function (el){
      var tmpl = _.template(templates.searchResultsTemplate);
      $('.main').append(tmpl(el));
    });
  },

  filterArtist: function () {
     event.preventDefault();
     var artistArray = bandadeArray.filter(function (el) {
     return $("#artist-input").val() === el.artists[0].name;
   });
     bandade.addToDom (artistArray);
     $('.search-results-info').show();
     $('#back-button').show();
     $('.search-results-info').text("Search Results for: " + '"' + $("#artist-input").val()+ '"' + " in " + $("#bandade-search-input").val());
     $('#artist-input').val('');
  },

  filterVenue: function (){
      event.preventDefault();
      var venueArray = bandadeArray.filter(function (el) {
      return $("#venue-input").val() === el.venue.name;
    });
      bandade.addToDom (venueArray);
      $('.search-results-info').show();
      $('#back-button').show();
      $('.search-results-info').text("Search Results for: " + '"' + $("#venue-input").val()+ '"' + " in " + $("#bandade-search-input").val());
      $('#venue-input').val('');
  },

  filterRadius: function (){
    event.preventDefault();
    var radiusSearch = $('#radius-input').val();
    var finalLocation = bandade.createLocationURL();
    var radiusURL = finalLocation + "&radius=" + radiusSearch.replace(" miles","");
    bandade.getVenueData(radiusURL);
    $('.search-results-info').show();
    $('#back-button').show();
    $('.search-results-info').text("Radius Search Results: " + '"' + $("#radius-input").val()+ '"');
    $('#radius-input').val('');

  },

  backButton: function () {
    event.preventDefault();
    $('.search-results-info').hide();
    bandade.locationSearch();
  },


  getLocationData: function (url) {
    $.ajax({
      url: url,
      method: 'GET',
      dataType: 'jsonp',
      success: function (location) {
        var coords = location.map(function(el) {
         return { lat: el.venue.latitude, lng: el.venue.longitude, title: el.venue.name };
       });
       bandade.eventLocationStore = [];
       bandade.eventLocationStore.push(coords);
       bandade.eventLocationStore[0].slice(0,10).forEach(function(coord,idx) {

         var marker = new google.maps.Marker({
           position: coord,
           map: map,
           title: coord.title
         });
       }),
       map.setOptions({center:bandade.eventLocationStore[0][0]})
       // reset map.setOptions with a center,
        window.glob = location;
        bandadeArray = location; //creating array of all data
        bandade.addToDom(location, $('.main'));
      }
    });
  },

  getVenueData: function (url) {
   $.ajax({
     url: url,
     method: 'GET',
     dataType: 'jsonp',
     success: function (radius) {
       bandade.addToDom(radius, $('.main'));
     }
   });
 },

}; //end of bandade obj


// apiUrl = "http://api.bandsintown.com/events/search?location=Charleston,SC&radius=20&format=json&app_id=bandade";
