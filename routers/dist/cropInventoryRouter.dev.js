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
}); //GET ALL CROPS IN INVENTORY

router.get('/Get_crops/:org', function _callee(req, res) {
  var org, db, crops;
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
          return regeneratorRuntime.awrap(db.all('SELECT * FROM crop_inventory WHERE Organisation = ?', [org]));

        case 7:
          crops = _context2.sent;
          res.status(200).json(crops);
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
}); //GET A SINGLE TYPE OF CROP

router.get('/Get_one_type/:org/:type', function _callee2(req, res) {
  var _req$params, org, type, db, cropType;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$params = req.params, org = _req$params.org, type = _req$params.type;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(dbPromise);

        case 4:
          db = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM crop_inventory WHERE Organisation = ? AND CROP = ?', [org, type]));

        case 7:
          cropType = _context3.sent;

          if (cropType) {
            res.json(cropType);
          } else {
            res.status(404).json({
              error: 'Crops not found'
            });
          }

          _context3.next = 14;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            error: _context3.t0.messasge
          });

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 11]]);
}); // ADD A NEW CROP RECORD

router.post('/Add_a_crop', function _callee3(req, res) {
  var _req$body, Organisation, Crop, Yield, db, result;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body = req.body, Organisation = _req$body.Organisation, Crop = _req$body.Crop, Yield = _req$body.Yield;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(dbPromise);

        case 4:
          db = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(db.run('INSERT INTO crop_inventory (Organisation, Crop, Yield) VALUES (?, ?, ?)', [Organisation, Crop, Yield]));

        case 7:
          result = _context4.sent;
          res.status(200).json({
            message: 'Crops successfully added'
          });
          _context4.next = 14;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            error: _context4.t0.messasge
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 11]]);
}); //EDIT A CROP RECORD

router.put('/Update_crop/:id', function _callee4(req, res) {
  var id, _req$body2, Crop, Yield, db, result;

  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          _req$body2 = req.body, Crop = _req$body2.Crop, Yield = _req$body2.Yield;
          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(dbPromise);

        case 5:
          db = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(db.run('UPDATE crop_inventory SET Crop = ?, Yield = ? WHERE cropRecord_Id	= ?', [Crop, Yield, id]));

        case 8:
          result = _context5.sent;

          if (result.changes > 0) {
            res.status(200).json({
              message: 'Crop successfully updated'
            });
          } else {
            res.status(404).json({
              error: 'Crop not updated'
            });
          }

          _context5.next = 15;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](2);
          res.status(500).json({
            error: _context5.t0.messasge
          });

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 12]]);
}); //DELETE A CROP

router["delete"]('/Delete_crop/:id', function _callee5(req, res) {
  var id, db, result;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(dbPromise);

        case 4:
          db = _context6.sent;
          _context6.next = 7;
          return regeneratorRuntime.awrap(db.run('DELETE FROM crop_inventory WHERE cropRecord_Id = ?', [id]));

        case 7:
          result = _context6.sent;

          if (result.changes > 0) {
            res.status(200).json({
              message: 'Successfully deleted'
            });
          } else {
            res.status(404).json({
              Error: 'Unable to delete'
            });
          }

          _context6.next = 14;
          break;

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](1);
          res.status(500).json({
            error: _context6.t0.messasge
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