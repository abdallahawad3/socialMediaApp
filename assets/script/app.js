// DOM elements
let posts = document.getElementById("posts");
// const baseUrl = "https://tarmeezacademy.com/api/v1/"
const addPostBtn = document.getElementById("add-post");
const updatePostButton = document.getElementById("update-post");
const deletePostButton = document.getElementById("deletePostBtn");
// Pagination and loading variables //
let lastPage;
let isLoading = false;
let currentPage = 1;
// Initial setup and data fetch
fetchAllPosts(currentPage);

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
  let currentUser = JSON.parse(window.localStorage.getItem("user"));
  let editButtonContent = ``;

  object.forEach(element => {
    if (currentUser !== null && currentUser.id !== null && currentUser.id === element.author.id) {
      editButtonContent = `
        <button class = "btn btn-secondary p-1 px-2" onclick="editPost('${encodeURIComponent(JSON.stringify(element))}')" >EDIT</button>
        <button class = "btn btn-danger p-1 px-2" onclick = "deletePost('${encodeURIComponent(JSON.stringify(element))}')">Delete</button>
      `
    } else {
      editButtonContent = ``;
    }
    temp = `
    <div class="card col-12 col-lg-9 mx-auto shadow-lg mb-4">
    <div class="card-header d-flex align-items-center justify-content-between">
      <div onclick = "showUserPosts(${element.author.id})">
        <img src="${typeof element.author.profile_image === 'string' ? element.author.profile_image : 'https://placehold.co/50'}" alt="User image">
        <span class="fw-bold">${typeof element.author.username == 'string' ? element.author.username : "UserName"}</span>
      </div>
      <div>
        ${editButtonContent}
      </div>
    </div>
    <div class="card-body" onclick="postClicked(${element.id})">
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
async function addNewPost(title, body, image) {
  // Creating a FormData object to handle file upload
  const formData = new FormData();
  formData.append('title', title);
  formData.append('body', body);
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
        hideModel("addPost");
        showSuccessAlert("You Added Post Successfully!");
        setTimeout(() => {
          location.reload();
        }, 500);
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

function postClicked(id) {
  window.localStorage.setItem("id", id);
  window.location = "postDetails.html";
}

function editPost(object) {
  let obj = JSON.parse(decodeURIComponent(object));
  document.getElementById("update-body").value = obj.body;
  document.getElementById("update-title").value = obj.title;
  window.localStorage.setItem("postId", obj.id)
  let modal = document.getElementById("updatePost");
  if (modal) {
    let modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  } else {
    console.error("Modal element with ID 'updatePost' not found.");
  }
}

updatePostButton.addEventListener("click", () => {
  let body = document.getElementById("update-body").value;
  let title = document.getElementById("update-title").value;
  let postId = localStorage.getItem("postId");
  updatePost(title, body, postId);
})

//Function to update post 

async function updatePost(title, body, id) {
  // console.log(title, body, id);
  let token = window.localStorage.getItem("token");
  let response = await fetch(`${baseUrl}posts/${id}`, {
    method: "PUT",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      body: body,
      title: title
    })
  });

  if (response.ok) {
    let data = await response.json();
    hideModel("updatePost");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
}

function deletePost(object) {
  let obj = JSON.parse(decodeURIComponent(object));
  window.localStorage.setItem("deletePostId", obj.id)
  let modal = document.getElementById("deletePostModel");
  if (modal) {
    let modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  } else {
    console.error("Modal element with ID 'updatePost' not found.");
  }
}

deletePostButton.addEventListener("click", () => {
  let postId = localStorage.getItem("deletePostId");
  deletePostEver(postId);
});

async function deletePostEver(id) {
  let token = localStorage.getItem("token");
  let response = await fetch(`${baseUrl}posts/${id}`, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(
      {
        "body": "hello sdffsdsfds"
      })
  });

  if (response.ok) {
    hideModel("deletePostModel");
    setTimeout(() => {
      window.location.reload();
    }, 500);
    showSuccessAlert("The post are deleted successfully");
  }
}

function showUserPosts(idOfUser) {
  window.localStorage.setItem("idOfUser", idOfUser);
  window.location = "profile.html";
}