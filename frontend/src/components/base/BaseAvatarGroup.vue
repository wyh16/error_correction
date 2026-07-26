<script lang="ts">
export interface AvatarGroupItem {
  src?: string
  name?: string
  icon?: string
  tone?: 'accent' | 'neutral' | 'blue' | 'emerald' | 'rose'
}
</script>

<script setup lang="ts">
/**
 * BaseAvatarGroup.vue
 * 头像组：重叠堆叠展示多个 BaseAvatar，超出 max 折叠为 +N 徽章。
 */
import { computed } from 'vue'
import BaseAvatar from './BaseAvatar.vue'
import BaseTooltip from './BaseTooltip.vue'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg'

interface Props {
  /** 每项透传给 BaseAvatar：{ src?, name?, icon?, tone? } */
  avatars?: AvatarGroupItem[]
  /** 最多展示个数，0 表示全部展示不折叠 */
  max?: number
  /** 统一应用到每个头像的尺寸（xs | sm | md | lg） */
  size?: AvatarSize
  overlap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  avatars: () => [],
  max: 0,
  size: 'md',
  overlap: true,
})

// 负间距跟头像尺寸联动，保证不同 size 下重叠比例观感一致
const spaceClass: Record<AvatarSize, string> = {
  xs: '-space-x-1.5',
  sm: '-space-x-2',
  md: '-space-x-2.5',
  lg: '-space-x-3',
}

// +N 徽章的尺寸与 BaseAvatar 的 sizeClass 保持一致
const counterSizeClass: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-xs',
  lg: 'h-12 w-12 text-sm',
}

const folded = computed(() => props.max > 0 && props.avatars.length > props.max)
const visible = computed(() => (folded.value ? props.avatars.slice(0, props.max) : props.avatars))
const rest = computed(() => (folded.value ? props.avatars.slice(props.max) : []))
const restLabel = computed(() => rest.value.map(item => item.name || '未命名').join('、'))

// 重叠时用描边把上层头像从下层头像里分离出来，颜色贴合亮 / 暗背景
const ringClass = 'ring-2 ring-white dark:ring-[#101013]'
</script>

<template>
  <div class="flex items-center" :class="overlap ? spaceClass[size] || spaceClass.md : 'gap-2'">
    <span
      v-for="(item, index) in visible"
      :key="index"
      class="inline-flex rounded-full"
      :class="overlap ? ringClass : ''"
    >
      <BaseAvatar v-bind="item" :size="size" />
    </span>
    <!-- 折叠徽章：悬停显示未展示成员的名单 -->
    <BaseTooltip v-if="rest.length" :text="restLabel">
      <span
        class="inline-flex shrink-0 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-500 dark:bg-white/[0.08] dark:text-[#8a8f98]"
        :class="[counterSizeClass[size] || counterSizeClass.md, overlap ? ringClass : '']"
      >
        +{{ rest.length }}
      </span>
    </BaseTooltip>
  </div>
</template>
