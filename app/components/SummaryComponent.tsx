"use client";

import { Chip, List, ListItem, ListItemText, Typography, Stack, Avatar, Badge, Box, ListItemAvatar, Divider } from '@mui/material';
import { Event } from '@mui/icons-material';
import { makeSafeForCSS } from '@util/convert';
import { highlightPlayerMouseEnterHandler, highlightPlayerMouseLeaveHandler } from "@components/highlightCharacter";
import { Fragment } from 'react';

interface SummaryProps {
    title: string;
    summaries: RankSummary[];
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
        <div className={`flex flex-col align-center w-full mx-2 mb-2 rounded rounded-b-none px-2 ${applyStyleClasses()}`}>
            <Typography align='center'>{props.title}</Typography>

            <List dense={true} disablePadding>
                {props.summaries.map( (summary,i)=>
                    <ListItem key={i} dense={true} alignItems="flex-start" disablePadding>
                        <ListItemText
                            primary={
                                <Stack component='span' direction='row' justifyContent={'space-between'}>
                                    <Stack direction='row' gap={1}>
                                        <Avatar sx={{ width: 32, height: 32, mt: 1}} alt={summary.player.characters.find( c => c)?.profession ?? 'Any'} src={`icons/${summary.player.characters.find( c => c)?.profession ?? 'Any'}.png`} />
                                        <Stack component='span' direction='column'>
                                            <Typography variant='body2' className={makeSafeForCSS(summary.name, 'player')} 
                                                onMouseEnter={highlightPlayerMouseEnterHandler}
                                                onMouseLeave={highlightPlayerMouseLeaveHandler}>
                                                    {summary.name}
                                            </Typography>
                                            <Typography variant='caption' component={'span'}>
                                                {summary.player?.id}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            }
                            secondary={
                                <Stack component='span' direction='row' gap={1} justifyContent='space-between'  sx={{ pr: 1}}>
                                    <Chip component={'span'} size='small' variant="outlined" label={`Avg Rank ${(summary.ranks.reduce( (acc,cur) => acc + cur) / summary.count).toFixed(2)}`} />
                                    <Badge color="info" badgeContent={summary.count}>
                                        <Event color='disabled'/>
                                    </Badge>                                    
                                </Stack>}
                        />  
                    </ListItem>
                )}
            </List>
        </div>);
};
