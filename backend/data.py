import json
import os

class Record:
    def __init__(self, id, date, amount, category, note, type):
        self.id = id
        self.date = date
        self.amount = amount
        self.category = category
        self.note = note
        self.type = type

    def to_dict(self):
        """将记录对象转换为字典"""
        return {
            "id": self.id,
            "date": self.date,
            "amount": self.amount,
            "category": self.category,
            "note": self.note,
            "type": self.type  
        }

    @staticmethod
    def from_dict(data):
        """从字典创建一个记录对象"""
        return Record(
            id=data.get("id"),
            date=data.get("date"),
            amount=data.get("amount"),
            category=data.get("category"),
            note=data.get("note"),
            type=data.get("type")  # 添加这行以获取 type 参数
        )

    def __repr__(self):
        """定义对象的字符串表示形式，便于调试"""
        return f"Record(id={self.id}, date='{self.date}', amount={self.amount}, category='{self.category}', note='{self.note}', type='{self.type}')"

def load_records(filename='data/records.json'):
    """从JSON文件加载所有记录并将其转换为Record对象列表"""
    records = []
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as file:
            data = json.load(file)
            for item in data.get("records", []):
                # 使用 from_dict 方法将字典转换为 Record 对象
                record = Record.from_dict(item)
                records.append(record)
    return records

def save_records(records, filename='data/records.json'):
    """将记录列表保存到 JSON 文件"""
    # 将 Record 对象列表转换为字典列表
    data = {
        "records": [record.to_dict() for record in records]
    }
    
    # 将数据写入 JSON 文件
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)