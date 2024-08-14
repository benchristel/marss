const monthNames = [
    "January",
    "Jan",
    "February",
    "Feb",
    "March",
    "Mar",
    "April",
    "Apr",
    "May",
    "June",
    "Jun",
    "July",
    "Jul",
    "August",
    "Aug",
    "September",
    "Sep",
    "October",
    "Oct",
    "November",
    "Nov",
    "December",
    "Dec",
]

const parseableDateFormats = [
    String.raw`\d\d\d\d-\d\d-\d\d`,
    String.raw`(${monthNames.join("|")})\s+\d\d?,?\s+\d{4}`,
]

export const dateRegex = new RegExp(
    `(${parseableDateFormats.join("|")})`,
    "i",
)
