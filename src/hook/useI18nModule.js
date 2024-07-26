export default function useI18nModule() {
  const route = useRoute()

  // i18nModule 语言路径
  const i18nModule = computed(() => {
    return route.path.substring(1).replace(/\//g, '.') + '.'
  })

  return {
    i18nModule
  }
}
