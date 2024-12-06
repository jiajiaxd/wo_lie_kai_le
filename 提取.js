// ==UserScript==
// @name         Mooc1 Chaoxing Question Extractor with Title
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  提取测验标题和问题信息并复制为JSON格式
// @match        https://mooc1.chaoxing.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            // 提取测验标题
            var titleElem = document.querySelector('.ceyan_name h3');
            var title = titleElem ? titleElem.textContent.trim() : '未知标题';

            var questions = document.querySelectorAll('.TiMu.newTiMu.ans-cc.singleQuesId');
            var result = {
                title: title,
                questions: []
            };

            questions.forEach(function(q) {
                // 提取题号
                var numberElem = q.querySelector('.Zy_TItle .fl');
                var number = numberElem ? numberElem.textContent.trim() : '';

                // 提取题型和题目
                var titleElem = q.querySelector('.font-cxsecret.fontLabel');
                var questionType = '';
                var questionText = '';
                if (titleElem) {
                    var typeElem = titleElem.querySelector('.newZy_TItle');
                    questionType = typeElem ? typeElem.textContent.trim() : '';
                    questionText = titleElem.textContent.replace(questionType, '').trim();
                }

                // 提取选项
                var options = [];
                var form = q.querySelector('form');
                if (form) {
                    var liElements = form.querySelectorAll('ul.Zy_ulTop li');
                    liElements.forEach(function(li) {
                        var optionText = li.textContent.trim();
                        if (optionText) {
                            options.push(optionText);
                        }
                    });
                }

                // 提取答案
                var answerElem = q.querySelector('.newAnswerBx .myAnswer .answerCon');
                var answerText = answerElem ? answerElem.textContent.trim() : '';

                // 添加到结果数组
                result.questions.push({
                    number: number,
                    questionType: questionType,
                    questionText: questionText,
                    options: options,
                    answerText: answerText
                });
            });

            if (result.questions.length === 0) {
                alert('未提取到任何问题。');
                return;
            }

            var jsonResult = JSON.stringify(result, null, 2);
            navigator.clipboard.writeText(jsonResult).then(function() {
                alert('提取结果已复制到剪贴板。');
            }).catch(function(err) {
                alert('复制到剪贴板失败: ' + err);
            });
        }
    });
})();