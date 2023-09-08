/**
 * Copyright (c) 2023 frostime. All rights reserved.
 * https://github.com/frostime/sy-plugin-template-vite
 * 
 * See API Document in [API.md](https://github.com/siyuan-note/siyuan/blob/master/API.md)
 * API 文档见 [API_zh_CN.md](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md)
 */

import {
    Block, Notebook, NotebookConf, NotebookId, DocumentId, BlockId,
    doOperation, PreviousID, ParentID, BlockType, BlockSubType 
} from "sy-dtype";
import { fetchSyncPost, IWebSocketData } from "siyuan";


async function request(url: string, data: any) {
    let response: IWebSocketData = await fetchSyncPost(url, data);
    let res = response.code === 0 ? response.data : null;
    return res;
}


// **************************************** Noteboook ****************************************

export type ReslsNotebooks = {
    notebooks: Notebook[];
}

export async function lsNotebooks(): Promise<ReslsNotebooks> {
    let url = '/api/notebook/lsNotebooks';
    return request(url, '');
}


export async function openNotebook(notebook: NotebookId) {
    let url = '/api/notebook/openNotebook';
    return request(url, { notebook: notebook });
}


export async function closeNotebook(notebook: NotebookId) {
    let url = '/api/notebook/closeNotebook';
    return request(url, { notebook: notebook });
}


export async function renameNotebook(notebook: NotebookId, name: string) {
    let url = '/api/notebook/renameNotebook';
    return request(url, { notebook: notebook, name: name });
}


export async function createNotebook(name: string): Promise<Notebook> {
    let url = '/api/notebook/createNotebook';
    return request(url, { name: name });
}


export async function removeNotebook(notebook: NotebookId) {
    let url = '/api/notebook/removeNotebook';
    return request(url, { notebook: notebook });
}

export type ResGetNotebookConf = {
    box: string;
    conf: NotebookConf;
    name: string;
}


export async function getNotebookConf(notebook: NotebookId): Promise<ResGetNotebookConf> {
    let data = { notebook: notebook };
    let url = '/api/notebook/getNotebookConf';
    return request(url, data);
}


export async function setNotebookConf(notebook: NotebookId, conf: NotebookConf): Promise<NotebookConf> {
    let data = { notebook: notebook, conf: conf };
    let url = '/api/notebook/setNotebookConf';
    return request(url, data);
}


// **************************************** Document ****************************************
export async function createDocWithMd(notebook: NotebookId, path: string, markdown: string): Promise<DocumentId> {
    let data = {
        notebook: notebook,
        path: path,
        markdown: markdown,
    };
    let url = '/api/filetree/createDocWithMd';
    return request(url, data);
}


export async function renameDoc(notebook: NotebookId, path: string, title: string): Promise<DocumentId> {
    let data = {
        doc: notebook,
        path: path,
        title: title
    };
    let url = '/api/filetree/renameDoc';
    return request(url, data);
}


export async function removeDoc(notebook: NotebookId, path: string) {
    let data = {
        notebook: notebook,
        path: path,
    };
    let url = '/api/filetree/removeDoc';
    return request(url, data);
}


export async function moveDocs(fromPaths: string[], toNotebook: NotebookId, toPath: string) {
    let data = {
        fromPaths: fromPaths,
        toNotebook: toNotebook,
        toPath: toPath
    };
    let url = '/api/filetree/moveDocs';
    return request(url, data);
}


export async function getHPathByPath(notebook: NotebookId, path: string): Promise<string> {
    let data = {
        notebook: notebook,
        path: path
    };
    let url = '/api/filetree/getHPathByPath';
    return request(url, data);
}


export async function getHPathByID(id: BlockId): Promise<string> {
    let data = {
        id: id
    };
    let url = '/api/filetree/getHPathByID';
    return request(url, data);
}

// **************************************** Asset Files ****************************************
export type ResUpload = {
    errFiles: string[];
    succMap: { [key: string]: string };
}

export async function upload(assetsDirPath: string, files: any[]): Promise<ResUpload> {
    let form = new FormData();
    form.append('assetsDirPath', assetsDirPath);
    for (let file of files) {
        form.append('file[]', file);
    }
    let url = '/api/asset/upload';
    return request(url, form);
}

// **************************************** Block ****************************************
export type ResdoOperations = {
    doOperations: doOperation[];
    undoOperations: doOperation[] | null;
}
type DataType = "markdown" | "dom";
export async function insertBlock(dataType: DataType, data: string, previousID: BlockId, nextID: BlockId, parentID: BlockId | DocumentId): Promise<ResdoOperations> {
    let data1 = {
        dataType: dataType,
        data: data,
        nextID: nextID,
        previousID: previousID,
        parentID: parentID
    }
    let url = '/api/block/insertBlock';
    return request(url, data1);
}


export async function appendBlock(dataType: DataType, data: string, parentID: BlockId | DocumentId): Promise<ResdoOperations> {
    let data1 = {
        dataType: dataType,
        data: data,
        parentID: parentID
    }
    let url = '/api/block/appendBlock';
    return request(url, data1);
}


