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
    name: `Cassava Fufu and Pepper Soup`,
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
  cart: `liberianDishesCart`,
  orders: `liberianDishesOrders`,
  bookings: `liberianDishesBookings`,
};

const currencyFormatter = new Intl.NumberFormat(`en-US`, {
  style: `currency`,
  currency: `USD`,
});

const readStorageJson = (key, fallback) => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    return fallback;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
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

  visitEl.textContent = message;
};

const loadFavorites = () => {
  const saved = readStorageJson(storageKeys.favorites, []);
  return Array.isArray(saved) ? saved : [];
};

const saveFavorites = (favorites) => {
  localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
};

const loadCart = () => {
  const saved = readStorageJson(storageKeys.cart, {});
  if (!saved || Array.isArray(saved) || typeof saved !== `object`) {
    return {};
  }

  const cleanCart = {};
  Object.keys(saved).forEach((dishId) => {
    const quantity = Number.parseInt(saved[dishId], 10);
    if (quantity > 0) {
      cleanCart[dishId] = quantity;
    }
  });
  return cleanCart;
};

const saveCart = (cart) => {
  localStorage.setItem(storageKeys.cart, JSON.stringify(cart));
};

const loadOrders = () => {
  const saved = readStorageJson(storageKeys.orders, []);
  return Array.isArray(saved) ? saved : [];
};

const saveOrders = (orders) => {
  localStorage.setItem(storageKeys.orders, JSON.stringify(orders));
};

const loadBookings = () => {
  const saved = readStorageJson(storageKeys.bookings, []);
  return Array.isArray(saved) ? saved : [];
};

const saveBookings = (bookings) => {
  localStorage.setItem(storageKeys.bookings, JSON.stringify(bookings));
};

const getDishById = (dishId) => dishes.find((dish) => dish.id === dishId);

const formatCurrency = (value) => currencyFormatter.format(value);

const getCartItems = () => {
  const cart = loadCart();
  return Object.entries(cart)
    .map(([dishId, quantity]) => {
      const dish = getDishById(dishId);
      if (!dish) {
        return null;
      }
      return {
        ...dish,
        quantity,
        lineTotal: dish.price * quantity,
      };
    })
    .filter(Boolean);
};

const getCartCount = (items) => items.reduce((count, item) => count + item.quantity, 0);

const getCartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const serviceFee = subtotal > 0 ? 1.5 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + serviceFee + tax;

  return {
    subtotal,
    serviceFee,
    tax,
    total,
  };
};

