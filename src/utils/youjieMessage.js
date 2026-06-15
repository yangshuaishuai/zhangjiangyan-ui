/*
 * @Author: weijiahao weijiahao@zhanhong.com
 * @Date: 2025-08-21 09:22:38
 * @LastEditors: weijiahao weijiahao@zhanhong.com
 * @LastEditTime: 2025-09-09 09:29:49
 * @FilePath: \ccd-vui\src\utils\youjieMessage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * iframe 与父窗口通信工具模块
 */

const IframeMessage = {
  /**
   * 向父窗口发送请求（Promise 方式）
   * @param {string} action - 请求动作名称
   * @param {number} [timeout=10000] - 超时时间（毫秒）
   * @returns {Promise<Object>} 响应数据
   */
  postMessageToParent(action, data, timeout = 10000) {
    return new Promise((resolve, reject) => {
      let timer = null;

      const listener = (event) => {
        if (event.data && event.data.response) {
          clearTimeout(timer);
          window.removeEventListener("message", listener);
          resolve(event.data.response);
        }
      };

      window.addEventListener("message", listener);

      // 设置超时机制
      timer = setTimeout(() => {
        window.removeEventListener("message", listener);
        reject({ success: false, error: "请求超时" });
      }, timeout);

      // 发送请求到父窗口
      window.parent.postMessage({ action, data }, "*");
    });
  },

  /**
   * 向 iframe 返回响应
   * @param {Window} targetWindow - iframe 的 window 对象
   * @param {Object} response - 响应数据
   */
  postResponseToIframe(targetWindow, response) {
    if (targetWindow && targetWindow.postMessage) {
      targetWindow.postMessage({ response }, "*");
    }
  },
};

export default IframeMessage;
