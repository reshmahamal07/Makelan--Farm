
document.addEventListener("DOMContentLoaded", () => {

    // PRODUCT SEARCH, FILTER AND SORT
    const productList = document.querySelector(".product-list");
    const searchInput = document.querySelector("#product-search");
    const filterButtons = document.querySelectorAll("[data-filter]");
    const sortSelect = document.querySelector("#sort-products");
    const status = document.querySelector("#product-status");

    if (productList && searchInput && sortSelect && status) {

        const products = Array.from(
            productList.querySelectorAll(".product-card")
        );

        let activeFilter = "all";

        function updateProducts() {
            const searchText = searchInput.value.toLowerCase().trim();

            const visibleProducts = products.filter(product => {
                const category = product.dataset.category;

                const matchesFilter =
                    activeFilter === "all" || category === activeFilter;

                const matchesSearch =
                    product.textContent.toLowerCase().includes(searchText);

                return matchesFilter && matchesSearch;
            });

            const sortValue = sortSelect.value;

            visibleProducts.sort((a, b) => {
                if (sortValue === "name-asc") {
                    return a.querySelector("h3").textContent.localeCompare(
                        b.querySelector("h3").textContent
                    );
                }

                if (sortValue === "name-desc") {
                    return b.querySelector("h3").textContent.localeCompare(
                        a.querySelector("h3").textContent
                    );
                }

                if (sortValue === "price-asc") {
                    return Number(a.dataset.price) - Number(b.dataset.price);
                }

                if (sortValue === "price-desc") {
                    return Number(b.dataset.price) - Number(a.dataset.price);
                }

                return 0;
            });

            products.forEach(product => {
                product.hidden = !visibleProducts.includes(product);
            });

            visibleProducts.forEach(product => {
                productList.appendChild(product);
            });

            status.textContent =
                `Showing ${visibleProducts.length} of ${products.length} products`;
        }

        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                activeFilter = button.dataset.filter;

                filterButtons.forEach(item => {
                    item.setAttribute(
                        "aria-pressed",
                        String(item === button)
                    );
                });

                updateProducts();
            });
        });

        searchInput.addEventListener("input", updateProducts);
        sortSelect.addEventListener("change", updateProducts);

        updateProducts();
    }


    // CONTACT FORM VALIDATION AND BROWSER STORAGE
    const contactForm = document.querySelector("#contact-form");

    if (contactForm) {
        const nameInput = document.querySelector("#contact-name");
        const emailInput = document.querySelector("#contact-email");
        const messageInput = document.querySelector("#contact-message");
        const formStatus = document.querySelector("#form-status");

        const fields = [
            {
                input: nameInput,
                error: document.querySelector("#name-error"),
                message: "Please enter your name."
            },
            {
                input: emailInput,
                error: document.querySelector("#email-error"),
                message: "Please enter a valid email address."
            },
            {
                input: messageInput,
                error: document.querySelector("#message-error"),
                message: "Please enter a message."
            }
        ];

        function showError(field, message) {
            field.error.textContent = message;
            field.input.setAttribute("aria-invalid", "true");
        }

        function clearError(field) {
            field.error.textContent = "";
            field.input.removeAttribute("aria-invalid");
        }

        fields.forEach(field => {
            field.input.addEventListener("input", () => {
                clearError(field);
            });
        });

        contactForm.addEventListener("submit", event => {
            event.preventDefault();

            let formIsValid = true;

            fields.forEach(field => {
                clearError(field);

                if (!field.input.value.trim()) {
                    showError(field, field.message);
                    formIsValid = false;
                }
            });

            if (
                emailInput.value.trim() &&
                !emailInput.checkValidity()
            ) {
                showError(
                    fields[1],
                    "Please enter a valid email address."
                );
                formIsValid = false;
            }

            if (!formIsValid) {
                formStatus.textContent =
                    "Please correct the errors before saving your message.";

                const firstInvalidField = contactForm.querySelector(
                    '[aria-invalid="true"]'
                );

                firstInvalidField.focus();
                return;
            }

            const contactDetails = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };

            try {
                localStorage.setItem(
                    "farmContactMessage",
                    JSON.stringify(contactDetails)
                );

               formStatus.textContent =
    "Your message has been saved successfully.";

const savedMessage = document.querySelector("#saved-message");

if (savedMessage) {
    savedMessage.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Your saved message";

    const name = document.createElement("p");
    name.textContent = "Name: " + contactDetails.name;

    const email = document.createElement("p");
    email.textContent = "Email: " + contactDetails.email;

    const message = document.createElement("p");
    message.textContent = "Message: " + contactDetails.message;

    savedMessage.append(heading, name, email, message);
}

contactForm.reset();
            } catch (error) {
                formStatus.textContent =
                    "Your message could not be saved in this browser.";
            }
        });
    }


    // POPOVER MENU
    const popoverButton = document.querySelector("#popover-button");
    const popoverContent = document.querySelector("#popover-content");

    if (popoverButton && popoverContent) {

        popoverButton.addEventListener("click", () => {
            const isOpen =
                popoverButton.getAttribute("aria-expanded") === "true";

            popoverButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            popoverContent.hidden = isOpen;
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && !popoverContent.hidden) {
                popoverContent.hidden = true;
                popoverButton.setAttribute("aria-expanded", "false");
                popoverButton.focus();
            }
        });
    }

});
