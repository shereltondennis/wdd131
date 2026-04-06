const reviewCountKey = "reviewCount";

const storedCount = Number(localStorage.getItem(reviewCountKey)) || 0;
const updatedCount = storedCount + 1;

localStorage.setItem(reviewCountKey, updatedCount);

const reviewCountSpan = document.querySelector("#review-count");
if (reviewCountSpan) {
  reviewCountSpan.textContent = updatedCount;
}
