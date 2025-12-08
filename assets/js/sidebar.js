document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".hextra-sidebar-collapsible-button");
  const currentPageURL = window.location.href; // Get the current page URL

  buttons.forEach(function (button) {
    const list = button.parentElement.parentElement;
    const link = list.querySelector("a"); // Assuming the link is within the list

    // Initially collapse the list
    if (list) {
      list.classList.remove("open"); // Ensure it's not open by default
    }

    // If the list item contains a link to the current page, expand it
    if (link && currentPageURL.includes(link.href)) {
      list.classList.add("open");
    }

    // Setup click event listener for toggling
    button.addEventListener("click", function (e) {
      e.preventDefault();
      if (list) {
        list.classList.toggle("open"); // Toggle open/collapsed state
      }
    });
  });
});
