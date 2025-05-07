// Limit date input to today ~ 3 days later
window.onload = function () {
    const dateInput = document.getElementById('dateInput');
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 3);
  
    const toISOStringDate = (d) => d.toISOString().split('T')[0];
    dateInput.min = toISOStringDate(today);
    dateInput.max = toISOStringDate(maxDate);
  };
  
  let outfitSuggestions = {};
  
  // Load outfits.json
  fetch('outfits.json')
    .then(res => res.json())
    .then(data => {
      outfitSuggestions = data;
    })
    .catch(err => {
      console.error("Failed to load outfits.json:", err);
    });
  
  async function getOutfit() {
    document.getElementById('emoji-character').innerHTML = "";
    const city = document.getElementById('cityInput').value;
    const date = document.getElementById('dateInput').value;
    const apiKey = 'b23df3c70b5eb4d34b557c888b04dcce';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=en`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const selected = data.list.find(item => item.dt_txt.startsWith(date));
      if (!selected) {
        document.getElementById('result').innerText =
          "No forecast available for this date.";
        return;
      }

      const weather = selected.weather[0].main.toLowerCase();
      const temp = selected.main.temp;

      let key;
      if (temp <= 5) key = "cold";
      else if (temp >= 28) key = "hot";
      else if (weather.includes("rain")) key = "rainy";
      else if (weather.includes("cloud")) key = "cloudy";
      else if (weather.includes("snow")) key = "snow";
      else key = "sunny";

      const outfit = outfitSuggestions[key];
      const weatherDescription = selected.weather[0].description;

      document.getElementById('result').innerText =
        `Weather: ${weatherDescription}, ${temp}°C\nSuggested Outfit: ${outfit.style}`;
      document.getElementById('result').dataset.weatherKey = key;
      document.getElementById('emoji-character').innerHTML = `<div style="font-size: 3.5rem; margin-top: 10px;">${outfit.emoji}</div>`;
    } catch (error) {
      document.getElementById('result').innerText =
        "Failed to fetch weather data. Please check your city spelling or try again later.";
      console.error(error);
    }
  }