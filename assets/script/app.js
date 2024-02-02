// DOM elements
let posts = document.getElementById("posts");
const baseUrl = "https://tarmeezacademy.com/api/v1/"
const addPostButton = document.getElementById("add");
const addPostBtn = document.getElementById("add-post");
const RegisterButton = document.getElementById("register-btn");
const LoginButton = document.getElementById("login-btn");
const logoutButton = document.getElementById("logout-btn");
const logout = document.getElementById("logout");
const LoginButtonsGroup = document.getElementById("btns-group");

// Initial setup and data fetch
fetchAllPosts();

// Pagination and loading variables //
let currentPage = 1;
let lastPage;
let isLoading = false;

// Event listener for scroll events
window.addEventListener("scroll", () => {
  // Check if the user has reached the end of the page
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  // Trigger data fetch when conditions are met
  if (endOfPage && currentPage < lastPage && !isLoading) {
    isLoading = true;

    // Display a loading indicator to inform the user
    showLoadingIndicator();

    fetchAllPosts(currentPage)
      .then(() => {
        isLoading = false;
        currentPage += 1;
        // Hide the loading indicator on successful data fetch
        hideLoadingIndicator();
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
        isLoading = false;
        // Display an error message to the user
        showErrorMessage("Failed to fetch data. Please check your internet connection.");
      });
  }
});

// Create a function that retrieves all data and then passes it to the displayAllPosts() function.
async function fetchAllPosts(page) {
  try {
    let request = fetch(`${baseUrl}posts?limit=10&page=${page}`);
    let response = await request;
    let data = await response.json();
    lastPage = data.meta.last_page;
    displayAllPosts(data.data)
  } catch (error) {
    console.log(error);
  }
}

// Define a function to display all user data on the HTML page
function displayAllPosts(object) {
  let temp = "";
  object.forEach(element => {
    temp = `
    <div class="card shadow-lg mb-4">
    <div class="card-header">
      <img
        src="${typeof element.author.profile_image === 'string' ? element.author.profile_image : 'https://placehold.co/50'}"
        alt="User image">
      <span class="fw-bold">${typeof element.author.username == 'string' ? element.author.username : "UserName"}</span>
    </div>
    <div class="card-body">
      <div class="card-image">
        <img class="w-100" src="${typeof element.image == 'string' ? element.image : "https://placehold.co/600x400"}"
          alt="main image">
      </div>
      <div class="card-info border-bottom">
        <h6 class="text-black-50 mt-1">${element.created_at}</h6>
        <h5>${typeof element.title == 'string' ? element.title : "title"}</h5>
        <p>${typeof element.body == 'string' ? element.body : "text of body"}</p>
      </div>

      <div class="card-tags mt-2 d-flex align-items-center gap-3">
            <div class="comments d-flex align-items-center gap-1">
              <i class="bi bi-pen"></i>
              <p class="mb-0">
                <span>(${element.comments_count}) </span>Comments
              </p>
            </div>
          </div>
    </div>
  </div>
    `
    posts.innerHTML += temp;
  });

};

// Function to facilitate user login
async function login(username, pass) {
  let response = await fetch(`${baseUrl}login`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      password: pass
    })
  });

  if (response.ok) {
    let data = await response.json();
    window.localStorage.setItem("token", data.token);
    window.localStorage.setItem("user", JSON.stringify(data.user));
    hideModel("loginModel");
    setUiAfterLoginAndRegister();
    showSuccessAlert(`Login successful! Welcome, ${data.user.username} !`);
  } else {
    let data = await response.json();
    showDangerAlert(data.message);
  }
}


// Function to send data for registration using a POST request and create a new user
RegisterButton.addEventListener("click", () => {
  let name = document.getElementById("register-name").value;
  let username = document.getElementById("register-username").value;
  let image = document.getElementById("register-image").files[0];
  let email = document.getElementById("register-email").value;
  let password = document.getElementById("register-password").value;
  Register(name, username, image, email, password);
});


