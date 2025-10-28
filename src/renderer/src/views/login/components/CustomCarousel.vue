<template>
  <div class="custom-carousel">
    <div class="carousel-wrapper" :style="{ height: height }">
      <div 
        v-for="(item, index) in items" 
        :key="index"
        ref="carouselItems"
        class="carousel-item"
        :class="{
          'active': index === currentIndex,
          'expanding': index === currentIndex && isExpanding,
          [`expand-from-${currentExpandCorner}`]: index === currentIndex && isExpanding
        }"
      >
        <CanvasBackground
          ref="canvasBackgrounds"
          :type="item.backgroundType"
          :options="item.backgroundOptions"
          :image-url="item.imageUrl"
          :container-style="{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: '1' }"
          :trigger-jelly="triggerJelly"
        />
        <div v-if="item.type === 'image'" class="carousel-image-container">
          <img :src="item.src" :alt="item.title" class="carousel-image" />
        </div>
        <div v-if="item.title || item.description" class="carousel-text">
          <h3 v-if="item.title">{{ item.title }}</h3>
          <p v-if="item.description">{{ item.description }}</p>
        </div>
      </div>
    </div>
    <div class="carousel-indicators" v-if="showIndicators">
      <span 
        v-for="(item, index) in items" 
        :key="index"
        class="indicator"
        :class="{ 'active': index === currentIndex }"
        @click="goTo(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import CanvasBackground from '../vanta-backgrounds/CanvasBackground.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  height: {
    type: String,
    default: '100vh'
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 2000
  },
  showIndicators: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['change']);

const currentIndex = ref(0);
const autoplayTimer = ref(null);
const isExpanding = ref(false);
const currentExpandCorner = ref('top-left');
const triggerJelly = ref(false);
const carouselItems = ref([]);
const canvasBackgrounds = ref([]);

// 随机选择一个角落作为展开起点
const getRandomCorner = () => {
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  return corners[Math.floor(Math.random() * corners.length)];
};

// 切换到指定索引的轮播项
const goTo = (index) => {
  if (index !== currentIndex.value) {
    // 开始展开动画
    isExpanding.value = true;
    currentExpandCorner.value = getRandomCorner();
    
    // 重置触发果冻效果的标志
    triggerJelly.value = false;
    
    currentIndex.value = index;
    emit('change', index);
    
    // 延迟触发抖动效果，确保在背景切换动画进行到一半时触发
    setTimeout(() => {
      triggerJelly.value = true;
      
      // 重置抖动效果标志
      setTimeout(() => {
        triggerJelly.value = false;
      }, 100);
    }, 250); // 在动画进行到一半时触发抖动
    
    // 展开动画完成后更新状态
    setTimeout(() => {
      isExpanding.value = false;
    }, 500);
  }
};

// 下一个轮播项
const next = () => {
  goTo((currentIndex.value + 1) % props.items.length);
};

// 上一个轮播项
const prev = () => {
  goTo((currentIndex.value - 1 + props.items.length) % props.items.length);
};

// 开始自动播放
const startAutoplay = () => {
  if (props.autoplay) {
    autoplayTimer.value = setInterval(next, props.interval);
  }
};

// 停止自动播放
const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value);
    autoplayTimer.value = null;
  }
};

// 生命周期钩子
onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});

// 暴露方法给父组件
const methods = {
  goTo,
  next,
  prev,
  startAutoplay,
  stopAutoplay
};

defineExpose(methods);
</script>

<style scoped lang="scss">
.custom-carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  opacity: 0;
  z-index: 1;
  transition: opacity 0.5s ease-in-out;
}

.carousel-item.active {
  opacity: 1;
  z-index: 10;
}

.carousel-item.expanding {
  animation: expandAnimation 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* 从不同角落展开的动画 */
.carousel-item.expand-from-top-left {
  clip-path: circle(0% at 0% 0%);
  animation: expandFromTopLeft 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

.carousel-item.expand-from-top-right {
  clip-path: circle(0% at 100% 0%);
  animation: expandFromTopRight 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

.carousel-item.expand-from-bottom-left {
  clip-path: circle(0% at 0% 100%);
  animation: expandFromBottomLeft 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

.carousel-item.expand-from-bottom-right {
  clip-path: circle(0% at 100% 100%);
  animation: expandFromBottomRight 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes expandFromTopLeft {
  to {
    clip-path: circle(150% at 0% 0%);
  }
}

@keyframes expandFromTopRight {
  to {
    clip-path: circle(150% at 100% 0%);
  }
}

@keyframes expandFromBottomLeft {
  to {
    clip-path: circle(150% at 0% 100%);
  }
}

@keyframes expandFromBottomRight {
  to {
    clip-path: circle(150% at 100% 100%);
  }
}

.carousel-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.carousel-text {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  padding: 0 20px;
  z-index: 10;
}

.carousel-text h3 {
  font-size: 28px;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.carousel-text p {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 20;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator:hover,
.indicator.active {
  background-color: white;
  transform: scale(1.2);
}

/* 确保CanvasBackground在正确的层级 */
.carousel-item :deep(.canvas-container) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>