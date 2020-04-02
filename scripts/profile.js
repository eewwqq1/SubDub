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