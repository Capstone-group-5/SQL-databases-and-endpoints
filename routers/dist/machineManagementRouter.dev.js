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
}); //GET ALL MACHINES

router.get('/retrieve_all_machines/:org', function _callee(req, res) {
  var org, db, machines;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          org = req.params.org;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(dbPromise);

        case 4:
          db = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(db.all('SELECT * FROM machinery_inventory WHERE Organisation = ?', [org]));

        case 7:
          machines = _context2.sent;
          res.status(200).json(machines);
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 11]]);
}); //GET ONE MACHINE

router.get('/retrieve_one_machine/:org/:regNumber', function _callee2(req, res) {
  var _req$params, org, regNumber, db, machines;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$params = req.params, org = _req$params.org, regNumber = _req$params.regNumber;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(dbPromise);

        case 4:
          db = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM machinery_inventory WHERE Organisation = ? AND reg_number = ? ', [org, regNumber]));

        case 7:
          machines = _context3.sent;

          if (machines) {
            res.json(machines);
          } else {
            res.status(404).json({
              error: "Could'nt find machine"
            });
          }

          _context3.next = 14;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 11]]);
}); //ADD A NEW MACHINE

router.post('/Add_machine/:org/:regNumber', function _callee3(req, res) {
  var _req$params2, org, regNumber, _req$body, Organisation, Machinery, reg_number, Condition, Issue, db, existingMachine;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$params2 = req.params, org = _req$params2.org, regNumber = _req$params2.regNumber;
          _req$body = req.body, Organisation = _req$body.Organisation, Machinery = _req$body.Machinery, reg_number = _req$body.reg_number, Condition = _req$body.Condition, Issue = _req$body.Issue;
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(dbPromise);

        case 5:
          db = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM machinery_inventory WHERE Organisation = ? AND reg_number = ?', [org, regNumber]));

        case 8:
          existingMachine = _context4.sent;

          if (existingMachine) {
            res.status(404).json({
              error: 'Machine registration already exists!'
            });
          } else {
            db.run('INSERT INTO machinery_inventory (Organisation, Machinery, reg_number, Condition, Issue) VALUES (?, ?, ?, ?, ?)', [Organisation, Machinery, reg_number, Condition, Issue]);
            res.status(200).json({
              message: 'Machine successfully added'
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
}); //EDIT A MACHINE

router.put('/Update_machine/:org/:regNumber', function _callee4(req, res) {
  var _req$params3, org, regNumber, _req$body2, Machinery, reg_number, Condition, Issue, db, result;

  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$params3 = req.params, org = _req$params3.org, regNumber = _req$params3.regNumber;
          _req$body2 = req.body, Machinery = _req$body2.Machinery, reg_number = _req$body2.reg_number, Condition = _req$body2.Condition, Issue = _req$body2.Issue;
          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(dbPromise);

        case 5:
          db = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(db.run('UPDATE machinery_inventory SET  Machinery = ?, reg_number = ?, Condition = ?, Issue = ? WHERE Organisation = ? AND reg_number = ?', [Machinery, reg_number, Condition, Issue, org, regNumber]));

        case 8:
          result = _context5.sent;

          if (result.changes > 0) {
            res.json({
              message: 'Machine successfully updated'
            });
          } else {
            res.status(404).json({
              error: 'Unable to update machine'
            });
          }

          _context5.next = 15;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](2);
          res.status(500).json({
            error: _context5.t0.message
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 12]]);
}); //DELETE A MACHINE

router["delete"]('/Delete_machine/:org/:regNumber', function _callee5(req, res) {
  var _req$params4, org, regNumber, db, result;

  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$params4 = req.params, org = _req$params4.org, regNumber = _req$params4.regNumber;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(dbPromise);

        case 4:
          db = _context6.sent;
          _context6.next = 7;
          return regeneratorRuntime.awrap(db.run('DELETE FROM machinery_inventory WHERE Organisation = ? AND reg_number = ?', [org, regNumber]));

        case 7:
          result = _context6.sent;

          if (result.changes > 0) {
            res.json({
              message: 'Machine deleted'
            });
          } else {
            res.status(404).json({
              error: 'Failed to delete machine'
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