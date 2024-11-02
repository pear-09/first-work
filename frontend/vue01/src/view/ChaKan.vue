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

    <div v-if="dialogVisible" class="dialog-overlay">
      <div class="dialog">
        <h3>添加交易</h3>
        <form @submit.prevent="submitTransaction">
          <label for="date">日期:</label>
          <input type="date" v-model="transaction.date" required />

          <label for="amount">金额:</label>
          <input type="number" v-model="transaction.amount" required />

          <label for="category">类别:</label>
          <select v-model="transaction.category" required>
            <option value="收入">收入</option>
            <option value="支出">支出</option>
          </select>

          <label for="expenseType" v-if="transaction.category === '支出'">支出类别:</label>
          <select v-if="transaction.category === '支出'" v-model="transaction.expenseType">
            <option value="购物">购物</option>
            <option value="餐饮">餐饮</option>
            <option value="生活缴费">生活缴费</option>
            <option value="交通">交通</option>
            <option value="医疗">医疗</option>
          </select>

          <label for="incomeType" v-if="transaction.category === '收入'">收入类别:</label>
          <select v-if="transaction.category === '收入'" v-model="transaction.incomeType">
            <option value="工资">工资</option>
            <option value="生活费">生活费</option>
          </select>

          <label for="note">备注:</label>
          <input type="text" v-model="transaction.note" />

          <button type="submit">添加交易</button>
          <button type="button" @click="dialogVisible = false">取消</button>
        </form>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>日期</th>
          <th>收支类别</th>
          <th>收入/支出</th>
          <th>金额</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in filteredRecords" :key="index">
          <td>{{ record.date }}</td>
          <td>{{ record.category }}</td>
          <td>{{ record.type }}</td>
          <td>{{ record.amount }}</td>
        </tr>
      </tbody>
    </table>

    <h2>总金额</h2>
    <p>收入总金额: {{ totalIncome }}</p>
    <p>支出总金额: {{ totalExpense }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      records: [], // 从后端获取的记录
      startDate: '',
      endDate: '',
      selectedCategory: '',
      selectedExpenseType: '',
      selectedIncomeType: '',
      filteredRecords: [],
      dialogVisible: false,
      transaction: {
        date: '',
        amount: '',
        category: '',
        expenseType: '',
        incomeType: '',
        note: ''
      }
    };
  },
  computed: {
    totalIncome() {
      return this.filteredRecords
        .filter(record => record.type === '收入')
        .reduce((sum, record) => sum + record.amount, 0);
    },
    totalExpense() {
      return this.filteredRecords
        .filter(record => record.type === '支出')
        .reduce((sum, record) => sum + record.amount, 0);
    }
  },
  methods: {
    async fetchRecords() {
      try {
        const response = await fetch('http://localhost:5000/api/records');
        if (!response.ok) {
          throw new Error('网络响应不是正常的');
        }
        this.records = await response.json();
        this.filteredRecords = this.records; // 初始化过滤记录
      } catch (error) {
        console.error('获取记录失败:', error);
      }
    },
    resetSubcategory() {
      this.selectedExpenseType = '';
      this.selectedIncomeType = '';
    },
    filterRecords() {
      this.filteredRecords = this.records.filter(record => {
        const isDateInRange = (!this.startDate || record.date >= this.startDate) &&
                              (!this.endDate || record.date <= this.endDate);
        const isCategoryMatch = !this.selectedCategory || record.category === this.selectedCategory;
        const isExpenseMatch = this.selectedCategory === '支出' ? 
                               (!this.selectedExpenseType || record.expenseType === this.selectedExpenseType) : true;
        const isIncomeMatch = this.selectedCategory === '收入' ? 
                              (!this.selectedIncomeType || record.incomeType === this.selectedIncomeType) : true;

        return isDateInRange && isCategoryMatch && isExpenseMatch && isIncomeMatch;
      });
    },
    submitTransaction() {
      // 处理提交交易的逻辑
      // 这里需要将 transaction 对象发送到后端
      this.dialogVisible = false; // 关闭对话框
      // 重新获取记录以更新显示
      this.fetchRecords();
    }
  },
  mounted() {
    this.fetchRecords(); // 组件挂载后获取记录
  }
};
</script >

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
}

.filter {
  margin-bottom: 20px;
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
</style>
