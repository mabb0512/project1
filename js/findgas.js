$(function () {

    var state = '';
    var gasType = '';
    var zip = '';
    var limit = 5;
    var coordenates = '';

    function submitReady() {
        if (gasType != '' && (state != '' || zip != '')) {
            $("#stationsSubmit").attr('disabled', false);
        } else {
            $("#stationsSubmit").attr('disabled', true);
        }
    }

    $("#selectState").on("click", function () {
        state = $("#selectState").val();
        submitReady();
    })

    $("#selectGasType").on("click", function () {
        gasType = $("#selectGasType").val();
        submitReady();
    })

    $("#inputZip").change("value", function () {
        zip = $("#inputZip").val();
        submitReady();
    })

    $("#selectLimit").on("click", function () {
        limit = $("#selectLimit").val();
    })

    // FOR GAS SEARCH
    $("#stationsSubmit").on("click", function (event) {
        event.preventDefault();

        if (state != '') {
            var queryURL = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json?fuel_type=" + gasType + "&state=" + state + "&limit=" + limit + "&api_key=gHMrq4MMgbBpXOPWPO6Cf6OqYK80OomuANhCPXMP&format=JSON"
        }

        if (zip != '') {
            var queryURL = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json?fuel_type=" + gasType + "&zip=" + zip + "&limit=" + limit + "&api_key=gHMrq4MMgbBpXOPWPO6Cf6OqYK80OomuANhCPXMP&format=JSON"
        }

        // Creates AJAX call for stations button being clicked
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $("#dataStations").text("");
            for (var i = 0; i < response.fuel_stations.length; i++) {

                var rowStation = $("<tr>");
                rowStation.addClass("stationsData");
                rowStation.attr("data-lat", response.fuel_stations[i].latitude);
                rowStation.attr("data-long", response.fuel_stations[i].longitude);
                rowStation.attr("data-address", response.fuel_stations[i].street_address + ', ' + response.fuel_stations[i].city + ' ' + response.fuel_stations[i].state + ', ' + response.fuel_stations[i].zip);

                var colName = $("<td>");
                colName.append(response.fuel_stations[i].station_name);

                var colPhone = $("<td>");
                colPhone.append(response.fuel_stations[i].station_phone);

                var colHours = $("<td>");
                colHours.append(response.fuel_stations[i].access_days_time);

                var colMap = $("<td id='map'>");
                colMap.append("<i class='fas fa-map-marked-alt'></i>");
                colMap.attr("data-toggle", "modal");
                colMap.attr("data-target", "#modalMapStation");

                rowStation.append(colName)
                    .append(colPhone)
                    .append(colHours)
                    .append(colMap)

                $("#dataStations").append(rowStation);

                console.log(response.fuel_stations[i])
            }
        })
    })

    $(document).on("click", "#map", function () {
        localStorage.setItem("lat", $(this).parent().attr("data-lat"));
        localStorage.setItem("long", $(this).parent().attr("data-long"));

        var lat = localStorage.getItem("lat");
        var long = localStorage.getItem("long");


        console.log($(this).parent().attr("data-address"))

        
        $("#stationAddress").text($(this).parent().attr("data-address"))
        $("#mapView").html('<iframe src="showgasmap.html" style="height: 430px; width: 100%"></iframe>');

        console.log(lat + "  " + long)
    })

   

})
