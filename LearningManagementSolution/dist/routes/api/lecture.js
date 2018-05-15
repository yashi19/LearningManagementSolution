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
            error: "Could not retrieve lecture"
        });
    });
});
route.post("/", (req, res) => {
    db_1.Lecture.create({
        name: req.body.name,
        batchId: req.body.batchId,
        subjectId: req.body.subjectId,
        teacherId: req.body.teacherId
    })
        .then((lecture) => {
        res.status(201).send(lecture);
    })
        .catch((error) => {
        res.status(501).send({
            error: "Error adding Lecture"
        });
    });
});
