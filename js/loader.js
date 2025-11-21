// Record the moment the page starts evaluating JS
const startTime = performance.now();

window.addEventListener("load", () => {

  const loader = document.querySelector(".loader");
  const loaderText = document.querySelector(".loader-text");

  // Calculate load time
  const loadTime = performance.now() - startTime; // ms

  // Decide message based on load speed
  let message = "";

  if (loadTime < 1200) {
    message = "Ready!";
  } 
  else if (loadTime < 2500) {
    message = "Loading...";
  } 
  else {
    message = "Almost done! <br>";
  }

  loaderText.textContent = message;

  // Wait 1 full spinner turn before fading out
  setTimeout(() => {
    loader.classList.add("loader-hidden");
  }, 1500);

  // Remove after fade transition
  loader.addEventListener("transitionend", () => loader.remove());
});