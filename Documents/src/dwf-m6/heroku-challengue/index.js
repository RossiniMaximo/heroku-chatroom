"use strict";
exports.__esModule = true;
var db_1 = require("./db");
var express = require("express");
var cors = require("cors");
var nanoid_1 = require("nanoid");
/* app.use tiene que estar arriba de las lineas de lógica */
var app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
var port = process.env.PORT || 3000;
var usersColl = db_1.firestore.collection("users");
var roomsColl = db_1.firestore.collection("rooms");
app.post("/signup", function (req, res) {
    var email = req.body.email;
    var name = req.body.name;
    usersColl.where("email", "==", email).get().then(function (doc) {
        if (doc.empty) {
            usersColl.add({
                email: email,
                name: name
            }).then(function (newUserDoc) {
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
    var email = req.body.email;
    usersColl.where("email", "==", email).get().then(function (doc) {
        if (doc) {
            var docId = doc.docs[0].id;
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
    var userId = req.body.userId;
    usersColl.doc(userId.toString()).get().then(function (doc) {
        if (doc.exists) {
            var roomRef_1 = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
            roomRef_1.set({
                messages: [],
                owner: userId
            }).then((function (rtdbRes) {
                var roomLongId = roomRef_1.key;
                var roomSimpleId = 1000 + Math.floor(Math.random() * 999);
                roomsColl.doc(roomSimpleId.toString()).set({
                    rtdbRoomId: roomLongId
                }).then(function () {
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
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    usersColl.doc(userId.toString()).get().then(function (doc) {
        if (doc.exists) {
            roomsColl.doc(roomId.toString()).get().then(function (roomDocSnap) {
                var data = roomDocSnap.data();
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
    var roomId = req.params.roomId;
    var chatRoomsRef = db_1.rtdb.ref("/rooms/" + roomId + "/messages");
    chatRoomsRef.push(req.body, function () {
        console.log("soy el req.body", req.body);
        res.json("ok");
    });
});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:".concat(port));
});
