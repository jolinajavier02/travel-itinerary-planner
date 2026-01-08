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

function updatePreview() {
    const data = collectFormData();

    // Title based on country/template
    const templateName = (() => {
        switch (data.country) {
            case "schengen":
                return "Schengen Visa Travel Itinerary";
            case "japan":
                return "Japan Visa Travel Itinerary";
            case "uk":
                return "UK Visitor Visa Travel Itinerary";
            case "usa":
                return "US Tourist Visa Travel Itinerary";
            case "personal":
                return "Personal Travel Itinerary";
            default:
                return "Travel Itinerary";
        }
    })();

    pdfTitleEl.textContent = templateName;

    const namePart = data.travelerName ? `for ${data.travelerName}` : "";
    const purposePart = data.purpose ? ` – Purpose: ${data.purpose}` : "";

    pdfMetaEl.textContent = `${namePart}${purposePart}`.trim();

    // Fill table body
    pdfTableBodyEl.innerHTML = "";
    data.days.forEach((day) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${day.date || ""}</td>
      <td>${day.city || ""}</td>
      <td>${(day.activities || "").replace(/\n/g, "<br>")}</td>
      <td>${day.accommodation || ""}</td>
    `;
        pdfTableBodyEl.appendChild(tr);
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
