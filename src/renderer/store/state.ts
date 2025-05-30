import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { type UpdateCheckResult } from 'electron-updater'

type TrackType = 'online' | 'local' | 'stream'

type ScrollState = {
  scrollTop: number
  containerHeight: number
  listHeight: number
}

export const useNormalStateStore = defineStore('state', () => {
  const enableScrolling = ref(true)
  const virtualScrolling = ref(false)
  const showLyrics = ref(false)
  const searchTab = ref('track')
  const exploreTab = ref('playlist')
  const setConvolverModal = ref(false)
  const setPlaybackRateModal = ref(false)
  const setPitchModal = ref(false)
  const extensionCheckResult = ref(false)
  const modalOpen = ref(false)
  const addTrackToPlaylistModal = ref({
    show: false,
    selectedTrackID: [0] as (number | string)[],
    type: 'online' as TrackType
  })
  const newPlaylistModal = ref({
    show: false,
    type: 'online' as TrackType,
    afterCreateAddTrackID: [0] as (number | string)[]
  })
  const accurateMatchModal = ref({
    show: false,
    selectedTrackID: 0
  })

  const toast = reactive({
    show: false,
    text: '',
    timer: null as any
  })
  const dailyTracks = ref<any[]>([])

  const scrollbar = reactive({
    instances: {} as Record<string, ScrollState>,
    active: null as string | null
  })

  const updateStatus = ref(false)
  const isDownloading = ref(false)
  const latestVersion = ref<UpdateCheckResult | null>(null)

  const registerInstance = (tabId: string) => {
    if (!scrollbar.instances[tabId]) {
      scrollbar.instances[tabId] = {
        scrollTop: 0,
        containerHeight: 0,
        listHeight: 0
      }
    }
    scrollbar.active = tabId
  }

  const unregisterInstance = (tabId: string) => {
    if (scrollbar.active === tabId) {
      scrollbar.active = null
    }
    if (Object.prototype.hasOwnProperty.call(scrollbar.instances, tabId)) {
      delete scrollbar.instances[tabId]
    }
  }

  const updateScroll = (tabId: string, payload: Partial<ScrollState>) => {
    if (scrollbar.instances[tabId]) {
      scrollbar.instances[tabId] = { ...scrollbar.instances[tabId], ...payload }
    }
  }

  const showToast = (text: string) => {
    if (toast.timer !== null) {
      clearTimeout(toast.timer)
    }
    toast.show = true
    toast.text = text
    toast.timer = setTimeout(() => {
      toast.show = false
      toast.text = ''
      toast.timer = null
    }, 3200)
  }

  const checkUpdate = () => {
    updateStatus.value = true
    window.mainApi?.invoke('check-update').then((result: UpdateCheckResult | null) => {
      if (result) latestVersion.value = result
      updateStatus.value = false
    })
  }

  watch(enableScrolling, (value) => {
    document.documentElement.style.overflowY = value ? 'auto' : 'hidden'
  })

  return {
    enableScrolling,
    virtualScrolling,
    showLyrics,
    searchTab,
    exploreTab,
    setConvolverModal,
    setPlaybackRateModal,
    setPitchModal,
    extensionCheckResult,
    addTrackToPlaylistModal,
    newPlaylistModal,
    accurateMatchModal,
    dailyTracks,
    toast,
    modalOpen,
    scrollbar,
    updateStatus,
    latestVersion,
    isDownloading,
    showToast,
    registerInstance,
    unregisterInstance,
    updateScroll,
    checkUpdate
  }
})
