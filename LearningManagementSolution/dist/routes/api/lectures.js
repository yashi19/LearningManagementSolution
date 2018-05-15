"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../../db");
const route = express_1.Router();
route.get("/", (req, res) => {
    db_1.Lecture.findAll()
        .then((lectures) => {
        res.status(200).send(lectures);
    })
        .catch((error) => {
        res.status(500).send({
            error: "Could not retrieve lectures"
        });
    });
});
route.post("/", (req, res) => {
    db_1.Lecture.create({
        name: req.body.name
    })
        .then((lecture) => {
        res.status(201).send(lecture);
    })
        .catch((error) => {
        res.status(501).send({
            error: "Error adding lecture"
        });
    });
});
exports.default = route;
