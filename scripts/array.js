const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/aba-nigeria-temple/aba-nigeria-temple-5087-main.jpg"
  },
  {
    templeName: "abidjan Ivory Coast",
    location: "Abidjan, Ivory Coast",
    dedicated: "2025, May, 25",
    area: 74792,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/abidjan-ivory-coast-temple/abidjan-ivory-coast-temple-58993-main.jpg"
  },
  {
    templeName: "Accra Ghana",
    location: "Accra, Ghana",
    dedicated: "2004, June, 11",
    area: 96630,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/accra-ghana-temple/accra-ghana-temple-13760-main.jpg"
  },
  {
    templeName: "Adelaide Temple",
    location: "Marden, South Australia",
    dedicated: "2000, June, 15",
    area: 6861,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/adelaide-australia-temple/adelaide-australia-temple-4359-main.jpg"
  },
  {
    templeName: "Bern Switzerland Temple",
    location: "bern, Switzerland",
    dedicated: "11–15 September 1955",
    area: 35546,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/bern-switzerland-temple/bern-switzerland-temple-54641-main.jpg"
  },
  {
    templeName: "Brisbane Australia Temple",
    location: "Brisbane, Australia",
    dedicated: " 15 June 2003",
    area:  10700,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/brisbane-australia-temple/brisbane-australia-temple-62132-main.jpg"
  },
  {
    templeName: "Lagos Nigeria Temple",
    location: "Lagos, Nigeria",
    dedicated: "2025, May, 10",
    area: 116642,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/lagos-nigeria-temple/lagos-nigeria-temple-58577-main.jpg"
  },
  {
    templeName: "Modesto California Temple",
    location: "Modesto, California, United States",
    dedicated: "1893, April, 6",
    area: 382207,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/modesto-california-temple/modesto-california-temple-32830-main.jpg"
  },
  {
    templeName: "Laie Hawaii",
    location: "Laie, Hawaii, United States",
    dedicated: "1919, November, 27",
    area: 47224,
    imageUrl:
    "https://churchofjesuschristtemples.org/assets/img/temples/laie-hawaii-temple/laie-hawaii-temple-7370-main.jpg"
  },
  
];

const templeCards = document.querySelector("#temple-cards");

const displayTemples = (templeList) => {
  if (!templeCards) {
    return;
  }

  templeCards.innerHTML = "";

  templeList.forEach((temple) => {
    const card = document.createElement("figure");
    card.classList.add("temple-card");

    const image = document.createElement("img");
    image.src = temple.imageUrl;
    image.alt = temple.templeName;
    image.loading = "lazy";

    const caption = document.createElement("figcaption");

    const name = document.createElement("h2");
    name.textContent = temple.templeName;

    const location = document.createElement("p");
    location.textContent = `Location: ${temple.location}`;

    const dedicated = document.createElement("p");
    dedicated.textContent = `Dedicated: ${temple.dedicated}`;

    const area = document.createElement("p");
    area.textContent = `Area: ${temple.area.toLocaleString()} sq ft`;

    caption.append(name, location, dedicated, area);
    card.append(image, caption);
    templeCards.appendChild(card);
  });
};

displayTemples(temples);
