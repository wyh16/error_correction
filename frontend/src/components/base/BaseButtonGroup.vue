<script setup lang="ts">
/**
 * BaseButtonGroup.vue
 * 按钮组：attached 模式用 CSS 拼接直接子按钮（去内侧圆角 + 叠 1px 边框）形成一体外观。
 *
 * 取舍：不通过 provide 向 BaseButton 注入尺寸/变体（避免改动 BaseButton 源码），
 * 组内按钮的 size / variant 一致性由使用者自行保证，推荐统一使用 secondary 变体。
 */
interface Props {
  /** true 拼接为一体；false 仅做 gap-2 松散排列 */
  attached?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  attached: true,
})
</script>

<template>
  <div
    class="inline-flex items-center"
    :class="props.attached ? 'base-button-group--attached' : 'gap-2'"
    role="group"
  >
    <slot />
  </div>
</template>

<style scoped>
/* 拼接模式：先全部去圆角，再由首尾恢复外侧圆角 */
.base-button-group--attached :deep(:is(button, a)) {
  border-radius: 0;
}

/* 相邻按钮左移 1px 叠掉双边框，视觉上只保留一条分隔线 */
.base-button-group--attached :deep(:is(button, a) + :is(button, a)) {
  margin-left: -1px;
}

.base-button-group--attached :deep(:is(button, a):first-child) {
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
}

.base-button-group--attached :deep(:is(button, a):last-child) {
  border-top-right-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
}

/* hover / 键盘聚焦时抬高层级，防止高亮边框被相邻按钮的负 margin 盖住 */
.base-button-group--attached :deep(:is(button, a):hover),
.base-button-group--attached :deep(:is(button, a):focus-visible) {
  position: relative;
  z-index: 1;
}
</style>
