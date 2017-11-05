var locations = [{
        title: 'LA RUSTICA Pizzeria',
        location: {
            lat: 24.694656,
            lng: 46.683604
        }
    },
    {
        title: 'Zaatar w Zeit',
        location: {
            lat: 24.6934838,
            lng: 46.6056600
        }
    },
    {
        title: 'Pizza Roma',
        location: {
            lat: 24.700914,
            lng: 46.692158
        }
    }, {
        title: 'Wooden Bakery',
        location: {
            lat: 24.694174,
            lng: 46.722907
        }
    }, {
        title: 'Houmous House',
        location: {
            lat: 24.759505,
            lng: 46.658604
        }
    },
    {
        title: 'Shrimplus',
        location: {
            lat: 24.818189,
            lng: 46.642306
        }
    }
];
var map;
var markers = [];
var Riyadh = {
    lat: 24.774265,
    lng: 46.738586
};
console.log(markers);

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: Riyadh
    });
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_CENTER].push(centerControlDiv);

    var infowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            animation: google.maps.Animation.DROP,
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        //        marker.addListener('click', function() {
        //            GetData(this, infowindow);    
        //         });
        google.maps.event.addListener(marker, 'click', handler(marker));
    }
    console.log(markers);

    function handler(marker) {
        //    if (marker.getAnimation() !== null) {
        //    marker.setAnimation(null);
        //  } else {
        //    marker.setAnimation(google.maps.Animation.BOUNCE);
        return function() {
            GetData(this, infowindow);
        };
    }

}

function clearAnimation() {
    for (var i = 0; i < markers.length; i++) {
        //          markers[i].setMap(null);
        markers[i].setAnimation(null);
        markers[i].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');

    }
}

function handleError() {
    alert('Google Maps error triggered');
}


function AppViewModel(locations, marker, infowindow) {
    console.log(markers);
    self = this;
    self.search = ko.observable("");
    self.locations = ko.observableArray(locations);
    self.title = ko.observableArray(locations.title);
    self.places = ko.observableArray(markers.title);
    self.ListClick = ko.observable();
    console.log(self.locations);
    // I wanted to use the stringStartsWith but it was removed from Knockout so i used this insted.
    var stringStartsWith = function(string, startsWith) {
        string = string || "";
        if (startsWith.length > string.length)
            return false;
        return string.substring(0, startsWith.length) === startsWith;
    };
    this.locations = ko.computed(function(marker) {
        var filter = self.search().toLowerCase();
        if (filter === "") {
            return locations;
        } else {
            return ko.utils.arrayFilter(self.locations(), function(location) {
                var match = stringStartsWith(location.title.toLowerCase(), filter);
                return match;
                marker.setVisible(false);
            });
        }

    }, this);

    self.ListClick = function(place) {
        google.maps.event.trigger(place.marker, "click");
        console.log(self.places.locations);
    };
}

// Activates knockout.js
ko.applyBindings(new AppViewModel(locations));

function GetData(marker, infowindow, map) {
    var CLIENT_ID = '0CE0FWIJIFF0RJZ0SW5Q33XW0ATVVHT3IM4EPBVLKSVXUGEQ',
        CLIENT_SECRET = 'IC2F2VZNDNSOLSRNUFPWGGBKYF2WWPZU20VLHZ2J4OFZ4W0Q',
        version = '20171710',
        ll = marker.position.lat() + ',' + marker.position.lng(),
        query = marker.title,
        phone = "",
        Name = "",
        address = "",
        url = "https://api.foursquare.com/v2/venues";

    $.ajax({
        url: url + '/search',
        dataType: 'json',
        data: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            ll: ll,
            v: version,
            query: query,
            async: true
        }
    }).done(function(data) {
        data.response.venues[0].contact.phone ? phone = data.response.venues[0].contact.phone : phone = 'No Phone available';
        data.response.venues[0].name ? Name = data.response.venues[0].name : Name = 'No Name available';
        data.response.venues[0].location.address ? address = data.response.venues[0].location.address : address = 'No address available';
        //        phone = (data.response.venues[0].contact.phone);
        //        Name = (data.response.venues[0].name);
        //        address = (data.response.venues[0].location.address);
        infowindow.setContent('<div>' + Name + '</div>' + '<div>' + phone + '</div>' + address + '</div>');
        infowindow.open(map, marker);
        clearAnimation();
        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        marker.setAnimation(google.maps.Animation.BOUNCE);


    }).fail(function(error) {
        alert("Failed to connect");
    });
    infowindow.open(map, marker);

}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("map").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
}

function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to Open the Menu';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Open Menu';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("map").style.marginLeft = "0px";
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    });

}