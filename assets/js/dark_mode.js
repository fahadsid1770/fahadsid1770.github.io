$(document).ready(function() {
    const mode_toggle = document.getElementById("light-toggle");

    mode_toggle.addEventListener("click", function() {
        const temp = localStorage.getItem("theme");
        toggleTheme(temp);
    });

    let toggleTheme = (theme) => {
        if (theme == "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    }

    let setTheme = (theme) =>  {
        trans();
        if (theme) {
            document.documentElement.setAttribute("data-theme", theme)
        }
        else {
            document.documentElement.removeAttribute("data-theme");
        }
        localStorage.setItem("theme", theme);
        updateIcon(theme);
    };

    let updateIcon = (theme) => {
        const sunIcon = document.getElementById("sun-icon");
        const moonIcon = document.getElementById("moon-icon");
        if (theme === "dark") {
            sunIcon.style.display = "none";
            moonIcon.style.display = "inline";
        } else {
            sunIcon.style.display = "inline";
            moonIcon.style.display = "none";
        }
    };

    // Initialize icon on page load
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
        updateIcon(currentTheme);
    } else {
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            updateIcon("dark");
        } else {
            updateIcon("light");
        }
    }

    let trans = () => {
        document.documentElement.classList.add("transition");
        window.setTimeout(() => {
            document.documentElement.classList.remove("transition")
        }, 500)
    }
});
