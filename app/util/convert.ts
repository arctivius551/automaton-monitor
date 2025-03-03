import {read, utils, WorkBook} from 'xlsx';
import path from 'node:path';
console.log( path.join( process.cwd(), 'data') );

export async function fileToWorkbook( xlsFile:File ):Promise<WorkBook> {
    console.log( xlsFile.name  );
    const wb = read( await xlsFile.arrayBuffer());
    console.log( wb.SheetNames.join(','))

    console.log( JSON.stringify(utils.sheet_to_json(wb)))
    return wb;
}