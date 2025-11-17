/* Initialize AOS animations when page loads */
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
});

/* Smooth scroll to tools section */
function scrollToTools() {
  document.getElementById("tools").scrollIntoView({
    behavior: "smooth",
  });
}

/* Counter animation for statistics */
function animateCounter() {
  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent =
          Math.floor(current) + (target >= 90 && target <= 100 ? "%" : "+");
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent =
          target + (target >= 90 && target <= 100 ? "%" : "+");
      }
    };

    updateCounter();
  });
}

/* Trigger counter animation when stats section is visible */
const observerOptions = {
  threshold: 0.5,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter();
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const statsSection = document.querySelector(".stats-section");
if (statsSection) {
  observer.observe(statsSection);
}

/* Open calculator modal */
function openCalculator() {
  document.getElementById("calculatorModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

/* Close calculator modal */
function closeCalculator() {
  document.getElementById("calculatorModal").classList.remove("active");
  document.body.style.overflow = "auto";
}

/* Close modal when clicking outside */
document
  .getElementById("calculatorModal")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      closeCalculator();
    }
  });

/* Milk standardization calculation function */
function calculateStandardization() {
  /* Get input values */
  const userName = document.getElementById("userName").value.trim();
  const companyName = document.getElementById("companyName").value.trim();
  const rawFat = parseFloat(document.getElementById("rawFat").value);
  const skimFat = parseFloat(document.getElementById("skimFat").value);
  const targetFat = parseFloat(document.getElementById("targetFat").value);
  const rawVolume = parseFloat(document.getElementById("rawVolume").value);

  /* Validate required fields */
  if (!userName || !companyName) {
    alert("Please enter both user name and company name");
    return;
  }

  /* Validate numerical inputs */
  if (isNaN(rawFat) || isNaN(skimFat) || isNaN(targetFat) || isNaN(rawVolume)) {
    alert("Please enter valid numbers for all fields");
    return;
  }

  /* Validate fat percentages */
  if (targetFat >= rawFat) {
    alert("Target fat % must be less than raw milk fat %");
    return;
  }

  if (targetFat <= skimFat) {
    alert("Target fat % must be greater than skim milk fat %");
    return;
  }

  if (rawVolume <= 0) {
    alert("Raw milk volume must be greater than 0");
    return;
  }

  /* Pearson Square calculation */
  /* Calculate the parts from each source */
  const partSkim = rawFat - targetFat;
  const partRaw = targetFat - skimFat;

  /* Calculate ratio and volumes */
  const ratio = partSkim / partRaw;
  const skimVolume = rawVolume * ratio;
  const totalVolume = rawVolume + skimVolume;

  /* Update user information */
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("userInfo").innerHTML = `
        <strong>${userName}</strong> | ${companyName}<br>
        <small>Calculated on ${dateStr}</small>
    `;

  /* Update result values */
  document.getElementById("skimVolume").textContent =
    skimVolume.toFixed(2) + " L";
  document.getElementById("totalVolume").textContent =
    totalVolume.toFixed(2) + " L";
  document.getElementById("mixingRatio").textContent =
    partRaw.toFixed(1) + ":" + partSkim.toFixed(1);

  /* Update visual diagram */
  document.getElementById("rawDisplay").textContent = rawFat.toFixed(1) + "%";
  document.getElementById("rawVolumeDisplay").textContent =
    rawVolume.toFixed(0) + " L";
  document.getElementById("targetDisplay").textContent =
    targetFat.toFixed(1) + "%";
  document.getElementById("targetVolumeDisplay").textContent =
    totalVolume.toFixed(2) + " L";
  document.getElementById("skimDisplay").textContent = skimFat.toFixed(1) + "%";
  document.getElementById("skimVolumeDisplay").textContent =
    skimVolume.toFixed(2) + " L";

  /* Show results section and hide no results message */
  document.getElementById("resultsSection").style.display = "block";
  document.getElementById("noResults").style.display = "none";
  document.getElementById("diagramSection").style.display = "block";

  /* Add success animation */
  document.getElementById("resultsSection").style.animation =
    "slideDown 0.5s ease";
}

