let selectedPrice = 0;

function toggleMode(){document.body.classList.toggle("dark");}

function toggleMenu(){
let nav=document.getElementById("navLinks");
nav.style.display = nav.style.display === "flex" ? "none" : "flex";
}

async function loadDestinations(){
let container = document.getElementById("destinations");
if(!container) return;

try{
let res = await fetch("https://restcountries.com/v3.1/all");
let data = await res.json();

container.innerHTML = data.slice(0,12).map(country => `
<div class="card" onclick="showMap('${country.name.common}')">
<img src="${country.flags.png}">
<h3>${country.name.common}</h3>
<p>Region: ${country.region}</p>
<p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
</div>
`).join("");

}catch(err){
container.innerHTML = "Failed to load destinations";
}
}

loadDestinations();

function showMap(place){
let mapSection = document.getElementById("map");
if(mapSection){
mapSection.innerHTML = `
<input type="text" id="source" placeholder="Enter your location" style="width:80%;padding:10px;margin:10px;">
<button onclick="getDirections('${place}')">Get Directions</button>
<div id="mapFrame"></div>
`;
}
}

function getDirections(destination){
let source = document.getElementById("source").value;
let mode = document.getElementById("mode").value;

if(!source){
alert("Please enter your location");
return;
}

// Travel mode mapping
let travelMode = "driving";
if(mode === "walking") travelMode = "walking";
if(mode === "train") travelMode = "transit";

// Show map with route
let mapHTML = `
<iframe
width="100%"
height="400"
style="border:0"
loading="lazy"
allowfullscreen
src="https://www.google.com/maps?q=${source}+to+${destination}&output=embed">
</iframe>`;

// Dummy time & distance (since embed doesn't return real data)
let distance = (Math.random()*500+50).toFixed(0);
let time = (distance/50).toFixed(1);

// ================= ADVANCED CAB PRICING (OLA/UBER-LIKE) =================
// Base pricing components
let baseFare = 50;          // base charge
let perKmRate = 12;         // ₹ per km
let perMinRate = 2;         // ₹ per minute

// Convert hours to minutes for pricing
let timeMinutes = time * 60;

// Surge pricing (random demo between 1x - 2x)
let surge = (Math.random() * 1 + 1).toFixed(2);

// Mode adjustments
let modeFactor = 1;
if(mode === "car") modeFactor = 1;
if(mode === "train") modeFactor = 0.7;
if(mode === "walking") modeFactor = 0;

// Final fare calculation
let fare = mode === "walking" ? 0 : (
  (baseFare + (distance * perKmRate) + (timeMinutes * perMinRate)) * surge * modeFactor
).toFixed(0);

let infoHTML = `
<div class="route-info">
<p>🚗 Mode: ${mode}</p>
<p>📏 Distance: ~${distance} km</p>
<p>⏱️ Estimated Time: ~${time} hrs</p>
<p>⚡ Surge: ${surge}x</p>
<p>💰 Estimated Fare: ${mode === "walking" ? "Free" : "₹" + fare}</p>
</div>`;;

document.getElementById("mapFrame").innerHTML = infoHTML + mapHTML;
}

document.getElementById("mapFrame").innerHTML = `
<iframe
width="100%"
height="400"
style="border:0"
loading="lazy"
allowfullscreen
src="https://www.google.com/maps?q=${source}+to+${destination}&output=embed">
</iframe>`;


// ================= LOGIN SYSTEM =================
function signup(){
let user=document.getElementById("signupUser").value;
let pass=document.getElementById("signupPass").value;
localStorage.setItem("user",user);
localStorage.setItem("pass",pass);
alert("Signup Successful");
}

function login(){
let user=document.getElementById("loginUser").value;
let pass=document.getElementById("loginPass").value;
if(user===localStorage.getItem("user") && pass===localStorage.getItem("pass")){
alert("Login Successful");
window.location.href="home.html";
}else{alert("Invalid Credentials");}
}

// ================= BOOKING =================
function selectPackage(price){selectedPrice=price;alert("Package Selected");}

function calculateTotal(){
let days=document.getElementById("days").value;
let total=days*selectedPrice;
document.getElementById("total").innerText="Total: ₹"+total;
}

function bookNow(){alert("Booking Confirmed 🎉");}

const searchInput = document.getElementById("searchInput");
const cards = document.querySelectorAll(".card");
let currentRegion = "all";

searchInput.addEventListener("keyup", filterCards);

function filterRegion(region) {
  currentRegion = region;
  filterCards();
}

function filterCards() {
  let searchValue = searchInput.value.toLowerCase();
  let visible = 0;

  cards.forEach(card => {
    let name = card.dataset.name;
    let region = card.dataset.region;

    if ((name.includes(searchValue)) &&
        (currentRegion === "all" || region === currentRegion)) {
      card.style.display = "block";
      visible++;
    } else {
      card.style.display = "none";
    }
  });

  document.getElementById("noResult").style.display =
    visible === 0 ? "block" : "none";
}

// MODAL DATA
const countryDetails = {
  India: "Rich culture, Taj Mahal, street food, best time Oct-Mar.",
  Japan: "Famous for technology, anime, cherry blossoms.",
  France: "Eiffel Tower, fashion, romantic destinations.",
  USA: "Modern cities, Hollywood, diverse travel experiences."
};

// OPEN MODAL
function openModal(country) {
  document.getElementById("modal").style.display = "flex";
  document.getElementById("countryName").innerText = country;
  document.getElementById("countryInfo").innerText = countryDetails[country];
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

let currentCountry = "";

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function openModal(country) {
  currentCountry = country;

  document.getElementById("modal").style.display = "flex";
  document.getElementById("countryName").innerText = country;
  document.getElementById("countryInfo").innerText = countryDetails[country];

  updateFavButton();
}

function toggleCardFavorite(event, country) {
  event.stopPropagation(); 
  if (favorites.includes(country)) {
    favorites = favorites.filter(c => c !== country);
  } else {
    favorites.push(country);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  updateHearts();
}

updateHearts();



function openBooking(country) {
  document.getElementById("bookingModal").style.display = "flex";
  document.getElementById("countryName").innerText = "Book Trip to " + country;
}

function closeBooking() {
  document.getElementById("bookingModal").style.display = "none";
}

function confirmPayment() {
  alert("Payment Successful! 🎉");
  closeBooking();
}



function goToPayment(country) {
  window.location.href = "payment.html?country=" + country;
}




function filterRegion(region) {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const cardRegion = card.getAttribute("data-region");

    if (region === "all" || cardRegion === region) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}




  const searchInput = document.getElementById('searchInput');
  const cards = document.querySelectorAll('.card');

  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();

    cards.forEach(card => {
      const countryName = card.getAttribute('data-name').toLowerCase();
      
    
      if (countryName.includes(value)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });



  const searchBox = document.getElementById("searchBox");
const cards = document.querySelectorAll(".card");

// 🔍 SEARCH
searchBox.addEventListener("keyup", function () {
    let value = searchBox.value.toLowerCase();

    cards.forEach(card => {
        let name = card.dataset.name.toLowerCase();

        if (name.includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

// 🌍 REGION FILTER
function filterRegion(region) {
    cards.forEach(card => {
        if (region === "all" || card.dataset.region === region) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}