const renderDishes = () => {
  const grid = document.querySelector(`#dishGrid`);
  if (!grid) {
    return;
  }

  const preference = localStorage.getItem(storageKeys.spice) || `all`;
  const favorites = loadFavorites();
  const cart = loadCart();

  const filteredDishes = preference === `all`
    ? dishes
    : dishes.filter((dish) => dish.spice === preference);

  if (!filteredDishes.length) {
    grid.innerHTML = `
      <article class="card">
        <h4>No dishes match this spice preference.</h4>
        <p class="muted-text">Try another spice level to see more options.</p>
      </article>
    `;
    return;
  }

  grid.innerHTML = filteredDishes.map((dish) => {
    const isFavorite = favorites.includes(dish.id);
    const inCart = cart[dish.id] || 0;
    return `
      <article class="card">
        <img src="${dish.image}" alt="${dish.alt}" width="420" height="260" loading="lazy">
        <div>
          <span class="badge">${dish.spice} spice</span>
        </div>
        <h4>${dish.name}</h4>
        <p>${dish.description}</p>
        <p><strong>Price:</strong> ${formatCurrency(dish.price)} per plate</p>
        <p class="muted-text">In cart: ${inCart}</p>
        <div class="card-actions">
          <button class="button primary" type="button" data-add-cart="${dish.id}">
            Add to cart
          </button>
          <button class="button secondary" type="button" data-favorite="${dish.id}">
            ${isFavorite ? `Saved Favorite` : `Save Favorite`}
          </button>
        </div>
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

  list.innerHTML = filtered.map((vendor) => `
    <li class="card">
      <h4>${vendor.name}</h4>
      <p><strong>Area:</strong> ${vendor.area}</p>
      <p>${vendor.highlight}</p>
      <p class="badge">${vendor.price} budget</p>
    </li>
  `).join(``);
};

const renderLastOrder = () => {
  const lastOrderEl = document.querySelector(`#lastOrder`);
  if (!lastOrderEl) {
    return;
  }

  const orders = loadOrders();
  if (!orders.length) {
    lastOrderEl.textContent = `No orders yet.`;
    return;
  }

  const latest = orders[orders.length - 1];
  const placedAt = new Date(latest.placedAt).toLocaleString(`en-US`, {
    dateStyle: `medium`,
    timeStyle: `short`,
  });
  lastOrderEl.textContent = `Last order ${latest.id}: ${latest.itemCount} item(s), total ${formatCurrency(latest.total)} on ${placedAt}.`;
};

const renderBookingDishOptions = () => {
  const optionsEl = document.querySelector(`#bookingDishOptions`);
  if (!optionsEl) {
    return;
  }

  optionsEl.innerHTML = dishes.map((dish) => `
    <label class="dish-option">
      <input type="checkbox" name="bookingDish" value="${dish.id}">
      <span>${dish.name}</span>
    </label>
  `).join(``);
};

const renderLastBooking = () => {
  const lastBookingEl = document.querySelector(`#lastBooking`);
  if (!lastBookingEl) {
    return;
  }

  const bookings = loadBookings();
  if (!bookings.length) {
    lastBookingEl.textContent = `No bookings yet.`;
    return;
  }

  const latest = bookings[bookings.length - 1];
  const dishNames = latest.dishes.map((dishId) => getDishById(dishId)?.name || dishId).join(`, `);
  lastBookingEl.textContent = `Last booking ${latest.id}: ${latest.date} at ${latest.time}, ${latest.plates} plate(s) for ${dishNames}.`;
};

const renderCart = () => {
  const cartItemsEl = document.querySelector(`#cartItems`);
  const cartSummaryEl = document.querySelector(`#cartSummary`);
  const cartCountEl = document.querySelector(`#cartCount`);
  const checkoutButton = document.querySelector(`#checkoutButton`);

  if (!cartItemsEl && !cartSummaryEl && !cartCountEl && !checkoutButton) {
    return;
  }

  const items = getCartItems();
  const itemCount = getCartCount(items);
  const totals = getCartTotals(items);

  if (cartCountEl) {
    cartCountEl.textContent = `${itemCount} item${itemCount === 1 ? `` : `s`}`;
  }

  if (cartItemsEl) {
    if (!itemCount) {
      cartItemsEl.innerHTML = `<li class="cart-empty">Your cart is empty. Add a dish to start an order.</li>`;
    } else {
      cartItemsEl.innerHTML = items.map((item) => `
        <li class="cart-item">
          <div class="cart-item-head">
            <h4>${item.name}</h4>
            <p class="muted-text">${formatCurrency(item.price)} each</p>
          </div>
          <div class="cart-item-controls">
            <button type="button" class="icon-button" data-cart-change="${item.id}" data-delta="-1" aria-label="Decrease ${item.name} quantity">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button type="button" class="icon-button" data-cart-change="${item.id}" data-delta="1" aria-label="Increase ${item.name} quantity">+</button>
            <button type="button" class="icon-button remove" data-remove-cart="${item.id}" aria-label="Remove ${item.name}">x</button>
          </div>
          <p class="cart-line-total">${formatCurrency(item.lineTotal)}</p>
        </li>
      `).join(``);
    }
  }

  if (cartSummaryEl) {
    cartSummaryEl.innerHTML = `
      <p><span>Subtotal</span><strong>${formatCurrency(totals.subtotal)}</strong></p>
      <p><span>Service fee</span><strong>${formatCurrency(totals.serviceFee)}</strong></p>
      <p><span>Tax (10%)</span><strong>${formatCurrency(totals.tax)}</strong></p>
      <p class="cart-grand-total"><span>Total</span><strong>${formatCurrency(totals.total)}</strong></p>
    `;
  }

  if (checkoutButton) {
    checkoutButton.disabled = itemCount === 0;
  }

  renderLastOrder();
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
    localStorage.setItem(storageKeys.spice, choice);
    note.textContent = choice === `all`
      ? `Showing every dish on the menu.`
      : `Showing dishes with a ${choice} spice level.`;
    renderDishes();
  });
};

const bindDishActions = () => {
  const grid = document.querySelector(`#dishGrid`);
  if (!grid) {
    return;
  }

  grid.addEventListener(`click`, (event) => {
    const addButton = event.target.closest(`button[data-add-cart]`);
    if (addButton) {
      const dishId = addButton.dataset.addCart;
      if (!getDishById(dishId)) {
        return;
      }

      const cart = loadCart();
      cart[dishId] = (cart[dishId] || 0) + 1;
      saveCart(cart);
      renderDishes();
      renderCart();
      return;
    }

    const favoriteButton = event.target.closest(`button[data-favorite]`);
    if (!favoriteButton) {
      return;
    }

    const dishId = favoriteButton.dataset.favorite;
    const favorites = loadFavorites();
    const exists = favorites.includes(dishId);
    const updated = exists
      ? favorites.filter((item) => item !== dishId)
      : [...favorites, dishId];

    saveFavorites(updated);
    renderDishes();
  });
};