// Function to register a new user
async function Register(name, username, image, email, password) {
  try {

    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('image', image);
    formData.append('email', email);
    formData.append('password', password);
    let response = await fetch("https://tarmeezacademy.com/api/v1/register", {
      method: "POST",
      headers: {
        "Accept": "application/json",
      },
      body: formData,
    });

    if (response.ok) {
      let data = await response.json();
      console.log(data);
      window.localStorage.setItem("token", data.token);
      window.localStorage.setItem("user", JSON.stringify(data.user));
      hideModel("registerModel");
      showSuccessAlert(`Registration successful! Welcome, ${data.user.username} !`);
      setUiAfterLoginAndRegister();
    } else {
      let data = await response.json();
      showDangerAlert(data.message);
    }
  } catch (error) {
    console.log(error.message);

  }
}

// Function to send data for login using a POST request and authenticate the user
LoginButton.addEventListener("click", () => {
  let username = document.getElementById("username").value;
  let password = document.getElementById("login-password").value;
  login(username, password);
});

// Function to hide the login modal after successful user login //
function hideModel(modelName) {
  let model = document.getElementById(modelName);
  let modelInstance = bootstrap.Modal.getInstance(model);
  modelInstance.hide();
}

// Function to set up the user interface
function setUiAfterLoginAndRegister() {
  let token = window.localStorage.getItem("token");
  let data = JSON.parse(localStorage.getItem("user"));
  if (token) {
    addPostButton.style.display = "block";
    logoutButton.setAttribute('style', 'display:flex !important');
    LoginButtonsGroup.setAttribute('style', 'display:none !important');
    document.getElementById("profile-user-image").setAttribute("src", `${data.profile_image}`);
    document.getElementById("user-name").innerHTML = data.username;

  } else {
    addPostButton.setAttribute('style', 'display:none !important');
    logoutButton.setAttribute('style', 'display:none !important');
    LoginButtonsGroup.setAttribute('style', 'display:flex !important');
  }
}

// Function to log out the user and set up the user interface
logout.addEventListener("click", () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  showDangerAlert("You have been logged out !");
  setUiAfterLoginAndRegister();
});

// Function to display a success alert with a given message
function showSuccessAlert(message) {
  const successAlert = document.getElementById("success-alert");
  let temp = `
  <span>${message}</span>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `
  successAlert.innerHTML = temp;
  successAlert.setAttribute('style', 'display:block !important');
  setTimeout(() => {
    successAlert.setAttribute('style', 'display:none !important');
  }, 4000);
}

// Function to display a danger alert with a given message
function showDangerAlert(message) {
  const logout = document.getElementById("logout-alert");
  let temp = `
  <span>${message}</span>
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `
  logout.innerHTML = temp;
  logout.setAttribute('style', 'display:block !important');
  setTimeout(() => {
    logout.setAttribute('style', 'display:none !important');
  }, 4000);
}

// Function to show data from local storage and set up UI after login or registration
function showData() {
  let data = JSON.parse(window.localStorage.getItem("user"));
  if (data) {
    setUiAfterLoginAndRegister();
  }
}
showData();


// Event listener for the addPostBtn click
addPostBtn.addEventListener("click", () => {
  // Retrieving values from input fields
  let title = document.getElementById("tittle").value;
  let body = document.getElementById("body-for-post").value;
  let image = document.getElementById("formimage").files[0];
  // Calling the addNewPost function with the provided data
  addNewPost(title, body, image);
});

// Function to add a new post
async function addNewPost(body, title, image) {

  // Creating a FormData object to handle file upload
  const formData = new FormData();
  formData.append('body', body);
  formData.append('title', title);
  formData.append('image', image);
  // Retrieving the user token from local storage
  let token = window.localStorage.getItem("token");
  try {
    // Sending a POST request to add a new post
    const response = await fetch("https://tarmeezacademy.com/api/v1/posts", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });
    // Handling the response
    if (response.ok) {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        let data = await response.json();
        console.log(data);
        hideModel("addPost");
        showSuccessAlert("You Added Post Successfully!");
        fetchAllPosts();
      } else {
        // Handling error response
        console.log(response);
        console.log("Unexpected response format");
      }
    } else {
      let data = await response.json();
      showDangerAlert(data.message)
    }

  } catch (error) {
    // Handling general error
    showDangerAlert("You must hhh");
  }

}

function showLoadingIndicator() {
  // Create a loading spinner element
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  // You may want to add styles or use a library for more complex spinners

  // Append the spinner to the body or another container element
  document.body.appendChild(spinner);
}


function hideLoadingIndicator() {
  // Find and remove the loading spinner element
  const spinner = document.querySelector('.loading-spinner');
  if (spinner) {
    spinner.parentNode.removeChild(spinner);
  }
}