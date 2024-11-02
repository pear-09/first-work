from flask import Flask, request, jsonify
from data import Record, load_records, save_records
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 对整个应用启用 CORS

JSON_FILE_PATH = 'data/records.json'

def get_next_id():
    try:
        records = load_records(JSON_FILE_PATH)
        if records:
            max_id = max(record.id for record in records)
            return max_id + 1
        else:
            return 1
    except (FileNotFoundError, json.JSONDecodeError):
        return 1

@app.route('/api/record/add', methods=['POST'])
def add_record():
    data = request.get_json()
    amount = data.get('amount')
    if amount is not None and amount == 0:
        return jsonify({"error": "无意义"})
    
    new_id = get_next_id()
    # 创建新的记录对象，确保包含type字段
    new_record = Record(
        new_id,
        data.get('date'),
        amount,
        data.get('category'),
        data.get('note'),
        data.get('type')
    )
    
    records = load_records(JSON_FILE_PATH)
    records.append(new_record)
    save_records(records, JSON_FILE_PATH)
    return jsonify({"message": "添加成功"})

@app.route('/get_record/<int:record_id>', methods=['GET'])
def get_record_by_id(record_id):
    records = load_records()
    record_obj = next((record for record in records if record.id == record_id), None)
    if record_obj:
        return jsonify(record_obj.to_dict())
    else:
        return jsonify({"error": "Record not found"}), 404

@app.route('/get_all_records', methods=['GET'])
def get_all_records():
    records = load_records()
    return jsonify([record.to_dict() for record in records])

@app.route('/update_record/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    """更新指定ID的记录，可以选择更新某个字段"""
    data = request.get_json()
    records = load_records()

    record = next((r for r in records if r.id == record_id), None)
    if record is None:
        return jsonify({"error": "Record not found"}), 404

    # 更新字段，如果提供了该字段的新值
    if 'date' in data:
        record.date = data['date']
    if 'amount' in data:
        record.amount = data['amount']
    if 'category' in data:
        record.category = data['category']
    if 'note' in data:
        record.note = data['note']
    if 'type' in data:  # 更新type字段
        record.type = data['type']

    save_records(records)
    return jsonify({"message": "Record updated successfully"})

@app.route('/delete_record/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    """删除指定ID的记录"""
    records = load_records()

    record = next((r for r in records if r.id == record_id), None)
    if record is None:
        return jsonify({"error": "Record not found"}), 404

    # 从列表中删除指定的记录
    records = [r for r in records if r.id != record_id]
    save_records(records)
    return jsonify({"message": "Record deleted successfully"})

@app.route('/api/record/search', methods=['GET'])
def search_records():
    """根据条件搜索记录并返回统计结果"""
    records = load_records()

    # 获取查询参数
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    category = request.args.get('category')
    record_type = request.args.get('type')

    # 筛选符合条件的记录
    filtered_records = [
        record for record in records
        if (not start_date or record.date >= start_date) and
           (not end_date or record.date <= end_date) and
           (not category or record.category == category) and
           (not record_type or record.type == record_type)
    ]

    # 根据type字段计算总收入和总支出
    total_income = sum(record.amount for record in filtered_records if record.type == '收入')
    total_expense = sum(record.amount for record in filtered_records if record.type == '支出')
    balance = total_income - total_expense  # 余额计算

    # 返回结果
    response = {
        "message": "success",
        "records": [record.to_dict() for record in filtered_records],
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
