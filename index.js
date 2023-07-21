const userTab = document.querySelector("[data-userWeather]");    
const searchTab = document.querySelector("[data-searchWeather]");    
const userContainer = document.querySelector(".weather-container"); 

const grantAcessContainer = document.querySelector(".grant-location-container");    
const searchForm = document.querySelector("[data-searchForm]");    
const loadingScreen = document.querySelector(".loading-container");    
const userInfoContainer = document.querySelector(".user-info-container");    

//initially variables

let currentTab = userTab;
const API_KEY = "2a367567648844e5444bc3c5e959f64b"; 
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab) {
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            //if search form is invisible , then make it visible
          userInfoContainer.classList.remove("active");
          grantAcessContainer.classList.remove("active");
          searchForm.classList.add("active");
        }
        else{
            // pehle search tab par tha ab weather tab visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");   
            //now I am in weather tab , then display weather tab so check local storage first
            //for coordinates, if we have saved from there  
            getfromSessionStorage();
        }  
    }
}

userTab.addEventListener("click" , () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
})

searchTab.addEventListener("click" , () => {
    //pass clicked tab as input parameter
    switchTab(searchTab);
})

//check if coordinates are already present in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates) {
    // agar local coordinates nhi mile 
    grantAcessContainer.classList.add("active");
  }
  else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grantContainer invisible
    grantAcessContainer.classList.remove("active");
    //make loader visible 
    loadingScreen.classList.add("active");

    //API CALL
    try{
       const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );  
       const data = await response.json();

       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
       renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //Hw
         loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo) {
    // first we have to fetch the element

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humdity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weather object and put in UI 
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;


}

function getlocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //hw - show an alert for no geolocation support available
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat : position.coords.latitude,
        lon: position.coords.longitude,
    }
    
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getlocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if(cityName === "")
     return;
    else
      fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
   loadingScreen.classList.add("active");
   userInfoContainer.classList.remove("active");
   grantAcessContainer.classList.remove("active");

   try{
       const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );      
       const data = await response.json();
       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active"); 
       renderWeatherInfo(data);
    }
   catch(err) {
     //hw   
   }
}