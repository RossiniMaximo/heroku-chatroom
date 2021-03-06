"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const express = require("express");
const cors = require("cors");
const nanoid_1 = require("nanoid");
/* app.use tiene que estar arriba de las lineas de lógica */
const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;
const usersColl = db_1.firestore.collection("users");
const roomsColl = db_1.firestore.collection("rooms");
app.post("/signup", function (req, res) {
    const { email } = req.body;
    const { name } = req.body;
    usersColl.where("email", "==", email).get().then((doc) => {
        if (doc.empty) {
            usersColl.add({
                email,
                name,
            }).then((newUserDoc) => {
                res.json({
                    message: "Usuario creado exitosamente",
                    id: newUserDoc.id
                });
            });
        }
        else {
            res.status(400).json({
                message: "user already exists"
            });
        }
        ;
    });
});
app.post("/auth", function (req, res) {
    const { email } = req.body;
    usersColl.where("email", "==", email).get().then((doc) => {
        if (doc) {
            const docId = doc.docs[0].id;
            res.json({
                id: docId
            });
        }
        else {
            res.status(404).json({
                message: "Cuenta inexistente"
            });
        }
    });
});
app.post("/rooms", function (req, res) {
    const { userId } = req.body;
    usersColl.doc(userId.toString()).get().then((doc) => {
        if (doc.exists) {
            const roomRef = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
            roomRef.set({
                messages: [] = [],
                owner: userId
            }).then((rtdbRes => {
                const roomLongId = roomRef.key;
                const roomSimpleId = 1000 + Math.floor(Math.random() * 999);
                roomsColl.doc(roomSimpleId.toString()).set({
                    rtdbRoomId: roomLongId
                }).then(() => {
                    res.json({
                        id: roomSimpleId.toString()
                    });
                });
            }));
        }
        else {
            res.status(401).json({
                message: "No autorizado"
            });
        }
    });
});
app.get("/rooms/:roomId", function (req, res) {
    const { userId } = req.query;
    const { roomId } = req.params;
    usersColl.doc(userId.toString()).get().then((doc) => {
        if (doc.exists) {
            roomsColl.doc(roomId.toString()).get().then((roomDocSnap) => {
                const data = roomDocSnap.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                message: "No esta autorizado para entrar a una sala"
            });
        }
    });
});
app.post("/rooms/:roomId/messages", function (req, res) {
    const { roomId } = req.params;
    const chatRoomsRef = db_1.rtdb.ref("/rooms/" + roomId + "/messages");
    chatRoomsRef.push(req.body, function () {
        console.log("soy el req.body", req.body);
        res.json("ok");
    });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
