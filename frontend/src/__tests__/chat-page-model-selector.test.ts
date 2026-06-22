import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import ChatPageView from '../views/app/ChatPageView.vue'

const selectedLlmOptionId = ref('system:openai:managed:deepseek-v4-flash')
const modelOptionsData = ref({
  options: [
    {
      option_id: 'system:openai:managed:deepseek-v4-flash',
      label: '平台托管 / deepseek-v4-flash',
      model_name: 'deepseek-v4-flash',
      category: 'openai',
      source: 'system',
      available: true,
    },
    {
      option_id: 'personal:openai:p1:gpt-4o-mini',
      label: '我的 OpenAI / gpt-4o-mini',
      model_name: 'gpt-4o-mini',
      category: 'openai',
      source: 'personal',
      provider_id: 'p1',
      available: true,
    },
  ],
})

vi.mock('../composables/useSystemStatus', () => ({
  useSystemStatus: () => ({
    selectedLlmOptionId,
    modelOptionsData,
    modelOptionsLoading: ref(false),
    selectedLlmOption: ref(modelOptionsData.value.options[0]),
    doFetchModelOptions: vi.fn(),
  }),
}))

vi.mock('../composables/useToast', () => ({
  useToast: () => ({ pushToast: vi.fn() }),
}))

vi.mock('../composables/useAuth', () => ({
  useAuth: () => ({
    currentUser: ref({ username: 'Admin' }),
    setQuotaSnapshot: vi.fn(),
    refreshCurrentUser: vi.fn(),
  }),
}))

vi.mock('../composables/useAiChatSessions', () => ({
  useAiChatSessions: () => ({
    activeAiChatId: ref('chat-1'),
    createAiChat: vi.fn(),
    onAiChatTitleUpdated: vi.fn(),
  }),
}))

vi.mock('../composables/useWorkspaceNav', () => ({
  useWorkspaceNav: () => ({
    currentView: ref('ai-chat'),
    isMobile: ref(false),
    canHover: ref(false),
    setSettingsSubView: vi.fn(),
  }),
}))

vi.mock('../composables/useProjects', () => ({
  useProjects: () => ({
    questionProjects: ref([]),
  }),
}))

vi.mock('../api/index', () => ({
  fetchMessages: vi.fn(() => Promise.resolve({ messages: [], hasMore: false })),
}))

vi.mock('../utils/index', () => ({
  getQuestionSnippet: vi.fn(),
  renderMarkdown: (text) => text,
  typesetMath: vi.fn(),
}))

describe('ChatPageView model selector', () => {
  it('shows model selector and switches the selected model option', async () => {
    const wrapper = mount(ChatPageView, {
      global: {
        stubs: {
          ContentPanel: { template: '<section><slot name="header-actions" /><slot /></section>' },
          BaseModal: { template: '<div><slot /></div>' },
          TransitionGroup: { template: '<div><slot /></div>' },
          Transition: { template: '<div><slot /></div>' },
        },
      },
    })

    await nextTick()

    const trigger = wrapper.get('[data-chat-model-selector]')
    expect(trigger.text()).toContain('deepseek-v4-flash')

    await trigger.trigger('click')
    await wrapper.get('[data-chat-model-option="personal:openai:p1:gpt-4o-mini"]').trigger('click')

    expect(selectedLlmOptionId.value).toBe('personal:openai:p1:gpt-4o-mini')
  })
})
