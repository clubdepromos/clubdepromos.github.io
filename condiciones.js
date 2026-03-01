document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    window.scrollTo(0, 0);
  });
});