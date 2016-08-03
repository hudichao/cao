#!/usr/bin/env node --harmony
var fs = require('fs');
var os = require('os');


function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
function clearTerminal() {
    process.stdout.write('\033c');
}

var FILENAME = getUserHome() + '/.cao_data.json';

var text = process.argv.slice(2)[0];

if (!text) {
    // show all cnms
    try {
        var data = JSON.parse(fs.readFileSync(FILENAME, 'utf-8'));

        var newData = data.map(function(item) {
            return {
                body: item.body,
                time: item.time,
                showTime: getShowTime(parseInt(item.time), 10)
            }
        }).sort(function(a, b) {
            // 降序
            return b.time - a.time;
        });

        var result = [];

        for (var i = 0; i < newData.length; i ++) {
            result.push(newData[i].showTime + newData[i].body);
        }
        console.log(result.join(os.EOL));
    } catch(e) {
        console.log('cao anything you want.');
        // no file yet
    }
}

if (text) {
    var data = [];
    try {
        var json = fs.readFileSync(FILENAME, 'utf-8');
        data = JSON.parse(json);
        
    } catch (e) {

    }
    data.push({
        body: text,
        time: Date.now()
    });

    fs.writeFileSync(FILENAME, JSON.stringify(data), 'utf-8');
    clearTerminal();
}

function getShowTime(unixTime) {
    try {
        var date = new Date(unixTime);
        var showDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
        // 补全到20字符
        var length = 20 - showDate.length;
        if (length > 0) {
            for (var i = 0; i < length; i++) {
                showDate += ' ';
            }
        }
        return showDate;
    } catch (e) {
        return;
    }
}

