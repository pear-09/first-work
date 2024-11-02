<template>
  <div id="app">
    <h1>个人记账本</h1>

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
      </select>

      <label v-if="selectedCategory === '收入'" for="incomeType">收入类别:</label>
      <select v-if="selectedCategory === '收入'" v-model="selectedIncomeType">
        <option value="">所有</option>
        <option value="工资">工资</option>
        <option value="生活费">生活费</option>
      </select>

      <button @click="filterRecords">筛选</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>日期</th>
          <th>收支类别</th>
          <th>收入/支出</th>
          <th>金额</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in records" :key="index">
          <td>{{ record.date }}</td>
          <td>{{ record.category }}</td>
          <td>{{ record.type }}</td>
          <td>{{ record.amount }}</td>
          <td>{{ record.note }}</td>
        </tr>
      </tbody>
    </table>

    <h2>总金额</h2>
    <p>收入总金额: {{ totalIncome }}</p>
    <p>支出总金额: {{ totalExpense }}</p>
    <p>余额: {{ balance }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    resetSubcategory() {
      this.selectedExpenseType = '';
      this.selectedIncomeType = '';
    },
    async filterRecords() {
      try {
        const params = new URLSearchParams();

        if (this.startDate) params.append('start_date', this.startDate);
        if (this.endDate) params.append('end_date', this.endDate);
        if (this.selectedCategory) params.append('category', this.selectedCategory);

        // 直接根据类别添加类型过滤
        if (this.selectedCategory === '收入' && this.selectedIncomeType) {
          params.append('type', this.selectedIncomeType);
        } else if (this.selectedCategory === '支出' && this.selectedExpenseType) {
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
    calculateTotals(records) {
      this.totalIncome = records
        .filter(record => record.type === '收入')
        .reduce((sum, record) => sum + record.amount, 0);
      this.totalExpense = records
        .filter(record => record.type === '支出')
        .reduce((sum, record) => sum + record.amount, 0);
      this.balance = this.totalIncome - this.totalExpense;
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
  margin: 0 auto;
  text-align: center;
  padding: 20px;
}

.filter {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.filter label {
  margin-right: 5px;
}

.filter input,
.filter select {
  margin-right: 20px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
}

th {
  background-color: #f8f8f8;
}

h2 {
  margin-top: 20px;
}
</style>
