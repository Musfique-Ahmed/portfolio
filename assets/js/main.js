(function () {
  function setCurrentYear() {
    var nodes = document.querySelectorAll("[data-year]");
    var year = String(new Date().getFullYear());
    nodes.forEach(function (node) {
      node.textContent = year;
    });
  }

  function initMobileNav() {
    var button = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }

    button.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function initActiveNav() {
    var page = document.body.getAttribute("data-page");
    if (!page) {
      return;
    }

    var links = document.querySelectorAll("[data-nav]");
    links.forEach(function (link) {
      if (link.getAttribute("data-nav") === page) {
        link.classList.add("is-active");
      }
    });
  }

  function initRevealAnimations() {
    var nodes = document.querySelectorAll("[data-animate]");
    if (!nodes.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (node) {
        node.classList.add("in-view");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
      }
    );

    nodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function initProjectFilters() {
    var filterButtons = document.querySelectorAll("[data-filter]");
    var cards = document.querySelectorAll("[data-tags]");
    if (!filterButtons.length || !cards.length) {
      return;
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter");

        filterButtons.forEach(function (item) {
          item.classList.remove("is-active");
        });
        button.classList.add("is-active");

        cards.forEach(function (card) {
          var tags = card.getAttribute("data-tags") || "";
          var show = filter === "all" || tags.indexOf(filter) > -1;
          card.classList.toggle("hidden", !show);
        });
      });
    });
  }

  function initFormspreeForms() {
    var forms = document.querySelectorAll("form[data-formspree]");
    if (!forms.length) {
      return;
    }

    forms.forEach(function (form) {
      var status = form.querySelector("[data-form-status]");

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var target = event.currentTarget;
        var action = target.getAttribute("action");
        var method = target.getAttribute("method") || "POST";
        var formData = new FormData(target);

        if (status) {
          status.className = "form-status";
          status.textContent = "Sending message...";
        }

        fetch(action, {
          method: method,
          body: formData,
          headers: {
            Accept: "application/json",
          },
        })
          .then(function (response) {
            if (response.ok) {
              target.reset();
              if (status) {
                status.className = "form-status success";
                status.textContent = "Message sent. Thank you, I will reply soon.";
              }
              return;
            }

            return response.json().then(function (data) {
              if (!status) {
                return;
              }
              status.className = "form-status error";
              if (data && data.errors && Array.isArray(data.errors)) {
                status.textContent = data.errors
                  .map(function (error) {
                    return error.message;
                  })
                  .join(" ");
              } else {
                status.textContent = "Could not send your message. Please try again.";
              }
            });
          })
          .catch(function () {
            if (status) {
              status.className = "form-status error";
              status.textContent = "Network issue while sending. Please retry in a moment.";
            }
          });
      });
    });
  }

  function initResumePrint() {
    var trigger = document.querySelector("[data-action='print-resume']");
    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", function () {
      window.print();
    });
  }

  setCurrentYear();
  initMobileNav();
  initActiveNav();
  initRevealAnimations();
  initProjectFilters();
  initFormspreeForms();
  initResumePrint();
})();

