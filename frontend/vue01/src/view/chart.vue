<template>
  <div>
    <bar-chart :chart-data="chartData" :options="chartOptions"></bar-chart>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  extends: Bar,
  data() {
    return {
      chartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Income',
            backgroundColor: '#42A5F5',
            data: [200, 300, 250, 400, 150, 300, 200]
          },
          {
            label: 'Expenses',
            backgroundColor: '#66BB6A',
            data: [100, 150, 200, 250, 100, 150, 100]
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions)
  }
}
</script>
