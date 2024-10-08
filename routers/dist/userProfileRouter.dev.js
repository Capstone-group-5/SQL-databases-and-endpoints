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
}); // GET ALL USER PROFILES

router.get('/get_all_profiles/:org', function _callee(req, res) {
  var org, db, profiles;
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
          return regeneratorRuntime.awrap(db.all('SELECT * FROM user_profile WHERE Organisation = ?', [org]));

        case 7:
          profiles = _context2.sent;
          res.status(200).json(profiles);
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
}); // GET ONE USER PROFILES

router.get('/get_one_profile/:eMail', function _callee2(req, res) {
  var eMail, db, profile;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          eMail = req.params.eMail;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(dbPromise);

        case 4:
          db = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM user_profile WHERE E_mail = ?', [eMail]));

        case 7:
          profile = _context3.sent;

          if (profile) {
            res.json(profile);
          } else {
            res.status(404), json({
              error: "Profile does'nt exist"
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
}); //NEW USER PROFILE

router.post('/add_new_user', function _callee3(req, res) {
  var _req$body, Organisation, UserName, Surname, E_mail, User_Password, User_Role, db, existingUser, result;

  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body = req.body, Organisation = _req$body.Organisation, UserName = _req$body.UserName, Surname = _req$body.Surname, E_mail = _req$body.E_mail, User_Password = _req$body.User_Password, User_Role = _req$body.User_Role;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(dbPromise);

        case 4:
          db = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(db.get('SELECT * FROM user_profile WHERE E_mail = ?', [E_mail]));

        case 7:
          existingUser = _context4.sent;

          if (!existingUser) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Email already exists'
          }));

        case 12:
          _context4.next = 14;
          return regeneratorRuntime.awrap(db.run('INSERT INTO user_profile (Organisation, UserName, Surname, E_mail, User_Password, User_Role) VALUES (?, ?, ?, ?, ?, ?)', [Organisation, UserName, Surname, E_mail, User_Password, User_Role]));

        case 14:
          result = _context4.sent;
          res.status(201).json({
            id: result.lastID
          });

        case 16:
          _context4.next = 21;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t0 = _context4["catch"](1);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 21:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 18]]);
}); //EDIT USER PROFILE

router.put('/Update/user_profile/:eMail', function _callee4(req, res) {
  var eMail, _req$body2, Organisation, UserName, Surname, E_mail, User_Password, User_Role, db, result;

  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          eMail = req.params.eMail;
          _req$body2 = req.body, Organisation = _req$body2.Organisation, UserName = _req$body2.UserName, Surname = _req$body2.Surname, E_mail = _req$body2.E_mail, User_Password = _req$body2.User_Password, User_Role = _req$body2.User_Role;
          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(dbPromise);

        case 5:
          db = _context5.sent;
          _context5.next = 8;
          return regeneratorRuntime.awrap(db.run('UPDATE user_profile SET Organisation = ?, UserName = ?, Surname = ?, E_mail = ?, User_Password = ?, User_Role = ? WHERE E_MAIL = ?', [Organisation, UserName, Surname, E_mail, User_Password, User_Role, eMail]));

        case 8:
          result = _context5.sent;

          if (result.changes > 0) {
            res.json({
              message: 'Profile updated successfully'
            });
          } else {
            res.status(404).json({
              error: 'Profile not updated'
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
}); //DELETE A PROFILE

router["delete"]('/Delete/user_profile/:id', function _callee5(req, res) {
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
          return regeneratorRuntime.awrap(db.run('DELETE FROM user_profile WHERE id = ? && Organisation = ?', [id]));

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