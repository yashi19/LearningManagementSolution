import { Request, Response, Router } from "express";
import { Subject, Course, Teacher } from "../../db";
import { SubjectModel } from "../../models/Subject";
import { CourseModel } from "../../models/Course";
import { TeacherModel } from "../../models/Teacher";

const route: Router = Router();

route.get("/", (req:Request, res:Response) => {
  Subject.findAll()
    .then((subjects: SubjectModel[]) => {
      res.status(200).send(subjects);
    })
    .catch((error: Error) => {
      res.status(500).send({
        error: "Could not retrieve subjects"
      });
    });
});

route.post("/", (req:Request, res:Response) => {

  let subjectId: number = parseInt(req.params.id);

  if(isNaN(subjectId)){
    return res.status(403).send({
        error:'Subject Id is not a valid number'
    })
  }

  Subject.findById(subjectId,{
    include: [{ model: Course  }]   
  })
    .then((subject: SubjectModel | null) => {
      if (!subject) {
        return  res.status(500).send("No such subject found");
      }

      res.status(200).send(subject);
    })
    .catch((error: Error) => {
      res.status(500).send("Error finding subject");
    });
});


route.get('/:id/teachers',(req:Request,res:Response)=>{
  let subjectId:number=parseInt(req.params.id);

  if(isNaN(subjectId)){
    return res.status(403).send({
        error:'Subject Id is not a valid number'
    })
  }

  Subject.findById(subjectId)
    .then((subject: SubjectModel | null) => {
      if (!subject) {
        return  res.status(500).send("No such subject found");
      }

    Teacher.findAll({
        where:{
          subjectId:subjectId
        }
      }).then(teachers=>{
        res.status(200).send(teachers);
      }).catch(error=>{
        res.status(500).send('Error in finding teachers');
      })

    })
    .catch((error: Error) => {
      res.status(500).send("Error in finding subject");
    });


})



route.put("/:id", (req:Request, res:Response) => {

  let subjectId: number = parseInt(req.params.id);

  Subject.update({
    name:req.body.name
  },{
    where:{
      id:subjectId
    }
  })
    .then((subjects) => {
      if (subjects[0]<1) {
        return res.status(500).send("No such subject found");
      }

    })
    .catch((error: Error) => {
      res.status(500).send("Error updating subject");
    });
});


route.delete("/:id", (req:Request, res:Response) => {

  let subjectId: number = parseInt(req.params.id);

  Subject.destroy({
    where:{
      id:subjectId
    }
  })
    .then((rowsUpdated) => {
      if (rowsUpdated < 1) {
        return res.status(500).send("No such subject found");
      }
    })
    .catch((error: Error) => {
      res.status(500).send("Error deleting subject");
    });
});

export default route;
