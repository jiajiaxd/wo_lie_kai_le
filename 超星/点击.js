// ==UserScript==
// @name         自动点击章节测验
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  持续监听章节测验的状态并自动点击
// @match        https://mooc1.chaoxing.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;

    function checkAndClick() {
        if (isProcessing) return;
        isProcessing = true;

        const targetElement = [...document.querySelectorAll('#prev_tab li')].find(li => li.getAttribute('title') === '章节测验');
        if (targetElement && !targetElement.classList.contains('active')) {
            targetElement.click();
            setTimeout(() => {
                isProcessing = false;
            }, 2000); // 延时2秒后允许下一次检测
        } else {
            isProcessing = false;
        }
    }

    // 使用MutationObserver监听整个文档的DOM变化
    const observer = new MutationObserver(() => {
        checkAndClick();
    });

    observer.observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true
    });

    // 初始检测
    checkAndClick();
})();