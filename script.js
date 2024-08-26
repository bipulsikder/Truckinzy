const apiKey = "1b29721445729a345e7d316f517c65e5";
const appscriptUrl = "https://script.google.com/macros/s/AKfycbypvXIZo2-YCzkwEH4wRJk_2EnVELWNuJOa_aBIUc2-WV8tRVIEb-0XZw5iWdhMUJ8/exec";

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('multiStepForm');
    const steps = Array.from(document.getElementsByClassName('form-step'));
    let currentStep = 0;

    function showSuggestions(input, suggestionDivId) {
        const query = input.value;
        const suggestionDiv = document.getElementById(suggestionDivId);
        suggestionDiv.innerHTML = '';
        if (query.length < 3) return;
        fetch(`https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/autocomplete?query=${query}`)
            .then(response => response.json())
            .then(data => {
                data.suggestedLocations.forEach(location => {
                    const div = document.createElement('div');
                    div.textContent = location.placeName;
                    div.onclick = () => {
                        input.value = location.placeName;
                        suggestionDiv.innerHTML = '';
                    };
                    suggestionDiv.appendChild(div);
                });
            });
    }

    function nextStep(step) {
        if (validateStep(currentStep)) {
            steps[currentStep].classList.remove('active');
            currentStep = step;
            steps[currentStep].classList.add('active');
        }
    }

    function prevStep(step) {
        steps[currentStep].classList.remove('active');
        currentStep = step - 2;
        steps[currentStep].classList.add('active');
    }

    function validateStep(step) {
        const inputs = steps[step].querySelectorAll('input, select');
        for (let input of inputs) {
            if (!input.checkValidity()) {
                input.reportValidity();
                return false;
            }
        }
        return true;
    }

    function validateForm() {
        return validateStep(currentStep);
    }

    function submitForm() {
        const loadingLocation = document.getElementById('loadingLocation').value;
        const unloadingLocation = document.getElementById('unloadingLocation').value;
        const numberOfTyres = document.getElementById('numberOfTyres').value;
        const builtType = document.getElementById('builtType').value;
        const companyName = document.getElementById('companyName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;

        const formData = {
            loadingLocation,
            unloadingLocation,
            numberOfTyres,
            builtType,
            companyName,
            phoneNumber
        };

        fetch(appscriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(() => {
            document.getElementById('multiStepForm').reset();
            steps.forEach(step => step.classList.remove('active'));
            document.getElementById('successMessage').classList.add('active');
        }).catch(error => console.error('Error:', error));
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });

    window.showSuggestions = showSuggestions;
    window.nextStep = nextStep;
    window.prevStep = prevStep;
    window.submitForm = submitForm;
});
