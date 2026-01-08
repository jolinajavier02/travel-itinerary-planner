// DOM references
const daysContainer = document.getElementById("days-container");
const addDayBtn = document.getElementById("add-day-btn");

const travelerNameEl = document.getElementById("travelerName");
const countryEl = document.getElementById("country");
const purposeEl = document.getElementById("purpose");

// preview DOM
const pdfTitleEl = document.getElementById("pdf-title");
const pdfMetaEl = document.getElementById("pdf-meta");
const pdfTableBodyEl = document.getElementById("pdf-table-body");
const pdfTheadEl = document.getElementById("pdf-thead");
const previewOverlay = document.getElementById("preview-overlay");
const closePreviewBtn = document.getElementById("close-preview");
const downloadPdfBtn = document.getElementById("download-pdf-btn");

let dayCount = 0;

// create a day card
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

function addDay() {
    const card = createDayCard(dayCount);
    daysContainer.appendChild(card);
    dayCount++;
}

function removeDay(card) {
    daysContainer.removeChild(card);
    Array.from(daysContainer.querySelectorAll(".day-card")).forEach((c, i) => {
        c.dataset.index = i;
        c.querySelector(".day-header strong").textContent = `Day ${i + 1}`;
    });
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

// table header: Japan vs others
function buildTableHeader(countryCode) {
    pdfTheadEl.innerHTML = "";
    const tr = document.createElement("tr");

    if (countryCode === "japan") {
        // Japan visa template: Date | Activity Plan | Contact | Accommodation [web:9]
        ["Date", "Activity Plan", "Contact", "Accommodation"].forEach((h) => {
            const th = document.createElement("th");
            th.textContent = h;
            tr.appendChild(th);
        });
    } else {
        // generic: Date | City | Activities | Accommodation [web:3][web:41]
        ["Date", "City", "Activities", "Accommodation"].forEach((h) => {
            const th = document.createElement("th");
            th.textContent = h;
            tr.appendChild(th);
        });
    }

    pdfTheadEl.appendChild(tr);
}

function updatePreview() {
    const data = collectFormData();
    buildTableHeader(data.country);

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

    pdfTableBodyEl.innerHTML = "";

    data.days.forEach((day) => {
        const tr = document.createElement("tr");

        if (data.country === "japan") {
            // Japan: Date | Activity Plan | Contact | Accommodation [web:9]
            tr.innerHTML = `
        <td>${day.date || ""}</td>
        <td>${(day.activities || "").replace(/\n/g, "<br>")}</td>
        <td>${day.city || ""}</td>
        <td>${day.accommodation || ""}</td>
      `;
        } else {
            tr.innerHTML = `
        <td>${day.date || ""}</td>
        <td>${day.city || ""}</td>
        <td>${(day.activities || "").replace(/\n/g, "<br>")}</td>
        <td>${day.accommodation || ""}</td>
      `;
        }

        pdfTableBodyEl.appendChild(tr);
    });
}

function openPreview() {
    const data = collectFormData();
    if (!data.travelerName || !data.country || data.days.length === 0) {
        alert("Please complete traveler name, country, and at least one day.");
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

// initial setup
addDay();

addDayBtn.addEventListener("click", () => {
    addDay();
});

daysContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("day-remove")) {
        const card = e.target.closest(".day-card");
        if (card) removeDay(card);
    }

    if (e.target.classList.contains("day-preview")) {
        openPreview();
    }

    if (e.target.classList.contains("day-download")) {
        openPreview();
        // if you want auto-download after preview opens, uncomment:
        // downloadPdf();
    }
});

document.getElementById("itinerary-form").addEventListener("input", updatePreview);
countryEl.addEventListener("change", updatePreview);

closePreviewBtn.addEventListener("click", closePreview);
previewOverlay.addEventListener("click", (e) => {
    if (e.target === previewOverlay) closePreview();
});

downloadPdfBtn.addEventListener("click", downloadPdf);
