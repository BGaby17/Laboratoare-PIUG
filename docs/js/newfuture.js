// cod javascript pentru dark mode toggle
const toggle = document.getElementById('dark-mode-toggle');
const html = document.documentElement; // în loc de body

// dacă utilizatorul a mai ales dark mode anterior, îl păstrăm
if (localStorage.getItem('theme') === 'dark') {
  html.classList.add('dark-mode');
  toggle.checked = true;
}

toggle.addEventListener('change', function() {
  if (this.checked) {
    html.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
});


// cod javascript pentru filtrarea portofoliului

// debounce util
function debounce(fn, wait) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const searchInput = document.getElementById("searchInput");
const itemsSelector = "#portfolio .portfolio-item";

function refreshCarouselsAndLayout() {
  // forțăm un resize global (unele plugin-uri ascultă resize)
  window.dispatchEvent(new Event('resize'));

  // încercăm refresh pentru plugin-urile comune (să nu arunce eroare dacă nu sunt)
  try {
    if (window.jQuery) {
      const $ = window.jQuery;
      if ($.fn.owlCarousel) {
        $('.carousel').each(function() {
          $(this).trigger('refresh.owl.carousel');
        });
      }
      if ($.fn.flickity) {
        $('.carousel').flickity('resize');
      }
    }
  } catch (e) {
    // ignorăm erorile de refresh
  }
}


function normalizeString(str) {
  if (!str) return "";
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

const onSearch = debounce(function() {
  const searchValue = normalizeString(this.value || "");
  const items = document.querySelectorAll(itemsSelector);

  // dacă ai Isotope, folosește filtrarea lui (păstrează layout-ul)
  if (window.jQuery && window.jQuery.fn && window.jQuery.fn.isotope) {
    const $ = window.jQuery;
    const $grid = $('#portfolio');
    $grid.isotope({ filter: function() {
      const $item = $(this);
      const title = normalizeString($item.find('.portfolio-description h3').text() || '');
      const city  = normalizeString($item.find('.portfolio-description span').text() || '');
      const all   = normalizeString($item.text() || '');
      return searchValue === '' || title.includes(searchValue) || city.includes(searchValue) || all.includes(searchValue);
    }});
    return;
  }

  // fallback: ascunde/arată elementele manual
  items.forEach(item => {
    const titleEl = item.querySelector('.portfolio-description h3');
    const cityEl  = item.querySelector('.portfolio-description span');
    const text = normalizeString(
      (titleEl ? titleEl.innerText : '') + ' ' +
      (cityEl ? cityEl.innerText : '') + ' ' +
      item.innerText
    );
    const match = searchValue === "" || text.includes(searchValue);
    item.style.display = match ? "" : "none";
  });

  // forțăm re-layout / reinit caruseluri (fără scroll)
  refreshCarouselsAndLayout();
}, 180);

// ...existing code...
if (searchInput) searchInput.addEventListener("input", onSearch);

// cod javascript pentru toggle meniul principal și header transparent

document.addEventListener("DOMContentLoaded", function() {
  const header = document.getElementById("header");
  const menuTrigger = document.querySelector("#mainMenu-trigger a");

  if (!header || !menuTrigger) return;

  menuTrigger.addEventListener("click", function() {

    // dacă header are clasa "manipagi" și data-transparent="false"
    if (header.classList.contains("manipagi") && header.getAttribute("data-transparent") === "false") {
      // nu facem toggle, îl lăsăm pe false
      return;
    }

    // altfel, funcționează normal
    const isTransparent = header.getAttribute("data-transparent") === "true";
    header.setAttribute("data-transparent", isTransparent ? "false" : "true");
  });
});
