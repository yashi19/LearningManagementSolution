import { Request, Response, Router } from "express";
import { Student ,Batch} from "../../db";
import { StudentModel } from "../../models/Student";

const route: Router = Router();

route.get("/", (req:Request, res:Response) => {
  Student.findAll()
    .then((students:StudentModel[]) => {
      res.status(200).send(students);
    })
    .catch((error:Error) => {
      res.status(500).send({
        error: "Could not retrieve students"
      });
    });
});

route.post("/", (req:Request, res:Response) => {
  Student.create({
    name: req.body.name
  })
    .then((student:StudentModel) => {
      res.status(201).send(student);
    })
    .catch((error: Error) => {
      res.status(501).send({
        error: "Error adding student"
      });
    });
});


route.get("/:id", (req:Request, res:Response) => {

  let studentId: number = parseInt(req.params.id);

  if (isNaN(studentId)) {
    return res.status(403).send({
      error: "Student Id is not a valid number"
    });
  }

  Student.findById(studentId)
    .then((student: StudentModel | null) => {
      if (!student) {
        return res.status(500).send("No such student found");
      }

      res.status(200).send(student);
    })
    .catch((error: Error) => {
      res.status(500).send("Error finding student");
    });
});

route.put("/:id", (req:Request, res:Response) => {

  let studentId: number = parseInt(req.params.id);

  Student.destroy({
    where:{
      id:studentId
    }
  })
    .then((rowsUpdated) => {
      if (rowsUpdated < 1) {
        return res.status(500).send("No such student found");
      }
    })
    .catch((error: Error) => {
      res.status(500).send("Error deleting student");
    });
});

route.get("/:id/batches",(req:Request,res:Response)=>{
  
  let studentId=parseInt(req.params.id);

  if(isNaN(studentId)){
 
      return res.status(403).send({
        error: "Student Id is not a valid number"
      });
    
  }

  Student.find({
    where: { id: studentId },
    include: [{ all: true}]
  }).then((student:any)=> {
    if(!student)
      return res.status(500).send({
        error:'There is no such student with id '+studentId
      })
    else{
        res.status(200).send(student.batches);
    }
  });
})




export default route;
