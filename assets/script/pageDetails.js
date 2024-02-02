const container = document.getElementById("main-section");
const postId = window.localStorage.getItem("id");
const token = window.localStorage.getItem("token");

getPostDetails();
async function getPostDetails() {
  try {
    let response = await fetch(`https://tarmeezacademy.com/api/v1/posts/${postId}`);
    if (response.ok) {
      let obj = await response.json();
      displayPost(obj.data);
    } else {
      console.log("NO POST");
    }
  } catch (error) {
  }
}

function displayPost(data) {
  let allComments = data.comments;
  let commentsContent = "";
  allComments.forEach(element => {
    commentsContent += `
    <div class="comment mb-2  rounded-1 p-2 mx-3" style = "background-color:#BBE2EC;">
      <div>
        <img src="${element.author.profile_image}"
          style="width: 50px; height: 50px; border-radius: 50%; background-color: white;    padding: 5px;"
          alt="Image">
        <span class="fw-bold">${element.author.username}</span>
      </div>
      <div class="comment-body ms-1">
        ${element.body}
      </div>
    </div>
    `
  });
  let temp = `
  <div class="posts col-8 mx-auto " id="posts">
      <h1 class="post-author my-5 bg-success-subtle text-black rounded-1 p-4">
        <span class="fw-bold text-danger">${data.author.username}'s</span> post
      </h1>
      <div class="card shadow-lg mb-4">
        <div class=" card-header">
          <img src="${typeof data.author.profile_image == "string" ? data.author.profile_image : 'https://placehold.co/50'}" alt="User image">
          <span class="fw-bold">${typeof data.author.username == 'string' ? data.author.username : "UserName"}</span>
        </div>
        <div class="card-body">
          <div class="card-image">
            <img class="w-100" src="${typeof data.image == 'string' ? data.image : "https://placehold.co/600x400"}" alt="main image">
          </div>
          <div class="card-info border-bottom">
            <h6 class="text-black-50 mt-1">${data.created_at}</h6>
            <h5>${typeof data.title == 'string' ? data.title : "Title"}</h5>
            <p>${typeof data.body == 'string' ? data.body : "This is body"}</p>
          </div>

          <div class="card-tags mt-2 d-flex align-items-center gap-3">
            <div class="comments d-flex align-items-center gap-1">
              <i class="bi bi-pen"></i>
              <p class="mb-0">
                <span>(${data.comments_count}) </span>Comments
              </p>
            </div>
          </div>
        </div>
        <div id="comments" class="mb-3" style=""> 
        ${commentsContent}
        </div>
      <div class="input-group mb-3 px-3" data-input>
        <input id = "add-comment" type="text" class="form-control" placeholder="Add Comment" aria-label="Add Comment" aria-describedby="button-addon2">
        <button class="btn btn-info" type="button" id="button-addon2" onclick = "addComment()">Button</button>
      </div>
    </div>
  `;
  container.innerHTML = temp;
}

async function addComment() {
  let comment = document.getElementById("add-comment").value;
  let response = await fetch(`https://tarmeezacademy.com/api/v1/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      body: comment
    })
  })

  if (response.ok) {
    let data = await response.json();
    getPostDetails();
    showSuccessAlert(`comment Created successfully!`);
  } else {
    let data = await response.json();
    showDangerAlert(data.message);
  }
}


if (token) {
  const input = document.querySelector("[data-input]");
  console.log(input);
  console.log("DD");
}