const bindCartControls = () => {
  const orderPanel = document.querySelector(`#orderPanel`);
  if (!orderPanel) {
    return;
  }

  orderPanel.addEventListener(`click`, (event) => {
    const changeButton = event.target.closest(`button[data-cart-change]`);
    if (changeButton) {
      const dishId = changeButton.dataset.cartChange;
      const delta = Number.parseInt(changeButton.dataset.delta || `0`, 10);
      if (!getDishById(dishId)) {
        return;
      }

      const cart = loadCart();
      const nextQuantity = Math.max(0, (cart[dishId] || 0) + delta);
      if (nextQuantity === 0) {
        delete cart[dishId];
      } else {
        cart[dishId] = nextQuantity;
      }

      saveCart(cart);
      renderDishes();
      renderCart();
      return;
    }

    const removeButton = event.target.closest(`button[data-remove-cart]`);
    if (!removeButton) {
      return;
    }

    const dishId = removeButton.dataset.removeCart;
    const cart = loadCart();
    delete cart[dishId];
    saveCart(cart);
    renderDishes();
    renderCart();
  });
};

const bindCheckoutForm = () => {
  const form = document.querySelector(`#checkoutForm`);
  const status = document.querySelector(`#checkoutStatus`);
  if (!form || !status) {
    return;
  }

  form.addEventListener(`submit`, (event) => {
    event.preventDefault();

    const items = getCartItems();
    if (!items.length) {
      status.textContent = `Your cart is empty. Add at least one meal before checkout.`;
      return;
    }

    const formData = new FormData(form);
    const customer = {
      name: `${formData.get(`orderName`) || ``}`.trim(),
      phone: `${formData.get(`orderPhone`) || ``}`.trim(),
      pickupTime: `${formData.get(`pickupTime`) || ``}`.trim(),
      pickupSpot: `${formData.get(`pickupSpot`) || ``}`.trim(),
    };

    const totals = getCartTotals(items);
    const orderId = `LD-${Date.now().toString().slice(-6)}`;
    const order = {
      id: orderId,
      placedAt: new Date().toISOString(),
      itemCount: getCartCount(items),
      total: totals.total,
      customer,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.lineTotal,
      })),
    };

    const orders = loadOrders();
    saveOrders([...orders, order]);
    saveCart({});

    status.textContent = `Order ${order.id} confirmed for ${customer.name}. Pickup at ${customer.pickupTime}. Total ${formatCurrency(totals.total)}.`;
    form.reset();
    renderDishes();
    renderCart();
  });
};

const bindBookingForm = () => {
  const form = document.querySelector(`#bookingForm`);
  const status = document.querySelector(`#bookingStatus`);
  const dateInput = document.querySelector(`#bookingDate`);
  if (!form || !status || !dateInput) {
    return;
  }

  const today = new Date().toISOString().split(`T`)[0];
  dateInput.min = today;

  form.addEventListener(`submit`, (event) => {
    event.preventDefault();

    const selectedDishes = Array.from(
      form.querySelectorAll(`input[name="bookingDish"]:checked`),
      (input) => input.value,
    );

    if (!selectedDishes.length) {
      status.textContent = `Select at least one dish to complete a booking.`;
      return;
    }

    const formData = new FormData(form);
    const bookingDate = `${formData.get(`bookingDate`) || ``}`.trim();
    const bookingTime = `${formData.get(`bookingTime`) || ``}`.trim();
    if (bookingDate < today) {
      status.textContent = `Booking date must be today or later.`;
      return;
    }

    const booking = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      client: `${formData.get(`bookingName`) || ``}`.trim(),
      phone: `${formData.get(`bookingPhone`) || ``}`.trim(),
      plates: Number.parseInt(`${formData.get(`bookingGuests`) || `1`}`, 10) || 1,
      date: bookingDate,
      time: bookingTime,
      dishes: selectedDishes,
      notes: `${formData.get(`bookingNotes`) || ``}`.trim(),
    };

    const bookings = loadBookings();
    saveBookings([...bookings, booking]);
    status.textContent = `Booking ${booking.id} saved for ${booking.client} on ${booking.date} at ${booking.time}.`;
    form.reset();
    dateInput.min = today;
    renderLastBooking();
  });
};

const bindVendorFilter = () => {
  const filter = document.querySelector(`#priceFilter`);
  if (!filter) {
    return;
  }

  filter.addEventListener(`change`, renderVendors);
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
  bindDishActions();
  renderVendors();
  bindVendorFilter();
  renderBookingDishOptions();
  renderCart();
  bindCartControls();
  bindCheckoutForm();
  bindBookingForm();
  renderLastBooking();
  bindContactForm();
};

document.addEventListener(`DOMContentLoaded`, init);
