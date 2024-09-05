"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var sqlite = _interopRequireWildcard(require("sqlite"));

var _sqlite2 = _interopRequireDefault(require("sqlite3"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _promises = require("fs/promises");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Open database connection


var dbPromise = sqlite.open({
  filename: './data_plan.db',
  driver: _sqlite2["default"].Database
});

function setupDatabase() {
  var db;
  return regeneratorRuntime.async(function setupDatabase$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(dbPromise);

        case 2:
          db = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(db.migrate());

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

setupDatabase()["catch"](function (err) {
  console.error("Database migration failed:", err);
}); // ONLY REMOVE COMMENTS TO EDIT DATABASE STRUCTURE CONSULT BEFORE ATTEMPTING

/* async function runSQLFile(filePath) {
    const db = await dbPromise;
    const sql = await readFile(filePath, 'utf8');
    await db.exec(sql);
}



async function initializeDatabase() {
    try {
        console.log('Running schema update...');
        await runSQLFile('./migrations/003-create-task_sheduler.sql'); // Path to your schema update file
        console.log('Schema updated.');

        console.log('Inserting data...');
        await runSQLFile('./migrations/004-create-task_sheduler-data.sql'); // Path to your insert data file
        console.log('Data inserted.');
    } catch (err) {
        console.error('Error during database initialization:', err);
    }
}

// Call the initialization function when starting the application
initializeDatabase().catch(err => {
    console.error('Failed to initialize database:', err);
});
 */
//RETRIEVE ALL TASKS 

router.get('/retrieve_tasks', function _callee(req, res) {
  var db, tasks;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(dbPromise);

        case 3:
          db = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(db.all('SELECT * FROM task_sheduler'));

        case 6:
          tasks = _context2.sent;
          res.status(200).json(tasks);
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
}); //RETRIEVE ONE TASK

router.get('/Retrieve_one_task/:org/:taskName', function _callee2(req, res) {
  var org, taskName, db, task;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          org = req.params.org;
          taskName = req.params.taskName;
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(dbPromise);

        case 5:
          db = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM task_sheduler WHERE Organisation = ? AND Task = ?', [org, taskName]));

        case 8:
          task = _context3.sent;

          if (task) {
            res.json(task);
          } else {
            res.status(404).json({
              error: 'Could not find task'
            });
          }

          _context3.next = 15;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](2);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 12]]);
}); //ADD A TASK

router.post('/add_new_task/:org', function _callee3(req, res) {
  var _req$body, Organisation, Task, Assigner, Assignee, Status, Description, Dead_line, org, db, existingTask, result;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body = req.body, Organisation = _req$body.Organisation, Task = _req$body.Task, Assigner = _req$body.Assigner, Assignee = _req$body.Assignee, Status = _req$body.Status, Description = _req$body.Description, Dead_line = _req$body.Dead_line;
          org = req.params.org;
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(dbPromise);

        case 5:
          db = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM task_sheduler WHERE Organisation = ? AND Task = ?', [org, Task]));

        case 8:
          existingTask = _context4.sent;

          if (existingTask) {
            res.status(404).json({
              error: 'Task name already exists!'
            });
          } else {
            result = db.run('INSERT INTO task_sheduler (Organisation, Task, Assigner, Assignee, Status, Description, Dead_line) VALUES (?, ?, ?, ?, ?, ?,?)', [Organisation, Task, Assigner, Assignee, Status, Description, Dead_line]);
            res.status(200).json({
              message: 'Task successfully added'
            });
          }

          _context4.next = 15;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](2);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 12]]);
}); // EDIT A TASK

router.put('/Update_task/:org/:selectedTask', function _callee4(req, res) {
  var _req$params, org, selectedTask, _req$body2, Task, Assigner, Assignee, Status, Description, Dead_line, db, existingTask, result;

  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$params = req.params, org = _req$params.org, selectedTask = _req$params.selectedTask;
          _req$body2 = req.body, Task = _req$body2.Task, Assigner = _req$body2.Assigner, Assignee = _req$body2.Assignee, Status = _req$body2.Status, Description = _req$body2.Description, Dead_line = _req$body2.Dead_line;
          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(dbPromise);

        case 5:
          db = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM task_sheduler WHERE Organisation = ? AND Task = ?', [org, Task]));

        case 8:
          existingTask = _context5.sent;

          if (!(existingTask && existingTask.Task !== selectedTask)) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Task name already exists'
          }));

        case 11:
          _context5.next = 13;
          return regeneratorRuntime.awrap(db.run('UPDATE task_sheduler SET Task = ?, Assigner = ?, Assignee = ?, Status = ?, Description = ?, Dead_line = ? WHERE Organisation = ? AND Task = ?', [Task, Assigner, Assignee, Status, Description, Dead_line, org, selectedTask]));

        case 13:
          result = _context5.sent;

          if (result.changes > 0) {
            res.json({
              message: 'Task successfully updated'
            });
          } else {
            res.status(404).json({
              error: 'Unable to update task'
            });
          }

          _context5.next = 20;
          break;

        case 17:
          _context5.prev = 17;
          _context5.t0 = _context5["catch"](2);
          res.status(500).json({
            error: _context5.t0.message
          });

        case 20:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 17]]);
});
router["delete"]('/Delete_task/:org/:selectedTask', function _callee5(req, res) {
  var _req$params2, org, selectedTask, db, result;

  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$params2 = req.params, org = _req$params2.org, selectedTask = _req$params2.selectedTask;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(dbPromise);

        case 4:
          db = _context6.sent;
          _context6.next = 7;
          return regeneratorRuntime.awrap(db.run('DELETE FROM task_sheduler WHERE Organisation = ? AND Task = ?', [org, selectedTask]));

        case 7:
          result = _context6.sent;

          if (result.changes > 0) {
            res.json({
              message: 'Account deleted'
            });
          } else {
            res.status(404).json({
              error: 'Failed to delete account'
            });
          }

          _context6.next = 14;
          break;

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](1);
          res.status(500).json({
            error: _context6.t0.message
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 11]]);
});
var _default = router;
exports["default"] = _default;