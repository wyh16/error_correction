/**
 * nav.ts
 * 导航与布局类组件的 API 数据分片，均提取自 frontend/src/components/base 下各 SFC 源码。
 */
import type { ComponentApi } from '~/api-types'

export const NAV_API: ComponentApi[] = [
  {
    component: 'BaseTabs',
    props: [
      { name: 'modelValue', desc: '当前选中标签的 value（v-model）', type: 'string' },
      { name: 'items', desc: '标签项数组，含 value/label/icon/badge/disabled', type: 'TabItem[]', default: '[]' },
      { name: 'size', desc: '标签尺寸', type: "'sm' | 'md'", default: "'md'" },
      { name: 'type', desc: '外观类型：下划线或卡片式', type: "'line' | 'card'", default: "'line'" },
    ],
    emits: [
      { name: 'update:modelValue', desc: '选中标签变化时触发', payload: '(value: string)' },
    ],
  },
  {
    component: 'BaseBreadcrumb',
    props: [
      { name: 'items', desc: '面包屑项数组，含 label/icon/iconClass/to/href/onClick', type: 'BreadcrumbItem[]', default: '[]' },
      { name: 'separator', desc: '自定义分隔符文本，为空时使用默认箭头图标', type: 'string', default: "''" },
    ],
  },
  {
    component: 'BaseBreadcrumbItem',
    props: [
      { name: 'label', desc: '文本内容，默认插槽为空时显示', type: 'string', default: "''" },
      { name: 'icon', desc: '前置图标类名，如 fa-house', type: 'string', default: "''" },
      { name: 'current', desc: '是否为当前页（末项），高亮且不可点击', type: 'boolean', default: 'false' },
      { name: 'disabled', desc: '是否禁用', type: 'boolean', default: 'false' },
    ],
    emits: [
      { name: 'click', desc: '点击非当前、非禁用项时触发' },
    ],
    slots: [
      { name: 'default', desc: '自定义文本内容，回退为 label' },
    ],
  },
  {
    component: 'BaseAnchor',
    props: [
      { name: 'items', desc: '锚点项数组 { href, title, children? }，children 只支持一层', type: 'AnchorLink[]', default: '[]' },
      { name: 'offset', desc: '激活判定与点击滚动的顶部偏移（px）', type: 'number', default: '0' },
      { name: 'target', desc: '滚动容器选择器，为空时监听 window', type: 'string', default: "''" },
    ],
    emits: [
      { name: 'change', desc: '激活锚点变化时触发', payload: '(href: string)' },
    ],
  },
  {
    component: 'BaseStepper',
    props: [
      { name: 'modelValue', desc: '当前步骤的 value（v-model）', type: 'string | number', default: "''" },
      { name: 'steps', desc: '步骤项数组，含 value/label/description/status/disabled', type: 'StepItem[]', default: '[]' },
      { name: 'direction', desc: '排列方向', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
      { name: 'clickable', desc: '步骤是否可点击切换', type: 'boolean', default: 'true' },
    ],
    emits: [
      { name: 'update:modelValue', desc: '点击步骤切换时触发', payload: '(value: string | number)' },
      { name: 'change', desc: '步骤变化时触发，附带完整步骤对象', payload: '(value: string | number, step: StepItem)' },
    ],
  },
  {
    component: 'BaseAccordion',
    props: [
      { name: 'modelValue', desc: '展开面板的值（v-model）；multiple 时为数组，单选空串表示全部关闭', type: 'string | number | Array<string | number>', default: "''" },
      { name: 'items', desc: '面板项数组，含 value/label/icon/content/disabled', type: 'AccordionItem[]', default: '[]' },
      { name: 'multiple', desc: '是否允许同时展开多个面板', type: 'boolean', default: 'false' },
      { name: 'ghost', desc: '无边框幽灵样式', type: 'boolean', default: 'false' },
    ],
    emits: [
      { name: 'update:modelValue', desc: '展开状态变化时触发', payload: '(value: string | number | Array<string | number>)' },
      { name: 'change', desc: '展开状态变化时触发', payload: '(value: string | number | Array<string | number>)' },
    ],
    slots: [
      { name: 'item', desc: '自定义面板内容，作用域参数 { item }，回退为 item.content' },
    ],
  },
  {
    component: 'BaseAffix',
    props: [
      { name: 'offsetTop', desc: '吸附时距容器（或视口）顶部的偏移（px）', type: 'number', default: '0' },
      { name: 'offsetBottom', desc: '距底部偏移（px）；传入后按吸底模式工作，优先于 offsetTop', type: 'number', default: 'undefined' },
      { name: 'target', desc: '滚动容器选择器，为空时监听 window', type: 'string', default: "''" },
    ],
    emits: [
      { name: 'change', desc: '吸附状态切换时触发', payload: '(fixed: boolean)' },
    ],
    slots: [
      { name: 'default', desc: '固钉内容，作用域参数 { fixed }' },
    ],
  },
  {
    component: 'BaseBackTop',
    props: [
      { name: 'target', desc: '滚动容器的 CSS 选择器，为空时监听 window 滚动', type: 'string', default: "''" },
      { name: 'visibilityHeight', desc: '滚动距离超过该值（px）才显示按钮', type: 'number', default: '200' },
      { name: 'right', desc: '距视口右侧的偏移（px）', type: 'number', default: '24' },
      { name: 'bottom', desc: '距视口底部的偏移（px）', type: 'number', default: '24' },
    ],
    emits: [
      { name: 'click', desc: '点击按钮触发回到顶部时触发' },
    ],
    slots: [
      { name: 'default', desc: '自定义按钮内容，回退为向上箭头图标' },
    ],
  },
  {
    component: 'BaseLink',
    props: [
      { name: 'href', desc: '链接地址', type: 'string', default: "''" },
      { name: 'to', desc: '站内路由：传入后渲染 RouterLink，优先级高于 href', type: 'RouteLocationRaw', default: 'undefined' },
      { name: 'type', desc: '语义配色类型', type: "'default' | 'accent' | 'success' | 'warning' | 'danger'", default: "'default'" },
      { name: 'underline', desc: '下划线策略', type: "'hover' | 'always' | 'never'", default: "'hover'" },
      { name: 'disabled', desc: '禁用态：拦截跳转并置灰', type: 'boolean', default: 'false' },
      { name: 'icon', desc: '前置图标类名，如 fa-link', type: 'string', default: "''" },
      { name: 'external', desc: '外链：新窗口打开并附加右上箭头标识', type: 'boolean', default: 'false' },
    ],
    slots: [
      { name: 'default', desc: '链接文本内容' },
    ],
  },
  {
    component: 'BaseDivider',
    props: [
      { name: 'label', desc: '分割线中的文字标签（仅水平方向生效）', type: 'string', default: "''" },
      { name: 'orientation', desc: '分割线方向', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
      { name: 'dashed', desc: '虚线样式', type: 'boolean', default: 'false' },
      { name: 'labelPlacement', desc: '标签位置', type: "'left' | 'center' | 'right'", default: "'center'" },
    ],
  },
  {
    component: 'BaseSurface',
    props: [
      { name: 'as', desc: '根元素渲染的标签名', type: 'string', default: "'div'" },
      { name: 'hoverable', desc: '悬停时是否加深背景', type: 'boolean', default: 'true' },
    ],
    slots: [
      { name: 'default', desc: '容器内容' },
    ],
  },
  {
    component: 'BasePanel',
    props: [
      { name: 'bodyClass', desc: '主体区域附加类名', type: 'string', default: "'p-4'" },
      { name: 'headerClass', desc: '头部区域附加类名', type: 'string', default: "'flex h-16 items-center px-4 py-3'" },
      { name: 'footerClass', desc: '底部区域附加类名', type: 'string', default: "'p-3'" },
      { name: 'scrollBody', desc: '主体是否可垂直滚动', type: 'boolean', default: 'true' },
    ],
    slots: [
      { name: 'header', desc: '面板头部内容，为空时不渲染 header' },
      { name: 'default', desc: '面板主体内容' },
      { name: 'footer', desc: '面板底部内容，为空时不渲染 footer' },
    ],
  },
  {
    component: 'BasePanelTitle',
    props: [
      { name: 'as', desc: '根元素渲染的标签名', type: 'string', default: "'h3'" },
      { name: 'icon', desc: '前置图标类名', type: 'string', default: "''" },
    ],
    slots: [
      { name: 'default', desc: '标题文本内容' },
    ],
  },
  {
    component: 'BaseLogo',
    props: [
      { name: 'size', desc: 'Logo 尺寸', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { name: 'breathe', desc: '是否开启呼吸发光动画', type: 'boolean', default: 'false' },
    ],
  },
  {
    component: 'BaseStatusPill',
    props: [
      { name: 'label', desc: '徽标文本', type: 'string', default: "''" },
      { name: 'loading', desc: '加载中状态（琥珀色 + 旋转图标）', type: 'boolean', default: 'false' },
      { name: 'ok', desc: '正常状态（绿色对勾）；均为 false 时显示异常态', type: 'boolean', default: 'false' },
      { name: 'placeholder', desc: '占位状态（灰色沙漏）', type: 'boolean', default: 'false' },
    ],
  },
  {
    component: 'BaseResizablePanels',
    props: [
      { name: 'modelValue', desc: '第一面板占比百分比（v-model）', type: 'number', default: '45' },
      { name: 'min', desc: '第一面板最小占比（%）', type: 'number', default: '20' },
      { name: 'max', desc: '第一面板最大占比（%）', type: 'number', default: '80' },
      { name: 'direction', desc: '分割方向', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
    ],
    emits: [
      { name: 'update:modelValue', desc: '拖拽分隔条时触发', payload: '(value: number)' },
      { name: 'change', desc: '拖拽分隔条时触发', payload: '(value: number)' },
    ],
    slots: [
      { name: 'left', desc: '第一面板（左/上）内容' },
      { name: 'right', desc: '第二面板（右/下）内容' },
    ],
  },
  {
    component: 'BaseScrollbar',
    props: [
      { name: 'maxHeight', desc: '容器最大高度，数字按 px 处理', type: 'string | number', default: "''" },
      { name: 'always', desc: 'true 常显 thumb；false 仅 hover 或滚动时显示', type: 'boolean', default: 'false' },
    ],
    slots: [
      { name: 'default', desc: '滚动区域内容' },
    ],
  },
  {
    component: 'BaseMarquee',
    props: [
      { name: 'text', desc: '单条文本或多条消息数组', type: 'string | string[]', default: "''" },
      { name: 'speed', desc: '滚动速度（px/s），内容长短不同速度保持一致', type: 'number', default: '50' },
      { name: 'direction', desc: '滚动方向', type: "'left' | 'right'", default: "'left'" },
      { name: 'pauseOnHover', desc: '悬停时是否暂停滚动', type: 'boolean', default: 'true' },
      { name: 'icon', desc: '左侧固定图标（不参与滚动），传 fa-* 类名', type: 'string', default: "''" },
    ],
  },
  {
    component: 'BaseTransfer',
    props: [
      { name: 'modelValue', desc: '目标侧（右列）已持有的 value 数组（v-model）', type: 'Array<string | number>', default: '[]' },
      { name: 'options', desc: '全量候选项 { label, value, disabled? }', type: 'TransferOption[]', default: '[]' },
      { name: 'titles', desc: '两列标题', type: 'string[]', default: "['源列表', '目标列表']" },
      { name: 'searchable', desc: '是否在两列头部下方显示按 label 过滤的搜索框', type: 'boolean', default: 'false' },
      { name: 'disabled', desc: '整体禁用', type: 'boolean', default: 'false' },
    ],
    emits: [
      { name: 'update:modelValue', desc: '移动项后目标侧值变化时触发', payload: '(value: Array<string | number>)' },
      { name: 'change', desc: '移动完成时触发，附带方向与被移动的值', payload: "(value: Array<string | number>, direction: 'toTarget' | 'toSource', moved: Array<string | number>)" },
    ],
  },
]
