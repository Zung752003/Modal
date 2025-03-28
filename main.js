const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


function Modal(options = {}){

    const {
        templateId, 
        closeMethods = ["button", "overlay", "escape"],
        footer = false,
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
        if(footer){
            this._modalFooter = document.createElement("div");
            this._modalFooter.className = "modal-footer";
            if(this._footerContent){
                this._modalFooter.innerHTML = this._footerContent;
            }
            container.append(this._modalFooter);
            this._footerButtons.forEach(button => {
                this._modalFooter.append(button);
            })
        }
        this._backdrop.append(container);
        document.body.append(this._backdrop);
    })

    this.setFooterContent = html => {
        this._footerContent = html;
        if(this._modalFooter){
            this._modalFooter.innerHTML = html
        }
    }

    this._footerButtons = [];
    this.addFooterButton = (title, cssClass, callback) => {
        const button = document.createElement("button");
        button.className = cssClass;
        button.innerHTML = title;
        button.onclick = callback;
        this._footerButtons.push(button);
    }

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

        this.onTransitionEnd(()=> {
            if(typeof onOpen === "function") onOpen();
        })

        return this._backdrop;
    })

    this.onTransitionEnd = (callback) => {
        this._backdrop.ontransitionend = (e) => {
            if(e.propertyName !== "transform")  return;
            if(typeof callback === "function") callback();
        }
    }

    this.close = (destroy = destroyOnClose) => {
        this._backdrop.classList.remove("show");
        this.onTransitionEnd(() => {
            this._backdrop.ontransitionend = (e) => {
                if(e.propertyName !== "transform")  return;
                if(this._backdrop && destroy){
                    this._backdrop.remove();
                    this._backdrop = null;
                    this._modalFooter = null;
                }
            }
            
            //enable croll
            document.body.classList.remove("no-scroll");
            document.body.style.paddingRight = "";
            if(typeof onClose === "function")  onClose();
        })
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

const modal3 = new Modal({
    templateId: "modal-3",
    closeMethods: [],
    footer: true,
    cssClass: ["class1", "class3", "classN"],
    onOpen: () => {
        console.log("open Modal 3");
    },
    onClose: () => {
        console.log("close Modal 3");
    }
})

// modal3.setFooterContent("<h2>Hello</h2>")
modal3.addFooterButton("Danger", "modal-button danger pull-left", (e)=>{
    modal3.close();
})

modal3.addFooterButton("Cancel", "modal-button", (e)=>{
    modal3.close();
})

modal3.addFooterButton("<span>Argee</span>", "modal-button primary", (e)=>{
    //something here ...
    modal3.close();
})

modal3.open()