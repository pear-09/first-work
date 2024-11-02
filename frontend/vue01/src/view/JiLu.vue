<template>
  <div class="transaction-list">
    <h2>交易记录</h2>
    <button @click="dialogVisible = true">添加交易</button>

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
            <option value="饮食">饮食</option>
            <option value="交通">交通</option>
            <option value="工资">工资</option>
            <option value="其他">其他</option>
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
          <th>金额</th>
          <th>类别</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in recentTransactions" :key="index">
          <td>{{ item.date }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.note }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'JiLu',
  data() {
    return {
      dialogVisible: false,
      transaction: {
        date: '',
        amount: null,
        category: '饮食',
        note: ''
      },
      recentTransactions: [] // 存储最近的交易记录
    };
  },
  methods: {
    async submitTransaction() {
      // 将新交易记录添加到最近记录中
      const newTransaction = { ...this.transaction };

      // 发送请求到后端
      try {
        const response = await fetch('api/record/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTransaction)
        });

        const result = await response.json();

        if (response.ok) {
          // 成功添加交易记录，更新最近交易记录
          this.recentTransactions.push(newTransaction);
          this.dialogVisible = false;
          this.transaction = { date: '', amount: null, category: '饮食', note: '' };
        } else {
          // 处理错误
          alert(result.error || '添加失败');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('网络错误，请重试');
      }
    }
  }
};
</script>

<style scoped>
.transaction-list {
  max-width: 600px;
  margin: auto;
}

button {
  margin-top: 10px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
