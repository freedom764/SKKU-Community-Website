$('.menu-toggle').click(function() {
	$(".nav").toggleClass("mobile-nav");
	$(this).toggleClass("is-active");
});

var username = localStorage.getItem("username")
var firebaseConfig = {
	apiKey: "AIzaSyBrY73oassXkuCIBo9aQgGKr-4-uuMrJ-k",
	authDomain: "skku-community.firebaseapp.com",
	databaseURL: "https://skku-community-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "skku-community",
	storageBucket: "skku-community.appspot.com",
	messagingSenderId: "746816568557",
	appId: "1:746816568557:web:3c72a301adf07bd1af20e4"
};
firebase.initializeApp(firebaseConfig)
var db = firebase.database()

var forum_content_container = document.getElementById('content-wrapper')
var loader_container = document.createElement('div')
loader_container.setAttribute('class', 'loader_container')

var loader = document.createElement('div')
loader.setAttribute('class', 'loader')

loader_container.append(loader)
forum_content_container.append(loader_container)

var forum_container = document.createElement('div');
forum_content_container.append(forum_container);

// Listen for changes in the 'posts' node of the Firebase Realtime Database
db.ref('posts/').on('value', function(posts_object) {

	forum_container.innerHTML = '';

	if (posts_object.numChildren() == 0) {
		return
	}

	var posts = Object.values(posts_object.val());
	var guide = []
	var unordered = []
	var ordered = []

	for (var i, i = 0; i < posts.length; i++) {
		guide.push(i + 1)
		unordered.push([posts[i], posts[i].index]);
	}

	// Order the posts according to the guide
	guide.forEach(function(key) {
		var found = false
		unordered = unordered.filter(function(item) {
			if (!found && item[1] == key) {
				ordered.push(item[0])
				found = true
				return false
			} else {
				return true
			}
		})
	})

	// Reverse the order of the array
	ordered.reverse();

	// Loop through the ordered posts
	ordered.forEach(function(data) {
		var topic = data.topic;
		var username = data.username
		var message = data.message
		var numberComments = data.numberComments

		var post_container = document.createElement('div')
		post_container.setAttribute('class', 'box')

		var post_topic = document.createElement('div')
		post_topic.setAttribute('class', 'details')

		var post_message = document.createElement('div')
		post_message.setAttribute('class', 'sub-details')

		var post_comment = document.createElement('div')
		post_comment.setAttribute('class', 'comment')

		post_topic.textContent = `${topic}`
		post_message.textContent = `${message}`
		post_comment.innerHTML = 'by ' + `${username}` + '<br><i class="bx bxs-chat"></i>' + `${numberComments}`;

		post_topic.append(post_message, post_comment)
		post_container.append(post_topic)
		forum_content_container.append(post_container)
	});

	forum_content_container.scrollTop = forum_content_container.scrollHeight;
	loader_container.style.display = 'none';
}, function(error) {
	console.error(error);
});