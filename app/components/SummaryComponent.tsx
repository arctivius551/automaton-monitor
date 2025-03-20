"use client";

import { Chip, List, ListItem, ListItemText, Typography, Stack, Avatar, Badge, Box, ListItemAvatar, Divider } from '@mui/material';
import { Event } from '@mui/icons-material';
import { makeSafeForCSS } from '@util/convert';
import { highlightPlayerMouseEnterHandler, highlightPlayerMouseLeaveHandler } from "@components/highlightCharacter";
import { Fragment } from 'react';
import { iconPath } from '../util/professions';

//summaries={rankedOverall.slice(0,SummaryDisplayCount)} start={0} end={SummaryDisplayCount}  style="success" title={`Top ${SummaryDisplayCount} Players`}   />
//summaries={rankedOverall.slice(-SummaryDisplayCount)}  start={rankedOverall.length- SummaryDisplayCount} end={} style="danger"  title={`Bottom ${SummaryDisplayCount} Players`}/>

type Section = 'top'|'bottom';
interface SummaryProps {
    summaries: RankSummary[];
    section: Section;
    count: number;
    max: number;
    style: "success" | "warning" | "danger" | "info" | "default";    
}

export default function SummaryComponent (props:SummaryProps) {

    function sublist():RankSummary[] {
        return props.section === 'top' ? props.summaries.slice(0, props.count) : props.summaries.slice(-props.count);
    }

    function summaryIndex( i:number ){
        return 1 + (props.section === 'top' ? i : props.max - props.count + i);
    }

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
        <div className={`flex flex-col align-center mx-2 mb-2 rounded rounded-b-none px-2 ${applyStyleClasses()}`}>
            <Typography align='center'>{`${props.section.charAt(0).toUpperCase()}${props.section.slice(1)} ${props.count} Players`}</Typography>

            <List dense={true} disablePadding>
                {sublist().map( (summary:RankSummary,i:number) => {
                    const player = summary.player;
                    const character = player.characters.find( c => c.name === summary.name );

                    return (
                        <ListItem key={i} dense={true} alignItems="flex-start" disablePadding>
                            <ListItemAvatar sx={{mt:3, mr:0}}>
                                <Badge color="info" badgeContent={ summaryIndex(i)  }>
                                    <Avatar sx={{ width: 32, height: 32}} alt={character?.profession.name ?? 'Default'} src={ iconPath(character) } />
                                </Badge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Stack component='span' direction='row' justifyContent={'space-between'}>
                                    <Stack direction='row' gap={2}>
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
                                </Stack>}
                                
                                secondary={<Stack direction='row'>
                                    <Chip component={'span'} size='small' variant="outlined" label={`Avg Rank ${(summary.ranks.reduce( (acc,cur) => acc + cur) / summary.count).toFixed(2)}`} />
                                    <Chip component={'span'} size='small' variant="outlined" label={`Days ${summary.count}`} />
                                </Stack>}
                            />  
                        </ListItem>
                    );
                })}
            </List>
        </div>);
};
