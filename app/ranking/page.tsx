"use client";
import { ChangeEvent, Fragment, useState } from 'react';
import { Button, Chip, List, ListItem, ListItemText, Stack, styled, Typography} from '@mui/material';
import { CloudUpload} from '@mui/icons-material/';
import { fileToWorkbook, dateStrToUnix, timeConverter, makeSafeForCSS } from '../util/convert';
import { WorkBook, Sheet, utils } from 'xlsx';
import {ProffessionColors} from '../util/colors';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const testList = ['Arctivius Feywild','Arctivius Feywild','Arctivius Feywild','Arctivius Feywild','Arctivius Feywild'];

interface RankDataPoint {
  date: number,
  rank: number,
}

interface RankDataSeries {
  id:string;
  data:RankDataPoint[];
}

interface CsvSheet {
  name:string;
  date:number;
  rows:CsvDataRow[];
}

interface CsvDataRow {
  Date:string;
  Name:string;
  Place:string;
  Profession:string;
}

function CsvDataToRankData( csv:CsvDataRow ): RankDataPoint{
  const retVal:RankDataPoint = { 
    date: dateStrToUnix(csv.Date), 
    rank: parseInt(csv.Place)
  };
  return retVal;
}

const initData:RankDataSeries[]   = [];
const initWorkBooks: WorkBook[]   = [];
const initCsvData:CsvDataRow[][]  = [];
const initCsvSheets:CsvSheet[]    = [];
const initSheetNames:string[] | undefined = [];

export default function Home() {

  const [data, setData]             = useState(initData);
  const [csvData, setCsvData]       = useState(initCsvData);
  const [workbooks, setWorkBooks]   = useState(initWorkBooks);
  const [sheetNames, setSheetNames] = useState(initSheetNames);
  const [csvSheets, setCsvSheets]   = useState(initCsvSheets);

  function loadSheetData( sheetName:string ){
    console.log( `----------------------loading ${sheetName}------------------------------`);
    setData(initData); //Clear the chart to rebuild
    setCsvData(initCsvData);

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

    console.log( csvSheets.map( s => s.name ))
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

  function toggleClassesForPlayer( playerClassName:string, toggleOn:boolean, tailwindClasses:string[]){
    document.querySelectorAll( `.${playerClassName}` ).forEach( element => {
      tailwindClasses.forEach( twc => {
        if( toggleOn ){
          element.classList.add(twc)
        }else{
          element.classList.remove(twc);
        }
      })
    })
  }

  function playerMouseEnterHandler( event: React.MouseEvent<HTMLLIElement>){
    const target = event.currentTarget;
    const playerClass = target.classList.values().find( c => c.startsWith('__player') )
    console.log(target, target.classList, playerClass);
    toggleClassesForPlayer( playerClass ?? '', true, ['bg-red-500']);
  }

  function playerMouseLeaveHandler( event: React.MouseEvent<HTMLLIElement>){
    const target = event.currentTarget;
    const playerClass = target.classList.values().find( c => c.startsWith('__player') )
    toggleClassesForPlayer( playerClass ?? '', false, ['bg-red-500']);
  }

  return (
    <main className="flex flex-row w-full h-lvh p-1 border border-red-500">
      <aside id="controls" className='flex flex-col gap-2'>
        <Button component="label" className='w-72' variant="contained" tabIndex={-1} startIcon={<CloudUpload />}>
          Upload files<VisuallyHiddenInput type="file" onChange={handleFileUpload} multiple />
        </Button>
        <Stack spacing={1} direction='column' className='overflow-scroll border-r-4 border-r-black '>
          { sheetNames && sheetNames.map( sn =>{
            return <Button data-name={sn} component='button' key={sn} variant='contained' color='secondary' size='small' className='w-full' 
            onClick={sheetButtonClick}>{sn}</Button>
          })}
        </Stack>
      </aside>
      <section className='w-full border'>
        <div className='flex flex-row gap-2'>

        <article id="summary" className='flex flex-col min-w-48 items-center'>
            <Typography variant='h4' className='w-fit text-xl'>Summary</Typography>
            <div className='flex flex-col align-center w-full mx-2 bg-green-100 border border-green-300 rounded rounded-b-none'>
              <Typography align='center'>Top 5 Players</Typography>
              <List dense={true}>
                {testList.map( (el,i)=>
                <ListItem dense={true} alignItems="flex-start" key={i}>
                  <ListItemText 
                    primary={<Typography>Arctivius FeyWild</Typography>}
                    secondary={
                      <Fragment>
                        <Chip size='small' variant="outlined" label="Avg Rank 1.32" />
                        <Chip size='small' variant="outlined" label="Days 5" />
                      </Fragment>
                    }/>
                </ListItem>)}
              </List>
            </div>

            <div className='flex flex-col align-center w-full mx-2 bg-red-100 border border-red-300 rounded rounded-t-none mt-2'>
              <Typography sx={{ m: 0, p: 0}} align='center'>Bottom 5 Players</Typography>
              <List dense={true}>
                {testList.map( (el,i)=>
                <ListItem dense={true} alignItems="flex-start" key={i} className={`${makeSafeForCSS(el,'player')}`}>
                  <ListItemText 
                    primary={<Typography>{el}</Typography>}
                    secondary={
                      <Fragment>
                        <Chip size='small' variant="outlined" label="Avg Rank 1.32" />
                        <Chip size='small' variant="outlined" label="Days 5" />
                      </Fragment>
                    }/>
                </ListItem>)}
              </List>
            </div>
          </article>


          <article id="days" className='flex flex-col'>
          <Typography variant='h4' className='w-fit text-xl'>{csvSheets[0]?.name || "Choose a report"}</Typography>
          <Stack direction={'row'}>
            { csvSheets && csvSheets.map( (sheet:CsvSheet) =>
              <div key={sheet.date} className='bg-blue-100 border border-blue-300 rounded min-w-60'>
                <Typography sx={{ m: 0, p: 0}} align='center' className=''>{timeConverter(sheet.date)}</Typography>
                <List className='h-auto overflow-y-auto max-h-svh'>
                  {sheet.rows.map( (row:CsvDataRow) =>
                      <ListItem dense={true} component={'li'}
                        id={`${sheet.date}${makeSafeForCSS(row?.Name, 'player')}-${row.Place}`} 
                        key={`${sheet.date}${makeSafeForCSS(row?.Name,'player')}-${row.Place}`}  
                        className={`${ makeSafeForCSS(row.Name, 'player')}`} 
                        onMouseEnter={playerMouseEnterHandler}
                        onMouseLeave={playerMouseLeaveHandler}>
                          <Chip size="small" variant="outlined" sx={{ minWidth: '0px', mr: 1}} label={row.Place} />
                          <Typography variant='body2' component={'span'}>{row.Name}</Typography>
                        <hr/>
                      </ListItem>
                  )}
                </List>
              </div>
            )}
            </Stack>
          </article>
        </div>
      </section>
    </main>
  );
}


