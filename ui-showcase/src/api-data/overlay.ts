/**
 * overlay.ts
 * 浮层 / 反馈 / 按钮类组件的 API 数据（提取自 frontend/src/components/base 各 SFC 源码）。
 */
import type { ComponentApi } from '~/api-types'

export const OVERLAY_API: ComponentApi[] = [
  {
    component: 'BaseModal',
    props: [
      { name: 'open', desc: '是否打开弹窗', type: 'boolean', default: 'false' },
      { name: 'title', desc: '弹窗标题（必填）', type: 'string' },
      { name: 'icon', desc: '头部图标类名（fa-*）', type: 'string', default: "''" },
      { name: 'iconClass', desc: '图标颜色类', type: 'string', default: "'text-blue-600 dark:text-blue-400'" },
      { name: 'iconBg', desc: '图标容器背景类', type: 'string', default: "'bg-blue-50 dark:bg-blue-500/10'" },
      { name: 'maxWidth', desc: '面板最大宽度类', type: 'string', default: "'max-w-md'" },
      { name: 'width', desc: "数值型宽度（如 '640px'），传入后覆盖 maxWidth 类", type: 'string', default: "''" },
      { name: 'bodyClass', desc: '内容区内边距类', type: 'string', default: "'px-6 py-5'" },
      { name: 'blurBackdrop', desc: '遮罩是否带模糊效果', type: 'boolean', default: 'true' },
      { name: 'sidebarOffset', desc: '侧边栏偏移量（px）', type: 'number | null', default: 'null' },
      { name: 'persistent', desc: '持久模式：点击遮罩 / ESC 不关闭，仅晃动面板提示', type: 'boolean', default: 'false' },
      { name: 'maskClosable', desc: '点击遮罩是否关闭；显式传入时优先级高于 persistent', type: 'boolean', default: 'undefined' },
      { name: 'closeOnEsc', desc: '按 ESC 是否关闭；显式传入时优先级高于 persistent', type: 'boolean', default: 'undefined' },
      { name: 'showClose', desc: '是否显示默认头部右上角的关闭按钮', type: 'boolean', default: 'true' },
    ],
    emits: [
      { name: 'close', desc: '请求关闭弹窗时触发' },
    ],
    slots: [
      { name: 'default', desc: '弹窗主体内容' },
      { name: 'header', desc: '自定义头部，作用域参数 { close }' },
      { name: 'icon', desc: '自定义头部图标' },
      { name: 'footer', desc: '底部操作区' },
    ],
  },
  {
    component: 'ImageModal',
    props: [
      { name: 'open', desc: '是否打开预览弹窗', type: 'boolean', default: 'false' },
      { name: 'src', desc: '预览图片地址', type: 'string', default: "''" },
      { name: 'scale', desc: '当前缩放倍数（支持 v-model:scale）', type: 'number', default: '1' },
    ],
    emits: [
      { name: 'close', desc: '点击遮罩或按 ESC 请求关闭时触发' },
      { name: 'update:scale', desc: '滚轮缩放时同步缩放倍数', payload: '(scale: number)' },
    ],
  },
  {
    component: 'BaseDrawer',
    props: [
      { name: 'open', desc: '是否打开抽屉', type: 'boolean', default: 'false' },
      { name: 'title', desc: '头部标题', type: 'string', default: "''" },
      { name: 'description', desc: '头部描述文字', type: 'string', default: "''" },
      { name: 'placement', desc: '抽屉停靠方向', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'" },
      { name: 'widthClass', desc: '左右方向的宽度类', type: 'string', default: "'w-full max-w-md'" },
      { name: 'size', desc: "数值型宽/高（如 '480px'）：left/right 作用于宽度并覆盖 widthClass，top/bottom 作用于高度", type: 'string', default: "''" },
      { name: 'closeOnBackdrop', desc: '点击遮罩是否关闭', type: 'boolean', default: 'true' },
      { name: 'persistent', desc: '持久模式：点击遮罩不关闭', type: 'boolean', default: 'false' },
      { name: 'showClose', desc: '是否显示头部关闭按钮', type: 'boolean', default: 'true' },
    ],
    emits: [
      { name: 'close', desc: '请求关闭抽屉时触发' },
    ],
    slots: [
      { name: 'default', desc: '抽屉主体内容' },
      { name: 'footer', desc: '底部操作区' },
    ],
  },
  {
    component: 'BaseTooltip',
    props: [
      { name: 'text', desc: '提示文本（必填）', type: 'string' },
      { name: 'placement', desc: '浮层弹出方向，空间不足时自动翻转到对侧', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'" },
      { name: 'align', desc: '浮层与触发元素的对齐方式', type: "'left' | 'center' | 'right'", default: "'center'" },
      { name: 'offset', desc: '浮层与触发元素的间距（px）', type: 'number', default: '8' },
      { name: 'disabled', desc: '是否禁用提示', type: 'boolean', default: 'false' },
      { name: 'delay', desc: '悬停多少毫秒后再显示；null 表示跟随 Provider 配置（无 Provider 时立即显示）', type: 'number | null', default: 'null' },
      { name: 'trigger', desc: '触发方式：hover 悬停 / click 点击切换 / manual 完全由 visible 控制', type: "'hover' | 'click' | 'manual'", default: "'hover'" },
      { name: 'hideDelay', desc: '隐藏前的延迟毫秒数（hover 触发时离开后延迟隐藏）', type: 'number', default: '0' },
      { name: 'visible', desc: 'manual 模式下的受控显示状态（支持 v-model:visible）', type: 'boolean', default: 'false' },
    ],
    emits: [
      { name: 'update:visible', desc: '非 manual 模式下内部显示状态变化时同步', payload: '(visible: boolean)' },
    ],
    slots: [
      { name: 'default', desc: '触发元素' },
      { name: 'content', desc: '自定义提示内容，默认渲染 text' },
    ],
  },
  {
    component: 'BaseTooltipProvider',
    props: [
      { name: 'delay', desc: '为后代 Tooltip 提供的全局显示延迟（ms）', type: 'number', default: '0' },
      { name: 'offset', desc: '为后代 Tooltip 提供的全局间距（px）', type: 'number', default: '8' },
      { name: 'zIndex', desc: '为后代 Tooltip 提供的层级', type: 'number', default: 'Z_TOOLTIP' },
      { name: 'disabled', desc: '全局禁用后代 Tooltip', type: 'boolean', default: 'false' },
    ],
    slots: [
      { name: 'default', desc: '被包裹的内容' },
    ],
  },
  {
    component: 'BasePopover',
    props: [
      { name: 'modelValue', desc: '受控打开状态（支持 v-model）', type: 'boolean', default: 'false' },
      { name: 'placement', desc: '面板弹出方向', type: "'top' | 'bottom'", default: "'bottom'" },
      { name: 'align', desc: '面板与触发器的对齐方式', type: "'left' | 'center' | 'right'", default: "'left'" },
      { name: 'widthClass', desc: '面板宽度类', type: 'string', default: "'w-80'" },
      { name: 'panelClass', desc: '面板外观类', type: 'string', default: "'rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-black/10 dark:border-white/[0.08] dark:bg-[#1b1b1f] dark:shadow-black/40'" },
    ],
    emits: [
      { name: 'update:modelValue', desc: '打开状态变化时同步', payload: '(value: boolean)' },
      { name: 'open', desc: '面板打开时触发' },
      { name: 'close', desc: '面板关闭时触发' },
    ],
    slots: [
      { name: 'trigger', desc: '触发元素，作用域参数 { open }' },
      { name: 'default', desc: '面板内容，作用域参数 { close }' },
    ],
  },
  {
    component: 'BasePopconfirm',
    props: [
      { name: 'title', desc: '确认标题', type: 'string', default: "'确认操作？'" },
      { name: 'description', desc: '补充描述文字', type: 'string', default: "''" },
      { name: 'confirmText', desc: '确认按钮文字', type: 'string', default: "'确认'" },
      { name: 'cancelText', desc: '取消按钮文字', type: 'string', default: "'取消'" },
      { name: 'danger', desc: '确认按钮是否为危险红色样式', type: 'boolean', default: 'false' },
      { name: 'placement', desc: '浮层弹出方向：bottom 触发器下方 / top 上方', type: "'top' | 'bottom'", default: "'bottom'" },
    ],
    emits: [
      { name: 'confirm', desc: '点击确认按钮时触发' },
      { name: 'cancel', desc: '点击取消按钮时触发' },
    ],
    slots: [
      { name: 'default', desc: '触发元素' },
    ],
  },
  {
    component: 'BaseDropdown',
    props: [
      { name: 'modelValue', desc: '受控打开状态（支持 v-model）', type: 'boolean', default: 'false' },
      { name: 'position', desc: '菜单弹出方向', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'" },
      { name: 'align', desc: '菜单与触发器的对齐方式', type: "'left' | 'right' | 'center' | 'start' | 'end'", default: "'right'" },
      { name: 'width', desc: '菜单宽度类', type: 'string', default: "'w-48'" },
      { name: 'offset', desc: "控制外边距的类，如 'mt-1'", type: 'string', default: "'mt-1'" },
      { name: 'panelClass', desc: '菜单面板外观类', type: 'string', default: "'rounded-lg border bg-white shadow-lg dark:bg-[#15151e] dark:border-white/[0.08] py-1'" },
      { name: 'wrapperClass', desc: '根容器附加类', type: 'string', default: "'inline-block'" },
    ],
    emits: [
      { name: 'update:modelValue', desc: '打开状态变化时同步', payload: '(value: boolean)' },
    ],
    slots: [
      { name: 'trigger', desc: '触发元素，作用域参数 { isOpen, toggle }' },
      { name: 'background', desc: '菜单面板背景装饰层' },
      { name: 'default', desc: '菜单内容，作用域参数 { close }' },
    ],
  },
  {
    component: 'BaseMenu',
    props: [
      { name: 'modelValue', desc: '当前选中项的值（支持 v-model）', type: 'string | number', default: "''" },
      { name: 'items', desc: '菜单项列表', type: 'MenuItem[]', default: '[]' },
    ],
    emits: [
      { name: 'update:modelValue', desc: '选中项变化时同步', payload: '(value: string | number)' },
      { name: 'select', desc: '点击非禁用菜单项时触发', payload: '(item: MenuItem)' },
    ],
  },
  {
    component: 'BaseAlert',
    props: [
      { name: 'tone', desc: '提示语气色调', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'" },
      { name: 'title', desc: '提示标题', type: 'string', default: "''" },
      { name: 'description', desc: '提示描述文字', type: 'string', default: "''" },
      { name: 'icon', desc: '自定义图标类名，缺省时按 tone 使用默认图标', type: 'string', default: "''" },
      { name: 'closable', desc: '是否显示关闭按钮', type: 'boolean', default: 'false' },
      { name: 'showIcon', desc: '是否显示左侧图标', type: 'boolean', default: 'true' },
    ],
    emits: [
      { name: 'close', desc: '点击关闭按钮时触发' },
    ],
    slots: [
      { name: 'default', desc: '补充内容区' },
    ],
  },
  {
    component: 'BaseToastContainer',
    props: [
      { name: 'toasts', desc: '当前展示的 toast 列表', type: 'ToastItem[]', default: '[]' },
      { name: 'sidebarOffset', desc: '左侧 toast 堆避开侧边栏的偏移量（px）', type: 'number', default: '0' },
      { name: 'position', desc: 'toast 堆停靠的视口角落', type: "'bottom-right' | 'top-right' | 'bottom-left' | 'top-left'", default: "'bottom-right'" },
      { name: 'pauseOnHover', desc: '悬停 toast 堆时暂停自动关闭（派发 pause/resume 事件，由持有定时器的一方处理）', type: 'boolean', default: 'false' },
    ],
    emits: [
      { name: 'dismiss', desc: '点击关闭或操作按钮后请求移除某条 toast', payload: '(id: number)' },
      { name: 'pause', desc: '鼠标移入且 pauseOnHover 开启时触发' },
      { name: 'resume', desc: '鼠标移出且 pauseOnHover 开启时触发' },
    ],
  },
  {
    component: 'BaseLoading',
    props: [
      { name: 'visible', desc: '是否显示全局加载遮罩', type: 'boolean', default: 'true' },
    ],
    emits: [
      { name: 'after-enter', desc: '进入过渡结束后触发' },
    ],
  },
  {
    component: 'BaseLoadingBar',
    props: [
      { name: 'height', desc: '进度条高度（px）', type: 'number', default: '3' },
      { name: 'tone', desc: '进度条色调；error() 时固定切 rose', type: "'accent' | 'emerald' | 'amber' | 'rose' | 'blue'", default: "'accent'" },
    ],
    exposes: [
      { name: 'start', desc: '开始加载；重复调用安全，中途再 start 会先重置再重新推进', signature: 'start(): Promise<void>' },
      { name: 'finish', desc: '成功收尾：冲到 100% 后渐隐', signature: 'finish(): void' },
      { name: 'error', desc: '失败收尾：切为 rose 色并冲到 100% 后渐隐', signature: 'error(): void' },
    ],
  },
  {
    component: 'BaseSpin',
    props: [
      { name: 'spinning', desc: '是否处于加载中', type: 'boolean', default: 'true' },
      { name: 'size', desc: '指示器尺寸', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { name: 'tip', desc: '加载提示文字', type: 'string', default: "''" },
      { name: 'fullscreen', desc: '全屏模式：Teleport 到 body，覆盖整个视口', type: 'boolean', default: 'false' },
    ],
    slots: [
      { name: 'default', desc: '被包裹的内容，加载中降透明加模糊并拦截交互' },
    ],
  },
  {
    component: 'BaseTour',
    props: [
      { name: 'open', desc: '是否开启引导（支持 v-model:open）', type: 'boolean', default: 'false' },
      { name: 'steps', desc: '引导步骤列表', type: 'TourStep[]', default: '[]' },
      { name: 'maskClosable', desc: '点击遮罩是否关闭', type: 'boolean', default: 'true' },
    ],
    emits: [
      { name: 'update:open', desc: '关闭引导时同步打开状态', payload: '(open: boolean)' },
      { name: 'change', desc: '切换到新步骤时触发', payload: '(index: number)' },
      { name: 'finish', desc: '最后一步点击完成时触发' },
    ],
  },
  {
    component: 'BaseCommandPalette',
    props: [
      { name: 'open', desc: '是否打开命令面板（支持 v-model:open）', type: 'boolean', default: 'false' },
      { name: 'items', desc: '命令项列表', type: 'CommandItem[]', default: '[]' },
      { name: 'placeholder', desc: '搜索输入框占位文字', type: 'string', default: "'搜索命令'" },
    ],
    emits: [
      { name: 'update:open', desc: '关闭面板时同步打开状态', payload: '(open: boolean)' },
      { name: 'select', desc: '选中命令项时触发（随后执行其 action 并关闭）', payload: '(item: CommandItem)' },
    ],
  },
  {
    component: 'BaseButton',
    props: [
      { name: 'variant', desc: '视觉变体', type: "'primary' | 'secondary' | 'cta' | 'ghost' | 'danger' | 'glass'", default: "'primary'" },
      { name: 'size', desc: '按钮尺寸（高度、字号和圆角）', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { name: 'to', desc: 'RouterLink 目标，传入后渲染为 RouterLink', type: 'string', default: "''" },
      { name: 'href', desc: '普通链接地址，传入后渲染为 a 标签', type: 'string', default: "''" },
      { name: 'type', desc: '原生按钮类型，仅渲染为 button 时生效', type: "'button' | 'submit' | 'reset'", default: "'button'" },
      { name: 'disabled', desc: '禁用态；链接形态用 aria-disabled 并拦截点击', type: 'boolean', default: 'false' },
      { name: 'loading', desc: '加载中：显示 spinner 并禁用点击', type: 'boolean', default: 'false' },
      { name: 'icon', desc: "前置图标，如 'fa-plus'", type: 'string', default: "''" },
      { name: 'block', desc: '是否占满整行', type: 'boolean', default: 'false' },
    ],
    slots: [
      { name: 'default', desc: '按钮内容' },
    ],
  },
  {
    component: 'BaseToolbarButton',
    props: [
      { name: 'icon', desc: '前置图标类名（fa-*）', type: 'string', default: "''" },
      { name: 'variant', desc: '视觉变体', type: "'neutral' | 'primary' | 'danger'", default: "'neutral'" },
      { name: 'active', desc: '是否处于激活高亮态', type: 'boolean', default: 'false' },
      { name: 'disabled', desc: '是否禁用', type: 'boolean', default: 'false' },
      { name: 'title', desc: '原生 title 提示', type: 'string', default: "''" },
    ],
    emits: [
      { name: 'click', desc: '点击按钮时触发', payload: '(event: MouseEvent)' },
    ],
    slots: [
      { name: 'default', desc: '按钮文本内容' },
    ],
  },
  {
    component: 'BaseButtonGroup',
    props: [
      { name: 'attached', desc: 'true 拼接为一体；false 仅做 gap-2 松散排列', type: 'boolean', default: 'true' },
    ],
    slots: [
      { name: 'default', desc: '组内按钮' },
    ],
  },
  {
    component: 'BaseCopyButton',
    props: [
      { name: 'text', desc: '点击后写入剪贴板的文本', type: 'string', default: "''" },
      { name: 'label', desc: '按钮默认文字', type: 'string', default: "'复制'" },
      { name: 'copiedLabel', desc: '复制成功后的短暂提示文字', type: 'string', default: "'已复制'" },
    ],
    emits: [
      { name: 'copy', desc: '复制成功时触发', payload: '(text: string)' },
      { name: 'error', desc: '写入剪贴板失败时触发', payload: '(error: unknown)' },
    ],
  },
  {
    component: 'BaseFloatButton',
    props: [
      { name: 'icon', desc: '主按钮图标', type: 'string', default: "'fa-plus'" },
      { name: 'tone', desc: '主按钮实心底色', type: "'accent' | 'emerald' | 'amber' | 'rose' | 'blue'", default: "'accent'" },
      { name: 'position', desc: '距视口右侧 / 底部的偏移（px）', type: '{ right?: number; bottom?: number }', default: '{ right: 24, bottom: 24 }' },
      { name: 'tooltip', desc: '悬停主按钮时左侧的气泡提示文字', type: 'string', default: "''" },
      { name: 'menu', desc: '子菜单项，非空时点击主按钮切换展开', type: 'FloatButtonMenuItem[]', default: '[]' },
      { name: 'badge', desc: '右上角徽标数字，0 不显示，超过 99 显示 99+', type: 'number', default: '0' },
    ],
    emits: [
      { name: 'click', desc: '无子菜单时点击主按钮触发' },
      { name: 'select', desc: '点击子菜单项时触发', payload: '(item: FloatButtonMenuItem)' },
    ],
  },
]
