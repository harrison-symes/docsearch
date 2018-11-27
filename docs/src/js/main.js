docsearch({
  apiKey: '25626fae796133dc1e734c6bcaaeac3c',
  indexName: 'docsearch',
  inputSelector: '.custom-search-input',
  debug: false,
});

(function() {
  const applyForm = document.querySelector('.custom-apply-form');
  if (!applyForm) {
    return;
  }

  applyForm.onsubmit = submitForm;

  // Return the value of a given input
  function getValue(inputName) {
    const input = applyForm.querySelector(`input[name=${inputName}]`);
    if (input.type === 'checkbox') {
      return input.checked;
    }
    return input.value;
  }

  // POST data to a url and call callback with the result
  function postJSON(url, data, callback) {
    const request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function() {
      callback(request.responseText);
    };
    request.send(JSON.stringify(data));
  }

  // Called with the response from the hub
  function onHubResponse(response) {
    // If it's JSON it's an error
    if (response[0] === '[') {
      const errors = JSON.parse(response);
      displayErrors(errors);
      return;
    }
    displaySuccess();
  }

  function clearAllErrors() {
    const inputSteps = applyForm.querySelectorAll('.form-step');
    inputSteps.forEach(inputStep => {
      inputStep.classList.remove('form-step__error');
    });
  }

  function displayErrors(errors) {
    clearAllErrors();
    errors.forEach(error => {
      const inputName = error.param;
      const formStep = applyForm.querySelector(
        `.form-step[name=step-${inputName}]`
      );
      formStep.classList.add('form-step__error');
      formStep.querySelector('.form-error').innerHTML = error.msg;
    });
  }

  function displaySuccess() {
    const formThankYou = document.querySelector('.custom-form-thank-you');
    const formContent = document.querySelector('.custom-form-content');
    const placeholderEmail = document.querySelector(
      '.custom-placeholder-email'
    );
    const placeholderUrl = document.querySelector('.custom-placeholder-url');

    const email = getValue('email');
    const documentationUrl = getValue('documentationUrl');

    placeholderEmail.innerText = email;
    placeholderUrl.innerText = documentationUrl;

    formContent.classList.toggle('hidden');
    formThankYou.classList.toggle('hidden');
  }

  function submitForm(event) {
    event.preventDefault();

    const url = applyForm.getAttribute('action');
    const payload = {
      documentationUrl: getValue('documentationUrl'),
      githubUrl: getValue('githubUrl'),
      email: getValue('email'),
      algoliaPolicy: getValue('algoliaPolicy'),
    };

    postJSON(url, payload, onHubResponse);
  }
})();
