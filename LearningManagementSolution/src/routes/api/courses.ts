import { Request, Response, Router } from "express";
import {
  Subject,
  Teacher,
  Course,
  Batch,
  Lecture,
  Student,
  TeacherBatch,
  StudentBatch
} from "../../db";
import { CourseModel } from "../../models/Course";
import { BatchModel } from "../../models/Batch";
import { SubjectModel } from "../../models/Subject";
import { all } from "bluebird";

const route: Router = Router();

route.get("/", (req: Request, res: Response) => {
  Course.findAll()
    .then((cources: CourseModel[]) => {
      res.status(200).send(cources);
    })
    .catch((error: Error) => {
      res.status(500).send({
        error: "Could not retrieve courses"
      });
    });
});

route.post("/", (req: Request, res: Response) => {
  Course.create({
    name: req.body.name
  })
    .then((course: CourseModel) => {
      res.status(201).send(course);
    })
    .catch((error: Error) => {
      res.status(501).send({
        error: "Error adding course"
      });
    });
});

route.get("/:id", (req: Request, res: Response) => {
  let courseId: number = parseInt(req.params.id);

  if (isNaN(courseId)) {
    return res.status(403).send({
      error: "Course Id is not a valid number"
    });
  }

  Course.findById(courseId)
    .then((course: CourseModel | null) => {
      if (!course) {
        return res.status(500).send("No such course found");
      }

      res.status(200).send(course);
    })
    .catch((error: Error) => {
      res.status(500).send("Error finding course");
    });
});

route.put("/:id", (req: Request, res: Response) => {
  let courseId: number = parseInt(req.params.id);

  Course.update(
    {
      name: req.body.name
    },
    {
      where: {
        id: courseId
      }
    }
  )
    .then(courses => {
      if (courses[0] < 1) {
        return res.status(500).send("No such course found");
      }

      res.status(200).send(courses[1]);
    })
    .catch((error: Error) => {
      res.status(500).send("Error updating course");
    });
});

route.delete("/:id", (req: Request, res: Response) => {
  let courseId: number = parseInt(req.params.id);

  Course.destroy({
    where: {
      id: courseId
    }
  })
    .then(rowsUpdated => {
      if (rowsUpdated < 1) {
        return res.status(500).send("No such course found");
      }
    })
    .catch((error: Error) => {
      res.status(500).send("Error deleting course");
    });
});

route.post("/:id/batches", (req: Request, res: Response) => {
  let courseId: number = parseInt(req.params.id);

  if (isNaN(courseId)) {
    return res.status(403).send({
      error: "Course Id is not a valid number"
    });
  }

  Course.findById(courseId).then(course => {
    if (!course)
      return res.status(500).send("No course is present with id : " + courseId);

    Batch.create({
      name: req.body.name,
      year: req.body.year,
      courseId: courseId
    })
      .then((batch: BatchModel) => {
        res.status(201).send(batch);
      })
      .catch((error: Error) => {
        res.status(501).send({
          error: "Error adding batch"
        });
      });
  });
});

route.get("/:id/batches", (req: Request, res: Response) => {
  let courseId: number = parseInt(req.params.id);

  if (isNaN(courseId)) {
    return res.status(403).send({
      error: "Course Id is not a valid number"
    });
  }

  Course.findById(courseId).then(course => {
    if (!course)
      return res.status(500).send("No course is present with id : " + courseId);

    Batch.findAll()
      .then((batches: BatchModel[]) => {
        res.status(200).send(batches);
      })
      .catch((error: Error) => {
        res.status(500).send({
          error: "Could not retrieve batches"
        });
      });
  });
});

route.get("/:courseId/batches/:batchId", (req: Request, res: Response) => {
  let courseId: number = parseInt(req.params.courseId);
  let batchId: number = parseInt(req.params.batchId);

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

  Course.findById(courseId).then(course => {
    if (!course)
      return res.status(500).send("No course is present with id : " + courseId);

    Batch.findById(batchId)
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

route.get(
  "/:courseId/batches/:batchId/lectures",
  (req: Request, res: Response) => {
    let courseId: number = parseInt(req.params.courseId);
    let batchId: number = parseInt(req.params.batchId);

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

    Batch.find({
      where: {
        id: batchId,
        courseId: courseId
      }
    }).then(batches => {
      if (!batches)
        return res
          .status(500)
          .send("There are no such batches with id " + batchId);

      Lecture.findAll({
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
  }
);

route.post(
  "/:courseId/batches/:batchId/lectures",
  (req: Request, res: Response) => {
    let courseId: number = parseInt(req.params.courseId);
    let batchId: number = parseInt(req.params.batchId);
    let subjectId: number = parseInt(req.body.subjectId);
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

    Subject.findOne({
      where: {
        id: subjectId
      }
    }).then((subject: SubjectModel | null) => {
      if (!subject) {
        res.status(404).send({
          error: "Could not find subject with id: " + subjectId
        });
      } else {
        Teacher.findOne({
          where: {
            id: teacherId
          }
        }).then(teacher => {
          if (!teacher) {
            res.status(404).send({
              error: "Could not find teacher with id: " + teacherId
            });
          } else {
            Lecture.create({
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
  }
);

route.get(
  "/:courseId/batches/:batchId/lectures/:lectureId",
  (req: Request, res: Response) => {
    let courseId: number = parseInt(req.params.courseId);
    let batchId: number = parseInt(req.params.batchId);
    let lectureId: number = parseInt(req.params.lectureId);

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

      Lecture.findOne({
        where: {
          id: lectureId,
          batchId: batchId
        },
        include: [{ model: Batch }]
      })
        .then((lecture: any) => {
          if (lecture.batch.courseId == courseId) res.status(200).send(lecture);
          else
            return res.send({
              error: "There is no such course with id " + courseId
            });
        })
        .catch(error => {
          res.status(500).send("Error in finding lecture");
        });
 
  }
);

route.get(
  "/:courseId/batches/:batchId/students",
  (req: Request, res: Response) => {
    let courseId: number = parseInt(req.params.courseId);
    let batchId: number = parseInt(req.params.batchId);

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

    Batch.findAll({
      where: {
        id: batchId,
        courseId:courseId
      },

      include: [{ model:Student }]
    }).then(studentBatches => {
      res.status(200).send(studentBatches);
    });
  }
);

route.get(
  "/:courseId/batches/:batchId/teachers",
  (req: Request, res: Response) => {
   
    let courseId: number = parseInt(req.params.courseId);
    let batchId: number = parseInt(req.params.batchId);

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

    Batch.findAll({
      where: {
        id: batchId,
        courseId:courseId
      },

      include: [{ model:Teacher }]
    }).then(teacherBatches => {
      res.status(200).send(teacherBatches);
    });
  
   
  }
);

export default route;
