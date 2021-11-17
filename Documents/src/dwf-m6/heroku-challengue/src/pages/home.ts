import { Router } from "@vaadin/router";
import "../router"
import { state } from "../state"
export class Home extends HTMLElement {
    constructor() {
        super();
    };
    connectedCallback() {
        this.render();
        const cs = state.getState();
        const formEl = document.querySelector(".form");
        formEl.addEventListener("submit", (e) => {
            e.preventDefault();
            const target = e.target as any
            state.setNameAndEmail(target.nombre.value, target.email.value)
            state.signIn((err) => {
                console.log("cs create Room :", cs.createRoom);
                if (cs.createRoom == "true") {
                    state.askNewRoom(() => {
                        state.accessToRoom();
                    });
                } else {
                    /* Quizas tenga que guardar el room id
                    que me pasan por el input para después poder hacer accessroom
                    */
                    const inputValue = target["room-id"].value
                    cs.roomId = inputValue;
                    state.setState(cs)
                    state.accessToRoom();
                }
            });

            Router.go("/chat");
        });
    };
    render() {
        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = `
            *{
                box-sizing : border-box;
            }
            body{
                margin : 0;
                background-color: blue; 
            }
            .header{
                height : 60px;
            }
            .title{
                font-size : 62px;
                font-family: 'Lora', serif;
                font-weight : 700;
                margin-left : 15px;
                margin-top : 0;
                text-align : center;
            }
            .form{
                display : flex;
                flex-direction : column;
                padding : 20px;
                gap : 30px;
                align-items :center;
            }
            .form__label{
                display : block;
                font-size : 16px;
                font-family : "roboto";
                font-weight : 500;
            }
            .input-home:focus {
                outline: 0;
                outline-color: transparent;
                outline-style: none;
            }
            input:focus, textarea:focus, select:focus{
                outline: none;
            }
            .input-home{
                padding : 15px;
                margin-top : 0;
                border-radius : 8px;
            }
            .form__button{
                padding : 15px;
                margin-top : 50px;
                border : solid 2px;
                border-radius : 6px;
                font-family : "roboto";
                font-size : 20px;
            }
            .select{
                padding: 15px;
                font-size: 16px;
                border: solid 2px;
                border-radius: 6px;
                width:200px;
                font-family : "roboto";
            }
            .id-placement{
                display  : none;
            }
            .display-on{
                display : block;
            }
        `
        this.innerHTML = `
        <header class="header"></header>
        <h1 class="title">Welcome</h1>
        <div class="form-cont">
            <form class="form">
            <div class="container">
                <label class="form__label">
                    Nombre
                </label>
                <input type="text" name="nombre" class="input-home">
            </div>
            <div class="container">
                <label class="form__label">
                    Email
                </label>
                <input type="text" name="email" class="input-home">
            </div>
            <div class="select-container">
                <select name="select" class="select">
                <option class="id-option" value="existent-room" >Retomar chat</option>
                <option value="new-room" selected>Nuevo chat</option>
                </select>
            </div>
            <div class="id-placement">
                <label class="form__label">
                    id de la sala
                </label>
                <input type="text" name="room-id" class="input-home id-holder">
            </div>
            <button class="form__button">Get started</button>
            </form>
        </div>
        `
        const divEl = document.querySelector(".id-placement");
        const selectEl = document.querySelector(".select");
        const cs = state.getState();
        selectEl.addEventListener("click", (e) => {
            const target = e.target as any
            console.log(target.value);
            if (target.value == ["existent-room"]) {
                divEl.classList.add("display-on");
                cs.createRoom = ""
                state.setState(cs)
            } else {
                cs.createRoom = "true";
                state.setState(cs)
                divEl.classList.remove("display-on")
            }
        })

        const emailContEl = document.querySelectorAll(".container")
        if (cs.email) {
            emailContEl.forEach((e) => {
                e.classList.add("id-placement")
            })
        }

        this.appendChild(stylesheet)
    };
}
customElements.define("home-page", Home)