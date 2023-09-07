import {
    Plugin, showMessage
} from "siyuan";
import { exportRiffData } from "./encode"


export default class PluginSample extends Plugin {
    async onload() {
        // await exportRiffData()
        this.addTopBar({
            icon: "iconUpload", 
            title: "导出复习数据", 
            async callback() {
                await exportRiffData()
                showMessage('已导出复习数据<br>在"工作空间/data/public/export-csv-for-fsrs-optimizer"下查看')
            },
            position: "right"
        })
    }
}
