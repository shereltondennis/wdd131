const products = [
  {
    id: "fc-1888",
    name: "Flux Capacitor",
  },
  {
    id: "fc-2050",
    name: "Power Laces",
  },
  {
    id: "fs-1987",
    name: "Time Circuits",
  },
  {
    id: "ac-2000",
    name: "Low Voltage Reactor",
  },
  {
    id: "jj-1969",
    name: "Warp Drive",
  },
  {
    id: "bd-1995",
    name: "Hoverboard",
  },
];

const productSelect = document.querySelector("#productName");

if (productSelect) {
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    productSelect.appendChild(option);
  });
}
