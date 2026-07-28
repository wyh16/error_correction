/**
 * 项目管理 API。
 *
 * 负责错题与笔记所属项目的列表、创建、更新和删除。
 */
import { assertJsonSuccess } from './client'
import type { Id } from '@/types/domain'

export type ProjectType = 'question' | 'note'

export type Project = {
  id: Id
  name?: string
  project_type?: ProjectType
  description?: string
  summary?: string
  is_default?: boolean
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

type CreateProjectPayload = {
  name: string
  project_type?: ProjectType
  description?: string
  summary?: string
}

type UpdateProjectPayload = Partial<CreateProjectPayload>

/** 获取当前用户的项目列表。 */
export async function fetchProjects() {
  const resp = await fetch('/api/projects')
  const data = await assertJsonSuccess<{ success: true; projects?: Project[] }>(resp, '获取项目列表失败')
  return data.projects || []
}

/** 创建项目，并返回新建的 project 对象。 */
export async function createProject(payload: CreateProjectPayload) {
  const resp = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await assertJsonSuccess<{ success: true; project: Project }>(resp, '创建项目失败')
  return data.project
}

/** 更新项目名称或其它项目元数据。 */
export async function updateProject(projectId: Id, payload: UpdateProjectPayload) {
  const resp = await fetch(`/api/projects/${encodeURIComponent(projectId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await assertJsonSuccess<{ success: true; project: Project }>(resp, '更新项目失败')
  return data.project
}

/** 删除指定项目，后端负责处理关联数据约束。 */
export async function deleteProject(projectId: Id) {
  const resp = await fetch(`/api/projects/${encodeURIComponent(projectId)}`, {
    method: 'DELETE',
  })
  return assertJsonSuccess(resp, '删除项目失败')
}
