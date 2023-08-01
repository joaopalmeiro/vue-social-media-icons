import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { format, resolveConfig } from 'prettier'

const COMPONENTS_PATH = './src/components'
const INDEX_PATH = './src/index.ts'
const PRETTIER_PATH = './.prettierrc'

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

generateIndex()
