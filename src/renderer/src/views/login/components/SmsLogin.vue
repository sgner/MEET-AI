<template>
  <div class="login-panel">
    <div class="form-group">
      <div class="custom-input-wrapper">
        <i class="input-icon">📞</i>
        <input
          v-model="loginForm.phone"
          type="tel"
          placeholder="手机号码"
          class="custom-input"
        />
      </div>
    </div>

    <div class="form-group">
      <div class="custom-input-wrapper code-input-wrapper">
        <i class="input-icon">🔢</i>
        <input
          v-model="loginForm.code"
          type="text"
          placeholder="验证码"
          class="custom-input"
        />
        <button
          type="button"
          class="send-code-btn"
          :disabled="countdown > 0"
          @click="sendVerificationCode"
        >
          {{ countdown > 0 ? `${countdown}秒后重发` : '获取验证码' }}
        </button>
      </div>
    </div>

    <button
      type="button"
      class="submit-btn"
      @click="handleSmsLogin"
    >
      登录
    </button>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

const emit = defineEmits(['login-success']);
const countdown = ref(0);
const loginForm = ref({
  phone: '',
  code: ''
});
let timer = null;

const sendVerificationCode = () => {
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(loginForm.value.phone)) {
    alert('请输入正确的手机号码');
    return;
  }

  // 发送验证码逻辑
  console.log('发送验证码到:', loginForm.value.phone);

  // 开始倒计时
  startCountdown();
};

const startCountdown = () => {
  countdown.value = 60;

  if (timer) {
    clearInterval(timer);
  }

  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const handleSmsLogin = () => {
  // 验证表单
  if (!loginForm.value.phone || !loginForm.value.code) {
    alert('请填写完整信息');
    return;
  }

  // 短信登录逻辑
  console.log('短信登录:', loginForm.value);
  // 模拟登录成功
  setTimeout(() => {
    emit('login-success');
  }, 1000);
};

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.login-panel {
  width: 100%;
}

.login-panel h2 {
  font-size: 18px;
  margin-bottom: 24px;
  color: #333;
  text-align: center;
  font-weight: 600;
}

.form-group {
  position: relative;
  margin-bottom: 24px;
}

.custom-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.code-input-wrapper {
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  font-size: 16px;
  z-index: 1;
}

.custom-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: none;
  border-bottom: 2px solid #e5e7eb;
  border-radius: 0;
  background-color: transparent;
  transition: all 0.3s ease;
  height: 48px;
  font-size: 14px;
  outline: none;
}

/* 验证码输入框特殊样式 */
.code-input-wrapper .custom-input {
  padding-right: 140px;
}

.custom-input:focus {
  border-color: transparent;
}

.form-group::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, rgba(147, 51, 234, 0.9) 0%, rgba(218, 99, 25, 0.9) 100%);
  transition: width 0.3s ease;
  z-index: 1;
}

.form-group:focus-within::after {
  width: 100%;
}

/* 输入框占位符样式 */
.custom-input::placeholder {
  color: #9ca3af;
  font-size: 14px;
}

/* 图标颜色 - 输入框聚焦时改变 */
.form-group:focus-within .input-icon {
  color: rgba(147, 51, 234, 0.9);
}

/* 获取验证码按钮 */
.send-code-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: rgba(147, 51, 234, 0.9);
  font-weight: 500;
  padding: 6px 12px;
  transition: color 0.3s ease;
  border-radius: 6px;
}

.send-code-btn:hover:not(:disabled) {
  color: rgba(147, 51, 234, 1);
  background-color: rgba(147, 51, 234, 0.05);
}

.send-code-btn:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}
.submit-btn {
  width: 100%;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: none;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(232, 116, 20, 0.9) 100%);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.2);
  color: white;
  cursor: pointer;
}

.submit-btn:hover {
  background: linear-gradient(135deg, rgb(85, 51, 234) 0%, rgb(245, 93, 60) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(147, 51, 234, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.2);
}
</style>