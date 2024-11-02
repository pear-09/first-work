<template>
  <div class="discover-container">
    <div class="sidebar">
      <div class="rounded-rectangle">
        <!-- 创业 -->
        <div class="setup">
          <button type="button" class="button" @click="toggleSubcategory('创业')" 
          :style="{backgroundColor:isClicked?'#f3e7b0':'#f8dd8b'}"
          >创业</button>
          <div class="content" v-if="expandedCategory === '创业'">
            <a href="#" @click.prevent="selectSubcategory('科技创业')">科技创业</a>
            <a href="#" @click.prevent="selectSubcategory('文化创业')">文化创业</a>
            <a href="#" @click.prevent="selectSubcategory('农业创业')">农业创业</a>
            <a href="#" @click.prevent="selectSubcategory('服务创业')">服务创业</a>
          </div>
        </div>

        <!-- 竞赛 -->
        <div class="competition">
          <button type="button" class="button" @click="toggleSubcategory('竞赛')" :style="{backgroundColor:isClicked?'#f3e7b0':'#f8dd8b'}">竞赛</button>
          <div class="content" v-if="expandedCategory === '竞赛'">
            <a href="#" @click.prevent="selectSubcategory('学科技术类')">学科技术类</a>
            <a href="#" @click.prevent="selectSubcategory('创新创业类')">创新创业类</a>
            <a href="#" @click.prevent="selectSubcategory('文化艺术类')">文化艺术类</a>
            <a href="#" @click.prevent="selectSubcategory('服务外包类')">服务外包类</a>
          </div>
        </div>

        <!-- 学术科研 -->
        <div class="academic">
          <button type="button" class="button" @click="toggleSubcategory('学术科研')" :style="{backgroundColor:isClicked?'#f3e7b0':'#f8dd8b'}">学术科研</button>
          <div class="content" v-if="expandedCategory === '学术科研'">
            <a href="#" @click.prevent="selectSubcategory('自然科学')">自然科学</a>
            <a href="#" @click.prevent="selectSubcategory('工程技术')">工程技术</a>
            <a href="#" @click.prevent="selectSubcategory('医学科学')">医学科学</a>
            <a href="#" @click.prevent="selectSubcategory('人文社会科学')">人文社会科学</a>
          </div>
        </div>
      </div>
    </div>

    <div class="projects">
      <h2>项目列表 - {{ selectedSubcategory }}</h2>
      <ul>
  <li v-for="project in filteredProjects" :key="project.id"  @click="goToProjectDetail(project.id)" class="project-card">
    <h3>{{ project.title }}</h3>
    <p>{{ project.content }}</p> <!-- 修改为显示内容 -->
  </li>
</ul>

    </div>
  </div>
</template>

<script>
export default {
  name: 'FaXian',
  data() {
    return {
      expandedCategory: null,
      selectedSubcategory: null,
      projects: [],
      isClicked:true,
    };
  },
  computed: {
    filteredProjects() {
      return this.projects.filter(project => project.subcategory === this.selectedSubcategory);
    }
  },
  methods: {
    toggleSubcategory(category) {
      this.expandedCategory = this.expandedCategory === category ? null : category;
      this.isClicked = !this.isClicked; // 切换状态

    },
    selectSubcategory(subcategory) {
      this.selectedSubcategory = subcategory;
      this.loadProjects();
    },
    async loadProjects() {
      const response = await fetch(`http://localhost:3000/projects?subcategory=${this.selectedSubcategory}`);
      this.projects = await response.json();
    },
    goToProject(id) {
      this.$router.push(`/project/${id}`);
    },
    goToProjectDetail(id) {
      this.$router.push({ name: 'ProgramDetail', params: { id }, query: { source: 'wofabu' } });
    },
  },
  mounted() {
    this.loadProjects();
  }
};
</script>
  
  <style scoped>
  .discover-container {
    display: flex;
    margin-top: 20px;
   /* 页面背景色 */
  }
  
  .sidebar {
    width: 260px;
    height: 100%; /* 自适应高度 */
    background-color: transparent !important; /* 侧边栏背景色 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 侧边栏阴影 */
    border-radius: 10px; /* 边框圆角 */
    padding: 20px; /* 增加内边距 */
  }
  

  
  .projects {
    width: 78%;
    /* flex-grow: 1; */
    padding-left: 20px;
  }
  
  .button {
    background-color: #f3e7b0; /* 按钮背景色 */
    color:#333;/* 按钮文字颜色 */
    width: 100%; /* 按钮宽度 */
    height: 50px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    margin-bottom: 15px; /* 增加按钮之间的间距 */
    border-radius: 5px; /* 按钮圆角 */
    transition: background-color 0.3s; /* 按钮背景色过渡 */
  }
  
  .button:hover {
    background-color: #f8dd8b !important; /* 按钮悬停背景色 */
  }


  .content {
    display: block;
    transform: translateY(-15px);
    background-color: #faf8d4 !important;
  }
  
  .project-card {
    border: 1px solid #ddd; /* 项目卡片边框 */
    border-radius: 8px; /* 项目卡片圆角 */
    padding: 15px;
    margin-bottom: 15px;
    background-color: #fff; /* 项目卡片背景色 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 项目卡片阴影 */
    cursor: pointer;
    transition: transform 0.2s; /* 卡片过渡效果 */
  }
  
  .project-card:hover {
    transform: translateY(-2px); /* 悬停效果 */
  }
  
  .content a {
    text-indent: 1em;
    padding: 10px;
    text-decoration: none;
    display: block;
    font-size: 16px;
    font-weight: 400;
    color: #333; /* 链接颜色 */
  }
  
  .content a:hover {
    background-color: #f5d470;
  }
  .projects h2 {
    margin-bottom: 20px;
  }
  .projects ul li h3{
    margin-bottom: 10px;
  } 
  .projects ul li p{
    height: 50px;
    overflow: hidden;
    text-indent: 2em;
    display: -webkit-box; /* 需要使用盒子模型 */
    -webkit-box-orient: vertical; /* 垂直排列 */
    -webkit-line-clamp: 2; /* 设置显示的行数，这里为 2 行 */
    text-overflow: ellipsis; /* 加上省略号 */
    font-size: 16px;
    line-height: 28px;
  }

  </style>
  