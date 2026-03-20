<template>
  <div class="login" @mousemove="onMouseMove">
    <!-- 粒子背景 -->
    <canvas ref="canvas" class="particle-canvas"></canvas>

    <!-- 网格线背景 -->
    <div class="grid-bg"></div>

    <!-- 扫描线特效 -->
    <div class="scan-line"></div>

    <!-- 浮动光球 -->
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <!-- 登录卡片 -->
    <div
      class="card"
      :style="cardStyle"
      ref="card"
    >
      <!-- 卡片顶部光条 -->
      <div class="card-glow-top"></div>

      <!-- 角标装饰 -->
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>

      <!-- 标题区 -->
      <div class="title-wrap">
        <div class="ai-badge">
          <span class="ai-dot"></span>
          AI SYSTEM
        </div>
        <div class="title">
          <span class="title-gpt">GPT</span>
          <span class="title-web">_WEB</span>
        </div>
        <div class="subtitle">管理控制台 · Neural Interface v2.0</div>
        <div class="title-line"></div>
      </div>

      <!-- 打字机状态文本 -->
      <div class="status-bar">
        <span class="status-dot"></span>
        <span class="typewriter">{{ typeText }}</span>
      </div>

      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top" class="ai-form">
        <el-form-item prop="username" class="form-item-wrap">
          <div class="input-label">
            <span class="label-icon">◈</span> IDENTITY
          </div>
          <div class="input-container" :class="{ focused: focusedField === 'username' }">
            <span class="input-prefix">root@gpt ~$</span>
            <el-input
              v-model="form.username"
              autocomplete="username"
              placeholder="admin"
              @focus="focusedField = 'username'"
              @blur="focusedField = ''"
              class="cyber-input"
            />
          </div>
        </el-form-item>

        <el-form-item prop="password" class="form-item-wrap">
          <div class="input-label">
            <span class="label-icon">◈</span> AUTH KEY
          </div>
          <div class="input-container" :class="{ focused: focusedField === 'password' }">
            <span class="input-prefix">🔐</span>
            <el-input
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              placeholder="随便填（mock）"
              show-password
              @focus="focusedField = 'password'"
              @blur="focusedField = ''"
              class="cyber-input"
            />
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <button
          class="cyber-btn"
          :class="{ loading: loading }"
          :disabled="loading"
          @click="submit"
        >
          <span v-if="!loading" class="btn-content">
            <span class="btn-icon">▶</span>
            NEURAL CONNECT
            <span class="btn-arrow">→</span>
          </span>
          <span v-else class="btn-loading">
            <span class="loading-dots">
              <span></span><span></span><span></span>
            </span>
            AUTHENTICATING...
          </span>
          <div class="btn-scan"></div>
        </button>
      </el-form>

      <!-- 底部信息 -->
      <div class="card-footer">
        <span class="footer-item">
          <span class="footer-dot green"></span> SECURE CONNECTION
        </span>
        <span class="footer-item">
          <span class="footer-dot blue"></span> AI POWERED
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      focusedField: '',
      mouseX: 0,
      mouseY: 0,
      typeTexts: [
        'Initializing neural network...',
        'System ready. Please authenticate.',
        'GPT_WEB · Administrative Interface',
        'Connecting to AI backend...',
      ],
      typeTextIndex: 0,
      typeText: '',
      typeCharIndex: 0,
      particles: [],
      animFrame: null,
      form: {
        username: 'admin',
        password: '',
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
      },
    }
  },
  computed: {
    cardStyle() {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (this.mouseX - cx) / cx
      const dy = (this.mouseY - cy) / cy
      return {
        transform: `perspective(1000px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateZ(0)`,
      }
    },
  },
  mounted() {
    this.initParticles()
    this.startTypewriter()
  },
  beforeDestroy() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame)
    clearTimeout(this._typeTimeout)
  },
  methods: {
    ...mapActions('user', ['login']),

    onMouseMove(e) {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
    },

    startTypewriter() {
      const text = this.typeTexts[this.typeTextIndex]
      if (this.typeCharIndex < text.length) {
        this.typeText = text.substring(0, this.typeCharIndex + 1)
        this.typeCharIndex++
        this._typeTimeout = setTimeout(() => this.startTypewriter(), 60)
      } else {
        this._typeTimeout = setTimeout(() => {
          this.typeCharIndex = 0
          this.typeText = ''
          this.typeTextIndex = (this.typeTextIndex + 1) % this.typeTexts.length
          this.startTypewriter()
        }, 2500)
      }
    },

    initParticles() {
      const canvas = this.$refs.canvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const count = 80
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.3,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.6 + 0.2,
          color: Math.random() > 0.5 ? '99,179,237' : '129,140,248',
        })
      }

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const pts = this.particles

        // 连线
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x
            const dy = pts[i].y - pts[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 130) {
              ctx.beginPath()
              ctx.strokeStyle = `rgba(99,179,237,${0.15 * (1 - dist / 130)})`
              ctx.lineWidth = 0.5
              ctx.moveTo(pts[i].x, pts[i].y)
              ctx.lineTo(pts[j].x, pts[j].y)
              ctx.stroke()
            }
          }
        }

        // 粒子
        pts.forEach((p) => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${p.color},${p.alpha})`
          ctx.fill()
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        })

        this.animFrame = requestAnimationFrame(draw)
      }
      draw()

      window.addEventListener('resize', () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      })
    },

    async submit() {
      const form = this.$refs.formRef
      if (!form) return
      try {
        await form.validate()
        this.loading = true
        await this.login(this.form)
        const redirect = this.$route.query.redirect || '/'
        this.$router.replace(String(redirect))
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
// ───────────── 基础变量 ─────────────
$neon-blue: #63b3ed;
$neon-purple: #818cf8;
$neon-cyan: #22d3ee;
$dark-bg: #020b18;
$card-bg: rgba(8, 20, 40, 0.85);
$border-glow: rgba(99, 179, 237, 0.35);

// ───────────── 全局容器 ─────────────
.login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $dark-bg;
  overflow: hidden;
  position: relative;
  font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
}

// ───────────── 粒子画布 ─────────────
.particle-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

// ───────────── 网格背景 ─────────────
.grid-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(rgba(99, 179, 237, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 179, 237, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}

// ───────────── 扫描线 ─────────────
.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, $neon-cyan, transparent);
  opacity: 0.3;
  z-index: 1;
  animation: scanDown 6s linear infinite;
}

@keyframes scanDown {
  0%   { top: -2px; }
  100% { top: 100vh; }
}

// ───────────── 光球 ─────────────
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}
.orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(99,179,237,0.12), transparent 70%);
  top: -10%; left: -10%;
  animation: floatOrb 12s ease-in-out infinite;
}
.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(129,140,248,0.14), transparent 70%);
  bottom: -5%; right: -5%;
  animation: floatOrb 15s ease-in-out infinite reverse;
}
.orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(34,211,238,0.1), transparent 70%);
  top: 50%; left: 60%;
  animation: floatOrb 10s ease-in-out infinite 3s;
}
@keyframes floatOrb {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -20px) scale(1.05); }
  66%       { transform: translate(-20px, 30px) scale(0.95); }
}

// ───────────── 卡片 ─────────────
.card {
  position: relative;
  z-index: 10;
  width: 420px;
  background: $card-bg;
  border-radius: 16px;
  padding: 36px 32px 28px;
  border: 1px solid $border-glow;
  box-shadow:
    0 0 0 1px rgba(99,179,237,0.1),
    0 0 40px rgba(99,179,237,0.08),
    0 20px 60px rgba(0,0,0,0.6),
    inset 0 1px 0 rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  transition: transform 0.1s ease;
  will-change: transform;
}

// 顶部光条
.card-glow-top {
  position: absolute;
  top: 0; left: 20px; right: 20px;
  height: 1px;
  background: linear-gradient(90deg, transparent, $neon-cyan, $neon-purple, transparent);
  border-radius: 50%;
}

// 角标装饰
.corner {
  position: absolute;
  width: 12px; height: 12px;
  border-color: $neon-cyan;
  border-style: solid;
  opacity: 0.7;
}
.corner-tl { top: 8px; left: 8px;  border-width: 2px 0 0 2px; }
.corner-tr { top: 8px; right: 8px; border-width: 2px 2px 0 0; }
.corner-bl { bottom: 8px; left: 8px;  border-width: 0 0 2px 2px; }
.corner-br { bottom: 8px; right: 8px; border-width: 0 2px 2px 0; }

// ───────────── 标题区 ─────────────
.title-wrap {
  margin-bottom: 20px;
  text-align: center;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  letter-spacing: 3px;
  color: $neon-cyan;
  border: 1px solid rgba(34,211,238,0.3);
  border-radius: 20px;
  padding: 3px 12px;
  margin-bottom: 14px;
  background: rgba(34,211,238,0.05);
}

.ai-dot {
  width: 6px; height: 6px;
  background: $neon-cyan;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
  box-shadow: 0 0 6px $neon-cyan;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}

.title {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 2px;
  line-height: 1;
  margin-bottom: 8px;
}

.title-gpt {
  color: #fff;
  text-shadow: 0 0 20px rgba(99,179,237,0.8), 0 0 40px rgba(99,179,237,0.4);
}

.title-web {
  background: linear-gradient(135deg, $neon-blue, $neon-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  letter-spacing: 1.5px;
  margin-bottom: 14px;
}

.title-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, $border-glow, transparent);
}

// ───────────── 状态栏打字机 ─────────────
.status-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: rgba(99,179,237,0.7);
  background: rgba(99,179,237,0.05);
  border: 1px solid rgba(99,179,237,0.12);
  border-radius: 6px;
  padding: 6px 12px;
  margin-bottom: 20px;
  min-height: 32px;
}

.status-dot {
  width: 6px; height: 6px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 6px #22c55e;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

.typewriter {
  &::after {
    content: '█';
    animation: blink 1s step-end infinite;
    color: $neon-cyan;
    margin-left: 1px;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

// ───────────── 表单 ─────────────
.ai-form {
  :deep(.el-form-item) {
    margin-bottom: 18px;
  }
  :deep(.el-form-item__error) {
    color: #f87171;
    font-size: 11px;
    padding-top: 4px;
  }
}

.form-item-wrap {
  .input-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(99,179,237,0.6);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .label-icon {
    color: $neon-cyan;
    font-size: 12px;
  }
}

.input-container {
  display: flex;
  align-items: center;
  border: 1px solid rgba(99,179,237,0.2);
  border-radius: 8px;
  background: rgba(99,179,237,0.03);
  overflow: hidden;
  transition: all 0.3s ease;

  &.focused {
    border-color: $neon-blue;
    background: rgba(99,179,237,0.07);
    box-shadow: 0 0 0 3px rgba(99,179,237,0.1), 0 0 20px rgba(99,179,237,0.08);
  }
}

.input-prefix {
  padding: 0 10px;
  font-size: 11px;
  color: rgba(99,179,237,0.5);
  white-space: nowrap;
  border-right: 1px solid rgba(99,179,237,0.15);
  line-height: 38px;
  height: 38px;
  display: flex;
  align-items: center;
}

.cyber-input {
  flex: 1;

  :deep(.el-input__wrapper) {
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 12px;
    border: none;
  }
  :deep(.el-input__inner) {
    background: transparent;
    color: #e2e8f0;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 13px;
    height: 38px;

    &::placeholder {
      color: rgba(255,255,255,0.2);
      font-style: italic;
    }
  }
  :deep(.el-input__suffix) {
    color: rgba(99,179,237,0.5);
  }
}

// ───────────── 登录按钮 ─────────────
.cyber-btn {
  width: 100%;
  margin-top: 8px;
  padding: 0;
  height: 46px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font-family: 'SF Mono', 'Fira Code', monospace;
  background: linear-gradient(135deg, #1e40af, #4f46e5, #7c3aed);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  outline: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #3b82f6, #818cf8, #a78bfa);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:not(:disabled)::before { opacity: 1; }
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(99,102,241,0.5), 0 0 0 1px rgba(129,140,248,0.4);
  }
  &:active:not(:disabled) { transform: translateY(0); }

  &.loading {
    cursor: not-allowed;
    opacity: 0.8;
  }
}

.btn-content, .btn-loading {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-arrow {
  transition: transform 0.3s ease;
}
.cyber-btn:hover .btn-arrow {
  transform: translateX(4px);
}

// 按钮扫光效果
.btn-scan {
  position: absolute;
  top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transform: skewX(-20deg);
  animation: scanBtn 3s ease-in-out infinite;
}

@keyframes scanBtn {
  0%   { left: -100%; }
  50%  { left: 150%; }
  100% { left: 150%; }
}

// 加载点
.loading-dots {
  display: flex; gap: 4px; align-items: center;
  span {
    width: 5px; height: 5px;
    background: #fff;
    border-radius: 50%;
    animation: dotBounce 1s ease-in-out infinite;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
}

@keyframes dotBounce {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50%       { transform: translateY(-4px); opacity: 1; }
}

// ───────────── 卡片底部 ─────────────
.card-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(99,179,237,0.1);
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: rgba(255,255,255,0.3);
  letter-spacing: 1px;
}

.footer-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  &.green { background: #22c55e; box-shadow: 0 0 5px #22c55e; }
  &.blue  { background: $neon-blue; box-shadow: 0 0 5px $neon-blue; }
  animation: pulse 2s ease-in-out infinite;
}
</style>
