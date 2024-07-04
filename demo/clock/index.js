async function whenReady() {
  return new Promise((resolve) => {
    if (document.readyState !== 'loading') {
      resolve()
    } else {
      document.addEventListener('DOMContentLoaded', resolve)
    }
  })
}

;(async () => {
  await whenReady()

  const getView = () => {
    return document.querySelector(`.split-view-view:has(> [id='workbench.parts.auxiliarybar'])`)
  }

  let view = null
  const start = Date.now()
  while (!view && Date.now() - start < 3 * 60 * 1000) {
    view = getView()
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
  }
  if (!view) {
    console.log('[custom-css] view not found after 3 minutes ~')
    return
  }

  const action = () => {
    const right = window.getComputedStyle(view).width
    document.documentElement.style.setProperty('--clock-right', right)
    console.log('[custom-css] set --clock-right to %s', right)
  }

  // first call
  action()

  // observe later
  const observer = new MutationObserver((mutations) => {
    action()
  })
  observer.observe(view, { attributes: true, attributeFilter: ['style'] })
  window.addEventListener('unload', () => {
    observer.disconnect()
  })
})()
