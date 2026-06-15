import Vue from "vue";
import { encryptsm4, decryptsm4, encryptsm4file } from "@/utils/smcrypto";
Vue.mixin({
    methods: {
        /**
         * 获取数组最后一个值
         * @param array
         * @returns {*}
         */
        last(array) {
            let str = false;
            if (typeof array === "object" && array.length > 0) {
                str = array[array.length - 1];
            }
            return str;
        },

        /**
         * 删除数组最后一个值
         * @param array
         * @returns {Array}
         */
        delLast(array) {
            let newArray = [];
            if (typeof array === "object" && array.length > 0) {
                this.each(array, (index, item) => {
                    if (index < array.length - 1) {
                        newArray.push(item);
                    }
                });
            }
            return newArray;
        },

        /**
         * 字符串是否包含
         * @param string
         * @param find
         * @returns {boolean}
         */
        strExists(string, find) {
            string += "";
            find += "";
            return string.indexOf(find) !== -1;
        },

        /**
         * 字符串是否左边包含
         * @param string
         * @param find
         * @returns {boolean}
         */
        leftExists(string, find) {
            string += "";
            find += "";
            return string.substring(0, find.length) === find;
        },

        /**
         * 字符串是否右边包含
         * @param string
         * @param find
         * @returns {boolean}
         */
        rightExists(string, find) {
            string += "";
            find += "";
            return string.substring(string.length - find.length) === find;
        },

        /**
         * 取字符串中间
         * @param string
         * @param start
         * @param end
         * @returns {*}
         */
        getMiddle(string, start, end) {
            string += "";
            if (this.isHave(start) && this.strExists(string, start)) {
                string = string.substring(string.indexOf(start) + start.length);
            }
            if (this.isHave(end) && this.strExists(string, end)) {
                string = string.substring(0, string.indexOf(end));
            }
            return string;
        },

        /**
         * 截取字符串
         * @param string
         * @param start
         * @param end
         * @returns {string}
         */
        subString(string, start, end) {
            string += "";
            if (!this.isHave(end)) {
                end = string.length;
            }
            return string.substring(start, end);
        },

        /**
         * 随机字符
         * @param len
         * @returns {string}
         */
        randomString(len) {
            len = len || 32;
            let $chars =
                "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678oOLl9gqVvUuI1";
            let maxPos = $chars.length;
            let pwd = "";
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },

        /**
         * 判断是否有
         * @param set
         * @returns {boolean}
         */
        isHave(set) {
            return !!(
                set !== null &&
                set !== "null" &&
                set !== undefined &&
                set !== "undefined" &&
                set !== "" &&
                set
            );
        },

        /**
         * 补零
         * @param str
         * @param length
         * @param after
         * @returns {*}
         */
        zeroFill(str, length, after) {
            str += "";
            if (str.length >= length) {
                return str;
            }
            let _str = "",
                _ret = "";
            for (let i = 0; i < length; i++) {
                _str += "0";
            }
            if (after || typeof after === "undefined") {
                _ret = (_str + "" + str).substr(length * -1);
            } else {
                _ret = (str + "" + _str).substr(0, length);
            }
            return _ret;
        },

        DateToUnix: function (string) {
            var f = string.split(" ", 2);
            var d = (f[0] ? f[0] : "").split("-", 3);
            var t = (f[1] ? f[1] : "").split(":", 3);
            return new Date(
                parseInt(d[0], 10) || null,
                (parseInt(d[1], 10) || 1) - 1,
                parseInt(d[2], 10) || null,
                parseInt(t[0], 10) || null,
                parseInt(t[1], 10) || null,
                parseInt(t[2], 10) || null
            ).getTime();
        },
        UnixToDate: function (unixTime, isFull, timeZone) {
            if (typeof timeZone == "number") {
                unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
            }
            var time = new Date();
            var ymdhis = "";
            ymdhis += time.getUTCFullYear() + "-";
            ymdhis += time.getUTCMonth() + 1 + "-";
            ymdhis += time.getUTCDate();
            if (isFull === true) {
                ymdhis += "" + time.getUTCHours() + ":";
                ymdhis += time.getUTCMinutes() + ":";
                ymdhis += time.getUTCSeconds();
            }
            return ymdhis;
        },
        // 根据id去重
        unique(arr) {
            const res = new Map();
            return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
        },
        /**
         * 时间戳转时间格式
         * @param format
         * @param v
         * @returns {string}
         */
        formatDate(dateStr) {
            var date = new Date(dateStr);
            var YY = date.getFullYear();
            var MM =
                date.getMonth() + 1 < 10
                    ? "0" + (date.getMonth() + 1)
                    : date.getMonth() + 1;
            var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

            return YY + "-" + MM + "-" + DD;
        },
        /**
         * 是否日期格式
         * @returns {boolean}
         */
        isDate(string) {
            let reg = /^(\d{4})-(\d{2})-(\d{2})$/;
            let str = string + "";
            if (str === "") return false;
            return !(!reg.test(str) && RegExp.$2 <= 12 && RegExp.$3 <= 31);
        },
        // 校验身份证
        isIdCard(str) {
            return /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(str)
        },
        // 检查手机号码格式除脱敏
        isDesPhone(str) {
            if (str) {
                return /^\d{3}(\*|\d){4}\d{4}$/.test(str)
            } else {
                return true
            }
        },
        /**
         * 检测手机号码格式
         * @param str
         * @returns {boolean}
         */
        isMobile(str) {
            return /^1(3|4|5|6|7|8|9)\d{9}$/.test(str);
        },
        // 邮箱
        isMailbox(str) {
            var myreg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            return !myreg.test(str);
        },

        /**
         * 秒转化为天小时分秒字符串
         * @param value
         * @returns {string}
         */
        formatSeconds(value) {
            let theTime = parseInt(value); // 秒
            let theTime1 = 0; // 分
            let theTime2 = 0; // 小时
            if (theTime > 60) {
                theTime1 = parseInt(theTime / 60);
                theTime = parseInt(theTime % 60);
                if (theTime1 > 60) {
                    theTime2 = parseInt(theTime1 / 60);
                    theTime1 = parseInt(theTime1 % 60);
                }
            }
            let result = this.zeroFill(parseInt(theTime), 2) + "秒";
            if (theTime1 > 0) {
                result = this.zeroFill(parseInt(theTime1), 2) + "分" + result;
            }
            if (theTime2 > 0) {
                if (theTime2 > 72) {
                    let day = parseInt(theTime2 / 24);
                    theTime2 -= parseInt(day * 24);
                    result =
                        day + "天" + this.zeroFill(parseInt(theTime2), 2) + "小时" + result;
                } else {
                    result = this.zeroFill(parseInt(theTime2), 2) + "小时" + result;
                }
            }
            if (theTime1 === 0 && theTime2 === 0) {
                result = "00分" + result;
            }
            return result;
        },

        /**
         * 数组是否包含
         * @param value
         * @param array
         * @returns {boolean}
         */
        inArray(value, array) {
            if (this.likeArray(array)) {
                for (let i = 0; i < array.length; i++) {
                    if (value === array[i]) {
                        return true;
                    }
                }
            }
            return false;
        },
        getRequest(path) {
            let url = path.split("?")[1].split("&"); //获取url中"?"符后的字串
            console.log(url);
            let query = {};
            url.forEach((item) => {
                query[item.split("=")[0]] = decodeURIComponent(item.split("=")[1]); //转码
            });
            return query;
        },
        // 获取地区中文值
        getAreaVal(code, area) {
            var province = code.substring(0, 2) + "0000";
            var city = code.substring(0, 4) + "00";
            var county = code.substring(0, 6);
            var provinceName = area.province_list[province] || "";
            var cityName = area.city_list[city] || "";
            var countyName = area.county_list[county] || "";
            return provinceName + cityName + countyName;
        },
        // 获取code
        setCodeValues(values, dataForm) {
            for (var key in values) {
                dataForm.map((item) => {
                    if (item["key"] == key) {
                        if (item.type == "picker") {
                            // 只有是选择的时候才会需要
                            values[key] = this.getCode(values[key], item.columns);
                        } else {
                            item.val = values[key];
                        }
                    }
                });
            }
            return values;
        },
        // 获取val
        setdataFormVal(values, dataForm) {
            for (var key in values) {
                dataForm.map((item) => {
                    if (item["key"] == key) {
                        if (item.type == "picker") {
                            // 只有是选择的时候才会需要
                            item.val = this.getVal(values[key], item.columns);
                        }
                        else if (item.type == "checkbox") {
                            // 多选赋值
                            if (values[key]) {
                                item.checkboxVal = values[key].split(",")
                            }
                            item.val = values[key]
                        }
                        else {
                            item.val = values[key];
                        }
                    }
                });
            }
            return dataForm;
        },
        getName(code, list) {
            let name = "";
            if (code) {
                let codeArr = [];
                list.map((item) => {
                    code.split(",").map((itm) => {
                        if (itm == item.code) {
                            codeArr.push(item.text);
                        }
                    });
                });
                name = codeArr.join(",");
            }
            return name;
        },
        // 文件加密
        getisEncParamsfile(data) {
            var encryQuery = {};
            var key = "";
            var encryptsm4Data = encryptsm4file(JSON.stringify(data))
            encryQuery = {
                data: encryptsm4Data.encryptData,
                dataKey: encryptsm4Data.req,
            }
            key = encryptsm4Data.key
            return {
                encryQuery, key
            }
        },
        // 加密
        getisEncParams(data, pageIndex, pageSize) {
            var encryQuery = {};
            var key = "";
            var encryptsm4Data = encryptsm4(JSON.stringify(data))
            encryQuery = {
                data: encryptsm4Data.encryptData,
                dataKey: encryptsm4Data.req,
                pageIndex,
                pageSize
            }
            key = encryptsm4Data.key
            return {
                encryQuery, key
            }
        },
        // 解密
        getisDecData(resData, key, isString) {
            var data = decryptsm4(resData, key)
            if (isString) {
                return data
            } else {
                return JSON.parse(data)
            }
        },
        // 获取字典接口
        async getDicData(dictTypeId, type) {
            if (sessionStorage.getItem(type)) {
                this[type] = JSON.parse(sessionStorage.getItem(type))
            } else {
                var query = {
                    dictTypeId,
                    type: "0",
                }
                console.log(query, "字典请求参数");
                var encryData = this.getisEncParams(query);
                await this.$http(`queryDictInfoByDictTypeId`, { ...encryData.encryQuery, isEnc: 1 })
                    .then((res) => {
                        var resData = this.getisDecData(res.data, encryData.key);
                        console.log(resData, "解密后数据");
                        if (type == "cbStatusList") {
                            // 待放款后不能选择
                            // resData.map(item => {
                            //     // if (Number(item.dictId) > 2) {
                            //     if (item.dictId == '5') {
                            //         item.disabled = true
                            //     }
                            // })
                            sessionStorage.setItem(type, JSON.stringify(resData))
                            this[type] = resData
                        } else {
                            sessionStorage.setItem(type, JSON.stringify(resData))
                            this[type] = resData
                        }
                    })
                    .catch((err) => {
                        console.log(err, "错误");
                    });
            }
        },
        getCode(name, list) {
            let code = "";
            if (name) {
                let nameArr = [];
                list.map((item) => {
                    name.split(",").map((itm) => {
                        if (itm == item.dictName) {
                            nameArr.push(item.dictId);
                        } else if (itm == item.dictId) {
                            nameArr.push(item.dictId);
                        }
                    });
                });
                code = nameArr.join(",");
            }
            return code;
        },
        // 获取字典接口
        getVal(code, list) {
            let name = "";
            if (code) {
                let codeArr = [];
                list.map((item) => {
                    code.split(",").map((itm) => {
                        if (itm == item.dictId) {
                            codeArr.push(item.dictName);
                        } else if (itm == item.dictName) {
                            codeArr.push(item.dictName);
                        }
                    });
                });
                name = codeArr.join(",");
            }
            return name;
        },
        // 日期选择获取最小值和最大值
        getDateM(miny, maxy) {
            var minDate, maxDate;
            let nowDat = new Date();
            let dateY = nowDat.getFullYear();
            minDate = new Date(dateY - miny, 0, 1)
            maxDate = new Date(dateY + maxy, 11, 31)
            return {
                minDate, maxDate
            }
        },
    },
});
