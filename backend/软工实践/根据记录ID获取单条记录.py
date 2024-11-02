# app.py
from flask import Flask, jsonify
from data import Record, load_records

app = Flask(__name__)

# 初始化时，从JSON文件加载所有记录



# 根据记录ID获取特定记录的路由
@app.route('/get_record/<int:record_id>', methods=['GET'])
def get_record_by_id(record_id):
    # 如果您使用ledger_objects（Record对象列表）
    ledger = load_records()

    # 注意：此时ledger是一个包含字典的列表，每个字典代表一条记录
    # 如果您想将这些记录转换为Record对象列表，可以执行以下操作：
    ledger_objects = [Record.from_dict(record) for record in ledger]
    record_obj = next((record for record in ledger_objects if record.id == record_id), None)
    if record_obj:
        # 转换为字典后返回，因为jsonify无法直接处理Record对象
        return jsonify(record_obj.to_dict())
    else:
        return jsonify({"error": "Record not found"}), 404

        # 如果您直接使用ledger（字典列表）
    # record = next((item for item in ledger if item['id'] == record_id), None)
    # if record:
    #     return jsonify(record)
    # else:
    #     return jsonify({"error": "Record not found"}), 404




if __name__ == '__main__':
    app.run(debug=True, port=5000)