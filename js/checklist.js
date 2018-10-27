$(function () {

    var config = {
        apiKey: "AIzaSyAtjgM-9GPkeCofL3SXRw6uCedoDQDuINg",
        authDomain: "hurricaneready-e1c88.firebaseapp.com",
        databaseURL: "https://hurricaneready-e1c88.firebaseio.com",
        projectId: "hurricaneready-e1c88",
        storageBucket: "hurricaneready-e1c88.appspot.com",
        messagingSenderId: "1012618278075"
    };

    firebase.initializeApp(config);

    const db = firebase.firestore();

    var logged = localStorage.getItem("logged");
    var email = localStorage.getItem("email");

    //var logged = "true";
    //var email = "rperez@gmail.com"

    var exist = false;

    function newUser(newEmail) {

        db.collection("users").doc().set({
            'email': newEmail,
            'Store one gallon of water per person per day': false,
            'Ready-to-eat canned meats, fruits, and vegetables': false,
            'High energy foods': false,
            'Vitamins': false,
            '(20) adhesive bandages, various sizes': false,
            'Aspirin or nonaspirin pain reliever': false,
            'Anti-diarrhea medication': false,
            'Mess kits, or paper cups, plates, and plastic utensils': false,
            'Battery-operated radio and extra batteries': false,
            'Flashlight and extra batteries': false,
            'Cash or traveler’s checks, change': false,
            'Non-electric can opener, utility knife': false,
            'Plastic storage containers': false,
            'Toilet paper, towelettes': false,
            'Soap, liquid detergent': false,
            'Feminine supplies': false,
            'Personal hygiene items': false,
            'Sturdy shoes or work boots': false,
            'Blankets or sleeping bags': false,
            'Hat and gloves': false,
            'Thermal underwear': false
        });
    }

    var ready = true;
    if (ready == false) {
        $("#readyElements").attr("hidden", true);
        $("#unreadyElements").attr("hidden", false);
        $("#pendingBtn").text("View Pending List");
        ready = true;
    } else {
        $("#readyElements").attr("hidden", false);
        $("#unreadyElements").attr("hidden", true);
        $("#pendingBtn").text("View Ready List");
        ready = false;
    }

    $("#pendingBtn").on("click", function (event) {
        event.preventDefault();

        if (ready == false) {
            $("#readyElements").attr("hidden", true);
            $("#unreadyElements").attr("hidden", false);
            $("#pendingBtn").text("View Pending List");
            ready = true;
        } else {
            $("#readyElements").attr("hidden", false);
            $("#unreadyElements").attr("hidden", true);
            $("#pendingBtn").text("View Ready List");
            ready = false;
        }
    })

    if (logged == "false") {
        $("#login").attr("hidden", true);
        $("#nologin").attr("hidden", false);
    } else {
        $("#login").attr("hidden", false);
        $("#name").text(localStorage.getItem("user"))
        $("#nologin").attr("hidden", true);
    }

    $("#googleLogin").on("click", function () {
        provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then(result => {

                user = result.user;

                db.collection("users").where("email", "==", user.email).get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        if (doc) {
                            exist = true;
                        }
                    });
                })

                setTimeout(function () {

                    if (exist == true) {
                        localStorage.setItem("logged", true);
                        localStorage.setItem("user", user.displayName);
                        localStorage.setItem("email", user.email);

                        $("#login").attr("hidden", false);
                        $("#nologin").attr("hidden", true);
                    } else {
                        localStorage.setItem("logged", true);
                        localStorage.setItem("user", user.displayName);
                        localStorage.setItem("email", user.email);

                        setTimeout(function () {
                            newUser(user.email);
                        }, 500);

                        $("#login").attr("hidden", false);
                        $("#nologin").attr("hidden", true);
                    }
                }, 500);
            })
            .catch(console.log);
    });

    $("#logout").on("click", function () {
        firebase.auth().signOut();

        localStorage.setItem("logged", false);
        localStorage.setItem("user", "");
        localStorage.setItem("email", "");

        $("#login").attr("hidden", true);
        $("#nologin").attr("hidden", false);
        $("#name").text("");
    });

    db.collection("users").onSnapshot(doc => {
        $("#dataPending").text("");
        $("#dataReady").text("");

        doc.forEach(function (doc) {
            if (doc.data().email == email) {

                for (var key in doc.data()) {
                    var value = doc.data()[key]

                    if (value == false) {
                        var rowElementPending = $("<tr>");
                        rowElementPending.addClass("elementData");

                        var colElementPending = $("<td>");
                        colElementPending.append(key);

                        var colChangePending = $("<td id='beReady'>");
                        colChangePending.append("<i class='fas fa-angle-double-right'></i>");
                        colChangePending.attr("data-id", doc.id);
                        colChangePending.attr("data-email", doc.data().email);
                        colChangePending.attr("data-key", key);

                        var colErasePending = $("<td id='erase'>");
                        colErasePending.append("<i class='fa fa-trash'></i>");
                        colErasePending.attr("data-id", doc.id);
                        colErasePending.attr("data-key", key);

                        rowElementPending.append(colElementPending)
                            .append(colChangePending)
                            .append(colErasePending)

                        $("#dataPending").append(rowElementPending);
                    }

                    if (value == true) {
                        var rowElementReady = $("<tr>");
                        rowElementReady.addClass("elementData");

                        var colElementReady = $("<td>");
                        colElementReady.append(key);

                        var colChangeReady = $("<td id='beUnready'>");
                        colChangeReady.append("<i class='fas fa-angle-double-left'></i>");
                        colChangeReady.attr("data-id", doc.id);
                        colChangeReady.attr("data-email", doc.data().email);
                        colChangeReady.attr("data-key", key);

                        rowElementReady.append(colElementReady)
                            .append(colChangeReady)

                        $("#dataReady").append(rowElementReady);
                    }
                }
            } else {

            }
        })

    });


    $(document).on("click", "#beReady", function () {
        var element = $(this).attr("data-key")
        db.collection("users").doc($(this).attr("data-id")).update({
            [element]: true
        });
    })

    $(document).on("click", "#beUnready", function () {
        var element = $(this).attr("data-key")
        db.collection("users").doc($(this).attr("data-id")).update({
            [element]: false
        });
    })

    $(document).on("click", "#erase", function () {
        var element = $(this).attr("data-key")
        db.collection("users").doc($(this).attr("data-id")).update({
            [element]: 'deleted'
        });
    })

    $("#newItem").on("click", function () {
        event.preventDefault();

        var newTask = $("#inputTask").val();

        db.collection("users").where("email", "==", email).get().then(doc => {
            doc.forEach(function (docu) {
                db.collection("users").doc(docu.id).update({
                    [newTask]: false
                });
            })
        });

        $("#inputTask").val('');
    })










    function downloadToCsv(json) {

        var csvContent = "data:text/csv;charset=utf-8,";

        json.forEach(function (rowArray) {
            var row = rowArray.join(",");
            csvContent += row + "\r\n";
        });

        var encodedUri = encodeURI(csvContent);
        window.open(encodedUri);
    }

    $("#downloadBtn").on("click", function (event) {
        event.preventDefault();

        // var json = [["can", "city1", "some other info"], ["name2", "city2", "more info"]];
        // downloadToCsv(json);

        db.collection("users").where("email", "==", user.email).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                if (doc) {
                    console.log(doc.data())
                }
            });
        })

    });






})
