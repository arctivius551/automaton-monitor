"use client";

import { Stack, Typography, List, ListItem, Chip, Box } from "@mui/material";
import { timeConverter, makeSafeForCSS } from "@util/convert";
import { Fragment, useState, useEffect, ReactElement } from "react";
import { highlightPlayerMouseEnterHandler, highlightPlayerMouseLeaveHandler } from "@components/highlightCharacter";
import { getProfessionColor } from '@util/colors';
import Professions from "../util/professions";

const professionColorHexOpacity = '55'; //Alpha component of #RRGGBBAA

interface ReportDisplayProps {
    sheets: CsvSheet[];
    players: Player[];
    column: string;
    columnSelector: ReactElement;
    filterElement: ReactElement;
    filters: string[];
}
export default function ReportDisplay( props: ReportDisplayProps) {

    const [sheets, setSheets]   = useState( props.sheets );
    const [column, setColumn]   = useState( props.column );
    const [filters, setFilters]   = useState( props.filters );

    useEffect( () => setSheets(props.sheets),   [props.sheets] );
    useEffect( () => setColumn(props.column),   [props.column] );
    useEffect( () => setFilters(props.filters), [props.filters]);

    return <Box className="min-h-full min-w-full" id="report_display">
        <Stack direction='column'>
            <Stack direction='row' className='' flexBasis='start' gap={2} >
                <Stack direction='column' className=''>
                    <Typography variant='h4' className='text-xl w-full'>Report {sheets[0]?.name || "[No Report Selected]"}</Typography>
                </Stack>
                { sheets && sheets.length > 0 ? props.filterElement : <Fragment/> }
                { sheets && sheets.length > 0 ? props.columnSelector : <Fragment/> }
            </Stack>
            <Stack direction='row' className='border border-blue-500'>
                <Stack direction={'row'}>
                    { sheets && props.sheets.map( (sheet:CsvSheet, index:number) => {
                        const sheetId = `__sheet${makeSafeForCSS(`${sheet.name}-${sheet.date}`)}`;
                        return <div key={`${sheetId}-${index ?? Math.random()}`} id={sheetId} 
                            className='bg-blue-100 border border-blue-300 rounded min-w-48 min-h-lvh'>
                            <Typography sx={{ m: 0, p: 0}} align='center' className='border-b border-b-slate-600 bg-slate-300'>{timeConverter(sheet.date)}</Typography>
                            <List dense={true} className='h-lvh overflow-y-auto'>
                                {sheet.data
                                    .filter( (dr:CsvDataRow) => filters.includes( Professions[dr.Profession].base) )
                                    .map( (row:CsvDataRow, index:number) => {
                                        
                                        const playerClass = makeSafeForCSS(row.Name, 'player');
                                        const playerId = `${sheet.date}${playerClass}-${index ?? Math.random()}`;
                                        const professionColor = getProfessionColor(row.Profession);
                                        
                                        return(
                                            <ListItem dense={true} sx={{ p: 0}} id={playerId} key={playerId} className={`${playerClass}`} 
                                                onMouseEnter={highlightPlayerMouseEnterHandler}
                                                onMouseLeave={highlightPlayerMouseLeaveHandler}>
                                                    <Chip size="small" variant="outlined" label={parseFloat((row[column] as number)?.toFixed(2))}
                                                        sx={{ 
                                                            minWidth: '0px', 
                                                            mr: 1,
                                                            border: `1px solid ${professionColor}`,
                                                            background: `${professionColor}${professionColorHexOpacity}`
                                                        }}
                                                    />
                                                    <Typography variant='body2' component={'span'}>{row.Name}</Typography>
                                                <hr/>
                                            </ListItem>
                                        );
                                    })
                                }
                            </List>
                        </div>
                    })}
                </Stack> 
            </Stack>
        </Stack>
    </Box>
}