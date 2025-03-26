const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function Modal(options = {}){

    const {
        templateId, 
        closeMethods = ["button", "overlay", "escape"],
        destroyOnClose = true,
        cssClass = [],
        onOpen,
        onClose,
    } = options;
    
    const template = $(`#${templateId}`);
    
    if(!template){
        console.error(`${templateId} dose not exists! `);
        return;
    }

    this._allowButtonClose = closeMethods.includes("button");
    this._allowBackdropClose = closeMethods.includes("overlay");
    this._allowEscapeClose = closeMethods.includes("escape");



    function getScrollbarWidth(){
        // if(getScrollbarWidth.value){
        //     console.log(`Has exited ${getScrollbarWidth.value}`);
        // }

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

    this.build = (() => {
        const content = template.content.cloneNode(true);
        
        //create elements
        this._backdrop = document.createElement("div");
        this._backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";
        cssClass.forEach(className => {
            if(typeof className === "string"){
                container.classList.add(className);
            }
        })

        if(this._allowButtonClose){
            //create element
            const closeBtn = document.createElement("button");
            closeBtn.className = "modal-close";
            closeBtn.innerHTML = '&times;'
            //append element
            container.append(closeBtn);
            //attach event listener
            closeBtn.onclick = () => {
                this.close();
            } 
        }

        const contentModal = document.createElement("div");
        contentModal.className = "modal-content";

        //append content and elements
        contentModal.append(content);
        container.append(contentModal);
        this._backdrop.append(container);
        document.body.append(this._backdrop);
    })

    this.open = (() => {

        if(!this._backdrop){
            this.build();
        }

        setTimeout(() => {
            this._backdrop.classList.add("show");
        },0);

        //attach event listener
        
        if(this._allowBackdropClose){
            this._backdrop.onclick = (e) => {
                if(e.target === this._backdrop){
                    this.close();
                }
            }
        }

        if(this._allowEscapeClose){
            document.addEventListener("keydown", e => {
                if(e.key === "Escape"){
                    this.close()
                }
            })
        }

        //disable scroll
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = getScrollbarWidth() + "px";

        this._backdrop.ontransitionend = (e) => {
            if(e.propertyName !== "transform")  return;
            if(typeof onOpen === "function") onOpen();
        }

        return this._backdrop;
    })
    this.close = (destroy = destroyOnClose) => {
        this._backdrop.classList.remove("show");
        this._backdrop.ontransitionend = (e) => {
            if(e.propertyName !== "transform")  return;
            if(this._backdrop && destroy){
                this._backdrop.remove();
                this._backdrop = null;
            }
        }
        
        //enable croll
        document.body.classList.remove("no-scroll");
        document.body.style.paddingRight = "";
        if(typeof onClose === "function")  onClose();
    }

    this.destroy = () => {
        this.close(true);
    }

}

const modal1 = new Modal({
    templateId: "modal-1",
    destroyOnClose: false,
    onOpen: () => {
        console.log("open Modal 1");
    },
    onClose: () => {
        console.log("close Modal 1");
    }
});

$("#open-modal-1").onclick = () => {
    const modalElement = modal1.open();
    // console.log(modalElement.querySelector("img"));
}

const modal2 = new Modal({
    templateId: "modal-2",
    closeMethods: ["button", "escape"],
    footer: true,
    cssClass: ["class1", "class2", "classN"],
    onOpen: () => {
        console.log("open Modal 2");
    },
    onClose: () => {
        console.log("close Modal 2");
    }
})

$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();


    const form = modalElement.querySelector("#login-form");
    form.onsubmit = e => {
        e.preventDefault();
        const dataForm = {
            email:  $("#email").value.trim(),
            password: $("#password").value.trim(),
        }
    }
}