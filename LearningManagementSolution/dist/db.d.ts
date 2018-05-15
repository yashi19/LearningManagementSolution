/// <reference types="sequelize" />
import Sequelize from 'sequelize';
import { BatchModel } from './models/Batch';
import { CourseModel } from './models/Course';
import { LectureModel } from './models/Lecture';
import { StudentModel } from './models/Student';
import { SubjectModel } from './models/Subject';
import { TeacherModel } from './models/Teacher';
import { StudentBatchModel } from './models/StudentBatch';
import { TeacherBatchModel } from './models/TeacherBatch';
export declare const db: Sequelize.Sequelize;
export declare const Batch: Sequelize.Model<BatchModel, any>;
export declare const Lecture: Sequelize.Model<LectureModel, any>;
export declare const Student: Sequelize.Model<StudentModel, any>;
export declare const Subject: Sequelize.Model<SubjectModel, any>;
export declare const Teacher: Sequelize.Model<TeacherModel, any>;
export declare const Course: Sequelize.Model<CourseModel, any>;
export declare const StudentBatch: Sequelize.Model<StudentBatchModel, any>;
export declare const TeacherBatch: Sequelize.Model<TeacherBatchModel, any>;
