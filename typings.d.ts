declare module '*.json' {
  const value: any
  export default value
}

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export = content
}
