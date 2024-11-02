from flask import Flask
from flask import request, jsonify
from data import Record, load_records

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

@app.route('/search_records', methods=['GET'])
def search_records():
    """根据条件搜索记录"""
    pass


if __name__ == '__main__':
    app.run(debug=True)
