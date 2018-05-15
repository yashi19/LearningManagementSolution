import { Request, Response, Router } from "express";


import courseRoutes from "./courses";
import studentRoutes from "./students";
import subjectRoutes from "./subjects";
import teacherRoutes from "./teachers";

const route: Router = Router();

let routes = {
 
  courses: courseRoutes,
  students: studentRoutes,
  subjects: subjectRoutes,
  teachers: teacherRoutes
};

route.use("/courses", routes.courses);
route.use("/teachers", routes.teachers);
route.use("/students", routes.students);
route.use("/subjects", routes.subjects);

export default route;
