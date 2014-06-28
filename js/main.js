// The root URL for the RESTful services
var rootURL = "http://" + window.location.hostname + "/api/meetup";

var currentMeetup;

findAll();

$("#date").datepicker();

$('#btnDelete').hide();

$('#btnSearch').click(function() {
	search($('#searchKey').val());
	return false;
});

$('#searchKey').keypress(function(e){
	if(e.which == 13) {
		search($('#searchKey').val());
		e.preventDefault();
		return false;
    }
});

$('#btnAdd').click(function() {
	newMeetup();
	delMessage();
	return false;
});

$('#btnSave').click(function() {
	if ($('#name').val() == '' )
		setMessage("warning", "Name is mandatory")
	else
		if ($('#meetupId').val() == '')
			addMeetup();
		else
			updateMeetup();
	return false;
});

$('#btnDelete').click(function() {
	deleteMeetup();
	return false;
});

$('#meetupList').on('click', 'a', function() {
	findById($(this).data('identity'));
});

function search(searchKey) {
	if (searchKey == '') 
		findAll();
	else
		findByName(searchKey);
}

function newMeetup() {
	$('#btnDelete').hide();
	currentMeetup = {};
	renderDetails(currentMeetup);
}

function findAll() {
	console.log('findAll');
	$.ajax({
		type: 'GET',
		url: rootURL,
		dataType: "json",
		success: renderList
	});
}

function findByName(searchKey) {
	console.log('findByName: ' + searchKey);
	delMessage();
	$.ajax({
		type: 'GET',
		url: rootURL + '/search/' + searchKey,
		dataType: "json",
		success: renderList 
	});
}

function findById(id) {
	console.log('findById: ' + id);
	delMessage();
	$.ajax({
		type: 'GET',
		url: rootURL + '/' + id,
		dataType: "json",
		success: function(data){
			$('#btnDelete').show();
			console.log('findById success: ' + data.name);
			currentMeetup = data;
			renderDetails(currentMeetup);
		}
	});
}

function addMeetup() {
	console.log('addMeetup');
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL,
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			setMessage("success", "Meetup created successfully");
			newMeetup();
			findAll();
		},
		error: function(jqXHR, textStatus, errorThrown){
			setMessage("error", "Sorry, an error has occurred");
			console.log(jqXHR);
		}
	});
}

function updateMeetup() {
	console.log('updateMeetup');
	$.ajax({
		type: 'PUT',
		contentType: 'application/json',
		url: rootURL + '/' + $('#meetupId').val(),
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			setMessage("success", "Meetup updated successfully");
			newMeetup();
			findAll();
		},
		error: function(jqXHR, textStatus, errorThrown){
			setMessage("error", "Sorry, an error has occurred");
		}
	});
}

function deleteMeetup() {
	console.log('deleteMeetup');
	$.ajax({
		type: 'DELETE',
		url: rootURL + '/' + $('#meetupId').val(),
		success: function(data, textStatus, jqXHR){
			setMessage("success", "Meetup deleted successfully");
			newMeetup();
			findAll();
		},
		error: function(jqXHR, textStatus, errorThrown){
			setMessage("error", "Sorry, an error has occurred");
		}
	});
}

function renderList(data) {
	$('#meetupList li').remove();
	$.each(data, function(index, meetup) {
		$('#meetupList').append('<li><a href="#" data-identity="' + meetup.id + '">'+ meetup.name+'</a></li>');
	});
}

function renderDetails(meetup) {
	$('#meetupId').val(meetup.id);
	$('#name').val(meetup.name);
	$('#place').val(meetup.place);
	$('#date').val(meetup.date);
	$('#speaker').val(meetup.speaker);
	$('#description').val(meetup.description);
}

function formToJSON() {
	return JSON.stringify({
		"id": 	$('#meetupId').val(), 
		"name": $('#name').val(), 
		"place":$('#place').val(),
		"date": $('#date').val(),
		"speaker": $('#speaker').val(),
		"description":$('#description').val(),
		});
}

function setMessage(type, message){
	$('#message').addClass(type);
	$('#message').html(message);
}

function delMessage(type, message){
	$('#message').removeClass();
	$('#message').html("");
}
