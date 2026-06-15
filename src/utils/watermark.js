/**
 * document.body 添加全局水印
 * @param {*} settings 拓展参数
 */
export function setDocumentWaterMark(settings) {
  var detaultConfig = {
    water_mark_txt: "",
    water_mark_x: 20, //水印起始位置x轴坐标
    water_mark_y: 50, //水印起始位置Y轴坐标
    water_mark_rows: 20, //水印行数
    water_mark_cols: 20, //水印列数
    water_mark_x_space: 140, //水印x轴间隔
    water_mark_y_space: 100, //水印y轴间隔
    water_mark_color: "#000", //水印字体颜色
    water_mark_alpha: 0.5, //水印透明度
    water_mark_fontsize: "14px", //水印字体大小
    water_mark_font: "微软雅黑", //水印字体
    water_mark_width: 200, //水印宽度
    water_mark_height: 160, //水印长度
    water_mark_angle: 20, //水印倾斜度数
  };
  if (arguments.length === 1 && typeof arguments[0] === "object") {
    var src = arguments[0] || {};
    for (var key in src) {
      if (src[key] && detaultConfig[key] && src[key] === detaultConfig[key])
        continue;
      else if (src[key]) detaultConfig[key] = src[key];
    }
  }
  var oTemp = document.createDocumentFragment();
  //获取页面最大宽度
  var page_width = Math.max(
    document.body.scrollWidth,
    document.body.clientWidth
  );
  var cutWidth = page_width * 0.015;
  var page_width = page_width - cutWidth;
  //获取页面最大高度
  var page_height =
    Math.max(document.body.scrollHeight, document.body.clientHeight) + 450;
  page_height = Math.max(page_height, window.innerHeight - 30);
  if (
    detaultConfig.water_mark_cols == 0 ||
    parseInt(
      detaultConfig.water_mark_x +
      detaultConfig.water_mark_width * detaultConfig.water_mark_cols +
      detaultConfig.water_mark_x_space * (detaultConfig.water_mark_cols - 1)
    ) > page_width
  ) {
    detaultConfig.water_mark_cols = parseInt(
      (page_width -
        detaultConfig.water_mark_x +
        detaultConfig.water_mark_x_space) /
      (detaultConfig.water_mark_width + detaultConfig.water_mark_x_space)
    );
    detaultConfig.water_mark_x_space = parseInt(
      (page_width -
        detaultConfig.water_mark_x -
        detaultConfig.water_mark_width * detaultConfig.water_mark_cols) /
      (detaultConfig.water_mark_cols - 1)
    );
  }
  if (
    detaultConfig.water_mark_rows == 0 ||
    parseInt(
      detaultConfig.water_mark_y +
      detaultConfig.water_mark_height * detaultConfig.water_mark_rows +
      detaultConfig.water_mark_y_space * (detaultConfig.water_mark_rows - 1)
    ) > page_height
  ) {
    detaultConfig.water_mark_rows = parseInt(
      (detaultConfig.water_mark_y_space +
        page_height -
        detaultConfig.water_mark_y) /
      (detaultConfig.water_mark_height + detaultConfig.water_mark_y_space)
    );
    detaultConfig.water_mark_y_space = parseInt(
      (page_height -
        detaultConfig.water_mark_y -
        detaultConfig.water_mark_height * detaultConfig.water_mark_rows) /
      (detaultConfig.water_mark_rows - 1)
    );
  }
  var x;
  var y;
  for (var i = 0; i < detaultConfig.water_mark_rows; i++) {
    y =
      detaultConfig.water_mark_y +
      (detaultConfig.water_mark_y_space + detaultConfig.water_mark_height) * i;
    for (var j = 0; j < detaultConfig.water_mark_cols; j++) {
      x =
        detaultConfig.water_mark_x +
        (detaultConfig.water_mark_width + detaultConfig.water_mark_x_space) * j;
      var mask_div = document.createElement("div");
      mask_div.id = "mask_div" + i + j;
      mask_div.className = "mask_div";
      mask_div.appendChild(
        document.createTextNode(detaultConfig.water_mark_txt)
      );
      //设置水印div倾斜显示
      mask_div.style.webkitTransform =
        "rotate(-" + detaultConfig.water_mark_angle + "deg)";
      mask_div.style.MozTransform =
        "rotate(-" + detaultConfig.water_mark_angle + "deg)";
      mask_div.style.msTransform =
        "rotate(-" + detaultConfig.water_mark_angle + "deg)";
      mask_div.style.OTransform =
        "rotate(-" + detaultConfig.water_mark_angle + "deg)";
      mask_div.style.transform =
        "rotate(-" + detaultConfig.water_mark_angle + "deg)";
      mask_div.style.visibility = "";
      mask_div.style.position = "fixed";
      mask_div.style.left = x + "px";
      mask_div.style.top = y + "px";
      mask_div.style.overflow = "hidden";
      mask_div.style.zIndex = "9999";
      //设置水印不遮挡页面的点击事件
      mask_div.style.pointerEvents = "none";
      mask_div.style.opacity = detaultConfig.water_mark_alpha;
      mask_div.style.fontSize = detaultConfig.water_mark_fontsize;
      mask_div.style.fontFamily = detaultConfig.water_mark_font;
      mask_div.style.color = detaultConfig.water_mark_color;
      mask_div.style.textAlign = "center";
      mask_div.style.width = detaultConfig.water_mark_width + "px";
      mask_div.style.height = detaultConfig.water_mark_height + "px";
      mask_div.style.display = "block";
      oTemp.appendChild(mask_div);
    }
  }

  // 移除重绘、解决浏览器缩放问题
  var elem = document.getElementsByClassName("mask_div");
  let newElem = Array.prototype.slice.call(elem);
  for (var i = newElem.length - 1; i >= 0; i--) {
    document.body.removeChild(newElem[i]);
  }
  document.body.appendChild(oTemp);
}
