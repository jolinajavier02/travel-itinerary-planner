# 🌍 Travel Itinerary Planner

A sleek, responsive web application designed to help travelers create professional, visa-ready, or personal travel itineraries. Preview your plans in real-time and export them as high-quality PDF documents directly from your browser.

---

## ✨ Features

- **🎯 Visa-Specific Templates**: Supports specialized formats for Japan, Schengen, UK, and USA visa applications.
- **📱 Responsive Design**: A modern, mobile-friendly interface built for all devices.
- **⚡ Dynamic Builder**: Easily add or remove days to your itinerary with a single click.
- **👁️ Real-time Preview**: View your formatted itinerary in a professional table layout before downloading.
- **📄 PDF Export**: Generate and download high-quality PDFs using `jsPDF` and `html2canvas`.
- **🔒 Privacy First**: No backend required. All data stays in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Libraries**: 
  - [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
  - [html2canvas](https://html2canvas.hertzen.com/) - HTML to Canvas rendering

---

## 🚀 Getting Started

### Prerequisites
No installation is required. You only need a modern web browser.

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/travel-itinerary-planner.git
   ```
2. Navigate to the project directory:
   ```bash
   cd travel-itinerary-planner
   ```
3. Open `index.html` in your browser.

---

## 📖 Usage Guide

1. **Enter Trip Details**: Fill in the traveler's name, destination, and purpose of travel.
2. **Build Your Days**:
   - Click **"+ Add day"** to create a new entry.
   - Fill in the **Date**, **City/Contact**, **Activities**, and **Accommodation**.
3. **Preview & Export**:
   - Click **"Preview"** on any day card to see the full itinerary.
   - Click **"Download PDF"** in the preview modal to save your document.

---

## 📂 Project Structure

```text
.
├── index.html      # Main application structure
├── style.css       # Modern styling and layout
├── scripts.js      # Core logic and PDF generation
└── README.md       # Project documentation
```

---

## 🗺️ Country-Specific Formats

| Country | Table Columns |
| :--- | :--- |
| **Japan** | Date \| Activity Plan \| Contact \| Accommodation |
| **Schengen / UK / USA** | Date \| City \| Activities \| Accommodation |
| **Personal** | Date \| City \| Activities \| Accommodation |

---

## 🔧 Customization

- **Add Countries**: Edit the `<select id="country">` in `index.html`.
- **Modify Templates**: Update the `buildTableHeader` and `updatePreview` functions in `scripts.js`.
- **Change Styles**: Adjust colors, fonts, and spacing in `style.css`.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
