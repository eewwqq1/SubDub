initializeFirebase(); 

function register(){
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage);
    }).then(function(){
        checkCred("index.html");
    });
}


function login(){
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage);
    }).then(function(){
        checkCred("index.html");
    });
}


function logout(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location = "login.html";
      }).catch(function(error) {
        // An error happened.
    }).then(function(){
        checkCred("");
    });
}


function checkCred(dest){
    let user = firebase.auth().currentUser;

    firebase.auth().onAuthStateChanged(function(user) {
        
        if (user) {
            window.location = dest;

        } else {
            window.location = "main.html";
        }
    });
}

//
// API for firebase
//
function initializeFirebase() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
    apiKey: "AIzaSyAL3H4clvbViJ4vFVymG1cYo51vAKor_zQ",
    authDomain: "sub-dub.firebaseapp.com",
    databaseURL: "https://sub-dub.firebaseio.com",
    projectId: "sub-dub",
    storageBucket: "sub-dub.appspot.com",
    messagingSenderId: "553039405587",
    appId: "1:553039405587:web:ce9ad9ef6e13fe2b0fd5e6"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
}


