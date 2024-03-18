document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchUsername = document.getElementById('searchUsername');
    const repoGallery = document.getElementById('repoGallery');

    searchButton.addEventListener('click', () => {
        const username = searchUsername.value.trim();
        if (username) {
            fetchRepositories(username);
        }
    });

    async function fetchRepositories(username) {
        repoGallery.innerHTML = ''; // Clear previous results
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const repos = await response.json();
            displayRepositories(repos);
        } catch (error) {
            console.error('Error fetching repository data:', error);
            repoGallery.innerHTML = `<p>Error fetching repository data. Please try again.</p>`;
        }
    }

    function displayRepositories(repos) {
        if (repos.length === 0) {
            repoGallery.innerHTML = '<p>No repositories found.</p>';
            return;
        }

        repos.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.className = 'repository';
            repoElement.innerHTML = `
                <h2><a href="${repo.html_url}" target="_blank">${repo.name}</a></h2>
                <p>Description: ${repo.description ? repo.description : 'No description provided.'}</p>
                <p>Created at: ${new Date(repo.created_at).toLocaleDateString()}</p>
                <p>Last updated: ${new Date(repo.updated_at).toLocaleDateString()}</p>
                <p>Watchers: ${repo.watchers_count}</p>
                <button onclick="fetchLanguages('${repo.languages_url}', this)">Show Languages</button>
                <ul class="languages"></ul>
            `;
            repoGallery.appendChild(repoElement);
        });
    }

    async function fetchLanguages(languagesUrl, buttonElement) {
        try {
            const response = await fetch(languagesUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const languages = await response.json();
            const languagesList = buttonElement.nextElementSibling;
            languagesList.innerHTML = ''; // Clear previous results
            Object.keys(languages).forEach(language => {
                const languageItem = document.createElement('li');
                languageItem.textContent = language;
                languagesList.appendChild(languageItem);
            });
            buttonElement.disabled = true; // Prevent further clicks
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    }
});
