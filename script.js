document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const menuList = document.querySelector(".menu-list");

    menuToggle.addEventListener("click", function () {
        menuList.style.display = menuList.style.display === "flex" ? "none" : "flex";
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
        if (!menuToggle.contains(event.target) && !menuList.contains(event.target)) {
            menuList.style.display = "none";
        }
    });

    // Smooth scroll to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });

            menuList.style.display = "none"; // Hide menu after clicking a link
        });
    });
});