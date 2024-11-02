<template>
  <div id="app">
    <h1>个人记账本</h1>

    <!-- 过滤器部分 -->
    <div class="filter">
      <label for="startDate">开始日期:</label>
      <input type="date" v-model="startDate" />

      <label for="endDate">结束日期:</label>
      <input type="date" v-model="endDate" />

      <label for="category">收支类别:</label>
      <select v-model="selectedCategory" @change="resetSubcategory">
        <option value="">所有</option>
        <option value="收入">收入</option>
        <option value="支出">支出</option>
      </select>

      <label v-if="selectedCategory === '支出'" for="expenseType">支出类别:</label>
      <select v-if="selectedCategory === '支出'" v-model="selectedExpenseType">
        <option value="">所有</option>
        <option value="购物">购物</option>
        <option value="餐饮">餐饮</option>
        <option value="生活缴费">生活缴费</option>
        <option value="交通">交通</option>
        <option value="医疗">医疗</option>
        <option value="其他">其他</option>
      </select>

      <label v-if="selectedCategory === '收入'" for="incomeType">收入类别:</label>
      <select v-if="selectedCategory === '收入'" v-model="selectedIncomeType">
        <option value="">所有</option>
        <option value="工资">工资</option>
        <option value="生活费">生活费</option>
        <option value="投资">投资</option>
        <option value="其他">其他</option>
      </select>

      <button @click="filterRecords">筛选</button>
      <button @click="dialogVisible = true">添加交易</button>
    </div>

    <!-- 添加交易对话框 -->
    <div v-if="dialogVisible" class="dialog-overlay">
      <div class="dialog">
        <h3>添加交易</h3>
        <form @submit.prevent="submitTransaction">
          <label for="date">日期:</label>
          <input type="date" v-model="transaction.date" required />

          <label for="type">类型:</label>
          <select v-model="transaction.type" required @change="resetCategory">
            <option value="">选择类型</option>
            <option value="收入">收入</option>
            <option value="支出">支出</option>
          </select>

          <label v-if="transaction.type === '支出'" for="expenseCategory">支出类别:</label>
          <select v-if="transaction.type === '支出'" v-model="transaction.category" required>
            <option value="">选择类别</option>
            <option value="购物">购物</option>
            <option value="餐饮">餐饮</option>
            <option value="生活缴费">生活缴费</option>
            <option value="交通">交通</option>
            <option value="医疗">医疗</option>
            <option value="其他">其他</option>
          </select>

          <label v-if="transaction.type === '收入'" for="incomeCategory">收入类别:</label>
          <select v-if="transaction.type === '收入'" v-model="transaction.category" required>
            <option value="">选择类别</option>
            <option value="工资">工资</option>
            <option value="生活费">生活费</option>
            <option value="投资">投资</option>
            <option value="其他">其他</option>
          </select>

          <label for="amount">金额:</label>
          <input type="number" v-model="transaction.amount" required />

          <label for="note">备注:</label>
          <input type="text" v-model="transaction.note" />

          <button type="submit">添加交易</button>
          <button type="button" @click="dialogVisible = false">取消</button>
        </form>
      </div>
    </div>

    <!-- 交易记录表格 -->
    <table>
      <thead>
        <tr>
          <th>日期</th>
          <th>类型</th>
          <th>类别</th>
          <th>金额</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in records" :key="index">
          <td>{{ record.date }}</td>
          <td>{{ record.type }}</td>
          <td>{{ record.category }}</td>
          <td>{{ record.amount }}</td>
          <td>{{ record.note }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 总金额显示 -->
    <h2>总金额</h2>
    <p>收入总金额: {{ totalIncome }}</p>
    <p>支出总金额: {{ totalExpense }}</p>
    <p>余额: {{ balance }}</p>
  </div>
</template>

<script>
export default {
  name: 'JiLu',
  data() {
    return {
      // 添加交易相关
      dialogVisible: false,
      transaction: {
        date: '',
        type: '',
        category: '',
        amount: null,
        note: ''
      },

      // 记录和过滤相关
      records: [], // 显示的记录
      startDate: '',
      endDate: '',
      selectedCategory: '',
      selectedExpenseType: '',
      selectedIncomeType: '',
      totalIncome: 0,
      totalExpense: 0,
      balance: 0
    };
  },
  methods: {
    // 获取所有记录
    async fetchAllRecords() {
      try {
        const response = await fetch('http://localhost:5000/get_all_records');
        if (!response.ok) {
          throw new Error('网络响应不是正常的');
        }
        const data = await response.json();
        this.records = data;
        this.calculateTotals(data);
      } catch (error) {
        console.error('获取记录失败:', error);
      }
    },

    // 过滤记录
    async filterRecords() {
      try {
        const params = new URLSearchParams();

        if (this.startDate) params.append('start_date', this.startDate);
        if (this.endDate) params.append('end_date', this.endDate);
        if (this.selectedCategory) params.append('category', this.selectedCategory);
        if (this.selectedCategory === '收入' && this.selectedIncomeType) {
          params.append('type', this.selectedIncomeType);
        }
        if (this.selectedCategory === '支出' && this.selectedExpenseType) {
          params.append('type', this.selectedExpenseType);
        }

        const response = await fetch(`http://localhost:5000/api/record/search?${params.toString()}`);
        if (!response.ok) {
          throw new Error('搜索请求失败');
        }
        const data = await response.json();
        this.records = data.records;
        this.totalIncome = data.total_income;
        this.totalExpense = data.total_expense;
        this.balance = data.balance;
      } catch (error) {
        console.error('搜索记录失败:', error);
      }
    },

    // 提交新交易
    async submitTransaction() {
      try {
        const payload = {
          date: this.transaction.date,
          amount: this.transaction.amount,
          category: this.transaction.category,
          note: this.transaction.note,
          type: this.transaction.type
        };

        const response = await fetch('http://localhost:5000/api/record/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
          // 成功添加交易记录，刷新记录列表
          this.dialogVisible = false;
          this.resetTransaction();
          this.fetchAllRecords();
        } else {
          // 处理错误
          alert(result.error || '添加失败');
        }
      } catch (error) {
        console.error('提交交易失败:', error);
        alert('网络错误，请重试');
      }
    },

    // 计算总收入、总支出和余额
    calculateTotals(records) {
      this.totalIncome = records
        .filter(record => record.type === '收入')
        .reduce((sum, record) => sum + record.amount, 0);
      this.totalExpense = records
        .filter(record => record.type === '支出')
        .reduce((sum, record) => sum + record.amount, 0);
      this.balance = this.totalIncome - this.totalExpense;
    },

    // 重置子类别
    resetSubcategory() {
      this.selectedExpenseType = '';
      this.selectedIncomeType = '';
    },

    // 重置类别选择
    resetCategory() {
      this.transaction.category = '';
    },

    // 重置交易表单
    resetTransaction() {
      this.transaction = {
        date: '',
        type: '',
        category: '',
        amount: null,
        note: ''
      };
    }
  },
  mounted() {
    this.fetchAllRecords(); // 组件挂载后获取所有记录
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  width: 100%;
  background-color: #f8f7f4 !important;
}

#app {
  max-width: 800px;
  margin: 20px auto;
  text-align: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.filter {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.filter label {
  margin-right: 5px;
}

.filter input,
.filter select {
  margin-right: 20px;
  padding: 5px;
}

button {
  padding: 5px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.dialog form {
  display: flex;
  flex-direction: column;
}

.dialog label {
  margin-top: 10px;
  text-align: left;
}

.dialog input,
.dialog select {
  padding: 5px;
  margin-top: 5px;
}

.dialog button {
  margin-top: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

h2 {
  margin-top: 20px;
}
</style>
