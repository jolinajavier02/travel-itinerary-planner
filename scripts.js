// DOM references
const landingSection = document.getElementById("landing");
const plannerSection = document.getElementById("planner");
const startPlanningBtn = document.getElementById("start-planning-btn");
const backToHomeBtn = document.getElementById("back-to-home");

const viewTemplatesBtn = document.getElementById("view-templates-btn");
const templatesOverlay = document.getElementById("templates-overlay");
const closeTemplatesBtn = document.getElementById("close-templates");

const travelerNameEl = document.getElementById("travelerName");
const countryEl = document.getElementById("country");
const destinationsEl = document.getElementById("destinations");
const purposeEl = document.getElementById("purpose");

const flightTypeEl = document.getElementById("flightType");
const departureDateEl = document.getElementById("departureDate");
const returnDateEl = document.getElementById("returnDate");
const flightDetailsEl = document.getElementById("flightDetails");
const connectingDetailsEl = document.getElementById("connectingDetails");

const departureField = document.getElementById("departure-field");
const returnField = document.getElementById("return-field");
const connectingDetailsField = document.getElementById("connecting-details-field");

// daily input
const dayDateEl = document.getElementById("dayDate");
const dayCityContactEl = document.getElementById("dayCityContact");
const dayActivitiesEl = document.getElementById("dayActivities");
const dayAccommodationEl = document.getElementById("dayAccommodation");
const addDayBtn = document.getElementById("add-day-btn");

const labelCityContact = document.getElementById("label-city-contact");
const labelActivities = document.getElementById("label-activities");

// list of days
const daysContainer = document.getElementById("days-container");
const previewBtn = document.getElementById("preview-btn");
const downloadBtn = document.getElementById("download-btn");

// preview modal
const previewOverlay = document.getElementById("preview-overlay");
const closePreviewBtn = document.getElementById("close-preview");
const pdfTitleEl = document.getElementById("pdf-title");
const pdfMetaEl = document.getElementById("pdf-meta");
const pdfTheadEl = document.getElementById("pdf-thead");
const pdfTableBodyEl = document.getElementById("pdf-table-body");

let days = [];

// ---------- Navigation ----------

