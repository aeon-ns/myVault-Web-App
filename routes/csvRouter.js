var csv = require('csv');
var express = require('express');
var router = express.Router();

router.route('/')

    .post(function (req, res, next) {
        console.log('Received file');
        console.log('--------------------------------------------------------------------');
        console.log(req.body);
        console.log('--------------------------------------------------------------------');
        console.log(req.files);
        if (req.files) {
            var file = req.files.csvfile,
                filename = file.name;
            file.mv('./uploads/csv/' + filename, function (err) {
                if (err) {
                    console.log(err);
                    res.send('Error Occurred!');
                } else {
                    res.send('Done');
                }
            });
        }
        else res.redirect('/');
    });

module.exports = router;