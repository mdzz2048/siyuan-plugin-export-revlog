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
import { TMessagepack } from "./type/sy";

function convertToCSV(data: TMessagepack[]): string {
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

export async function exportRiffData() {
    const RIFF_LOG = 'data/storage/riff/logs'
    let riff_files = await readDir(RIFF_LOG)
    for (let index = 0; index < riff_files.length; index++) {
        let riff_file = riff_files[index]
        let messagepacks: TMessagepack[] = []
        if (riff_file.isDir) {
            continue
        }

        let riff_file_name = riff_file.name
        let riff_file_data = await getFileBuffer(`${RIFF_LOG}/${riff_file_name}`)
        if (riff_file_data === null) {
            console.log(riff_file_name + '获取失败')
            continue
        }
        let decoded = decode(riff_file_data)
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
        let response = await putFile(
            `/data/public/export-csv-for-fsrs-optimizer/${riff_file_name}.csv`, 
            false, 
            new Blob([convertToCSV(messagepacks)], { type: "" })
        )
        console.log(response)
    }

}