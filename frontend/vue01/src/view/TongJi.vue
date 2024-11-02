<template>
  <div id="app">
    <h1>收入统计</h1>

    <!-- 过滤器部分 -->
    <div class="filter">
      <label for="startDate">开始日期:</label>
      <input type="date" v-model="startDate" @change="fetchIncomeStatistics" />

      <label for="endDate">结束日期:</label>
      <input type="date" v-model="endDate" @change="fetchIncomeStatistics" />

      <label for="category">收入类别:</label>
      <select v-model="selectedCategory" @change="fetchIncomeStatistics">
        <option value="">所有</option>
        <option value="工资">工资</option>
        <option value="生活费">生活费</option>
        <option value="投资">投资</option>
        <option value="其他">其他</option>
      </select>
    </div>

    <!-- 收入统计结果 -->
    <div class="results">
      <h2>统计结果</h2>
      <p>总收入: {{ totalIncome }} 元</p>
      <p>净收入: {{ netIncome }} 元</p>
    </div>

    <!-- 收入记录表格 -->
    <table>
      <thead>
        <tr>
          <th>日期</th>
          <th>类别</th>
          <th>金额</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in incomeRecords" :key="index">
          <td>{{ record.date }}</td>
          <td>{{ record.category }}</td>
          <td>{{ record.amount }}</td>
          <td>{{ record.note }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 错误信息 -->
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startDate: '',
      endDate: '',
      selectedCategory: '',
      incomeRecords: [],
      totalIncome: 0,
      netIncome: 0,
      error: null
    };
  },
  methods: {
    async fetchIncomeStatistics() {
      this.error = null; // 清空之前的错误信息
      try {
        const params = new URLSearchParams();
        if (this.startDate) params.append('start_date', this.startDate);
        if (this.endDate) params.append('end_date', this.endDate);
        if (this.selectedCategory) params.append('category', this.selectedCategory);

        const response = await fetch(`http://localhost:5000/api/income/search?${params.toString()}`);
        if (!response.ok) {
          throw new Error('无法获取收入统计数据');
        }

        const data = await response.json();
        this.incomeRecords = data.records;
        this.totalIncome = data.total_income;
        this.netIncome = this.totalIncome; // 假设没有支出数据
      } catch (error) {
        this.error = error.message;
        console.error('获取收入统计失败:', error);
      }
    }
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

.results {
  margin-top: 20px;
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

.error {
  color: red;
  margin-top: 10px;
}
</style>
