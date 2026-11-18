module.exports = { * beforeSendResponse(requestDetail, responseDetail) {
        // 带key=battlesetup，battleresume参数分别为新建战斗和战斗重开
        if ((requestDetail.url.indexOf('ac.php') != -1) && (requestDetail.requestData.indexOf('key=battlesetup') != -1 || requestDetail.requestData.indexOf('key=battleresume') != -1)) {
            const newResponse = responseDetail.response;
            var newbodyString = newResponse.body.toString();

            var dec = new Buffer(newbodyString.replace(/%3D/g, '='), 'base64').toString();
            var decJson = JSON.parse(dec);
            if (decJson['cache']['replaced']['battle']) {
                var svts = decJson['cache']['replaced']['battle'][0]['battleInfo']['userSvt'];
                //var count = 0;
                for (var i = 0; i < svts.length; i++) {

					const s = svts[i];

					if (s.hpGaugeType != undefined) {
						s.hp = typeof s.hp === 'string' ?'1' : 1;
						s.maxActNum = 1;
						s.chargeTurn = 6;
					}

					const isAlly =
						s.status !== undefined &&
						s.hpGaugeType === undefined &&
						s.parentSvtId === undefined;

					if (isAlly) {
						s.atk = typeof s.atk === 'string' ?'999999' : 999999;
						s.hp = typeof s.hp === 'string' ?'999999' : 999999;

                        s.skillLv1 = '10';
                        s.skillLv2 = '10';
                        s.skillLv3 = '10';
                        s.treasureDeviceLv = '5';
					}

                }
                decJson['cache']['replaced']['battle'][0]['battleInfo']['userSvt'] = svts;
                delete decJson['sign'];
                var encStr = JSON.stringify(decJson);

                //JSON.stringify(JSON.parse(?))组合拳会将内容进行两次转义
                //以下操作将转义后的字符串还原回转义前，以防止客户端报错
                var preStr = '\\u';
                // 转换中文到unicode
                var cnReg = /[\u0391-\uFFE5]/gm;
                if (cnReg.test(encStr)) {
                    var encStr = encStr.replace(cnReg,
                    function(str) {
                        return preStr + str.charCodeAt(0).toString(16)
                    });
                }
                // 转换转义字符
                encStr = encStr.replace(/\//g, '\\\/');
                // base64加密
                var enc = new Buffer(encStr).toString('base64');
                // 替换URI字符
                enc = enc.replace(/=/g, '%3D');
                // 重建buffer
                var b = new Buffer(enc);
                newResponse.body = b;
                return {
                    response: newResponse
                };
            }
        }
    },
};