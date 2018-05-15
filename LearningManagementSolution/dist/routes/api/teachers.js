"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../../db");
const route = express_1.Router();
route.get("/", (req, res) => {
    db_1.Teacher.findAll()
        .then((teachers) => {
        res.status(200).send(teachers);
    })
        .catch((error) => {
        res.status(500).send({
            error: "Could not retrieve teachers"
        });
    });
});
route.post("/", (req, res) => {
    let subjectId = parseInt(req.body.subjectId);
    if (isNaN(subjectId)) {
        return res.status(403).send({
            error: "subject Id is not a valid number"
        });
    }
    db_1.Subject.findById(subjectId).then(subject => {
        if (!subject)
            return res.status(500).send("No Subject is present with id " + subjectId);
        db_1.Teacher.create({
            name: req.body.name,
            subjectId: subjectId
        })
            .then((teacher) => {
            res.status(201).send(teacher);
        })
            .catch((error) => {
            res.status(501).send({
                error: "Error adding teacher"
            });
        });
    });
});
route.get("/:id", (req, res) => {
    let teacherId = parseInt(req.params.id);
    if (isNaN(teacherId)) {
        return res.status(403).send({
            error: 'Teacher Id is not a valid number'
        });
    }
    db_1.Teacher.findById(teacherId, {
        include: [{ model: db_1.Subject }]
    })
        .then((teacher) => {
        if (!teacher) {
            return res.status(500).send("No such teacher found");
        }
        res.status(200).send(teacher);
    })
        .catch((error) => {
        res.status(500).send("Error finding teacher");
    });
});
route.put("/:id", (req, res) => {
    let teacherId = parseInt(req.params.id);
    db_1.Teacher.update({
        name: req.body.name
    }, {
        where: {
            id: teacherId
        }
    })
        .then((teachers) => {
        if (teachers[0] < 1) {
            return res.status(500).send("No such teacher found");
        }
    })
        .catch((error) => {
        res.status(500).send("Error updating teacher");
    });
});
route.delete("/:id", (req, res) => {
    let teacherId = parseInt(req.params.id);
    db_1.Teacher.destroy({
        where: {
            id: teacherId
        }
    })
        .then((rowsUpdated) => {
        if (rowsUpdated < 1) {
            return res.status(500).send("No such teacher found");
        }
    })
        .catch((error) => {
        res.status(500).send("Error deleting teacher");
    });
});
route.get("/:id/batches", (req, res) => {
    console.log('heyyy');
    let teacherId = parseInt(req.params.id);
    if (isNaN(teacherId)) {
        return res.status(403).send({
            error: "Teacher Id is not a valid number"
        });
    }
    db_1.Teacher.find({
        where: { id: teacherId },
        include: [{ all: true }]
    }).then((teacher) => {
        if (!teacher)
            return res.status(500).send({
                error: 'There is no such teacher with id ' + teacherId
            });
        else {
            res.status(200).send(teacher.batches);
        }
    });
});
exports.default = route;
