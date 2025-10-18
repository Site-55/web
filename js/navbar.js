const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const icon = toggle.querySelector("i");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("show");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-times");
  });