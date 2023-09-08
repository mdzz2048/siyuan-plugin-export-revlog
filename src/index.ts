import {
    Menu,
    Plugin, 
    showMessage
} from "siyuan";
import { 
    exportRiffData, 
    exportRiffDataMerge, 
    exportRiffDataCustom, 
    getNewFileHandle, 
    writeFile, 
    DEFAULT_SAVE_PATH 
} from "./utils"

const RIFF_LOG_PATH = 'data/storage/riff/logs'

export default class PluginSample extends Plugin {
    async onload() {
        // await exportRiffData()
        // const config = await this.loadData('config.json')
        const topBarElement = this.addTopBar({
            icon: "iconUpload", 
            title: "导出复习数据", 
            callback: async () => {
                await exportRiffDataMerge(RIFF_LOG_PATH)
                showMessage(`已导出复习数据<br>在'${DEFAULT_SAVE_PATH}'下查看`)
            },
            position: "right"
        })

        topBarElement.addEventListener('contextmenu', () => {
            let rect = topBarElement.getBoundingClientRect();
            // 如果获取不到宽度，则使用更多按钮的宽度
            if (rect.width === 0) {
                rect = document.querySelector("#barMore").getBoundingClientRect();
            }
            this.addMenu(rect)
        })
    }

    private addMenu(rect?: DOMRect) {
        const menu = new Menu("export-csv", () => {
            // console.log(this.i18n.byeMenu)
            console.log('hello menu')
        })
        menu.addItem({
            icon: "iconUpload", 
            label: "按月导出", 
            click: async () => {
                await exportRiffData(RIFF_LOG_PATH)
                showMessage(`已导出复习数据<br>在'${DEFAULT_SAVE_PATH}'下查看`)
            }
        })
        menu.addItem({
            icon: "iconUpload", 
            label: "合并导出", 
            click: async () => {
                await exportRiffDataMerge(RIFF_LOG_PATH)
                showMessage(`已导出复习数据<br>在'${DEFAULT_SAVE_PATH}'下查看`)
            }
        })

        // Uncaught (in promise) DOMException: The request is not allowed by the user agent or the platform in the current context.
        // if (window["showSaveFilePicker"]) {
        //     menu.addItem({
        //         icon: "iconUpload", 
        //         label: "自定义导出", 
        //         click: async () => {
        //             // await exportRiffDataCustom(RIFF_LOG_PATH)
        //             let fileHandle = await getNewFileHandle()
        //             console.log(fileHandle)
        //             let file = await fileHandle.createWritable()
        //             console.log(file)
        //             // await writeFile(fileHandle, "test")
        //             showMessage("已导出复习数据")
        //         }
        //     })
        // }

        menu.open({
            x: rect.right, 
            y: rect.bottom, 
            isLeft: true, 
        })
    }
}
