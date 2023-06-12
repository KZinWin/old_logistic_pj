export function getDateForInput(date) {
        var d =new Date(date);
        var day = d.getDate(); // yields date
        day = day.toString().length == 1 ? ('0' + day) : day
        var month = d.getMonth() + 1;    // yields month (add one as '.getMonth()' is zero indexed)
        month = month.toString().length == 1 ? ('0' + month) : month;
        var year = d.getFullYear();  // yields year
        var rdate = year + '-' + month + '-' + day;
        return rdate;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function getDateForDisplay(date, format=null) {
    if (!!date) {
        var d = new Date(date);
        var day = d.getDate(); // yields date
        day = day.toString().length == 1 ? ('0' + day) : day
        var month = d.getMonth() + 1;    // yields month (add one as '.getMonth()' is zero indexed)
        month = month.toString().length == 1 ? ('0' + month) : month;
        var year = d.getFullYear();  // yields year
        if(format == 'YY-mm-dd'){
            var rdate = year + '-' + month + '-' + day;
        }else{
            var rdate = day + '-' + months[month-1] + '-' + year;
        }
        return rdate;
    } else {
        return null;
    }
}