import {read, WorkBook} from 'xlsx';

export async function fileToWorkbook( xlsFile:File ):Promise<WorkBook> {
    //console.log( xlsFile.name  );
    const wb = read( await xlsFile.arrayBuffer());
    //console.log( wb.SheetNames.join(','));
    //console.log( JSON.stringify(utils.sheet_to_json(wb)))
    return wb;
}

export function dateStrToUnix( date:string ):number {
    return new Date(date).getTime() / 1000;
}

export function timeConverter(UNIX_timestamp:number){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    return `${month} ${date}`;
}

export function makeSafeForCSS(name:string, prefix:string=''):string {
    return `__${prefix ? prefix + '-' : ''}` + name.toLocaleLowerCase().replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return '-';
        return `-${('000' + c.toString(16)).slice(-4)}`;
    });
}