const getParameter = (name) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

const isObjEmpty = (obj) => {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
};

const addBook = (
  img,
  altImg,
  title = "Check your internet connection",
  author = "admin",
  description = "our database can't be fetched",
  url = "https://google.com"
) => {
  document.querySelector("main").insertAdjacentHTML(
    "beforeend",
    `<div class="card" style="min-width: 280px; width: 30vw; max-width: 350px;">
    <div class="card-image">
      <figure class="image is-4by3">
        <img style="object-fit: cover; object-position: bottom;" src="${img}" alt="${altImg}" loading="lazy" />
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">${title}</p>
          <p class="subtitle is-6">${author}</p>
        </div>
      </div>
      <div class="content">${description}</div>
    </div>
      <footer class="card-footer">
        <a
          href="${url}"
          target="_BLANK"
          rel="noopener noreferrer"
          class="card-footer-item"
          >Read and view details</a
        >
      </footer>
      </div>
  </div>`
  );
};

let url = "https://www.etnassoft.com/api/v1/get/?json=true&num_items=50";
if (getParameter("keyword") !== "") {
  url = `${url}&keyword=${getParameter("keyword")}`;
  fetch(url)
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
      if (isObjEmpty(resp) === false) {
        document
          .querySelector("header")
          .insertAdjacentHTML(
            "beforeend",
            `<h2 class="subtitle">Results for ${getParameter("keyword").replace(
              "+",
              " "
            )}</h2>`
          );
      } else {
        document
          .querySelector("header")
          .insertAdjacentHTML(
            "beforeend",
            `<h2 class="subtitle">No results for ${getParameter(
              "keyword"
            ).replace("+", " ")}</h2>`
          );
      }
    })
    .catch((err) => {
      console.error(err);
      document
        .querySelector("header")
        .insertAdjacentHTML(
          "beforeend",
          `<h2 class="subtitle">Ceck your internet connection</h2>`
        );
    });
}
document.querySelector("main").innerHTML = "";
fetch(url)
  .then((resp) => resp.json())
  .then((resp) => {
    for (let index = 0; index < resp.length; index++) {
      let currentInfo = resp[index];
      let downloadUrl = `https:\/\/openlibra.com\/es\/book\/download\/${
        currentInfo.url_download.split("https://openlibra.com/book/")[1]
      }`;
      addBook(
        currentInfo.cover,
        currentInfo.title,
        currentInfo.title,
        currentInfo.author,
        currentInfo.content_short,
        downloadUrl
      );
    }
  })
  .catch((err) => {
    console.error(err);
    addBook();
  });
