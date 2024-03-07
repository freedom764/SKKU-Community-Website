$('.menu-toggle').click(function() {
	$(".nav").toggleClass("mobile-nav");
	$(this).toggleClass("is-active");
});

// Retrieve the username from local storage
var username = localStorage.getItem("username")

// Firebase configuration details
var firebaseConfig = {
	apiKey: "AIzaSyBrY73oassXkuCIBo9aQgGKr-4-uuMrJ-k",
	authDomain: "skku-community.firebaseapp.com",
	databaseURL: "https://skku-community-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "skku-community",
	storageBucket: "skku-community.appspot.com",
	messagingSenderId: "746816568557",
	appId: "1:746816568557:web:3c72a301adf07bd1af20e4"
};

// Initialize Firebase with the provided configuration details
firebase.initializeApp(firebaseConfig)

// Get a reference to the database service
var db = firebase.database()

// Change the cursor to 'progress' and disable buttons when an AJAX request starts
$(document).ajaxStart(function() {
		$("body").css("cursor", "progress");
		$(":button").prop("disabled", true);
	})

	// Change the cursor back to 'default' and enable buttons when an AJAX request stops
	.ajaxStop(function() {
		$("body").css("cursor", "default");
		$(":button").prop("disabled", false);
	});

// When the post button is clicked...
$("#postBtn").click(function() {
	// Get the values of the topic and message fields
	var topic = $("#topic").val();
	var msg = $("#msg").val();

	// If either field is empty, alert the user to fill both fields
	if (topic == "" || msg == "") {
		alert("Fill both fields!");
	} else {
		// Otherwise, get the number of children of the 'posts' node in the database
		db.ref('posts/').once('value', function(post_object) {
			// Calculate the index for the new post
			var index = parseFloat(post_object.numChildren()) + 1;

	
			console.log("Index: " + index);

			// Add the new post to the database
			db.ref('posts/' + `post_${index}`).set({
					topic: topic,
					message: msg,
					index: index,
					username: username,
					numberComments: 0
				})
				// If the post was added successfully, alert the user
				.then(function() {
					alert("Posted!");
				})
				// If there was an error, log the error message
				.catch(function(error) {
					console.log("Error: " + error.message);
				});
		})
	}
});