import { Fragment } from 'react';
import { Chip, List, ListItem, ListItemText, styled, Typography } from '@mui/material';

interface SummaryProps {
    title: string;
    players: string[];
    style: "success" | "warning" | "danger" | "info" | "default";
    
}

export default function SummaryComponent (props:SummaryProps) {

    function applyStyleClasses() {
        switch( props.style ){
            case "success": return "bg-green-100 border border-green-300";
            case "warning": return "bg-amber-100 border border-amber-300";
            case "danger": return "bg-red-100 border border-red-300";
            case "info": return "bg-blue-100 border border-blue-300";
            default: return "bg-gray-100 border border-gray-300";
        }
    }

    return( 
        <div className={`flex flex-col align-center w-full mx-2 mb-2 rounded rounded-b-none ${applyStyleClasses()}`}>
            <Typography align='center'>{props.title}</Typography>
            <List dense={true}>
                {props.players.map( (el,i)=>
                    <ListItem dense={true} alignItems="flex-start" key={i}>
                        <ListItemText  
                            primary={<Typography>{el}</Typography>}
                            secondary={
                                <Fragment>
                                    <Chip component={'span'} size='small' variant="outlined" label="Avg Rank 1.32" />
                                    <Chip component={'span'} size='small' variant="outlined" label="Days 5" />
                                </Fragment>}
                        />
                    </ListItem>
                )}
            </List>
        </div>);
};
