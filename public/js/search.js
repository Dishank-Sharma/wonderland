let search = document.getElementById("search-listing");
let iconSearch = document.getElementById("searchIcon");
let searchForm = document.querySelector(".searchForm")

iconSearch.addEventListener("click", () => {

    if (searchForm.style.display === 'none' || searchForm.style.display === '') {
        searchForm.style.display = 'block';
      } else {
        searchForm.style.display = 'none';
      }
});

document.addEventListener('click', (event) => {
    // Check if the click was outside the form and icon
    if (!searchForm.contains(event.target) && !iconSearch.contains(event.target)) {
      searchForm.style.display = 'none';
    }
  });

let getListing = async () => {
    let listing = await fetch("/listings/search-Suggestion", { method: "POST" });
    if (listing.ok) {
        let allListing = await listing.json();
        showSuggestion(allListing);
    };
};
getListing()

let search_ul = document.querySelector(".nav-search ul");
let search_li = document.querySelectorAll(".search_li");
let submit = document.querySelector(".submit");
let form = document.querySelector(".searchForm")

submit.addEventListener("click", () => {
    form.submit();
});



let showSuggestion = (listings) => {
    search.addEventListener("input", () => {
        if (search.value.length <= 2) {
            search.style.borderRadius = '20px';
            search_ul.innerHTML = "";
        }

        if (search.value.length > 2) {
            search_ul.innerHTML = "";
            search.style.borderRadius = '20px';
            let country = [];

            listings.forEach(listing => {

                if (listing.country.toLowerCase().includes(search.value.toLowerCase())) {

                    if (country.indexOf(listing.country) < 0) {
                        search.style.borderRadius = '20px 20px 0 0';
                        let li = document.createElement("li");
                        li.innerText = listing.country;
                        li.classList.add("search_li")
                        search_ul.appendChild(li);
                        country.push(listing.country);
                        
                        li.addEventListener("click", () => {
                            search.value = li.textContent
                            search_ul.innerHTML = "";
                            search.style.borderRadius = '20px';
                            form.submit();
                        });
                    }
                }
            });
        }
    });
};
