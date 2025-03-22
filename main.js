const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Modal(){
    this.openModal = ((options = {}) => {

        const {templateId, allowBackdropClose = true} = options
        const template = $(`#${templateId}`);
        
        if(!template){
            console.error(`${templateId} dose not exists! `);
            return;
        }

        const content = template.content.cloneNode(true);
        
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
        contentModal.append(content);
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
        
        if(allowBackdropClose){
            backdrop.onclick = (e) => {
                if(e.target === backdrop){
                    this.closeModal(backdrop);
                }
            }
        }

        document.addEventListener("keydown", e => {
            if(e.key === "Escape"){
                this.closeModal(backdrop)
            }
        })

        //disable scroll
        document.body.classList.add("no-scroll")

        return backdrop;
    })
    this.closeModal = (elementModal) => {
        elementModal.classList.remove("show");
        elementModal.ontransitionend = () => {
            elementModal.remove()
        }
        
        //enable croll
        document.body.classList.remove("no-scroll")
    }
}

const modal = new Modal();

$("#open-modal-1").onclick = () => {
    const modalElement = modal.openModal({
        templateId: "modal-1"
    });
    console.log(modalElement.querySelector("img"));
}

$("#open-modal-2").onclick = () => {
    const modalElement = modal.openModal({
        templateId: "modal-2",
        allowBackdropClose: false,
    });


    const form = modalElement.querySelector("#login-form");
    form.onsubmit = e => {
        e.preventDefault();
        const dataForm = {
            email:  $("#email").value.trim(),
            password: $("#password").value.trim(),
        }
    }
}