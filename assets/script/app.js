let posts = document.getElementById("posts");
const addPostButton = document.getElementById("add");
const logout = document.getElementById("logout");
const logoutButton = document.getElementById("logout-btn");
const LoginButton = document.getElementById("login-btn");
const LoginButtonsGroup = document.getElementById("btns-group");
fetchAllPosts();


// Function to fetch all data and send to displayAllPosts() function
async function fetchAllPosts() {
  try {
    let request = fetch("https://tarmeezacademy.com/api/v1/posts");
    let response = await request;
    let data = await response.json();
    displayAllPosts(data.data)
  } catch (error) {
    console.log(error);
  }
}

// Function to display all data for all users into html page
function displayAllPosts(object) {
  let temp = "";
  posts.innerHTML = "";
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
                <span>3</span>Comments
              </p>
            </div>

            <div class="tags">
              <button class="btn rounded-pill bg-secondary py-1 text-light">Policy</button>
              <button class="btn rounded-pill bg-secondary py-1 text-light">Econimic</button>
              <button class="btn rounded-pill bg-secondary py-1 text-light">Policy</button>
            </div>
          </div>
    </div>
  </div>
    `
    posts.innerHTML += temp;
  });

};

// Function to login the user //
async function login(username, pass) {
  let response = await fetch("https://tarmeezacademy.com/api/v1/login", {
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
    hideModel();
    setUiAfterLogin();
    showSuccessAlert();
    hideSuccessAlert();
  } else {
    const errorData = await response.json();
    console.log(errorData);
  }
}

// Function to send data for login function to create post request and login the user //
LoginButton.addEventListener("click", () => {
  let username = document.getElementById("username").value;
  let password = document.getElementById("login-password").value;
  login(username, password);
});

// Function to hide login model after login success //
function hideModel() {
  let model = document.getElementById("loginModel");
  let modelInstance = bootstrap.Modal.getInstance(model);
  modelInstance.hide();
}

// Function to setup ui //
function setUiAfterLogin() {
  let token = window.localStorage.getItem("token");
  if (token) {
    addPostButton.style.display = "block";
    logoutButton.setAttribute('style', 'display:flex !important');
    LoginButtonsGroup.setAttribute('style', 'display:none !important');
  } else {
    addPostButton.setAttribute('style', 'display:none !important');
    logoutButton.setAttribute('style', 'display:none !important');
    LoginButtonsGroup.setAttribute('style', 'display:flex !important');
  }
}

// Function to logout user and setup ui //
logout.addEventListener("click", () => {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  setUiAfterLogin();
})

function showSuccessAlert() {
  const successAlert = document.getElementById("success-alert");
  successAlert.classList.add("success-animation");
}

function hideSuccessAlert() {
  const successAlert = document.getElementById("success-alert");
  setTimeout(() => {
    successAlert.setAttribute('style', 'display:none !important');
  }, 2000);
}

function showLogoutAlert() {
  const logout = document.getElementById("logout-alert");
  logout.classList.add("success-animation");

}

function hideLogoutAlert() {
  const Logout = document.getElementById("logout-alert");
  setTimeout(() => {
    Logout.setAttribute('style', 'display:none !important');
  }, 2000);
}

logout.addEventListener("click", () => {
  showLogoutAlert();
  hideLogoutAlert();
});