// load sub on open
checkCred()
init()
function init(){
    firebase.auth().onAuthStateChanged(function(user) {
        userID = firebase.auth().currentUser.uid;
        userProfile = db.collection("users").doc(userID);

        userProfile.get().then(function(snap){
                console.log(snap.data())
                document.getElementById("greetingMsg").innerHTML = "Greetings, " + snap.data().name;
            }
        )
        readSubscriptions();
    });
}

//scenario: when i login, i want to see dashboard
//of all my subscriptions

function readSubscriptions(){
    firebase.auth().onAuthStateChanged(function(user) {
        displayDiv = document.getElementById("overviewCards");

        userID = firebase.auth().currentUser.uid;
        // user's profile
        userSub = db.collection("users").doc(userID).collection("subs");
        userSub.get().then(
            function(snap){
                if(snap.size<=0){
                    console.log("empty")
                }
                snap.forEach(function(doc){
                    let deck = document.getElementById("overviewCards");

                    let nameNode = document.createElement("LI");     
                    let textnodeName = document.createTextNode(doc.data().name);
                    nameNode.appendChild(textnodeName); 
  
                    let priceNode = document.createElement("LI");                           // Create a <li> node
                    let textnodePrice = document.createTextNode("$" + doc.data().price);           // Create a text node
                    priceNode.appendChild(textnodePrice);  

                    let typeNode = document.createElement("LI");                           // Create a <li> node
                    let textnodeType = document.createTextNode(doc.data().type);           // Create a text node
                    typeNode.appendChild(textnodeType); 

                    let dateNode = document.createElement("LI");                           // Create a <li> node
                    let textnodeDue = document.createTextNode(doc.data().dueDate);           // Create a text node
                    dateNode.appendChild(textnodeDue);                                  // Append the text to <li>
                    
                    let freqNode = document.createElement("LI");                           // Create a <li> node
                    let textnodeFreq = document.createTextNode(doc.data().frequency);           // Create a text node
                    freqNode.appendChild(textnodeFreq); 

                    let cardList = document.createElement("UL");
                    cardList.appendChild(nameNode);
                    cardList.appendChild(priceNode);
                    cardList.appendChild(typeNode);
                    cardList.appendChild(dateNode);
                    cardList.appendChild(freqNode);
                    
                    let cardText = document.createElement("P");
                    cardText.className = "card-text";
                    cardText.appendChild(cardList);


                    //buttons
                    let viewButton = document.createElement("BUTTON");
                    viewButton.className = "btn btn-sm btn-outline-secondary";
                    viewButton.innerHTML = "Delete";
                    viewButton.onclick = function(){
                        deleteSub(doc.id);
                    };
                    
                    let editButton = document.createElement("BUTTON");
                    editButton.className = "btn btn-sm btn-outline-secondary";
                    editButton.setAttribute("data-toggle", "modal");
                    editButton.setAttribute("data-target", "#subModal");
                    editButton.onclick = function(){
                        editSub(doc.id,
                            doc.data().name,
                            doc.data().price,
                            doc.data().type,
                            doc.data().dueDate,
                            doc.data().frequency)};
                    editButton.innerHTML = "Edit";

                    let buttonBody = document.createElement("div");
                    buttonBody.className = "btn-group";
                    buttonBody.appendChild(viewButton);
                    buttonBody.appendChild(editButton);

                    let buttonBlock = document.createElement("div");
                    buttonBlock.className = "d-flex justify-content-between align-items-center";
                    buttonBlock.appendChild(buttonBody);


                    //main card
                    let cardBody = document.createElement("div");
                    cardBody.className = "card-body";
                    cardBody.appendChild(cardText);
                    cardBody.appendChild(buttonBlock);

                    let card = document.createElement("div")
                    card.className = "card mb-4 shadow-sm";
                    card.appendChild(cardBody);
                    
                    deck.appendChild(card);
                })
            }
        )
    });
}

function editSub(id, name, price, type, dueDate, frequency){
    document.getElementById("nameOfSub").value = name;
    document.getElementById("priceOfSub").value = price;
    document.getElementById("typeOfSub").value = type;
    document.getElementById("dateOfSub").value = dueDate;
    document.getElementById("freqOfSub").value = frequency;
    document.getElementById("updateBtn").setAttribute("data-id", id);
}


function deleteSub(subId){
    firebase.auth().onAuthStateChanged(function(user) {
        userID = firebase.auth().currentUser.uid;

        db.collection("users").doc(userID)
        .collection("subs").doc(subId)
        .delete().then(function() {
            showSuccess("deleteMessage");
            setTimeout(window.location.reload()
            , 5000)
        }).catch(function(error) {
            showError("deleteMessage");
        })
    });
}


function updateSub(){
    let subId = document.getElementById("updateBtn").getAttribute("data-id");
    let subName = document.getElementById("nameOfSub").value;
    let subAmount = document.getElementById("priceOfSub").value;
    let subType = document.getElementById("typeOfSub").value;
    let subDueDate = document.getElementById("dateOfSub").value;
    let subFreq = document.getElementById("freqOfSub").value;

    // update sub doc in user doc
    firebase.auth().onAuthStateChanged(function(user) {
        
        userID = firebase.auth().currentUser.uid;
        // user's profile
        userSubs = db.collection("users").doc(userID).collection("subs");

        // sub under user
        var sub = userSub.doc(subId);
        return sub.update({
            name: subName,
            price: subAmount,
            type: subType,
            dueDate: subDueDate,
            frequency:subFreq
        })
        .then(function() {
            showSuccess("updateMessage");
            document.getElementById("closeBtn").onclick = function(){
                window.location.reload();
            }
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            showError("updateMessage")
        });
    })
}

function showSuccess(elemId){
    message = document.getElementById(elemId)
    message.className = "alert alert-success";
    message.style.display = "block"
    if(elemId == "updateMessage"){
        message.innerHTML = "<strong>Success!</strong> Subscription added."
    }else{
        message.innerHTML = "<strong>Success!</strong> Subscription deleted. Refreshing in 5 seconds"
    }
}


function showError(elemId){
    message = document.getElementById(elemId)
    message.className = "alert alert-warning";
    message.style.display = "block";
    message.innerHTML = "<strong>Error!</strong> An error occured."
}
