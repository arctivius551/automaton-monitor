"use client";

import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { WorkBook, utils } from 'xlsx';
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography} from '@mui/material';
import { CloudUpload, ArrowLeft, ArrowRight} from '@mui/icons-material';
import SummaryComponent from '@components/SummaryComponent';
import ReportDisplay from '@components/ReportDisplay';
import HiddenInput from '@components/HiddenInput';
import { fileToWorkbook, dateStrToUnix } from '@util/convert';

const initWorkBooks: WorkBook[] = [];
const initCsvSheets:CsvSheet[]  = [];
const initSheetNames:string[] | undefined = [];
const initRankedOverall:RankSummary[] = Array.from( "*".repeat(10)).map( (e,i) => ({ player: e + i, ranks: [i], count: 1} as RankSummary));
const initColumn:string = "";
const initColumns:string[] = [];
const SummaryDisplayCount = 5;
const initMinimumDays = 2;

export default function Home() {

  const [rankedOverall, setRankedOverall] = useState(initRankedOverall);
  const [workbooks, setWorkBooks]         = useState(initWorkBooks);
  const [sheetNames, setSheetNames]       = useState(initSheetNames);
  const [csvSheets, setCsvSheets]         = useState(initCsvSheets);
  const [columns, setColumns]             = useState(initColumns);
  const [column, setColumn]               = useState(initColumn);
  const [days, setDays]                  = useState(initMinimumDays);

  function loadSheetData( sheetName:string ) {
    console.log('loadSheetData');
    console.log( csvSheets );
    const loaded = workbooks.map( (wb:WorkBook) =>{
      const sheetData:any[] = utils.sheet_to_json( wb.Sheets[sheetName] );
      sheetData?.forEach( row => {
        const indicator = "_{{";
        if( row.Name.includes( indicator )){
          const match = row.Name.match(/{{([^}]*)}}/);
          row.Profession = match ? match[1] : '';
          row.Name = row.Name.substring( 0, row.Name.indexOf( indicator ));
        }
      });
      return {
        name: sheetName,
        date: dateStrToUnix(sheetData[0]?.Date),
        data: sheetData
      } as CsvSheet;
    });
    console.log('loaded', loaded );
    setCsvSheets(loaded);
    
    console.log( 'csvSheets',csvSheets );
  }

  //Update the Summary Values on selecting new data set or 
  useEffect(()=>{
    let rankData:RankSummary[] = [];
    csvSheets.forEach( sheet => {
      sheet.data.forEach( row =>{
          let player = rankData.find( p => p.player === row.Name );
          if( player ){
            player.ranks.push( row[column] );
            player.count += 1;
          }else{
            rankData.push( { player:row.Name, ranks: [row[column]], count: 1 } as RankSummary)
          }
      })
    });
    rankData = rankData.filter( rd => rd.count >= days);
    setRankedOverall(rankData);
  }, [csvSheets, days, column]);

  //Update the columns in the select
  useEffect(()=>{
      if( csvSheets && csvSheets[0]?.data ){
          const cols = Object.entries(csvSheets[0].data[0] ).filter( ([k,v]) => typeof(v) === 'number' ).map( ([k,v]) => k );
          setColumns( cols );
          setColumn( cols[0] );
      }
  }, [csvSheets]);

  function handleChange(event:SelectChangeEvent<string>) {
      setColumn(event.target.value);
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

  const handleDecrement = () => {
    setDays((prevDays) => Math.max(prevDays - 1, 1)); // Ensure days don't go below 1
  };

  const handleIncrement = () => {
    setDays((prevDays) =>Math.min( prevDays + 1, csvSheets.length)); //Ensure days don't go above number of loaded sheets
  };

  const handleMinNumberChange = (event:any) => {
    let value = parseInt(event.target.value, 10);
    if( !isNaN(value)){
      value = value < 1 ? 1 : value;
      value = value > csvSheets.length ? csvSheets.length : value;
      setDays( value );
    }
  };

  return (
    <main className="flex flex-row w-full h-lvh p-1 bg-slate-300">
      <aside id="controls" className='flex flex-col gap-2 pr-2 border-r-4 border-r-black'>
        <Button size='large' component="label" className='w-72' variant="contained" tabIndex={-1} startIcon={<CloudUpload />}>
          Upload files<HiddenInput type="file" onChange={handleFileUpload} multiple />
        </Button>
        <Stack spacing={1} direction='column' className='overflow-y-scroll'>
          { sheetNames && sheetNames.map( (sn,i) =>{
            return <Button data-name={sn} component='button' key={i} variant='contained' color='secondary' size='small' className='w-full' 
            onClick={sheetButtonClick}>{sn}</Button>
          })}
        </Stack>
      </aside>

      <section className='w-full h-full'>
        <div className='flex flex-row h-full w-full'>

          <article id="summary" className='flex flex-col h-full min-w-60 items-center border-r-black border-r-2 px-2'>
            <Typography variant='h4' className='w-fit text-xl'>Summary</Typography>
            {csvSheets && column && (<Fragment>
              <Stack direction="row" alignItems="center" spacing={1} justifyContent={'space-between'}>
                <Typography>Min Days</Typography>
                <IconButton onClick={handleDecrement}> <ArrowLeft /> </IconButton>
                <input type="number" value={days} onChange={handleMinNumberChange} min={1} max={ csvSheets.length }
                  style={{ width: '50px', textAlign: 'center' }}
                />
                <IconButton onClick={handleIncrement}> <ArrowRight /> </IconButton>
              </Stack>
              <SummaryComponent players={rankedOverall.slice(0,SummaryDisplayCount)} style="success" title={`Top ${SummaryDisplayCount} Players`}   />
              <SummaryComponent players={rankedOverall.slice(-SummaryDisplayCount)}  style="danger"  title={`Bottom ${SummaryDisplayCount} Players`}/>
              
            </Fragment>)}
          </article>

          <article id="days" className='flex flex-col w-full h-full pl-2 bg-white'>
            <ReportDisplay sheets={csvSheets} column={column} columnSelector={
              <FormControl size='small' fullWidth>
                  <InputLabel id="column-select-label">Column</InputLabel>
                  <Select labelId="column-select-label" id="column-select" className='w-1/4' value={column} onChange={handleChange}>
                      {columns.map((col,id) => <MenuItem key={id} value={col}>{col}</MenuItem> )}
                  </Select>
              </FormControl>}/>
          </article>
        </div>
      </section>
    </main>
  );
}


