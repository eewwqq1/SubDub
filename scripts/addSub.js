checkCred()
function writeSub(){
    let subName = document.getElementById("nameOfSub").value;
    let subAmount = document.getElementById("priceOfSub").value;
    let subType = document.getElementById("typeOfSub").value;
    let subDueDate = document.getElementById("dateOfSub").value;
    let subFreq = document.getElementById("freqOfSub").value;

    if(!subName || subAmount ==0 || !subType || !subFreq){
        window.alert("Please fill in all fields");
        return;
    }else{
        firebase.auth().onAuthStateChanged(function(user) {
        userID = firebase.auth().currentUser.uid;
        userSub = db.collection("users").doc(userID).collection("subs");
        userSub.add({
            name: subName,
            price: subAmount,
            type: subType,
            dueDate: subDueDate,
            frequency:subFreq
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            showSuccess();
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            showError()
        });
    });
    }


}

function showSuccess(){
    message = document.getElementById("message")
    message.className = "alert alert-success";
    message.style.display = "block"
    message.innerHTML = "<strong>Success!</strong> Subscription added."
}


function showError(){
    message = document.getElementById("message")
    message.className = "alert alert-warning";
    message.style.display = "block";
    message.innerHTML = "<strong>Error!</strong> An error occured."

}