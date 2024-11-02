

# app.py (新的 Flask 应用文件)
from flask import Flask, jsonify
from data import Record, load_records

app = Flask(__name__)

# 从 JSON 文件加载记录


# 根据记录ID获取单条记录的路由
@app.route('/get_record/<int:record_id>', methods=['GET'])


    # 获取所有记账记录的路由


@app.route('/get_all_records', methods=['GET'])
def get_all_records():
    # 返回字典列表或转换为 Record 对象后的字典列表
    return jsonify([record.to_dict() for record in ledger_objects])


if __name__ == '__main__':
    app.run(debug=True, port=5000)