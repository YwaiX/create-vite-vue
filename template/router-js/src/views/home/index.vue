<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <h1 class="welcome-title">🎉 Vite + Vue 3 基础项目创建完成</h1>
      <p class="welcome-desc">
        这是一个 Vue 3 + JS 版基础项目的欢迎页面示例。
      </p>
      <!-- 新增跳转按钮 -->
      <a class="welcome-btn" href="https://blog.csdn.net/Y_3405230389?type=blog" target="_blank">
        🔍 查看更多文章 →
      </a>
    </div>
  </div>
</template>

<style scoped>
/* 外层容器，全屏居中 */
.welcome-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

/* 卡片样式 */
.welcome-card {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 1s ease;
}

/* 标题 */
.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

/* 描述 */
.welcome-desc {
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #555;
}

/* 新增按钮 */
.welcome-btn {
  display: inline-block;
  padding: 12px 30px;
  font-size: 1.1rem;
  color: white;
  background-color: #4facfe;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.welcome-btn:hover {
  background-color: #00f2fe;
  transform: scale(1.05);
}

/* 标题淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
