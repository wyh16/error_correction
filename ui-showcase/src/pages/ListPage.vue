<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseListGroup from '@/components/base/BaseListGroup.vue'
import BaseListItem from '@/components/base/BaseListItem.vue'
import BasePopconfirm from '@/components/base/BasePopconfirm.vue'
import BaseSwitch from '@/components/base/BaseSwitch.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const notify = inject('notify') as (type?: string) => void
const switchOn = ref(true)
</script>

<template>
  <DemoBlock title="设置列表" description="BaseListGroup + BaseListItem 的组合，label / description / value 三段式布局。">
    <BaseListGroup title="设置列表" description="BaseListGroup + BaseListItem 的组合示例。">
      <BaseListItem label="显示密度" description="影响列表与表格的行高" value="紧凑" />
      <BaseListItem label="自动保存" description="离开页面前保存草稿">
        <BaseSwitch v-model="switchOn" />
      </BaseListItem>
      <BaseListItem label="可点击条目" description="interactive 后整行可点击并有 hover" interactive show-arrow @click="notify('info')" />
      <BaseListItem label="危险操作" description="二次确认弹层" danger>
        <BasePopconfirm title="确认清空？" description="仅为演示，不会有实际影响。" confirm-text="清空" danger @confirm="notify('error')">
          <BaseButton variant="ghost" size="sm">清空</BaseButton>
        </BasePopconfirm>
      </BaseListItem>
    </BaseListGroup>
  </DemoBlock>

  <DemoBlock title="卡片模式与骨架屏" description="card 让每个条目独立成卡片；skeleton 显示加载占位。">
    <div class="grid gap-3">
      <BaseListItem label="卡片条目" description="card 模式带独立边框" card value="独立卡片" />
      <BaseListItem skeleton />
      <BaseListItem skeleton />
    </div>
  </DemoBlock>
</template>
