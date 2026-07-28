<script setup lang="ts">
import { provide } from 'vue'
import { Z_TOOLTIP } from '@/composables/useOverlay'

interface Props {
  delay?: number
  offset?: number
  zIndex?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  offset: 8,
  zIndex: Z_TOOLTIP,
  disabled: false,
})

provide('baseTooltipProvider', props)
</script>

<template>
  <slot />
</template>
