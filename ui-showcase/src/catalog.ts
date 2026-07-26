import { defineAsyncComponent, defineComponent, h, type Component } from 'vue'
import BaseSkeleton from '@/components/base/BaseSkeleton.vue'

/**
 * 文档站目录：每个条目对应一个组件文档页。
 * 关系密切的组件（如 Radio 与 RadioGroup）合并在同一页展示，与主流组件库文档一致。
 */
export type CatalogEntry = {
  id: string
  title: string
  components: string[]
  description: string
  page: Component
  /** 相关组件条目 id（手工标注），正文底部渲染为交叉链接；缺省不显示。 */
  related?: string[]
}

export type CatalogGroup = {
  id: string
  label: string
  entries: CatalogEntry[]
}

/** 异步页面加载中的骨架占位：标题行 + 两块内容区，避免切页白屏。 */
const PageLoading = defineComponent({
  name: 'CatalogPageLoading',
  render: () =>
    h('div', { class: 'grid gap-4', 'aria-busy': 'true' }, [
      h(BaseSkeleton, { variant: 'text', lines: 2 }),
      h(BaseSkeleton, { variant: 'rect' }),
      h(BaseSkeleton, { variant: 'rect' }),
    ]),
})

/** 异步页面加载失败的兜底：错误提示 + 重新加载。 */
const PageLoadError = defineComponent({
  name: 'CatalogPageLoadError',
  render: () =>
    h(
      'div',
      {
        role: 'alert',
        class:
          'grid justify-items-center gap-3 rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center dark:border-white/[0.08]',
      },
      [
        h('i', {
          class: 'fa-solid fa-triangle-exclamation text-xl text-slate-400 dark:text-[#62666d]',
          'aria-hidden': 'true',
        }),
        h('p', { class: 'text-sm text-slate-500 dark:text-[#8a8f98]' }, '页面加载失败，请检查网络后重试。'),
        h(
          'button',
          {
            type: 'button',
            class:
              'rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/[0.08] dark:text-[#d0d6e0] dark:hover:bg-white/[0.06]',
            onClick: () => window.location.reload(),
          },
          '重新加载',
        ),
      ],
    ),
})

/** 动态 import 包一层 defineAsyncComponent：慢网络先出骨架，失败自动重试两次后显示兜底。 */
const page = (loader: () => Promise<{ default: Component }>) =>
  defineAsyncComponent({
    loader,
    loadingComponent: PageLoading,
    // 短暂延迟：快速命中缓存时不闪骨架
    delay: 150,
    errorComponent: PageLoadError,
    onError(_error, retry, fail, attempts) {
      if (attempts <= 2) retry()
      else fail()
    },
  })

