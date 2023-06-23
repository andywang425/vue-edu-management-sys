import { ElMessage } from 'element-plus';

function getByteLength(str) {
    let byteLength = str.length;
    for (let i = 0; i < str.length; i++) {
        if ((str.charCodeAt(i) & 0xff00) != 0) {
            byteLength++;
        }
    }
    return byteLength
}

function throttle(func, wait = 5000) {
    let context, now;
    let previous = 0;
    return function (...args) {
        context = this;
        now = Date.now();
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    };
}

const _warning = throttle(ElMessage.warning)

function route_jump(router, res) {
    if (res.code) {
        if (res.code === 302) {
            router.push('/login');
            _warning(res.msg);
        } else if (res.code === 403) {
            router.push('/403')
            _warning(res.msg);
        }
    }
}

function search_filter(obj, str) {
    if (!str) {
        return true;
    }
    const lowerCaseStr = str.toLowerCase();
    return Object.values(obj).some(value => {
        return String(value).toLowerCase().includes(lowerCaseStr);
    });
}

function isNaturalNumber(str) {
    const num = Number(str);
    return Number.isInteger(num) && num >= 0;
}

function hasAllKeys(obj, keys) {
    const objValues = Object.keys(obj);
    for (const k of keys) {
        if (!objValues.includes(k))
            return [false, k]
    }
    return [true, undefined];
}

function objectList2Array(objectsArray, properties) {
    return objectsArray.map(object => properties.map(property => object[property]));
}


// 将数字x转换为第x学期
const num2word = (semesterNum) => {
    return semesterNum == 1 ? '第一学期' :
        semesterNum == 2 ? '第二学期' :
            semesterNum;
};
// 将学年转换为一个范围
const year_ext = (year) => {
    return `${year}-${Number(year) + 1}`
};

// 将学年从范围变为单个数字
const year_short = (year) => {
    return year.split('-')[0];
}

// 转换接收到的数据列表
const convertDataList = (dataList) => {
    dataList = dataList.map(json => {
        json.semester = num2word(json.semester);
        json.year = year_ext(json.year);
        return json;
    })
};

export { getByteLength, route_jump, search_filter, isNaturalNumber, hasAllKeys, objectList2Array, num2word, year_ext, year_short, convertDataList }
