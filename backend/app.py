from flask import Flask

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
    pass

@app.route('/delete_record/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    """删除指定ID的记录"""
    pass

@app.route('/get_recent_day_records', methods=['GET'])
def get_recent_records():
    """获取最近一天记录"""
    pass

@app.route('/get_month_records', methods=['GET'])
def get_month_records():
    """获取指定月份的记录"""
    pass

@app.route('/get_recent_mouth_records', methods=['GET'])
def get_recent_records():
    """获取最近一个月记录"""
    pass

@app.route('/get_recent_year_records', methods=['GET'])
def get_recent_records():
    """获取最近一年记录"""
    pass

@app.route('/calculate_statistics', methods=['GET'])
def calculate_statistics():
    """统计总收入和总支出"""
    pass

if __name__ == '__main__':
    app.run(debug=True)
