const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// <div class="modal-backdrop">
//     <div class="modal-container">
//         <button class="modal-close">&times;</button>
//         <div class="modal-content">
//             ....
//         </div>
//     </div>
// </div>

function Modal(){
    this.openModal = (content => {
        //create elements
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        const closeBtn = document.createElement("button");
        closeBtn.className = "modal-close";
        closeBtn.innerHTML = '&times;'

        const contentModal = document.createElement("div");
        contentModal.className = "modal-content";

        //append content and elements
        contentModal.innerHTML = content;
        container.append(closeBtn, contentModal);
        backdrop.append(container);
        document.body.append(backdrop);

        setTimeout(() => {
            backdrop.classList.add("show");
        },0);

        //attach event listener
        closeBtn.onclick = () => {
            this.closeModal(backdrop);
        }
        backdrop.onclick = (e) => {
            if(e.target === backdrop){
                this.closeModal(backdrop);
            }
        }
        document.addEventListener("keydown", e => {
            if(e.key === "Escape"){
                this.closeModal(backdrop)
            }
        })
    })
    this.closeModal = (elementModal) => {
        elementModal.classList.remove("show");
        elementModal.ontransitionend = () => {
            elementModal.remove()
        }
    }
}

const modal = new Modal();

$("#open-modal-1").onclick = () => {
    modal.openModal('<h1>Hello David 1</h1>');
}

$("#open-modal-2").onclick = () => {
    modal.openModal('<h1>Hello David 2</h1>');
}

$("#open-modal-3").onclick = () => {
    modal.openModal('<h1>Hello David 3</h1>');
}