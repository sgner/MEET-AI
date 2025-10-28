<template>
  <div class="canvas-container" ref="canvasContainer" :style="containerStyle">
    <canvas ref="canvas" :class="expansionClass"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'DOTS'
  },
  options: {
    type: Object,
    default: () => ({
      color: 0x2563eb,
      color2: 0xec4899
    })
  },
  containerStyle: {
    type: Object,
    default: () => ({})
  },
  imageUrl: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['effectDestroyed']);

const canvasContainer = ref(null);
const canvas = ref(null);
const ctx = ref(null);
const animationFrame = ref(null);
const expansionClass = ref('');
const expansionProgress = ref(0);
const isExpanding = ref(false);

// 初始化Canvas
const initCanvas = () => {
  if (!canvasContainer.value || !canvas.value) return;

  const container = canvasContainer.value;
  const canvasEl = canvas.value;

  canvasEl.width = container.clientWidth;
  canvasEl.height = container.clientHeight;
  ctx.value = canvasEl.getContext('2d');

  // 开始展开动画
  startAnimation();
};

// 开始动画
const startAnimation = () => {
  // 随机选择一个展开的角落
  const expansionDirections = [
    'expand-from-top-left',
    'expand-from-top-right',
    'expand-from-bottom-left',
    'expand-from-bottom-right'
  ];

  expansionClass.value = expansionDirections[Math.floor(Math.random() * expansionDirections.length)];
  isExpanding.value = true;
  expansionProgress.value = 0;

  // 启动展开动画
  animateExpansion();
};

// 动画展开过程
const animateExpansion = () => {
  if (!ctx.value || !canvas.value) return;

  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

  const { color = 0x2563eb, color2 = 0xec4899, color3 = 0x0ea5e9, color4 = 0x1e293b } = props.options;

  if (props.type === 'FIRST_SLIDE') {
    // 第一张背景 - 深灰色背景
    ctx.value.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
  } else if (props.type === 'SECOND_SLIDE') {
    // 第二张背景 - 靛蓝色背景
    ctx.value.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
    ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
  } else if (props.type === 'THIRD_SLIDE') {
    // 第三张背景 - 柔和渐变背景
    const gradient = ctx.value.createLinearGradient(0, 0, canvas.value.width, canvas.value.height);
    gradient.addColorStop(0, '#a9cff6'); // 淡蓝色调
    gradient.addColorStop(1, '#868788'); // 浅灰色调
    ctx.value.fillStyle = gradient;
    ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
  } else {
    // 默认背景 - 渐变背景
    const gradient = ctx.value.createLinearGradient(0, 0, canvas.value.width, canvas.value.height);
    gradient.addColorStop(0, `#${color.toString(16).padStart(6, '0')}`);
    gradient.addColorStop(1, `#${color2.toString(16).padStart(6, '0')}`);
    ctx.value.fillStyle = gradient;
    ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
  }

  // 更新展开进度
  expansionProgress.value += 0.02;

  // 如果动画未完成，继续请求下一帧
  if (expansionProgress.value < 1) {
    animationFrame.value = requestAnimationFrame(animateExpansion);
  } else {
    // 动画完成，停止动画
    isExpanding.value = false;
    expansionProgress.value = 1;
  }

  // 绘制几何图案
  drawPattern();
};

