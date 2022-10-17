const config = [{
    id: 0,
    house: "Mia House",
    calendars: [
        "https://calendar.google.com/calendar/ical/468f5e6dcc759b59acfb804303b9c4db75a99a8aae079b8f23a75f04b3487038%40group.calendar.google.com/public/basic.ics",
        "https://calendar.google.com/calendar/ical/6cb5568f453f48bf909e01e8cf2aa853a0c43f6757606a47924b5deed60a0621%40group.calendar.google.com/public/basic.ics"
    ]
}]

const fetch_ical = async (url) => {
    console.log("fetching " + url);

    var body = await fetch(url);
    var data = await body.text();

    const result = data.split("\r\nBEGIN:VEVENT\r\n").map(el => el.split("END:VEVENT\r\n")).reduce((acc, curr) => acc.concat(curr));
    result.shift();
    result.pop();
    const filtered_result = result.filter(w => w.length > 5)
    
    var return_arr = [];
    filtered_result.forEach(element => return_arr.push(element));
    
    return return_arr;
}

const fetch_all = async (pid) => {
    var final_result = `BEGIN:VCALENDAR\r\nPRODID:-//Google Inc//Google Calendar 70.9054//EN\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:TesteElvioFinal\r\nX-WR-TIMEZONE:Europe/Lisbon\r\n`;

    for(const c of config[pid].calendars) {
        var result = await fetch_ical(c);

        for(const e of result) {
            final_result += "BEGIN:VEVENT\r\n";
            final_result += e;
            final_result += "END:VEVENT\r\n";
        }
    }

    final_result += "END:VCALENDAR";

    return final_result;
}

export default async function handler(req, res) {
    const { pid } = req.query
    //res.end(`Post: ${pid}`)

    const result = await fetch_all(pid);
    // include node fs module
    var fs = require('fs');
    
    // writeFile function with filename, content and callback function
    await fs.promises.writeFile('public/calendar.ics', result, function (err) {
    if (err) throw err;
        console.log('File is created successfully.');
    });

    var filePath = "public/calendar.ics";
    const imageBuffer = fs.readFileSync(filePath);
    res.setHeader('Content-Type', 'text/calendar');
    res.send(imageBuffer);
}