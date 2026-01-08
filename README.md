**Travel Itinerary PDF Generator**
A responsive web app that lets users create visa‑style or personal travel itineraries, preview them in the browser, and download them as PDF files. The app supports country‑specific formats such as the Japan visa itinerary (Date / Activity Plan / Contact / Accommodation).

**Features**
Responsive single‑page interface built with HTML, CSS, and vanilla JavaScript.

Country selector (e.g., Schengen, Japan, UK, USA, Personal) to control itinerary format.

Dynamic day‑by‑day itinerary builder (add/remove days).

Per‑day Preview and Download buttons that show a full‑trip preview in a modal.

PDF export generated in the browser using jsPDF and html2canvas.

**Tech Stack**
Frontend: HTML5, CSS3, JavaScript (no framework).

PDF generation: jsPDF + html2canvas loaded from CDN.

No backend required: Everything runs client‑side in the browser.

**Project Structure**
text
.
├── index.html      # Main page with form, country selector, preview modal
├── styles.css      # Layout, responsive styles, preview and table styling
└── app.js          # Itinerary logic, template switching, PDF generation

**Usage**

Enter the traveler name, select the destination country, and optionally fill in the purpose of travel.

Add one or more itinerary days using the “+ Add day” button.

For each day, fill in:

Date

City (or contact, for Japan template)

Activities (free‑text, supports multiple lines)

Accommodation

Click Preview on any day card to open the itinerary preview modal.

Review the table:

For Japan, the table shows: Date, Activity Plan, Contact, Accommodation.

For other countries, the default is: Date, City, Activities, Accommodation.

Click Download PDF in the modal to save the itinerary as a PDF file.

**Country‑Specific Formats**
**Japan:**

Columns: Date | Activity Plan | Contact | Accommodation (replicates the Japan visa itinerary table style).

**Schengen / UK / USA / Personal:**

Default columns: Date | City | Activities | Accommodation.

You can extend the logic in app.js to customize headers and layout per country if needed.

**Customization**
To add or rename countries, edit the <select id="country"> options in index.html.

To change table headers or layout for a specific country, update the buildTableHeader and updatePreview functions in app.js.

Styles (colors, fonts, spacing) can be customized in styles.css.

**Dependencies**
The project pulls third‑party libraries from public CDNs:

jsPDF (for PDF generation).

html2canvas (for rendering HTML content to canvas before PDF).

No installation is required beyond having a modern web browser.


# travel-itinerary-lanner