// 绘制电脑元素
const drawComputer = (screenContent) => {
  if (!ctx.value || !canvas.value) return;

  const canvasEl = canvas.value;
  const { width, height } = canvasEl;
  const centerX = width * 0.5;
  const centerY = height * 0.5; // 调整位置更靠上
  const computerWidth = width * 0.40; // 减小宽度
  const screenHeight = computerWidth * 0.58; //
  const bodyHeight = computerWidth * 0.07; // 笔记本机身高度

  ctx.value.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.value.beginPath();
  ctx.value.roundRect(centerX - computerWidth * 0.58, centerY + screenHeight * 0.45 + bodyHeight * 0.2,
    computerWidth * 1.16, bodyHeight * 0.4, 8);
  ctx.value.fill();

  // 机身（底部部分）- 改为灰色
  ctx.value.fillStyle = '#b0b0b0';
  ctx.value.beginPath();
  ctx.value.roundRect(centerX - computerWidth * 0.55, centerY + screenHeight * 0.45,
    computerWidth * 1.1, bodyHeight, 5);
  ctx.value.fill();

  // 屏幕底部连接部分（显示笔记本打开的角度）
  ctx.value.fillStyle = '#a0a0a0';
  ctx.value.fillRect(centerX - computerWidth * 0.5, centerY + screenHeight * 0.45 - 2,
    computerWidth, 4);

  // 屏幕外边框 - 较厚的灰色边框
  ctx.value.fillStyle = '#a0a0a0';
  ctx.value.fillRect(centerX - computerWidth * 0.52, centerY - screenHeight * 0.52,
    computerWidth * 1.04, screenHeight * 1.04);

  // 屏幕内边框 - 较薄的浅灰色边框
  ctx.value.fillStyle = '#b0b0b0';
  ctx.value.fillRect(centerX - computerWidth * 0.5, centerY - screenHeight * 0.5,
    computerWidth, screenHeight);

  // 屏幕内容区域 - 保持原有颜色
  ctx.value.fillStyle = '#f8f8f8';
  ctx.value.fillRect(centerX - computerWidth * 0.48, centerY - screenHeight * 0.48,
    computerWidth * 0.96, screenHeight * 0.96);


  // 绘制键盘按键
  const keyWidth = computerWidth * 0.05;
  const keyHeight = bodyHeight * 0.3;
  const keySpacing = computerWidth * 0.005;
  const startKeyX = centerX - computerWidth * 0.42;
  const startKeyY = centerY + screenHeight * 0.47;

  // 绘制第二排按键
  for (let i = 0; i < 13; i++) {
    ctx.value.fillStyle = '#a0a0a0';
    ctx.value.beginPath();
    ctx.value.roundRect(startKeyX + keyWidth * 0.5 + i * (keyWidth + keySpacing), startKeyY + keyHeight + keySpacing,
      keyWidth, keyHeight, 2);
    ctx.value.fill();

    // 按键阴影效果
    ctx.value.strokeStyle = 'rgba(253,253,253,0.3)';
    ctx.value.lineWidth = 1;
    ctx.value.stroke();
  }

  // 绘制触摸板 - 更大更明显
  ctx.value.fillStyle = '#a0a0a0';
  ctx.value.beginPath();
  ctx.value.roundRect(centerX - computerWidth * 0.18, centerY + screenHeight * 0.53,
    computerWidth * 0.36, bodyHeight * 0.35, 3);
  ctx.value.fill();

  // 触摸板边框效果
  ctx.value.strokeStyle = '#a0a0a0';
  ctx.value.lineWidth = 1;
  ctx.value.stroke();

  // 根据屏幕内容绘制不同的界面
  ctx.value.textAlign = 'center';
  ctx.value.textBaseline = 'middle';

  // 绘制与轮播图title相关的页面
  if (screenContent === '与AI对话') {
    // 绘制对话界面骨架图 - 全屏显示，增强细节
    const fullWidth = computerWidth * 0.92; // 全屏宽度
    const fullHeight = screenHeight * 0.88; // 全屏高度
    const fullX = centerX - fullWidth * 0.5; // 向右移动5%
    const fullY = centerY - fullHeight * 0.5; // 居中显示

    // 标题栏骨架图 - 使用蓝色主题
    drawSkeletonRect(ctx.value, fullX, fullY, fullWidth, fullHeight * 0.1, 'blue');

    // 标题栏按钮骨架图 - 使用不同颜色
    drawSkeletonCircle(ctx.value, fullX + fullHeight * 0.05, fullY + fullHeight * 0.05, fullHeight * 0.03, 'red');
    drawSkeletonCircle(ctx.value, fullX + fullHeight * 0.1, fullY + fullHeight * 0.05, fullHeight * 0.03, 'yellow');
    drawSkeletonCircle(ctx.value, fullX + fullHeight * 0.15, fullY + fullHeight * 0.05, fullHeight * 0.03, 'green');

    // 标题骨架图
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.3, fullY + fullHeight * 0.03, fullWidth * 0.4, fullHeight * 0.04);

    // 右侧用户信息骨架图
    drawSkeletonCircle(ctx.value, fullX + fullWidth * 0.9, fullY + fullHeight * 0.05, fullHeight * 0.04, 'purple');

    // 对话区域骨架图
    drawSkeletonRect(ctx.value, fullX, fullY + fullHeight * 0.1, fullWidth, fullHeight * 0.75);

    // 分割线 - 增强界面层次感
    drawSkeletonLine(ctx.value, fullX, fullY + fullHeight * 0.1, fullX + fullWidth, fullY + fullHeight * 0.1, '#a0a0a0');
    drawSkeletonLine(ctx.value, fullX, fullY + fullHeight * 0.85, fullX + fullWidth, fullY + fullHeight * 0.85, '#a0a0a0');

    // 左侧快捷工具栏骨架图
    drawDashedSkeleton(ctx.value, fullX, fullY + fullHeight * 0.15, fullHeight * 0.02, fullHeight * 0.4, 3);
    for (let i = 0; i < 5; i++) {
      drawSkeletonCircle(ctx.value, fullX + fullHeight * 0.01, fullY + fullHeight * 0.17 + i * fullHeight * 0.09, fullHeight * 0.008);
    }

    // 用户消息骨架图 - 使用不同颜色
    drawSkeletonCircle(ctx.value, fullX + fullHeight * 0.07, fullY + fullHeight * 0.15, fullHeight * 0.04, 'blue');
    drawSkeletonRect(ctx.value, fullX + fullHeight * 0.15, fullY + fullHeight * 0.12, fullWidth * 0.3, fullHeight * 0.06, 'blue');
    // 消息时间戳骨架图
    drawSkeletonRect(ctx.value, fullX + fullHeight * 0.15 + fullWidth * 0.3 + fullHeight * 0.02, fullY + fullHeight * 0.12 + fullHeight * 0.04, fullWidth * 0.08, fullHeight * 0.02);

    // AI消息骨架图 - 使用不同颜色
    drawSkeletonCircle(ctx.value, fullX + fullHeight * 0.07, fullY + fullHeight * 0.25, fullHeight * 0.04, 'purple');
    drawSkeletonRect(ctx.value, fullX + fullHeight * 0.15, fullY + fullHeight * 0.22, fullWidth * 0.5, fullHeight * 0.06, 'purple');
    drawSkeletonRect(ctx.value, fullX + fullHeight * 0.15, fullY + fullHeight * 0.29, fullWidth * 0.45, fullHeight * 0.06, 'purple');
    // 消息时间戳骨架图
    drawSkeletonRect(ctx.value, fullX + fullHeight * 0.15, fullY + fullHeight * 0.36, fullWidth * 0.08, fullHeight * 0.02);

    // 加载中提示骨架图
    drawSkeletonCircle(ctx.value, fullX + fullHeight * 0.07, fullY + fullHeight * 0.45, fullHeight * 0.04, 'green');
    drawSkeletonRect(ctx.value, fullX + fullHeight * 0.15, fullY + fullHeight * 0.42, fullWidth * 0.15, fullHeight * 0.06, 'green');

    // 输入框区域骨架图 - 使用蓝色主题
    drawSkeletonRect(ctx.value, fullX, fullY + fullHeight * 0.85, fullWidth, fullHeight * 0.15, 'blue');

    // 输入框左侧工具栏骨架图
    const toolIconX = fullX + fullHeight * 0.04;
    for (let i = 0; i < 4; i++) {
      drawSkeletonCircle(ctx.value, toolIconX + i * fullHeight * 0.08, fullY + fullHeight * 0.92, fullHeight * 0.04);
    }

    // 输入框骨架图
    drawSkeletonRect(ctx.value, toolIconX + 4 * fullHeight * 0.08 + fullHeight * 0.02, fullY + fullHeight * 0.87, fullWidth * 0.65, fullHeight * 0.11);

    // 发送按钮骨架图 - 使用绿色主题
    drawSkeletonCircle(ctx.value, fullX + fullWidth * 0.9, fullY + fullHeight * 0.92, fullHeight * 0.06, 'green');

    // 底部状态栏骨架图
    drawDashedSkeleton(ctx.value, fullX + fullWidth * 0.02, fullY + fullHeight * 0.98, fullWidth * 0.96, fullHeight * 0.02);
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.05, fullY + fullHeight * 0.98, fullWidth * 0.1, fullHeight * 0.015);;
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.2, fullY + fullHeight * 0.98, fullWidth * 0.1, fullHeight * 0.015);
  } else if (screenContent === '使用AI工具') {
    // 绘制工具界面骨架图 - 全屏显示，增强细节
    const fullWidth = computerWidth * 0.92; // 全屏宽度
    const fullHeight = screenHeight * 0.88; // 全屏高度
    const fullX = centerX - fullWidth * 0.5;
    const fullY = centerY - fullHeight * 0.5; // 居中显示

    // 标题栏骨架图 - 使用紫色主题
    drawSkeletonRect(ctx.value, fullX, fullY, fullWidth, fullHeight * 0.1, 'purple');

    // 标题骨架图
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.4, fullY + fullHeight * 0.03, fullWidth * 0.2, fullHeight * 0.04);

    // 右侧搜索栏骨架图
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.75, fullY + fullHeight * 0.03, fullWidth * 0.1, fullHeight * 0.04);

    // 分割线 - 增强界面层次感
    drawSkeletonLine(ctx.value, fullX, fullY + fullHeight * 0.1, fullX + fullWidth, fullY + fullHeight * 0.1, '#a0a0a0');
    drawSkeletonLine(ctx.value, fullX, fullY + fullHeight * 0.85, fullX + fullWidth, fullY + fullHeight * 0.85, '#a0a0a0');

    // 左侧导航栏骨架图
    drawDashedSkeleton(ctx.value, fullX, fullY + fullHeight * 0.15, fullHeight * 0.02, fullHeight * 0.4, 3);
    for (let i = 0; i < 5; i++) {
      drawSkeletonCircle(ctx.value, fullX + fullHeight * 0.01, fullY + fullHeight * 0.17 + i * fullHeight * 0.09, fullHeight * 0.008);
    }

    // 工具卡片网格骨架图 - 使用不同颜色主题
    const cardWidth = fullWidth * 0.28;
    const cardHeight = fullHeight * 0.25;
    const gapX = fullWidth * 0.05; // 减小间距，让卡片向左移动
    const gapY = fullHeight * 0.1;
    const cardColors = ['blue', 'purple', 'pink', 'green', 'blue', 'purple'];

    // 第一行卡片
    drawSkeletonRect(ctx.value, fullX + gapX, fullY + fullHeight * 0.15, cardWidth, cardHeight, cardColors[0]);
    drawSkeletonRect(ctx.value, fullX + gapX + cardWidth + gapX, fullY + fullHeight * 0.15, cardWidth, cardHeight, cardColors[1]);
    drawSkeletonRect(ctx.value, fullX + gapX + (cardWidth + gapX) * 2, fullY + fullHeight * 0.15, cardWidth, cardHeight, cardColors[2]);

    // 第二行卡片
    drawSkeletonRect(ctx.value, fullX + gapX, fullY + fullHeight * 0.15 + cardHeight + gapY, cardWidth, cardHeight, cardColors[3]);
    drawSkeletonRect(ctx.value, fullX + gapX + cardWidth + gapX, fullY + fullHeight * 0.15 + cardHeight + gapY, cardWidth, cardHeight, cardColors[4]);
    drawSkeletonRect(ctx.value, fullX + gapX + (cardWidth + gapX) * 2, fullY + fullHeight * 0.15 + cardHeight + gapY, cardWidth, cardHeight, cardColors[5]);

    // 卡片内图标骨架图 - 使用匹配的颜色主题
    drawSkeletonCircle(ctx.value, fullX + gapX + cardWidth * 0.5, fullY + fullHeight * 0.15 + cardHeight * 0.3, fullHeight * 0.05, cardColors[0]);
    drawSkeletonCircle(ctx.value, fullX + gapX + cardWidth + gapX + cardWidth * 0.5, fullY + fullHeight * 0.15 + cardHeight * 0.3, fullHeight * 0.05, cardColors[1]);
    drawSkeletonCircle(ctx.value, fullX + gapX + (cardWidth + gapX) * 2 + cardWidth * 0.5, fullY + fullHeight * 0.15 + cardHeight * 0.3, fullHeight * 0.05, cardColors[2]);

    drawSkeletonCircle(ctx.value, fullX + gapX + cardWidth * 0.5, fullY + fullHeight * 0.15 + cardHeight + gapY + cardHeight * 0.3, fullHeight * 0.05, cardColors[3]);
    drawSkeletonCircle(ctx.value, fullX + gapX + cardWidth + gapX + cardWidth * 0.5, fullY + fullHeight * 0.15 + cardHeight + gapY + cardHeight * 0.3, fullHeight * 0.05, cardColors[4]);
    drawSkeletonCircle(ctx.value, fullX + gapX + (cardWidth + gapX) * 2 + cardWidth * 0.5, fullY + fullHeight * 0.15 + cardHeight + gapY + cardHeight * 0.3, fullHeight * 0.05, cardColors[5]);

    // 卡片内文字骨架图 - 多行文字增强细节
    const textColors = ['default', 'default', 'default', 'default', 'default', 'default'];
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const cardIndex = row * 3 + col;
        const cardX = fullX + gapX + col * (cardWidth + gapX);
        const cardY = fullY + fullHeight * 0.15 + row * (cardHeight + gapY);

        // 卡片标题
        drawSkeletonRect(ctx.value, cardX + cardWidth * 0.2, cardY + cardHeight * 0.6, cardWidth * 0.6, fullHeight * 0.03, textColors[cardIndex]);
        // 卡片描述
        drawSkeletonRect(ctx.value, cardX + cardWidth * 0.2, cardY + cardHeight * 0.68, cardWidth * 0.5, fullHeight * 0.02, textColors[cardIndex]);
        // 卡片标签
        drawSkeletonRect(ctx.value, cardX + cardWidth * 0.2, cardY + cardHeight * 0.74, cardWidth * 0.3, fullHeight * 0.02, textColors[cardIndex]);
      }
    }

    // 底部工具栏骨架图 - 使用紫色主题
    drawSkeletonRect(ctx.value, fullX, fullY + fullHeight * 0.85, fullWidth, fullHeight * 0.15, 'purple');

    // 底部工具图标骨架图 - 使用不同颜色
    const iconPositions = [0.2, 0.4, 0.6, 0.8];
    const iconColors = ['blue', 'green', 'pink', 'purple'];
    iconPositions.forEach((pos, index) => {
      drawSkeletonCircle(ctx.value, fullX + fullWidth * pos, fullY + fullHeight * 0.92, fullHeight * 0.06, iconColors[index]);
    });

    // 底部状态栏骨架图
    drawDashedSkeleton(ctx.value, fullX + fullWidth * 0.02, fullY + fullHeight * 0.98, fullWidth * 0.96, fullHeight * 0.02);
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.05, fullY + fullHeight * 0.98, fullWidth * 0.1, fullHeight * 0.015);
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.2, fullY + fullHeight * 0.98, fullWidth * 0.1, fullHeight * 0.015);
  } else if (screenContent === '与AI视频交流') {
    // 绘制视频界面骨架图 - 全屏显示，增强细节
    const fullWidth = computerWidth * 0.92; // 全屏宽度
    const fullHeight = screenHeight * 0.88; // 全屏高度
    const fullX = centerX - fullWidth * 0.5;
    const fullY = centerY - fullHeight * 0.5; // 居中显示

    // 标题栏骨架图 - 使用蓝色主题
    drawSkeletonRect(ctx.value, fullX, fullY, fullWidth, fullHeight * 0.1, 'blue');

    // 标题骨架图
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.4, fullY + fullHeight * 0.03, fullWidth * 0.2, fullHeight * 0.04);

    // 会议信息骨架图
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.75, fullY + fullHeight * 0.03, fullWidth * 0.15, fullHeight * 0.04);

    // 分割线 - 增强界面层次感
    drawSkeletonLine(ctx.value, fullX, fullY + fullHeight * 0.1, fullX + fullWidth, fullY + fullHeight * 0.1, '#a0a0a0');
    drawSkeletonLine(ctx.value, fullX, fullY + fullHeight * 0.75, fullX + fullWidth, fullY + fullHeight * 0.75, '#a0a0a0');

    // 左侧参与者列表骨架图
    drawDashedSkeleton(ctx.value, fullX, fullY + fullHeight * 0.15, fullHeight * 0.02, fullHeight * 0.4, 3);
    for (let i = 0; i < 5; i++) {
      drawSkeletonCircle(ctx.value, fullX + fullHeight * 0.01, fullY + fullHeight * 0.17 + i * fullHeight * 0.09, fullHeight * 0.008);
    }

    // 主视频窗口骨架图 - 使用蓝色主题
    drawSkeletonRect(ctx.value, fullX, fullY + fullHeight * 0.1, fullWidth, fullHeight * 0.65, 'blue');

    // 视频质量指示器骨架图
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.05, fullY + fullHeight * 0.15, fullWidth * 0.1, fullHeight * 0.03);

    // 视频中人物头像骨架图 - 使用蓝色主题
    drawSkeletonCircle(ctx.value, fullX + fullWidth * 0.5, fullY + fullHeight * 0.1 + fullHeight * 0.25, fullHeight * 0.15, 'blue');

    // 用户名骨架图
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.4, fullY + fullHeight * 0.1 + fullHeight * 0.55, fullWidth * 0.2, fullHeight * 0.05);

    // 在线状态骨架图 - 使用绿色主题
    drawSkeletonCircle(ctx.value, fullX + fullWidth * 0.35, fullY + fullHeight * 0.1 + fullHeight * 0.55, fullHeight * 0.025, 'green');

    // 本地视频窗口骨架图 - 使用紫色主题
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.7, fullY + fullHeight * 0.2, fullWidth * 0.2, fullHeight * 0.15, 'purple');

    // 本地视频头像骨架图 - 使用紫色主题
    drawSkeletonCircle(ctx.value, fullX + fullWidth * 0.8, fullY + fullHeight * 0.2 + fullHeight * 0.075, fullHeight * 0.05, 'purple');

    // 通话时间骨架图
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.45, fullY + fullHeight * 0.1 + fullHeight * 0.65 + fullHeight * 0.05, fullWidth * 0.1, fullHeight * 0.03);

    // 网络状态指示器骨架图 - 使用绿色主题
    drawSkeletonCircle(ctx.value, fullX + fullWidth * 0.05, fullY + fullHeight * 0.1 + fullHeight * 0.65 + fullHeight * 0.05, fullHeight * 0.02, 'green');
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.08, fullY + fullHeight * 0.1 + fullHeight * 0.65 + fullHeight * 0.05, fullWidth * 0.05, fullHeight * 0.03);

    // 共享屏幕骨架图
    drawDashedSkeleton(ctx.value, fullX + fullWidth * 0.2, fullY + fullHeight * 0.1 + fullHeight * 0.65 + fullHeight * 0.05, fullWidth * 0.15, fullHeight * 0.03, 3);

    // 控制面板骨架图 - 使用蓝色主题
    drawSkeletonRect(ctx.value, fullX, fullY + fullHeight * 0.75, fullWidth, fullHeight * 0.15, 'blue');

    // 控制按钮骨架图 - 使用不同颜色
    const buttonPositions = [0.25, 0.4, 0.6, 0.75];
    const buttonColors = ['red', 'green', 'blue', 'purple'];
    buttonPositions.forEach((pos, index) => {
      drawSkeletonCircle(ctx.value, fullX + fullWidth * pos, fullY + fullHeight * 0.825, fullHeight * 0.07, buttonColors[index]);
    });

    // 底部状态栏骨架图
    drawDashedSkeleton(ctx.value, fullX + fullWidth * 0.02, fullY + fullHeight * 0.98, fullWidth * 0.96, fullHeight * 0.02);
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.05, fullY + fullHeight * 0.98, fullWidth * 0.1, fullHeight * 0.015);
    drawSkeletonRect(ctx.value, fullX + fullWidth * 0.2, fullY + fullHeight * 0.98, fullWidth * 0.1, fullHeight * 0.015);
  }

  // 骨架图绘制辅助函数 - 增强版
  function drawSkeletonRect(ctx, x, y, width, height, colorType = 'default') {
    // 定义不同类型的骨架图颜色主题
    const colorThemes = {
      default: {
        light: '#e0e0e0',
        medium: '#d0d0d0',
        dark: '#c0c0c0',
        highlight: 'rgba(255, 255, 255, 0.3)'
      },
      blue: {
        light: '#bfdbfe',
        medium: '#93c5fd',
        dark: '#60a5fa',
        highlight: 'rgba(255, 255, 255, 0.4)'
      },
      purple: {
        light: '#ddd6fe',
        medium: '#c4b5fd',
        dark: '#a78bfa',
        highlight: 'rgba(255, 255, 255, 0.4)'
      },
      pink: {
        light: '#fbcfe8',
        medium: '#f9a8d4',
        dark: '#f472b6',
        highlight: 'rgba(255, 255, 255, 0.4)'
      },
      green: {
        light: '#bbf7d0',
        medium: '#86efac',
        dark: '#4ade80',
        highlight: 'rgba(255, 255, 255, 0.4)'
      }
    };

    const theme = colorThemes[colorType] || colorThemes.default;

    // 创建骨架图渐变效果
    const gradient = ctx.createLinearGradient(x, y, x + width, y);
    gradient.addColorStop(0, theme.light);
    gradient.addColorStop(0.5, theme.medium);
    gradient.addColorStop(1, theme.light);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 4);
    ctx.fill();

    // 添加细边框，增强轮廓感
    ctx.strokeStyle = theme.dark;
    ctx.lineWidth = 1;
    ctx.stroke();

    // 添加骨架图高亮效果，更柔和自然
    ctx.fillStyle = theme.highlight;
    ctx.beginPath();
    ctx.roundRect(x + width * 0.05, y + height * 0.1, width * 0.6, height * 0.3, 2);
    ctx.fill();
  }

  function drawSkeletonCircle(ctx, x, y, radius, colorType = 'default') {
    // 定义不同类型的骨架图颜色主题
    const colorThemes = {
      default: {
        light: '#e0e0e0',
        medium: '#d0d0d0',
        dark: '#c0c0c0',
        highlight: 'rgba(255, 255, 255, 0.3)'
      },
      blue: {
        light: '#bfdbfe',
        medium: '#93c5fd',
        dark: '#60a5fa',
        highlight: 'rgba(255, 255, 255, 0.4)'
      },
      purple: {
        light: '#ddd6fe',
        medium: '#c4b5fd',
        dark: '#a78bfa',
        highlight: 'rgba(255, 255, 255, 0.4)'
      },
      pink: {
        light: '#fbcfe8',
        medium: '#f9a8d4',
        dark: '#f472b6',
        highlight: 'rgba(255, 255, 255, 0.4)'
      },
      green: {
        light: '#bbf7d0',
        medium: '#86efac',
        dark: '#4ade80',
        highlight: 'rgba(255, 255, 255, 0.4)'
      }
    };

    const theme = colorThemes[colorType] || colorThemes.default;

    // 创建骨架图渐变效果
    const gradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius);
    gradient.addColorStop(0, theme.light);
    gradient.addColorStop(0.7, theme.medium);
    gradient.addColorStop(1, theme.light);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // 添加细边框，增强轮廓感
    ctx.strokeStyle = theme.dark;
    ctx.lineWidth = 1;
    ctx.stroke();

    // 添加骨架图高亮效果
    ctx.fillStyle = theme.highlight;
    ctx.beginPath();
    ctx.arc(x - radius * 0.2, y - radius * 0.2, radius * 0.3, 0, 2 * Math.PI);
    ctx.fill();
  }

  // 绘制虚线骨架图
  function drawDashedSkeleton(ctx, x, y, width, height, spacing = 4) {
    ctx.setLineDash([spacing, spacing]);
    ctx.strokeStyle = '#a0a0a0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 4);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 绘制骨架图中的细线元素
  function drawSkeletonLine(ctx, x1, y1, x2, y2, color = '#a0a0a0') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
};

