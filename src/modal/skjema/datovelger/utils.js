export function dateLessOrEqual(date1, date2) {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();

    const mon1 = date1.getMonth();
    const mon2 = date2.getMonth();

    const day1 = date1.getDate();
    const day2 = date2.getDate();

    if (year1 < year2) return true;
    else if (year1 === year2 && mon1 < mon2) return true;

    return year1 === year2 && mon1 === mon2 && day1 < day2;
}

export function dateGreaterOrEqual(date1, date2) {
    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();

    const mon1 = date1.getMonth();
    const mon2 = date2.getMonth();

    const day1 = date1.getDate();
    const day2 = date2.getDate();

    if (year1 > year2) return true;
    else if (year1 === year2 && mon1 > mon2) return true;

    return year1 === year2 && mon1 === mon2 && day1 > day2;
}
