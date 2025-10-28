<template>
            <div class="email-login">
              <div class="form-group">
                <div class="custom-input-wrapper">
                  <span class="input-icon">📧</span>
                  <input
                    v-model="loginForm.account"
                    type="email"
                    placeholder="账号"
                    class="custom-input"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="custom-input-wrapper">
                  <span class="input-icon">🔒</span>
                  <input
                    v-model="loginForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="密码"
                    class="custom-input"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="togglePasswordVisibility"
                  >
                    {{ showPassword ? '🙈' : '👁️' }}
                  </button>
                </div>
              </div>

              <div class="form-options">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    v-model="loginForm.rememberMe"
                    class="custom-checkbox"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" class="forgot-password">Forgot password</a>
              </div>

              <button
                type="button"
                class="submit-btn"
                @click="handleLoginSubmit"
              >
                登录
              </button>

              <div class="register-link">
                <span>Don't have an account? </span>
                <a href="#">Sign up</a>
              </div>
            </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['login-success']);
const showPassword = ref(false);
const loginForm = ref({
  account: '',
  password: '',
  rememberMe: false
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLoginSubmit = () => {
  console.log('账号密码登录:', loginForm.value);
  emit('login-success');
};
</script>

<style scoped>
.email-login {
  width: 100%;
}

.form-group {
  position: relative;
  margin-bottom: 24px;
}

.custom-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #e5e7eb;
  border-radius: 0;
  background-color: transparent;
  transition: all 0.3s ease;
  height: 48px;
}

.custom-input:focus {
  border-color: transparent;
  box-shadow: none;
}

/* 输入框包装器样式 */
.custom-input-wrapper {
  position: relative;
  width: 100%;
}

/* 图标样式 */
.input-icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
  transition: color 0.3s ease;
  z-index: 1;
}

.custom-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #e5e7eb;
  border-radius: 0;
  background-color: transparent;
  transition: all 0.3s ease;
  height: 48px;
  padding-left: 32px;
  font-size: 14px;
  color: #333;
}

.custom-input:focus {
  outline: none;
  border-color: transparent;
}

.custom-input-wrapper:focus-within .input-icon {
  color: rgba(147, 51, 234, 0.9);
}

.form-group::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, rgba(147, 51, 234, 0.9) 0%, rgba(243, 111, 16, 0.9) 100%);
  transition: width 0.3s ease;
  z-index: 1;
}

.form-group:focus-within::after {
  width: 100%;
}

.custom-input::placeholder {
  color: #9ca3af;
  font-size: 14px;
}

.password-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 8px;
  color: #9ca3af;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: rgba(147, 51, 234, 0.9);
}

/* 复选框样式 */
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.custom-checkbox {
  margin-right: 8px;
  accent-color: rgba(147, 51, 234, 0.9);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
}

.forgot-password {
  color: rgba(147, 51, 234, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.forgot-password:hover {
  color: rgba(147, 51, 234, 1);
  text-decoration: underline;
  transform: translateY(-1px);
}

.submit-btn {
  color: white;
  width: 100%;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(232, 116, 20, 0.9) 100%);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.2);
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

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: rgba(147, 51, 234, 0.9);
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: rgba(147, 51, 234, 1);
  text-decoration: underline;
}

</style>