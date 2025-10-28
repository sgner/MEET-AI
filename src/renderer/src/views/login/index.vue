<script setup>
import WinOp from "../../components/WinOp.vue";
import { ref, onMounted, watch } from "vue";
import { useUserInfoStore } from "../../store/UserInfo.js";
import { ElButton, ElInput, ElCheckbox } from 'element-plus';
import { ArrowRight} from '@element-plus/icons-vue';
import PasswordLogin from './components/PasswordLogin.vue';
import WechatLogin from './components/WechatLogin.vue';
import QrCodeLogin from './components/QrCodeLogin.vue';
import SmsLogin from './components/SmsLogin.vue';
import CustomCarousel from './components/CustomCarousel.vue';

const userInfoStore = useUserInfoStore();
const hasUserInfo = ref(false);
const isLoginView = ref(false);
const showPassword = ref(false);
const animationComplete = ref(false);
const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
});
const platform = ref('password');
const isRegisterMode = ref(false);

// 处理注册模式切换
const handleRegisterModeChange = (mode) => {
  isRegisterMode.value = mode;
};
const getHtmlUrl = (relativePath) => {
  // 由于我们在 Vue 组件中，需要找到 htmls 目录相对于当前文件的正确路径
  return new URL(`./htmls/${relativePath}`, import.meta.url).href;
};
const carouselItems = ref([
  {
    type: 'html',
    src: getHtmlUrl('video-chat.html'),
    title: '与AI对话',
    description: '把你的需求都告诉AI助手吧',
    backgroundType: 'FIRST_SLIDE',
    backgroundOptions: {
      color: 0x2D3748, // 深灰色
      color2: 0xF59E0B, // 金黄色
      color3: 0x4B5563, // 中灰色
      color4: 0x0EA5E9  // 蓝色
    },
    imageUrl: ''
  },
  {
    type: 'html',
    src: getHtmlUrl('ai-tools.html'),
    title: '使用AI工具',
    description: 'AI工具助你进一步提升工作效率',
    backgroundType: 'SECOND_SLIDE',
    backgroundOptions: {
      color: 0x6366F1, // 靛蓝色
      color2: 0xEC4899, // 粉红色
      color3: 0x3B82F6, // 蓝色
      color4: 0xF97316  // 橙色
    },
    imageUrl: ''
  },
  {
    type: 'html',
    src: getHtmlUrl('ai-chat.html'),
    title: '与AI视频交流',
    description: '新奇的交流方式与AI进行无碍交流',
    backgroundType: 'THIRD_SLIDE',
    backgroundOptions: {
      color: 0x2563EB, // 蓝色
      color2: 0xFBBF24, // 黄色
      color3: 0x0EA5E9, // 浅蓝色
      color4: 0x1E293B  // 深蓝色
    },
    imageUrl: ''
  }
]);
onMounted(() => {
  hasUserInfo.value = Object.keys(userInfoStore.userInfo).length > 0;
});

const handleLoginClick = () => {
  isLoginView.value = true;
  // 调整动画时序，让烟雾动画先开始，然后显示登录表单和轮播图
  setTimeout(() => {
    animationComplete.value = true;
  }, 2800); // 延长到烟雾动画结束后再显示轮播图
};