// 绘制主图案
const drawPattern = () => {
  if (!ctx.value || !canvas.value) return;

  // 转换颜色格式
  const hexToRgb = (hex) => {
    const r = (hex >> 16) & 0xFF;
    const g = (hex >> 8) & 0xFF;
    const b = hex & 0xFF;
    return { r, g, b };
  };

  // 根据type属性决定使用哪种样式
  if (props.type === 'FIRST_SLIDE') {
    drawPattern1();
    drawComputer('与AI对话');
  } else if (props.type === 'SECOND_SLIDE') {
    drawPattern2();
    drawComputer('使用AI工具');
  } else if (props.type === 'THIRD_SLIDE') {
    drawPattern3();
    drawComputer('与AI视频交流');
  } else {
    // 默认样式
    drawPattern1();
    drawComputer('与AI对话');
  }
};

// 第一张图片样式 - 圆形、半圆形和线条图案的重复网格 - 增强版
const drawPattern1 = () => {
  if (!ctx.value || !canvas.value) return;

  const canvasEl = canvas.value;
  const { width, height } = canvasEl;
  const { color = 0x2D3748, color2 = 0xF59E0B, color3 = 0x4B5563, color4 = 0x0EA5E9 } = props.options;

  // 计算上方60%区域的高度限制
  const maxHeight = height * 0.7; // 扩大绘制区域

  // 颜色转换
  const hexToRgb = (hex) => {
    const r = (hex >> 16) & 0xFF;
    const g = (hex >> 8) & 0xFF;
    const b = hex & 0xFF;
    return { r, g, b };
  };

  const colors = [
    hexToRgb(color), // 深灰色
    hexToRgb(color2), // 金黄色
    hexToRgb(color3), // 中灰色
    hexToRgb(color4)  // 蓝色
  ];


  // 设置网格大小和偏移，使其更紧凑和明显
  const gridSize = 100;
  const offsetX = width * 0.05;
  const offsetY = height * 0.05;

  // 绘制重复的几何图形网格 - 增强视觉效果
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const x = offsetX + col * gridSize;
      const y = offsetY + row * gridSize;

      // 确保在上方70%区域内
      if (y + gridSize > maxHeight) continue;

      // 选择图形类型 (圆形、半圆、条纹圆形)
      const shapeType = (row * 6 + col) % 3;

      switch (shapeType) {
        case 0: // 完整圆形 - 增加大小和不透明度
          ctx.value.beginPath();
          ctx.value.arc(x, y, gridSize / 2, 0, 2 * Math.PI);
          ctx.value.fillStyle = `rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, 0.9)`;
          ctx.value.fill();

          // 增加内部小圆形，增强层次感
          ctx.value.beginPath();
          ctx.value.arc(x, y, gridSize / 4, 0, 2 * Math.PI);
          ctx.value.fillStyle = `rgba(${colors[3].r}, ${colors[3].g}, ${colors[3].b}, 0.6)`;
          ctx.value.fill();
          break;

        case 1: // 上半圆 - 增加大小和不透明度
          ctx.value.beginPath();
          ctx.value.arc(x, y, gridSize / 2, Math.PI, 2 * Math.PI);
          ctx.value.closePath();
          ctx.value.fillStyle = `rgba(${colors[3].r}, ${colors[3].g}, ${colors[3].b}, 0.9)`;
          ctx.value.fill();
          break;

        case 2: // 条纹圆形 - 增强视觉效果
          ctx.value.beginPath();
          ctx.value.arc(x, y, gridSize / 2, 0, 2 * Math.PI);
          ctx.value.fillStyle = `rgba(${colors[2].r}, ${colors[2].g}, ${colors[2].b}, 0.9)`;
          ctx.value.fill();

          // 绘制更粗的条纹
          ctx.value.strokeStyle = `rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, 0.5)`;
          ctx.value.lineWidth = 3;
          for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6;
            const startX = x + Math.cos(angle) * (gridSize / 4);
            const startY = y + Math.sin(angle) * (gridSize / 4);
            const endX = x + Math.cos(angle) * (gridSize / 2);
            const endY = y + Math.sin(angle) * (gridSize / 2);
            ctx.value.beginPath();
            ctx.value.moveTo(startX, startY);
            ctx.value.lineTo(endX, endY);
            ctx.value.stroke();
          }
          break;
      }

      // 绘制更明显的金色边框线
      ctx.value.strokeStyle = `rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, 0.4)`;
      ctx.value.lineWidth = 2;
      ctx.value.beginPath();
      ctx.value.rect(x - gridSize / 2, y - gridSize / 2, gridSize, gridSize);
      ctx.value.stroke();
    }
  }
};

