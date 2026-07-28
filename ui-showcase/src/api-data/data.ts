/**
 * api-data/data.ts
 * 数据展示类组件的 API 数据分片，从 frontend/src/components/base/ 各 SFC 源码提取。
 */
import type { ComponentApi } from '~/api-types'

export const DATA_API: ComponentApi[] = [
  {
    component: 'BaseTable',
    props: [
      { name: 'columns', desc: '列定义数组，key 取行字段，render 优先于字段取值', type: 'TableColumn[]', default: '[]' },
      { name: 'rows', desc: '表格行数据，任意键值对象数组', type: 'TableRow[]', default: '[]' },
      { name: 'rowKey', desc: '行唯一标识取值字段名', type: 'string', default: "'id'" },
      { name: 'emptyText', desc: '无数据时的占位文案', type: 'string', default: "'暂无数据'" },
      { name: 'loading', desc: '加载中状态，显示 spinner 占位行', type: 'boolean', default: 'false' },
      { name: 'compact', desc: '紧凑模式，减小单元格纵向内边距', type: 'boolean', default: 'false' },
      { name: 'sortKey', desc: '当前排序列的 key', type: 'string', default: "''" },
      { name: 'sortDirection', desc: '当前排序方向，空串表示未排序', type: "'asc' | 'desc' | ''", default: "''" },
      { name: 'striped', desc: '斑马纹，偶数行加浅色背景', type: 'boolean', default: 'false' },
      { name: 'stickyHeader', desc: '吸顶表头，需配合 maxHeight 形成滚动容器', type: 'boolean', default: 'false' },
      { name: 'maxHeight', desc: 'stickyHeader 时滚动容器的最大高度', type: 'string', default: "'360px'" },
      { name: 'selectable', desc: '首列渲染 checkbox，依赖 rowKey 取行标识', type: 'boolean', default: 'false' },
      { name: 'selectedKeys', desc: '已选行 key 集合，配合 v-model:selectedKeys 使用', type: 'Array<string | number>', default: '[]' },
    ],
    emits: [
      { name: 'sort', desc: '点击可排序列表头时触发', payload: '(key: string)' },
      { name: 'row-click', desc: '点击表格行时触发', payload: '(row: TableRow)' },
      { name: 'update:selectedKeys', desc: '行选择变化时抛出新的已选 key 集合', payload: '(keys: Array<string | number>)' },
    ],
    slots: [
      { name: 'cell-[key]', desc: '按列 key 自定义单元格内容，作用域参数 { row, value }' },
    ],
  },
  {
    component: 'BaseDataTable',
    props: [
      { name: 'columns', desc: '列定义数组，透传给内层 BaseTable', type: 'TableColumn[]', default: '[]' },
      { name: 'rows', desc: '表格行数据；远程模式下即当前页数据', type: 'TableRow[]', default: '[]' },
      { name: 'rowKey', desc: '行唯一标识取值字段名', type: 'string', default: "'id'" },
      { name: 'searchable', desc: '是否显示搜索框', type: 'boolean', default: 'true' },
      { name: 'pageSize', desc: '每页条数', type: 'number', default: '5' },
      { name: 'loading', desc: '加载中状态', type: 'boolean', default: 'false' },
      { name: 'remote', desc: '远程模式：不做客户端搜索/排序/分页，只上抛事件由外部驱动 rows', type: 'boolean', default: 'false' },
      { name: 'total', desc: '远程模式下的数据总条数，用于计算分页', type: 'number', default: '0' },
      { name: 'striped', desc: '斑马纹，透传给内层 BaseTable', type: 'boolean', default: 'false' },
      { name: 'compact', desc: '紧凑模式，透传给内层 BaseTable', type: 'boolean', default: 'false' },
      { name: 'stickyHeader', desc: '吸顶表头，透传给内层 BaseTable', type: 'boolean', default: 'false' },
      { name: 'emptyText', desc: '无数据时的占位文案', type: 'string', default: "'暂无数据'" },
      { name: 'selectable', desc: '行选择模式，透传给内层 BaseTable', type: 'boolean', default: 'false' },
      { name: 'selectedKeys', desc: '已选行 key 集合，配合 v-model:selectedKeys 使用', type: 'Array<string | number>', default: '[]' },
    ],
    emits: [
      { name: 'row-click', desc: '点击表格行时触发', payload: '(row: TableRow)' },
      { name: 'update:selectedKeys', desc: '行选择变化时抛出新的已选 key 集合', payload: '(keys: Array<string | number>)' },
      { name: 'search-change', desc: '远程模式下搜索关键词变化时触发', payload: '(keyword: string)' },
      { name: 'sort-change', desc: '远程模式下排序变化时触发', payload: "(key: string, direction: 'asc' | 'desc' | '')" },
      { name: 'page-change', desc: '远程模式下页码变化时触发', payload: '(page: number)' },
    ],
    slots: [
      { name: 'toolbar', desc: '搜索框右侧的工具栏区域' },
      { name: 'cell-[key]', desc: '按列 key 自定义单元格内容，作用域参数 { row, value }' },
    ],
  },
  {
    component: 'BaseTree',
    props: [
      { name: 'items', desc: '树形数据，节点为 { value, label, icon?, children? }', type: 'TreeItem[]', default: '[]' },
      { name: 'modelValue', desc: '当前选中节点的 value，支持 v-model', type: 'string | number', default: "''" },
      { name: 'defaultExpanded', desc: '非受控模式下默认展开的节点 value 集合', type: 'Array<string | number>', default: '[]' },
      { name: 'expanded', desc: '受控展开集合：传入后展开状态完全由外部驱动（配合 v-model:expanded）', type: 'Array<string | number>', default: 'undefined' },
    ],
    emits: [
      { name: 'update:modelValue', desc: '选中节点变化时触发', payload: '(value: string | number)' },
      { name: 'update:expanded', desc: '受控模式下展开集合变化时触发', payload: '(values: Array<string | number>)' },
      { name: 'select', desc: '点击节点时抛出完整节点对象', payload: '(item: TreeItem)' },
    ],
  },
  {
    component: 'BaseVirtualList',
    props: [
      { name: 'items', desc: '列表数据，可为对象（含 id / label）或原始值', type: 'VirtualListItem[]', default: '[]' },
      { name: 'itemHeight', desc: '每项固定高度（px）', type: 'number', default: '44' },
      { name: 'height', desc: '滚动容器高度（px）', type: 'number', default: '280' },
      { name: 'overscan', desc: '可视区上下额外渲染的缓冲项数', type: 'number', default: '4' },
    ],
    slots: [
      { name: 'default', desc: '自定义列表项渲染，作用域参数 { item, index }' },
    ],
  },
  {
    component: 'BaseTimeline',
    props: [
      { name: 'items', desc: '事件项数组，每项为 { label, description?, time?, icon?, tone? }', type: 'TimelineItem[]', default: '[]' },
      { name: 'pending', desc: '末尾追加一个脉冲占位节点，表示时间轴还在继续', type: 'boolean', default: 'false' },
    ],
  },
  {
    component: 'BaseDescriptions',
    props: [
      { name: 'items', desc: '数据项数组，每项为 { label, value }', type: 'DescriptionItem[]', default: '[]' },
      { name: 'columns', desc: 'sm 及以上屏幕的列数（1-4），小屏固定单列', type: '1 | 2 | 3 | 4', default: '2' },
      { name: 'title', desc: '列表上方的标题，为空时不渲染', type: 'string', default: "''" },
      { name: 'bordered', desc: '带边框的表格风格：每个单元格有边框，标签列使用浅色背景', type: 'boolean', default: 'false' },
      { name: 'size', desc: '尺寸：sm 更紧凑的内边距和字号', type: "'sm' | 'md'", default: "'md'" },
    ],
  },
  {
    component: 'BasePagination',
    props: [
      { name: 'page', desc: '当前页码，支持 v-model:page', type: 'number', default: '1' },
      { name: 'totalPages', desc: '总页数；total > 0 时被忽略', type: 'number', default: '0' },
      { name: 'total', desc: '数据总条数：大于 0 时优先据此计算总页数（配合 pageSize）', type: 'number', default: '0' },
      { name: 'pageSize', desc: '每页条数，配合 total 计算总页数；支持 v-model:pageSize', type: 'number', default: '10' },
      { name: 'pageSizeOptions', desc: '每页条数可选项，非空时渲染切换下拉', type: 'number[]', default: '[]' },
      { name: 'showQuickJumper', desc: '显示跳页输入框', type: 'boolean', default: 'false' },
      { name: 'disabled', desc: '禁用整个分页器', type: 'boolean', default: 'false' },
      { name: 'showTotal', desc: '数据总条数，大于 0 时在左侧显示「共 N 条」（与 total 独立）', type: 'number', default: '0' },
      { name: 'siblingCount', desc: '当前页两侧各显示多少个相邻页码', type: 'number', default: '1' },
    ],
    emits: [
      { name: 'update:page', desc: '页码变化时触发', payload: '(page: number)' },
      { name: 'update:pageSize', desc: '每页条数变化时触发', payload: '(size: number)' },
      { name: 'change', desc: '页码变化时触发，与 update:page 同步', payload: '(page: number)' },
    ],
  },
  {
    component: 'BaseCalendar',
    props: [
      { name: 'modelValue', desc: '选中日期，格式 YYYY-MM-DD，支持 v-model', type: 'string', default: "''" },
      { name: 'min', desc: '可选的最早日期（YYYY-MM-DD）', type: 'string', default: "''" },
      { name: 'max', desc: '可选的最晚日期（YYYY-MM-DD）', type: 'string', default: "''" },
      { name: 'disabledDate', desc: '自定义禁用逻辑：返回 true 的日期不可点选并置灰', type: '((date: Date) => boolean) | null', default: 'null' },
    ],
    emits: [
      { name: 'update:modelValue', desc: '选中日期变化时触发', payload: '(value: string)' },
      { name: 'change', desc: '选中日期时抛出格式化字符串与 Date 对象', payload: '(value: string, date: Date)' },
    ],
  },
  {
    component: 'BaseStat',
    props: [
      { name: 'label', desc: '统计项名称', type: 'string' },
      { name: 'value', desc: '统计数值', type: 'string | number', default: '0' },
      { name: 'suffix', desc: '数值后缀（如单位）', type: 'string', default: "''" },
      { name: 'hint', desc: '数值下方的补充说明', type: 'string', default: "''" },
      { name: 'icon', desc: '图标 fa-* 类名', type: 'string', default: "''" },
      { name: 'tone', desc: '图标底色调', type: "'accent' | 'blue' | 'rose' | 'amber' | 'emerald' | 'orange'", default: "'accent'" },
    ],
    slots: [
      { name: 'icon', desc: '自定义图标区内容，覆盖 icon prop 渲染' },
    ],
  },
  {
    component: 'BaseTag',
    props: [
      { name: 'tone', desc: '色调', type: "'neutral' | 'accent' | 'rose' | 'amber' | 'emerald' | 'blue'", default: "'neutral'" },
      { name: 'size', desc: '尺寸', type: "'xs' | 'sm'", default: "'sm'" },
      { name: 'active', desc: '激活态，外圈高亮描边', type: 'boolean', default: 'false' },
      { name: 'closable', desc: '是否显示右侧关闭按钮，点击后抛出 close 事件（由调用方决定移除逻辑）', type: 'boolean', default: 'false' },
      { name: 'icon', desc: "前置图标，传 fa-* 类名，如 'fa-tag'", type: 'string', default: "''" },
    ],
    emits: [
      { name: 'close', desc: '点击关闭按钮时触发' },
    ],
    slots: [
      { name: 'default', desc: '标签文本内容' },
    ],
  },
  {
    component: 'BaseBadge',
    props: [
      { name: 'value', desc: '徽标内容，数字超过 max 显示为 max+', type: 'string | number', default: "''" },
      { name: 'tone', desc: '色调', type: "'accent' | 'neutral' | 'rose' | 'amber' | 'emerald' | 'blue'", default: "'accent'" },
      { name: 'dot', desc: '小圆点模式，不显示数值', type: 'boolean', default: 'false' },
      { name: 'max', desc: '数字上限，超过显示 max+', type: 'number', default: '99' },
      { name: 'showZero', desc: 'value 为数字 0 时是否仍显示徽标（默认隐藏）', type: 'boolean', default: 'false' },
      { name: 'offset', desc: '位置微调 [x, y]，单位 px，正值向右/向下偏移', type: '[number, number]', default: 'undefined' },
    ],
    slots: [
      { name: 'default', desc: '被徽标附着的内容' },
    ],
  },
  {
    component: 'BaseAvatar',
    props: [
      { name: 'src', desc: '头像图片地址，加载失败回退到 initials / icon', type: 'string', default: "''" },
      { name: 'name', desc: '用户名，无图片时取首字母展示', type: 'string', default: "''" },
      { name: 'icon', desc: '占位图标 fa-* 类名', type: 'string', default: "''" },
      { name: 'size', desc: '尺寸', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'" },
      { name: 'tone', desc: '占位底色调', type: "'accent' | 'neutral' | 'blue' | 'emerald' | 'rose'", default: "'accent'" },
      { name: 'shape', desc: '形状：circle 圆形 | square 圆角方形', type: "'circle' | 'square'", default: "'circle'" },
      { name: 'status', desc: '右下角状态点：online | offline | busy，空字符串不显示', type: "'online' | 'offline' | 'busy' | ''", default: "''" },
    ],
  },
  {
    component: 'BaseAvatarGroup',
    props: [
      { name: 'avatars', desc: '每项透传给 BaseAvatar：{ src?, name?, icon?, tone? }', type: 'AvatarGroupItem[]', default: '[]' },
      { name: 'max', desc: '最多展示个数，0 表示全部展示不折叠', type: 'number', default: '0' },
      { name: 'size', desc: '统一应用到每个头像的尺寸', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'" },
      { name: 'overlap', desc: '头像是否重叠堆叠', type: 'boolean', default: 'true' },
    ],
  },
  {
    component: 'BaseCard',
    props: [
      { name: 'padding', desc: '内边距 Tailwind 类', type: 'string', default: "'p-4'" },
      { name: 'rounded', desc: '圆角 Tailwind 类', type: 'string', default: "'rounded-lg'" },
    ],
    slots: [
      { name: 'default', desc: '卡片内容' },
    ],
  },
  {
    component: 'BaseListGroup',
    props: [
      { name: 'title', desc: '分组标题', type: 'string', default: "''" },
      { name: 'description', desc: '分组下方的描述说明', type: 'string', default: "''" },
      { name: 'borderless', desc: '无边框模式，不使用 BaseSurface 容器', type: 'boolean', default: 'false' },
    ],
    slots: [
      { name: 'header', desc: '自定义分组标题区，覆盖 title 渲染' },
      { name: 'default', desc: '列表条目内容' },
    ],
  },
  {
    component: 'BaseListItem',
    props: [
      { name: 'label', desc: '条目标题', type: 'string', default: "''" },
      { name: 'description', desc: '标题下方的描述', type: 'string', default: "''" },
      { name: 'value', desc: '右侧展示值', type: 'string', default: "''" },
      { name: 'interactive', desc: '可点击态，悬停高亮并抛出 click 事件', type: 'boolean', default: 'false' },
      { name: 'danger', desc: '危险态，标题显示红色', type: 'boolean', default: 'false' },
      { name: 'showArrow', desc: '右侧显示箭头图标', type: 'boolean', default: 'false' },
      { name: 'layout', desc: '布局方向', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
      { name: 'skeleton', desc: '骨架屏模式', type: 'boolean', default: 'false' },
      { name: 'card', desc: '卡片样式，独立圆角边框', type: 'boolean', default: 'false' },
      { name: 'unwrapSlot', desc: '右侧插槽不套宽度约束容器，适合紧凑控件', type: 'boolean', default: 'false' },
    ],
    emits: [
      { name: 'click', desc: 'interactive 为 true 时点击条目触发' },
    ],
    slots: [
      { name: 'icon', desc: '标题左侧图标区' },
      { name: 'right', desc: '右侧控件区' },
      { name: 'default', desc: '右侧控件区（right 插槽的回退）' },
      { name: 'skeleton-right', desc: '骨架屏模式下右侧占位内容' },
    ],
  },
  {
    component: 'BaseEmptyState',
    props: [
      { name: 'icon', desc: '图标类名（含 fa-* 前缀），为空不渲染图标', type: 'string', default: "''" },
      { name: 'title', desc: '空状态标题', type: 'string' },
      { name: 'description', desc: '标题下方的描述', type: 'string', default: "''" },
    ],
    slots: [
      { name: 'default', desc: '底部操作按钮区' },
    ],
  },
  {
    component: 'BaseCodeBlock',
    props: [
      { name: 'code', desc: '代码文本', type: 'string', default: "''" },
      { name: 'language', desc: '语言标识，用于头部展示与轻量语法高亮', type: 'string', default: "'text'" },
      { name: 'title', desc: '头部标题，为空时显示 language', type: 'string', default: "''" },
      { name: 'copyable', desc: '是否显示复制按钮', type: 'boolean', default: 'true' },
    ],
  },
  {
    component: 'BaseEllipsis',
    props: [
      { name: 'content', desc: '文本内容，也可用默认插槽传入', type: 'string', default: "''" },
      { name: 'lineClamp', desc: '最大显示行数', type: 'number', default: '1' },
      { name: 'expandable', desc: '截断时在文本后显示「展开 / 收起」按钮', type: 'boolean', default: 'false' },
      { name: 'tooltip', desc: '截断时悬停显示完整内容（仅 content 文本模式支持）', type: 'boolean', default: 'false' },
    ],
    slots: [
      { name: 'default', desc: '自定义内容，优先于 content 渲染（tooltip 失效）' },
    ],
  },
  {
    component: 'BaseHighlight',
    props: [
      { name: 'text', desc: '原始文本', type: 'string', default: "''" },
      { name: 'keywords', desc: '单个关键词或关键词数组', type: 'string | string[]', default: "''" },
      { name: 'caseSensitive', desc: '匹配是否区分大小写', type: 'boolean', default: 'false' },
      { name: 'highlightClass', desc: '命中片段应用的高亮类名', type: 'string', default: "'accent-bg-soft accent-text rounded px-0.5'" },
    ],
  },
  {
    component: 'BaseImage',
    props: [
      { name: 'src', desc: '图片地址', type: 'string', default: "''" },
      { name: 'alt', desc: '替代文本', type: 'string', default: "''" },
      { name: 'fit', desc: '图片填充方式，对应 object-fit', type: "'cover' | 'contain' | 'fill' | 'none' | 'scale-down'", default: "'cover'" },
      { name: 'width', desc: '数字或纯数字字符串按 px 写进 inline style，其余字符串当 Tailwind 类拼进 class', type: 'string | number', default: "''" },
      { name: 'height', desc: '高度，规则同 width', type: 'string | number', default: "''" },
      { name: 'lazy', desc: '首次进入视口才加载真实图片', type: 'boolean', default: 'false' },
      { name: 'previewable', desc: '悬停显示放大镜遮罩，点击打开全屏预览', type: 'boolean', default: 'false' },
      { name: 'fallbackSrc', desc: '加载失败时的回退图地址，优先于 fallback 插槽；回退图也失败才显示兜底', type: 'string', default: "''" },
    ],
    emits: [
      { name: 'load', desc: '图片加载成功时触发', payload: '(event: Event)' },
      { name: 'error', desc: '图片（含回退图）加载失败时触发', payload: '(event: Event)' },
    ],
    slots: [
      { name: 'fallback', desc: '加载失败时的兜底内容' },
    ],
  },
  {
    component: 'BaseCarousel',
    props: [
      { name: 'items', desc: '幻灯片数据 { image?, title?, description? }：有 image 渲染图片，否则渲染文字卡片', type: 'CarouselItem[]', default: '[]' },
      { name: 'autoplay', desc: '自动播放', type: 'boolean', default: 'false' },
      { name: 'interval', desc: '自动播放间隔（ms）', type: 'number', default: '4000' },
      { name: 'indicator', desc: '指示器样式：dots 圆点 | line 线条 | none 不显示', type: "'dots' | 'line' | 'none'", default: "'dots'" },
      { name: 'arrow', desc: '箭头显示时机：hover 悬停出现 | always 常驻 | never 不显示', type: "'hover' | 'always' | 'never'", default: "'hover'" },
      { name: 'loop', desc: '循环播放，末尾接回开头', type: 'boolean', default: 'true' },
      { name: 'heightClass', desc: '容器高度类，交给调用方控制以适配不同场景', type: 'string', default: "'h-56'" },
    ],
    emits: [
      { name: 'change', desc: '当前幻灯片索引变化时触发', payload: '(index: number)' },
    ],
  },
  {
    component: 'BaseInfiniteScroll',
    props: [
      { name: 'disabled', desc: '禁用加载触发', type: 'boolean', default: 'false' },
      { name: 'distance', desc: '提前触发距离（px）：sentinel 距视口底部小于该值即触发', type: 'number', default: '50' },
      { name: 'target', desc: '外部滚动容器选择器；为空时组件自身作为滚动容器', type: 'string', default: "''" },
      { name: 'maxHeight', desc: '自身滚动模式下的最大高度，数字按 px', type: 'string | number', default: "''" },
      { name: 'loading', desc: '加载中状态，显示底部加载提示且不再触发 load', type: 'boolean', default: 'false' },
      { name: 'noMore', desc: '没有更多数据，显示底部提示且不再触发 load', type: 'boolean', default: 'false' },
    ],
    emits: [
      { name: 'load', desc: '滚动接近底部时触发加载' },
    ],
    slots: [
      { name: 'default', desc: '滚动列表内容' },
      { name: 'loading', desc: '自定义加载中提示' },
      { name: 'no-more', desc: '自定义没有更多提示' },
    ],
  },
  {
    component: 'BaseSkeleton',
    props: [
      { name: 'variant', desc: '形态：rect 矩形 | text 多行文本 | circle 圆形', type: "'rect' | 'text' | 'circle'", default: "'rect'" },
      { name: 'lines', desc: 'text 形态的行数', type: 'number', default: '1' },
      { name: 'animated', desc: '脉冲动画', type: 'boolean', default: 'true' },
      { name: 'rounded', desc: '传入 Tailwind 圆角类（如 rounded-md）覆盖各形态的默认圆角，空字符串保持默认', type: 'string', default: "''" },
    ],
  },
  {
    component: 'BaseNumberAnimation',
    props: [
      { name: 'from', desc: '起始数值', type: 'number', default: '0' },
      { name: 'to', desc: '目标数值', type: 'number' },
      { name: 'duration', desc: '动画时长（ms）', type: 'number', default: '1500' },
      { name: 'precision', desc: '保留的小数位数', type: 'number', default: '0' },
      { name: 'separator', desc: '千分位分隔符，空串表示不分组', type: 'string', default: "','" },
      { name: 'prefix', desc: '数值前缀', type: 'string', default: "''" },
      { name: 'suffix', desc: '数值后缀', type: 'string', default: "''" },
      { name: 'autoplay', desc: '挂载后自动播放动画', type: 'boolean', default: 'true' },
    ],
    exposes: [
      { name: 'play', desc: '从 from 重新播放一遍完整动画', signature: 'play(): void' },
    ],
  },
  {
    component: 'BaseCountdown',
    props: [
      { name: 'value', desc: '> 1e12 视为目标时间戳（ms），否则视为剩余秒数', type: 'number', default: '0' },
      { name: 'format', desc: "支持 DD / HH / mm / ss 占位符，如 'DD 天 HH:mm:ss'", type: 'string', default: "'HH:mm:ss'" },
      { name: 'autoStart', desc: '挂载后自动开始倒计时', type: 'boolean', default: 'true' },
    ],
    emits: [
      { name: 'change', desc: '剩余时间变化时触发', payload: '(remainingMs: number)' },
      { name: 'finish', desc: '倒计时归零时触发' },
    ],
    exposes: [
      { name: 'start', desc: '开始/继续倒计时', signature: 'start(): void' },
      { name: 'pause', desc: '暂停倒计时', signature: 'pause(): void' },
      { name: 'reset', desc: '重置到初始剩余时间，autoStart 时自动重新开始', signature: 'reset(): void' },
    ],
  },
  {
    component: 'BaseCircleProgress',
    props: [
      { name: 'value', desc: '进度值 0-100，超出范围自动收敛', type: 'number', default: '0' },
      { name: 'size', desc: '直径（px）', type: 'number', default: '96' },
      { name: 'strokeWidth', desc: '圆环描边宽度（px）', type: 'number', default: '8' },
      { name: 'tone', desc: '进度环色调', type: "'accent' | 'emerald' | 'amber' | 'rose' | 'blue'", default: "'accent'" },
      { name: 'showValue', desc: '中心显示百分比数字', type: 'boolean', default: 'true' },
      { name: 'indeterminate', desc: '不确定态：固定弧长 + 整体旋转，用于进度未知的加载', type: 'boolean', default: 'false' },
    ],
    slots: [
      { name: 'default', desc: '自定义中心内容，覆盖默认百分比数字' },
    ],
  },
  {
    component: 'BaseProgress',
    props: [
      { name: 'value', desc: '当前进度值', type: 'number', default: '0' },
      { name: 'max', desc: '进度最大值', type: 'number', default: '100' },
      { name: 'label', desc: '进度条上方的标签', type: 'string', default: "''" },
      { name: 'showValue', desc: '右上角显示百分比', type: 'boolean', default: 'false' },
      { name: 'tone', desc: '色条色调', type: "'accent' | 'blue' | 'emerald' | 'amber' | 'rose'", default: "'accent'" },
      { name: 'size', desc: '条高尺寸', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { name: 'indeterminate', desc: '不确定进度：忽略 value，循环播放扫掠动画，用于耗时未知的任务', type: 'boolean', default: 'false' },
      { name: 'striped', desc: '斜向条纹动画，强调「任务进行中」的动态感', type: 'boolean', default: 'false' },
    ],
  },
  {
    component: 'BaseWatermark',
    props: [
      { name: 'content', desc: '水印文案，传数组时渲染多行', type: 'string | string[]', default: "''" },
      { name: 'rotate', desc: '水印旋转角度（度）', type: 'number', default: '-22' },
      { name: 'gap', desc: '[水平间距, 垂直间距]，单位 px', type: '[number, number]', default: '[100, 100]' },
      { name: 'fontSize', desc: '水印字号（px）', type: 'number', default: '14' },
      { name: 'opacity', desc: '水印透明度', type: 'number', default: '0.15' },
    ],
    slots: [
      { name: 'default', desc: '被水印覆盖的内容' },
    ],
  },
  {
    component: 'BaseRibbon',
    props: [
      { name: 'text', desc: '丝带文案，为空不渲染角标', type: 'string', default: "''" },
      { name: 'tone', desc: '丝带色调', type: "'accent' | 'emerald' | 'amber' | 'rose' | 'blue'", default: "'accent'" },
      { name: 'placement', desc: '角标位置', type: "'top-right' | 'top-left'", default: "'top-right'" },
    ],
    slots: [
      { name: 'default', desc: '被角标包裹的容器内容' },
    ],
  },
  {
    component: 'BaseResult',
    props: [
      { name: 'status', desc: '结果状态，决定默认图标与配色', type: "'success' | 'error' | 'warning' | 'info'", default: "'info'" },
      { name: 'title', desc: '结果标题', type: 'string' },
      { name: 'description', desc: '标题下方的描述', type: 'string', default: "''" },
      { name: 'icon', desc: '自定义图标，传 fa-* 类名时覆盖 status 的默认图标', type: 'string', default: "''" },
    ],
    slots: [
      { name: 'default', desc: '底部操作按钮区' },
    ],
  },
  {
    component: 'BaseKbd',
    props: [
      { name: 'keys', desc: "按键组合，字符串按 '+' 拆分，或直接传数组", type: 'string | string[]', default: "''" },
    ],
  },
]
