/**
 * api-docs.ts
 * 组件 API 文档的汇总层：聚合 api-data/ 下四个分片，
 * 以 API_INDEX（组件名 -> ComponentApi）供 ApiTable 按名字查询。
 * 底部保留旧的扁平字符串结构（ApiDoc / API_DOCS / findApiDocs）作兼容包装。
 */
import { DATA_API } from '~/api-data/data'
import { FORMS_API } from '~/api-data/forms'
import { NAV_API } from '~/api-data/nav'
import { OVERLAY_API } from '~/api-data/overlay'
import type { ComponentApi } from '~/api-types'

/** 全部组件的结构化 API 文档（表单 / 数据展示 / 反馈浮层 / 导航布局）。 */
export const ALL_COMPONENT_APIS: ComponentApi[] = [
  ...FORMS_API,
  ...DATA_API,
  ...OVERLAY_API,
  ...NAV_API,
]

/** 组件名 -> 结构化 API 文档 的索引。 */
export const API_INDEX: Map<string, ComponentApi> = new Map(
  ALL_COMPONENT_APIS.map(api => [api.component, api]),
)

/** 按组件名列表查询结构化文档，保持入参顺序，未收录的组件跳过。 */
export function findComponentApis(components: string[]): ComponentApi[] {
  return components
    .map(name => API_INDEX.get(name))
    .filter((api): api is ComponentApi => Boolean(api))
}

// ── 以下为旧结构的兼容包装，由结构化数据推导 ──

export type ApiDoc = {
  component: string
  props: string
  emits: string
  slots: string
}

function toLegacyDoc(api: ComponentApi): ApiDoc {
  return {
    component: api.component,
    props: api.props?.length
      ? api.props.map(p => (p.default ? `${p.name} (${p.default})` : p.name)).join(', ')
      : '—',
    emits: api.emits?.length ? api.emits.map(e => e.name).join(', ') : '—',
    slots: api.slots?.length ? api.slots.map(s => s.name).join(', ') : '—',
  }
}

export const API_DOCS: ApiDoc[] = ALL_COMPONENT_APIS.map(toLegacyDoc)

export function findApiDocs(components: string[]): ApiDoc[] {
  return findComponentApis(components).map(toLegacyDoc)
}
