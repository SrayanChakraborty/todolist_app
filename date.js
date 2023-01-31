
module.exports.getDate=getDate;

function getDate(){
    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var today = new Date();
    var date = today.toLocaleDateString("en-US", options);
    return date;
}
module.exports.getDay=getDay;
function getDay(){
    var options = { weekday: 'long' };
    var today = new Date();
    var date = today.toLocaleDateString("en-US", options);
    return date;
}