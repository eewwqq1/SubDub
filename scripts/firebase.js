//====================
// API for Firebase
//====================

//------------------------
// Firebase configuration
//------------------------
var firebaseConfig = {
    apiKey: "AIzaSyAL3H4clvbViJ4vFVymG1cYo51vAKor_zQ",
    authDomain: "sub-dub.firebaseapp.com",
    databaseURL: "https://sub-dub.firebaseio.com",
    projectId: "sub-dub",
    storageBucket: "sub-dub.appspot.com",
    messagingSenderId: "553039405587",
    appId: "1:553039405587:web:ce9ad9ef6e13fe2b0fd5e6"
};

//--------------------
// Initialize Firebase
//--------------------
firebase.initializeApp(firebaseConfig);
db = firebase.firestore();

//------------------------
// Register user's account (Invoked by register button)
// Input param: None
// Return value: None
//------------------------
function register() {
    let pw = document.getElementById("pwInput").value;
    let pwCon = document.getElementById("pwInputCon").value;
    let name = document.getElementById("nameInput").value;
    let email = document.getElementById("emailInput").value;

    if (pw != pwCon) {
        window.alert("Passwords do not match");
        return;

    } else {
        firebase.auth().createUserWithEmailAndPassword(email, pw).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorMessage);
            return false;
        }).then(function () {
            let user = firebase.auth().currentUser;
            let event = new Date();
            db.collection("users").doc(user.uid).set({
                name: name,
                email: email,
                // dateOfCreation : event.toString()
            }).then(function () {
                window.location = "index.html";
            })
        });
    }
}

//--------------------
// Login and redirect (Invoked by login button)
// Input param: None
// Return value: None
//--------------------
function login() {
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage);
    }).then(function () {
        window.location = "index.html";
    });
}

//------------------------------------------
// Sign Out (Invoked by log out button)
// Input param: None
// Return value: None
//------------------------------------------
function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        window.location = "main.html";
    }).catch(function (error) {
        // An error happened.
    }).then(function () {
        checkCred("");
    });
}

//--------------------
// Validate user's session 
// Input param: None
// Return value: None
//--------------------
function checkCred() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location = "main.html";
        }
    });
}