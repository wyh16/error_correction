<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BaseResult from '@/components/base/BaseResult.vue'
import DemoBlock from '~/components/DemoBlock.vue'

const statusCode = `<BaseResult status="success" title="提交成功" description="错题已保存，AI 解析将在几分钟内完成。" />
<BaseResult status="error" title="支付失败" description="银行卡余额不足，请更换支付方式后重试。" />
<BaseResult status="warning" title="存在未完成项" description="还有 3 道错题未填写答案，提交后将无法继续编辑。" />
<BaseResult status="info" title="功能内测中" description="错题智能归因功能正在灰度发布，敬请期待。" />`

const actionCode = `<BaseResult status="success" title="订阅成功" description="已开通高级会员，即刻体验全部 AI 批改能力。">
  <BaseButton size="sm">前往工作台</BaseButton>
  <BaseButton size="sm" variant="ghost">查看订单</BaseButton>
</BaseResult>`

const customIconCode = `<BaseResult
  status="info"
  icon="fa-hourglass-half"
  title="报告生成中"
  description="学习报告正在生成，完成后会通过站内信通知你。"
/>`
</script>

<template>
  <DemoBlock title="四种状态" description="status 支持 success / error / warning / info，自动匹配默认图标与配色。" :code="statusCode">
    <div class="grid gap-6 sm:grid-cols-2">
      <BaseResult status="success" title="提交成功" description="错题已保存，AI 解析将在几分钟内完成。" />
      <BaseResult status="error" title="支付失败" description="银行卡余额不足，请更换支付方式后重试。" />
      <BaseResult status="warning" title="存在未完成项" description="还有 3 道错题未填写答案，提交后将无法继续编辑。" />
      <BaseResult status="info" title="功能内测中" description="错题智能归因功能正在灰度发布，敬请期待。" />
    </div>
  </DemoBlock>

  <DemoBlock title="操作按钮" description="默认插槽渲染在描述下方的操作行，常放主行动与次级入口。" :code="actionCode">
    <BaseResult status="success" title="订阅成功" description="已开通高级会员，即刻体验全部 AI 批改能力。">
      <BaseButton size="sm">前往工作台</BaseButton>
      <BaseButton size="sm" variant="ghost">查看订单</BaseButton>
    </BaseResult>
  </DemoBlock>

  <DemoBlock title="自定义图标" description="icon 传入 fa-* 类名可覆盖状态默认图标，配色仍跟随 status。" :code="customIconCode">
    <BaseResult status="info" icon="fa-hourglass-half" title="报告生成中" description="学习报告正在生成，完成后会通过站内信通知你。" />
  </DemoBlock>
</template>