watch(isLoginView, (newValue) => {
  console.log('isLoginView changed:', newValue);
  if (newValue) {
    setTimeout(() => {
      animationComplete.value = true;
    }, 600);
  }
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};


const handleLoginSubmit = () => {

  console.log('登录信息:', loginForm.value);

  // userInfoStore.setUserInfo({...});
};

const handleSocialLogin = (currentPlatform) => {
  console.log(`${platform} 登录`);
  platform.value = currentPlatform;
};

const handleCarouselChange = (currentIndex) => {
  console.log(`Carousel changed to index: ${currentIndex}`);

  // 获取当前轮播项
  const currentItem = carouselItems.value[currentIndex];
  if (!currentItem) return;

  // 获取所有的carousel-item元素
  const carouselItemsElements = document.querySelectorAll('.carousel-item');
  if (!carouselItemsElements.length) return;

  // 为当前活动的轮播项添加过渡效果类
  const activeItem = carouselItemsElements[currentIndex];
  if (activeItem) {
    // 先移除所有可能的展开类，避免冲突
    const expandClasses = ['expand-from-corner', 'expand-from-top-left', 'expand-from-top-right', 'expand-from-bottom-left', 'expand-from-bottom-right'];
    activeItem.classList.remove(...expandClasses);

    // 随机选择一个角落进行展开
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    const randomCorner = corners[Math.floor(Math.random() * corners.length)];
    activeItem.classList.add(`expand-from-${randomCorner}`);

    // 根据不同的背景类型添加不同的动态效果
    if (currentItem.backgroundType === 'WAVES') {
      activeItem.classList.add('transition-waveRipple');
    } else if (currentItem.backgroundType === 'NET') {
      activeItem.classList.add('transition-netExpand');
    } else if (currentItem.backgroundType === 'DOTS') {
      activeItem.classList.add('transition-dotsScatter');
    } else if (currentItem.backgroundType === 'FIRST_SLIDE') {
      activeItem.classList.add('transition-pattern1');
    } else if (currentItem.backgroundType === 'SECOND_SLIDE') {
      activeItem.classList.add('transition-pattern2');
    } else if (currentItem.backgroundType === 'THIRD_SLIDE') {
      activeItem.classList.add('transition-pattern3');
    }

    // 动画完成后移除过渡类
    setTimeout(() => {
      activeItem.classList.remove(
        `expand-from-${randomCorner}`,
        'transition-waveRipple',
        'transition-netExpand',
        'transition-dotsScatter',
        'transition-pattern1',
        'transition-pattern2',
        'transition-pattern3'
      );
    }, 1500);
  }
};
</script>

<template>

  <div class="login-container" :class="{ 'login-view': isLoginView }">
    <div class="login-main">
      <div class="title drag"></div>
      <div class="fullscreen-bg" v-if="!isLoginView"></div>
      <div class="login-left">
        <div class="cloud-shape" :class="{ 'cloud-transformed': isLoginView }">
          <div class="third-layer"></div>
          <div class="fourth-layer"></div>
        </div>
        <div class="welcome-content" v-if="!isLoginView">
          <h1>欢迎使用</h1>
          <p>为了体验我们先进的功能请登录你的账户</p>
          <div>
            <el-button
              class="sign-in-btn"
              @click="handleLoginClick"
            >
              立即登录
              <el-icon style="margin-left: 5px;">
                <ArrowRight />
              </el-icon>
            </el-button>
          </div>
        </div>

        <div class="login-form" v-else>
          <div class="app-icon">
            <el-image style="width: 25px; height: 25px" src="../../src/assets/img/meet.png"></el-image>
            <span>遇见</span>
          </div>
          <SmsLogin v-if="platform === 'sms' && !isRegisterMode"></SmsLogin>
          <WechatLogin v-if="platform === 'wechat' && !isRegisterMode"></WechatLogin>
          <QrCodeLogin v-if="platform === 'qrcode' && !isRegisterMode"></QrCodeLogin>
          <div class="divider" v-if="platform!=='password' && !isRegisterMode">
            <span>或者</span>
          </div>
          <h2 v-if="!isRegisterMode">使用以下方式进行登录</h2>
          <div class="social-login" v-if="!isRegisterMode">
            <el-button
              @click="handleSocialLogin('wechat')"
              class="social-login-btn"
              :text="true"
              v-if="platform!=='wechat'"
            >
              <div class="btn-content">
                <svg
                  style="fill: currentColor; overflow: hidden; width: 1.5em; height: 1.5em;"
                  aria-hidden="true"
                >
                  <use :xlink:href="`#icon-weixin`"></use>
                </svg>
                <span>微信登录</span>
              </div>
            </el-button>
            <el-button
              @click="handleSocialLogin('sms')"
              class="social-login-btn"
              :text="true"
              v-if="platform!=='sms'"
            >
              <div class="btn-content">
                <svg
                  style="fill: currentColor; overflow: hidden; width: 1.5em; height: 1.5em;"
                  aria-hidden="true"
                >
                  <use :xlink:href="`#icon-duanxin`"></use>
                </svg>
                <span>短信登录</span>
              </div>
            </el-button>
            <el-button
              @click="handleSocialLogin('password')"
              class="social-login-btn"
              :text="true"
              v-if="platform!=='password'"
            >
              <div class="btn-content">
                <svg
                  style="fill: currentColor; overflow: hidden; width: 1.5em; height: 1.5em;"
                  aria-hidden="true"
                >
                  <use :xlink:href="`#icon-zhanghuxinxi`"></use>
                </svg>
                <span>账号密码</span>
              </div>
            </el-button>
            <el-button
              @click="handleSocialLogin('qrcode')"
              class="social-login-btn"
              :text="true"
              v-if="platform!=='qrcode'"
            >
              <div class="btn-content">
                <svg
                  style="fill: currentColor; overflow: hidden; width: 1.5em; height: 1.5em;"
                  aria-hidden="true"
                >
                  <use :xlink:href="`#icon-erweima`"></use>
                </svg>
                <span>扫码登录</span>
              </div>
            </el-button>
          </div>
          <div v-if="platform === 'password'">
            <div class="divider" v-if="!isRegisterMode">
              <span>或者</span>
            </div>
            <PasswordLogin
              :is-register-mode="isRegisterMode"
              @register-mode-change="handleRegisterModeChange"
            ></PasswordLogin>
          </div>
        </div>
      </div>
      <div class="login-right" :class="{ 'login-right-visible': isLoginView }">
        <div v-if="animationComplete" class="right-carousel">
          <CustomCarousel
            :items="carouselItems"
            height="100vh"
            :autoplay="true"
            :interval="5000"
            :show-indicators="true"
            @change="handleCarouselChange"
          />
        </div>
      </div>
    </div>
  </div>
  <WinOp :show-max="false" :close-type="0"/>
</template>

<style scoped lang="scss">
.app-icon{
  display: flex;
  align-items: center;
  justify-content: left;
  margin-bottom: 40px;
  padding: 10px;
  margin-left: -25px;
  transition: all 0.3s ease;
}

.app-icon span {
  margin-left: 5px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(147, 51, 234, 0.9);
}
.login-plat{
  font-size: 5px;
}
.title{
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  height: 29px;
  padding:5px 0 0 10px;
}
.login-container {
  border-radius: 10px;
  border: 1px solid #000000;
  height: 100vh;
  background-color: #fff;
  overflow: hidden;
  position: relative;
}

.login-container.login-view {
  //background-image: url('../../assets/img/texture.svg');
  background-size: 200px 200px;
}
.fullscreen-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 67%;
  height: 100%;
  background-image: url('../../assets/img/loginbg.png');
  background-size: cover;
  background-position: center;
  z-index: 0;
  transition: all 1.2s cubic-bezier(0.25, 0.1, 0.25, 1);
  mask-image: linear-gradient(to left, black 74%, transparent 100%);
  -webkit-mask-image: linear-gradient(to left, black 75%, transparent 100%);
}

