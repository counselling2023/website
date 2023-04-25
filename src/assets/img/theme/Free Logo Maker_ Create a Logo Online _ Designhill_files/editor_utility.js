const dh_editor_utility = {
    isMobileDevice: false,
    osName: null,
    alertTimeOut: null,
    leftPanel2updateTimer: null,
    inputTextTimer: null,
    osNames: {
        'Android': 'Android',
        'IOS': 'IOS',
        'Linux': 'Linux',
        'Macintosh': 'Macintosh',
        'Other': 'Other',
        'Windows': 'Windows',
    },
    /**
      *
     * @param {*} message
     * @param {*} type
     */
    showAlert: function (message, type) {
        dh_utility_common.alert({ message: message, type: type });
    },
    /**
     *
     * @param {*} p_sString
     */
    removeMultipleSpaces: function (p_sString) {
        if (p_sString && p_sString !== '') {
            return p_sString.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
        }
        return p_sString;
    },
    /**
     *
     * @param {*} key
     * @param {*} value
     */
    setSession: function (key, value) {
        try {
            sessionStorage.setItem(key, value);
        } catch (e) {
            console.error('ERROR: setSession' + e);
        }
    },
    /**
     *
     * @param {*} key
     */
    getSession: function (key) {
        try {
            return sessionStorage.getItem(key);
        } catch (e) {
            console.error('ERROR: getSession' + e);
        }
    },
    /**
     *
     * @param {*} key
     */
    cleanSession: function (key) {
        try {
            sessionStorage.removeItem(key);
        } catch (e) {
            console.error('ERROR: cleanSession' + e);
        }
    },
    /**
     *
     * @param {*} len
     * @param {*} charSet
     */
    newRandomId: function (len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < len; i++) {
            let randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },
    /**
     *
     * @param {*} p_sText
     */
    langDetection: function (p_sText) {
        let regex = /([0-9!@#$%^&*¿§«»ω⊙¤°℃℉€¥£¢¡®©()_+\-={}’;':",.,<>?~\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+)/g;
        let ab = p_sText.match(regex);
        let engWithSpecialChar = /^[a-zA-Z0-9\s`!@#$%^&*¿§«»ω⊙¤°℃℉€¥£¢¡®©()_+\-=\[\]{}’;':"\\|,.,<>\/?~]+$/;
        let lang = '';
        if (!p_sText || ab && engWithSpecialChar.test(ab)) {
            lang = 'english';
        } else {
            lang = 'other';
        }
        return lang;
    },
    /**
     *
     */
    browserDetection: function () {
        let test = function (regexp) {
            return regexp.test(window.navigator.userAgent);
        };
        switch (true) {
            case test(/edg/i):
                return 'Microsoft Edge';
            case test(/trident/i):
                return 'Microsoft Internet Explorer';
            case test(/firefox|fxios/i):
                return 'Mozilla Firefox';
            case test(/opr\//i):
                return 'Opera';
            case test(/ucbrowser/i):
                return 'UC Browser';
            case test(/samsungbrowser/i):
                return 'Samsung Browser';
            case test(/chrome|chromium|crios/i):
                return 'Google Chrome';
            case test(/safari/i):
                return 'Apple Safari';
            default:
                return 'Other';
        }
    },
    /**
     *
     * @param {*} url
     */
    getLoadImgDim: function (url) {
        return new Promise(function (resolve, reject) {
            if (url) {
                let img1 = new Image();
                img1.onload = function () {
                    let imgObj = {};
                    imgObj.width = img1.width;
                    imgObj.height = img1.height;
                    resolve(imgObj);
                };
                img1.onerror = function () {
                    resolve({});
                };
                img1.src = url;
            } else {
                resolve({});
            }
        });
    },
    /**
    * 
    * @param {*} originalUrl 
    */
    getExactNameOfImg: function (originalUrl) {
        let cleanup = /\"|\'|\)/g;
        let exact_name = originalUrl.split('/').pop().replace(cleanup, '');
        return exact_name;
    },
    /**
     * 
     * @param {*} textStr 
     * @param {*} isRemove 
     */
    remove_lt_gt: function (textStr, isRemove) {
        if (isRemove) {
            return textStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        else {
            return textStr.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        }
    },
    /**
     * 
     */
    checkForMobileDevice: function () {
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            dh_editor_utility.isMobileDevice = true;
        }
    },
    /**
     * 
     * @param {*} string 
     */
    removeEmojis: function (string) {
        var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
        return string.replace(regex, "");
    },
    /**
     * 
     * @param {*} color 
     */
    lightOrDark: function (color) {

        // Check the format of the color, HEX or RGB?
        if (color.match(/^rgb/)) {

            // If HEX --> store the red, green, blue values in separate variables
            color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

            r = color[1];
            g = color[2];
            b = color[3];
        }
        else {

            // If RGB --> Convert it to HEX: http://gist.github.com/983661
            color = +("0x" + color.slice(1).replace(
                color.length < 5 && /./g, '$&$&'
            )
            );

            r = color >> 16;
            g = color >> 8 & 255;
            b = color & 255;
        }

        // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
        hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
        );

        // Using the HSP value, determine whether the color is light or dark
        if (hsp > 127.5) {

            return 'light';
        }
        else {

            return 'dark';
        }
    },
    /**
     * 
     * @param {*} color 
     */
    rgbToHex: function (color) {
        color = '' + color;
        if (!color) {
            return;
        }

        if (color.charAt(0) === '#') {
            return color;
        }
        if (color.indexOf('rgba') > -1) {
            let nums = /(.*?)rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
                r = parseInt(nums[2]).toString(16),
                g = parseInt(nums[3]).toString(16),
                b = parseInt(nums[4]).toString(16);
            return '#' + ((r.length === 1 ? '0' + r : r) + (g.length === 1 ? '0' + g : g) + (b.length === 1 ? '0' + b : b));
        } else if (color.indexOf('rgb') > -1) {
            let nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
                r = parseInt(nums[2]).toString(16),
                g = parseInt(nums[3]).toString(16),
                b = parseInt(nums[4]).toString(16);
            return '#' + ((r.length === 1 ? '0' + r : r) + (g.length === 1 ? '0' + g : g) + (b.length === 1 ? '0' + b : b));
        }
    },
    /**
     * 
     * @param {*} arr 
     * @param {*} comp 
     */
    getUnique: function (arr, comp) {
        const unique = arr
            .map((e) => e[comp])
            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)
            // eliminate the dead keys & store unique objects
            .filter((e) => arr[e])
            .map((e) => arr[e]);

        return unique;
    },
    /**
     * 
     * @param {*} svgHtml 
     * @returns 
     */
    getValidSvgHtml: function (svgHtml, p_sCalledFor, p_sOriginalSVGStr) {
        if (p_sCalledFor === "logomaker" && p_sOriginalSVGStr) {
            p_sOriginalSVGStr = p_sOriginalSVGStr.replace(/\s/g, "");
        }
        let divSVGPreview = document.querySelector('#divSVGPreview');
        if (!divSVGPreview) {
            divSVGPreview = document.createElement('div');
            divSVGPreview.id = 'divSVGPreview';
            divSVGPreview.setAttribute('style', 'position:fixed; top:0px; left:0px; width:0px; height:00px; overflow:hidden; background-color:white; border:none; z-index:-1; opacity:0;');
            document.body.appendChild(divSVGPreview);
        }
        divSVGPreview.innerHTML = svgHtml;

        let svg = divSVGPreview.querySelector('svg');
        if (svg) {

            let x = 0, y = 0, w = 0, h = 0;
            let bBox = null;
            let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            divSVGPreview.querySelectorAll('svg>*:not(image):not(defs):not(pattern):not(linearGradient):not(radialGradient):not(symbol):not(style)').forEach(node => {
                if (node.getBBox) {
                    bBox = node.getBBox();
                    if (p_sCalledFor === "logomaker") {
                        // if (bBox.width > 0 && !node.getAttribute('class')) {
                        // remove class condition for this icon
                        if (bBox.width > 0) {
                            try {
                                g.appendChild(node);
                            }
                            catch (ex) {
                                console.error(ex);
                            }
                        }
                        else {
                            node.remove();
                            bBox = null;
                        }
                    } else {
                        if (bBox.width > 0) {
                            try {
                                g.appendChild(node);
                            }
                            catch (ex) {
                                console.error(ex);
                            }
                        }
                        else {
                            node.remove();
                            bBox = null;
                        }
                    }

                }
                else {
                    node.remove();
                }

            });
            svg.appendChild(g);
            bBox = g.getBBox();
            x = Math.round(bBox.x);
            y = Math.round(bBox.y);
            w = Math.round(bBox.width);
            h = Math.round(bBox.height);
            if (bBox && (w > 0)) {
                document.querySelector('#divSVGPreview svg').setAttribute('viewBox', x + ' ' + y + ' ' + w + ' ' + h);
            }
            else {
                g.remove();
            }

        }
        if (p_sCalledFor === "logomaker") {
            let pathLength = divSVGPreview.querySelectorAll("path").length;
            divSVGPreview.querySelectorAll("*").forEach(node => {
                if (node && node.getAttribute('class')) {
                    let makeClass1 = '.' + node.getAttribute('class') + '{fill:none';
                    let makeClass2 = '.' + node.getAttribute('class') + '{fill:black';
                    let makeClass3 = '.' + node.getAttribute('class') + '{display:none';
                    if (p_sOriginalSVGStr && ((p_sOriginalSVGStr.indexOf(makeClass1) !== -1) || (p_sOriginalSVGStr.indexOf(makeClass2) !== -1) || (p_sOriginalSVGStr.indexOf(makeClass3) !== -1))) {
                        if (pathLength === 1 && node.tagName === 'path') {

                        } else {
                            node.setAttribute('fill', 'none');
                        }
                    }
                }
            });
        }
        if (p_sCalledFor === "logomaker" && divSVGPreview.querySelector('svg')) {
            svgHtml = divSVGPreview.querySelector('svg').innerHTML;
        } else {
            svgHtml = divSVGPreview.innerHTML;
        }
        return svgHtml;
    },
    removeDuplicatesFromArray: (arr) => [...new Set(
        arr.map(el => JSON.stringify(el))
    )].map(e => JSON.parse(e)),
    /**
     * 
     * @returns 
     */
    getOSName() {
        let osNames = dh_editor_utility.osNames;
        let osName = osNames.Other;
        if (navigator.userAgent.indexOf("Win") != -1) { osName = osNames.Windows; }
        else if (navigator.userAgent.indexOf("like Mac") != -1) { osName = osNames.IOS; }
        else if (navigator.userAgent.indexOf("Mac") != -1) { osName = osNames.Macintosh; }
        else if (navigator.userAgent.indexOf("Linux") != -1) { osName = osNames.Linux; }
        else if (navigator.userAgent.indexOf("Android") != -1) { osName = osNames.Android; }

        dh_editor_utility.osName = osName;
        return osName;
    },
    fetchSVGData: function (p_sSVGUrl) {
        return new Promise(function (resolve, reject) {
            window.fetch((p_sSVGUrl), {
                mode: 'cors',
                method: 'GET',
                headers: {
                    Accept: 'image/svg+xml',
                }
            }).then((resp) => {
                return resp.text();
            }).then((datasvg) => {
                resolve(datasvg);
            }).catch(err => {
                reject(err);
            })
        });
    },
    checkSVGContainerColorSupport: function (container) {
        /* this will check SVG image contatiner itself that we need to avoid fetcing colors. */
        return (container.querySelector('linearGradient') || container.querySelector('radial') || container.querySelector('radialGradient') || container.querySelector('image'));
    },
    checkSVGChildTagsColorSupport: function (tag) {
        /* this will check the tag names in SVG where we don't have to collect the colors. */
        return (tag.tagName !== 'svg' &&
            tag.tagName !== 'g' &&
            tag.tagName !== 'title' &&
            tag.tagName !== 'defs' &&
            tag.tagName !== 'radialGradient' &&
            tag.tagName !== 'clipPath' &&
            tag.tagName !== 'use');
    },
    randomNumber: function (min, max) {
        const r = Math.random() * (max - min) + min
        return Math.floor(r)
    },
    shuffleTheArray: function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    },
    objectDeepClone: function (obj) {
        var clone = {};
        for (var i in obj) {
            if (typeof (obj[i]) == "object" && obj[i] != null)
                clone[i] = cloneObject(obj[i]);
            else
                clone[i] = obj[i];
        }
        return clone;
    },
    getRandomNumberInRange: function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    },
    getSvgDom: function (svgHtml) {
        let divDomSVG = document.querySelector('#dh_lm_div_dom_svg');
        if (!divDomSVG) {
            divDomSVG = document.createElement('div');
            divDomSVG.id = 'dh_lm_div_dom_svg';
            divDomSVG.setAttribute('style', 'position:fixed; top:0px; left:0px; width:0px; height:00px; overflow:hidden; background-color:white; border:none; z-index:-1; opacity:0;');
            document.body.appendChild(divDomSVG);
        }
        divDomSVG.innerHTML = svgHtml;
        let svg = divDomSVG.querySelector('svg');
        return svg;

    },
    alertWithTime: function (myval, p_sTime) {
        dh_editor_utility.alertTimeOut && clearTimeout(dh_editor_utility.alertTimeOut);
        let g = $.extend({ message: " ", type: "success" }, myval);
        let tCss = 'success-msg', tLabel = 'Success', tIcon = 'icon-ok';
        if (g.type == 'error') { tCss = 'error-msg'; tLabel = 'Error'; tIcon = 'icon-ban-circle'; }
        $('body .common-alerts').remove();
        $('body').append('<div class="common-alerts message-info-props ' + tCss + '"><p><span class="tick-mark-circle"><i class="' + tIcon + ' icon-left"></i></span> <span><b>' + tLabel + ':</b> ' + g.message + ' <i class="icon-remove"></i></span></p></div>');
        $('.common-alerts').animate({ opacity: 1, top: "70px" }, 'fast').css({ 'visibility': 'visible' });
        /* auto remove message */
        dh_editor_utility.alertTimeOut = setTimeout(function () {
            $('.common-alerts').animate({ opacity: 0, top: "50px" }, 'slow').css({ 'visibility': 'hidden' });
        }, p_sTime);
        $("body").on("click", '.common-alerts .icon-remove', function (g) {
            g.preventDefault();
            $('.common-alerts').animate({ opacity: 0, top: "50px" }, 'fast').css({ 'visibility': 'hidden' });
        });
    },
    getAlmostUniqRandomStr: function (len) {
        let rand_str = '';
        let moreRandom = Math.floor(Math.random() * (new Date()).getTime()) + "";
        moreRandom = moreRandom.substring(0, 4);
        rand_str = dh_editor_utility.newRandomId(len) + moreRandom;
        return rand_str;
    },
    debounce: function (func, timeout = 300, timer) {

        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    },
    lmTimeOut: function (func, wait, mytimer) {
        clearTimeout(mytimer);
        mytimer = setTimeout(function () {
            func();
        }, wait);
    },
    lmClearTimeOut: function (mytimer) {
        clearTimeout(mytimer);
        mytimer = null;
    },
    clearException: function () {
        editor_exceptions = new Array();
    },
    debugConsole: function (p_sValue, p_bValue) {
        if (DH.DH_APP_MODE == 'DEVELOPMENT') {
            console.log(p_sValue);
        }
    },
    forceConsoleAtStaging: function (p_sValue) {
        if ((DH.DH_APP_MODE == 'DEVELOPMENT') || (DH.DH_APP_MODE == 'STAGING')) {
            console.log(p_sValue);
        }
    },
    forceConsoleAtLive: function (p_sValue) {
        if (DH.DH_APP_MODE == 'PRODUCTION') {
            console.log(p_sValue);
        }
    },
    getValidJsonParseObj: function (p_value) {
        let valueType = typeof (p_value);
        let jsonParseObj = null;
        switch (valueType) {
            case "object":
                jsonParseObj = p_value;
                break;
            case "string":
                jsonParseObj = JSON.parse(p_value);
                break;
            default:
                dh_editor_utility.debugConsole("getValidJsonParseObj invalid case valueType:=" + valueType);
                break;
        }
        return jsonParseObj;
    },
    getValidJsonStringifyObj: function (p_value) {
        let valueType = typeof (p_value);
        let jsonStringifyObj = null;
        switch (valueType) {
            case "object":
                jsonStringifyObj = JSON.stringify(p_value);
                break;
            case "string":
                jsonStringifyObj = p_value;
                break;
            default:
                console.log("getValidJsonStringifyObj invalid case valueType:=" + valueType);
                break;
        }
        return jsonStringifyObj;
    },
    getDataAnalsyis: function (p_oCurrentJSON, FromStep7) {
        var daObj = new Object();
        if (p_oCurrentJSON) {
            if (p_oCurrentJSON.generate.templatePath.template_direction) {
                daObj.templateDirection = p_oCurrentJSON.generate.templatePath.template_direction;
            }
            if (p_oCurrentJSON.generate.templatePath.template_id) {
                daObj.finalTemplateId = p_oCurrentJSON.generate.templatePath.template_id; // final logo template id
                if (p_oCurrentJSON.data_analysis && p_oCurrentJSON.data_analysis.templateId) { // inital template id as per step6
                    daObj.templateId = p_oCurrentJSON.data_analysis.templateId;
                } else {
                    daObj.templateId = p_oCurrentJSON.generate.templatePath.template_id;
                }
            }
            if (p_oCurrentJSON.fId) {
                daObj.companyNameFontId = p_oCurrentJSON.fId; // company name font id
            }
            if (p_oCurrentJSON.sloganName && p_oCurrentJSON.sloganName != "" && p_oCurrentJSON.sloganName != " ") {
                daObj.sloganFontId = p_oCurrentJSON.sfId; // slogan font id
            }
            if (p_oCurrentJSON.generate.templatePath.isIcon && p_oCurrentJSON.generate.templatePath.isIcon == 1) {
                daObj.iconId = p_oCurrentJSON.iconId; // icon id as per noun api
                // daObj.iconName = p_oCurrentJSON.generate.iconName;
                if (p_oCurrentJSON.generate.templatePath.isIconFrame && p_oCurrentJSON.generate.templatePath.isIconFrame == 1) {
                    daObj.iconInnerFrameId = p_oCurrentJSON.iconFrameId; // inner frame id
                }
            }

            if (p_oCurrentJSON.generate.templatePath.isMono && p_oCurrentJSON.generate.templatePath.isMono == 1) {
                daObj.monogramFontId = p_oCurrentJSON.monofId; // mono font id
                if (p_oCurrentJSON.generate.templatePath.isIconFrame && p_oCurrentJSON.generate.templatePath.isIconFrame == 1) {
                    daObj.iconInnerFrameId = p_oCurrentJSON.iconFrameId; // inner frame id
                }
            }
            if (p_oCurrentJSON.generate.templatePath.isFrame && p_oCurrentJSON.generate.templatePath.isFrame == 1) {
                daObj.outerFrameId = p_oCurrentJSON.frmId; // outer frame id
                daObj.outerFrameType = p_oCurrentJSON.generate.templatePath.frameType; // outer frame type
            }
            if (p_oCurrentJSON.cpId) {
                daObj.colorsSchemaId = p_oCurrentJSON.cpId; // colors schema
            }
            if (p_oCurrentJSON.generate.templatePath.isDBLineCompanyText) {
                daObj.isDoubleLineCompanyText = p_oCurrentJSON.generate.templatePath.isDBLineCompanyText; // double line company text
            }
            daObj.isMobileDevice = dh_editor_utility.isMobileDevice;
            if (sessionStorage.getItem('sampleColor')) {
                let sampleClr = dh_editor_utility.getValidJsonParseObj(sessionStorage.getItem('sampleColor'));
                if (sampleClr && sampleClr.length > 0) {
                    daObj.selectedColor = sampleClr;
                }
            }
            let rand_data = sessionStorage.getItem("rand_data");
            if (rand_data) {
                let rand_data_obj = JSON.parse(rand_data);
                if (Object.keys(rand_data_obj).length) {
                    daObj.rand_data = rand_data_obj;
                }
            }
            daObj.currentBrowser = dh_editor_utility.browserDetection();;
            daObj.os = dh_editor_utility.osName;
            daObj.screen_info = {};
            daObj.screen_info["width"] = $(window).width();
            daObj.screen_info["height"] = $(window).height();
            if (FromStep7) {
                daObj.version = "1.1.1";
            }

        }
        return daObj;
    },
    getUsedSessionStorageSize: function () {
        var finalStr = "";
        try {
            var _lsTotal = 0, _xLen, _x;
            for (_x in sessionStorage) {
                if (!sessionStorage.hasOwnProperty(_x)) {
                    continue;
                }
                _xLen = ((sessionStorage[_x].length + _x.length) * 2);
                _lsTotal += _xLen;
                var str1 = "";
                if (finalStr == "") {
                    str1 = _x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB";
                } else {
                    str1 = "," + _x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB";
                }
                finalStr = finalStr + str1;
            };
            var str2 = ",Total = " + (_lsTotal / 1024).toFixed(2) + " KB";
            finalStr = finalStr + str2;
        } catch (e) {
            finalStr = e;
        }
        return finalStr;
    },
    createLogging: function (p_sAction) {
        var logo_maker_logging_list = new Array();
        var loggingObj = new Object();
        loggingObj.action = p_sAction;
        try {
            loggingObj.currentPage = dh_editor_utility.getValidJsonStringifyObj(sessionStorage.getItem("currPage"));
            loggingObj.currLogoId = dh_editor_utility.getValidJsonStringifyObj(sessionStorage.getItem("currLogoId"));
            loggingObj.logoName = dh_editor_utility.getValidJsonStringifyObj(sessionStorage.getItem("logoname"));
            loggingObj.targetLink = dh_editor_utility.getValidJsonStringifyObj(sessionStorage.getItem("targetlink"));
            loggingObj.parentLink = dh_editor_utility.getValidJsonStringifyObj(sessionStorage.getItem("parentlink"));
            loggingObj.backLink = dh_editor_utility.getValidJsonStringifyObj(sessionStorage.getItem("backLink"));
            loggingObj.sessionStorageUsed = dh_editor_utility.getUsedSessionStorageSize();
            logo_maker_logging_list.push(loggingObj);
        }
        catch (e) {
            loggingObj.error = e;
        }
        return logo_maker_logging_list;
    },
    getUrlParameter: function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    },
    lightOrDark: function (color) {
        // Check the format of the color, HEX or RGB?
        if (color.match(/^rgb/)) {
            // If HEX --> store the red, green, blue values in separate variables
            color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
            r = color[1];
            g = color[2];
            b = color[3];
        }
        else {
            // If RGB --> Convert it to HEX: http://gist.github.com/983661
            color = +("0x" + color.slice(1).replace(
                color.length < 5 && /./g, '$&$&'
            )
            );
            r = color >> 16;
            g = color >> 8 & 255;
            b = color & 255;
        }
        // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
        hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
        );
        // Using the HSP value, determine whether the color is light or dark
        if (hsp > 127.5) {
            return 'light';
        }
        else {
            return 'dark';
        }
    },
    isColorSuported: function (colorValue) {
        let hasHash = (colorValue.indexOf('#') == 0);
        if (hasHash && colorValue.length == 5) {
            return false;
        } else if (!hasHash && colorValue.length > 0) {
            return CSS.supports('color', '' + colorValue)
        } else {
            return CSS.supports('color', '' + colorValue)
        }
    },
    colorShade: function (color, percent) {
        var R = parseInt(color.substring(1, 3), 16);
        var G = parseInt(color.substring(3, 5), 16);
        var B = parseInt(color.substring(5, 7), 16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;
        var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    },
    hexToHSL: function (H) {
        // Convert hex to RGB first
        let r = 0, g = 0, b = 0;
        if (H.length == 4) {
            r = "0x" + H[1] + H[1];
            g = "0x" + H[2] + H[2];
            b = "0x" + H[3] + H[3];
        } else if (H.length == 7) {
            r = "0x" + H[1] + H[2];
            g = "0x" + H[3] + H[4];
            b = "0x" + H[5] + H[6];
        }
        // Then to HSL
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta == 0)
            h = 0;
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        else if (cmax == g)
            h = (b - r) / delta + 2;
        else
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0)
            h += 360;

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return [h, s, l];
        // return "hsl(" + h + "," + s + "%," + l + "%)";
    },
    HSLToHex: function (h, s, l) {
        s /= 100;
        l /= 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        // Having obtained RGB, convert channels to hex
        r = Math.round((r + m) * 255).toString(16);
        g = Math.round((g + m) * 255).toString(16);
        b = Math.round((b + m) * 255).toString(16);

        // Prepend 0s, if necessary
        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        return "#" + r + g + b;
    },
    rgbToHex: function (rgb) {
        if (rgb.indexOf('#') > -1) {
            return rgb
        } else {
            // Choose correct separator
            let sep = rgb.indexOf(",") > -1 ? "," : " ";
            // Turn "rgb(r,g,b)" into [r,g,b]
            rgb = rgb.substr(4).split(")")[0].split(sep);

            let r = (+rgb[0]).toString(16),
                g = (+rgb[1]).toString(16),
                b = (+rgb[2]).toString(16);

            if (r.length == 1)
                r = "0" + r;
            if (g.length == 1)
                g = "0" + g;
            if (b.length == 1)
                b = "0" + b;

            return "#" + r + g + b;
        }

    },
    RequestHandeler: async function (requestURL, requestType, requestPayload) {
        let result;
        try {
            result = await $.ajax({
                url: requestURL,
                type: requestType,
                data: requestPayload
            });
            return result;
        } catch (error) {
            console.error(error);
        }
    },
    getSvgHtml: async function (requesturl) {
        //other function is created for fetching is fetchSVGData
        let response = await fetch(requesturl, {
            mode: 'cors',
            method: 'GET',
            headers: {
                Accept: 'image/svg+xml',
                // Accept: 'text/html',
                // Cookie: Version = 1
            }
        });
        if (response.status === 200) {
            // console.log('success ', requesturl);
            let data = await response.text();
            data = data;
            return data;
        } else {
            console.error('error ');
            return '';
        }

    },
    getUniqueID(length) {
        length = length || (Math.floor(Math.random() * 16) + 6);
        let store = "";
        for (let i = 1; i <= length; i++) {
            store += Math.floor(Math.random() * 16).toString(16);
        }
        return store;
    },
};
const dh_zoom_in_out = {
    zoomObj: null,
    zoomObjCurWidth: null,
    zoomObjCurHeight: null,
    zoomFactor: 100, //(in px)
    zoomObjActualWidth: null,
    zoomObjActualHeight: null,
    zOutBtn: null,
    zInBtn: null,
    fsInBtn: null,
    fsOutBtn: null,
    fsElement: null,
    afterZoomInCallBack: null,
    afterZoomOutCallBack: null,
    afterFullScreenChange: null,
    fsBool: false,
    scrollContainer: null,
    containerScrollHeight: null,
    containerScrollWidth: null,
    /**
     * 
     * @param {*} zIn 
     * @param {*} zOut 
     * @param {*} fsIn 
     * @param {*} fsOut 
     * @param {*} p_oZoomObj 
     * @param {*} p_oFSElement 
     * @param {*} p_oImgScrollContainer 
     */
    init: function (zIn, zOut, fsIn, fsOut, p_oZoomObj, p_oFSElement, p_oImgScrollContainer) {
        if (zIn.hasEventListener) {
            return;
        }

        if (zIn) {
            zIn["action"] = "zoomin";
            zIn.addEventListener('click', dh_zoom_in_out.clickHandelr.bind(zIn));
            dh_zoom_in_out.zInBtn = zIn;
        }
        if (zOut) {
            zOut["action"] = "zoomout";
            zOut.addEventListener('click', dh_zoom_in_out.clickHandelr.bind(zOut));
            dh_zoom_in_out.zOutBtn = zOut;
        }
        if (fsIn) {
            fsIn["action"] = "fsin";
            fsIn.addEventListener('click', dh_zoom_in_out.clickHandelr.bind(fsIn));
            dh_zoom_in_out.fsInBtn = fsIn;
        }
        if (fsOut) {
            fsOut["action"] = "fsout";
            fsOut.addEventListener('click', dh_zoom_in_out.clickHandelr.bind(fsOut));
            dh_zoom_in_out.fsOutBtn = fsOut;
        }

        dh_zoom_in_out.zoomObj = p_oZoomObj;
        dh_zoom_in_out.zoomObjCurWidth = dh_zoom_in_out.zoomObj.width;
        dh_zoom_in_out.zoomObjCurHeight = dh_zoom_in_out.zoomObj.height;
        dh_zoom_in_out.zoomObjActualWidth = dh_zoom_in_out.zoomObj.width;
        dh_zoom_in_out.zoomObjActualHeight = dh_zoom_in_out.zoomObj.height;
        dh_zoom_in_out.fsElement = p_oFSElement;
        p_oZoomObj.style.width = p_oZoomObj.offsetWidth + 'px';
        p_oZoomObj.style.maxWidth = 'none';

        document.addEventListener("fullscreenchange", dh_zoom_in_out.onFSChange);
        document.addEventListener("mozfullscreenchange", dh_zoom_in_out.onFSChange);
        document.addEventListener("webkitfullscreenchange", dh_zoom_in_out.onFSChange);
        document.addEventListener("msfullscreenchange", dh_zoom_in_out.onFSChange);

        dh_zoom_in_out.scrollContainer = p_oImgScrollContainer;
        dh_zoom_in_out.containerScrollHeight = p_oImgScrollContainer ? (p_oImgScrollContainer.offsetHeight - 100) : 300;
        dh_zoom_in_out.containerScrollWidth = p_oImgScrollContainer ? (p_oImgScrollContainer.offsetWidth - 100) : 300;

        dh_zoom_in_out.checkZoomOutCond();
        zIn.hasEventListener = true;
    },
    /**
     * 
     */
    clickHandelr: function () {
        const that = this;
        let zoomVal;
        switch (that["action"]) {
            case "zoomin":
                zoomVal = dh_zoom_in_out.zoomObjCurWidth + dh_zoom_in_out.zoomFactor;
                dh_zoom_in_out.zoomObj.style.width = zoomVal + "px";
                dh_zoom_in_out.zoomObj.style.height = "auto";
                dh_zoom_in_out.zoomObjCurWidth = zoomVal;
                dh_zoom_in_out.checkZoomOutCond();
                (dh_zoom_in_out.afterZoomInCallBack && dh_zoom_in_out.afterZoomInCallBack());
                break;
            case "zoomout":
                zoomVal = dh_zoom_in_out.zoomObjCurWidth - dh_zoom_in_out.zoomFactor;
                dh_zoom_in_out.zoomObj.style.width = zoomVal + "px";
                dh_zoom_in_out.zoomObj.style.height = "auto";
                dh_zoom_in_out.zoomObjCurWidth = zoomVal;
                dh_zoom_in_out.checkZoomOutCond();
                (dh_zoom_in_out.afterZoomOutCallBack && dh_zoom_in_out.afterZoomOutCallBack());
                break;
            case "fsin":
                dh_zoom_in_out.fSInPage();
                break;
            case "fsout":
                dh_zoom_in_out.fSOutPage();
                break;
            default:
                break;
        }
    },
    /**
     * 
     */
    fSInPage: function () {
        const elem = dh_zoom_in_out.fsElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem = window.top.document.body; //To break out of frame in IE
            elem.msRequestFullscreen();
        }

    },
    /**
     * 
     */
    fSOutPage: function () {
        const elem = dh_zoom_in_out.fsElement;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            window.top.document.msExitFullscreen();
        }

    },
    /**
     * 
     */
    onFSChange: function () {
        dh_zoom_in_out.fsBool = !dh_zoom_in_out.fsBool;
        dh_zoom_in_out.toggleFSBtn(dh_zoom_in_out.fsBool);
        if (dh_zoom_in_out.afterFullScreenChange) {
            dh_zoom_in_out.afterFullScreenChange();
        }
    },
    /**
     * 
     * @param {*} p_bValue 
     */
    enabledZoomOutBtn: function (p_bValue) {
        if (dh_zoom_in_out.zOutBtn) {
            if (p_bValue) {
                dh_zoom_in_out.zOutBtn.classList.remove('disabled');
                dh_zoom_in_out.zOutBtn.style.pointerEvents = "auto";
            } else {
                dh_zoom_in_out.zOutBtn.classList.add('disabled');
                dh_zoom_in_out.zOutBtn.style.pointerEvents = "none";
            }
        }
    },
    /**
     * 
     * @param {*} p_bValue 
     */
    enabledZoomInBtn: function (p_bValue) {
        if (dh_zoom_in_out.zInBtn) {
            if (p_bValue) {
                dh_zoom_in_out.zInBtn.classList.remove('disabled');
                dh_zoom_in_out.zInBtn.style.pointerEvents = "auto";
            } else {
                dh_zoom_in_out.zInBtn.classList.add('disabled');
                dh_zoom_in_out.zInBtn.style.pointerEvents = "none";
            }
        }
    },
    /**
     * 
     */
    checkZoomOutCond: function () {

        if (dh_zoom_in_out.zoomObj.scrollHeight < dh_zoom_in_out.containerScrollHeight - 100 && dh_zoom_in_out.zoomObj.scrollWidth < dh_zoom_in_out.containerScrollWidth - 100) {
            dh_zoom_in_out.enabledZoomOutBtn(false);
        }
        else {
            dh_zoom_in_out.enabledZoomOutBtn(true);
        }


        //Set Zoom-In to x3 size of original image size
        if (!dh_zoom_in_out.zoomObj.originalWidth) {
            let img = new Image();
            img.src = dh_zoom_in_out.zoomObj.src;
            dh_zoom_in_out.zoomObj.originalWidth = img.width;
        }
        if (dh_zoom_in_out.zoomObj.offsetWidth > dh_zoom_in_out.zoomObj.originalWidth * 3) {
            dh_zoom_in_out.enabledZoomInBtn(false);
        } else {
            dh_zoom_in_out.enabledZoomInBtn(true);
        }
    },
    /**
     * 
     * @param {*} p_bValue 
     */
    toggleFSBtn: function (p_bValue) {
        if (dh_zoom_in_out.fsOutBtn) {
            if (p_bValue) {
                dh_zoom_in_out.fsOutBtn.classList.remove('hidden');
                dh_zoom_in_out.fsInBtn.classList.add('hidden');
            } else {
                dh_zoom_in_out.fsOutBtn.classList.add('hidden');
                dh_zoom_in_out.fsInBtn.classList.remove('hidden');
            }

        }
    }
};
const dh_lm_common_utility = {
    isValidLMBGPattern: function (svgHtml) {
        let isValid = true;
        let divSVGPreview = document.querySelector('#lm_bg_pattern_valid');
        if (!divSVGPreview) {
            divSVGPreview = document.createElement('div');
            divSVGPreview.id = 'lm_bg_pattern_valid';
            divSVGPreview.setAttribute('style', 'position:fixed; top:0px; left:0px; width:0px; height:00px; overflow:hidden; background-color:white; border:none; z-index:-1; opacity:0;');
        }
        divSVGPreview.innerHTML = svgHtml;
        isValid = !divSVGPreview.querySelector('metadata,style,script,foreignobject,image');
        return isValid;
    },
    getBgPatternStyleCSS: function (p_oBGPattern, isRepeat, svgWidth, svgHeight, targets) {
        if (p_oBGPattern && p_oBGPattern.pattern) {
            let updatedSVG = dh_lm_common_utility.appendPatternInLogo(p_oBGPattern, uniqClassNameForPattern);
            updatedSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ' + svgWidth + ' ' + svgHeight + '" xml:space="preserve">' + updatedSVG + '</svg>';
            // updatedSVG = 'data:image/svg+xml;base64,' + window.btoa(updatedSVG);
            if (isRepeat == 1) {
                if (targets && targets.length) {
                    targets.forEach(target => {
                        target.innerHTML = updatedSVG;
                        // target.style.backgroundImage = "url('" + updatedSVG + "')";
                        // target.style.backgroundRepeat = "no-repeat";
                        // target.style.backgroundSize = svgWidth + "px " + svgHeight + "px";
                    });
                }
            }
            else {
                if (targets && targets.length) {
                    targets.forEach(target => {
                        target.innerHTML = updatedSVG;
                        // target.style.backgroundImage = "url('" + updatedSVG + "')";
                        // target.style.backgroundRepeat = "no-repeat";
                        // target.style.backgroundSize = "100%";
                    });
                }
            }
        }
        // return patternStyle;
    },
    /**
     * This function is call when leftpanel 2 and preview need to update for pattren
     * @param {Object} bgPattern 
     * @param {String} p_sUniqClassNameForPattern 
     * @returns 
     */
    appendPatternInLogo: function (bgPattern, p_sUniqClassNameForPattern) {
        let template = '';
        if (bgPattern && bgPattern.pattern && bgPattern.id) {
            let newID = bgPattern.id + '_' + dh_editor_utility.getAlmostUniqRandomStr(4);
            let div = document.createElement('div');
            div.innerHTML = '<svg>' + bgPattern.pattern + '</svg>';
            dh_lm_common_utility.updatePattren('appendPatternInLogo', div.querySelector('pattern'), {
                "fillcolor": bgPattern.fillcolor,
                "opacity": bgPattern.opacity,
                "isRepeat": bgPattern.isRepeat,
                "distance": {
                    "width": parseInt(bgPattern.width) + parseInt(bgPattern.distance),
                    "height": parseInt(bgPattern.height) + parseInt(bgPattern.distance)
                },
                "rotation": {
                    "value": bgPattern.rotation,
                    "ancherX": bgPattern.width / 2,
                    "ancherY": bgPattern.height / 2
                }, "scale": bgPattern.scale
            }, function () {
                //color update in final previed is done
            });
            let newpattern = div.querySelector('pattern').outerHTML;
            template += '<defs>' + newpattern.replace(bgPattern.id, newID) + '</defs>';
            template += '<rect class="' + p_sUniqClassNameForPattern + '" x="0px" y="0px" width="640" height="480" fill="url(#' + newID + ')" style="opacity:1"/>';
        }
        return template;
    },
    makeBgPattern: function (p_sSVGHtml, fillcolor, opacity, rotation, scale, distance, idcolor,) {
        if (p_sSVGHtml && dh_lm_common_utility.isValidLMBGPattern(p_sSVGHtml)) {
            let div = document.createElement('div');
            div.innerHTML = p_sSVGHtml;
            let svgElement = div.querySelector('svg');
            if (svgElement) {
                dh_lm_common_utility.updatePattren('makeBgPattern', svgElement, { "fillcolor": fillcolor, "opacity": opacity }, function () {
                    //color update in final previed is done
                });
                let vBox = svgElement.getAttribute('viewBox');
                let pattern;
                let svgDataUrl;
                let width;
                let height;
                let id;
                if (vBox) {
                    width = vBox.split(' ')[2];
                    height = vBox.split(' ')[3];
                    let moreRandom = Math.floor(Math.random() * (new Date()).getTime()) + "";
                    moreRandom = moreRandom.substring(0, 4);
                    id = 'pattern_' + moreRandom + "_" + dh_editor_utility.getAlmostUniqRandomStr(4);
                    let finalRotation = (rotation) + ',' + (width / 2) + ',' + (height / 2);
                    let finalescale = (scale / 100).toFixed(1);
                    let widthWithDistance = parseInt(width) + parseInt(distance);
                    let HeightWithDistance = parseInt(height) + parseInt(distance);
                    pattern = '<pattern id="' + id + '" x="0" y="0" width="' + widthWithDistance + '" height="' + HeightWithDistance + '" patternUnits="userSpaceOnUse" patternTransform="rotate(' + finalRotation + ') scale(' + finalescale + ')">' + svgElement.innerHTML + '</pattern>';
                    // pattern = `<pattern style="transform-origin: center;" id="${id}" x="0" y="0" width="${widthWithDistance}" height="${HeightWithDistance}" patternUnits="userSpaceOnUse" patternTransform="rotate(${finalRotation}) scale(${finalescale})">${svgElement.innerHTML}</pattern>`;
                    svgDataUrl = svgElement.outerHTML;
                }
                return { pattern, id, svgDataUrl, width, height, fillcolor, opacity, rotation, scale };
            }
        } else {
            // let msg = '%c ' + idcolor + ' svg html is missing or may be svg is not valid svg for background pattern';
            // console.log(msg, 'background: #222; color: #bada55; font-size: 20px');

        }
        return null;
    },
    updatePattren: function (callfrom, pattren, updatedField, callBack) {
        let path = pattren.querySelectorAll('path,circle,ellipse,line,rect,polygon,polyline');
        let isTransform = false;
        let rotation = pattrenDefaultValue.rotation;
        let scale = pattrenDefaultValue.scale;
        $.each(path, function (k, v) {
            if (updatedField.fillcolor) {
                v.setAttribute('fill', updatedField.fillcolor);
            }
            if (updatedField.opacity) {
                v.setAttribute('opacity', updatedField.opacity);
            }
        });
        if (updatedField.isRepeat) {
            if (updatedField.rotation && updatedField.rotation.value) {
                rotation = updatedField.rotation.value;//,${updatedField.rotation.ancherX},${updatedField.rotation.ancherY}
                isTransform = true;
            }
        }
        if (updatedField.scale) {
            scale = (updatedField.scale / 100).toFixed(1);
            isTransform = true

        }
        if (isTransform) {
            pattren.setAttribute('patternTransform', 'rotate(' + rotation + ') scale(' + scale + ')');
        }
        if (updatedField.distance) {
            pattren.setAttribute('width', updatedField.distance.width);
            pattren.setAttribute('height', updatedField.distance.height);
        }

        if (callBack) {
            callBack();
        }
    },
    getBGPatternSVGHTML: function (p_sSVGURL) {
        return new Promise(function (resolve, reject) {
            dh_editor_utility.fetchSVGData(p_sSVGURL).then(function (bgSVG) {
                resolve(bgSVG);
            }).catch(function () {
                resolve(null);
            })
        });
    },
    removeBgPatternStyleCSS: function (targets) {
        if (targets && targets.length) {
            targets.forEach(target => {
                target.style.backgroundImage = "none";
            });
        }
    },
    removeFillFromIconSvg: function (p_sIconPath, p_sIconColor) {
        if (p_sIconPath && p_sIconPath.indexOf("fill:") !== -1) {
            let div1 = document.createElement('div');
            div1.style.width = "0px";
            div1.style.height = "0px";
            div1.style.opacity = 0;
            div1.style.visibility = "hidden";
            let div1ClassName = "lmtempdiv_sad4sd4sd4";
            div1.className = div1ClassName;
            div1.innerHTML = p_sIconPath;
            document.body.appendChild(div1);
            document.querySelector("." + div1ClassName + " path").style.fill = "";
            let allFill = document.querySelector("." + div1ClassName).querySelectorAll('[fill]');
            if (allFill.length) {
                allFill.forEach(function (fillAttEle) {
                    if (fillAttEle && fillAttEle.getAttribute("fill") && fillAttEle.getAttribute("fill").indexOf("#") !== -1) {
                        fillAttEle.setAttribute("stroke", p_sIconColor)
                    }
                });
            }
            let allStroke = document.querySelector("." + div1ClassName).querySelectorAll('[stroke]');
            if (allStroke.length) {
                allStroke.forEach(function (strokeAttEle) {
                    if (strokeAttEle && strokeAttEle.getAttribute("stroke") && strokeAttEle.getAttribute("stroke").indexOf("#") !== -1) {
                        strokeAttEle.setAttribute("stroke", p_sIconColor)
                    }
                });
            }
            p_sIconPath = document.querySelector("." + div1ClassName).innerHTML;
            document.body.removeChild(document.querySelector("." + div1ClassName));
        } else {
            let div1 = document.createElement('div');
            div1.style.width = "0px";
            div1.style.height = "0px";
            div1.style.opacity = 0;
            div1.style.visibility = "hidden";
            let div1ClassName = "lmtempdiv_sad4sd4sd4";
            div1.className = div1ClassName;
            div1.innerHTML = p_sIconPath;
            document.body.appendChild(div1);
            let allFill = document.querySelector("." + div1ClassName).querySelectorAll('[fill]');
            if (allFill.length) {
                allFill.forEach(function (fillAttEle) {
                    if (fillAttEle && fillAttEle.getAttribute("fill") && fillAttEle.getAttribute("fill").indexOf("#") !== -1) {
                        fillAttEle.setAttribute("stroke", p_sIconColor)
                    }
                });
            }
            let allStroke = document.querySelector("." + div1ClassName).querySelectorAll('[stroke]');
            if (allStroke.length) {
                allStroke.forEach(function (strokeAttEle) {
                    if (strokeAttEle && strokeAttEle.getAttribute("stroke") && strokeAttEle.getAttribute("stroke").indexOf("#") !== -1) {
                        strokeAttEle.setAttribute("stroke", p_sIconColor)
                    }
                });
            }
            p_sIconPath = document.querySelector("." + div1ClassName).innerHTML;
            document.body.removeChild(document.querySelector("." + div1ClassName));
        }
        return p_sIconPath
    },
    showLogoAdminIds: function (p_oTemplatePath, sloganText, p_sCompanyTextFontId, p_sColorSchemaId, p_sSloganFontId, p_sOuterFrameId, p_sIconFrameId, p_sMonoGramFontId, isTempHint = false, isPairedFont, pairedFontId, p_sColorSchemaType, p_nStyle_image_id, p_bIsPatternInBg, p_bIsPatternID) {
        var templateHint = "";
        if (sessionStorage.getItem("remove_hint") || dh_editor_utility.isMobileDevice) {
            return templateHint;
        }
        if ((DH.DH_APP_MODE == 'STAGING') || (DH.DH_APP_MODE == 'DEVELOPMENT') || (DH.userId == dh_logomaker_admin_view) || sessionStorage.getItem("show_hint")) {
            var sep = "/";
            if (isTempHint) {
                // sep = "<br/>";
            }
            var txtStyle = "color:#7fff00;font-weight: 600;font-size: 9px;display: inline-block;";

            templateHint = "<span style='" + txtStyle + "'>template id:=" + p_oTemplatePath.template_id + "</span>" + sep + "<span style='" + txtStyle + "'>isEqual:=" + p_oTemplatePath.isEqual + "</span>";
            if (p_nStyle_image_id == "") {
                templateHint += sep + "<span style='" + txtStyle + "'>companyText font id:=" + p_sCompanyTextFontId + "</span>"
            }
            if (p_nStyle_image_id == "" && sloganText && sloganText != "") {
                templateHint = templateHint + sep + "<span style='" + txtStyle + "'>slogan font id:=" + p_sSloganFontId + "</span>";
            }

            if ((DH.DH_APP_MODE == 'STAGING') || (DH.DH_APP_MODE == 'DEVELOPMENT')) {
                templateHint = templateHint + sep + "<span style='" + txtStyle + "'>isDBLineCompanyText:=" + p_oTemplatePath.isDBLineCompanyText + "</span>"
            }

            if (p_oTemplatePath.isFrame == 1) {
                templateHint = templateHint + sep + "<span style='" + txtStyle + "'>outer frame id:=" + p_sOuterFrameId + "</span>";
            }

            if (p_oTemplatePath.isIconFrame == 1) {
                templateHint = templateHint + sep + "<span style='" + txtStyle + "'>icon frame id:=" + p_sIconFrameId + "</span>";
            }

            if (p_oTemplatePath.isMono == 1) {
                templateHint = templateHint + sep + "<span style='" + txtStyle + "'>monogram font id:=" + p_sMonoGramFontId + "</span>";
            }
            templateHint = templateHint + sep + "<span class='color_schema' style='" + txtStyle + "'>colors schema id:=" + p_sColorSchemaId + "</span>";
            if ((DH.DH_APP_MODE == 'STAGING') || (DH.DH_APP_MODE == 'DEVELOPMENT') || sessionStorage.getItem("show_hint")) {
                templateHint = templateHint + sep + "<span style='" + txtStyle + "'>sloganSetAsPerText:=" + p_oTemplatePath.sloganSetAsPerText + "</span>";
                templateHint = templateHint + sep + "<span style='" + txtStyle + "'>template_db_id:=" + p_oTemplatePath.template_db_id + "</span>";

            }
            if (version === '') {
                if (isPairedFont) {
                    isPairedFont = isPairedFont + "/" + pairedFontId;
                    templateHint = templateHint + sep + "<span style='" + txtStyle + "'>isPairedFont:=" + isPairedFont + "</span>";
                }
                else if (isPairedFont === 0) {
                    templateHint = templateHint + sep + "<span style='" + txtStyle + "'>isPairedFont:=" + isPairedFont + "</span>";
                }
                if (p_sColorSchemaType) {
                    templateHint = templateHint + sep + "<span style='" + txtStyle + "'>schema_type:=" + p_sColorSchemaType + "</span>";
                }
                if (p_nStyle_image_id) {
                    txtStyle = "color:brown;font-weight: 600;font-size: 12px;display: inline-block;background-color:aliceblue";
                    templateHint = templateHint + sep + "<span style='" + txtStyle + "'>design_style_id:=" + p_nStyle_image_id + "</span>";
                }
                if (p_bIsPatternInBg) {
                    let txtStyle1 = "color:black;font-weight: 600;font-size: 14px;display: inline-block;background-color:aqua";
                    if (p_bIsPatternID) {
                        templateHint = templateHint + sep + "<span style='" + txtStyle1 + "'>is pattern:=1" + sep + " pattern_Id:=" + p_bIsPatternID + "</span>";
                    } else {
                        templateHint = templateHint + sep + "<span style='" + txtStyle1 + "'>is pattern:=1</span>";
                    }

                }
            }

            templateHint = dh_editor_utility.removeMultipleSpaces(templateHint);
        }
        return templateHint;
    },
    getPattrenList: async function (limit, startFrom) {
        allBgPatternSVGHtml = {};
        let response = await dh_editor_utility.RequestHandeler(DH.baseURL + '/logoMakerAjax.php', 'POST', { action: 'bg_pattern_pallets', exclude_limit: 1 });
        if (response) {
            response = dh_editor_utility.getValidJsonParseObj(response);
            if (response.status == 1) {
                for (let k = 0; k < response.colors.length; k++) {
                    allBgPatternSVGHtml[response.colors[k].id] = {};
                    allBgPatternSVGHtml[response.colors[k].id]['index'] = response.colors[k].id;
                    allBgPatternSVGHtml[response.colors[k].id]['isRepeat'] = response.colors[k]["is_repeated"] == "1" ? true : false;;
                    allBgPatternSVGHtml[response.colors[k].id]['svg_url'] = response.colors[k].svg_url;
                    allBgPatternSVGHtml[response.colors[k].id]['svg_data'] = "";
                }
            }
            else {
                // console.log(response.status)
            }
        } else {
            // console.log("Somthing wrong")
        }
    }
};
const dh_lm_save = {
    /**
     * 
     * @param {*} logoId 
     * @param {*} curr_logo_blob 
     * @param {*} svg_logo_blob 
     * @param {*} fav 
     * @param {*} del 
     * @param {*} p_bAsync 
     * @param {*} p_bShowLoader 
     * @param {*} dataAnalysisObj 
     * @param {*} exceptions 
     * @returns 
     */
    saveAction: function (logoId, curr_logo_blob, svg_logo_blob, fav, del, p_bAsync, p_bShowLoader, dataAnalysisObj, exceptions) {
        return new Promise(function (resolve, reject) {
            let fd = new FormData();
            fd.append('action', 'save');
            fd.append('logo_id', logoId);
            fd.append('curr_logo', curr_logo_blob);
            fd.append('svg_logo', svg_logo_blob);
            fav && fd.append('fav', fav);
            del && fd.append('del', del);
            fd.append('data_analysis', dataAnalysisObj);
            fd.append('exceptions', exceptions);
            let is_brankit_template = dh_editor_utility.getUrlParameter('bk');
            if (is_brankit_template != '') {
                fd.append('is_brankit_template', 1);
            }
            $.ajax({
                url: DH.baseURL + '/logoMakerAjax.php',
                type: 'POST',
                beforeSend: function () {
                    p_bShowLoader && $('#loadere').show();
                },
                data: fd,
                async: p_bAsync,
                timeout: 60000,
                processData: false,
                contentType: false,
            }).done(function (json) {
                resolve(json);
            }).fail(function (jqXHR, exception) {
                let fe = dh_lm_save.getAjaxErrorMSG("PHP", jqXHR, exception);
                reject(fe);
                if (DH.DH_APP_MODE !== 'PRODUCTION') dh_utility_common.alert({ message: fe, type: "error" });
            }).error(function (jqXHR, exception) {
                let fe = dh_lm_save.getAjaxErrorMSG("PHP", jqXHR, exception);
                reject(fe);
                if (DH.DH_APP_MODE !== 'PRODUCTION') dh_utility_common.alert({ message: fe, type: "error" });
            }).always(function () {
            });
        });
    },
    /**
     * 
     * @param {*} p_sAPIType 
     * @param {*} jqXHR 
     * @param {*} exception 
     * @returns 
     */
    getAjaxErrorMSG: function (p_sAPIType, jqXHR, exception) {
        let msg = p_sAPIType + " DH API ERROR. ";
        switch (jqXHR && jqXHR.status) {
            case 0:
                msg += 'Not connect. Verify Network. Request status is 0.';
                break;
            case 404:
                msg += 'Requested page not found. Request status is 404.';
                break;
            case 500:
                msg += 'Internal Server Error. Request status is 500.';
                break;
            default:
                msg += 'Uncaught Error.' + (jqXHR.responseText && jqXHR.responseText);
                break;
        }
        switch (exception) {
            case "parsererror":
                msg += ' and Requested JSON parse failed.';
                break;
            case "timeout":
                msg += ' and Time out error.';
                break;
            case "abort":
                msg += ' Ajax request aborted.';
                break;
            default:
                break;

        }
        return msg;
    },
}
const curveLogo = {
    init: function () {
        // debugConsole('entered into curveLogo init');
        // debugConsole("defaultCurveValue:=" + defaultCurveValue);
        // debugConsole("MakerJSObj:=" + MakerJSObj);

    },
    /**
     * 
     * @param {*} p_oFont 
     * @param {*} p_sLogoText 
     * @param {*} p_sFontSize 
     * @param {*} p_sLetterSpacing 
     * @param {*} p_nCurveValue 
     * @returns 
     */
    createText: function (p_oFont, p_sLogoText, p_sFontSize, p_sLetterSpacing, p_nCurveValue) {
        var sloganName = dh_editor_utility.getSession('sloganText');
        if (MakerJSObj && p_sLogoText && p_oFont && curveLogo.IsConditioMeet(p_sLogoText, sloganName)) {
            let textModel = new MakerJSObj.models.Text(p_oFont, p_sLogoText, p_sFontSize, null, null, null, { 'letterSpacing': p_sLetterSpacing });
            let m = MakerJSObj.measure.modelExtents(textModel);
            let centerY = m.low[1] + m.width * p_nCurveValue / 100;
            let pointA = m.low;
            let pointB = [m.low[0] + m.width / 2, centerY === m.low[1] ? (m.low[1] + 0.01) : centerY];
            let pointC = [m.high[0] - m.low[0], m.low[1]]
            let arc = new MakerJSObj.paths.Arc(pointA, pointB, pointC);
            let isReversed = centerY >= m.low[1];
            MakerJSObj.layout.childrenOnPath(textModel, arc, 0, isReversed, false, true);
            textModel.layer = "curevelogotext";
            let svg = MakerJSObj.exporter.toSVG(textModel);
            let _svg = dh_editor_utility.getSvgDom(svg);
            let svgGroup = _svg.querySelector('#curevelogotext');
            svgGroup.removeAttribute('id');
            svgGroup.setAttribute("stroke-linecap", "round");
            svgGroup.setAttribute("fill-rule", "evenodd");
            return [svgGroup.outerHTML, m];
        } else {

        }
        return [null, null];
    },
    /**
     * 
     * @param {string} p_sLogoText 
     * @param {string} p_sSloganText 
     * @param {number} p_currentStep 
     * @returns 
     */
    IsConditioMeet: function (p_sLogoText, p_sSloganText) {
        let p_currentStep = dh_editor_utility.getSession('currPage');
        return (p_sLogoText.length >= minLogoNameLengthForCurve && p_sLogoText.length <= maxLogoNameLengthForCurve && p_sSloganText.length <= maxSloganNameLengthForCurve) || p_currentStep == 7 ? true : false;
    },
    /**
     * 
     * @param {object} p_sTemplatePath 
     * @param {string} p_sLogoText 
     * @param {string} sloganName 
     * @param {number} loadMoreNumber 
     * @param {number} currentStep 
     * @param {string} p_sType 
     * @param {string} p_sArcDir
     * @returns 
     */
    letsDecideCurveLogoCreate: function (p_sTemplatePath, p_sLogoText, sloganName, loadMoreNumber, p_sType, p_sArcDir) {
        if (p_sTemplatePath.isSupportCurveText == 1 && curveLogo.IsConditioMeet(p_sLogoText, sloganName)) {
            if ((p_sType === "design_style_logo") && (p_sArcDir)) {
                switch (p_sArcDir) {
                    case "down":
                        defaultCurveValue = positiveCurveValue;
                        break;
                    case "up":
                        defaultCurveValue = negativeCurveValue;
                        break;
                    default:
                        break;
                }
                return true;
            } else {
                if (loadMoreNumber % 2 == 0) {
                    if (loadMoreNumber === 2) {
                        defaultCurveValue = positiveCurveValue;
                        return true;
                    }
                    if (defaultCurveValue === positiveCurveValue) {
                        defaultCurveValue = negativeCurveValue;
                    } else {
                        defaultCurveValue = positiveCurveValue;
                    }
                    return true;
                }
            }
        }
        return false
    },
    updateJSON: function (curvePath, curveModel, logoTemp, defaultCurveValue) {
        logoTemp.logoPath = curvePath;
        if (defaultCurveValue) {
            logoTemp.arcValue = defaultCurveValue;
        }
        if (curveModel) {
            logoTemp.curveTextActualPathHeight = curveModel.height || 0;
            logoTemp.curveTextCenterWidth = curveModel.center[0] || 0;
        }
    },
    deleteCorveFromJSON: function (logoTemp) {
        delete logoTemp.generate.isArc;
        delete logoTemp.generate.arcValue;
        delete logoTemp.generate.curveTextActualPathHeight;
        delete logoTemp.generate.curveTextCenterWidth;
    }
}

const gradient = {
    current: '#bgGradient',
    type: 'linear',
    rotation: 20,
    size: 20,
    pos1: 0,
    pos2: 0,
    pos3: 0,
    pos4: 0,
    isdragStart: false,
    zIndex: 0,
    pointSelected: 0,
    newPoint: '<div class="app-gradient__point" data-x="{{datax}}"  style="left:{{left}}%; z-index:{{zindex}}; background-color:{{bgcolor}};" data-id="{{dataid}}" id="{{myid}}">{{dispvalue}}</div>',
    gradientsArray: {
        gold: { name: 'Gold', stops: [{ offset: 0, color: '#B68648' }, { offset: 1, color: '#FBF3A3' }] },
        silver: { name: 'Silver', stops: [{ offset: 0, color: '#6E6F71' }, { offset: 1, color: '#ECECEC' }] },
        bronze: { name: 'Bronze', stops: [{ offset: 0, color: '#d64000' }, { offset: 1, color: '#edc5be' }] },
        blue: { name: 'Blue', stops: [{ offset: 0, color: '#2d388a' }, { offset: 1, color: '#00aeef' }] },
        bubblegum: { name: 'Bubblegum', stops: [{ offset: 0, color: '#fe8dc6' }, { offset: 1, color: '#fed1c7' }] },
        graphite: { name: 'Graphite', stops: [{ offset: 0, color: '#51504f' }, { offset: 0.1, color: '#939598' }, { offset: 0.3, color: '#414042' }, { offset: 0.5, color: '#939598' }, { offset: 0.7, color: '#494c50' }, { offset: 0.9, color: '#6d6e71' }, { offset: 1, color: '#414042' }] },
        green: { name: 'Green', stops: [{ offset: 0, color: '#006838' }, { offset: 1, color: '#96cf24' }] },
        platinum: { name: 'Platinum', stops: [{ offset: 0, color: '#786756' }, { offset: 0.33, color: '#847361' }, { offset: 0.67, color: '#a8a49b' }, { offset: 1, color: '#d6d6d6' }] },
        purple: { name: 'Purple', stops: [{ offset: 0, color: '#25235e' }, { offset: 1, color: '#ae4792' }] },
        purpleblue: { name: 'Purple Blue', stops: [{ offset: 0, color: '#6d7cff' }, { offset: 1, color: '#ff51ff' }] },
        rose: { name: 'Rose', stops: [{ offset: 0, color: '#914d3c' }, { offset: 0.1, color: '#b37362' }, { offset: 0.3, color: '#fcc5b3' }, { offset: 0.5, color: '#f7b7a6' }, { offset: 1, color: '#945f50' }] },
        sand: { name: 'Sand', stops: [{ offset: 0, color: '#ffb295' }, { offset: 1, color: '#fedac6' }] },
        yellow: { name: 'Yellow', stops: [{ offset: 0, color: '#e93e3a' }, { offset: 0.1, color: '#ed683c' }, { offset: 0.3, color: '#f3903f' }, { offset: 0.7, color: '#fdc70c' }, { offset: 1, color: '#fff33b' }] },
    },
    init: function (current) {
        // console.log("KB.🚀 ~ file: editor_utility.js ~ line 1100 ~ current", current)
    },
    showControler: function (stopcolors, gType, callback) {
        if (!useGradientInBG) {
            return;
        }
        document.querySelector(gradient.current + ' #gradientType').classList.remove("hidden");
        document.querySelector(gradient.current + ' #gradientRotation').classList.remove("hidden");
        if (!dh_editor_utility.isMobileDevice) {
            document.querySelector(gradient.current + ' #gradientMixer').classList.remove("hidden");
        }
        document.querySelector(gradient.current + ' #gradientLabel').classList.remove("hidden");
        if (gType == 'radial') {
            document.querySelector(gradient.current + ' #gradientSize').classList.remove("hidden");
            document.querySelector(gradient.current + ' #gradientType #bgRadial').classList.add("active");
            document.querySelector(gradient.current + ' #gradientType #bgLinear').classList.remove("active");
        } else {
            document.querySelector(gradient.current + ' #gradientSize').classList.add("hidden");
            document.querySelector(gradient.current + ' #gradientType #bgLinear').classList.add("active");
            document.querySelector(gradient.current + ' #gradientType #bgRadial').classList.remove("active");
        }
        gradient.getGradientCSS(stopcolors);
        gradient.addGradientPoint(stopcolors, callback);
    },
    updateControler: function () {
        if (gradient.type == 'radial') {
            document.querySelector(gradient.current + ' #gradientSize').classList.remove("hidden");
            document.querySelector(gradient.current + ' #gradientType #bgRadial').classList.add("active");
            document.querySelector(gradient.current + ' #gradientType #bgLinear').classList.remove("active");
        } else {
            document.querySelector(gradient.current + ' #gradientSize').classList.add("hidden");
            document.querySelector(gradient.current + ' #gradientType #bgLinear').classList.add("active");
            document.querySelector(gradient.current + ' #gradientType #bgRadial').classList.remove("active");
        }
    },
    hideControler: function () {
        document.querySelector(gradient.current + ' #gradientType').classList.add("hidden");
        document.querySelector(gradient.current + ' #gradientRotation').classList.add("hidden");
        document.querySelector(gradient.current + ' #gradientSize').classList.add("hidden");
        document.querySelector(gradient.current + ' #gradientMixer').classList.add("hidden");
        document.querySelector(gradient.current + ' #gradientLabel').classList.add("hidden");
    },
    addGradient: function (finalId, stopColors, clgradient) {
        let gradientelement = null;
        gradient.type = clgradient.type;
        gradient.rotation = clgradient.rotation;
        gradient.size = clgradient.size;

        let anglePI = (gradient.rotation - 90) * (Math.PI / 180);
        if (gradient.type == 'radial') {
            gradientelement = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
            gradientelement.setAttribute('gradientTransform', "translate(0.5, 0.5) scale(1, 1)");
            let r = (1 * (gradient.size / 100) * 50) / 50;
            let cx = 0 + (r * Math.cos((gradient.rotation) * (Math.PI / 180)));
            let cy = 0 + (r * Math.sin((gradient.rotation) * (Math.PI / 180)));
            gradientelement.setAttribute("cx", cx);
            gradientelement.setAttribute("cy", cy);
            gradientelement.setAttribute("r", 0.5 + r);
        } else {
            let angleCoords = {
                'x1': Math.round(50 + Math.sin(anglePI) * 50) + '%',
                'y1': Math.round(50 + Math.cos(anglePI) * 50) + '%',
                'x2': Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + '%',
                'y2': Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + '%',
            }
            gradientelement = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradientelement.setAttribute("gradientUnits", 'userSpaceOnUse');
            gradientelement.setAttribute('gradientTransform', "translate(0.5, 0.5) scale(1, 1) translate(-0.5, -0.5)");
            gradientelement.setAttribute("x1", angleCoords.x1);
            gradientelement.setAttribute("x2", angleCoords.x2);
            gradientelement.setAttribute("y1", angleCoords.y1);
            gradientelement.setAttribute("y2", angleCoords.y2);
        }
        gradientelement.setAttribute("gradientUnits", 'objectBoundingBox');
        gradientelement.setAttribute("id", finalId);

        gradientelement.innerHTML = gradient.getGradientStops(stopColors);
        return gradientelement.outerHTML;
    },
    getGradientStops: function (gradientStops) {
        var stops = '';
        stops = gradientStops.reduce((accm, item) => {
            return accm + '<stop offset="' + item.offset + '" stop-color="' + item.color + '" />';
        }, '');
        return stops;
    },
    getGradientCSS: function (gradientStops, callback) {
        try {
            gradientStops.sort((a, b) => a.offset - b.offset);
            let gradientcss = 'linear-gradient(90deg';
            gradientcss += gradientStops.reduce((accm, item) => {

                return accm + ', ' + item.color + ' ' + (item.offset * 100) + '%';
            }, '');
            document.querySelector(gradient.current + ' #gradientMixer .app-gradient__color-background').style.backgroundImage = gradientcss + ')';
            if (callback) {
                callback();
            }
        }
        catch (e) {
            // console.log(e)
        }
    },
    addGradientPoint: function (gradientStops, callback) {
        let points = '';
        points += gradientStops.reduce((accm, item, index) => {
            let datax = Math.floor(item.offset * 100);
            let point = gradient.newPoint.replace('{{myid}}', 'dragme_' + index).replace('{{datax}}', datax).replace('{{left}}', datax).replace('{{dispvalue}}', datax).replace('{{bgcolor}}', item.color).replace('{{zindex}}', index).replace('{{dataid}}', index);
            return accm + point;
        }, '');
        document.querySelector(gradient.current + ' #gradientMixer .app-gradient__points').innerHTML = points;
        if (callback) {
            callback(gradientStops);
        }

    },
    updateGradientOnChange: function (bgGradient) {
        gradient.rotation = bgGradient.rotation;
        gradient.size = bgGradient.size;

        let gradientelement = document.querySelector('.finaLogoInner svg #bgColorGradient').firstChild;
        let anglePI = (gradient.rotation - 90) * (Math.PI / 180);
        if (gradient.type == 'radial') {
            let r = (1 * (gradient.size / 100) * 50) / 50;
            let cx = 0 + (r * Math.cos((gradient.rotation) * (Math.PI / 180)));
            let cy = 0 + (r * Math.sin((gradient.rotation) * (Math.PI / 180)));
            gradientelement.setAttribute("cx", cx);
            gradientelement.setAttribute("cy", cy);
            gradientelement.setAttribute("r", 0.5 + r);
        } else {
            let angleCoords = {
                'x1': Math.round(50 + Math.sin(anglePI) * 50) + '%',
                'y1': Math.round(50 + Math.cos(anglePI) * 50) + '%',
                'x2': Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + '%',
                'y2': Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + '%',
            }
            gradientelement.setAttribute("x1", angleCoords.x1);
            gradientelement.setAttribute("x2", angleCoords.x2);
            gradientelement.setAttribute("y1", angleCoords.y1);
            gradientelement.setAttribute("y2", angleCoords.y2);
        }
        gradientelement.innerHTML = gradient.getGradientStops(bgGradient.colordetail);
    },
    getcolour: function () {
        var gradient = [
            [0, [255, 0, 0]],
            [28, [0, 128, 0]],
            [72, [0, 0, 255]],
            [100, [255, 0, 0]]
        ];
        var sliderWidth = 500;
        $("#slider").slider({
            min: 1,
            slide: function (event, ui) {
                var colorRange = []
                $.each(gradient, function (index, value) {
                    if (ui.value <= value[0]) {
                        colorRange = [index - 1, index]
                        return false;
                    }
                });

                //Get the two closest colors
                var firstcolor = gradient[colorRange[0]][1];
                var secondcolor = gradient[colorRange[1]][1];

                //Calculate ratio between the two closest colors
                var firstcolor_x = sliderWidth * (gradient[colorRange[0]][0] / 100);
                var secondcolor_x = sliderWidth * (gradient[colorRange[1]][0] / 100) - firstcolor_x;
                var slider_x = sliderWidth * (ui.value / 100) - firstcolor_x;
                var ratio = slider_x / secondcolor_x

                //Get the color with pickHex(thx, less.js's mix function!)
                var result = pickHex(secondcolor, firstcolor, ratio);

                $('#result').css("background-color", 'rgb(' + result.join() + ')');

            }
        });

        function pickHex(color1, color2, weight) {
            var p = weight;
            var w = p * 2 - 1;
            var w1 = (w / 1 + 1) / 2;
            var w2 = 1 - w1;
            var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
            Math.round(color1[1] * w1 + color2[1] * w2),
            Math.round(color1[2] * w1 + color2[2] * w2)];
            return rgb;
        }
    },
    getGradientCssColour: function (clgradient) {
        let stopColors = clgradient.colordetail;
        // stopColors.sort((a, b) => a.offset - b.offset);
        let gradientcss = '';
        gradient.type = clgradient.type;
        gradient.rotation = clgradient.rotation;
        gradient.size = clgradient.size;
        if (gradient.type == 'radial') {
            let r = (339 * gradient.size / 100);
            let cx = (Math.cos((gradient.rotation - 90) * (Math.PI / 180)));
            let cy = (Math.sin((gradient.rotation - 90) * (Math.PI / 180)));
            gradientcss = 'radial-gradient(' + (r) + 'px circle at ' + cx + '% ' + cy + '%';
        } else {
            gradientcss = 'linear-gradient(' + gradient.rotation + 'deg';
        }
        gradientcss += stopColors.reduce((accm, item) => {
            return accm + ', ' + item.color + ' ' + (item.offset * 100) + '%';
        }, '');

        return gradientcss + ')';
    },

    updateColorforseceted: function (color) {
        let hexcolor = dh_editor_utility.rgbToHex(color);
        // document.querySelector('#colorPickerGradient .commonClrDiv').setAttribute('data-color', hexcolor);
        // document.querySelector('#colorPickerGradient .color-box i').style.background = hexcolor

        document.querySelector('.gradienselectedcolor input').value = hexcolor;
    }
}

const jsgradient = {
    inputA: '',
    inputB: '',
    inputC: '',
    gradientElement: '',

    // Convert a hex color to an RGB array e.g. [r,g,b]
    // Accepts the following formats: FFF, FFFFFF, #FFF, #FFFFFF
    hexToRgb: function (hex) {
        var r, g, b, parts;
        // Remove the hash if given
        hex = hex.replace('#', '');
        // If invalid code given return white
        if (hex.length !== 3 && hex.length !== 6) {
            return [255, 255, 255];
        }
        // Double up charaters if only three suplied
        if (hex.length == 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        // Convert to [r,g,b] array
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);

        return [r, g, b];
    },

    // Converts an RGB color array e.g. [255,255,255] into a hexidecimal color value e.g. 'FFFFFF'
    rgbToHex: function (color) {
        // Set boundries of upper 255 and lower 0
        color[0] = (color[0] > 255) ? 255 : (color[0] < 0) ? 0 : color[0];
        color[1] = (color[1] > 255) ? 255 : (color[1] < 0) ? 0 : color[1];
        color[2] = (color[2] > 255) ? 255 : (color[2] < 0) ? 0 : color[2];

        return this.zeroFill(color[0].toString(16), 2) + this.zeroFill(color[1].toString(16), 2) + this.zeroFill(color[2].toString(16), 2);
    },

    // Pads a number with specified number of leading zeroes
    zeroFill: function (number, width) {
        width -= number.toString().length;
        if (width > 0) {
            return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
        }
        return number;
    },

    // Generates an array of color values in sequence from 'colorA' to 'colorB' using the specified number of steps
    generateGradient: function (colorA, colorB, steps) {
        var result = [], rInterval, gInterval, bInterval;

        colorA = this.hexToRgb(colorA); // [r,g,b]
        colorB = this.hexToRgb(colorB); // [r,g,b]
        steps -= 1; // Reduce the steps by one because we're including the first item manually

        // Calculate the intervals for each color
        rStep = (Math.max(colorA[0], colorB[0]) - Math.min(colorA[0], colorB[0])) / steps;
        gStep = (Math.max(colorA[1], colorB[1]) - Math.min(colorA[1], colorB[1])) / steps;
        bStep = (Math.max(colorA[2], colorB[2]) - Math.min(colorA[2], colorB[2])) / steps;

        result.push('#' + this.rgbToHex(colorA));

        // Set the starting value as the first color value
        var rVal = colorA[0],
            gVal = colorA[1],
            bVal = colorA[2];

        // Loop over the steps-1 because we're includeing the last value manually to ensure it's accurate
        for (var i = 0; i < (steps - 1); i++) {
            // If the first value is lower than the last - increment up otherwise increment down
            rVal = (colorA[0] < colorB[0]) ? rVal + Math.round(rStep) : rVal - Math.round(rStep);
            gVal = (colorA[1] < colorB[1]) ? gVal + Math.round(gStep) : gVal - Math.round(gStep);
            bVal = (colorA[2] < colorB[2]) ? bVal + Math.round(bStep) : bVal - Math.round(bStep);
            result.push('#' + this.rgbToHex([rVal, gVal, bVal]));
        };

        result.push('#' + this.rgbToHex(colorB));

        return result;
    },

    gradientList: function (colorA, colorB, list) {
        var list = (typeof list === 'object') ? list : $(list),
            listItems = list.find('li'),
            steps = listItems.length,
            colors = jsgradient.generateGradient(colorA, colorB, steps);
        listItems.each(function (i) {
            $(this).css('backgroundColor', colors[i]);
        });
    }
}
