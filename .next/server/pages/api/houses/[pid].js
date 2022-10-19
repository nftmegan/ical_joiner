"use strict";
(() => {
var exports = {};
exports.id = 913;
exports.ids = [913];
exports.modules = {

/***/ 163:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
const config = [
    {
        id: 0,
        house: "Vila Abreu",
        calendars: [
            "https://www.airbnb.pt/calendar/ical/15086102.ics?s=c82ad431c86330317f16c719d230ab47",
            "https://admin.booking.com/hotel/hoteladmin/ical.html?t=8546f284-1233-4ff3-a52b-539f1bdcd1cb",
            "http://www.vrbo.com/icalendar/7f2affa11d52438194f9249f7219e608.ics?nonTentative"
        ]
    },
    {
        id: 1,
        house: "Hillside Villa",
        calendars: [
            "https://www.airbnb.pt/calendar/ical/14992622.ics?s=0e545f45c7f663097acd2a6f75a037d8",
            "https://admin.booking.com/hotel/hoteladmin/ical.html?t=e3c55094-e72e-4d11-b1a2-ae235c307886"
        ]
    },
    {
        id: 2,
        house: "Casa Avo",
        calendars: [
            "https://www.airbnb.pt/calendar/ical/32133543.ics?s=daf8796d49f44f730a89acfe88d642b2",
            "https://admin.booking.com/hotel/hoteladmin/ical.html?t=dbcb27ec-0391-4b0e-89c8-77c903ecc5ee", 
        ]
    },
    {
        id: 3,
        house: "Villa Neto",
        calendars: [
            "https://www.airbnb.pt/calendar/ical/31161476.ics?s=02dd56e51355ff4119d86b5258e12533",
            "https://admin.booking.com/hotel/hoteladmin/ical.html?t=5ad16ee7-21ca-4cfb-a2c9-05a741553c69", 
        ]
    },
    {
        id: 4,
        house: "Villa Castanho",
        calendars: [
            "https://admin.booking.com/hotel/hoteladmin/ical.html?t=9560b63d-42fa-43db-99e6-395106930b93",
            "https://www.airbnb.pt/calendar/ical/625822947455859803.ics?s=92c45442eda5fd6ccd46916c475cbd46", 
        ]
    }
];
const fetch_ical = async (url)=>{
    console.log("-----------------> Fetching " + url);
    var body = await fetch(url);
    var data = await body.text();
    var data_split = data.split(/\r?\n/);
    var entry_list = [];
    var current_entry = [];
    var inEvent = false;
    for (var line of data_split){
        var lineCheckArray = line.split(":");
        if (!(lineCheckArray[0].toUpperCase() === lineCheckArray[0] && lineCheckArray.length > 1)) {
            continue;
        }
        if (!inEvent) {
            if (line === "BEGIN:VEVENT") {
                inEvent = true;
                current_entry = [];
                current_entry.push(line);
            }
        } else {
            if (line === "END:VEVENT") {
                inEvent = false;
                current_entry.push(line);
                entry_list.push(current_entry);
                continue;
            } else {
                current_entry.push(line);
            }
        }
    }
    return entry_list;
};
const fetch_all = async (pid)=>{
    console.log("-----------------> FETCHING ALL CALENDARS FOR PID " + pid);
    var final_result = `BEGIN:VCALENDAR\r\nPRODID:-//Google Inc//Google Calendar 70.9054//EN\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:TesteElvioFinal\r\nX-WR-TIMEZONE:Europe/Lisbon\r\n`;
    for (const c of config[pid].calendars){
        var result = await fetch_ical(c);
        for (const entry of result){
            for (const line of entry){
                final_result += line + "\r\n";
            }
        }
    }
    final_result += "END:VCALENDAR";
    return final_result;
};
async function handler(req, res) {
    const { pid  } = req.query;
    const result = await fetch_all(pid);
    const calendarBuffer = Buffer.from(result, "utf-8");
    const downloadFileName = config[pid].house.toLowerCase().replaceAll(" ", "_") + "_calendar.ics";
    res.setHeader("Content-Type", "text/calendar");
    res.setHeader("Content-Disposition", "attachment; filename=" + downloadFileName);
    res.send(calendarBuffer);
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(163));
module.exports = __webpack_exports__;

})();