.login-main.login-view .fullscreen-bg {
  transform: translateX(150%);
  opacity: 0;
  transition: all 1.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.login-main {
  display: flex;
  height: 100vh;
  transition: all 1s cubic-bezier(0.25, 0.1, 0.25, 1);
  position: relative;
  z-index: 1;
}

.login-main.login-view {
  transform: translateX(0);
}

.login-left {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  padding: 0 40px;
  overflow: hidden;
}

.login-right {
  flex: 1.5;
  background: linear-gradient(135deg, #a58dff 0%, #ee6a58 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s;
  height: 100vh;
}

.cloud-shape {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: all 1.2s ease-out;
  overflow: hidden;
}

.cloud-shape::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 70% center, rgba(227,43,131,0.3) 0%, rgba(232, 89, 158, 0.5) 60%, rgba(224, 140, 179, 0.4) 90%);
  border-radius: 0 50% 50% 0 / 0 30% 30% 0;
  -webkit-backdrop-filter: blur(10px);
  animation: smokePulse 4s ease-in-out infinite;
}

.cloud-shape::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 75% center, rgba(227,43,131,0.3) 0%, rgba(232, 89, 158, 0.4) 60%, rgba(224, 140, 179, 0.4) 90%);
  border-radius: 0 40% 60% 0 / 0 40% 40% 0;
  -webkit-backdrop-filter: blur(8px);
  animation: smokePulse 7s ease-in-out infinite 1s;
}

