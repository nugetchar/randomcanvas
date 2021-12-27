const closeMenuBtn = document.getElementById("close-menu_btn");
const openMenuBtn = document.getElementById("open-menu_btn");

openMenuBtn.addEventListener("click", openMenu);

closeMenuBtn.addEventListener("click", closeMenu);

function closeMenu() {
  const menu = document.querySelector(".menu");
  menu.classList.remove("menu--open");
}

function openMenu() {
  const menu = document.querySelector(".menu");
  menu.classList.add("menu--open");
}
