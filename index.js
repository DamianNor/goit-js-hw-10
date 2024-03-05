document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.getElementById('search-box');
    const countryInfo = document.querySelector('.country-info');

    searchBox.addEventListener('input', _.debounce(searchCountries, 300));

    function searchCountries() {
        const searchQuery = searchBox.value.trim();

        if (!searchQuery) {
            countryInfo.innerHTML = '';
            return;
        }

        fetch(`https://restcountries.com/v3.1/name/${searchQuery}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Not found');
                }
                return response.json();
            })
            .then(data => {
                if (data.length > 10) {
                    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
                } else if (data.length >= 2 && data.length <= 10) {
                    displayCountryList(data);
                } else if (data.length === 1) {
                    displayCountryDetails(data[0]);
                }
            })
            .catch(() => {
                Notiflix.Notify.failure("Oops, there is no country with that name");
                countryInfo.innerHTML = '';
            });
    }

    function displayCountryList(countries) {
        const markup = countries.map(country => `
            <li>
                <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="50">
                ${country.name.common}
            </li>
        `).join('');
        countryInfo.innerHTML = `<ul>${markup}</ul>`;
    }

    function displayCountryDetails(country) {
        const languages = Object.values(country.languages || {}).join(', ');
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p>Capital: ${country.capital}</p>
            <p>Population: ${country.population}</p>
            <p>Languages: ${languages}</p>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="100">
        `;
    }
});
