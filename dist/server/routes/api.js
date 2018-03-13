'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var verifyRecaptcha = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(secretKey, tokenResponse) {
    var res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _axios2.default.post('https://www.google.com/recaptcha/api/siteverify', (0, _stringify2.default)({ secret: secretKey, response: tokenResponse }));

          case 2:
            res = _context.sent;
            return _context.abrupt('return', res.json());

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function verifyRecaptcha(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/test-json', function (req, res) {
  res.status(200).send((0, _stringify2.default)({ a: 1, b: 2 }));
});

function getDogs() {
  return new _promise2.default(function (resolve) {
    return resolve({
      a: 1,
      b: [2, 3, 4, 5]
    });
  });
}

router.get('/dogs', function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    var result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('Start');

            _context2.next = 3;
            return getDogs();

          case 3:
            result = _context2.sent;


            res.status(200).send(result);

            console.log('Finish');

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

function sendEmail(name, email, subject, message) {
  return new _promise2.default(function (resolve, reject) {
    _nodemailer2.default.createTestAccount(function (err, account) {
      // create reusable transporter object using the default SMTP transport
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

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          reject(error);
        }
        resolve(true);

        //console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
    });
  });
}

// Send email through gmail
router.post('/send-email', function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res, next) {
    var isHuman, messageResponse, response;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return verifyRecaptcha(process.env['APPSETTING_SECRETKEYGOOGLE'], req.body.captchaResponse);

          case 2:
            isHuman = _context3.sent;


            if (!isHuman.success) next('Mmm, you\'re not human. :P');

            _context3.next = 6;
            return sendEmail(req.body.name, req.body.email, req.body.subject, req.body.message);

          case 6:
            messageResponse = _context3.sent;
            response = {
              apiGoogle: isHuman,
              sendEmailService: messageResponse
            };


            res.send(response);

          case 9:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}());

module.exports = router;