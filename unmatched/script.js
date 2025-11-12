$(document).ready(function () {

    const $logoImg = $('.logo-img');
    if ($logoImg.length) {
        $logoImg.css({ opacity: 0, transform: 'scale(0.8)' });

        $logoImg.delay(100).animate({ opacity: 1 }, {
            duration: 1000,
            step: function (now, fx) {
                const scale = 0.8 + now * 0.2;
                $(this).css('transform', 'scale(' + scale + ')');
            },
            easing: 'swing'
        });
    }

    const sections = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));

    const $carouselContainer = $('#character-carousel');
    if ($carouselContainer.length) {
        const characters = [
            {
                name: "King Arthur",
                desc: "The classic hero wielding Excalibur, supported by Merlin. High damage output and strategic repositioning.",
                stats: "Strength: High, Defense: Medium, Style: Duelist",
                img: "artur.jpg"
            },
            {
                name: "Medusa",
                desc: "A powerful ranged character whose gaze can turn opponents to stone. Excellent for control and area denial.",
                stats: "Strength: High, Defense: Low, Style: Ranged Control",
                img: "med.jpg"
            },
            {
                name: "Sinbad",
                desc: "Gains power throughout the match as he completes his 'Seven Voyages'. A scaling powerhouse.",
                stats: "Strength: Medium, Defense: Medium, Style: Scaling Brawler",
                img: "sinbad.jpg"
            },
            {
                name: "Sherlock Holmes",
                desc: "The master detective who knows exactly what card you are holding. Focused on information and defense.",
                stats: "Strength: Low, Defense: High, Style: Defensive Control",
                img: "shr.jpg"
            },
            {
                name: "Dracula",
                desc: "Heals himself and his allies (Sisters of the Night) by dealing damage. Very aggressive and resilient.",
                stats: "Strength: High, Defense: Medium, Style: Aggro Lifesteal",
                img: "mar.jpg"
            }
        ];

        let currentIndex = 0;

        const renderCarousel = () => {
            const char = characters[currentIndex];
            $carouselContainer.empty();
            const card = `
                <div class="carousel-card p-4 row g-0">
                    <div class="col-md-5 d-flex flex-column align-items-center">
                        <img src="${char.img}" class="img-fluid" alt="${char.name}">
                        <span class="rank-tag mt-3">#${currentIndex + 1} Rank</span>
                    </div>
                    <div class="col-md-7 ps-md-4">
                        <h3 class="section-title mt-3 mt-md-0">${char.name}</h3>
                        <p>${char.desc}</p>
                        <h4 class="mt-4 text-white">Abilities & Style:</h4>
                        <p class="text-secondary">${char.stats}</p>
                    </div>
                </div>
            `;

            $carouselContainer.html(card);
        };

        $('#carousel-prev').on('click', function () {
            currentIndex = (currentIndex - 1 + characters.length) % characters.length;
            renderCarousel();
        });

        $('#carousel-next').on('click', function () {
            currentIndex = (currentIndex + 1) % characters.length;
            renderCarousel();
        });

        renderCarousel();
    }


    const CART_STORAGE_KEY = 'unmatchedCart';

    const getCart = () => JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    const saveCart = (cart) => localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

    const updateCartUI = () => {
        const cart = getCart();
        const $cartItemsContainer = $('#cart-items');
        const $cartTotalDisplay = $('#cart-total');

        if (!$cartItemsContainer.length) return;

        $cartItemsContainer.empty();
        let total = 0;

        if (cart.length === 0) {
            $cartItemsContainer.html('<p class="lead text-secondary text-center">Your cart is empty.</p>');
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const cartItemHtml = `
                    <div class="cart-item d-flex align-items-center mb-3 shadow-sm">
                        <img src="${item.image}" alt="${item.name}" class="me-3">
                        <div class="flex-grow-1">
                            <h5 class="text-white mb-0">${item.name}</h5>
                        </div>
                        <span class="price me-4 fw-bold" style="color: var(--accent-purple);">${item.price.toFixed(2)} GP</span>
                        <button class="btn btn-sm btn-danger remove-btn" data-index="${index}">
                            Remove
                        </button>
                    </div>
                `;
                $cartItemsContainer.append(cartItemHtml);
            });
        }
        $cartTotalDisplay.text(`${total.toFixed(2)} GP`);
    };

    window.addToCart = (productName, price, image) => {
        const cart = getCart();
        const product = { name: productName, price: parseFloat(price), image: image, timestamp: Date.now() };
        cart.push(product);
        saveCart(cart);
        alert(`"${productName}" added to cart!`);
        updateCartUI();
    };

    window.removeFromCart = (index) => {
        const cart = getCart();
        if (index >= 0 && index < cart.length) {
            const removed = cart.splice(index, 1);
            saveCart(cart);
            alert(`"${removed[0].name}" removed from cart.`);
            updateCartUI();
        }
    };

    const placeOrder = () => {
        localStorage.removeItem(CART_STORAGE_KEY);
        updateCartUI();
        alert("🎉 Order placed successfully!");
    };

    const clearCart = () => {
        localStorage.removeItem(CART_STORAGE_KEY);
        updateCartUI();
        alert("Cart has been cleared.");
    };

    $('#clear-cart-btn').on('click', clearCart);
    $('#checkout-btn').on('click', placeOrder);
    $('#cart-items').on('click', '.remove-btn', function () {
        const index = $(this).data('index');
        window.removeFromCart(index);
    });

    updateCartUI();


    // --- Roster Management (CRUD for about.html) ---
    const ROSTER_STORAGE_KEY = 'unmatchedCustomRoster';

    const initialRosterData = [
        { id: 1, name: "King Arthur", ability: "You may boost your attack or defense value with a card from your hand.", hp: 16, isCustom: false, set: "BoL Vol.1" },
        { id: 2, name: "Medusa", ability: "After you deal damage, move the opposing fighter up to 2 spaces.", hp: 14, isCustom: false, set: "BoL Vol.1" },
        { id: 3, name: "Sinbad", ability: "Gain an additional action during your turn for each of your 7 'Voyage' cards played.", hp: 17, isCustom: false, set: "BoL Vol.1" },
        { id: 4, name: "Alice", ability: "At the start of your turn, you may change your size (Small/Large) and move to that area.", hp: 13, isCustom: false, set: "BoL Vol.1" },
        { id: 5, name: "Robin Hood", ability: "After an attack, you may deal 1 damage to any opposing fighter adjacent to the target.", hp: 12, isCustom: false, set: "BoL Vol.2" },
        { id: 6, name: "Bigfoot", ability: "At the start of your turn, you may move up to 1 space.", hp: 16, isCustom: false, set: "BoL Vol.2" },
        { id: 7, name: "Red Riding Hood", ability: "After maneuvering, you may look at 1 random card in an opponent's hand.", hp: 15, isCustom: false, set: "BoL Vol.2" },
        { id: 8, name: "Beowulf", ability: "After winning a combat, Beowulf heals 1 for each 'Aid' card in his discard pile.", hp: 15, isCustom: false, set: "BoL Vol.2" },
        { id: 9, name: "Sun Wukong", ability: "When you play a Scheme card, shuffle that card back into your deck after resolving its effect.", hp: 15, isCustom: false, set: "BoL Vol.3" },
        { id: 10, name: "Bloody Mary", ability: "You have 1 extra move action per turn. You can discard a card to gain 1 maneuver action.", hp: 14, isCustom: false, set: "BoL Vol.3" },
        { id: 11, name: "Dracula", ability: "When you deal damage, your fighter recovers that amount of health.", hp: 16, isCustom: false, set: "Cobble & Fog" },
        { id: 12, name: "Sherlock Holmes", ability: "Sherlock's and Watson's card effects can't be canceled.", hp: 16, isCustom: false, set: "Cobble & Fog" },
        { id: 13, name: "Houdini", ability: "After an attack or defense, you may return the card to your hand.", hp: 14, isCustom: false, set: "Houdini vs Genie" },
        { id: 14, name: "The Genie", ability: "The Genie can exchange a card from his hand for any card from his discard pile.", hp: 16, isCustom: false, set: "Houdini vs Genie" }
    ];

    const getRoster = () => {
        const customRoster = JSON.parse(localStorage.getItem(ROSTER_STORAGE_KEY) || '[]');
        return initialRosterData.concat(customRoster);
    };

    const saveCustomRoster = (roster) => {
        const customOnly = roster.filter(char => char.isCustom);
        localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(customOnly));
    };

    const renderCharactersTable = (filterTerm = '') => {
        const $tableBody = $('#characters-table-body');
        if ($tableBody.length === 0) return;

        $tableBody.empty();
        let roster = getRoster();
        const lowerCaseFilter = filterTerm.toLowerCase();

        if (lowerCaseFilter) {
            roster = roster.filter(char =>
                char.name.toLowerCase().includes(lowerCaseFilter)
            );
        }

        roster.forEach((char) => {
            const actionsHtml = char.isCustom ?
                `<button class="btn btn-sm btn-info edit-char-btn me-2" data-id="${char.id}">
                    Edit
                </button>
                <button class="btn btn-sm btn-danger delete-char-btn" data-id="${char.id}">
                    Delete
                </button>`
                : '';

            const row = `
                <tr data-char-id="${char.id}" class="${char.isCustom ? 'table-warning' : ''}">
                    <td data-field="name">${char.name} ${char.isCustom ? '<span class="badge bg-primary">Custom</span>' : ''}</td>
                    <td data-field="ability">${char.ability}</td>
                    <td data-field="hp"><span class="badge bg-success">${char.hp}</span></td>
                    <td>${actionsHtml}</td>
                </tr>
            `;
            $(row).css('display', 'none').appendTo($tableBody).fadeIn(500);
        });

        if (roster.length === 0) {
            $tableBody.append(`<tr><td colspan="4" class="text-center text-secondary">No characters found matching the search term.</td></tr>`);
        }
    };

    const addCharacter = (name, ability, hp) => {
        const customRoster = JSON.parse(localStorage.getItem(ROSTER_STORAGE_KEY) || '[]');
        const newId = Date.now();
        const newChar = {
            id: newId,
            name: name,
            ability: ability,
            hp: parseInt(hp),
            isCustom: true
        };

        customRoster.push(newChar);
        localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(customRoster));

        renderCharactersTable();
        alert(`Character "${name}" successfully added to the roster!`);
    };

    const deleteCharacter = (id) => {
        if (!confirm("Are you sure you want to delete this character?")) return;

        let customRoster = JSON.parse(localStorage.getItem(ROSTER_STORAGE_KEY) || '[]');
        const charIndex = customRoster.findIndex(char => char.id == id);

        if (charIndex !== -1) {
            customRoster.splice(charIndex, 1);
            localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(customRoster));

            $(`tr[data-char-id="${id}"]`).fadeOut(300, function () {
                $(this).remove();
            });
        }
    };

    const startEdit = (row) => {
        const id = row.data('char-id');
        const $fields = row.find('td[data-field]');

        $fields.each(function () {
            const $td = $(this);
            const field = $td.data('field');
            let inputHtml;

            if (field === 'hp') {
                const hpValue = $td.find('.badge').text().trim();
                inputHtml = `<input type="number" class="form-control form-control-sm" min="6" max="20" value="${hpValue}" required>`;
            } else if (field === 'name') {
                const nameOnly = $td.text().replace('Custom', '').trim();
                inputHtml = `<input type="text" class="form-control form-control-sm" value="${nameOnly}" required>`;
            } else {
                const currentValue = $td.text().trim();
                inputHtml = `<input type="text" class="form-control form-control-sm" value="${currentValue}" required>`;
            }
            $td.html(inputHtml);
        });

        row.find('.edit-char-btn')
            .removeClass('btn-info edit-char-btn')
            .addClass('btn-success save-char-btn')
            .text('Save');
    };

    const saveEdit = (row) => {
        const id = row.data('char-id');

        const newName = row.find('td[data-field="name"] input').val();
        const newAbility = row.find('td[data-field="ability"] input').val();
        const newHp = parseInt(row.find('td[data-field="hp"] input').val());

        if (!newName || !newAbility || newHp < 6 || newHp > 20 || isNaN(newHp)) {
            alert("Error: Please enter valid values (HP must be 6 to 20).");
            return;
        }

        let customRoster = JSON.parse(localStorage.getItem(ROSTER_STORAGE_KEY) || '[]');
        const charIndex = customRoster.findIndex(char => char.id == id);

        if (charIndex !== -1) {
            customRoster[charIndex].name = newName;
            customRoster[charIndex].ability = newAbility;
            customRoster[charIndex].hp = newHp;
            localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(customRoster));

            const $fields = row.find('td[data-field]');

            $fields.each(function () {
                const $td = $(this);
                const field = $td.data('field');
                let value = $td.find('input').val();

                if (field === 'hp') {
                    $td.html(`<span class="badge bg-success">${value}</span>`);
                } else if (field === 'name') {
                    $td.html(`${value} <span class="badge bg-primary">Custom</span>`);
                } else {
                    $td.text(value);
                }
            });

            row.find('.save-char-btn')
                .removeClass('btn-success save-char-btn')
                .addClass('btn-info edit-char-btn')
                .text('Edit');

            alert(`Character "${newName}" updated.`);
        }
    };


    renderCharactersTable();

    $('#character-search').on('keyup', function () {
        const searchTerm = $(this).val();
        renderCharactersTable(searchTerm);
    });

    $('#suggest-character-form').on('submit', function (e) {
        e.preventDefault();

        const name = $('#char-name').val().trim();
        const ability = $('#char-ability').val().trim();
        const hp = $('#char-hp').val();

        if (name === "" || ability === "" || hp < 6 || hp > 20) {
            alert("Please fill out all fields correctly (HP must be 6 to 20).");
            return;
        }

        addCharacter(name, ability, hp);
        this.reset();
    });

    $('#characters-table-body').on('click', '.delete-char-btn', function () {
        const charId = $(this).data('id');
        deleteCharacter(charId);
    });

    $('#characters-table-body').on('click', '.edit-char-btn', function () {
        const $row = $(this).closest('tr');
        startEdit($row);
    });

    $('#characters-table-body').on('click', '.save-char-btn', function () {
        const $row = $(this).closest('tr');
        saveEdit($row);
    });


    // --- Form Validation (5.1 & 5.3) ---
    const $regForm = $('#registration-form');
    const $regEmail = $('#reg-email');
    const $regPassword = $('#reg-password');
    const $regConfirm = $('#reg-password-confirm');
    const $strengthIndicator = $('#password-strength');
    const $successAlert = $('#registration-success-alert');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length > 5) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d\s:]/)) strength++;

        let color = 'bg-danger';
        let text = 'Weak';

        if (strength > 3) {
            color = 'bg-success';
            text = 'Strong';
        } else if (strength > 1) {
            color = 'bg-warning';
            text = 'Medium';
        }

        $strengthIndicator.html(`Strength: <strong>${text}</strong>`).removeClass('bg-danger bg-warning bg-success').addClass(color).slideDown(150);
        return strength > 2;
    };

    const validateEmail = () => {
        const isValid = emailRegex.test($regEmail.val());
        $regEmail.toggleClass('is-invalid', !isValid).toggleClass('is-valid', isValid);
        return isValid;
    };

    const validateConfirmPassword = () => {
        const match = $regPassword.val() === $regConfirm.val();
        const required = $regConfirm.val().length > 0;

        if (required && !match) {
            $regConfirm.removeClass('is-valid').addClass('is-invalid');
        } else if (match && required) {
            $regConfirm.removeClass('is-invalid').addClass('is-valid');
        } else if (!required) {
            $regConfirm.removeClass('is-valid is-invalid');
        }
        return match;
    };

    $regEmail.on('keyup', validateEmail);

    $regPassword.on('keyup', function () {
        const isStrong = checkPasswordStrength($(this).val());
        $(this).toggleClass('is-invalid', !isStrong).toggleClass('is-valid', isStrong);
        validateConfirmPassword();
    });

    $regConfirm.on('keyup', validateConfirmPassword);

    $regForm.on('submit', function (e) {
        e.preventDefault();

        let isFormValid = true;

        const $requiredFields = $regForm.find('input[required]');
        $requiredFields.each(function () {
            const $input = $(this);
            if ($input.val().trim() === '') {
                $input.addClass('is-invalid');
                isFormValid = false;
            } else {
                $input.removeClass('is-invalid');
            }
        });

        if (!validateEmail()) isFormValid = false;

        if (!checkPasswordStrength($regPassword.val())) {
            $regPassword.removeClass('is-valid').addClass('is-invalid');
            isFormValid = false;
        }

        if (!validateConfirmPassword()) isFormValid = false;

        if (isFormValid) {
            $regForm.find('input').val('');
            $regForm.find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
            $strengthIndicator.slideUp(150);

            $successAlert.slideDown(300).delay(2000).slideUp(300, function () {
                $('#registrationModal').modal('hide');
            });
        }
    });

    $('#registrationModal').on('hidden.bs.modal', function () {
        $regForm[0].reset();
        $regForm.find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
        $strengthIndicator.slideUp(150);
        $successAlert.hide();
    });

    // --- Catalog Filter and Lightbox (5.5) ---

    // 1. Lightbox Logic
    $('#product-list').on('click', '.product-img', function () {
        const $img = $(this);
        const name = $img.data('name');
        const desc = $img.data('desc');
        const src = $img.attr('src');
        const price = $img.closest('.product-card').find('.price').text();
        const itemImage = src.split('/').pop(); // Only file name

        $('#lightbox-image').attr('src', src);
        $('#lightbox-name').text(name);
        $('#lightbox-desc').text(`${desc} | Price: ${price}`);

        // Prepare add to cart button data for lightbox
        $('#lightbox-add-to-cart').off('click').on('click', function () {
            // Price extraction requires a little hack since we only have the text price
            const priceValue = parseFloat(price.replace(' GP', ''));
            window.addToCart(name, priceValue, itemImage);
            $('#lightboxModal').modal('hide');
        });

        $('#lightboxModal').modal('show');
    });

    // 2. Filter Logic
    $('.filter-btn').on('click', function () {
        const filterValue = $(this).data('filter');
        const $items = $('.product-item');

        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        $items.fadeOut(300); // Fade out all items (jQuery animation)

        setTimeout(() => {
            $items.filter(function () {
                if (filterValue === 'all') {
                    return true;
                }
                // Filter based on the data-fighters attribute
                return $(this).data('fighters') == filterValue;
            }).fadeIn(300); // Fade in matching items (jQuery animation)
        }, 300);
    });

});

(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()