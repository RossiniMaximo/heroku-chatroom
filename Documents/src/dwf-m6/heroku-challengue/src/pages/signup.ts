import { Router } from "@vaadin/router"
import "../router";
import { state } from "../state";
/* En esta escena tengo que hacer un formulario de registro ,
    dar la opción de viajar a la página log-in si ya hay
    se posee una cuenta.
*/

class SignUp extends HTMLElement {
    shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" })
    }
    connectedCallback() {
        this.render();
        const cs = state.getState();
        const formEl = this.shadow.querySelector(".form");
        formEl.addEventListener("submit", (e) => {
            e.preventDefault();
            const target = e.target as any;
            const nameValue = target.nombre.value;
            const emailValue = target.email.value;
            if (nameValue && emailValue != "") {
                state.setNameAndEmail(nameValue, emailValue);
                state.signUp()
                Router.go("/home")
            }
        })
    }
    render() {
        const div = document.createElement('div');
        div.innerHTML = `
            <form class="form">
                <div class="title-container">
                    <h2 class="title">Registro</h2>
                </div>
                <div class="fields-container">
                    <label>
                        <p class="etiqueta">Nombre</p>
                    </label>
                    <input type="text" name="nombre" class="input">
                </div>
                <div class="fields-container">
                    <label>
                        <p class="etiqueta">Email</p>
                    </label>
                    <input type="text" name="email" class="input">
                </div>
                <div class="button-cont">
                    <button class="button">Registrarse</button>
                </div>
                <div class="login-cont">
                    <p class="login-text">¿Ya tienes cuenta?</p>
                    <a href="/home" class="login-text">¡Ingresa aquí!</a>
                </div>
            </form>
        `;
        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = `
            *{
                box-sizing: border-box
            }
            body{
                margin:0;
            }
            .form{
                display : flex;
                flex-direction : column;
                gap : 40px;
            }
            .title-container{
                display:flex;
                flex-direction :column;
                align-items:center;
            }
            .title{
                font-family:"Roboto";
                font-size: 32px;
                margin : 0;
                margin-top : 80px;
                margin-bottom : 50px;
                 color : #DC143C;
            }

            .etiqueta{
                font-family : "Roboto";
                font-size : 16px;   
                margin : 0;
            }
            input:focus, textarea:focus, select:focus{
                outline: none;
            }
            .input{
                max-width :200px;
                padding: 8px;
            }

            .fields-container{
                display : flex;
                flex-direction : column;
                margin : 0 auto;
            }
            .button-cont{
                    max-width :200px;
                    margin: 0 auto;
            }
            .button{
                width :100%;
                padding :10px;
                border : solid 2px;
                border-radius : 4px;
                background-color : #DC143C;
                color : white;
                font-family : "Roboto";
                font-size:14px;
            }
            .login-cont{
                display:flex;
                flex-direction : column;
                align-items:center;
            }
            .login-text{
                font-family:"Roboto";
                color : black;
            }
        `
        this.shadow.appendChild(stylesheet)
        this.shadow.appendChild(div);
    }
}
customElements.define("sign-up", SignUp)