import { commentsElementListeners, likesButtonListeners, comments} from "./main.js"
const listElement = document.getElementById("list");

export const renderComments = () => {
const commentsHtml = comments.map((comment, index) => {
  const likeClass = comment.isLike ? '-active-like' : '';
  return `<li class="comment">
      <div class="comment-header">
        <div>${comment.name}</div>
        <div>${comment.time}</div>
      </div>
      <div class="comment-body">
        <div class="comment-text" data-index="${index}"> 
          ${comment.comment}
        </div>
      </div>
      <div class="comment-footer">
        <div class="likes">
          <span class="likes-counter">
            <div>${comment.like}</div>
          </span>
          <button class="like-button ${likeClass}" data-index="${index}">
          <div></div>
          </button>
        </div>
      </div>
    </li>`
}).join('');

listElement.innerHTML = commentsHtml;
likesButtonListeners();
commentsElementListeners();
};
