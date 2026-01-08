// Utility: create a day card
function createDayCard(index) {
    const wrapper = document.createElement("div");
    wrapper.className = "day-card";
    wrapper.dataset.index = index;

    wrapper.innerHTML = `
    <div class="day-header">
      <strong>Day ${index + 1}</strong>
      <button type="button" class="day-remove">Remove</button>
    </div>
    <div class="field">
      <label>Date</label>
      <input type="date" class="day-date" required />
    </div>
    <div class="field">
      <label>City</label>
      <input type="text" class="day-city" placeholder="City" />
    </div>
    <div class="field">
      <label>Activities</label>
      <textarea class="day-activities"
        placeholder="Morning: ...&#10;Afternoon: ...&#10;Evening: ..."></textarea>
    </div>
    <div class="field">
      <label>Accommodation</label>
      <input type="text" class="day-accommodation"
        placeholder="Hotel name, address, contact" />
    </div>
    <div class="actions">
      <button type="button" class="btn secondary day-preview">Preview</button>
      <button type="button" class="btn primary day-download">Download</button>
    </div>
  `;
    return wrapper;
}


const daysContainer = document.getElementById("days-container");
const addDayBtn = document.getElementById("add-day-btn");
const generatePdfBtn = document.getElementById("generate-pdf-btn");

const travelerNameEl = document.getElementById("travelerName");
const countryEl = document.getElementById("country");
const purposeEl = document.getElementById("purpose");

// Preview elements
const pdfTitleEl = document.getElementById("pdf-title");
const pdfMetaEl = document.getElementById("pdf-meta");
const pdfTableBodyEl = document.getElementById("pdf-table-body");

let dayCount = 0;

function addDay() {
    const card = createDayCard(dayCount);
    daysContainer.appendChild(card);
    dayCount++;
}

function removeDay(card) {
    daysContainer.removeChild(card);
    // Re-label remaining cards
    Array.from(daysContainer.querySelectorAll(".day-card")).forEach(
        (card, i) => {
            card.dataset.index = i;
            const label = card.querySelector(".day-header strong");
            if (label) label.textContent = `Day ${i + 1}`;
        }
    );
    dayCount = daysContainer.querySelectorAll(".day-card").length;
}

function collectFormData() {
    const days = [];
    const cards = daysContainer.querySelectorAll(".day-card");
    cards.forEach((card) => {
        days.push({
            date: card.querySelector(".day-date").value,
            city: card.querySelector(".day-city").value,
            activities: card.querySelector(".day-activities").value,
            accommodation: card.querySelector(".day-accommodation").value,
        });
    });

    return {
        travelerName: travelerNameEl.value.trim(),
        country: countryEl.value,
        purpose: purposeEl.value.trim(),
        days,
    };
}

function buildTableHeader(countryCode) {
    pdfTheadEl.innerHTML = "";
    const tr = document.createElement("tr");

    if (countryCode === "japan") {
        ["Date", "Activity Plan", "Contact", "Accommodation"].forEach((h) => {
            const th = document.createElement("th");
            th.textContent = h;
            tr.appendChild(th);
        });
    } else {
        ["Date", "City", "Activities", "Accommodation"].forEach((h) => {
            const th = document.createElement("th");
            th.textContent = h;
            tr.appendChild(th);
        });
    }
    pdfTheadEl.appendChild(tr);
}

function openPreview() {
    const data = collectFormData();
    if (!data.travelerName || !data.country || data.days.length === 0) {
        alert("Please complete traveler, country, and at least one day.");
        return;
    }
    updatePreview();
    previewOverlay.classList.remove("hidden");
}

function closePreview() {
    previewOverlay.classList.add("hidden");
}

async function downloadPdf() {
    updatePreview();

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfContent = document.querySelector(".preview-modal");

    await pdf.html(pdfContent, {
        callback: function (doc) {
            doc.save("itinerary.pdf");
        },
        margin: [20, 20, 20, 20],
        html2canvas: { scale: 0.8, useCORS: true },
    });
}


async function generatePdf() {
    // simple required checks
    if (!travelerNameEl.value.trim() || !countryEl.value) {
        alert("Please enter traveler name and select a country.");
        return;
    }
    if (!daysContainer.querySelector(".day-card")) {
        alert("Please add at least one day to your itinerary.");
        return;
    }

    updatePreview();

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");

    const pdfContent = document.getElementById("pdf-content");

    // Use jsPDF html() API with html2canvas under the hood
    await pdf.html(pdfContent, {
        callback: function (doc) {
            doc.save("itinerary.pdf");
        },
        margin: [20, 20, 20, 20],
        autoPaging: "text",
        html2canvas: {
            scale: 0.8,
            useCORS: true,
        },
    });
}

// Initial one day
addDay();

// Event listeners
addDayBtn.addEventListener("click", () => {
    addDay();
    updatePreview();
});

daysContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("day-remove")) {
        const card = e.target.closest(".day-card");
        if (card) {
            removeDay(card);
            updatePreview();
        }
    }
});

document.getElementById("itinerary-form").addEventListener("input", () => {
    updatePreview();
});

generatePdfBtn.addEventListener("click", generatePdf);
