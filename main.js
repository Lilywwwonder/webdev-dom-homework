import { fetchAndRender } from "./api.js";
import { renderComments } from "./render.js";

"use strict";
const buttonElement = document.getElementById("addComment");
export const listElement = document.getElementById("list"); //перенесли в рендер
const addNameElement = document.getElementById("addName");
const addTextElement = document.getElementById("addText");
const addTimeElement = document.getElementById("addTime");
const likesButtonElement = document.querySelectorAll('.like-button');
export const preloader = document.querySelector('.preload'); // перенесли в api


export let comments = [];

export const setComments = (value) => { // заполнили массив
  comments = value
}

// дз 2.12 и 2.14
// function fetchAndRender() {
// const fetchPromise = fetch("https://wedev-api.sky.pro/api/v1/atolykova-lily/comments", {
// method: "GET",
// });

// fetchPromise
// .then((response) => {
//   if (response.status === 500) {
//     throw new Error("Сервер сломался");
//   }
//   return response.json();
// })
// .then((responseData) => {
//   comments = responseData.comments.map((comment) => {
//     return { 
//       name: comment.author.name //возвращаем спецсимволы обратно
//       .replace(/&lt;/g, "<")
//       .replace(/&gt;/g, ">")
//       .replace(/&amp;/g, "&")
//       .replace(/&quot;/g, '"')
//       .replace(/&nbsp;/g, " "),
//       time: new Date(comment.date).toLocaleTimeString('sm', {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'}), 
//       comment: comment.text //возвращаем спецсимволы обратно
//       .replace(/&lt;/g, "<")
//       .replace(/&gt;/g, ">")
//       .replace(/&amp;/g, "&")
//       .replace(/&quot;/g, '"')
//       .replace(/&nbsp;/g, " "),
//       like: comment.likes, 
//       isLike: false, 
//     }; 
//   });
// }) 
// .then(() => { 
//   renderComments(); // render обернули в then
//   preloader.classList.add('hide'); 
// })
// .catch((error) => {
//   if (error.message === "Сервер сломался") {
//     alert("Сервер сломался, попробуй позже");
//     return;
//   }
// });
// }
 fetchAndRender();


buttonElement.addEventListener("click", () => {
addTextElement.classList.remove("error");
if (addNameElement.value.trim() === "") {
addNameElement.classList.add("error");
return;
}
if (addTextElement.value.trim() === "") {
addTextElement.classList.add("error");
return;
}

  const nameValue = addNameElement.value;
  const textValue = addTextElement.value;

// загрузка. textContent = innerHTML (аналог)
// отключаем кнопку
buttonElement.disabled = true;
buttonElement.textContent = 'Комментарий добавляется...';

fetch("https://wedev-api.sky.pro/api/v1/atolykova-lily/comments", {
    method: "POST",
    body: JSON.stringify({
      name: nameValue 
      .replaceAll("<", "&lt")
      .replaceAll(">", "&gt")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll(" ", "&nbsp;"),
      text: textValue 
      .replaceAll("<", "&lt")
      .replaceAll(">", "&gt")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll(" ", "&nbsp;"),
      //forceError: true // вызов 500 ошибки
    }),

// дз 2.13 стало
  })
  .then((response) => {
  if (response.status === 400 && (nameValue.length < 3 || textValue.length < 3)) { // обрабатываем ошибку 400
  throw new Error("Некорректный запрос");
   }
  if (response.status === 500) {
    throw new Error("Сервер сломался");
  } 
  else {
    return response.json();
  }
  })
  .then((responseData) => {
    fetchAndRender();
  })
  // включаем кнопку, добавили .then(data)
  .then((data) => {
    buttonElement.disabled = false;
    buttonElement.textContent = 'Написать';
  })
  .catch((error) => {
    if (error.message === "Сервер сломался") {
    alert("Сервер сломался, попробуй позже");
    addNameElement.value = nameValue;
    addTextElement.value = textValue;
    return;
  } if (error.message === "Некорректный запрос") {
    alert("Имя и комментарий должны быть не короче 3 символов");
     addNameElement.value = nameValue;
     addTextElement.value = textValue;
  }
   if (error instanceof TypeError) {
   alert("Кажется, у вас сломался интернет, попробуйте позже");
   return;
  }
  console.log(error);
  })
  .finally(() => {
  buttonElement.disabled = false;
  buttonElement.textContent = 'Написать';
});
 });

// дз
export const likesButtonListeners = () => {
const likesButtonElement = document.querySelectorAll('.like-button');
for (const likeButton of likesButtonElement) {
    likeButton.addEventListener('click', event => {
      event.stopPropagation();
      const index = likeButton.dataset.index;
      if (comments[index].isLike === false) { 
        comments[index].isLike = true; 
        comments[index].like++; 
    } else { 
        comments[index].isLike = false; 
        comments[index].like--; 
  }
  renderComments();
 });
}
}


// дз 2.11
export const commentsElementListeners = () => {
const commentsElement = document.querySelectorAll('.comment-text');

for (const commentText of commentsElement) {
commentText.addEventListener('click', (event) => {
  event.preventDefault();
  const index = commentText.dataset.index;
  //alert(`привет`);
  const comment = `${comments[index].name}:${comments[index].comment}`;
  addTextElement.value = comment;
  renderComments();
});
}
}

// очищаем форму после отправки заполненного комментария
const form = document.getElementById('myForm');
form.addEventListener('submit', (e) => {
  e.preventDefault(); // добавили, чтобы не перезагружалась страница
  e.target.reset();
});


//добавила индекс на строке comment-text
// const renderComments = () => {
// const commentsHtml = comments.map((comment, index) => {
//   const likeClass = comment.isLike ? '-active-like' : '';
//   return `<li class="comment">
//       <div class="comment-header">
//         <div>${comment.name}</div>
//         <div>${comment.time}</div>
//       </div>
//       <div class="comment-body">
//         <div class="comment-text" data-index="${index}"> 
//           ${comment.comment}
//         </div>
//       </div>
//       <div class="comment-footer">
//         <div class="likes">
//           <span class="likes-counter">
//             <div>${comment.like}</div>
//           </span>
//           <button class="like-button ${likeClass}" data-index="${index}">
//           <div></div>
//           </button>
//         </div>
//       </div>
//     </li>`
// }).join('');

// listElement.innerHTML = commentsHtml;
// likesButtonListeners();
// commentsElementListeners();
// };
renderComments();


buttonElement.addEventListener('click', () => {
  //addNameElement.style.backgroundColor = ""; альтернатива инлайн - не рек
  addNameElement.classList.remove("error");
  addTextElement.classList.remove("error");
  if (addNameElement.value.trim() === "") {
    //addNameElement.style.backgroundColor = "red"; альтернатива инлайн - не рек
    addNameElement.classList.add("error");
    return;
  } 
  
  if (addTextElement.value.trim() === "") {
    addTextElement.classList.add("error");
    return;
  };

  renderComments();
  addNameElement.value = '';
  addTextElement.value = '';
});


console.log("It works!");

