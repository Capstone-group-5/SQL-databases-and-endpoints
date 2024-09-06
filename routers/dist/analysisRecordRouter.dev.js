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
}); //GET ALL ANALYSIS RECORDS

router.get('/Get_all_analysis/:org', function _callee(req, res) {
  var org, db, analysis;
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
          return regeneratorRuntime.awrap(db.all('SELECT * FROM analysis_record WHERE Organisation = ?', [org]));

        case 7:
          analysis = _context2.sent;
          res.json(analysis);
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
}); //ADD A ANALYSIS RECORD

router.post('/Add_record', function _callee2(req, res) {
  var _req$body, Organisation, CropType, Temperature, Humidity, Rainfall, Nitrogen, Potassium, Phosphorus, pH_Level, db, result;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, Organisation = _req$body.Organisation, CropType = _req$body.CropType, Temperature = _req$body.Temperature, Humidity = _req$body.Humidity, Rainfall = _req$body.Rainfall, Nitrogen = _req$body.Nitrogen, Potassium = _req$body.Potassium, Phosphorus = _req$body.Phosphorus, pH_Level = _req$body.pH_Level;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(dbPromise);

        case 4:
          db = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(db.run('INSERT INTO analysis_record (Organisation, CropType, Temperature, Humidity, Rainfall, Nitrogen, Potassium,  Phosphorus, pH_Level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [Organisation, CropType, Temperature, Humidity, Rainfall, Nitrogen, Potassium, Phosphorus, pH_Level]));

        case 7:
          result = _context3.sent;

          if (result.changes > 0) {
            res.status(200).json({
              message: 'Successfully added'
            });
          } else {
            res.status(404).json({
              error: 'Not added'
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
}); //DELETE A RECORD

router["delete"]('/Delete_record/:id', function _callee3(req, res) {
  var id, db, result;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(dbPromise);

        case 4:
          db = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(db.run('DELETE FROM analysis_record WHERE analysis_Id = ?', [id]));

        case 7:
          result = _context4.sent;

          if (result.changes > 0) {
            res.status(200).json({
              message: 'Successfully deleted'
            });
          } else {
            res.status(404).json({
              error: 'Not deleted'
            });
          }

          _context4.next = 13;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](1);

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 11]]);
});
var _default = router;
exports["default"] = _default;