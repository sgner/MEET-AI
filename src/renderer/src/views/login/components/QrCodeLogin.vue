<template>
  <div class="login-panel">
    <h2>扫码登录</h2>
    <div class="qr-code-container">
      <div class="qr-code-box">
        <img src="https://picsum.photos/id/65/200/200" alt="登录二维码" />
        <div class="qr-code-refresh" @click="refreshQrCode">
          <el-icon><Refresh /></el-icon>
        </div>
      </div>
      <p class="qr-code-tip">请使用MEET-AI APP扫描二维码登录</p>
    </div>
    
    <div class="qr-code-timer">
      二维码有效期：{{ countdown }}秒
    </div>
    
    <div class="login-other-options">
      <a href="#" class="download-app">下载MEET-AI APP</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Refresh } from '@element-plus/icons-vue';

const emit = defineEmits(['login-success']);
const countdown = ref(60);
let timer = null;

const startCountdown = () => {
  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      refreshQrCode();
    }
  }, 1000);
};

const refreshQrCode = () => {
  // 刷新二维码逻辑
  console.log('刷新二维码');
  // 模拟二维码刷新
  startCountdown();
};

// 模拟登录状态检查
const checkLoginStatus = () => {
  // 实际项目中应该有真实的登录状态检查逻辑
  const randomCheck = Math.random();
  if (randomCheck > 0.95) {
    clearInterval(timer);
    emit('login-success');
  }
};

onMounted(() => {
  startCountdown();
  // 定时检查登录状态
  const statusTimer = setInterval(checkLoginStatus, 2000);
  
  return () => clearInterval(statusTimer);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.login-panel {
  width: 100%;
  text-align: center;
}

.login-panel h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.qr-code-box {
  position: relative;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.qr-code-box img {
  width: 200px;
  height: 200px;
  border-radius: 4px;
}

.qr-code-refresh {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.qr-code-refresh:hover {
  background-color: white;
  color: rgba(147, 51, 234, 0.9);
  transform: rotate(90deg);
}

.qr-code-tip {
  color: #666;
  font-size: 14px;
}

.qr-code-timer {
  color: #999;
  font-size: 12px;
  margin-bottom: 20px;
}

.login-other-options {
  margin-top: 20px;
}

.download-app {
  color: rgba(147, 51, 234, 0.9);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.download-app:hover {
  color: rgba(147, 51, 234, 1);
  text-decoration: underline;
}
</style>