export const CATALOG: CatalogGroup[] = [
  {
    id: 'guide',
    label: '指南',
    entries: [
      { id: 'guide-start', title: '快速上手', components: [], description: '按需引入、全局注册、技术栈与组件约定。', page: page(() => import('~/pages/GuideStartPage.vue')) },
      { id: 'guide-theme', title: '主题定制', components: [], description: '主题色、深浅色模式和 CSS 变量原理。', page: page(() => import('~/pages/GuideThemePage.vue')) },
      { id: 'playground', title: '演练场', components: [], description: '实时调整 Props 并生成对应模板代码。', page: page(() => import('~/pages/PlaygroundPage.vue')) },
      { id: 'patterns', title: '场景示例', components: [], description: '登录表单、数据看板、列表工具栏等组合模式。', page: page(() => import('~/pages/PatternsPage.vue')) },
    ],
  },
  {
    id: 'layout',
    label: '布局容器',
    entries: [
      { id: 'card', title: 'Card 卡片', components: ['BaseCard', 'BaseSurface'], description: '通用卡片容器和轻量表面容器。', page: page(() => import('~/pages/CardPage.vue')) },
      { id: 'panel', title: 'Panel 面板', components: ['BasePanel', 'BasePanelTitle'], description: '带标题栏的面板结构。', page: page(() => import('~/pages/PanelPage.vue')) },
      { id: 'divider', title: 'Divider 分隔线', components: ['BaseDivider'], description: '切分内容区块的水平分隔线。', page: page(() => import('~/pages/DividerPage.vue')) },
      { id: 'resizable', title: 'ResizablePanels 分栏', components: ['BaseResizablePanels'], description: '可拖拽调整比例的左右分栏。', page: page(() => import('~/pages/ResizablePage.vue')) },
      { id: 'scrollbar', title: 'Scrollbar 滚动条', components: ['BaseScrollbar'], description: '覆盖式细滚动条容器。', page: page(() => import('~/pages/ScrollbarPage.vue')) },
      { id: 'infinite-scroll', title: 'InfiniteScroll 无限滚动', components: ['BaseInfiniteScroll'], description: '滚动到底自动加载更多。', page: page(() => import('~/pages/InfiniteScrollPage.vue')) },
    ],
  },
  {
    id: 'form',
    label: '表单输入',
    entries: [
      { id: 'input', title: 'Input 输入框', components: ['BaseInput', 'BaseSearchInput', 'BaseTextarea'], description: '文本、密码、搜索和多行输入。', related: ['number-input', 'tags-input', 'form'], page: page(() => import('~/pages/InputPage.vue')) },
      { id: 'pin-input', title: 'PinInput 验证码', components: ['BasePinInput'], description: '分段验证码输入，支持粘贴与自动前进。', page: page(() => import('~/pages/PinInputPage.vue')) },
      { id: 'number-input', title: 'NumberInput 数字输入', components: ['BaseNumberInput'], description: '带步进按钮的数字输入。', page: page(() => import('~/pages/NumberInputPage.vue')) },
      { id: 'mention', title: 'Mention 提及', components: ['BaseMention'], description: '@ 提及输入，输入触发符后弹出候选项。', page: page(() => import('~/pages/MentionPage.vue')) },
      { id: 'select', title: 'Select 选择器', components: ['BaseSelect', 'BaseSearchableSelect', 'BaseCombobox'], description: '下拉选择、可搜索多选和 Combobox。', related: ['cascader', 'tree-select', 'transfer'], page: page(() => import('~/pages/SelectPage.vue')) },
      { id: 'cascader', title: 'Cascader 级联选择', components: ['BaseCascader'], description: '多级联动选择，适合省市区与分类。', related: ['select', 'tree-select'], page: page(() => import('~/pages/CascaderPage.vue')) },
      { id: 'tree-select', title: 'TreeSelect 树选择', components: ['BaseTreeSelect'], description: '树形结构下拉选择。', related: ['select', 'cascader', 'tree'], page: page(() => import('~/pages/TreeSelectPage.vue')) },
      { id: 'transfer', title: 'Transfer 穿梭框', components: ['BaseTransfer'], description: '双栏勾选穿梭，支持搜索过滤。', page: page(() => import('~/pages/TransferPage.vue')) },
      { id: 'checkbox', title: 'Checkbox 复选框', components: ['BaseCheckbox'], description: '多选、布尔开关和中间态。', related: ['checkbox-group', 'radio', 'switch'], page: page(() => import('~/pages/CheckboxPage.vue')) },
      { id: 'checkbox-group', title: 'CheckboxGroup 复选组', components: ['BaseCheckboxGroup'], description: '选项组批量渲染，支持数量约束。', page: page(() => import('~/pages/CheckboxGroupPage.vue')) },
      { id: 'radio', title: 'Radio 单选框', components: ['BaseRadio', 'BaseRadioGroup'], description: '单选框与单选组。', related: ['checkbox', 'switch', 'tabs'], page: page(() => import('~/pages/RadioPage.vue')) },
      { id: 'switch', title: 'Switch 开关', components: ['BaseSwitch'], description: '布尔状态切换开关。', page: page(() => import('~/pages/SwitchPage.vue')) },
      { id: 'rate', title: 'Rate 评分', components: ['BaseRate'], description: '星级评分，支持半星和自定义图标。', page: page(() => import('~/pages/RatePage.vue')) },
      { id: 'slider', title: 'Slider 滑块', components: ['BaseSlider'], description: '数值范围滑动选择。', page: page(() => import('~/pages/SliderPage.vue')) },
      { id: 'color-picker', title: 'ColorPicker 颜色选择', components: ['BaseColorPicker'], description: '色板与预设色选择。', page: page(() => import('~/pages/ColorPickerPage.vue')) },
      { id: 'date-time', title: 'DateTime 日期时间', components: ['BaseDatePicker', 'BaseTimePicker'], description: '日期与时间选择控件。', related: ['date-range', 'calendar'], page: page(() => import('~/pages/DateTimePage.vue')) },
      { id: 'date-range', title: 'DateRangePicker 日期范围', components: ['BaseDateRangePicker'], description: '起止日期范围选择。', related: ['date-time', 'calendar'], page: page(() => import('~/pages/DateRangePickerPage.vue')) },
      { id: 'tags-input', title: 'TagsInput 标签输入', components: ['BaseTagsInput'], description: '回车录入多个标签。', page: page(() => import('~/pages/TagsInputPage.vue')) },
      { id: 'upload', title: 'Upload 上传', components: ['BaseUpload'], description: '拖拽或选择文件上传。', page: page(() => import('~/pages/UploadPage.vue')) },
      { id: 'form', title: 'Form 表单', components: ['BaseForm', 'BaseFormItem', 'BaseFieldMessage'], description: '表单容器、表单项和字段信息。', related: ['input', 'select', 'checkbox'], page: page(() => import('~/pages/FormPage.vue')) },
    ],
  },
  {
    id: 'feedback',
    label: '反馈浮层',
    entries: [
      { id: 'alert', title: 'Alert 提示', components: ['BaseAlert'], description: '页面内四种状态提示。', page: page(() => import('~/pages/AlertPage.vue')) },
      { id: 'modal', title: 'Modal 对话框', components: ['BaseModal'], description: '居中弹窗和焦点管理。', related: ['drawer', 'popover', 'tour'], page: page(() => import('~/pages/ModalPage.vue')) },
      { id: 'drawer', title: 'Drawer 抽屉', components: ['BaseDrawer'], description: '侧边详情、筛选和表单浮层。', related: ['modal', 'popover'], page: page(() => import('~/pages/DrawerPage.vue')) },
      { id: 'popover', title: 'Popover 气泡卡片', components: ['BasePopover', 'BasePopconfirm'], description: '轻量浮层与二次确认。', related: ['tooltip', 'modal', 'menu'], page: page(() => import('~/pages/PopoverPage.vue')) },
      { id: 'tooltip', title: 'Tooltip 文字提示', components: ['BaseTooltip', 'BaseTooltipProvider'], description: '悬停说明和全局浮层配置。', related: ['popover', 'ellipsis'], page: page(() => import('~/pages/TooltipPage.vue')) },
      { id: 'toast', title: 'Toast 通知', components: ['BaseToastContainer'], description: '全局通知队列。', related: ['alert', 'result', 'loading-bar'], page: page(() => import('~/pages/ToastPage.vue')) },
      { id: 'progress', title: 'Progress 进度条', components: ['BaseProgress'], description: '进度展示，支持配色和尺寸。', related: ['circle-progress', 'spin', 'loading-bar'], page: page(() => import('~/pages/ProgressPage.vue')) },
      { id: 'circle-progress', title: 'CircleProgress 环形进度', components: ['BaseCircleProgress'], description: 'SVG 环形进度，支持不定进度动画。', page: page(() => import('~/pages/CircleProgressPage.vue')) },
      { id: 'skeleton', title: 'Skeleton 骨架屏', components: ['BaseSkeleton'], description: '加载占位骨架。', page: page(() => import('~/pages/SkeletonPage.vue')) },
      { id: 'loading', title: 'Loading 加载', components: ['BaseLoading'], description: '全局加载遮罩。', page: page(() => import('~/pages/LoadingPage.vue')) },
      { id: 'spin', title: 'Spin 局部加载', components: ['BaseSpin'], description: '包裹内容的局部加载指示。', page: page(() => import('~/pages/SpinPage.vue')) },
      { id: 'loading-bar', title: 'LoadingBar 顶部加载条', components: ['BaseLoadingBar'], description: '方法驱动的顶部加载进度条。', page: page(() => import('~/pages/LoadingBarPage.vue')) },
      { id: 'command-palette', title: 'CommandPalette 命令面板', components: ['BaseCommandPalette'], description: '全局命令搜索和快捷动作。', page: page(() => import('~/pages/CommandPalettePage.vue')) },
      { id: 'tour', title: 'Tour 漫游引导', components: ['BaseTour'], description: '遮罩挖孔的分步新手引导。', page: page(() => import('~/pages/TourPage.vue')) },
    ],
  },
  {
    id: 'display',
    label: '数据展示',
    entries: [
      { id: 'avatar', title: 'Avatar 头像', components: ['BaseAvatar', 'BaseBadge'], description: '头像与角标。', page: page(() => import('~/pages/AvatarPage.vue')) },
      { id: 'avatar-group', title: 'AvatarGroup 头像组', components: ['BaseAvatarGroup'], description: '堆叠头像组，超出显示 +N。', page: page(() => import('~/pages/AvatarGroupPage.vue')) },
      { id: 'tag', title: 'Tag 标签', components: ['BaseTag', 'BaseStatusPill'], description: '标签与状态徽标。', related: ['tags-input', 'ribbon', 'avatar'], page: page(() => import('~/pages/TagPage.vue')) },
      { id: 'ribbon', title: 'Ribbon 缎带徽标', components: ['BaseRibbon'], description: '角落缎带徽章，包裹任意内容。', page: page(() => import('~/pages/RibbonPage.vue')) },
      { id: 'stat', title: 'Stat 统计', components: ['BaseStat'], description: '数据面板统计卡片。', page: page(() => import('~/pages/StatPage.vue')) },
      { id: 'number-animation', title: 'NumberAnimation 数值动画', components: ['BaseNumberAnimation'], description: '数字缓动递增动画。', page: page(() => import('~/pages/NumberAnimationPage.vue')) },
      { id: 'countdown', title: 'Countdown 倒计时', components: ['BaseCountdown'], description: '倒计时显示，结束触发 finish。', page: page(() => import('~/pages/CountdownPage.vue')) },
      { id: 'descriptions', title: 'Descriptions 描述列表', components: ['BaseDescriptions'], description: '成组展示字段与值的详情列表。', page: page(() => import('~/pages/DescriptionsPage.vue')) },
      { id: 'table', title: 'Table 表格', components: ['BaseTable', 'BaseDataTable'], description: '基础表格与数据表格。', related: ['pagination', 'empty', 'virtual-list'], page: page(() => import('~/pages/TablePage.vue')) },
      { id: 'list', title: 'List 列表', components: ['BaseListGroup', 'BaseListItem'], description: '设置列表分组与条目。', page: page(() => import('~/pages/ListPage.vue')) },
      { id: 'accordion', title: 'Accordion 折叠面板', components: ['BaseAccordion'], description: '折叠内容、FAQ 和配置分组。', page: page(() => import('~/pages/AccordionPage.vue')) },
      { id: 'tree', title: 'Tree 树形控件', components: ['BaseTree'], description: '层级目录和树形选择。', page: page(() => import('~/pages/TreePage.vue')) },
      { id: 'virtual-list', title: 'VirtualList 虚拟列表', components: ['BaseVirtualList'], description: '大列表虚拟渲染。', page: page(() => import('~/pages/VirtualListPage.vue')) },
      { id: 'timeline', title: 'Timeline 时间轴', components: ['BaseTimeline'], description: '按时间顺序展示事件流。', page: page(() => import('~/pages/TimelinePage.vue')) },
      { id: 'calendar', title: 'Calendar 日历', components: ['BaseCalendar'], description: '日历面板和日期选择。', page: page(() => import('~/pages/CalendarPage.vue')) },
      { id: 'image', title: 'Image 图片', components: ['BaseImage'], description: '懒加载、失败兜底与点击预览。', page: page(() => import('~/pages/ImagePage.vue')) },
      { id: 'carousel', title: 'Carousel 轮播', components: ['BaseCarousel'], description: '自动播放轮播图，支持指示器与箭头。', page: page(() => import('~/pages/CarouselPage.vue')) },
      { id: 'ellipsis', title: 'Ellipsis 文本省略', components: ['BaseEllipsis'], description: '多行省略，可展开或 Tooltip 显示全文。', page: page(() => import('~/pages/EllipsisPage.vue')) },
      { id: 'highlight', title: 'Highlight 关键词高亮', components: ['BaseHighlight'], description: '在文本中高亮匹配关键词。', page: page(() => import('~/pages/HighlightPage.vue')) },
      { id: 'marquee', title: 'Marquee 滚动公告', components: ['BaseMarquee'], description: '横向无缝滚动公告。', page: page(() => import('~/pages/MarqueePage.vue')) },
      { id: 'watermark', title: 'Watermark 水印', components: ['BaseWatermark'], description: '内容区重复水印背景。', page: page(() => import('~/pages/WatermarkPage.vue')) },
      { id: 'result', title: 'Result 结果', components: ['BaseResult'], description: '操作结果的成功 / 失败 / 警告反馈块。', page: page(() => import('~/pages/ResultPage.vue')) },
      { id: 'empty', title: 'EmptyState 空状态', components: ['BaseEmptyState'], description: '空数据占位。', related: ['result', 'skeleton', 'table'], page: page(() => import('~/pages/EmptyStatePage.vue')) },
      { id: 'code', title: 'Code 代码', components: ['BaseCodeBlock', 'BaseCopyButton', 'BaseKbd'], description: '代码块、复制按钮和快捷键。', page: page(() => import('~/pages/CodePage.vue')) },
      { id: 'media', title: 'Media 品牌媒体', components: ['BaseLogo', 'ImageModal'], description: '品牌 Logo 与图片预览。', page: page(() => import('~/pages/MediaPage.vue')) },
    ],
  },
  {
    id: 'navigation',
    label: '导航操作',
    entries: [
      { id: 'button', title: 'Button 按钮', components: ['BaseButton', 'BaseToolbarButton'], description: '主要、次要、幽灵 / 玻璃变体和工具栏按钮。', related: ['button-group', 'float-button', 'link', 'code'], page: page(() => import('~/pages/ButtonPage.vue')) },
      { id: 'button-group', title: 'ButtonGroup 按钮组', components: ['BaseButtonGroup'], description: '拼接一体外观的按钮组。', related: ['button', 'tabs'], page: page(() => import('~/pages/ButtonGroupPage.vue')) },
      { id: 'link', title: 'Link 链接', components: ['BaseLink'], description: '语义配色的文字链接。', page: page(() => import('~/pages/LinkPage.vue')) },
      { id: 'tabs', title: 'Tabs 页签', components: ['BaseTabs', 'BaseSegmented'], description: '页签与分段控制。', related: ['menu', 'stepper', 'button-group'], page: page(() => import('~/pages/TabsPage.vue')) },
      { id: 'breadcrumb', title: 'Breadcrumb 面包屑', components: ['BaseBreadcrumb', 'BaseBreadcrumbItem'], description: '路径导航。', page: page(() => import('~/pages/BreadcrumbPage.vue')) },
      { id: 'pagination', title: 'Pagination 分页', components: ['BasePagination'], description: '页码切换。', related: ['table', 'infinite-scroll'], page: page(() => import('~/pages/PaginationPage.vue')) },
      { id: 'stepper', title: 'Stepper 步骤条', components: ['BaseStepper'], description: '流程步骤指示。', page: page(() => import('~/pages/StepperPage.vue')) },
      { id: 'menu', title: 'Menu 菜单', components: ['BaseMenu', 'BaseDropdown'], description: '导航菜单与下拉菜单。', related: ['tabs', 'breadcrumb', 'command-palette'], page: page(() => import('~/pages/MenuPage.vue')) },
      { id: 'anchor', title: 'Anchor 锚点导航', components: ['BaseAnchor'], description: '页内目录，滚动时高亮当前章节。', page: page(() => import('~/pages/AnchorPage.vue')) },
      { id: 'affix', title: 'Affix 固钉', components: ['BaseAffix'], description: '滚动到位后吸附固定。', page: page(() => import('~/pages/AffixPage.vue')) },
      { id: 'float-button', title: 'FloatButton 悬浮按钮', components: ['BaseFloatButton'], description: '右下角悬浮操作按钮与快捷菜单。', page: page(() => import('~/pages/FloatButtonPage.vue')) },
      { id: 'back-top', title: 'BackTop 回到顶部', components: ['BaseBackTop'], description: '滚动后浮现的返回顶部按钮。', page: page(() => import('~/pages/BackTopPage.vue')) },
    ],
  },
]

export const ALL_ENTRIES: CatalogEntry[] = CATALOG.flatMap(group => group.entries)

export function findEntry(id: string): CatalogEntry | undefined {
  return ALL_ENTRIES.find(entry => entry.id === id)
}
