


//--------------------API for Displaying Forecast---------------------------------------------------------------------------------
var forecast = "https://api.aerisapi.com/observations/:auto?&format=json&filter=allstations&limit=1&client_id=5MQ1RvB0ZRonDrmxEfyPq&client_secret=tvg7OeULoGZ8zMJhKD6MimPUerXrY2gli9EjtMT4";
console.log(forecast);


$.ajax({
    url: forecast,
    method: "GET"
})

    // After data comes back from the request
    .then(function (forecastResponse) {

        //console.log(queryURL);

        // console.log(response);
        // storing the data from the AJAX request in the results variable
        var displayForecast = forecastResponse.response;
        console.log(displayForecast);


        var country = displayForecast.place.country;
        var city = displayForecast.place.city;
        var state = displayForecast.place.state;
        var dewPoint = displayForecast.ob.dewpointF;
        var humidity = displayForecast.ob.humidity;
        var sunrise = displayForecast.ob.sunriseISO;
        var sunset = displayForecast.ob.sunsetISO;
        var celsius = displayForecast.ob.tempC;
        var fahrenheit = displayForecast.ob.tempF;
        var weather = displayForecast.ob.weather;
        var windGust = displayForecast.ob.windGustSpeedMPH;
        var windSpeed = displayForecast.ob.windSpeedMPH;
        var windDirection = displayForecast.ob.windDir;
        var icon = displayForecast.ob.icon;

        console.log(country);
        console.log(icon);
        console.log(windSpeed);
        console.log(city);

        $("#city").text(city);
        $("#state").text(state);
        $("#country").text(country);
        $("#dewPoint").text(dewPoint);
        $("#humidity").text(humidity);
        $("#sunrise").text(sunrise);
        $("#sunset").text(sunset);
        $("#celsius").text(celsius);
        $("#fahrenheit").text(fahrenheit);
        $("#weather").html(weather);
        $("#windGust").text(windGust);
        $("#windSpeed").text(windSpeed);
        $("#windDirection").text(windDirection);

    });

//--------------------API for Storm Tracker---------------------------------------------------------------------------------
// Adding click event listen listener to all buttons
$(document).on("click", "#track", function () {
    // Grabbing and storing the data from Hurricane tracking


    //const searchType = 'random';

    // Constructing a queryURL using the animal name
    // var queryURL = "https://api.aerisapi.com/tropicalcyclones/closest?p=chanhassen,mn&radius=50000mi&filter=all&limit=1&format=json&client_id=5MQ1RvB0ZRonDrmxEfyPq&client_secret=tvg7OeULoGZ8zMJhKD6MimPUerXrY2gli9EjtMT4";
    var queryURL = "https://api.aerisapi.com/tropicalcyclones/?&filter=all&fields=id,profile,position,track,forecast&limit=2&format=json&client_id=5MQ1RvB0ZRonDrmxEfyPq&client_secret=tvg7OeULoGZ8zMJhKD6MimPUerXrY2gli9EjtMT4";
    console.log(queryURL);

    // Performing an AJAX request with the queryURL
    $.ajax({
        url: queryURL,
        method: "GET"
    })

        // After data comes back from the request
        .then(function (response) {

            //console.log(queryURL);

            // console.log(response);
            // storing the data from the AJAX request in the results variable
            var results = response.response;
            console.log(results);

            if (results.length === 0) {
                var noStorm = "The weather is perfect around the world, no storms brewing"
                console.log(noStorm);
                $("#clear").remove();
                var noStormMessage = $("<tr id='clear'>").append(
                    $("<td colspan='6' class='tblType'>").text(noStorm)
                );
                $("#storm-table > tbody").append(noStormMessage);
            }

            // Looping through each result item
           else { 
               for (var i = 0; i < results.length; i++) 

                var current = results[i];
                var position = current.position;
                var location = position.location;
                var stormType1 = position.details.stormType;
                var stormName1 = position.details.stormName;
                var stormDirection = position.details.movement;
                var stormSpeed1 = position.details.windSpeedMPH;
                var long1 = location.coordinates[0];
                var lat1 = location.coordinates[1];


                console.log(current.profile.name);

                // Create the new row
                var newRow = $("<tr>").append(
                    $("<td class='tblType'>").text(stormType1),
                    $("<td class='tblName'>").text(stormName1),
                    $("<td class='tblMove'>").text(stormDirection.direction),
                    $("<td class='tblSpeed'>").text(stormSpeed1),
                    $("<td class='tblLong'>").text(long1),
                    $("<td class='tblLat'>").text(lat1),
                );

                

                // Append the new row to the table
                $("#storm-table > tbody").append(newRow);
                }


            });
        
        });

  // end hurricane Tracker API