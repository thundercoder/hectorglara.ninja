'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var verifyToken = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(captchaResponse) {
    var opts;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            console.info('secret key', process.env['APPSETTING_SECRETKEYGOOGLE']);
            console.info('https://www.google.com/recaptcha/api/siteverify?secret=' + process.env['APPSETTING_SECRETKEYGOOGLE'] + '&response=' + captchaResponse);

            opts = {
              method: 'post',
              url: 'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env['APPSETTING_SECRETKEYGOOGLE'] + '&response=' + captchaResponse
            };
            _context.next = 5;
            return (0, _axios2.default)(opts);

          case 5:
            return _context.abrupt('return', _context.sent);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function verifyToken(_x) {
    return _ref.apply(this, arguments);
  };
}();

// Send email through gmail


var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _check = require('express-validator/check');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/test-json', function (req, res) {
  res.status(200).send((0, _stringify2.default)({ a: 1, b: 2 }));
});

function sendEmail(name, email, subject, message) {
  var transporter = _nodemailer2.default.createTransport({
    service: 'gmail',
    auth: {
      user: process.env['APPSETTING_GMAILEMAIL'],
      pass: process.env['APPSETTING_GMAILPASS']
    }
  });

  // setup email data with unicode symbols
  var mailOptions = {
    from: name + ' "\uD83D\uDC7B" <' + email + '>', // sender address
    to: 'hectorglara@gmail.com; hectorglara@outlook.com', // list of receivers
    subject: subject, // Subject line
    text: message // plain text body
    //html: '<b>Hello world?</b>' // html body
  };

  return new _promise2.default(function (resolve) {
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(true);
    });
  });
}

router.post('/send-email', [(0, _check.check)('name').isLength({ min: 1 }).withMessage('Name is required.'), (0, _check.check)('email').isLength({ min: 1 }).withMessage('Email is required.'), (0, _check.check)('email').isEmail().withMessage('Email must be valid.'), (0, _check.check)('subject').isLength({ min: 1 }).withMessage('Subject is required.'), (0, _check.check)('message').isLength({ min: 1 }).withMessage('Subject is required.')], function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
    var errors, pass, emailResponse;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            errors = (0, _check.validationResult)(req);

            if (errors.isEmpty()) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt('return', res.status(422).json(errors.mapped()));

          case 3:
            _context2.next = 5;
            return verifyToken(req.body.captchaResponse);

          case 5:
            pass = _context2.sent;
            emailResponse = false;


            console.log(pass.data.success);

            if (!pass.data.success) {
              _context2.next = 15;
              break;
            }

            _context2.next = 11;
            return sendEmail(req.body.name, req.body.email, req.body.subject, req.body.message);

          case 11:
            emailResponse = _context2.sent;

            res.status(200).send({ ok: pass && emailResponse });
            _context2.next = 16;
            break;

          case 15:
            res.status(400).send('Mmm, you\'re not human.');

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

module.exports = router;