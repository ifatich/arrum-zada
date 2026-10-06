declare module '*.vue' {
  import { defineComponent } from 'vue'

  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module 'kitvue-public*' {
  const content: any
  export default content
}

declare module 'kitvue*' {
  const content: any
  export default content
}
