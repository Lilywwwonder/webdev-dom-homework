import { renderComments } from "./render.js";
import { preloader, setComments} from "./main.js"

export function fetchAndRender() {
const fetchPromise = fetch("https://wedev-api.sky.pro/api/v1/atolykova-lily/comments", {
method: "GET",
});

fetchPromise
.then((response) => {
  if (response.status === 500) {
    throw new Error("Сервер сломался");
  }
  return response.json();
})
.then((responseData) => {
  const comments = responseData.comments.map((comment) => {
    return { 
      name: comment.author.name //возвращаем спецсимволы обратно
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&nbsp;/g, " "),
      time: new Date(comment.date).toLocaleTimeString('sm', {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}), 
      comment: comment.text //возвращаем спецсимволы обратно
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&nbsp;/g, " "),
      like: comment.likes, 
      isLike: false, 
    }; 
  });

  setComments(comments); // вызвали функцию

}) 
.then(() => { 
  renderComments(); // render обернули в then
  preloader.classList.add('hide'); 
})
.catch((error) => {
  if (error.message === "Сервер сломался") {
    alert("Сервер сломался, попробуй позже");
    return;
  }
});
}