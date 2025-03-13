import { Stack, Typography, List, ListItem, Chip } from "@mui/material";
import { timeConverter, makeSafeForCSS } from "@util/convert";
import { Fragment } from "react";

interface ReportDisplayProps {
    sheets: CsvSheet[]
}

export default function ReportDisplay( props: ReportDisplayProps) {

    const toggleStyles = ['bg-red-500'];

    function toggleClassesForPlayer( element:HTMLLIElement, toggleOn:boolean, tailwindClasses:string[]){
        const playerClassName = element.classList.values().find( c => c.startsWith('__player') );
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
        toggleClassesForPlayer( event.currentTarget, true, toggleStyles );
    }

    function playerMouseLeaveHandler( event: React.MouseEvent<HTMLLIElement>){
        toggleClassesForPlayer( event.currentTarget, false, toggleStyles);
    }

    return <Fragment>
        <Typography variant='h4' className='w-fit text-xl'>Report {props.sheets[0]?.name || "[No Report Selected]"}</Typography>
        <Stack direction={'row'}>
            { props.sheets && props.sheets.map( (sheet:CsvSheet) =>
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
        </Fragment>
}