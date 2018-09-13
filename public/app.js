(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var doorsOpen = {};

doorsOpen.getData = function (selection) {

	$.ajax({
		url: 'https://cors-anywhere.herokuapp.com/http://wx.toronto.ca/inter/culture/doorsopen.nsf/DoorsOpenBuildingJSON.xsp',
		method: 'GET',
		dataType: 'json'
	}).then(function (rawdata) {
		labelIndex = 0;
		doorsOpen.displayLocation(rawdata);
	});
};
//on change, send data to .displayLocation where dot_Architecture.dot_type === selected
//map the array of whats been selected
//use when load variable amount of selections
//working with asynchronys events pokemon video

doorsOpen.startingPos = function () {
	$('#map').hide();
	$('.body__container').hide();
};

doorsOpen.displayLocation = function (rawdata) {
	clearOverlays();

	var locations = rawdata.filter(function (item) {

		var matchedItems = item.dot_Architecture.dot_type;
		matchedItems = matchedItems.filter(function (choice) {
			return choice === doorsOpen.usersChoice;
		});
		return matchedItems.length > 0;
	});

	locations.forEach(function (location, index) {

		var buildingName = location.dot_buildingName;
		var address = location.dot_Address.dot_buildingAddress;

		var description = location.dot_FullDescription;
		var vexp = location.dot_VisitorExperience;
		var progdes = location.dot_ProgramGuideDescription;

		var architect = location.dot_Architecture.dot_originalArchitect;
		var buildDate = location.dot_Architecture.dot_buildingConstructionRange;

		var satStart = location.dot_Days.dot_SaturdayStart;
		var satEnd = location.dot_Days.dot_SaturdayLastAdmit;
		var sunStart = location.dot_Days.dot_SundayStart;
		var sunEnd = location.dot_Days.dot_SundayLastAdmit;

		var lat = location.dot_Address.dot_Latitude;
		var lon = location.dot_Address.dot_Longitude;

		var image = location.dot_Links.dot_image;
		var website = location.dot_Links.dot_url;
		var instagram = location.dot_Links.dot_instagram;
		var facebook = location.dot_Links.dot_faceBook;
		var flickr = location.dot_Links.dot_flickr;
		var youtube = location.dot_Links.dot_youTube;
		var twitter = location.dot_Links.dot_twitter;

		if (lat !== '' && lon !== '') {

			markerTime(buildingName, address, description, vexp, progdes, architect, buildDate, satStart, satEnd, sunStart, sunEnd, lat, lon, website, image, instagram, facebook, flickr, youtube, twitter);
		}

		// Don't double display address and building name
	});
};

doorsOpen.events = function () {

	$('select').on('change', function () {
		var usersChoice = $('select option:selected').text();
		doorsOpen.getData(usersChoice);
		doorsOpen.usersChoice = usersChoice;
		$('#map').show();
		initMap();
	});

	$("#locationType").click(function () {
		$('html, body').animate({
			scrollTop: $("#map").offset().top
		}, 1200);
	});

	$("#mapbutton").click(function () {
		$('html, body').animate({
			scrollTop: $("#map").offset().top
		}, 1200);
	});
};

// ------------------------------ MARKER AND MAP GENERATOR

function initMap() {
	var toronto = { lat: 43.6532, lng: -79.3832 };
	var maxzoom = 12;

	map = new google.maps.Map(document.getElementById('map'), {
		zoom: maxzoom,
		center: toronto
	});

	map.setOptions({
		draggable: true,
		zoomControl: true,
		scrollwheel: false,
		disableDoubleClickZoom: true
	});

	//map bounds

	var allowedBounds = new google.maps.LatLngBounds(new google.maps.LatLng(43.599493, -79.680691), new google.maps.LatLng(43.925505, -79.132870));
	var lastValidCenter = map.getCenter();

	google.maps.event.addListener(map, 'center_changed', function () {
		if (allowedBounds.contains(map.getCenter())) {
			// still within valid bounds, so save the last valid position
			lastValidCenter = map.getCenter();
			return;
		}
		// not valid anymore => return to last valid position
		map.panTo(lastValidCenter);
	});

	//zoom fix
	google.maps.event.addListener(map, 'zoom_changed', function () {
		if (map.getZoom() < maxzoom) map.setZoom(maxzoom);
	});
	var infoWindow = new google.maps.InfoWindow({ map: map });

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			map.setCenter(pos);
		}, function () {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

var markersArray = [];

function clearOverlays() {
	for (var i = 0; i < markersArray.length; i++) {
		markersArray[i].setMap(null);
	}
	markersArray.length = 0;
}

/////////////////////////////


var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

function markerTime(buildingName, address, description, vexp, progdes, architect, buildDate, satStart, satEnd, sunStart, sunEnd, lat, lon, website, image, instagram, facebook, flickr, youtube, twitter) {
	var _ref;

	var marker = new google.maps.Marker((_ref = {
		label: labels[labelIndex++ % labels.length],
		position: { lat: +lat, lng: +lon },
		map: map,
		data_buildingName: buildingName,
		data_address: address,
		data_description: description
	}, _defineProperty(_ref, 'data_buildingName', buildingName), _defineProperty(_ref, 'data_address', address), _defineProperty(_ref, 'data_description', description), _defineProperty(_ref, 'data_vexp', vexp), _defineProperty(_ref, 'data_progdes', progdes), _defineProperty(_ref, 'data_architect', architect), _defineProperty(_ref, 'data_buildDate', buildDate), _defineProperty(_ref, 'data_satStart', satStart), _defineProperty(_ref, 'data_satEnd', satEnd), _defineProperty(_ref, 'data_sunStart', sunStart), _defineProperty(_ref, 'data_sunEnd', sunEnd), _defineProperty(_ref, 'data_lat', lat), _defineProperty(_ref, 'data_lon', lon), _defineProperty(_ref, 'data_website', website), _defineProperty(_ref, 'data_image', image), _defineProperty(_ref, 'data_instagram', instagram), _defineProperty(_ref, 'data_facebook', facebook), _defineProperty(_ref, 'data_flickr', flickr), _defineProperty(_ref, 'data_youtube', youtube), _defineProperty(_ref, 'data_twitter', twitter), _ref));

	marker.addListener('click', function () {
		$('#card').show();
		$('html, body').animate({
			scrollTop: $("#card").offset().top
		}, 1200);

		$('#contentPlacement').empty();
		var label = this.label;
		var buildingName = this.data_buildingName;
		var address = this.data_address;
		var description = this.data_description;
		var vexp = this.data_vexp;
		var progdes = this.data_progdes;
		var architect = this.data_architect;
		var buildDate = this.data_buildDate;
		var satStart = this.data_satStart;
		var satEnd = this.data_satEnd;
		var sunStart = this.data_sunStart;
		var sunEnd = this.data_sunEnd;
		var lat = this.data_lat;
		var lon = this.data_lon;
		var image = this.data_image;
		var website = this.data_website;
		var instagram = this.data_instagram;
		var facebook = this.data_facebook;
		var flickr = this.data_flickr;
		var youtube = this.data_youtube;
		var twitter = this.data_twitter;

		$('.buildingName').html(label + " - " + buildingName);
		$('.address').html(address);
		$('.architect').html(architect);
		$('.buildDate').html(buildDate);

		if (satStart !== "") {
			$('.saturdayHours').html("Saturday: " + satStart + " - " + satEnd + " ");
		} else {
			$('.saturdayHours').html("Saturday: Closed");
		}

		if (image !== '') {
			$('#image').attr('src', 'http://www.toronto.ca/ext/edc/doors_open/buildings/' + image);
		}

		if (sunStart !== "") {
			$('.sundayHours').html("Sunday: " + sunStart + " - " + sunEnd);
		} else {
			$('.sundayHours').html("Sunday: Closed");
		}

		if (website !== "") {
			$('.website').show();
			$('.website').html('<a href=\'' + website + '\'> <i class="fa fa-mouse-pointer"></i><p class="icontext"> Website </p></a>');
		} else {
			$('.website').hide();
		};
		if (instagram !== "") {
			$('.instagram').show();
			$('.instagram').html('<a href=\'' + instagram + '\'><i class="fa fa-instagram"></i><p class="icontext"> Instagram </p></a>');
		} else {
			$('.instagram').hide();
		};
		if (facebook !== "") {
			$('.facebook').show();
			$('.facebook').html('<a href=\'' + facebook + '\'><i class="fa fa-facebook"></i><p class="icontext"> Facebook</p></a>');
		} else {
			$('.facebook').hide();
		};
		if (flickr !== "") {
			$('.flickr').show();
			$('.flickr').html('<a href=\'' + flickr + '\'><i class="fa fa-flickr"></i><p class="icontext"> Flicker</p></a>');
		} else {
			$('.flickr').hide();
		};
		if (youtube !== "") {
			$('.youtube').show();
			$('.youtube').html('<a href=\'' + youtube + '\'><i class="fa fa-youtube-play"></i><p class="icontext">YouTube</p></a>');
		} else {
			$('.youtube').hide();
		};

		if (twitter !== "") {
			$('.twitter').show();
			$('.twitter').html('<a href=\'' + twitter + '\'><i class="fa fa-twitter"></i><p class="icontext"> Twitter </p></a>');
		} else {
			$('.twitter').hide();
		};

		$('.fullDescription').html(description);
		$('.programGuide').html('"' + progdes + '"');
		$('.visitorExperience').html('"' + vexp + '"');
	});
	markersArray.push(marker);
}

doorsOpen.init = function () {
	doorsOpen.getData();
	doorsOpen.startingPos();
	doorsOpen.events();
};

$(function () {
	doorsOpen.init();
});

//make it default to show all, or make users choice display before and default to architecture
//turn select into buttons
//explore having precreated div
//

},{}]},{},[1]);
