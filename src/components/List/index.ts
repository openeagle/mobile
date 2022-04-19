import { App, Plugin } from 'vue'
import List from './List'

List.install = function (app: App) {
  app.component(List.name, List)
  return app
}

export default List as typeof List & Plugin
