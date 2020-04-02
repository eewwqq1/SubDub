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
                snap.forEach(function(doc){
                    let deck = document.getElementById("overviewCards");

                    let nameNode = document.createElement("LI");     
                    let textnodeName = document.createTextNode(doc.data().name);
                    nameNode.appendChild(textnodeName); 
  
                    let priceNode = document.createElement("LI");                           // Create a <li> node
                    let textnodePrice = document.createTextNode(doc.data().price);           // Create a text node
                    priceNode.appendChild(textnodePrice);                                   // Append the text to <li>
                    
                    let cardList = document.createElement("UL");
                    cardList.appendChild(nameNode);
                    cardList.appendChild(priceNode);
                    
                    let cardText = document.createElement("P");
                    cardText.className = "card-text";
                    cardText.appendChild(cardList);


                    //buttons
                    let viewButton = document.createElement("BUTTON");
                    viewButton.className = "btn btn-sm btn-outline-secondary";
                    viewButton.innerHTML = "View";
                    
                    let editButton = document.createElement("BUTTON");
                    editButton.className = "btn btn-sm btn-outline-secondary";
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


{/* <div class="card mb-4 shadow-sm">
<img class="card-img-top"
    data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail"
    alt="Thumbnail [100%x225]" style="height: 225px; width: 100%; display: block;"
    src="image/amazonLogo.jpg" data-holder-rendered="true">
<div class="card-body">

    <p class="card-text">
        <ul>
            <li>Amazon</li>
            <li>$10</li>
            <li>Next due date: 2020-03-30</li>
        </ul>
    </p>

    <div class="d-flex justify-content-between align-items-center">
        <div class="btn-group">
            <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
            <button type="button" class="btn btn-sm btn-outline-secondary">Edit
                Remainder</button>
        </div>
    </div>

</div>
</div> */}