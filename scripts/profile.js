//=========================================================
// Overview page logic: Load, edit and delete subscription
//=========================================================

//------------------------
// Validate user's session
//------------------------
checkCred()

//------------------------
// Load user's information
//------------------------
loadInfo()

//-------------------------------------------------------------
// Load user's information into fields (Invoke on load screen)
// Input param: None
// Return value: None
//-------------------------------------------------------------
function loadInfo() {
    firebase.auth().onAuthStateChanged(function (user) {
        // Get user profile
        userID = firebase.auth().currentUser.uid;
        userProfile = db.collection("users").doc(userID);
        userProfile.get().then(
            function (snap) {
                document.getElementById("nameOfUser").value = snap.data().name;
                document.getElementById("emailOfUser").value = snap.data().email;
                // Date
                //document.getElementById("ageOfUser").value = snap.data().date;
            }
        )
    });
}

//---------------------------------------------------------------------
// Update user password, in Firebase Auth (Invoked by Update password)
// Input param: None
// Return value: None
//---------------------------------------------------------------------
function changePassword() {
    let pw1 = document.getElementById("newPassword1").value;
    let pw2 = document.getElementById("newPassword2").value;
    if (pw1.length < 6) {
        window.alert("Passwords must be longer than 6 characters")

    } else if (pw1 != pw2) {
        window.alert("Passwords do not match")

    } else {
        firebase.auth().onAuthStateChanged(function (user) {

            user.updatePassword(pw1).then(function () {
                showSuccessProfile("passwordMessage");
            }).catch(function (error) {
                showErrorProfile("passwordMessage", error);
            });

        })
    }
}

//-----------------------------------------------------
// Update user's info in DB (invoked by Update Button)
// Input param: None
// Return value: None
//-----------------------------------------------------
function changeInfo() {
    let name = document.getElementById("nameOfUser").value;
    let email = document.getElementById("emailOfUser").value;

    // Error prevention
    if (email.length == 0 || !email.includes("@")) {
        window.alert("Email format is invalid");

    } else if (name.length == 0) {
        window.alert("Name cannot be empty");

    } else {
        firebase.auth().onAuthStateChanged(function (user) {

            // Get user doc
            userID = firebase.auth().currentUser.uid;
            userProfile = db.collection("users").doc(userID);

            // Compare data
            if (userProfile.name == name &&
                userProfile.email == email) {
                // No change (No over write)
                window.alert("No changes have been made")

            } else if (userProfile.name == name &&
                userProfile.email != email) {
                // Only name is changed
                return userProfile.update({
                        name: name
                    })
                    .then(function () {
                        showSuccessProfile("nameMessage");
                    })
                    .catch(function (error) {
                        showErrorProfile("nameMessage")
                    });

            } else {
                // Update email in Firebase Auth
                user.updateEmail(email).then(function () {
                    // Update successful.
                    showSuccessProfile("emailMessage");

                }).catch(function (error) {
                    // An error happened.
                    showErrorProfile("emailMessage", error)
                });

                // Update info in DB
                return userProfile.update({
                        name: name,
                        email: email,
                    })
                    .then(function () {
                        showSuccessProfile("nameMessage");
                    })
                    .catch(function (error) {
                        showErrorProfile("nameMessage")
                    });
            }
        })
    }
}

//---------------------
// Show success message (Invoked by DB response)
// Input param: elemId = element ID
// Return value: None
//---------------------
function showSuccessProfile(elemID) {

    message = document.getElementById(elemID)
    message.className = "alert alert-success";
    message.style.display = "block"

    if (elemID == "passwordMessage") {
        message.innerHTML = "<strong>Success!</strong> Password updated."
    } else {
        message.innerHTML = "<strong>Success!</strong> Profile info updated."
    }
}

//---------------------
// Show error message (Invoked by DB response)
// Input param: elemId = element ID
// Return value: None
//---------------------
function showErrorProfile(elemID, error) {

    message = document.getElementById(elemID);
    message.className = "alert alert-warning";
    message.style.display = "block"

    message.innerHTML = "<strong>Error!</strong> Error occurred. " + error;

}