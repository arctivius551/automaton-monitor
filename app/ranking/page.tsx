"use client";

import { ChangeEvent, useState } from 'react';
import { WorkBook, utils } from 'xlsx';
import { Button, Stack, Typography} from '@mui/material';
import { CloudUpload} from '@mui/icons-material/';
import SummaryComponent from '@components/SummaryComponent';
import ReportDisplay from '@components/ReportDisplay';
import HiddenInput from '@components/HiddenInput';
import { fileToWorkbook, dateStrToUnix } from '@util/convert';

const testList = ['Arctivius Feywild','Capt Scaldy Balz','Jinx Storm','Maj Ravenwhisper','Agent Sandiego'];

const initWorkBooks: WorkBook[] = [];
const initCsvSheets:CsvSheet[]  = [];
const initSheetNames:string[] | undefined = [];

export default function Home() {

  const [workbooks, setWorkBooks]   = useState(initWorkBooks);
  const [sheetNames, setSheetNames] = useState(initSheetNames);
  const [csvSheets, setCsvSheets]   = useState(initCsvSheets);

  function loadSheetData( sheetName:string ) {

    setCsvSheets( workbooks.map( (wb:WorkBook) => {
      let dataRows = (utils.sheet_to_json( wb.Sheets[sheetName] ) as CsvDataRow[])
        .map( (s:CsvDataRow) => {
        const indicator = "_{{"
        if( s.Name.includes( indicator )){
          const match = s.Name.match(/{{([^}]*)}}/);
          s.Profession = match ? match[1] : '';
          s.Name = s.Name.substring( 0, s.Name.indexOf( indicator ));
        }
        return s;
      });

      return {
        name: sheetName,
        date: dateStrToUnix(dataRows[0].Date),
        rows: dataRows,
      };
    }));

    console.log( csvSheets );
  }

  function sheetButtonClick( event: React.MouseEvent<HTMLButtonElement> ){
    event.preventDefault();
    const sheetName = event.currentTarget.getAttribute('data-name');
    if( sheetName === null || !sheetName){
      alert( `Couldn't find sheet ${sheetName} in workbook`);
      return;
    }
    loadSheetData(sheetName);
  }

  async function handleFileUpload( event: ChangeEvent<HTMLInputElement> ) {
    const fileList:FileList|null = event.target.files;
    if( !fileList || fileList.length === 0) return;

    const wbs:Array<WorkBook> = await Promise.all(
      await Array.from( fileList ).map(async (file) => fileToWorkbook( file ))
    );
    setWorkBooks(wbs);
    setSheetNames( wbs.at(0)?.SheetNames.filter( s => !['fights overview', 'Attendance'].includes(s)));
  }

  return (
    <main className="flex flex-row w-full h-lvh p-1">
      <aside id="controls" className='flex flex-col gap-2'>
        <Button component="label" className='w-72' variant="contained" tabIndex={-1} startIcon={<CloudUpload />}>
          Upload files<HiddenInput type="file" onChange={handleFileUpload} multiple />
        </Button>
        <Stack spacing={1} direction='column' className='overflow-scroll border-r-4 border-r-black '>
          { sheetNames && sheetNames.map( sn =>{
            return <Button data-name={sn} component='button' key={sn} variant='contained' color='secondary' size='small' className='w-full' 
            onClick={sheetButtonClick}>{sn}</Button>
          })}
        </Stack>
      </aside>

      <section className='w-full pl-3'>
        <div className='flex flex-row gap-2'>
          <article id="summary" className='flex flex-col min-w-48 items-center'>
            <Typography variant='h4' className='w-fit text-xl'>Summary</Typography>
            <SummaryComponent players={testList} style="success" title={`Top ${testList.length} Players`}   />
            <SummaryComponent players={testList} style="danger"  title={`Bottom ${testList.length} Players`}/>
          </article>
          <article id="days" className='flex flex-col'>
            <ReportDisplay sheets={csvSheets} />
          </article>
        </div>
      </section>
    </main>
  );
}


