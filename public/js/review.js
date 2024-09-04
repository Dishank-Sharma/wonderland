////////////////////////
        //     Reviews
        ////////////////////////
        let stars = document.querySelectorAll(".fa-star");
        let ratingValue = document.getElementById('ratingValue');
        stars.forEach((star, index) => {
            star.addEventListener("click", () => setRating(index))
        });
        function setRating(rating) {
            ratingValue.value = 5 - rating;
            for (const star of stars) {
                if (star.classList.contains("fa-solid")) {
                    star.classList.remove("fa-solid");
                    star.classList.remove("solid-star");
                };
            };
            for (let i = 4; i >= rating; i--) {
                stars[i].classList.add("fa-solid");
                stars[i].classList.add("solid-star");
            };
        };
        ////////////////////////
        //     Show Reviews
        ////////////////////////
        let showNumber = document.querySelectorAll(".show-number");
        showNumber.forEach(num => {
            for (let i = 0; i < num.innerText; i++) {
                let star = document.createElement("i");
                star.classList.add("fa-solid");
                star.classList.add("fa-star");
                star.classList.add("solid-star");
                num.nextElementSibling.appendChild(star);
            };
            for (let i = 0; i < 5 - num.innerText; i++) {
                let star = document.createElement("i")
                star.classList.add("fa-regular");
                star.classList.add("fa-star");
                star.classList.add("show-star");
                num.nextElementSibling.appendChild(star);
            };
        })