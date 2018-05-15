"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../../db");
const route = express_1.Router();
route.get("/", (req, res) => {
    db_1.Student.findAll()
        .then((students) => {
        res.status(200).send(students);
    })
        .catch((error) => {
        res.status(500).send({
            error: "Could not retrieve students"
        });
    });
});
route.post("/", (req, res) => {
    db_1.Student.create({
        name: req.body.name
    })
        .then((student) => {
        res.status(201).send(student);
    })
        .catch((error) => {
        res.status(501).send({
            error: "Error adding student"
        });
    });
});
route.get("/:id", (req, res) => {
    let studentId = parseInt(req.params.id);
    if (isNaN(studentId)) {
        return res.status(403).send({
            error: "Student Id is not a valid number"
        });
    }
    db_1.Student.findById(studentId)
        .then((student) => {
        if (!student) {
            return res.status(500).send("No such student found");
        }
        res.status(200).send(student);
    })
        .catch((error) => {
        res.status(500).send("Error finding student");
    });
});
route.put("/:id", (req, res) => {
    let studentId = parseInt(req.params.id);
    db_1.Student.destroy({
        where: {
            id: studentId
        }
    })
        .then((rowsUpdated) => {
        if (rowsUpdated < 1) {
            return res.status(500).send("No such student found");
        }
    })
        .catch((error) => {
        res.status(500).send("Error deleting student");
    });
});
route.get("/:id/batches", (req, res) => {
    let studentId = parseInt(req.params.id);
    if (isNaN(studentId)) {
        return res.status(403).send({
            error: "Student Id is not a valid number"
        });
    }
    db_1.Student.find({
        where: { id: studentId },
        include: [{ all: true }]
    }).then((student) => {
        if (!student)
            return res.status(500).send({
                error: 'There is no such student with id ' + studentId
            });
        else {
            res.status(200).send(student.batches);
        }
    });
});
exports.default = route;
