//grab api items
//1a08b567ca93f9bd01f2ce3ed7aa48ab

//http://api.openweathermap.org/data/2.5/weather?q=London&units=imperial&appid=1a08b567ca93f9bd01f2ce3ed7aa48ab

//vars to access json data lines 35 and 19
let myData;
let data2;


const currentCity = $("#top-city");
const currentDate = $("#top-date");
const currentWeatherIcon = $("#top-icon");
const currentTemo = $("#top-temp");
const currentHum = $("#top-hum");
const currentWind = $("#top-wind");
const currentUV = $("#uvindex");


//Local storage
const storedList = localStorage.getItem("list");
let cityList = storedList ? JSON.parse(storedList) : [];




function queries(city) {
    //Obtain current weather data except UV index
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=1a08b567ca93f9bd01f2ce3ed7aa48ab',
        type: "GET",
        dataType: "json",
    }).then(function (data) {
        myData = data;
        //Get latitude and longitude for each location from first API call
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;
        const latLong = "&lat=" + latitude + "&lon=" + longitude;
       
        //console.log(latitude);
        //console.log(longitude);
        //console.log(latLong);

        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/onecall?' + latLong + '&units=imperial&appid=1a08b567ca93f9bd01f2ce3ed7aa48ab',
            method: "GET",
            dataType: 'json'
        }).then(function (response) {
            //console.log(response);
            //console.log(data);
            //data2 = response;

            response.daily.slice(0, 5).forEach((day, i) => {
                const temp = day.temp.max;
                const hum = day.humidity;
                const newDate = new Date(day.dt * 1000);

                const card = $($(".card").get(i));
                
                card.find(".temp").text("Temp: " + temp + " F");

                card.find(".card-date").text(newDate.toDateString().substring(0, 15));

               
            });
        })

    });//end of initial query function

}



//Limit characters to letters only
function lettersValidate(key) {
    var keycode = (key.which) ? key.which : key.keyCode;

    if ((keycode > 64 && keycode < 91) || (keycode > 96 && keycode < 123) || keycode === 32)  
    {     
           return true;    
    }
    else
    {
        return false;
    }
}


//Search functionality

$("#search-btn").click(function (e) {
    e.stopPropagation();
    e.preventDefault();

    const inputVal = $("#search-input").val();

    if (!inputVal || inputVal.length === 1) {
        //Throw error message if user enters invalid city
        $( ".invalid-feedback").show();
        return;
    }

    //Pass the user input into API search function
    queries(inputVal);

    //Push the input into local storage
    cityList.push(inputVal);
    localStorage.setItem("list", JSON.stringify(cityList));

    $(".list-group").append(`<li class="list-group-item list-group-item-warning">${inputVal}</li>`);

});

cityList.forEach((citySearch) => {
    $(".list-group").append(`<li class="list-group-item list-group-item-warning">${citySearch}</li>`);
    

});

