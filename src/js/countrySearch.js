import API from './fetchCountries.js';
import countriesEl from '../templates/countriesList.hbs';
import countryCard from '../templates/country-card.hbs';

import { alert, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const debounce = require('lodash.debounce');

const refs = {
    inputForm: document.querySelector('.input-search'),
    cardContainer: document.querySelector('.js-card-container')
}

let searchCountry = '';

refs.inputForm.addEventListener(
  'input',
  debounce(() => {
    onSearch();
  }, 500),
);

function onSearch() {
    searchCountry = refs.inputForm.value;
    console.log(searchCountry)

    if (!searchCountry) {
        clearMarkup();
    return;
    }
    
    
    API.fetchCountries(searchCountry)
        .then(checkNumberOfCountries)
        .catch(onFetchError);
}


function checkNumberOfCountries(countries) {
    if (countries.length > 10) {
        clearMarkup();
        toMuchCountries();
    }
else if (countries.length <= 10 && countries.length > 1) {  
        clearMarkup();
        renderCountryCard(countriesEl, countries);
    }
else if (countries.length === 1) {
        clearMarkup();
        renderCountryCard(countryCard, countries[0]);
} else {
        clearMarkup();
        noResult();
    }
}

function renderCountryCard(template, countries) {
  const markup = template(countries);
  refs.cardContainer.insertAdjacentHTML('beforeend', markup);
}

function onFetchError(error) {
    console.log(error, "Упс")
};

function clearMarkup() {
    refs.cardContainer.innerHTML = ''; 
};


function toMuchCountries() {
    alert({
        text: "Too many matches found. Please enter a more specific query!'",
        delay: 3000,
    });
}

function noResult() {
    error({
        text: "No Result!",
        delay: 3000,
    });
}