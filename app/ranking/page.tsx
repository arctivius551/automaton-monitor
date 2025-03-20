"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { WorkBook, WorkSheet, utils } from 'xlsx';
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography} from '@mui/material';
import { CloudUpload, ArrowLeft, ArrowRight} from '@mui/icons-material';
import { fileToWorkbook, dateStrToUnix } from '@util/convert';
import SummaryComponent from '@components/SummaryComponent';
import ReportDisplay from '@components/ReportDisplay';
import HiddenInput from '@components/HiddenInput';
import SheetSelector from '@components/SheetSelector';
import Professions, { getProfession, iconPath} from '../util/professions';

const SummaryDisplayCount = 5;
const initMinimumDays = 2;

export default function Home() {

  const [players, setPlayers]             = useState([] as Player[]);
  const [rankedOverall, setRankedOverall] = useState([] as RankSummary[]);
  const [workbooks, setWorkBooks]         = useState([] as WorkBook[]);
  const [sheetNames, setSheetNames]       = useState([] as string[]);
  const [csvSheets, setCsvSheets]         = useState([] as CsvSheet[]);
  const [columns, setColumns]             = useState([] as string[]);
  const [column, setColumn]               = useState('');
  const [days, setDays]                   = useState(initMinimumDays);

  //Update the Summary Values on selecting new data set or 
  useEffect(()=>{
    let rankData:RankSummary[] = [];
    csvSheets.forEach( sheet => {
      sheet.data.forEach( row =>{
          const name = row.Name;
          let summary = rankData.find( s => s.name === name );
          const player = players.find( p => p.characters.find( c => c.name === name ));
          if( summary ){
            summary.ranks.push( row[column] );
            summary.count += 1;
          }else{
            rankData.push( { name, player, ranks: [row[column]], count: 1 } as RankSummary)
          }
      });
    });
    rankData = rankData.filter( rd => rd.count >= days);
    setRankedOverall(rankData);
  }, [csvSheets, days, column, players]);

  //Update the columns in the select
  useEffect(()=>{
      if( csvSheets && csvSheets[0]?.data ){
          const cols = Object.entries(csvSheets[0].data[0] ).filter( ([k,v]) => typeof(v) === 'number' ).map( ([k,v]) => k );
          setColumns( cols );
          setColumn( cols[0] );
      }
  }, [csvSheets]);

  //Update the player data
  useEffect( ()=> {
    if( workbooks ){
      let players:Player[] = [];
      workbooks.forEach( (wb:WorkBook) => {
        const attendanceWS:WorkSheet = wb.Sheets['DPSStats'];
        const sheetData:any[] = utils.sheet_to_json( attendanceWS );
        sheetData.forEach( row => {

          const id = row['Account'];
          const name = row['Name'];
          const profession = getProfession(row['Profession']);

          const character = ({ name, id, profession } as Character);

          let player = players.find( p => p.id === id );
          if( !player ) {
            player = ({ id , characters: [ character] } as Player);
            players.push( player );
          }
          else{
            if( !player.characters.find( c => c.name === name)) {
              player.characters.push( character );
            }
          }
        });
      });
      
      setPlayers( players );

    }
  }, [workbooks] );

  function loadSheetData( sheetName:string ) {
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
    setCsvSheets(loaded);
  }

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
    let sheetNames = wbs.at(0)?.SheetNames.filter( s => !['fights overview', 'Attendance'].includes(s)) || [];
    sheetNames.sort();
    setSheetNames( sheetNames );
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
      <aside id="controls" className='flex flex-col gap-2 pr-2 border-r-4 border-r-black min-w-72'>
        <Button size='large' component="label" className='w-full' variant="contained" tabIndex={-1} startIcon={<CloudUpload />}>
          Upload files<HiddenInput type="file" onChange={handleFileUpload} multiple />
        </Button>
        <SheetSelector sheetNames={sheetNames} sheetButtonClickHandler={sheetButtonClick} />
      </aside>

      <section className='w-full h-full'>
        <div className='flex flex-row h-full w-full'>

          <article id="summary" className='flex flex-col h-full min-w-60 items-center border-r-black border-r-2 px-2'>
            <Typography variant='h4' className='w-fit text-xl'>Summary</Typography>
            {csvSheets && column && (<Fragment>
              
              <SummaryComponent summaries={rankedOverall} count={SummaryDisplayCount} max={csvSheets.reduce((a,c) => Math.max(a, c.data.length),0)} section="top"    style="success" />
              <SummaryComponent summaries={rankedOverall} count={SummaryDisplayCount} max={csvSheets.reduce((a,c) => Math.max(a, c.data.length),0)} section="bottom" style="danger" />
              
            </Fragment>)}
          </article>

          <article id="days" className='flex flex-col w-full h-full pl-2 bg-white'>
            <ReportDisplay sheets={csvSheets} players={players} column={column} days={
              <Stack border={'black'} direction="row" alignItems="center" spacing={1} justifyContent={'space-between'}>
                <Typography component='span'>Min Days</Typography>
                <IconButton onClick={handleDecrement}> <ArrowLeft /> </IconButton>
                <input type="number" value={days} onChange={handleMinNumberChange} min={1} max={ csvSheets.length }
                 style={{ width: '50px', textAlign: 'center' }}
                />
              <IconButton onClick={handleIncrement}> <ArrowRight /> </IconButton>
            </Stack>
            } columnSelector={
              <FormControl fullWidth>
                  <InputLabel id="column-select-label">Column</InputLabel>
                  <Select labelId="column-select-label" id="column-select" className='w-80' value={column} onChange={handleChange}>
                      {columns.map((col,id) => <MenuItem key={id} value={col}>{col}</MenuItem> )}
                  </Select>
              </FormControl>}/>
          </article>
        </div>
      </section>
    </main>
  );
}


