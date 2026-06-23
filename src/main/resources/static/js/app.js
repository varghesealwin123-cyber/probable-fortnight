// Global Library Management UI Helper

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Theme (Classic OS Blue vs DEC Amber OS)
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeToggleIcon(currentTheme);

    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");
            let newTheme = theme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            updateThemeToggleIcon(newTheme);
        });
    }

    // 2. Mobile Sidebar Explorer toggle
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const sidebar = document.getElementById("sidebar");
    
    if (hamburgerBtn && sidebar) {
        hamburgerBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("show");
        });

        // Click outside to close sidebar on mobile
        document.addEventListener("click", (e) => {
            if (sidebar.classList.contains("show") && !sidebar.contains(e.target) && e.target !== hamburgerBtn) {
                sidebar.classList.remove("show");
            }
        });
    }

    // 3. Setup toast container
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.style.position = "fixed";
        toastContainer.style.bottom = "20px";
        toastContainer.style.right = "20px";
        toastContainer.style.zIndex = "9999";
        toastContainer.style.display = "flex";
        toastContainer.style.flexDirection = "column";
        toastContainer.style.gap = "10px";
        document.body.appendChild(toastContainer);
    }

    // 4. Dynamic Retro OS Window Decorator
    decoratePanelsAsWindows();
});

// Automatically decorates card panels as Retro OS Window frames
function decoratePanelsAsWindows() {
    document.querySelectorAll(".glass-panel").forEach(panel => {
        // Skip stats cards as they use top-accent-line sub-styles instead of full headers
        if (panel.classList.contains("stat-card")) {
            return;
        }

        // Avoid duplicate wrapping
        if (panel.querySelector(".window-header")) {
            return;
        }

        // Try to identify a header title from any inner heading element (h3, h4, h5)
        let titleText = "System Console";
        const innerHeading = panel.querySelector("h3, h4, h5");
        if (innerHeading) {
            titleText = innerHeading.textContent.trim();
            // Remove the icon or sub-elements if any, keeping it clean
            innerHeading.style.display = "none";
        }

        // Create window header element
        const winHeader = document.createElement("div");
        winHeader.className = "window-header";
        winHeader.innerHTML = `
            <div class="window-title">
                <i class="bi bi-window-desktop"></i>
                <span>${titleText}</span>
            </div>
            <div class="window-controls">
                <span class="ctrl-btn minimize-btn">-</span>
                <span class="ctrl-btn maximize-btn">⛶</span>
                <span class="ctrl-btn close-btn">×</span>
            </div>
        `;

        // Prepend inside the card panel
        panel.insertBefore(winHeader, panel.firstChild);

        // Bind interactive controls
        const closeBtn = winHeader.querySelector(".close-btn");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                panel.style.transition = "all 0.15s ease-out";
                panel.style.opacity = "0";
                panel.style.transform = "scale(0.97)";
                setTimeout(() => {
                    panel.style.display = "none";
                }, 150);
            });
        }
        
        const minBtn = winHeader.querySelector(".minimize-btn");
        if (minBtn) {
            minBtn.addEventListener("click", () => {
                const bodyDiv = panel.querySelector("div:not(.window-header)");
                if (bodyDiv) {
                    if (bodyDiv.style.display === "none") {
                        bodyDiv.style.display = "block";
                        panel.style.height = "auto";
                    } else {
                        bodyDiv.style.display = "none";
                        panel.style.height = "fit-content";
                    }
                }
            });
        }
    });
}

// Update theme toggle icon representation
function updateThemeToggleIcon(theme) {
    const icon = document.querySelector("#theme-toggle-btn i");
    if (icon) {
        if (theme === "dark") {
            icon.className = "bi bi-sun-fill";
        } else {
            icon.className = "bi bi-moon-stars-fill";
        }
    }
}

// Global Toast dialog popups helper
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `custom-toast ${type}`;
    
    const iconClass = type === "success" ? "bi bi-check-circle-fill text-success" : "bi bi-exclamation-triangle-fill text-danger";
    
    toast.innerHTML = `
        <i class="${iconClass}"></i>
        <div class="message" style="font-weight: bold;">${message}</div>
    `;

    container.appendChild(toast);

    // Auto-dismiss dialog after 4 seconds
    setTimeout(() => {
        toast.classList.add("slide-out");
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    }, 4000);
}
