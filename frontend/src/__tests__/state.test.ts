/**
 * 全局状态组合式函数测试。
 * 覆盖 useWorkspaceToast 的队列行为和 usePageTransition 的遮罩生命周期，
 * 以及 BaseToastContainer 的渲染（jsdom + @vue/test-utils）。
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseToastContainer from '../components/base/BaseToastContainer.vue'
import { usePageTransition } from '../composables/usePageTransition'
import { useWorkspaceToast } from '../composables/useWorkspaceToast'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useWorkspaceToast', () => {
  it('pushToast 插入字符串消息并归一化为 title', () => {
    const { toasts, pushToast } = useWorkspaceToast()
    pushToast('success', '保存成功', 0)
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]).toMatchObject({ type: 'success', title: '保存成功', description: '' })
  })

  it('pushToast 支持对象消息与 action', () => {
    const { toasts, pushToast } = useWorkspaceToast()
    pushToast('info', { title: '有新版本', description: '点击查看', action: { label: '查看' } }, 0)
    expect(toasts.value[0]).toMatchObject({
      title: '有新版本',
      description: '点击查看',
      action: { label: '查看' },
    })
  })

  it('超时后自动移除对应 toast', () => {
    const { toasts, pushToast } = useWorkspaceToast()
    pushToast('info', '短暂提示', 1000)
    expect(toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(1100)
    expect(toasts.value).toHaveLength(0)
  })

  it('队列最多保留最近 5 条', () => {
    const { toasts, pushToast } = useWorkspaceToast()
    for (let i = 1; i <= 7; i++) pushToast('info', `第 ${i} 条`, 0)
    expect(toasts.value).toHaveLength(5)
    // 新消息插在队首，最旧的两条被裁掉。
    expect(toasts.value[0].title).toBe('第 7 条')
    expect(toasts.value[4].title).toBe('第 3 条')
  })

  it('dismissToast 按 id 移除', () => {
    const { toasts, pushToast, dismissToast } = useWorkspaceToast()
    pushToast('info', 'A', 0)
    pushToast('info', 'B', 0)
    dismissToast(toasts.value[1].id)
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].title).toBe('B')
  })
})

describe('usePageTransition', () => {
  it('show 置为 loading，notifyEnterCompleted 后 Promise 才 resolve', async () => {
    const { loading, show, hide, notifyEnterCompleted } = usePageTransition()
    const resolved = vi.fn()
    show().then(resolved)
    expect(loading.value).toBe(true)

    // 遮罩淡入完成前 Promise 不应 resolve。
    await Promise.resolve()
    expect(resolved).not.toHaveBeenCalled()

    notifyEnterCompleted()
    await Promise.resolve()
    expect(resolved).toHaveBeenCalled()

    // 收尾：恢复隐藏状态，避免模块级状态泄漏到其它用例。
    hide(0)
    vi.advanceTimersByTime(10)
    expect(loading.value).toBe(false)
  })

  it('hide 按 delay 延迟关闭遮罩', () => {
    const { loading, show, hide, notifyEnterCompleted } = usePageTransition()
    show()
    notifyEnterCompleted()
    hide(400)
    expect(loading.value).toBe(true)
    vi.advanceTimersByTime(399)
    expect(loading.value).toBe(true)
    vi.advanceTimersByTime(2)
    expect(loading.value).toBe(false)
  })

  it('loading 中再次 show 会复用进入流程并取消未执行的 hide', async () => {
    const { loading, show, hide, notifyEnterCompleted } = usePageTransition()
    show()
    notifyEnterCompleted()
    hide(400)

    // hide 尚未生效时再次 show：应保持 loading 并取消定时关闭。
    const resolved = vi.fn()
    show().then(resolved)
    vi.advanceTimersByTime(500)
    expect(loading.value).toBe(true)

    notifyEnterCompleted()
    await Promise.resolve()
    expect(resolved).toHaveBeenCalled()

    hide(0)
    vi.advanceTimersByTime(10)
    expect(loading.value).toBe(false)
  })
})

describe('BaseToastContainer 渲染', () => {
  it('渲染 toast 标题与描述，点击关闭派发 dismiss', async () => {
    const wrapper = mount(BaseToastContainer, {
      props: {
        toasts: [
          { id: 1, type: 'success', title: '操作成功', description: '数据已保存', action: null },
        ],
      },
    })
    expect(wrapper.text()).toContain('操作成功')
    expect(wrapper.text()).toContain('数据已保存')

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('dismiss')?.[0]).toEqual([1])
  })

  it('缺省标题时按类型回退默认文案', () => {
    const wrapper = mount(BaseToastContainer, {
      props: { toasts: [{ id: 2, type: 'error' }] },
    })
    expect(wrapper.text()).toContain('Error')
  })
})
