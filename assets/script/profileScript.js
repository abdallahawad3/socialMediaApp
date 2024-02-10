let userId = JSON.parse(window.localStorage.getItem("idOfUser"));
const mainHead = document.getElementById("head");
const authorName = document.getElementById("author-name");
const userPostsContainer = document.getElementById("allPosts");
const url = "https://tarmeezacademy.com/api/v1";
async function mainInfo() {
  let request = await fetch(`${url}/users/${userId}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  });
  if (request.ok) {
    let data = await request.json();
    headerInfo(data.data);
  }
}

mainInfo();
function headerInfo(object) {
  let temp = `
    <div class="posts bg-white shadow-sm p-4 rounded-2 d-flex  justify-content-md-between align-items-start align-items-md-center gap-5 flex-column flex-md-row justify-content-md-between align-content-start"
      style="border: 1px solid #dcdada;" id="posts">
      <div class="left d-flex align-items-center gap-4 w-50">
        <img src="${typeof object.profile_image === "string" ? object.profile_image : 'https://picsum.photos/200/300'}" class="rounded-pill" style="width: 150px; height: 150px;"
          alt="Profile image">
        <div class="left-info">
          <h5 class="mb-4">${object.email}</h5>
          <h5 class="mb-4">${object.name}</h5>
          <h5>${object.username}</h5>
        </div>
      </div>
      <div class="right w-50" style="align-self: self-start;">
        <div><span class="fs-1">${object.posts_count}</span> posts</div>
        <div><span class="fs-1">${object.comments_count}</span>comments</div>
      </div>
    </div>
  `
  let temp2 = `
      <h2> ${object.username}'s Posts</h2> 
  `
  mainHead.innerHTML = temp;
  authorName.innerHTML = temp2;
}

allUserPosts()
async function allUserPosts() {
  let request = await fetch(`${url}/users/${userId}/posts`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  });
  if (request.ok) {
    let data = await request.json();
    // console.log(data.data);
    displayAllUserPosts(data.data);
  }
}


function displayAllUserPosts(object) {
  let temp = ``;
  object.forEach(element => {
    temp = `
    <div class="card container-fluid col-lg-8 container-md mx-auto shadow-lg my-4">
      <div class="card-header d-flex align-items-center justify-content-between">
        <div>
          <img src="${typeof element.author.profile_image == "string" ? element.author.profile_image : 'https://picsum.photos/200/300'}" style="width: 50px; border-radius: 50%; padding: 2px; border: 2px solid gainsboro;" alt="User image">
          <span class="fw-bold">${typeof element.author.username === "string" ? element.author.username : "username"}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-image">
          <img class="w-100" src="${typeof element.image == "string" ? element.image : 'https://picsum.photos/800/600'}" alt="main image">
        </div>
        <div class="card-info border-bottom">
          <h6 class="text-black-50 mt-1">${element.created_at}</h6>
          <h5>${typeof element.title === "string" ? element.title : "title"}</h5>
          <p>${typeof element.body === "string" ? element.body : "body"}</p>
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
    userPostsContainer.innerHTML += temp;
  });
}