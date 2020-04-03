checkCred()
loadInfo()
function loadInfo(){
    firebase.auth().onAuthStateChanged(function(user) {

        userID = firebase.auth().currentUser.uid;
        userProfile = db.collection("users").doc(userID);
        userProfile.get().then(
            function(snap){
                document.getElementById("nameOfUser").value = snap.data().name;
                document.getElementById("emailOfUser").value = snap.data().email;
                // Date
                //document.getElementById("ageOfUser").value = snap.data().date;
            }
        )
    });
}

function changePassword(){
    let pw1 = document.getElementById("newPassword1").value;
    let pw2 = document.getElementById("newPassword2").value;
    if (pw1.length < 6){
        window.alert("Passwords must be longer than 6 characters")
    }else if(pw1 != pw2){
        window.alert("Passwords do not match")
    }else{

        firebase.auth().onAuthStateChanged(function(user) {

            user.updatePassword(pw1).then(function() {
                showSuccessProfile("passwordMessage");
            }).catch(function(error) {
                showErrorProfile("passwordMessage", error);
            });
    
        })
    }
}



function changeInfo(){
    let name = document.getElementById("nameOfUser").value;
    let email= document.getElementById("emailOfUser").value;

    if(email.length == 0 || !email.includes("@")){
        window.alert("Email format is invalid");
    } else if(name.length ==0 ){
        window.alert("Name cannot be empty");
    }else{
        firebase.auth().onAuthStateChanged(function(user) {

            userID = firebase.auth().currentUser.uid;
            userProfile = db.collection("users").doc(userID)
                .get().then(function(){

                    if (userProfile.name == name 
                        && userProfile.email == email){
                            window.alert("No changes have been made")
                    }else if(userProfile.name == name 
                        && userProfile.email != email){
                            return userProfile.update({
                                name: name
                            })
                            .then(function() {
                                showSuccessProfile("nameMessage");
                            })
                            .catch(function(error) {
                                // The document probably doesn't exist.
                                showErrorProfile("nameMessage")
                            });
                    }else{
                        //update email in auth
                        user.updateEmail(email).then(function() {
                            // Update successful.
                            showSuccessProfile("emailMessage");
                            
                        }).catch(function(error) {
                            // An error happened.
                            showErrorProfile("emailMessage", error)
                        });

                        //update info in db
                        return userProfile.update({
                            name: name,
                            email: email,
                        })
                        .then(function() {
                            showSuccessProfile("nameMessage");
                        })
                        .catch(function(error) {
                            // The document probably doesn't exist.
                            showErrorProfile("nameMessage")
                        });
                    }

            });
        })
    }
}


function showSuccessProfile(elemID){

    message = document.getElementById(elemID)
    message.className = "alert alert-success";
    message.style.display = "block"
    if(elemID == "passwordMessage"){
        message.innerHTML = "<strong>Success!</strong> Password updated."
    }else{
        message.innerHTML = "<strong>Success!</strong> Profile info updated."
    }
}


function showErrorProfile(elemID, error){

    message = document.getElementById(elemID);
    message.className = "alert alert-warning";
    message.style.display = "block"

    message.innerHTML = "<strong>Error!</strong> Error occurred. "  + error;

}