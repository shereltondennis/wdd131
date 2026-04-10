const dishes = [
  {
    id: `jollof`,
    name: `Liberian Jollof Rice`,
    description: `Smoky rice cooked with tomato, peppers, and a touch of dried fish for depth.`,
    spice: `medium`,
    price: 4,
    image: `images/liberian-ollof-rice2.png`,
    alt: `Bowl of jollof rice with peppers`,
  },
  {
    id: `palava`,
    name: `Palava Sauce`,
    description: `Leafy greens simmered with palm oil and protein, served over rice.`,
    spice: `mild`,
    price: 5,
    image: `images/palava-souce1.png`,
    alt: `Serving of palava sauce with rice`,
  },
  {
    id: `fufu`,
    name: `Cassava Fufu & Pepper Soup`,
    description: `Soft fufu paired with a bright, gingery broth and tender fish.`,
    spice: `hot`,
    price: 6,
    image: `images/liberia--cassava-ufu-pepper-soup%20(3).jpg`,
    alt: `Fufu with pepper soup in a bowl`,
  },
  {
    id: `grilled`,
    name: `Grilled Tilapia`,
    description: `Char-grilled whole fish with lime and a side of crisp salad.`,
    spice: `mild`,
    price: 7,
    image: `images/liberian-fish.jpg`,
    alt: `Grilled fish on a platter`,
  },
];

const vendors = [
  {
    name: `Waterside Grill Spot`,
    area: `Sinkor Beach`,
    highlight: `Known for grilled fish and fresh ginger juice.`,
    price: `$$`,
  },
  {
    name: `Red Palm Market`,
    area: `Duala Market`,
    highlight: `Family stall serving palava sauce all day.`,
    price: `$`,
  },
  {
    name: `City Bowl Express`,
    area: `Broad Street`,
    highlight: `Quick-service jollof bowls with add-on plantain.`,
    price: `$`,
  },
  {
    name: `Evening Pepper Corner`,
    area: `Paynesville`,
    highlight: `Late-night pepper soup and fufu spot.`,
    price: `$$`,
  },
];

const storageKeys = {
  favorites: `liberianDishesFavorites`,
  spice: `liberianDishesSpice`,
  visits: `liberianDishesVisits`,
  contact: `liberianDishesContact`,
};

const setFooterDates = () => {
  const yearSpan = document.querySelector(`#currentyear`);
  const modifiedSpan = document.querySelector(`#lastModified`);

  if (yearSpan) {
    yearSpan.textContent = `${new Date().getFullYear()}`;
  }

  if (modifiedSpan) {
    modifiedSpan.textContent = `${document.lastModified}`;
  }
};

const updateVisitCount = () => {
  const visitEl = document.querySelector(`#visitCount`);
  if (!visitEl) {
    return;
  }

  const stored = Number.parseInt(localStorage.getItem(storageKeys.visits) || `0`, 10);
  const updated = stored + 1;
  localStorage.setItem(storageKeys.visits, `${updated}`);

  const message = updated === 1
    ? `Welcome! This is your first visit to Liberian Dishes.`
    : `Welcome back! You have visited ${updated} times.`;

  visitEl.textContent = `${message}`;
};

const loadFavorites = () => {
  const stored = localStorage.getItem(storageKeys.favorites);
  if (!stored) {
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveFavorites = (favorites) => {
  localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
};

const renderDishes = () => {
  const grid = document.querySelector(`#dishGrid`);
  if (!grid) {
    return;
  }

  const preference = localStorage.getItem(storageKeys.spice) || `all`;
  const favorites = loadFavorites();

  const filtered = preference === `all`
    ? dishes
    : dishes.filter((dish) => dish.spice === preference);

  grid.innerHTML = filtered.map((dish) => {
    const isFavorite = favorites.includes(dish.id);
    return `
      <article class="card">
        <img src="${dish.image}" alt="${dish.alt}" width="420" height="260" loading="lazy">
        <div>
          <span class="badge">${dish.spice} spice</span>
        </div>
        <h4>${dish.name}</h4>
        <p>${dish.description}</p>
        <p><strong>Avg. price:</strong> $${dish.price}</p>
        <button class="button secondary" data-favorite="${dish.id}">
          ${isFavorite ? `Saved Favorite` : `Save as Favorite`}
        </button>
      </article>
    `;
  }).join(``);
};

const renderVendors = () => {
  const list = document.querySelector(`#vendorList`);
  if (!list) {
    return;
  }

  const filterSelect = document.querySelector(`#priceFilter`);
  const value = filterSelect ? filterSelect.value : `all`;

  const filtered = value === `all`
    ? vendors
    : vendors.filter((vendor) => vendor.price === value);

  list.innerHTML = filtered.map((vendor) => {
    return `
      <li class="card">
        <h4>${vendor.name}</h4>
        <p><strong>Area:</strong> ${vendor.area}</p>
        <p>${vendor.highlight}</p>
        <p class="badge">${vendor.price} budget</p>
      </li>
    `;
  }).join(``);
};

const bindPreferenceControls = () => {
  const select = document.querySelector(`#spicePreference`);
  const note = document.querySelector(`#spiceNote`);

  if (!select || !note) {
    return;
  }

  const stored = localStorage.getItem(storageKeys.spice) || `all`;
  select.value = stored;

  note.textContent = stored === `all`
    ? `Showing every dish on the menu.`
    : `Showing dishes with a ${stored} spice level.`;

  select.addEventListener(`change`, () => {
    const choice = select.value;
    localStorage.setItem(storageKeys.spice, `${choice}`);
    note.textContent = choice === `all`
      ? `Showing every dish on the menu.`
      : `Showing dishes with a ${choice} spice level.`;
    renderDishes();
  });
};

const bindFavoriteButtons = () => {
  const grid = document.querySelector(`#dishGrid`);
  if (!grid) {
    return;
  }

  grid.addEventListener(`click`, (event) => {
    const button = event.target.closest(`button[data-favorite]`);
    if (!button) {
      return;
    }

    const id = button.dataset.favorite;
    const favorites = loadFavorites();
    const exists = favorites.includes(id);

    const updated = exists
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];

    saveFavorites(updated);
    renderDishes();
  });
};

const bindVendorFilter = () => {
  const filter = document.querySelector(`#priceFilter`);
  if (!filter) {
    return;
  }

  filter.addEventListener(`change`, () => {
    renderVendors();
  });
};

const bindContactForm = () => {
  const form = document.querySelector(`#contactForm`);
  const status = document.querySelector(`#formStatus`);
  if (!form || !status) {
    return;
  }

  form.addEventListener(`submit`, (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get(`fullName`),
      email: formData.get(`email`),
      location: formData.get(`location`),
      spice: formData.get(`spice`),
      request: formData.get(`request`),
      updates: formData.get(`updates`) === `on`,
    };

    localStorage.setItem(storageKeys.contact, JSON.stringify(data));

    status.textContent = `Thanks ${data.name}! We will reply to ${data.email} with recommendations for ${data.spice} dishes.`;
    form.reset();
  });
};

const init = () => {
  setFooterDates();
  updateVisitCount();
  bindPreferenceControls();
  renderDishes();
  bindFavoriteButtons();
  renderVendors();
  bindVendorFilter();
  bindContactForm();
};

document.addEventListener(`DOMContentLoaded`, init);
