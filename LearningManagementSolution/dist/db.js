"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const config_1 = require("./config");
exports.db = new sequelize_1.default(config_1.DB.DATABASE, config_1.DB.USERNAME, config_1.DB.PASSWORD, {
    dialect: "mysql",
    host: "localhost"
});
exports.Batch = exports.db.define("batch", {
    name: {
        type: sequelize_1.default.STRING(30),
        allowNull: false
    }
});
exports.Lecture = exports.db.define("lecture", {
    name: {
        type: sequelize_1.default.STRING(30),
        allowNull: false
    }
});
exports.Student = exports.db.define("student", {
    name: {
        type: sequelize_1.default.STRING(30),
        allowNull: false
    }
});
exports.Subject = exports.db.define("subject", {
    name: {
        type: sequelize_1.default.STRING(30),
        allowNull: false
    }
});
exports.Teacher = exports.db.define("teacher", {
    name: {
        type: sequelize_1.default.STRING(30),
        allowNull: false
    }
});
exports.Course = exports.db.define("course", {
    name: {
        type: sequelize_1.default.STRING(30),
        allowNull: false
    }
});
exports.StudentBatch = exports.db.define("studentbatch", {
    id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
});
exports.TeacherBatch = exports.db.define("teacherbatch", {
    id: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
});
exports.Course.hasMany(exports.Batch);
exports.Batch.belongsTo(exports.Course);
exports.Course.hasMany(exports.Student);
exports.Student.belongsTo(exports.Course);
exports.Subject.hasMany(exports.Teacher);
exports.Teacher.belongsTo(exports.Subject);
exports.Course.hasMany(exports.Subject);
exports.Subject.belongsTo(exports.Course);
exports.Batch.hasMany(exports.Lecture);
exports.Lecture.belongsTo(exports.Batch);
exports.Teacher.hasMany(exports.Lecture);
exports.Lecture.belongsTo(exports.Teacher);
exports.Subject.hasMany(exports.Lecture);
exports.Lecture.belongsTo(exports.Subject);
exports.Batch.belongsToMany(exports.Student, { through: exports.StudentBatch });
exports.Student.belongsToMany(exports.Batch, { through: exports.StudentBatch });
exports.Batch.belongsToMany(exports.Teacher, { through: exports.TeacherBatch });
exports.Teacher.belongsToMany(exports.Batch, { through: exports.TeacherBatch });
exports.db
    .sync({ alter: true })
    .then(() => console.log("Database has been syned "))
    .catch((error) => console.error("Error creating database " + error));
