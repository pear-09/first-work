<template>
  <div id="app">
    <h1>收入统计</h1>
    <div class="filter">
      <label for="startDate">开始日期:</label>
      <input type="date" v-model="startDate" />

      <label for="endDate">结束日期:</label>
      <input type="date" v-model="endDate" />

      <label for="filter-category">按类别筛选:</label>
      <select v-model="filters.category" id="filter-category">
        <option value="">全部</option>
        <option value="工资">工资</option>
        <option value="生活费">生活费</option>
        <!-- 添加更多类别 -->
      </select>

      <button class="btn" @click="fetchIncomeStatistics">统计</button>
    </div>
    
    <div class="results">
      <p><strong>总收入:</strong> {{ statistics.total_income }} 元</p>
      <p><strong>净收入:</strong> {{ statistics.balance }} 元</p>
    </div>
    
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startDate: '', // 开始日期
      endDate: '', // 结束日期
      filters: {
        category: '', // 选择的类别
      },
      statistics: { total_income: 0, balance: 0 }, // 统计结果
      error: null // 错误信息
    };
  },
  methods: {
    async fetchIncomeStatistics() {
      this.error = null; // 清空之前的错误信息
      try {
        const response = await fetch(`/api/record/search?start_date=${this.startDate}&end_date=${this.endDate}&category=${this.filters.category}`);
        
        if (!response.ok) {
          throw new Error('无法获取统计数据');
        }

        const data = await response.json();
        // 只更新收入统计
        this.statistics.total_income = data.total_income;
        this.statistics.balance = data.balance; // 净收入等于总收入，假设没有支出数据
      } catch (err) {
        this.error = err.message; // 捕获错误信息
      }
    }
  }
};
</script>

<style>
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
}

.filter label {
  margin-right: 10px;
}

input[type="date"], select {
  margin-right: 10px;
}

.btn {
  background-color: #4CAF50; /* 按钮颜色 */
  color: white;
  border: none;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}

.results {
  margin-top: 20px;
  font-weight: bold;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
