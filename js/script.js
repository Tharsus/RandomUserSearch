let inputName = document.getElementById('inputName');
let searchBtn = document.getElementById('searchBtn');

let content = document.getElementById('content');
let loading = document.getElementById('loading');

let users = [];
let filteredUsers = [];

function start() {
  fetchUsersAsync();
  preventFormSubmit();
  activeInput();
}

// Search for users in the randomuser API
async function fetchUsersAsync() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  users = json.results.map((person) => {
    return {
      //name: [person.name.first, person.name.last],
      name: {
        first: person.name.first,
        last: person.name.last,
      },
      picture: person.picture,
      dob: person.dob.age,
      gender: person.gender,
    };
  });

  content.style.display = 'block';
  loading.style.display = 'none';
}

// Prevent default submit
function preventFormSubmit() {
  function handleFormSubmit(event) {
    event.preventDefault();
  }

  var form = document.querySelector('form');
  form.addEventListener('submit', handleFormSubmit);
}

// Defines the interaction button or Enter pressed
function activeInput() {
  // Filter users case insensitive
  function searchName(inputName) {
    filteredUsers = users
      .filter((person) => {
        return (
          (
            person.name.first.toLowerCase() +
            ' ' +
            person.name.last.toLowerCase()
          ).indexOf(inputName.toLowerCase()) !== -1
        );
      })
      .sort((a, b) => {
        if (a.name.first < b.name.first) return -1;
        if (a.name.first > b.name.first) return 1;
        if (a.name.last < b.name.last) return -1;
        if (a.name.last > b.name.last) return 1;
        return 0;
      });

    render();
  }

  // When user clicks on button
  searchBtn.addEventListener('click', () => searchName(inputName.value));

  // When user clicks on enter
  inputName.addEventListener('keyup', (event) => {
    if (inputName.value === '') {
      searchBtn.classList.add('disabled');
    } else {
      searchBtn.classList.remove('disabled');
    }

    if (event.key === 'Enter') {
      searchName(inputName.value);
    }
  });
}

function render() {
  function renderResults() {
    let divResults = document.getElementById('searchResults');
    divResults.innerHTML = '';

    let h = document.createElement('h4');
    h.textContent = filteredUsers.length + ' user(s) found';
    h.classList.add('section');
    divResults.appendChild(h);

    let ul = document.createElement('ul');

    for (let i = 0; i < filteredUsers.length; i++) {
      let currentUser = filteredUsers[i];

      let li = document.createElement('li');
      let img = document.createElement('img');
      let span = document.createElement('span');
      span.textContent =
        currentUser.name.first +
        ' ' +
        currentUser.name.last +
        ', ' +
        currentUser.dob +
        ' years';
      img.src = currentUser.picture.thumbnail;
      img.classList.add('thumbnail');

      li.appendChild(img);
      li.appendChild(span);
      li.classList.add('valign-wrapper');

      ul.appendChild(li);
    }

    ul.classList.add('left-align');
    divResults.appendChild(ul);
  }

  function renderStatistics() {
    function computeStatistics() {
      // male = number of males of the search results
      const male = filteredUsers.filter((person) => {
        return person.gender === 'male';
      }).length;

      // female = number of females of the search results
      const female = filteredUsers.filter((person) => {
        return person.gender === 'female';
      }).length;

      // sumAge = sum of all ages of the search results
      const sumAge = filteredUsers.reduce((accumulator, current) => {
        return (accumulator += current.dob);
      }, 0);

      // avrAge = average of ages of the search results
      const avrAge = sumAge / filteredUsers.length;

      return [male, female, sumAge, avrAge];
    }

    const [male, female, sumAge, avrAge] = computeStatistics();

    // render statistics in HTML
    let divStatistics = document.getElementById('searchStatistics');
    divStatistics.innerHTML = '';

    let h = document.createElement('h4');
    h.textContent = 'Statistics';
    h.classList.add('section');
    divStatistics.appendChild(h);

    let ul = document.createElement('ul');

    let li1 = document.createElement('li');
    let span1 = document.createElement('span');
    span1.textContent = 'Number of males: ' + male;
    li1.appendChild(span1);
    ul.appendChild(li1);

    let li2 = document.createElement('li');
    let span2 = document.createElement('span');
    span2.textContent = 'Number of females: ' + female;
    li2.appendChild(span2);
    ul.appendChild(li2);

    let li3 = document.createElement('li');
    let span3 = document.createElement('span');
    span3.textContent = 'Sum of ages: ' + sumAge.toLocaleString();
    li3.appendChild(span3);
    ul.appendChild(li3);

    let li4 = document.createElement('li');
    let span4 = document.createElement('span');
    span4.textContent = 'Average of ages: ' + avrAge.toFixed(2);
    li4.appendChild(span4);
    ul.appendChild(li4);

    ul.classList.add('left-align');
    divStatistics.appendChild(ul);
  }

  renderResults();
  renderStatistics();
}

start();
