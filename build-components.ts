import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { format, resolveConfig } from 'prettier'

const BASE_PATH = './node_modules/social-media-icons/icons'
const COMPONENTS_PATH = './src/components'
const INDEX_PATH = './src/index.ts'
const PRETTIER_PATH = './.prettierrc'

const generateComponents = async () => {
  try {
    const icons: string[] = await readdir(BASE_PATH)

    icons.forEach(async (icon) => {
      const iconPath = path.join(BASE_PATH, icon)
      const iconName = path.basename(iconPath, '.svg')

      const componentName = `${iconName.charAt(0).toUpperCase()}${iconName.slice(1)}Icon.vue`
      const componentPath = path.join(COMPONENTS_PATH, componentName)

      // https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
      const iconContent = await readFile(iconPath, { encoding: 'utf8' })
      const componentContent = `<template>${iconContent}</template>`

      // https://prettier.io/docs/en/api.html
      const prettierConfig = await readFile(PRETTIER_PATH, { encoding: 'utf8' })
      const prettierOptions = await resolveConfig(prettierConfig)
      const formattedComponentContent = await format(componentContent, {
        ...prettierOptions,
        parser: 'vue'
      })

      await writeFile(componentPath, formattedComponentContent)
      console.log(`${componentName} ✓`)
    })
  } catch (e) {
    console.error(e)
  }
}

const generateIndex = async () => {
  try {
    const components: string[] = await readdir(COMPONENTS_PATH)

    const imports: string[] = []
    const exports: string[] = []

    components.forEach((component) => {
      const componentName = path.basename(component, '.vue')
      const componentImport = `import ${componentName} from './components/${component}'`

      imports.push(componentImport)
      exports.push(componentName)
    })

    const allImports = imports.join('\n')
    const allExports = `export { ${exports.join(', ')} }`

    const indexContent = `${allImports}\n\n${allExports}`

    const prettierConfig = await readFile(PRETTIER_PATH, { encoding: 'utf8' })
    const prettierOptions = await resolveConfig(prettierConfig)
    const formattedComponentContent = await format(indexContent, {
      ...prettierOptions,
      parser: 'typescript'
    })

    await writeFile(INDEX_PATH, formattedComponentContent)
    console.log('index.ts ✓')
  } catch (e) {
    console.error(e)
  }
}

generateComponents()
generateIndex()
