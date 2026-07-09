import { useState, useLayoutEffect } from 'react'

const IS_MOBILE_INIT = typeof window !== 'undefined'
  ? window.matchMedia('(max-width: 767px)').matches
  : false

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(IS_MOBILE_INIT)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}
