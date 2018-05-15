import { Request, Response, Router } from "express";
import { Teacher, Subject, Batch} from "../../db";
import { TeacherModel } from "../../models/Teacher";

const route: Router = Router();


route.get("/", (req:Request, res:Response) => {
  Teacher.findAll()
    .then((teachers:TeacherModel[]) => {
      res.status(200).send(teachers);
    })
    .catch((error:Error) => {
      res.status(500).send({
        error: "Could not retrieve teachers"
      });
    });
});


route.post("/", (req:Request, res:Response) => {
  let subjectId: number = parseInt(req.body.subjectId);

  if (isNaN(subjectId)) {
    return res.status(403).send({
      error: "subject Id is not a valid number"
    });
  }

  Subject.findById(subjectId).then(subject => {
    if (!subject)
      return res.status(500).send("No Subject is present with id " + subjectId);
      Teacher.create({
        name: req.body.name,
        subjectId:subjectId
      })
        .then((teacher:TeacherModel) => {
          res.status(201).send(teacher);
        })
        .catch((error: Error) => {
          res.status(501).send({
            error: "Error adding teacher"
          });
        });
   
  });
});

route.get("/:id", (req:Request, res:Response) => {

  let teacherId: number = parseInt(req.params.id);

  if(isNaN(teacherId)){
    return res.status(403).send({
        error:'Teacher Id is not a valid number'
    })
  }

  Teacher.findById(teacherId,{
    include: [{ model: Subject  }]   
  })
    .then((teacher: TeacherModel | null) => {
      if (!teacher) {
       return  res.status(500).send("No such teacher found");
      }

      res.status(200).send(teacher);
    })
    .catch((error: Error) => {
      res.status(500).send("Error finding teacher");
    });
});



route.put("/:id", (req:Request, res:Response) => {

  let teacherId: number = parseInt(req.params.id);

  Teacher.update({
    name:req.body.name
  },{
    where:{
      id:teacherId
    }
  })
    .then((teachers) => {
      if (teachers[0]<1) {
        return res.status(500).send("No such teacher found");
      }
    })
    .catch((error: Error) => {
      res.status(500).send("Error updating teacher");
    });
});


route.delete("/:id", (req:Request, res:Response) => {

  let teacherId: number = parseInt(req.params.id);

  Teacher.destroy({
    where:{
      id:teacherId
    }
  })
    .then((rowsUpdated) => {
      if (rowsUpdated < 1) {
        return res.status(500).send("No such teacher found");
      }
    })
    .catch((error: Error) => {
      res.status(500).send("Error deleting teacher");
    });
});



route.get("/:id/batches",(req:Request,res:Response)=>{
  
  console.log('heyyy');
  
  let teacherId=parseInt(req.params.id);
  
  if(isNaN(teacherId)){
 
      return res.status(403).send({
        error: "Teacher Id is not a valid number"
      });
    
  }

  Teacher.find({
    where: { id: teacherId },
    include: [{ all: true}]
  }).then((teacher:any)=> {
    if(!teacher)
      return res.status(500).send({
        error:'There is no such teacher with id '+teacherId
      })
    else{
        res.status(200).send(teacher.batches);
    }
  
  });
})




     

export default route;
