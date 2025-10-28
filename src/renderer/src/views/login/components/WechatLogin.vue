<template>
  <div class="login-panel">
    <h2>微信登录</h2>
    <div class="wechat-qrcode">
      <img src="https://picsum.photos/id/64/200/200" alt="微信登录二维码" />
      <p class="qrcode-tip">请使用微信扫描二维码登录</p>
    </div>

    <div class="wechat-alternative">
      <el-button
        class="wechat-btn"
        @click="handleWechatLogin"
        :icon="Wechat"
      >
        微信一键登录
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElButton } from 'element-plus';

const emit = defineEmits(['login-success']);
const qrcodeExpired = ref(false);

// 模拟二维码过期检查
onMounted(() => {
  const timer = setInterval(() => {
    // 实际项目中应该有真实的二维码过期检测逻辑
    console.log('检查二维码状态...');
  }, 5000);

  return () => clearInterval(timer);
});

const handleWechatLogin = () => {
  // 微信一键登录逻辑
  console.log('微信一键登录');
  // 模拟登录成功
  setTimeout(() => {
    emit('login-success');
  }, 1000);
};
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

.wechat-qrcode {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.wechat-qrcode img {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qrcode-tip {
  color: #666;
  font-size: 14px;
}

.wechat-alternative {
  margin-top: 20px;
}

.wechat-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #07C160;
  border-color: #07C160;
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.wechat-btn:hover {
  background-color: #06AD56;
  border-color: #06AD56;
}
</style>