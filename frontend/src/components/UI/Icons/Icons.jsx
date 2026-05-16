export function IconClose({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fill="currentColor" fillRule="evenodd"/>
    </svg>
  )
}

export function IconChevronUp({ size = 12, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconChevronDown({ size = 12, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function IconImage({ size = 28, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.083,4.667 C12.083,3.562 12.978,2.667 14.083,2.667 C15.188,2.667 16.083,3.562 16.083,4.667 C16.083,5.772 15.188,6.667 14.083,6.667 C12.978,6.667 12.083,5.772 12.083,4.667 L12.083,4.667 Z M18,12.086 L13.987,8.074 L13.971,8.089 L13.955,8.074 L12.525,9.504 L7.896,4.876 L7.881,4.892 L7.865,4.876 L2,10.741 L2,2 L18,2 L18,12.086 Z M0,16 L20,16 L20,0 L0,0 L0,16 Z" fill="currentColor"/>
    </svg>
  )
}

export function IconText({ size = 28, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 0h16v4h-2V2H9v12h3v2H4v-2h3V2H2v2H0V2z" fill="currentColor" fillRule="evenodd"/>
    </svg>
  )
}

export function IconGallery({ size = 28, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7 1H1V5H7V1Z" fill="currentColor"/>
      <path d="M7 7H1V15H7V7Z" fill="currentColor"/>
      <path d="M9 1H15V9H9V1Z" fill="currentColor"/>
      <path d="M15 11H9V15H15V11Z" fill="currentColor"/>
    </svg>
  )
}

export function IconVideo({ size = 28, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M16 2H0V14H16V2ZM6.5 5V11H7.5L11 8L7.5 5H6.5Z" fill="currentColor"/>
    </svg>
  )
}

export function IconAudio({ size = 28, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15 1H4V9H3C1.34315 9 0 10.3431 0 12C0 13.6569 1.34315 15 3 15C4.65685 15 6 13.6569 6 12V5H13V9H12C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V1Z" fill="currentColor"/>
    </svg>
  )
}
