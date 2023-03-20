/* A constant variable that is used to store the URL of the GitHub API. */
const APIURL = 'https://api.github.com/users/'

/* Getting the elements from the HTML file. */
const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

/**
 * It's an async function that takes a username as an argument, and then it tries to get the user's
 * data from the API, and if it succeeds, it creates a user card and gets the user's repos, and if it
 * fails, it creates an error card.
 * @param username - The username of the user you want to get information about.
 */
async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username)

    createUserCard(data)
    getRepos(username)
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard('No profile with this username')
    }
  }
}

/**
 * It takes a username as an argument, makes an API call to GitHub, and then adds the repos to the
 * card.
 * @param username - The username of the user you want to fetch repos for
 */
async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + '/repos?sort=created')

    addReposToCard(data)
  } catch (err) {
    createErrorCard('Problem fetching repos')
  }
}

/**
 * It takes a user object as an argument, and returns a string of HTML that represents a user card.
 * @param user - the user object
 */
function createUserCard(user) {
  const userID = user.name || user.login
  const userBio = user.bio ? `<p>${user.bio}</p>` : ''
  const cardHTML = `
    <div class="card">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}
      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
      </ul>
      <div id="repos"></div>
    </div>
  </div>
    `
  main.innerHTML = cardHTML
}

/**
 * This function takes a string as an argument and returns a card with the string as the card's
 * content.
 * @param msg - The error message to display
 */
function createErrorCard(msg) {
  const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `

  main.innerHTML = cardHTML
}

/**
 * It takes an array of GitHub repositories and adds the first five to the DOM
 * @param repos - an array of objects, each object representing a repo
 */
function addReposToCard(repos) {
  const reposEl = document.getElementById('repos')

  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement('a')
    repoEl.classList.add('repo')
    repoEl.href = repo.html_url
    repoEl.target = '_blank'
    repoEl.innerText = repo.name

    reposEl.appendChild(repoEl)
  })
}

/* It's an event listener that listens for a submit event on the form element. When the event
is triggered, it prevents the default behavior of the form, which is to reload the page. Then it
gets the value of the search input, and if it's not empty, it calls the getUser function with the
value of the search input as an argument. Finally, it clears the search input. */
form.addEventListener('submit', (e) => {
  e.preventDefault()

  const user = search.value

  if (user) {
    getUser(user)

    search.value = ''
  }
})