.cloud-shape .third-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 80% center,  rgba(227,43,131,0.3) 0%, rgba(232, 89, 158, 0.3) 60%, rgba(224, 140, 179, 0.5) 90%);
  border-radius: 0 60% 40% 0 / 0 35% 35% 0;
  -webkit-backdrop-filter: blur(6px);
  animation: smokePulse 5s ease-in-out infinite 2s;
}

.cloud-shape .fourth-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 85% center, rgba(227,43,131,0.3) 0%, rgba(232, 89, 158, 0.2) 60%, rgba(224, 140, 179, 0.15) 90%);
  border-radius: 0 70% 30% 0 / 0 40% 40% 0;
  -webkit-backdrop-filter: blur(4px);
  animation: smokePulse 7s ease-in-out infinite 3s;
}

@keyframes smokePulse {
  0% {
    transform: scale(1) translateX(0) translateY(0);
    opacity: 0.9;
  }
  25% {
    transform: scale(1.01) translateX(-2px) translateY(1px);
    opacity: 0.85;
  }
  50% {
    transform: scale(1.025) translateX(0) translateY(-1px);
    opacity: 0.8;
  }
  75% {
    transform: scale(1.015) translateX(1px) translateY(0);
    opacity: 0.85;
  }
  100% {
    transform: scale(1) translateX(0) translateY(0);
    opacity: 0.9;
  }
}

@keyframes smokeMoveAndFade {
  0% {
    transform: translateX(0) scale(1);
    opacity: 0.9;
  }
  20% {
    transform: translateX(20%) scale(0.98);
    opacity: 0.8;
  }
  40% {
    transform: translateX(50%) scale(0.95);
    opacity: 0.7;
  }
  60% {
    transform: translateX(75%) scale(0.9);
    opacity: 0.5;
  }
  80% {
    transform: translateX(90%) scale(0.85);
    opacity: 0.3;
  }
  100% {
    transform: translateX(100%) scale(0.8);
    opacity: 0;
  }
}

