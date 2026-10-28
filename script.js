 
const internships = [
    {
        id: 1,
        title: "Frontend Development Intern",
        company: "WebSpark",
        domain: "frontend",
        domainName: "Frontend Development",
        mode: "remote",
        duration: "3 Months",
        stipend: "₹8,000/month",
        skills: ["HTML", "CSS", "JavaScript"],
        description: "Build responsive web pages and create engaging user experiences."
    },
    {
        id: 2,
        title: "API Engineering Intern",
        company: "CodeBridge",
        domain: "backend",
        domainName: "Backend Development",
        mode: "hybrid",
        duration: "6 Months",
        stipend: "₹12,000/month",
        skills: ["Node.js", "REST API", "SQL"],
        description: "Learn to build, test, and maintain reliable backend APIs."
    },
    {
        id: 3,
        title: "UI/UX Design Intern",
        company: "PixelCraft",
        domain: "design",
        domainName: "UI/UX Design",
        mode: "remote",
        duration: "3 Months",
        stipend: "₹7,000/month",
        skills: ["Figma", "Wireframes", "Prototyping"],
        description: "Design user-friendly interfaces and explore creative design systems."
    },
    {
        id: 4,
        title: "Data Analyst Intern",
        company: "DataNest",
        domain: "data",
        domainName: "Data Analytics",
        mode: "onsite",
        duration: "4 Months",
        stipend: "₹10,000/month",
        skills: ["Excel", "SQL", "Python"],
        description: "Explore datasets and turn information into useful insights."
    },
    {
        id: 5,
        title: "Security Operations Intern",
        company: "SecurePath",
        domain: "security",
        domainName: "Cybersecurity",
        mode: "hybrid",
        duration: "6 Months",
        stipend: "₹11,000/month",
        skills: ["Networking", "Security", "Linux"],
        description: "Learn security monitoring and basic incident investigation."
    }
];

const searchInput = document.getElementById("search-input");
const domainFilter = document.getElementById("domain-filter");
const modeFilter = document.getElementById("mode-filter");
const filterForm = document.getElementById("filter-form");
const internshipList = document.getElementById("internship-list");
const resultsCount = document.getElementById("results-count");
const emptyState = document.getElementById("empty-state");
const errorMessage = document.getElementById("error-message");
const retryButton = document.getElementById("retry-button");
const emptyResetButton = document.getElementById("empty-reset-button");

function formatMode(mode) {
    const labels = {
        remote: "Remote",
        hybrid: "Hybrid",
        onsite: "On-site"
    };
    return labels[mode] || mode;
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function createInternshipCard(item) {
    const card = createElement("article", "internship-card");

    const top = createElement("div", "card-top");
    const logo = createElement("div", "company-logo", item.company.charAt(0));
    logo.setAttribute("aria-hidden", "true");

    const badge = createElement("span", "domain-badge", item.domainName);
    top.append(logo, badge);

    const title = createElement("h3", "", item.title);
    const company = createElement("p", "company-name", item.company);
    const description = createElement("p", "card-description", item.description);

    const meta = createElement("div", "card-meta");
    meta.append(
        createElement("span", "meta-item", formatMode(item.mode)),
        createElement("span", "meta-item", item.duration)
    );

    item.skills.forEach(skill => {
        meta.appendChild(createElement("span", "meta-item", skill));
    });

    const footer = createElement("div", "card-footer");
    const stipend = createElement("span", "stipend", item.stipend);
    const detailsButton = createElement("button", "apply-button", "View details");

    detailsButton.type = "button";
    detailsButton.setAttribute("aria-label", `View details for ${item.title} at ${item.company}`);

    detailsButton.addEventListener("click", () => showDetails(item));

    footer.append(stipend, detailsButton);
    card.append(top, title, company, description, meta, footer);

    return card;
}

function showDetails(item) {
    const dialog = document.createElement("dialog");
    dialog.className = "details-dialog";
    dialog.setAttribute("aria-labelledby", "details-title");

    const content = createElement("div", "dialog-content");
    const closeButton = createElement("button", "dialog-close", "Close ×");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close internship details");

    const heading = createElement("h2", "", item.title);
    heading.id = "details-title";

    const company = createElement("p", "company-name", item.company);
    const description = createElement("p", "card-description", item.description);

    const details = [
        ["Domain", item.domainName],
        ["Work mode", formatMode(item.mode)],
        ["Duration", item.duration],
        ["Stipend", item.stipend],
        ["Skills", item.skills.join(", ")]
    ];

    content.append(closeButton, heading, company, description);

    details.forEach(([label, value]) => {
        const row = createElement("p", "detail-row");
        const strong = createElement("strong", "", `${label}: `);
        row.append(strong, document.createTextNode(value));
        content.appendChild(row);
    });

    const note = createElement(
        "p",
        "dialog-note",
        "This is a sample internship listing for the project demo, not a live vacancy."
    );

    content.appendChild(note);
    dialog.appendChild(content);
    document.body.appendChild(dialog);

    function closeDialog() {
        if (dialog.open) dialog.close();
        dialog.remove();
    }

    closeButton.addEventListener("click", closeDialog);
    dialog.addEventListener("click", event => {
        if (event.target === dialog) closeDialog();
    });
    dialog.addEventListener("close", () => dialog.remove());

    dialog.showModal();
    closeButton.focus();
}

function renderInternships(records) {
    internshipList.replaceChildren();

    records.forEach(item => {
        internshipList.appendChild(createInternshipCard(item));
    });

    const count = records.length;
    resultsCount.textContent =
        `${count} internship${count === 1 ? "" : "s"} found`;

    emptyState.hidden = count !== 0;
    internshipList.hidden = count === 0;
    errorMessage.hidden = true;
    internshipList.setAttribute("aria-busy", "false");
}

function filterInternships() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedDomain = domainFilter.value;
    const selectedMode = modeFilter.value;

    const filtered = internships.filter(item => {
        const searchableText = [
            item.title,
            item.company,
            item.domainName,
            item.description,
            ...item.skills
        ].join(" ").toLowerCase();

        return searchableText.includes(query)
            && (selectedDomain === "all" || item.domain === selectedDomain)
            && (selectedMode === "all" || item.mode === selectedMode);
    });

    renderInternships(filtered);
}

function resetFilters() {
    searchInput.value = "";
    domainFilter.value = "all";
    modeFilter.value = "all";
    filterInternships();
}

function loadInternships() {
    errorMessage.hidden = true;
    emptyState.hidden = true;
    internshipList.hidden = false;
    internshipList.setAttribute("aria-busy", "true");
    resultsCount.textContent = "Loading opportunities...";

    try {
        if (!Array.isArray(internships)) {
            throw new Error("Internship data is unavailable.");
        }

        internships.forEach(item => {
            if (!item.title || !item.company || !Array.isArray(item.skills)) {
                throw new Error("An internship record is invalid.");
            }
        });

        filterInternships();
    } catch (error) {
        internshipList.replaceChildren();
        internshipList.hidden = true;
        emptyState.hidden = true;
        errorMessage.hidden = false;
        resultsCount.textContent = "Unable to load internships.";
        internshipList.setAttribute("aria-busy", "false");
        console.error("Internship loading error:", error);
    }
}

searchInput.addEventListener("input", filterInternships);
domainFilter.addEventListener("change", filterInternships);
modeFilter.addEventListener("change", filterInternships);

filterForm.addEventListener("reset", event => {
    event.preventDefault();
    resetFilters();
});

emptyResetButton.addEventListener("click", resetFilters);
retryButton.addEventListener("click", loadInternships);

loadInternships();
