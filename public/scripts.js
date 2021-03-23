const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .links a")

for (item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }

}

const modalOverlay = document.querySelector('.modal-overlay');
const medias = document.querySelectorAll('.visualizarMidia');

for (let media of medias) {
    media.addEventListener("click", function () {
        let mediaId = media.getAttribute("id");
        const indice = mediaId.indexOf("v=")
        mediaId = mediaId.substring(indice + 2, mediaId.length)
        modalOverlay.classList.add('active');
        modalOverlay.querySelector('iframe').src = `https://www.youtube.com/embed/${mediaId}`;
    })
}


document.querySelector('.close-modal').addEventListener('click', function () {
    modalOverlay.classList.remove('active');
    modalOverlay.querySelector('iframe').src = "";
})

