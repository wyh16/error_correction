<script setup lang="ts">
import BaseCodeBlock from '@/components/base/BaseCodeBlock.vue'
import BaseCopyButton from '@/components/base/BaseCopyButton.vue'
import BaseKbd from '@/components/base/BaseKbd.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const sampleCode = `import BaseButton from '@/components/base/BaseButton.vue'

<BaseButton variant="primary" size="sm" @click="submit">
  提交
</BaseButton>`
</script>

<template>
  <DemoBlock title="代码块" description="title 显示文件名，language 在无 title 时显示；copyable 控制右上角复制按钮。">
    <div class="grid gap-4">
      <BaseCodeBlock :code="sampleCode" language="vue" title="ButtonDemo.vue" />
      <BaseCodeBlock code="npm run dev" language="bash" />
      <BaseCodeBlock code="const secret = 'not-copyable'" language="ts" :copyable="false" />
    </div>
  </DemoBlock>

  <DemoBlock title="复制按钮" description="BaseCopyButton 可独立使用，label / copiedLabel 自定义文案，复制成功触发 copy 事件。">
    <div class="flex flex-wrap items-center gap-3">
      <BaseCopyButton text="独立使用的复制按钮" />
      <BaseCopyButton text="https://example.com/share/123" label="复制链接" copied-label="链接已复制" />
    </div>
  </DemoBlock>

  <DemoBlock title="快捷键" description="keys 接受 'Ctrl+K' 形式的字符串或数组。">
    <div class="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-[#a8adb7]">
      <span class="inline-flex items-center gap-2">打开命令面板 <BaseKbd keys="Ctrl+K" /></span>
      <span class="inline-flex items-center gap-2">保存 <BaseKbd :keys="['Ctrl', 'S']" /></span>
      <span class="inline-flex items-center gap-2">退出 <BaseKbd keys="Esc" /></span>
    </div>
  </DemoBlock>
</template>
