// Retrieve the username from local storage
var username = localStorage.getItem("username");

console.log(username)
var firebaseConfig = {
	apiKey: "AIzaSyBrY73oassXkuCIBo9aQgGKr-4-uuMrJ-k",
	authDomain: "skku-community.firebaseapp.com",
	databaseURL: "https://skku-community-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "skku-community",
	storageBucket: "skku-community.appspot.com",
	messagingSenderId: "746816568557",
	appId: "1:746816568557:web:3c72a301adf07bd1af20e4"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.database()
// Define the SkkuChat class
class SkkuChat {
	// Method to create the home page of the chat
	home() {


		this.create_title()
		this.create_join_form()
	}
	// Method to create the chat page
	chat() {
		this.create_title()
		this.create_chat()
	}
	// Method to create the title
	create_title() {

		var title_container = document.createElement('div')
		title_container.setAttribute('id', 'title-wrapper')
		var title_inner_container = document.createElement('div')
		title_inner_container.setAttribute('id', 'title_inner_container')

		var title = document.createElement('h1')
		title.setAttribute('id', 'title')
		title.textContent = 'SKKU CHAT'

		title_inner_container.append(title)
		title_container.append(title_inner_container)
		document.body.append(title_container)
	}
	// Method to create the join form
	create_join_form() {

		var parent = this;

		var join_container = document.createElement('div')
		join_container.setAttribute('id', 'join-wrapper')

		var user_header = document.createElement('div')
		user_header.setAttribute('id', 'header-text')
		user_header.innerHTML = 'Welcome, ' + `${username}`;

		// Create the checkbox and label
		var checkbox = document.createElement('input');
		checkbox.setAttribute('type', 'checkbox');
		checkbox.setAttribute('id', 'myCheckbox');

		var label = document.createElement('label');
		label.setAttribute('for', 'myCheckbox');
		var span = document.createElement('span');
		span.setAttribute('class', 'custom-checkbox');
		label.append(span, ' Do you want to join anonymously?');

		var join_button = document.createElement('button')
		join_button.setAttribute('id', 'join-button')
		join_button.innerHTML = 'Join <i class="bx bxs-right-arrow-alt"></i>'

		var back_button = document.createElement('button')
		back_button.setAttribute('id', 'back-button')
		back_button.innerHTML = '<i class="bx bxs-left-arrow-alt"></i> Back'

		join_button.onclick = function() {
			if (checkbox.checked) {
				username = 'anon'
			}
			join_container.remove()
			parent.create_chat()
		}
		back_button.onclick = function() {
			window.location.href = 'forum.html';
		}

		join_container.append(user_header, checkbox, label, join_button, back_button)
		document.body.append(join_container)

	}
	// Method to create a loader
	create_load(container_id) {

		var parent = this;

		var container = document.getElementById(container_id)
		container.innerHTML = ''

		var loader_container = document.createElement('div')
		loader_container.setAttribute('class', 'loader_container')

		var loader = document.createElement('div')
		loader.setAttribute('class', 'loader')

		loader_container.append(loader)
		container.append(loader_container)

	}
	// Method to create the chat
	create_chat() {

		var parent = this;

		var title_container = document.getElementById('title-wrapper')
		var title = document.getElementById('title')
		title_container.classList.add('chat_title_container')

		title.classList.add('chat_title')

		var chat_container = document.createElement('div')
		chat_container.setAttribute('id', 'chat_container')

		var chat_inner_container = document.createElement('div')
		chat_inner_container.setAttribute('id', 'chat_inner_container')

		var chat_content_container = document.createElement('div')
		chat_content_container.setAttribute('id', 'chat_content_container')

		var chat_input_container = document.createElement('div')
		chat_input_container.setAttribute('id', 'chat_input_container')

		var chat_input_send = document.createElement('button')
		chat_input_send.setAttribute('id', 'chat_input_send')

		chat_input_send.innerHTML = `<i class="bx bxs-send" style="color: #173e37;"></i>`;


		var chat_input = document.createElement('input')
		chat_input.setAttribute('id', 'chat_input')

		chat_input.setAttribute('maxlength', 1000)

		chat_input.placeholder = `${username}. Say something...`

		chat_input_send.onclick = function() {

			if (chat_input.value.length <= 0) {
				alert('Enter your message!')
				return

			}

			parent.create_load('chat_content_container')

			parent.send_message(chat_input.value)

			chat_input.value = ''

			chat_input.focus()
		}

		var chat_logout_container = document.createElement('div')
		chat_logout_container.setAttribute('id', 'chat_logout_container')

		var chat_logout = document.createElement('button')
		chat_logout.setAttribute('id', 'chat_logout')

		chat_logout.textContent = 'Go Back'
		chat_logout.style.backgroundColor = "#eff9f7";


		chat_logout.onclick = function() {

			window.location.href = 'forum.html';
		}

		chat_logout_container.append(chat_logout)
		chat_input_container.append(chat_input, chat_input_send)
		chat_inner_container.append(chat_content_container, chat_input_container, chat_logout_container)
		chat_container.append(chat_inner_container)
		document.body.append(chat_container)

		parent.create_load('chat_content_container')

		parent.refresh_chat()
	}
	// Method to send a message
	send_message(message) {
		var parent = this

		if (username == null && message == null) {
			return
		}
		// Get the number of children of the 'chats' node in the database
		db.ref('chats/').once('value', function(message_object) {
			// Calculate the index for the new message
			var index = parseFloat(message_object.numChildren()) + 1
			// Add the new message to the database
			db.ref('chats/' + `message_${index}`).set({
					username: username,
					message: message,
					index: index
				})
				// If the message was added successfully, refresh the chat
				.then(function() {

					parent.refresh_chat()
				})
		})
	}
	// Method to refresh the chat
	refresh_chat() {
		var chat_content_container = document.getElementById('chat_content_container')
		// Listen for changes in the 'chats' node of the Firebase Realtime Database
		db.ref('chats/').on('value', function(messages_object) {

			chat_content_container.innerHTML = ''

			if (messages_object.numChildren() == 0) {
				return
			}

			// Get the messages as an array of objects
			var messages = Object.values(messages_object.val());
			var guide = []
			var unordered = []
			var ordered = []

			for (var i, i = 0; i < messages.length; i++) {

				guide.push(i + 1)
				// Add the message and its index to the unordered array
				unordered.push([messages[i], messages[i].index]);
			}
			// Order the messages according to the guide
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
			// Loop through the ordered messages
			ordered.forEach(function(data) {
				var username = data.username
				var message = data.message

				var message_container = document.createElement('div')
				message_container.setAttribute('class', 'message_container')

				var message_inner_container = document.createElement('div')
				message_inner_container.setAttribute('class', 'message_inner_container')

				var message_user_container = document.createElement('div')
				message_user_container.setAttribute('class', 'message_user_container')

				var message_user = document.createElement('p')
				message_user.setAttribute('class', 'message_user')
				message_user.textContent = `${username}`

				var message_content_container = document.createElement('div')
				message_content_container.setAttribute('class', 'message_content_container')

				var message_content = document.createElement('p')
				message_content.setAttribute('class', 'message_content')
				message_content.textContent = `${message}`

				//Fill chat with messages

				message_user_container.append(message_user)
				message_content_container.append(message_content)
				message_inner_container.append(message_user_container, message_content_container)
				message_container.append(message_inner_container)

				chat_content_container.append(message_container)
			});

			chat_content_container.scrollTop = chat_content_container.scrollHeight;
		})

	}
}
// Create a new SkkuChat object and display the home page
var app = new SkkuChat()

app.home();