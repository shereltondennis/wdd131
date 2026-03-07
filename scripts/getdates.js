const yearSpan = document.querySelector("#currentyear");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

const lastModifiedParagraph = document.querySelector("#lastModified");
if (lastModifiedParagraph) {
    lastModifiedParagraph.textContent = `Last Modification: ${document.lastModified}`;
}