/* Reset calculator function */
function resetCalculator() {
  document.getElementById("userName").value = "";
  document.getElementById("companyName").value = "";
  document.getElementById("rawFat").value = "4.0";
  document.getElementById("skimFat").value = "0.2";
  document.getElementById("targetFat").value = "3.0";
  document.getElementById("rawVolume").value = "1000";

  /* Hide results and show no results message */
  document.getElementById("resultsSection").style.display = "none";
  document.getElementById("noResults").style.display = "block";
  document.getElementById("diagramSection").style.display = "none";
}

/* Print calculation results */
function printCalculation() {
  /* Check if results are available */
  if (document.getElementById("resultsSection").style.display === "none") {
    alert("Please calculate results first before printing");
    return;
  }

  /* Create print window with styled content */
  const printWindow = window.open("", "_blank");
  const userName = document.getElementById("userName").value;
  const companyName = document.getElementById("companyName").value;
  const rawFat = document.getElementById("rawFat").value;
  const skimFat = document.getElementById("skimFat").value;
  const targetFat = document.getElementById("targetFat").value;
  const rawVolume = document.getElementById("rawVolume").value;
  const skimVolume = document.getElementById("skimVolume").textContent;
  const totalVolume = document.getElementById("totalVolume").textContent;
  const mixingRatio = document.getElementById("mixingRatio").textContent;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Milk Standardization Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #2c3e50;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #2c3e50;
                    margin-bottom: 10px;
                }
                .info-section {
                    background: #f5f5f5;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .result-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                .result-table th, .result-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                .result-table th {
                    background: #2c3e50;
                    color: white;
                }
                .highlight {
                    background: #e8f5e9;
                    font-weight: bold;
                    font-size: 1.2em;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>MILK STANDARDIZATION REPORT</h1>
                <p>Pearson Square Method Calculation</p>
            </div>

            <div class="info-section">
                <strong>Prepared By:</strong> ${userName}<br>
                <strong>Company:</strong> ${companyName}<br>
                <strong>Date & Time:</strong> ${dateStr}
            </div>

            <h2>Input Parameters</h2>
            <table class="result-table">
                <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Raw Milk Fat %</td>
                    <td>${rawFat}%</td>
                </tr>
                <tr>
                    <td>Skim Milk Fat %</td>
                    <td>${skimFat}%</td>
                </tr>
                <tr>
                    <td>Target Fat %</td>
                    <td>${targetFat}%</td>
                </tr>
                <tr>
                    <td>Raw Milk Volume</td>
                    <td>${rawVolume} Liters</td>
                </tr>
            </table>

            <h2>Calculation Results</h2>
            <table class="result-table">
                <tr>
                    <th>Result</th>
                    <th>Value</th>
                </tr>
                <tr class="highlight">
                    <td>Skim Milk Required</td>
                    <td>${skimVolume}</td>
                </tr>
                <tr class="highlight">
                    <td>Total Standardized Milk</td>
                    <td>${totalVolume}</td>
                </tr>
                <tr>
                    <td>Mixing Ratio (Raw:Skim)</td>
                    <td>${mixingRatio}</td>
                </tr>
            </table>

            <div class="footer">
                <p><strong>Food Control Professional Calculators</strong></p>
                <p>This report was generated using the Pearson Square method for milk standardization</p>
                <p>&copy; 2025 Food Control. All rights reserved.</p>
            </div>

            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `);

  printWindow.document.close();
}

/* Add keyboard support for calculator */
document.addEventListener("keydown", function (e) {
  /* Press Escape to close modal */
  if (e.key === "Escape") {
    closeCalculator();
  }

  /* Press Enter to calculate when modal is open */
  if (
    e.key === "Enter" &&
    document.getElementById("calculatorModal").classList.contains("active")
  ) {
    calculateStandardization();
  }
});

/* Add smooth scrolling for navigation links */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

/* Add active class to navigation on scroll */
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});
