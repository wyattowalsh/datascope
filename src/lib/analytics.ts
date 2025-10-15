declare global {
  interface Window {
    dataLayer: any[]
  }
}

export const gtmEvent = (event: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event,
      ...data,
    })
  }
}

export const gtmPageView = (path: string) => {
  gtmEvent('pageview', {
    page_path: path,
    page_title: document.title,
  })
}

export const gtmDataParsed = (format: string, success: boolean) => {
  gtmEvent('data_parsed', {
    data_format: format,
    parse_success: success,
  })
}

export const gtmFileLoaded = (method: 'file' | 'url' | 'paste', format?: string) => {
  gtmEvent('file_loaded', {
    load_method: method,
    data_format: format,
  })
}

export const gtmViewChanged = (viewMode: 'tree' | 'graph', layoutType?: string) => {
  gtmEvent('view_changed', {
    view_mode: viewMode,
    layout_type: layoutType,
  })
}

export const gtmSearchPerformed = (searchMode: 'text' | 'regex' | 'path', resultCount: number) => {
  gtmEvent('search_performed', {
    search_mode: searchMode,
    result_count: resultCount,
  })
}

export const gtmFormatAction = (action: 'format' | 'minify' | 'lint', format: string) => {
  gtmEvent('format_action', {
    action_type: action,
    data_format: format,
  })
}
