const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
  lastModified.textContent = `Last modified: ${document.lastModified}`;
}

const temperatureElement = document.querySelector("#temperature");
const windElement = document.querySelector("#wind");
const windchillElement = document.querySelector("#windchill");

const temperature = temperatureElement ? Number(temperatureElement.textContent) : NaN;
const windSpeed = windElement ? Number(windElement.textContent) : NaN;

function calculateWindChill(tempC, windKmh) { return 13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * tempC * Math.pow(windKmh, 0.16); }

if (windchillElement) {
  if (temperature <= 10 && windSpeed > 4.8) {
    const windChill = calculateWindChill(temperature, windSpeed);
    windchillElement.textContent = `${windChill.toFixed(1)} \u00B0C`;
  } else {
    windchillElement.textContent = "N/A";
  }
}
