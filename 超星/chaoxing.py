import json
import os
import time

import pyperclip

# Markdown 文件路径
markdown_file = 'questions.md'

# 存储已处理的剪贴板内容
processed_content = set()

# 初始化 Markdown 文件
if not os.path.exists(markdown_file):
    with open(markdown_file, 'w', encoding='utf-8') as f:
        f.write('# 题目汇总\n\n')

# 总题量计数
total_questions = 0

print('开始监控剪贴板，按 Ctrl+C 停止。')

try:
    while True:
        clipboard_content = pyperclip.paste()
        if clipboard_content not in processed_content:
            try:
                data = json.loads(clipboard_content)
                if isinstance(data, dict) and 'questions' in data and 'title' in data:
                    questions = data['questions']
                    title = data['title']
                    question_count = len(questions)

                    if question_count == 0:
                        continue

                    with open(markdown_file, 'a', encoding='utf-8') as f:
                        f.write(f'# {title}\n\n')
                        for q in questions:
                            qtype = q.get('questionType', '')
                            number = q.get('number', '')
                            question = q.get('questionText', '')
                            f.write(f"## 问题 {number} ({qtype})\n")
                            f.write(f"**题目**: {question}\n\n")
                            if q.get('options'):
                                f.write("**选项**:\n")
                                for opt in q['options']:
                                    f.write(f"- {opt}\n")
                                f.write('\n')
                            answer = q.get('answerText', '')
                            f.write('<details>\n<summary>查看答案</summary>\n\n')
                            f.write(f"{answer}\n\n")
                            f.write('</details>\n\n')
                    
                    total_questions += question_count
                    print(f"已获取 {question_count} 个问题，标题: '{title}'。总计获取: {total_questions} 个问题。")
                    processed_content.add(clipboard_content)
            except json.JSONDecodeError:
                pass
        time.sleep(1)
except KeyboardInterrupt:
    print('\n监控已停止。')