function showPlanner() {
    landingSection.style.display = "none";
    plannerSection.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLanding() {
    plannerSection.classList.remove("active");
    landingSection.style.display = "flex";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openTemplates() {
    templatesOverlay.classList.remove("hidden");
}

function closeTemplates() {
    templatesOverlay.classList.add("hidden");
}

// ---------- helpers ----------

function updateFlightFields() {
    const type = flightTypeEl.value;

    // Reset fields
    returnField.classList.remove("disabled");
    returnDateEl.disabled = false;
    connectingDetailsField.style.display = "none";

    if (type === "oneway") {
        returnField.classList.add("disabled");
        returnDateEl.disabled = true;
        returnDateEl.value = "";
    } else if (type === "connecting") {
        connectingDetailsField.style.display = "block";
    }
}

function updateInputLabels() {
    const country = countryEl.value;
    if (country === "japan") {
        labelCityContact.textContent = "Contact";
        dayCityContactEl.placeholder = "Contact person or number";
        labelActivities.textContent = "Activity Plan";
        dayActivitiesEl.placeholder = "Planned activities for the day";
    } else {
        labelCityContact.textContent = "City";
        dayCityContactEl.placeholder = "City name";
        labelActivities.textContent = "Activities";
        dayActivitiesEl.placeholder = "Morning: ... Afternoon: ... Evening: ...";
    }
}

function resetDayInput() {
    dayDateEl.value = "";
    dayCityContactEl.value = "";
    dayActivitiesEl.value = "";
    dayAccommodationEl.value = "";
}

function addDay() {
    if (!dayDateEl.value) {
        alert("Please select a date for the day.");
        return;
    }

    const day = {
        date: dayDateEl.value,
        cityContact: dayCityContactEl.value.trim(),
        activities: dayActivitiesEl.value.trim(),
        accommodation: dayAccommodationEl.value.trim(),
        countryFormat: countryEl.value // Store format at time of adding
    };

    days.push(day);
    renderDays();
    resetDayInput();
}

function removeDay(index) {
    days.splice(index, 1);
    renderDays();
}

function renderDays() {
    daysContainer.innerHTML = "";
    const country = countryEl.value;

    days.forEach((d, i) => {
        const card = document.createElement("div");
        card.className = "day-card";

        const cityLabel = country === "japan" ? "Contact" : "City";
        const activityLabel = country === "japan" ? "Activity Plan" : "Activities";

        card.innerHTML = `
      <div class="day-header">
        <span><strong>Day ${i + 1}</strong> – ${d.date}</span>
        <button type="button" class="day-remove" data-index="${i}">
          Remove
        </button>
      </div>
      <div class="day-meta">
        <strong>${cityLabel}:</strong> ${d.cityContact || "-"}
      </div>
      <div class="day-activities-text">
        <strong>${activityLabel}:</strong><br>
        ${(d.activities || "-").replace(/\n/g, "<br>")}
      </div>
      <div class="day-accommodation-text">
        <strong>Accommodation:</strong> ${d.accommodation || "-"}
      </div>
    `;

        daysContainer.appendChild(card);
    });
}

function collectHeaderData() {
    return {
        travelerName: travelerNameEl.value.trim(),
        country: countryEl.value,
        destinations: destinationsEl.value.trim(),
        purpose: purposeEl.options[purposeEl.selectedIndex].text,
        flightType: flightTypeEl.value,
        departureDate: departureDateEl.value,
        returnDate: returnDateEl.value,
        flightDetails: flightDetailsEl.value.trim(),
        connectingDetails: connectingDetailsEl.value.trim(),
    };
}

// build table header based on country
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

function updatePreviewContent() {
    const header = collectHeaderData();

    const templateTitle = (() => {
        switch (header.country) {
            case "schengen":
                return "Travel Itinerary for Schengen Visa";
            case "japan":
                return "Travel Itinerary for Japan Visa";
            case "uk":
                return "Travel Itinerary for UK Visitor Visa";
            case "usa":
                return "Travel Itinerary for US Tourist Visa";
            case "personal":
                return "Personal Travel Itinerary";
            default:
                return "Travel Itinerary";
        }
    })();

    pdfTitleEl.textContent = templateTitle;

    const parts = [];
    if (header.travelerName) parts.push(`<strong>Applicant:</strong> ${header.travelerName}`);
    if (header.destinations) parts.push(`<strong>Destinations:</strong> ${header.destinations}`);
    if (header.purpose && header.purpose !== "Select purpose…") parts.push(`<strong>Purpose:</strong> ${header.purpose}`);

    if (header.departureDate) {
        if (header.flightType === "roundtrip" && header.returnDate) {
            parts.push(
                `<strong>Travel dates:</strong> ${header.departureDate} to ${header.returnDate} (${header.flightType})`
            );
        } else {
            parts.push(`<strong>Travel date:</strong> ${header.departureDate} (${header.flightType})`);
        }
    }

    if (header.connectingDetails) {
        parts.push(`<strong>Connecting Flights:</strong> ${header.connectingDetails}`);
    }

    if (header.flightDetails) {
        parts.push(`<strong>Flight Details:</strong> ${header.flightDetails}`);
    }

    pdfMetaEl.innerHTML = parts.join(" | ");

    buildTableHeader(header.country);

    pdfTableBodyEl.innerHTML = "";
    days.forEach((d) => {
        const tr = document.createElement("tr");
        if (header.country === "japan") {
            tr.innerHTML = `
        <td>${d.date || ""}</td>
        <td>${(d.activities || "").replace(/\n/g, "<br>")}</td>
        <td>${d.cityContact || ""}</td>
        <td>${d.accommodation || ""}</td>
      `;
        } else {
            tr.innerHTML = `
        <td>${d.date || ""}</td>
        <td>${d.cityContact || ""}</td>
        <td>${(d.activities || "").replace(/\n/g, "<br>")}</td>
        <td>${d.accommodation || ""}</td>
      `;
        }
        pdfTableBodyEl.appendChild(tr);
    });
}

function openPreview() {
    const header = collectHeaderData();
    if (!header.travelerName || !header.country) {
        alert("Please fill in full name and main destination country.");
        return;
    }
    if (days.length === 0) {
        alert("Please add at least one itinerary day.");
        return;
    }
    updatePreviewContent();
    previewOverlay.classList.remove("hidden");
}

function closePreview() {
    previewOverlay.classList.add("hidden");
}

async function downloadPdf() {
    const header = collectHeaderData();
    openPreview();
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfContent = document.querySelector(".preview-modal");

    await pdf.html(pdfContent, {
        callback: function (doc) {
            doc.save(`itinerary_${header.travelerName || 'travel'}.pdf`);
        },
        margin: [40, 40, 40, 40],
        html2canvas: { scale: 0.75, useCORS: true },
    });
}

// ---------- event bindings ----------

startPlanningBtn.addEventListener("click", showPlanner);
backToHomeBtn.addEventListener("click", showLanding);

viewTemplatesBtn.addEventListener("click", openTemplates);
closeTemplatesBtn.addEventListener("click", closeTemplates);
templatesOverlay.addEventListener("click", (e) => {
    if (e.target === templatesOverlay) closeTemplates();
});

countryEl.addEventListener("change", () => {
    updateInputLabels();
    renderDays(); // Re-render existing days with new labels if needed
});

flightTypeEl.addEventListener("change", updateFlightFields);

addDayBtn.addEventListener("click", addDay);

daysContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("day-remove")) {
        const index = parseInt(e.target.dataset.index, 10);
        removeDay(index);
    }
});

previewBtn.addEventListener("click", openPreview);
downloadBtn.addEventListener("click", downloadPdf);

closePreviewBtn.addEventListener("click", closePreview);
previewOverlay.addEventListener("click", (e) => {
    if (e.target === previewOverlay) closePreview();
});

