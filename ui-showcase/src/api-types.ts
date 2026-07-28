/**
 * api-types.ts
 * 组件 API 文档的结构化类型契约。
 * api-data/ 下按组件分组的各分片文件都导出 ComponentApi[]，由 api-docs.ts 汇总。
 */

export interface ApiPropRow {
  /** 属性名，如 'variant' */
  name: string
  /** 中文说明 */
  desc: string
  /** 类型签名，如 "'primary' | 'secondary' | 'glass'" */
  type: string
  /** 默认值；无默认值时省略，渲染为 "—" */
  default?: string
}

export interface ApiEmitRow {
  /** 事件名，如 'update:modelValue' */
  name: string
  desc: string
  /** 回调参数签名，如 '(value: string)' */
  payload?: string
}

export interface ApiSlotRow {
  /** 插槽名，默认插槽用 'default' */
  name: string
  desc: string
}

export interface ApiExposeRow {
  /** defineExpose 暴露的方法/属性名 */
  name: string
  desc: string
  /** 方法签名，如 'validate(): Promise<boolean>' */
  signature?: string
}

export interface ComponentApi {
  /** 组件名，如 'BaseButton' */
  component: string
  props?: ApiPropRow[]
  emits?: ApiEmitRow[]
  slots?: ApiSlotRow[]
  exposes?: ApiExposeRow[]
}
