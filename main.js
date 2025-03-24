const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let _scrollbarWidth;

function Modal(){
    function getScrollbarWidth(){
        
        if(getScrollbarWidth.value){
            console.log(`Has exited ${getScrollbarWidth.value}`);
        }

        //create element "div"
        const div = document.createElement("div");
        //create scrollbar for div
        Object.assign(div.style, {
            overflow: "scroll",
            top: "-9999px",
            position: "absolute",
        })
        //append into body
        document.body.appendChild(div)
        //calculator scrollbar width
        const scrollbarWidth = div.offsetWidth - div.clientWidth;
        getScrollbarWidth.value = scrollbarWidth;
        //remove scrollbar 
        document.body.removeChild(div);

        return scrollbarWidth;
    }

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
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = getScrollbarWidth() + "px"

        return backdrop;
    })
    this.closeModal = (elementModal) => {
        elementModal.classList.remove("show");
        elementModal.ontransitionend = () => {
            elementModal.remove()
        }
        
        //enable croll
        document.body.classList.remove("no-scroll");
        document.body.style.paddingRight = "";
    }
}

const modal1 = new Modal({
    templateId: "modal-1"
});

$("#open-modal-1").onclick = () => {
    const modalElement = modal1.open();

    //modal1.close();
    console.log(modalElement.querySelector("img"));
}


const modal2 = new Modal({
    templateId: "modal-2",
    // closeMethod: ['button', 'overlay', 'escape']
    footer: true,
    cssClass: ['class1', 'class2', 'class3'],
    onOpen: () => {
        console.log("Open modal");
    },
    onClose: () => {
        console.log("Close modal");
    }


});

$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();

    //modal2.close();

    const form = modalElement.querySelector("#login-form");
    form.onsubmit = e => {
        e.preventDefault();
        const dataForm = {
            email:  $("#email").value.trim(),
            password: $("#password").value.trim(),
        }
    }
}



