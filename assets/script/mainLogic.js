const baseUrl = "https://tarmeezacademy.com/api/v1/"
const addPostButton = document.getElementById("add");
const RegisterButton = document.getElementById("register-btn");
const LoginButton = document.getElementById("login-btn");
const logoutButton = document.getElementById("logout-btn");
const logout = document.getElementById("logout");
const LoginButtonsGroup = document.getElementById("btns-group");
// const profileLink = document.getElementById("profileLink");
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
    if (addPostButton != null) {
      addPostButton.style.display = "block";
    }
    logoutButton.setAttribute('style', 'display:flex !important');
    LoginButtonsGroup.setAttribute('style', 'display:none !important');
    document.getElementById("profile-user-image").setAttribute("src", `${data.profile_image}`);
    document.getElementById("user-name").innerHTML = data.username;

  } else {

    if (addPostButton != null) {
      addPostButton.setAttribute('style', 'display:none !important');
    }
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

function profileClicked() {
  let user = JSON.parse(localStorage.getItem("user"));
  window.localStorage.setItem("idOfUser", user.id);
  window.location = "profile.html";
}