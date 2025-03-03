"use client";
import { BumpDatum, ResponsiveBump,BumpSerie, DefaultBumpDatum } from '@nivo/bump';
import { ChangeEvent, useState } from 'react';
import { Button, ButtonBase, IconButton, Stack, styled, TextField, Typography} from '@mui/material';
import { CloudUpload} from '@mui/icons-material/';
import { fileToWorkbook } from './util/convert';
import { Sheet, WorkBook, utils } from 'xlsx';
import { ExtractProps } from '@nivo/core';



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

const initData: BumpSerie<BumpDatum,any>[] = [];
const initWorkBooks: WorkBook[] = [];

export default function Home() {

  const [data, setData] = useState(initData);
  const [workbooks, setWorkBooks] = useState(initWorkBooks);

  function sheetButtonClick( event: React.MouseEvent<HTMLButtonElement> ){
    event.preventDefault();
    const sheetName = event.currentTarget.getAttribute('data-name');
    if( sheetName === null || !sheetName) return;

    let series:BumpSerie<BumpDatum,any>[] = [];
    workbooks.forEach( wb =>{
      let sheetJson = utils.sheet_to_json( wb.Sheets[sheetName] );
      console.log( sheetJson );
      sheetJson.forEach( (row:any) => {
        let cleanName:string = row.Name;
        if( cleanName.indexOf( "_{{") !== -1 ){
          cleanName = cleanName.substring( 0, cleanName.indexOf( "_{{") )
        }
        let findSerie = series.find( (_:BumpSerie<BumpDatum,any>) => _.id === cleanName );
        if( !findSerie){
          series.push( { id: cleanName, data:[] } )
          findSerie = series.find( (_:BumpSerie<BumpDatum,any>) => _.id === cleanName );
        }
        findSerie.data.push( { x: row.Date, y: row.Place})
        findSerie.data.sort( (a:BumpDatum,b:BumpDatum) => Date.parse(a.x as string) - Date.parse(b.x as string) );
      })
    })
    console.log( series );
    setData(series)

  }

  async function handleFileUpload( event: ChangeEvent<HTMLInputElement> ) {
    const fileList:FileList|null = event.target.files;
    if( !fileList || fileList.length === 0) return;

    const wbs:Array<WorkBook> = await Promise.all(
      await Array.from( fileList ).map(async (file) => fileToWorkbook( file ))
    );
    setWorkBooks(wbs);
  }

  return (
    <main className="flex flex-row w-full h-lvh p-1 border border-red-500">
      
      <div id="controls" className='flex flex-col'>
      <Button component="label" variant="contained" tabIndex={-1} startIcon={<CloudUpload />}>
        Upload files
        <VisuallyHiddenInput type="file" onChange={handleFileUpload} multiple />
      </Button>
      <div className='border-b-2'></div>
      <Stack spacing={1} direction='column' className='overflow-scroll'>
        {workbooks && workbooks.length > 0 && workbooks.at(0)?.SheetNames.map( sn =>{
          return <Button data-name={sn} component='button' key={sn} variant='contained' color='secondary' size='small' className='w-full' 
          onClick={sheetButtonClick}>{sn}</Button>
        })}
      </Stack>
      </div>
      {/*// @ts-ignore */}
      <ResponsiveBump
          data={data}
          colors={{ scheme: 'spectral' }}
          lineWidth={3}
          activeLineWidth={6}
          inactiveLineWidth={3}
          inactiveOpacity={0.15}
          pointSize={10}
          activePointSize={16}
          inactivePointSize={0}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={3}
          activePointBorderWidth={3}
          pointBorderColor={{ from: 'serie.color' }}
          axisTop={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: -36,
              truncateTickAt: 0
          }}
          axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: 32,
              truncateTickAt: 0
          }}
          axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'ranking',
              legendPosition: 'middle',
              legendOffset: -40,
              truncateTickAt: 0
          }}
          margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
          axisRight={null}
        />
    </main>
  );
}
