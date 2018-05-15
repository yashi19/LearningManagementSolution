import { Request, Response, Router } from "express";
import { Lecture } from "../../db";
import { LectureModel } from "../../models/Lecture";

const route: Router = Router();

route.get("/", (req:Request, res:Response) => {
  Lecture.findAll()
    .then((lectures) => {
      res.status(200).send(lectures);
    })
    .catch((error:Error) => {
      res.status(500).send({
        error: "Could not retrieve lecture"
      });
    });
});

route.post("/", (req:Request, res:Response) => {
  Lecture.create({
    name: req.body.name,
    batchId:req.body.batchId,
    subjectId:req.body.subjectId,
    teacherId:req.body.teacherId
  })
    .then((lecture) => {
      res.status(201).send(lecture);
    })
    .catch((error: Error) => {
      res.status(501).send({
        error: "Error adding Lecture"
      });
    });
});