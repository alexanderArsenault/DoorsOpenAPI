var doorsOpen = {};

doorsOpen.getData = function (selection) {

	$.ajax({
		url: 'https://cors-anywhere.herokuapp.com/http://wx.toronto.ca/inter/culture/doorsopen.nsf/DoorsOpenBuildingJSON.xsp',
		method:'GET',
		dataType: 'json'
	})
	.then(function(rawdata){
		labelIndex = 0;
		doorsOpen.displayLocation(rawdata);
});

}
//on change, send data to .displayLocation where dot_Architecture.dot_type === selected
//map the array of whats been selected
//use when load variable amount of selections
//working with asynchronys events pokemon video

doorsOpen.startingPos = () => {
	$('#map').hide();
	$('.body__container').hide();
}

doorsOpen.displayLocation = function(rawdata) {
		clearOverlays();

	var locations = rawdata.filter(function(item){

		var matchedItems = item.dot_Architecture.dot_type;
			matchedItems = matchedItems.filter(function(choice){
				return choice === doorsOpen.usersChoice;
			})
			return matchedItems.length > 0;
		})

	locations.forEach(function(location, index){

			let buildingName = location.dot_buildingName;
			let address = location.dot_Address.dot_buildingAddress;

			let description = location.dot_FullDescription;
			let vexp = location.dot_VisitorExperience;
			let progdes = location.dot_ProgramGuideDescription;

			let architect = location.dot_Architecture.dot_originalArchitect;
			let buildDate = location.dot_Architecture.dot_buildingConstructionRange;

			let satStart = location.dot_Days.dot_SaturdayStart;
			let satEnd = location.dot_Days.dot_SaturdayLastAdmit;
			let sunStart = location.dot_Days.dot_SundayStart;
			let sunEnd = location.dot_Days.dot_SundayLastAdmit;

			let lat = location.dot_Address.dot_Latitude;
			let lon = location.dot_Address.dot_Longitude;

			let image = location.dot_Links.dot_image;
			let website = location.dot_Links.dot_url;
			let instagram = location.dot_Links.dot_instagram;
			let facebook = location.dot_Links.dot_faceBook;
			let flickr = location.dot_Links.dot_flickr;
			let youtube = location.dot_Links.dot_youTube;
			let twitter = location.dot_Links.dot_twitter;


			if (lat !== '' && lon !== ''){
			markerTime(
				buildingName,
				address,
				description,
				vexp,
				progdes,
				architect,
				buildDate,
				satStart,
				satEnd,
				sunStart,
				sunEnd,
				lat,
				lon,
				website,
				image,
				instagram,
				facebook,
				flickr,
				youtube,
				twitter);
			}



			// Don't double display address and building name
	})
}

doorsOpen.events = function(){
	
	$('select').on('change', function(){
		var usersChoice = $('select option:selected').text();
		doorsOpen.getData(usersChoice);
		doorsOpen.usersChoice = usersChoice;
		$('#map').show();
		initMap();

	});

	$("#locationType").click(function() {
    $('html, body').animate({
        scrollTop: $("#map").offset().top
    }, 1200);
	});

	$("#mapbutton").click(function() {
    $('html, body').animate({
        scrollTop: $("#map").offset().top
    }, 1200);
	});

};


// ------------------------------ MARKER AND MAP GENERATOR

