// DOM references
const landingSection = document.getElementById("landing");
const plannerSection = document.getElementById("planner");
const startPlanningBtn = document.getElementById("start-planning-btn");
const backToHomeBtn = document.getElementById("back-to-home");

const travelerNameEl = document.getElementById("travelerName");
const countryEl = document.getElementById("country");
const purposeEl = document.getElementById("purpose");

const flightTypeEl = document.getElementById("flightType");
const departureDateEl = document.getElementById("departureDate");
const returnDateEl = document.getElementById("returnDate");
const connectingDetailsEl = document.getElementById("connectingDetails");
const multiFlightDetailsEl = document.getElementById("multiFlightDetails");

const departureField = document.getElementById("departure-field");
const returnField = document.getElementById("return-field");
const connectingDetailsField = document.getElementById("connecting-details-field");
const multiFlightField = document.getElementById("multi-flight-field");

// daily input
const dayDateEl = document.getElementById("dayDate");
const dayCityContactEl = document.getElementById("Contact");
const dayActivitiesEl = document.getElementById("dayActivities");
const dayAccommodationEl = document.getElementById("dayAccommodation");
const addDayBtn = document.getElementById("add-day-btn");

const labelCityContact = document.getElementById("contact");
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

// ---------- helpers ----------

function updateFlightFields() {
    const type = flightTypeEl.value;

    // Reset fields
    returnField.classList.remove("disabled");
    returnDateEl.disabled = false;
    connectingDetailsField.style.display = "none";
    multiFlightField.style.display = "none";

    if (type === "oneway") {
        returnField.classList.add("disabled");
        returnDateEl.disabled = true;
        returnDateEl.value = "";
    } else if (type === "connecting") {
        connectingDetailsField.style.display = "block";
    } else if (type === "multi") {
        multiFlightField.style.display = "block";
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
        labelCityContact.textContent = "Contact"; // Kept as Contact per user's manual change
        dayCityContactEl.placeholder = "Contact person or number";
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

        const cityLabel = "Contact";
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
        purpose: purposeEl.options[purposeEl.selectedIndex].text,
        flightType: flightTypeEl.value,
        departureDate: departureDateEl.value,
        returnDate: returnDateEl.value,
        connectingDetails: connectingDetailsEl.value.trim(),
        multiFlightDetails: multiFlightDetailsEl.value.trim(),
    };
}

// build table header based on country
function buildTableHeader(countryCode) {
    pdfTheadEl.innerHTML = "";
    const tr = document.createElement("tr");

    if (countryCode === "japan") {
        const headers = ["Date", "Activity Plan", "Contact", "Accommodation"];
        const widths = ["15%", "40%", "20%", "25%"];
        headers.forEach((h, i) => {
            const th = document.createElement("th");
            th.textContent = h;
            th.style.width = widths[i];
            tr.appendChild(th);
        });
    } else {
        const headers = ["Date", "Contact", "Activities", "Accommodation"];
        const widths = ["15%", "20%", "40%", "25%"];
        headers.forEach((h, i) => {
            const th = document.createElement("th");
            th.textContent = h;
            th.style.width = widths[i];
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

    if (header.multiFlightDetails) {
        parts.push(`<strong>Multiple Flights:</strong> ${header.multiFlightDetails}`);
    }

    pdfMetaEl.innerHTML = parts.join(" &nbsp;|&nbsp; ");

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

    // Create PDF with A4 dimensions in points (595.28 x 841.89)
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfContent = document.getElementById("printable-content");

    // Temporarily set width to fit A4 (approx 500pt) to prevent cutting
    const originalWidth = pdfContent.style.width;
    pdfContent.style.width = "500pt";

    await pdf.html(pdfContent, {
        callback: function (doc) {
            doc.save(`itinerary_${header.travelerName.replace(/\s+/g, '_') || 'travel'}.pdf`);
            pdfContent.style.width = originalWidth; // Restore original width
        },
        x: 45,
        y: 40,
        margin: [40, 45, 40, 45],
        autoPaging: 'text',
        width: 500, // Target width in points
        windowWidth: 500, // Match window width to target width for consistent rendering
        html2canvas: {
            scale: 1,
            useCORS: true,
            logging: false,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0
        },
    });
}

// ---------- event bindings ----------

startPlanningBtn.addEventListener("click", showPlanner);
backToHomeBtn.addEventListener("click", showLanding);

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

// Initialize
updateFlightFields();
updateInputLabels();