// 第二张图片样式 - 彩色重叠的方形和线条 - 增强版，匹配用户上传的渐变方块风格
const drawPattern2 = () => {
  if (!ctx.value || !canvas.value) return;

  const canvasEl = canvas.value;
  const { width, height } = canvasEl;
  const { color = 0x6366F1, color2 = 0xEC4899, color3 = 0x3B82F6, color4 = 0xF97316 } = props.options;

  // 计算更大的绘制区域
  const maxHeight = height * 0.8;

  // 颜色转换
  const hexToRgb = (hex) => {
    const r = (hex >> 16) & 0xFF;
    const g = (hex >> 8) & 0xFF;
    const b = hex & 0xFF;
    return { r, g, b };
  };

  const colors = [
    hexToRgb(color),   // 靛蓝色
    hexToRgb(color2),  // 粉红色
    hexToRgb(color3),  // 蓝色
    hexToRgb(color4)   // 橙色
  ];

  // 绘制重叠的彩色方形 - 增强版，匹配用户上传的渐变方块风格
  const drawSquare = (x, y, size, rotation, color, alpha, hasBorder = true, gradientType = 'diagonal') => {
    if (y + size > maxHeight) return; // 确保在绘制区域内

    ctx.value.save();
    ctx.value.translate(x, y);
    ctx.value.rotate(rotation);

    // 创建渐变填充，匹配用户上传的渐变方块风格
    let gradient;
    if (gradientType === 'diagonal') {
      gradient = ctx.value.createLinearGradient(-size/2, -size/2, size/2, size/2);
    } else if (gradientType === 'horizontal') {
      gradient = ctx.value.createLinearGradient(-size/2, 0, size/2, 0);
    } else {
      gradient = ctx.value.createLinearGradient(0, -size/2, 0, size/2);
    }

    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.7})`);

    // 填充方形
    ctx.value.fillStyle = gradient;
    ctx.value.fillRect(-size / 2, -size / 2, size, size);

    // 绘制更明显的白色边框
    if (hasBorder) {
      ctx.value.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.value.lineWidth = 3;
      ctx.value.strokeRect(-size / 2, -size / 2, size, size);
    }

    ctx.value.restore();
  };

  // 主要方形 - 增大尺寸并调整位置，增强视觉效果
  drawSquare(width * 0.2, height * 0.3, 250, -Math.PI / 6, colors[1], 0.8);
  drawSquare(width * 0.8, height * 0.2, 200, Math.PI / 4, colors[2], 0.9);

  // 中等方形
  drawSquare(width * 0.65, height * 0.4, 150, -Math.PI / 3, colors[3], 0.8, true, 'horizontal');
  drawSquare(width * 0.9, height * 0.3, 120, Math.PI / 3, colors[1], 0.7);

  // 小方形
  drawSquare(width * 0.1, height * 0.2, 100, Math.PI / 6, colors[2], 0.8);
  drawSquare(width * 0.45, height * 0.15, 80, -Math.PI / 4, colors[3], 0.9, true, 'vertical');

  // 额外添加一些小方形，增强图案密度
  drawSquare(width * 0.3, height * 0.5, 70, Math.PI / 8, colors[1], 0.7);
  drawSquare(width * 0.7, height * 0.1, 60, -Math.PI / 8, colors[2], 0.8);

  // 绘制装饰线条 - 增强版
  const drawLineCluster = (x1, y1, x2, y2, count, color, width) => {
    ctx.value.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
    ctx.value.lineWidth = width;

    // 创建线条的渐变效果
    const createLineGradient = (startX, startY, endX, endY, color, alpha) => {
      const gradient = ctx.value.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.6})`);
      gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.6})`);
      return gradient;
    };

    for (let i = 0; i < count; i++) {
      const offset = i * 15;
      ctx.value.beginPath();
      ctx.value.moveTo(x1 + offset, y1);
      ctx.value.lineTo(x2 + offset, y2);
      // 使用渐变线条
      ctx.value.strokeStyle = createLineGradient(x1 + offset, y1, x2 + offset, y2, color, 0.9);
      ctx.value.stroke();
    }
  };

  // 线条集群 - 增加数量和粗细，增强视觉效果
  drawLineCluster(-50, height * 0.25, width * 0.3, -30, 4, colors[1], 5);
  drawLineCluster(width * 0.75, -30, width + 50, height * 0.2, 4, colors[3], 5);
  drawLineCluster(width * 0.45, height * 0.45, width + 30, height * 0.1, 3, colors[2], 4);

  // 额外添加一些水平线条，匹配用户上传的图片风格
  const drawHorizontalLines = () => {
    for (let i = 0; i < 5; i++) {
      const y = height * 0.1 + i * (height * 0.1);
      if (y > maxHeight) break;

      ctx.value.beginPath();
      ctx.value.moveTo(width * 0.1, y);
      ctx.value.lineTo(width * 0.4, y);
      ctx.value.strokeStyle = `rgba(${colors[2].r}, ${colors[2].g}, ${colors[2].b}, 0.4)`;
      ctx.value.lineWidth = 2;
      ctx.value.stroke();
    }
  };

  drawHorizontalLines();
};

// 第三张图片样式 - 多种几何形状的组合和重复
const drawPattern3 = () => {
  if (!ctx.value || !canvas.value) return;

  const canvasEl = canvas.value;
  const { width, height } = canvasEl;
  const { color = 0x2563EB, color2 = 0xFBBF24, color3 = 0x0EA5E9, color4 = 0x1E293B } = props.options;

  // 计算上方80%区域的高度限制，让几何元素分布更均匀
  const maxHeight = height * 0.8;

  // 颜色转换
  const hexToRgb = (hex) => {
    const r = (hex >> 16) & 0xFF;
    const g = (hex >> 8) & 0xFF;
    const b = hex & 0xFF;
    return { r, g, b };
  };

  const colors = [
    hexToRgb(color),   // 蓝色
    hexToRgb(color2),  // 黄色
    hexToRgb(color3),  // 浅蓝色
    hexToRgb(color4)   // 深蓝色
  ];

  // 定义绘制不同形状的函数 - 增强版，添加白色边框
  const drawCircle = (x, y, radius, color, fill = true) => {
    if (y + radius > maxHeight) return; // 确保在上方80%区域内

    ctx.value.beginPath();
    ctx.value.arc(x, y, radius, 0, 2 * Math.PI);

    if (fill) {
      ctx.value.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
      ctx.value.fill();
      // 添加白色边框
      ctx.value.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.value.lineWidth = 3;
      ctx.value.stroke();
    } else {
      ctx.value.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
      ctx.value.lineWidth = 3;
      ctx.value.stroke();
    }
  };

  const drawTriangle = (x, y, size, color) => {
    if (y + size > maxHeight) return; // 确保在上方80%区域内

    ctx.value.beginPath();
    ctx.value.moveTo(x, y - size / 2);
    ctx.value.lineTo(x + size / 2, y + size / 2);
    ctx.value.lineTo(x - size / 2, y + size / 2);
    ctx.value.closePath();

    ctx.value.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
    ctx.value.fill();
    // 添加白色边框
    ctx.value.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.value.lineWidth = 3;
    ctx.value.stroke();
  };

  const drawSquare = (x, y, size, color, rotation = 0, fill = true) => {
    if (y + size > maxHeight) return; // 确保在上方80%区域内

    ctx.value.save();
    ctx.value.translate(x, y);
    if (rotation) ctx.value.rotate(rotation);

    if (fill) {
      ctx.value.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
      ctx.value.fillRect(-size / 2, -size / 2, size, size);
      // 添加白色边框
      ctx.value.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.value.lineWidth = 3;
      ctx.value.strokeRect(-size / 2, -size / 2, size, size);
    } else {
      ctx.value.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
      ctx.value.lineWidth = 3;
      ctx.value.strokeRect(-size / 2, -size / 2, size, size);
    }

    ctx.value.restore();
  };

  const drawSemicircle = (x, y, radius, color, orientation = 'bottom') => {
    if (y + radius > maxHeight) return; // 确保在上方80%区域内

    ctx.value.beginPath();
    let startAngle = 0;
    let endAngle = Math.PI;

    if (orientation === 'top') {
      startAngle = Math.PI;
      endAngle = 2 * Math.PI;
    } else if (orientation === 'right') {
      startAngle = -Math.PI / 2;
      endAngle = Math.PI / 2;
    } else if (orientation === 'left') {
      startAngle = Math.PI / 2;
      endAngle = 3 * Math.PI / 2;
    }

    ctx.value.arc(x, y, radius, startAngle, endAngle);
    ctx.value.lineTo(x, y);
    ctx.value.closePath();

    ctx.value.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
    ctx.value.fill();
    // 添加白色边框
    ctx.value.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.value.lineWidth = 3;
    ctx.value.stroke();
  };

  // 绘制点阵
  const drawDots = (x, y, countX, countY, spacing, color) => {
    for (let i = 0; i < countX; i++) {
      for (let j = 0; j < countY; j++) {
        const dotX = x + i * spacing;
        const dotY = y + j * spacing;

        if (dotY > maxHeight) continue;

        ctx.value.beginPath();
        ctx.value.arc(dotX, dotY, 4, 0, 2 * Math.PI);
        ctx.value.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
        ctx.value.fill();
        // 添加白色边框
        ctx.value.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.value.lineWidth = 1.5;
        ctx.value.stroke();
      }
    }
  };

  // 绘制矩形框架
  const drawRectangleFrame = (x, y, width, height, color, lineWidth = 3) => {
    if (y + height > maxHeight) return;

    ctx.value.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`;
    ctx.value.lineWidth = lineWidth;
    ctx.value.strokeRect(x - width / 2, y - height / 2, width, height);
  };

  // 绘制主要几何元素 - 增大尺寸
  drawCircle(width * 0.12, height * 0.2, 40, colors[3]);
  drawCircle(width * 0.45, height * 0.25, 55, colors[1]);
  drawCircle(width * 0.85, height * 0.22, 25, colors[0]);
  drawCircle(width * 0.7, height * 0.4, 30, colors[2]);

  // 新增圆形
  drawCircle(width * 0.25, height * 0.55, 35, colors[0]);
  drawCircle(width * 0.9, height * 0.5, 20, colors[1]);

  // 绘制三角形 - 增大尺寸
  drawTriangle(width * 0.3, height * 0.35, 40, colors[0]);
  drawTriangle(width * 0.55, height * 0.25, 30, colors[2]);
  drawTriangle(width * 0.9, height * 0.2, 35, colors[1]);

  // 新增三角形
  drawTriangle(width * 0.75, height * 0.55, 35, colors[3]);

  // 绘制正方形 - 增大尺寸
  drawSquare(width * 0.65, height * 0.2, 50, colors[3]);
  drawSquare(width * 0.2, height * 0.45, 40, colors[0], Math.PI / 4);
  drawSquare(width * 0.75, height * 0.15, 55, colors[2], -Math.PI / 4);

  // 新增正方形
  drawSquare(width * 0.5, height * 0.6, 35, colors[1], Math.PI / 6);
  drawSquare(width * 0.1, height * 0.6, 30, colors[2], Math.PI / 4);

  // 绘制半圆 - 增大尺寸
  drawSemicircle(width * 0.15, height * 0.35, 45, colors[1]);
  drawSemicircle(width * 0.5, height * 0.15, 35, colors[3], 'top');

  // 新增半圆
  drawSemicircle(width * 0.85, height * 0.4, 40, colors[2], 'right');

  // 绘制点阵装饰 - 增大点的大小
  drawDots(width * 0.07, height * 0.15, 5, 5, 12, colors[0]);
  drawDots(width * 0.82, height * 0.3, 4, 4, 10, colors[2]);

  // 新增点阵装饰
  drawDots(width * 0.65, height * 0.65, 5, 3, 12, colors[3]);

  // 绘制菱形装饰 - 增大尺寸
  drawSquare(width * 0.4, height * 0.15, 25, colors[1], Math.PI / 4);
  drawSquare(width * 0.5, height * 0.55, 22, colors[0], Math.PI / 4);

  // 新增菱形
  drawSquare(width * 0.25, height * 0.25, 20, colors[2], Math.PI / 4);

  // 绘制矩形框架
  drawRectangleFrame(width * 0.8, height * 0.65, 60, 40, colors[3], 3);
  drawRectangleFrame(width * 0.4, height * 0.65, 70, 50, colors[1], 3);
  };

// 调整Canvas大小
const handleResize = () => {
  if (!canvasContainer.value || !canvas.value) return;

  const container = canvasContainer.value;
  const canvasEl = canvas.value;

  canvasEl.width = container.clientWidth;
  canvasEl.height = container.clientHeight;

  // 重绘
  drawPattern();
};

// 监听属性变化 - 增强版本，确保正确响应类型变化
watch(() => props.type, (newType, oldType) => {
  if (newType !== oldType) {
    console.log('Background type changed:', oldType, '->', newType);
    nextTick(() => {
      // 先清除当前Canvas内容
      if (ctx.value && canvas.value) {
        ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
      }
      // 重新初始化
      initCanvas();
    });
  }
});

// 监听其他属性变化
watch(() => [props.options, props.imageUrl], () => {
  nextTick(() => {
    initCanvas();
  });
}, { deep: true });

// 生命周期钩子
onMounted(() => {
  nextTick(() => {
    initCanvas();
  });

  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }

  window.removeEventListener('resize', handleResize);
  emit('effectDestroyed');
});
</script>

<style scoped lang="scss">
.canvas-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.canvas-container canvas {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>