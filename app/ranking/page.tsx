"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { WorkBook, utils } from 'xlsx';
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography} from '@mui/material';
import { CloudUpload, ArrowLeft, ArrowRight, Star, Clear} from '@mui/icons-material';
import { fileToWorkbook, dateStrToUnix } from '@util/convert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';
import { styled } from '@mui/system';
import SummaryComponent from '@components/SummaryComponent';
import ReportDisplay from '@components/ReportDisplay';
import HiddenInput from '@components/HiddenInput';


const favoriteTheme = createTheme({
  palette: {
    primary: {
      main: yellow[500],
      light: yellow[300],
      dark: yellow[700], 
    }
  }
});
const StyledStarIcon = styled(Star)({
  stroke: 'black',
  strokeWidth: 2
});

const StyledClear = styled(Clear)({
  stroke: 'black',
  strokeWidth: 2
});

const initWorkBooks: WorkBook[] = [];
const initCsvSheets:CsvSheet[]  = [];
const initSheetNames:string[] | undefined = [];
const initFavorites:string[] | undefined = [];
const initRankedOverall:RankSummary[] = Array.from( "*".repeat(10)).map( (e,i) => ({ player: e + i, ranks: [i], count: 1} as RankSummary));
const initColumn:string = "";
const initColumns:string[] = [];
const SummaryDisplayCount = 5;
const initMinimumDays = 2;

export default function Home() {

  const [rankedOverall, setRankedOverall] = useState(initRankedOverall);
  const [workbooks, setWorkBooks]         = useState(initWorkBooks);
  const [sheetNames, setSheetNames]       = useState(initSheetNames);
  const [favorites, setFavorites]         = useState(initFavorites)
  const [csvSheets, setCsvSheets]         = useState(initCsvSheets);
  const [columns, setColumns]             = useState(initColumns);
  const [column, setColumn]               = useState(initColumn);
  const [days, setDays]                   = useState(initMinimumDays);

  const FavoriteReportLSKey = 'FavoriteReportLSKey';

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

  useEffect(()=> setFavorites(JSON.parse(localStorage.getItem(FavoriteReportLSKey) ?? '[]')), []);
  useEffect(()=> localStorage.setItem(FavoriteReportLSKey, JSON.stringify(favorites)),[favorites]);

  function toggleFavorite( event:React.MouseEvent<HTMLButtonElement> ) {
    event.preventDefault();
    const name = event.currentTarget.getAttribute('data-name');
    if( name && favorites ){
      if( favorites.includes( name )) {
        setFavorites(favorites.filter( i => i !== name));
      }
      else{
        setFavorites( [...favorites, name].toSorted());
      }
    }
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
    setFavorites(JSON.parse(localStorage.getItem(FavoriteReportLSKey) ?? '[]' ).toSorted());
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
        <ThemeProvider theme={favoriteTheme}>
          <Stack spacing={1} direction='column' className='overflow-y-scroll'>
            { sheetNames && sheetNames.length > 0 && favorites && favorites.map( (f,i)=>{
              return <Stack direction={'row'} key={i}>
                <IconButton data-name={f} onClick={toggleFavorite} color={ favorites.includes(f) ? 'primary' : 'default' } aria-label="delete">
                  <StyledClear /> 
                </IconButton>
                <Button data-name={f} key={i} variant='contained' color='primary' size='small' className='w-full over' onClick={sheetButtonClick} sx={{
                      marginX: '10px',
                      overflowWrap: 'anywhere'
                    }}>
                  <Typography variant='subtitle1'>{f}</Typography>
                </Button>
              </Stack>
            })}
            <hr />
            { sheetNames && sheetNames.map( (sn,i) =>{
              return <Stack direction={'row'} key={sn}>
                  <IconButton data-name={sn} onClick={toggleFavorite} color={ (favorites || []).includes(sn) ? 'primary' : 'default' } aria-label="delete">
                    <StyledStarIcon /> 
                  </IconButton>
                <Button data-name={sn} key={i} variant='contained' color='secondary' size='small' className='w-full' sx={{
                  marginX: '20px',
                  overflowWrap: 'anywhere'
                }} onClick={sheetButtonClick}>{sn}</Button>
              </Stack>
            })}
          </Stack>
        </ThemeProvider>
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


