from flask import Flask
from flask import request, jsonify
from data import Record, load_records, save_records

app = Flask(__name__)

@app.route('/add_record', methods=['POST'])
def add_record():
    """新增一条记录"""
    pass

@app.route('/get_record/<int:record_id>', methods=['GET'])
def get_record_by_id(record_id):
    """根据记录ID获取单条记录"""
    pass

@app.route('/get_all_records', methods=['GET'])
def get_all_records():
    """获取所有记录"""
    pass

@app.route('/update_record/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    """更新指定ID的记录，可以选择更新某个字段"""
    # 从请求获取更新的字段数据
    data = request.get_json()
    
    # 加载所有记录
    records = load_records()  # 假设已有函数加载所有记录

    # 查找指定ID的记录
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

    # 保存更新后的记录（假设有save_records函数可以覆盖现有记录集）
    save_records(records)  # 保存整个记录集到JSON文件

    return jsonify({"message": "Record updated successfully"})

@app.route('/delete_record/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    """删除指定ID的记录"""
    # 加载所有记录
    records = load_records()  # 假设已有函数加载所有记录

    # 查找指定ID的记录
    record = next((r for r in records if r.id == record_id), None)
    if record is None:
        return jsonify({"error": "Record not found"}), 404

    # 从列表中删除指定的记录
    records = [r for r in records if r.id != record_id]

    # 保存更新后的记录（假设有save_records函数可以覆盖现有记录集）
    save_records(records)  # 保存整个记录集到JSON文件

    return jsonify({"message": "Record deleted successfully"})

@app.route('/api/record/search', methods=['GET'])
def search_records():
    """根据条件搜索记录并返回统计结果"""
    records = load_records()

    # 获取查询参数
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    category = request.args.get('category')

    # 筛选符合条件的记录
    filtered_records = [
        record for record in records
        if (not start_date or record['date'] >= start_date) and
           (not end_date or record['date'] <= end_date) and
           (not category or record['category'] == category)
    ]

    # 计算总收入和总支出
    total_income = sum(record['amount'] for record in filtered_records if record['amount'] > 0)
    total_expense = sum(-record['amount'] for record in filtered_records if record['amount'] < 0)
    balance = total_income - total_expense

    # 返回结果
    response = {
        "message": "success",
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance
    }
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
