const API_URL = "https://dwf-m6-heroku.herokuapp.com/";
import { rtdb } from "./rtdb";
import map from "lodash/map"
/* no se esta mandando el from de los mensajes dando undefined */
const state = {
    data: {
        name: "",
        email: "",
        userId: "",
        roomId: "",
        rtdbRoomId: "",
        createRoom: "true",
        messages: [] = [],
    },
    listeners: [],
    init() {
        const storagedData = localStorage.getItem("state");
        if (storagedData == "true") {
            state.setState(storagedData)
        }
    },
    listenRoom() {
        const cs = this.getState();
        console.log("soy la realtime :", rtdb);

        const roomRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);
        roomRef.on("value", (snapshot) => {
            const serverData = snapshot.val();
            console.log("mensajes del servidor", serverData);
            const msgList = map(serverData.messages);
            cs.messages = msgList;
            this.setState(cs)
        })
    },
    getState() {
        return this.data;
    },
    setState(newState) {
        this.data = newState;
        console.log("soy el state", newState);
        for (var cb of this.listeners) {
            cb();
        };
        localStorage.setItem("state", JSON.stringify(newState))
    },
    subscribe(callback: (any) => any) {
        this.listeners.push(callback);
    },
    setNameAndEmail(name: string, email?: string, callback?) {
        const currentState = this.getState();
        currentState.name = name;
        currentState.email = email;
        /*  console.log("nombre y email del estado", name, email); */
        this.setState(currentState);
    },
    pushMessage(message: string) {
        const cs = this.getState();
        fetch(API_URL + "/rooms/" + cs.rtdbRoomId + "/messages", {
            method: "post",
            headers: {
                'content-type': "application/json"
            },
            body: JSON.stringify({
                from: cs.name,
                message
            })
        })
        this.setState(cs)
    },
    signUp(callback?) {
        const cs = this.getState();
        fetch(API_URL + "/signup", {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email: cs.email,
                name: cs.name
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            cs.userId = data.id;
            this.setState(cs);
            callback();
        })
    }
    ,
    signIn(callback?) {
        const cs = this.getState();
        if (cs.email) {
            fetch(API_URL + "/auth", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    email: cs.email
                })
            }).then((res) => {
                return res.json();
            }).then((data) => {
                cs.userId = data.id
                this.setState(cs)
                callback()
            })
        }
    },
    askNewRoom(callback?) {
        const cs = this.getState();
        if (cs.userId) {
            fetch(API_URL + "/rooms", {
                method: "post",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ userId: cs.userId })
            }).then((res) => {
                return res.json();
            }).then((data) => {
                console.log("soy lada data de askNewRoom", data);
                cs.roomId = data.id;
                this.setState(cs);
                callback();
            })
        } else {
            console.error("Error , id del usuario , inexistente")
        }
    },
    accessToRoom(callback?) {
        const cs = this.getState();
        fetch(API_URL + "/rooms/" + cs.roomId + "?userId=" + cs.userId)
            .then((res) => { return res.json() })
            .then((data) => {
                console.log("soy la data del accesToRoom", data);
                cs.rtdbRoomId = data.rtdbRoomId;
                this.setState(cs);
                this.listenRoom();
            })
    }
};

export { state };

/* Cosas que faltan :  */
/*
    Lograr conectar a un room  existente.

    Crear una escena para registrarse la cual tenga un botón
    con la opción de traslado a la escena de log in si ya posee cuenta registrada.

*/