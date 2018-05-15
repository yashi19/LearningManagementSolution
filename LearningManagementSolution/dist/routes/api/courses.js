"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../../db");
const route = express_1.Router();
route.get("/", (req, res) => {
    db_1.Course.findAll()
        .then((cources) => {
        res.status(200).send(cources);
    })
        .catch((error) => {
        res.status(500).send({
            error: "Could not retrieve courses"
        });
    });
});
route.post("/", (req, res) => {
    db_1.Course.create({
        name: req.body.name
    })
        .then((course) => {
        res.status(201).send(course);
    })
        .catch((error) => {
        res.status(501).send({
            error: "Error adding course"
        });
    });
});
route.get("/:id", (req, res) => {
    let courseId = parseInt(req.params.id);
    if (isNaN(courseId)) {
        return res.status(403).send({
            error: "Course Id is not a valid number"
        });
    }
    db_1.Course.findById(courseId)
        .then((course) => {
        if (!course) {
            return res.status(500).send("No such course found");
        }
        res.status(200).send(course);
    })
        .catch((error) => {
        res.status(500).send("Error finding course");
    });
});
route.put("/:id", (req, res) => {
    let courseId = parseInt(req.params.id);
    db_1.Course.update({
        name: req.body.name
    }, {
        where: {
            id: courseId
        }
    })
        .then(courses => {
        if (courses[0] < 1) {
            return res.status(500).send("No such course found");
        }
        res.status(200).send(courses[1]);
    })
        .catch((error) => {
        res.status(500).send("Error updating course");
    });
});
route.delete("/:id", (req, res) => {
    let courseId = parseInt(req.params.id);
    db_1.Course.destroy({
        where: {
            id: courseId
        }
    })
        .then(rowsUpdated => {
        if (rowsUpdated < 1) {
            return res.status(500).send("No such course found");
        }
    })
        .catch((error) => {
        res.status(500).send("Error deleting course");
    });
});
route.post("/:id/batches", (req, res) => {
    let courseId = parseInt(req.params.id);
    if (isNaN(courseId)) {
        return res.status(403).send({
            error: "Course Id is not a valid number"
        });
    }
    db_1.Course.findById(courseId).then(course => {
        if (!course)
            return res.status(500).send("No course is present with id : " + courseId);
        db_1.Batch.create({
            name: req.body.name,
            year: req.body.year,
            courseId: courseId
        })
            .then((batch) => {
            res.status(201).send(batch);
        })
            .catch((error) => {
            res.status(501).send({
                error: "Error adding batch"
            });
        });
    });
});
route.get("/:id/batches", (req, res) => {
    let courseId = parseInt(req.params.id);
    if (isNaN(courseId)) {
        return res.status(403).send({
            error: "Course Id is not a valid number"
        });
    }
    db_1.Course.findById(courseId).then(course => {
        if (!course)
            return res.status(500).send("No course is present with id : " + courseId);
        db_1.Batch.findAll()
            .then((batches) => {
            res.status(200).send(batches);
        })
            .catch((error) => {
            res.status(500).send({
                error: "Could not retrieve batches"
            });
        });
    });
});
route.get("/:courseId/batches/:batchId", (req, res) => {
    let courseId = parseInt(req.params.courseId);
    let batchId = parseInt(req.params.batchId);
    if (isNaN(courseId)) {
        return res.status(403).send({
            error: "Course Id is not a valid number"
        });
    }
    if (isNaN(batchId)) {
        return res.status(403).send({
            error: "Batch Id is not a valid number"
        });
    }
    db_1.Course.findById(courseId).then(course => {
        if (!course)
            return res.status(500).send("No course is present with id : " + courseId);
        db_1.Batch.findById(batchId)
            .then(batch => {
            if (!batch)
                return res.status(500).send("No batch found with id : " + batchId);
            res.status(200).send(batch);
        })
            .catch(error => {
            res.status(500).send("Error in getting batch");
        });
    });
});
route.get("/:courseId/batches/:batchId/lectures", (req, res) => {
    let courseId = parseInt(req.params.courseId);
    let batchId = parseInt(req.params.batchId);
    if (isNaN(courseId)) {
        return res.status(403).send({
            error: "Course Id is not a valid number"
        });
    }
    if (isNaN(batchId)) {
        return res.status(403).send({
            error: "Batch Id is not a valid number"
        });
    }
    db_1.Batch.find({
        where: {
            id: batchId,
            courseId: courseId
        }
    }).then(batches => {
        if (!batches)
            return res
                .status(500)
                .send("There are no such batches with id " + batchId);
        db_1.Lecture.findAll({
            where: {
                batchId: batchId
            }
        })
            .then(lectures => {
            res.status(200).send(lectures);
        })
            .catch(error => {
            res.status(500).send("Error in finding lectures");
        });
    });
});
route.post("/:courseId/batches/:batchId/lectures", (req, res) => {
    let courseId = parseInt(req.params.courseId);
    let batchId = parseInt(req.params.batchId);
    let subjectId = parseInt(req.body.subjectId);
    let teacherId = req.body.teacherId;
    if (!req.body.name) {
        return res.status(403).send({
            error: "Please enter the lecture name"
        });
    }
    if (isNaN(courseId)) {
        return res.status(403).send({
            error: "Course Id is not a valid number"
        });
    }
    if (isNaN(batchId)) {
        return res.status(403).send({
            error: "Batch Id is not a valid number"
        });
    }
    if (isNaN(subjectId)) {
        return res.status(403).send({
            error: "Subject Id is not a valid number"
        });
    }
    db_1.Subject.findOne({
        where: {
            id: subjectId
        }
    }).then((subject) => {
        if (!subject) {
            res.status(404).send({
                error: "Could not find subject with id: " + subjectId
            });
        }
        else {
            db_1.Teacher.findOne({
                where: {
                    id: teacherId
                }
            }).then(teacher => {
                if (!teacher) {
                    res.status(404).send({
                        error: "Could not find teacher with id: " + teacherId
                    });
                }
                else {
                    db_1.Lecture.create({
                        name: req.body.name,
                        batchId: batchId,
                        subjectId: subjectId,
                        teacherId: teacherId
                    })
                        .then(lecture => {
                        res.status(201).send(lecture);
                    })
                        .catch(error => {
                        res.status(500).send("Error in creating lecture");
                    });
                }
            });
        }
    });
});
route.get("/:courseId/batches/:batchId/lectures/:lectureId", (req, res) => {
    let courseId = parseInt(req.params.courseId);
    let batchId = parseInt(req.params.batchId);
    let lectureId = parseInt(req.params.lectureId);
    if (isNaN(courseId)) {
        return res.status(403).send({
            error: "Course Id is not a valid number"
        });
    }
    if (isNaN(batchId)) {
        return res.status(403).send({
            error: "Batch Id is not a valid number"
        });
    }
    if (isNaN(lectureId)) {
        return res.status(403).send({
            error: "Lecture Id is not a valid number"
        });
    }
    db_1.Lecture.findOne({
        where: {
            id: lectureId,
            batchId: batchId
        },
        include: [{ model: db_1.Batch }]
    })
        .then((lecture) => {
        if (lecture.batch.courseId == courseId)
            res.status(200).send(lecture);
        else
            return res.send({
                error: "There is no such course with id " + courseId
            });
    })
        .catch(error => {
        res.status(500).send("Error in finding lecture");
    });
});
route.get("/:courseId/batches/:batchId/students", (req, res) => {
    let courseId = parseInt(req.params.courseId);
    let batchId = parseInt(req.params.batchId);
    if (isNaN(courseId)) {
        return res.status(403).send({
            error: "Course Id is not a valid number"
        });
    }
    if (isNaN(batchId)) {
        return res.status(403).send({
            error: "Batch Id is not a valid number"
        });
    }
    db_1.Batch.findAll({
        where: {
            id: batchId,
            courseId: courseId
        },
        include: [{ model: db_1.Student }]
    }).then(studentBatches => {
        res.status(200).send(studentBatches);
    });
});
route.get("/:courseId/batches/:batchId/teachers", (req, res) => {
    let courseId = parseInt(req.params.courseId);
    let batchId = parseInt(req.params.batchId);
    if (isNaN(courseId)) {
        return res.status(403).send({
            error: "Course Id is not a valid number"
        });
    }
    if (isNaN(batchId)) {
        return res.status(403).send({
            error: "Batch Id is not a valid number"
        });
    }
    db_1.Batch.findAll({
        where: {
            id: batchId,
            courseId: courseId
        },
        include: [{ model: db_1.Teacher }]
    }).then(teacherBatches => {
        res.status(200).send(teacherBatches);
    });
});
exports.default = route;
