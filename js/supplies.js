$(document).ready(function() {

    var productName = '';
    var currentCoordinates = '';

    function submitReady() {
        if (productName != '') {
            $("#searchSubmit").attr('disabled', false);
        } else {
            $("#searchSubmit").attr('disabled', true);
        }
    }

    function getLocation() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            "notSupported";
        }
    }

    function showPosition(position) {

        currentCoordinates = {'storelat': position.coords.latitude, 'storelon': position.coords.longitude};

        var queryUrl = "https://api.walmartlabs.com/v1/stores?format=json&lat=" + currentCoordinates.storelat + "&lon=" + currentCoordinates.storelon + "&apiKey=rmrt3yqsdejv4k8fpvefa58t";
            
        $.ajax({
            url: queryUrl,
            method: "GET",
            crossDomain: true,
            dataType: 'jsonp'
        }).then(function (response) {
            
            $("#dataStores").text("");

            for (var i = 0; i < 6; i ++) {

                var rowStore = $("<tr>");
                rowStore.addClass("storesData");
                


                var colName = $("<td>");
                colName.append(response[i].name + " (" + response[i].zip + ")");
                
                var colPhone = $("<td>");   
                colPhone.append(response[i].phoneNumber);

                var colMap = $("<td id='mapStore'>");
                colMap.append("<i class='fas fa-map-marked-alt'></i>");
                colMap.attr("data-toggle", "modal");
                colMap.attr("data-target", "#modalMapStore");
                colMap.attr("data-lat", response[i].coordinates[1]);
                colMap.attr("data-long", response[i].coordinates[0]);
                colMap.attr("data-address", response[i].streetAddress + ', ' + response[i].city + ' ' + response[i].stateProvCode + ', ' + response[i].zip);

                rowStore.append(colName);
                rowStore.append(colPhone);
                rowStore.append(colMap);

                $("#dataStores").append(rowStore);
            }
        });
    }

    $("#inputSearch").change("value", function () {
        productName = $("#inputSearch").val().trim();
        submitReady();
    })

    $('#searchSubmit').on("click", function (event) {

        $("#searchSubmit").attr('disabled', true);
        $("#inputSearch").val(null);

        event.preventDefault();
        var queryUrl = "https://api.walmartlabs.com/v1/search?query=" + productName + "&format=json&apiKey=rmrt3yqsdejv4k8fpvefa58t";

        // Creates AJAX call for stations button being clicked
        $.ajax({
            url: queryUrl,
            method: "GET",
            crossDomain: true,
            dataType: 'jsonp'
        }).then(function (response) {

            getLocation();
            $("#dataSupplies").text("");

            for (var i = 0; i < response.items.length; i ++) {

                var rowSupply = $("<tr>");
                rowSupply.addClass('productData');
                rowSupply.attr("data-id", response.items[i].itemId);
                rowSupply.attr("data-toggle", "modal");
                rowSupply.attr("data-target", "#modalProduct");

                var colName = $("<td>");
                colName.append(response.items[i].name);

                var colPrice = $("<td>");
                colPrice.append('$' + response.items[i].salePrice);

                rowSupply.append(colName);
                rowSupply.append(colPrice);

                $("#dataSupplies").append(rowSupply);
            }
        });
    });


    $(document).on("click", "#mapStore", function () {

        console.log(  $(this).attr("data-lat")   )

        localStorage.setItem("storelat", $(this).attr("data-lat"));
        localStorage.setItem("storelong", $(this).attr("data-long"));

        var storelat = localStorage.getItem("storelat");
        var storelong = localStorage.getItem("storelong");
        $("#storeAddress").text($(this).attr("data-address"));

        $("#mapStoreView").html('<iframe src="showinmap.html" style="height: 430px; width: 100%"></iframe>');
    })


    $(document).on("click", ".productData", function () {

        console.log($(this).attr("data-id"))
 
        var id = $(this).attr("data-id");
 
        var walmartQuery = "https://api.walmartlabs.com/v1/items/" + id + "?format=json&apiKey=gxx7k9yurjvet2d8xbw3k29f";
 
 
        // Creates AJAX call for stations button being clicked
        $.ajax({
            url: walmartQuery,
            crossDomain: true,
            dataType: 'jsonp',
            method: "GET"
        }).then(function (response) {
 
            $("#productName").text(response.name);
            $("#productImage").html("<img src='" + response.largeImage + "' alt='' style='width:100%'>")
            $("#productPrice").text("$" + response.salePrice)
            $("#productRate").text(response.customerRating)
            $("#productDescription").text(response.shortDescription)
 
        })
    })

});