function initMap() {
	var toronto = {lat: 43.6532, lng: -79.3832};
	let maxzoom = 12;

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

	var allowedBounds = new google.maps.LatLngBounds(
     new google.maps.LatLng(43.599493, -79.680691), 
     new google.maps.LatLng(43.925505, -79.132870)
	);
	var lastValidCenter = map.getCenter();

	google.maps.event.addListener(map, 'center_changed', function() {
	    if (allowedBounds.contains(map.getCenter())) {
	        // still within valid bounds, so save the last valid position
	        lastValidCenter = map.getCenter();
	        return; 
	    }
    // not valid anymore => return to last valid position
    	map.panTo(lastValidCenter);
	});

	//zoom fix
	google.maps.event.addListener(map, 'zoom_changed', function() {
		if (map.getZoom() < maxzoom) map.setZoom(maxzoom);
   });
	let infoWindow = new google.maps.InfoWindow({map: map});
	
	if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		infoWindow.setPosition(pos);
		infoWindow.setContent('Location found.');
		map.setCenter(pos);
	}, function() {
		handleLocationError(true, infoWindow, map.getCenter());
	});
	} else {
	// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}



var markersArray = [];

function clearOverlays() {
	for (var i = 0; i < markersArray.length; i++ ) {
		markersArray[i].setMap(null);
	}
	markersArray.length = 0;
}


/////////////////////////////




var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

function markerTime(buildingName,image,address,description,vexp,progdes,architect,buildDate,satStart,satEnd,sunStart,sunEnd,lat,lon,website,instagram,facebook,flickr,youtube,twitter) {
	var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

	var marker = new google.maps.Marker({
    	icon: iconBase + 'parking_lot_maps.png',
		label: labels[labelIndex++ % labels.length],
		position: {lat: +lat, lng: +lon},
		map: map,
		data_buildingName: buildingName,
		data_address: address,
		data_description: description,
		data_buildingName: buildingName,
		data_address: address,
		data_description: description,
		data_vexp: vexp,
		data_progdes: progdes,
		data_architect: architect,
		data_buildDate: buildDate,
		data_satStart: satStart,
		data_satEnd: satEnd,
		data_sunStart: sunStart,
		data_sunEnd: sunEnd,
		data_lat: lat,
		data_lon: lon,
		data_website: website,
		data_image: image,
		data_instagram: instagram,
		data_facebook: facebook,
		data_flickr: flickr,
		data_youtube: youtube,
		data_twitter:twitter,
	})


	marker.addListener('click', function() {
		$('#card').show();
		$('html, body').animate({
			scrollTop: $("#card").offset().top
		}, 1200);

		$('#contentPlacement').empty();
		let label = this.label;
		let	buildingName = this.data_buildingName;
		let	address = this.data_address;
		let	description = this.data_description;
		let	vexp = this.data_vexp;
		let	progdes = this.data_progdes;
		let	architect = this.data_architect;
		let	buildDate = this.data_buildDate;
		let	satStart = this.data_satStart;
		let	satEnd = this.data_satEnd;
		let	sunStart = this.data_sunStart;
		let	sunEnd = this.data_sunEnd;
		let	lat = this.data_lat;
		let	lon = this.data_lon;
		let	image = this.data_image;
		let	website = this.data_website;
		let	instagram = this.data_instagram;
		let	facebook = this.data_facebook;
		let	flickr = this.data_flickr;
		let	youtube = this.data_youtube;
		let	twitter = this.data_twitter;

		$('.buildingName').html(label + " - " + buildingName);
		$('.address').html(address);
		$('.architect').html(architect);
		$('.buildDate').html(buildDate);

		if (satStart !== ""){
			$('.saturdayHours').html("Saturday: " + satStart + " - " + satEnd + " ");
		} else {
			$('.saturdayHours').html("Saturday: Closed");
		}

		console.log(image);
		if (image !== ''){
		$('#image').attr('src', image);

		}

		if (sunStart !== ""){
			$('.sundayHours').html("Sunday: " + sunStart + " - " + sunEnd);
		} else {
			$('.sundayHours').html("Sunday: Closed");
		}

		if (website !== ""){
			$('.website').show();
			$('.website').html(`<a href='${website}'> <i class="fa fa-mouse-pointer"></i><p class="icontext"> Website </p></a>`);
		} else {
			$('.website').hide();
		};
		if (instagram !== ""){
			$('.instagram').show();
			$('.instagram').html(`<a href='${instagram}'><i class="fa fa-instagram"></i><p class="icontext"> Instagram </p></a>`);
		} else {
			$('.instagram').hide();
		};
		if (facebook !== ""){
			$('.facebook').show();
			$('.facebook').html(`<a href='${facebook}'><i class="fa fa-facebook"></i><p class="icontext"> Facebook</p></a>`);
		} else {
			$('.facebook').hide();
		};
		if (flickr !== ""){
			$('.flickr').show();
			$('.flickr').html(`<a href='${flickr}'><i class="fa fa-flickr"></i><p class="icontext"> Flicker</p></a>`);
		} else {
			$('.flickr').hide();
		};
		if (youtube !== ""){
			$('.youtube').show();
			$('.youtube').html(`<a href='${youtube}'><i class="fa fa-youtube-play"></i><p class="icontext">YouTube</p></a>`);
		} else {
			$('.youtube').hide();
		};

		if (twitter !== ""){
			$('.twitter').show();
			$('.twitter').html(`<a href='${twitter}'><i class="fa fa-twitter"></i><p class="icontext"> Twitter </p></a>`);
		} else {
			$('.twitter').hide();
		};

		$('.fullDescription').html(description);
		$('.programGuide').html(`"${progdes}"`);
		$('.visitorExperience').html(`"${vexp}"`);
	});
		markersArray.push(marker)
}

doorsOpen.init = function(){
	doorsOpen.getData();
	doorsOpen.startingPos();
	doorsOpen.events();
}

$(function(){
	doorsOpen.init();
})
	

	//make it default to show all, or make users choice display before and default to architecture
	//turn select into buttons
	//explore having precreated div
	//
