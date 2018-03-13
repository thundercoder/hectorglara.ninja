'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

function sendEmail(name, email, subject, message) {
  return new _promise2.default(function (resolve) {
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
          console.log(error);
        }
        resolve();

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
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
    var pass;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pass = false;


            _axios2.default.post('https://www.google.com/recaptcha/api/siteverify', (0, _stringify2.default)({ secret: process.env['APPSETTING_SECRETKEYGOOGLE'], response: req.body.captchaResponse })).then(function (response) {
              pass = response.data['success'];
              console.log(response.data);
            }).catch(function (err) {
              return next('Mmm, you\'re not human. :P');
            });

            if (!pass) {
              _context.next = 5;
              break;
            }

            _context.next = 5;
            return sendEmail(req.body.name, req.body.email, req.body.subject, req.body.message);

          case 5:

            res.send(true);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

module.exports = router;