.cloud-shape.cloud-transformed {
  transform: translateX(100%);
  opacity: 0;
  transition: all 3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cloud-shape.cloud-transformed::before {
  background: radial-gradient(ellipse at 70% center, rgba(147, 51, 234, 0.7) 0%, rgba(168, 85, 247, 0.5) 60%, rgba(192, 132, 252, 0.2) 90%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: smokeMoveAndFade 1.8s cubic-bezier(0, 0, 0.58, 1) 0.1s forwards;
}

.cloud-shape.cloud-transformed::after {
  background: radial-gradient(ellipse at 75% center, rgba(147, 51, 234, 0.6) 0%, rgba(168, 85, 247, 0.4) 60%, rgba(192, 132, 252, 0.2) 90%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: smokeMoveAndFade 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.15s forwards;
}

.cloud-shape.cloud-transformed .third-layer {
  background: radial-gradient(ellipse at 80% center, rgba(147, 51, 234, 0.5) 0%, rgba(168, 85, 247, 0.3) 60%, rgba(192, 132, 252, 0.15) 90%);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: smokeMoveAndFade 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.2s forwards;
}

.cloud-shape.cloud-transformed .fourth-layer {
  background: radial-gradient(ellipse at 85% center, rgba(147, 51, 234, 0.4) 0%, rgba(168, 85, 247, 0.2) 60%, rgba(192, 132, 252, 0.1) 90%);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: smokeMoveAndFade 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.25s forwards;
}

/* 左侧走马灯样式 */
.left-carousel {
  position: absolute;
  width: 60%;
  height: 40%;
  bottom: 10%;
  left: 20%;
  opacity: 0;
  animation: fadeIn 0.5s ease-out 0.2s forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes carouselFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.carousel-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.carousel-content img {
  max-width: 100%;
  max-height: 80%;
  border-radius: 8px;
}

.carousel-content p {
  margin-top: 10px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

/* 欢迎界面内容 */
.welcome-content {
  text-align: center;
  color: #333;
  max-width: 300px;
}

.welcome-content h1 {
  font-size: 36px;
  margin-bottom: 20px;
  color: #333;
}

.welcome-content p {
  font-size: 16px;
  margin-bottom: 30px;
  color: #666;
  line-height: 1.6;
}

.sign-in-btn {
  background-color: rgba(229, 78, 139, 0.7);
  border: none;
  color: white;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sign-in-btn:hover {
  background-color: rgb(232, 57, 128);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(117, 60, 88, 0.3);
}

/* 登录表单样式 */
.login-form {
  background: transparent;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
  opacity: 0;
  transform: translateY(30px);
  animation: slideUp 0.6s ease-out forwards;
  animation-delay: 0.3s;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-form h2 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-weight: 600;
}

.social-login {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.social-login-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 8px;
  transition: all 0.3s ease;
}

.social-login-btn .btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.social-login-btn .btn-content span {
  margin-top: 8px;
  font-size: 10px;
  font-weight: bold;
}

.social-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.social-btn.facebook {
  background-color: #4267B2;
  border-color: #4267B2;
  color: white;
}

.social-btn.facebook:hover {
  background-color: #365899;
  border-color: #365899;
}

.social-btn.twitter {
  background-color: #1DA1F2;
  border-color: #1DA1F2;
  color: white;
}

.social-btn.twitter:hover {
  background-color: #0d95e8;
  border-color: #0d95e8;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: white;
  padding: 0 10px;
  color: #666;
  font-size: 14px;
}

.login-right.login-right-visible {
  opacity: 1;
  transform: translateX(0);
}

.right-carousel {
  width: 100%;
  height: 100%;
  opacity: 0;
  animation: carouselFadeIn 1s ease-out 0.2s forwards;
  position: relative;
  overflow: hidden;
  border-radius: 0 10px 10px 0;
}

/* 自定义轮播图样式 */
.carousel-item {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  backface-visibility: hidden;
}

.carousel-html-container,
.carousel-image-container,
.carousel-text {
  position: relative;
  z-index: 1;
}

.carousel-content {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.carousel-html-container {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
}

.carousel-iframe {
  width: 100%;
  height: 100%;
  border: none;
  transform-origin: top left;
  overflow: hidden;
}

/* 图片内容样式 */
.carousel-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-content img,
.carousel-image {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  object-fit: contain;
}

.carousel-text {
  color: white;
  padding: 0 20px;
}

.carousel-text h3 {
  font-size: 28px;
  margin-bottom: 15px;
  font-weight: 700;
}

.carousel-text p {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 从角落展开的样式 */
.carousel-item.expand-from-corner {
  animation: expandFromCorner 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* 随机角落展开的辅助类 - 通过JS动态添加到不同元素上 */
.carousel-item.expand-from-top-left {
  animation: expandFromTopLeft 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.carousel-item.expand-from-top-right {
  animation: expandFromTopRight 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.carousel-item.expand-from-bottom-left {
  animation: expandFromBottomLeft 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.carousel-item.expand-from-bottom-right {
  animation: expandFromBottomRight 0.8s cubic-bezier(0.25, 0.1, 0.25, 1);
}

@keyframes expandFromCorner {
  0% {
    clip-path: circle(0% at 0% 0%);
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    clip-path: circle(150% at 50% 50%);
    transform: scale(1);
    opacity: 1;
  }
}

/* 波浪涟漪效果 - 轻微缩放并添加径向渐变叠加 */
.carousel-item.transition-waveRipple {
  transform: scale(1.05);
  filter: blur(0.5px);
  animation: waveRipple 0.8s ease-out;
}

@keyframes waveRipple {
  0% {
    transform: scale(1);
    filter: blur(0px);
  }
  50% {
    transform: scale(1.08);
    filter: blur(0.8px);
  }
  100% {
    transform: scale(1.05);
    filter: blur(0.5px);
  }
}

.carousel-item.transition-waveRipple::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 0.8s ease-out forwards;
  z-index: 0;
}

@keyframes ripple {
  0% { width: 0; height: 0; opacity: 1; }
  100% { width: 300px; height: 300px; opacity: 0; }
}

/* 网格扩展效果 - 拉伸变形并添加光效 */
.carousel-item.transition-netExpand {
  transform: scaleX(1.1) scaleY(0.95);
  box-shadow: inset 0 0 20px rgba(6, 182, 212, 0.2);
  animation: expandPulse 0.8s ease-out;
}

@keyframes expandPulse {
  0% { transform: scaleX(1) scaleY(1); }
  50% { transform: scaleX(1.15) scaleY(0.9); }
  100% { transform: scaleX(1.1) scaleY(0.95); }
}

/* 粒子散开效果 - 模糊并旋转，模拟散射 */
.carousel-item.transition-dotsScatter {
  filter: blur(1px);
  transform: rotate(1deg);
  animation: scatter 0.8s ease-out;
}

@keyframes scatter {
  0% { transform: rotate(0deg) scale(1); opacity: 1; }
  50% { transform: rotate(2deg) scale(1.05); opacity: 0.8; }
  100% { transform: rotate(1deg) scale(1); opacity: 1; }
}

/* 从不同角落展开的动画 */
@keyframes expandFromTopLeft {
  0% {
    clip-path: circle(0% at 0% 0%);
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    clip-path: circle(150% at 50% 50%);
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes expandFromTopRight {
  0% {
    clip-path: circle(0% at 100% 0%);
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    clip-path: circle(150% at 50% 50%);
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes expandFromBottomLeft {
  0% {
    clip-path: circle(0% at 0% 100%);
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    clip-path: circle(150% at 50% 50%);
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes expandFromBottomRight {
  0% {
    clip-path: circle(0% at 100% 100%);
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    clip-path: circle(150% at 50% 50%);
    transform: scale(1);
    opacity: 1;
  }
}

/* 圆形网格样式过渡效果 - 轻微旋转和缩放 */
.carousel-item.transition-pattern1 {
  transform: rotate(-0.5deg) scale(1.02);
  animation: pattern1Pulse 0.8s ease-out;
}

@keyframes pattern1Pulse {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(-1deg) scale(1.05); }
  100% { transform: rotate(-0.5deg) scale(1.02); }
}

.carousel-item.transition-pattern1::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pattern1Ripple 0.8s ease-out forwards;
  z-index: 0;
}

@keyframes pattern1Ripple {
  0% { width: 0; height: 0; opacity: 1; }
  100% { width: 400px; height: 400px; opacity: 0; }
}

/* 彩色方形样式过渡效果 - 轻微倾斜和拉伸 */
.carousel-item.transition-pattern2 {
  transform: skew(0.5deg) scaleX(1.03) scaleY(0.98);
  animation: pattern2Stretch 0.8s ease-out;
}

@keyframes pattern2Stretch {
  0% { transform: skew(0deg) scaleX(1) scaleY(1); }
  50% { transform: skew(1deg) scaleX(1.06) scaleY(0.95); }
  100% { transform: skew(0.5deg) scaleX(1.03) scaleY(0.98); }
}

/* 几何组合样式过渡效果 - 轻微缩放和模糊 */
.carousel-item.transition-pattern3 {
  transform: scale(1.02);
  filter: blur(0.5px);
  animation: pattern3Float 0.8s ease-out;
}

@keyframes pattern3Float {
  0% { transform: scale(1) translateY(0); filter: blur(0px); }
  50% { transform: scale(1.04) translateY(-5px); filter: blur(0.8px); }
  100% { transform: scale(1.02) translateY(-3px); filter: blur(0.5px); }
}

</style>
