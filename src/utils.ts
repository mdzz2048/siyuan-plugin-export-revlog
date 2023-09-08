/**
 * Copyright (C) 2023 mdzz2048
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { decode } from "@msgpack/msgpack"
import { getFileBuffer, putFile, readDir } from "./siyuan-api";
import { TMessagepack } from "sy-dtype";

export const DEFAULT_SAVE_PATH = "/data/public/export-csv-for-fsrs-optimizer"

export function convertToCSV(data: TMessagepack[]): string {
  const headers = ['card_id', 'review_time', 'review_rating', 'review_state', 'review_duration'];
  const rows = data.map(obj => [
    obj.CardID,
    obj.Reviewed * 1000,
    obj.Rating,
    obj.State, 
    null
  ]);
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

export async function decodeFileData(data: ArrayBuffer): Promise<TMessagepack[]> {
    let messagepacks: TMessagepack[] = []
    let decoded = decode(data)
    for (let index = 0; index < decoded['length']; index++) {
        let messagepack: TMessagepack = {
            ID: decoded[index]['ID'],
            CardID: decoded[index]['CardID'],
            Rating: decoded[index]['Rating'],
            ScheduledDays: decoded[index]['ScheduledDays'],
            ElapsedDays: decoded[index]['ElapsedDays'],
            Reviewed: decoded[index]['Reviewed'],
            State: decoded[index]['State'],
        }
        messagepacks.push(messagepack)
    }
    return messagepacks
}

async function getRiffData(path: string): Promise<{
    "msp": TMessagepack[][], 
    "name": string[]}
>{
    let riff_files = await readDir(path)
    let all_messagepacks: TMessagepack[][] = []
    let all_files_name = []
    for (let index = 0; index < riff_files.length; index++) {
        let riff_file = riff_files[index]
        if (riff_file.isDir) {
            continue
        }
        
        let riff_file_name = riff_file.name
        let riff_file_data = await getFileBuffer(`${path}/${riff_file_name}`)
        if (riff_file_data === null) {
            console.log('获取文件失败: ', riff_file_name)
            continue
        }
        let messagepacks: TMessagepack[] = await decodeFileData(riff_file_data)
        all_messagepacks.push(messagepacks)
        all_files_name.push(riff_file_name)
    }
    return {
        "msp": all_messagepacks, 
        "name": all_files_name
    }
}

export async function exportRiffData(path: string) {
    let files_data = (await getRiffData(path)).msp
    let files_name = (await getRiffData(path)).name
    for (let index = 0; index < files_data.length; index++) {
        await putFile(
            `${DEFAULT_SAVE_PATH}/${files_name[index]}.csv`, 
            false, 
            new Blob([convertToCSV(files_data[index])], { type: "" })
        )
    }
}

export async function exportRiffDataMerge(path: string) {
    let riff_files = (await getRiffData(path)).msp
    await putFile(
        `${DEFAULT_SAVE_PATH}/revlog.csv`, 
        false, 
        new Blob([convertToCSV(riff_files.flat())], { type: "" })
    )
}

export async function exportRiffDataCustom(path: string) {
    let riff_files = (await getRiffData(path)).msp
    let fileHandle = await getNewFileHandle('revlog.csv')
    await writeFile(
        fileHandle, 
        convertToCSV(riff_files.flat())
    )
}


// REF: https://developer.mozilla.org/zh-CN/docs/Web/API/Window/showSaveFilePicker
export async function getNewFileHandle(suggestedName?: string, excludeAcceptAll: boolean = false): Promise<FileSystemFileHandle> {
    const opts = {
        excludeAcceptAllOption: excludeAcceptAll, 
        suggestedName: suggestedName, 
        types: [
            {
            description: "Text file",
            accept: { "text/plain": [".csv"] },
            },
        ],
    };
    return await window["showSaveFilePicker"](opts);
}

// REF: https://developer.mozilla.org/zh-CN/docs/Web/API/FileSystemFileHandle
export async function writeFile(fileHandle: FileSystemFileHandle, content: string) {
    const writable = await fileHandle.createWritable();
    console.log(content)
    await writable.write(content);
    await writable.close();
}
