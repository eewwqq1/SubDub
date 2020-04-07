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
                    let deck = document.getElementById("overviewCards");
                    let emptyMsg = document.createElement("p");
                    emptyMsg.innerHTML = "No subscription to show!"
                    emptyMsg.style.textAlign = "center";
                    emptyMsg.style.padding = "1rem";
                    emptyMsg.style.fontSize = "1.5rem";

                    let emptyImg =  document.createElement("img");
                    emptyImg.src = "image/emptyImg.png";
                    emptyImg.style.width = "100%";
                    emptyImg.style.height = "auto";
                    deck.appendChild(emptyMsg);
                    deck.appendChild(emptyImg);
                }
                snap.forEach(function(doc){
                    let deck = document.getElementById("overviewCards");

                    let nameNode = document.createElement("LI");     
                    let textnodeName = document.createTextNode(doc.data().name);
                    nameNode.appendChild(textnodeName); 
  
                    let priceNode = document.createElement("LI");                                  // Create a <li> node
                    let textnodePrice = document.createTextNode("$" + doc.data().price);           // Create a text node
                    priceNode.appendChild(textnodePrice);  

                    let typeNode = document.createElement("LI");                      
                    let textnodeType = document.createTextNode(doc.data().type);      
                    typeNode.appendChild(textnodeType); 

                    let dateNode = document.createElement("LI");                      
                    let textnodeDue = document.createTextNode(doc.data().dueDate);    
                    dateNode.appendChild(textnodeDue);                                
                    
                    let freqNode = document.createElement("LI");                      
                    let textnodeFreq = document.createTextNode(doc.data().frequency); 
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


                    let deleteMsg = document.createElement("P")
                    deleteMsg.className = "deleteMessage alert-danger";
                    deleteMsg.style.display = "none";
                    deleteMsg.style.margin = "5px";
                    deleteMsg.innerHTML = "Confirm delete? <br><br>"
                    
                    let delButt = document.createElement("Button");
                    delButt.innerHTML = "Confirm Delete";
                    delButt.className = "btn btn-danger";
                    delButt.style.margin = "5px";
                    delButt.onclick = function(){
                        deleteSub(doc.id);
                    };

                    let cancelButt = document.createElement("Button");
                    cancelButt.innerHTML = "Dismiss";
                    cancelButt.className = "btn btn-secondary";
                    cancelButt.style.margin = "5px";
                    cancelButt.onclick = function(){
                        deleteMsg.style.display = "none";
                    }
                   
                    deleteMsg.appendChild(delButt);
                    deleteMsg.appendChild(cancelButt);

                    //buttons
                    let viewButton = document.createElement("BUTTON");
                    viewButton.className = "btn btn-sm btn-outline-secondary";
                    viewButton.innerHTML = "Delete";
                    viewButton.onclick = function(){
                        deleteMsg.style.display = "block";
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
                    cardBody.appendChild(deleteMsg);
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
        let sub = userSub.doc(subId);
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
