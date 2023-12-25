let jsonContainer = document.querySelector('.json-container')

fetch('http://localhost:3000/proxy')
    .then(response => response.json())
    .then(data => {jsonContainer.textContent = JSON.stringify(data)})

jsonContainer.textContent = 'Loading...'