export async function updateBlock(dataType: DataType, data: string, id: BlockId): Promise<ResdoOperations> {
    let data1 = {
        dataType: dataType,
        data: data,
        id: id
    }
    let url = '/api/block/updateBlock';
    return request(url, data1);
}


export async function deleteBlock(id: BlockId): Promise<ResdoOperations> {
    let data = {
        id: id
    }
    let url = '/api/block/deleteBlock';
    return request(url, data);
}


export async function moveBlock(id: BlockId, previousID: PreviousID | null = null, parentID: ParentID | null = null): Promise<ResdoOperations> {
    let data = {
        id: id,
        previousID: previousID,
        parentID: parentID
    }
    let url = '/api/block/moveBlock';
    return request(url, data);
}


export type ResGetBlockKramdown = {
    id: BlockId;
    kramdown: string;
}

export async function getBlockKramdown(id: BlockId): Promise<ResGetBlockKramdown> {
    let data = {
        id: id
    }
    let url = '/api/block/getBlockKramdown';
    return request(url, data);
}

export type ChildBlock = {
    id: BlockId;
    type: BlockType;
    subtype?: BlockSubType;
}
export async function getChildBlocks(id: BlockId): Promise<ChildBlock[]> {
    let data = {
        id: id
    }
    let url = '/api/block/getChildBlocks';
    return request(url, data);
}

// **************************************** Attributes ****************************************
export async function setBlockAttrs(id: BlockId, attrs: { [key: string]: string }) {
    let data = {
        id: id,
        attrs: attrs
    }
    let url = '/api/attr/setBlockAttrs';
    return request(url, data);
}


export async function getBlockAttrs(id: BlockId): Promise<{ [key: string]: string }> {
    let data = {
        id: id
    }
    let url = '/api/attr/getBlockAttrs';
    return request(url, data);
}

// **************************************** SQL ****************************************

export async function sql(sql: string): Promise<any[]> {
    let sqldata = {
        stmt: sql,
    };
    let url = '/api/query/sql';
    return request(url, sqldata);
}

export async function getBlockByID(blockId: string): Promise<Block> {
    let sqlScript = `select * from blocks where id ='${blockId}'`;
    let data = await sql(sqlScript);
    return data[0];
}

// **************************************** Template ****************************************

export type ResGetTemplates = {
    content: string;
    path: string;
}
export async function render(id: DocumentId, path: string): Promise<ResGetTemplates> {
    let data = {
        id: id,
        path: path
    }
    let url = '/api/template/render';
    return request(url, data);
}


export async function renderSprig(template: string): Promise<string> {
    let url = '/api/template/renderSprig';
    return request(url, { template: template });
}

// **************************************** File ****************************************

export async function getFile(path: string): Promise<any> {
    let data = {
        path: path
    }
    let url = '/api/file/getFile';
    try {
        let file = await fetchSyncPost(url, data);
        return file;
    } catch (error_msg) {
        return null;
    }
}

export async function getFileBuffer(path: string): Promise<ArrayBuffer | null> {
    let data = {
        path: path
    }
    let url = '/api/file/getFile'
    try {
        let response = await fetch(url, {
            method: "POST", 
            body: JSON.stringify(data)
        })
        let buffer = await response.arrayBuffer()
        return buffer
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function putFile(path: string, isDir: boolean, file: any) {
    let form = new FormData();
    form.append('path', path);
    form.append('isDir', isDir.toString());
    form.append('modTime', Date.now().toString());
    form.append('file', file);
    // 这个请求要求使用 HTTP Multipart 表单，fetchSyncPost 使用 JSON.stringfly() 格式化
    // https://github.com/siyuan-note/siyuan/blob/830c8b55cf1f577e14a21623ee8b9ebd8feda5ce/app/src/util/fetch.ts#L79
    let url = '/api/file/putFile';
    let response = await fetch(url, {
        method: "POST", 
        body: form
    })
    return response.json();
}

export async function removeFile(path: string) {
    let data = {
        path: path
    }
    let url = '/api/file/removeFile';
    return request(url, data);
}


export type ResReadDir = {
    isDir: boolean;
    isSymlink: boolean;
    name: string;
    updated: number;
}
export async function readDir(path: string): Promise<ResReadDir[]> {
    let data = {
        path: path
    }
    let url = '/api/file/readDir';
    return request(url, data);
}


export type ResExportMdContent = {
    hPath: string;
    content: string;
}
export async function exportMdContent(id: DocumentId): Promise<ResExportMdContent> {
    let data = {
        id: id
    }
    let url = '/api/export/exportMdContent';
    return request(url, data);
}

export type PandocArgs = string;
export async function pandoc(args: PandocArgs[]) {
    let data = {
        args: args
    }
    let url = '/api/convert/pandoc';
    return request(url, data);
}


// **************************************** System ****************************************
export type ResBootProgress = {
    progress: number;
    details: string;
}
export async function bootProgress(): Promise<ResBootProgress> {
    return request('/api/system/bootProgress', {});
}


export async function version(): Promise<string> {
    return request('/api/system/version', {});
}


export async function currentTime(): Promise<number> {
    return request('/api/system/currentTime', {});
}
