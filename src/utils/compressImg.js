//base64转码（压缩完成后的图片为base64编码，这个方法可以将base64编码转回file文件）
function dataURLtoFile(dataurl, fileName) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });

}
//压缩图片
export function compressImg(file, type) {
    var files;
    var read = new FileReader();
    read.readAsDataURL(file);
    return new Promise(function (resolve, reject) {
        // 不压缩图片
        // resolve(file)
        // return
        console.log('压缩', file.size / 1024 / 1024)
        if (file.size / 1024 / 1024 < 0.2) {
            resolve(file)
            return
        }
        read.onload = function (e) {
            var img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                var MAX_SIZE = 1024;//最大尺寸限制
                //默认按比例压缩
                var w = this.width,
                    h = this.height;
                if (w > h) {
                    h *= MAX_SIZE / w
                    w = MAX_SIZE
                } else {
                    if (h > MAX_SIZE) {
                        w *= MAX_SIZE / h
                        h = MAX_SIZE
                    }
                }
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var base64;
                // 创建属性节点
                canvas.setAttribute("width", w);
                canvas.setAttribute("height", h);
                ctx.drawImage(this, 0, 0, w, h);
                //默认压缩0.6
                let quality = 0.7;
                //文件大于10m  压缩0.4
                if (file.size / 1024 / 1024 > 10) {
                    quality = 0.2
                } else if (file.size / 1024 / 1024 > 5) {
                    quality = 0.4
                } else if (file.size / 1024 / 1024 > 2) {
                    quality = 0.56
                }
                base64 = canvas.toDataURL("image/jpeg", quality);
                // base64  =  canvas.toDataURL("image/jpeg", 1);
                // 回调函数返回file的值（将base64编码转成file）
                files = dataURLtoFile(base64, file.name); //如果后台接收类型为base64的话这一步可以省略
                console.log('压缩完大小', files.size / 1024 / 1024)
                if (type == "base64") {
                    resolve({ base64, name: file.name })
                } else {
                    resolve(files)
                }
            };
        };
    })
};