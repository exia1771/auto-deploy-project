import moment from 'moment';


export function nullToBlank(o) {
    if (o === null || o === undefined || o === "") {
        return "";
    } else {
        return o;
    }
}

export function isNotNull(o) {
    return !isNull(o);
}

export function isNull(o) {
    return o === null || o === undefined;
}

export function getOrDefault(o, value) {
    if (isNull(o)) {
        return value;
    } else {
        return o;
    }
}

export function objEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function dateFormatter(date) {
    return moment(date).add(8, 'hours').format("YYYY-MM-DD hh:mm:ss");
}