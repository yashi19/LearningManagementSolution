"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../../db");
const route = express_1.Router();
route.get("/", (req, res) => {
    db_1.Subject.findAll()
        .then((subjects) => {
        res.status(200).send(subjects);
    })
        .catch((error) => {
        res.status(500).send({
            error: "Could not retrieve subjects"
        });
    });
});
route.post("/", (req, res) => {
    let subjectId = parseInt(req.params.id);
    if (isNaN(subjectId)) {
        return res.status(403).send({
            error: 'Subject Id is not a valid number'
        });
    }
    db_1.Subject.findById(subjectId, {
        include: [{ model: db_1.Course }]
    })
        .then((subject) => {
        if (!subject) {
            return res.status(500).send("No such subject found");
        }
        res.status(200).send(subject);
    })
        .catch((error) => {
        res.status(500).send("Error finding subject");
    });
});
route.get('/:id/teachers', (req, res) => {
    let subjectId = parseInt(req.params.id);
    if (isNaN(subjectId)) {
        return res.status(403).send({
            error: 'Subject Id is not a valid number'
        });
    }
    db_1.Subject.findById(subjectId)
        .then((subject) => {
        if (!subject) {
            return res.status(500).send("No such subject found");
        }
        db_1.Teacher.findAll({
            where: {
                subjectId: subjectId
            }
        }).then(teachers => {
            res.status(200).send(teachers);
        }).catch(error => {
            res.status(500).send('Error in finding teachers');
        });
    })
        .catch((error) => {
        res.status(500).send("Error in finding subject");
    });
});
route.put("/:id", (req, res) => {
    let subjectId = parseInt(req.params.id);
    db_1.Subject.update({
        name: req.body.name
    }, {
        where: {
            id: subjectId
        }
    })
        .then((subjects) => {
        if (subjects[0] < 1) {
            return res.status(500).send("No such subject found");
        }
    })
        .catch((error) => {
        res.status(500).send("Error updating subject");
    });
});
route.delete("/:id", (req, res) => {
    let subjectId = parseInt(req.params.id);
    db_1.Subject.destroy({
        where: {
            id: subjectId
        }
    })
        .then((rowsUpdated) => {
        if (rowsUpdated < 1) {
            return res.status(500).send("No such subject found");
        }
    })
        .catch((error) => {
        res.status(500).send("Error deleting subject");
    });
});
exports.default = route;
