"use client";

import { Stack, Typography, List, ListItem, Chip } from "@mui/material";
import { timeConverter, makeSafeForCSS } from "@util/convert";
import { Fragment, useState, useEffect, ReactElement } from "react";
import { highlightPlayerMouseEnterHandler, highlightPlayerMouseLeaveHandler } from "@components/highlightCharacter";

interface ReportDisplayProps {
    sheets: CsvSheet[];
    column: string;
    columnSelector: ReactElement;
}
export default function ReportDisplay( props: ReportDisplayProps) {

    const [sheets, setSheets] = useState( props.sheets );
    const [column, setColumn] = useState( props.column );

    useEffect( () => {
        setSheets(props.sheets);
    }, [props.sheets] );

    useEffect( ()=> {
        setColumn(props.column);
    }, [props.column]);

    return <Fragment>
        <Stack direction='row' className="w-full">
            <Typography variant='h4' className='text-xl w-full'>Report {sheets[0]?.name || "[No Report Selected]"}</Typography>
            {sheets && sheets.length > 0 ? props.columnSelector : <Fragment/>}
        </Stack>
        <Stack direction={'row'}>
            { sheets && props.sheets.map( (sheet:CsvSheet, index:number) => {
                return <div key={index} className='bg-blue-100 border border-blue-300 rounded min-w-48'>
                    <Typography sx={{ m: 0, p: 0}} align='center' className=''>{timeConverter(sheet.date)}</Typography>
                    <List dense={true} className='h-auto overflow-y-auto max-h-svh'>
                        {sheet.data.map( (row:CsvDataRow, index:number) => {
                            const playerClass = makeSafeForCSS(row.Name, 'player');
                            const playerId = `${sheet.date}${playerClass}-${index}`;
                            return <ListItem dense={true} sx={{ p: 0}} id={playerId} key={index || Math.random()} className={playerClass} 
                                onMouseEnter={highlightPlayerMouseEnterHandler}
                                onMouseLeave={highlightPlayerMouseLeaveHandler}>
                                    <Chip size="small" variant="outlined" sx={{ minWidth: '0px', mr: 1}} label={parseFloat((row[column] as number)?.toFixed(2))} />
                                    <Typography variant='body2' component={'span'}>{row.Name}</Typography>
                                <hr/>
                            </ListItem>;
                        })}
                    </List>
                </div>
            })}
        </Stack>
    </Fragment>
}