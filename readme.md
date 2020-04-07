## Sub-Dub
Index:
* [General info](#general-info)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
This is a web application that tracks a user's subscription. 
User can start by creating an account. Upon logging in, user can add subscriptions and fill in details.
There is a profiles page to edit user's details
The front page displays all user's subscription.
This project demonstrates:
* read and write to firestore, a non-sql database
* use of firebase authentication and creation of a users collection in firestore
* customized user experience after login/signup
* tracking of a data point provided by the user
* display of a user's information
* use of boostrap

	
## Technologies
Technologies that were used for this project:
* Firebase Hosting
* Firebase Authentication
* Firebase Firestore Database
* HTML, CSS
* JavaScript
* Bootstrap 
	
## Content
Content of the project folder:

```
 Top level of project folder: 
├── actLog.html                 # Page of user's activity and past/current subscription
├── addSub.html                 # Add Subscription to account
├── error.html                  # File for error (Eg: 404)
├── index.html                  # after logged in, overview page of user's info
├── login.html                  # login HTML file, contains logic for user authentication
├── main.html                   # landing HTML file, this is what users see when you come to url
├── profile.html                # Page where user update the profile info
├── register.html               # register HTML file, contains logic for user authentication
├── .gitignore                  # Git ignore file
└── README.md

Script files: 
├── addSub.js                   # Write to DB
├── error.js                    # Error page (Visual logic)
├── firebase.js                 # Handle firebase initialization
├── index.js                    # Load, edit, delete subscriptions in DB
├── profile.js                  # Update user's profile info

Styling files: 
├── error.css                   # Error page style
├── login.css                   # Login page style
├── style.css                   # General style rules
```
