import { state } from "../state";

type Message = {
    from: string,
    message: string
}
class ChatPage extends HTMLElement {
    shadow: ShadowRoot
    constructor() {
        super();
    }
    messages: Message[] = []
    connectedCallback() {
        state.subscribe(() => {
            /* Esto sirve para que el componente este constantemente alerta de cambios en el 
            estado y poder efectuar la accion necesario para que la UI tenga sentido
            */
            const currentState = state.getState();
            this.messages = currentState.messages;
            this.render()
        });
        this.render();
    }
    addListeners() {
        const formEl = document.querySelector(".submit-msg");
        formEl.addEventListener("submit", (e) => {
            e.preventDefault();
            const target = e.target as any
            const msgEl = target["msg-input"].value;
            if (msgEl != "") {
                state.pushMessage(msgEl);
            }
        });
    }
    render() {
        const cs = state.getState()
        const style = document.createElement("style");
        this.innerHTML = `
        <header class="header">Room ID : ${cs.roomId}</header>
        <div class="content-container">
        <div class="title-container">
        <h2 class ="title">ChatrOom</h2>
        </div>
        </div>
        <div class="chat-content">
        <div class="messages">
        ${this.messages.map(m => {
            console.log("soy los mensajes", this.messages);
            console.log("soy el M", m);
            if (m.from == state.data.name) {
                return `<div class="message my-msg">${m.from} : ${m.message}</div>`
            } else {
                return `<div class="message">${m.from} : ${m.message}</div>`
            }
        }).join("")}
        </div>
        <form class ="submit-msg">
        <input type="text" class="input" name="msg-input" placeholder="Write a message..">
        <div class="send-butt-cont">
        <button class="send-button">Send</button>
        </div>
        </form>
        </div>
        `;

        this.appendChild(style)
        this.addListeners();
    }
}
customElements.define("chat-page", ChatPage);