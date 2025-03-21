"use client";

import { Clear, Star } from "@mui/icons-material";
import { Stack, Typography, Button, IconButton, ThemeProvider, createTheme, styled, Divider } from "@mui/material";
import { yellow } from "@mui/material/colors";
import React, { useState, useEffect } from "react";

const StyledStarIcon = styled(Star)({  stroke: 'black', strokeWidth: 2 });
const StyledClear    = styled(Clear)({ stroke: 'black', strokeWidth: 2 });
const favoriteTheme  = createTheme({
  palette: {
    primary: {
      main: yellow[500],
      light: yellow[300],
      dark: yellow[700], 
    }
  }
});

const FavoriteReportLSKey = 'FavoriteReportLSKey';
const initFavorites:string[] | undefined = [];

interface SheetSelectorProps {
    sheetNames:string[] | undefined;
    sheetButtonClickHandler: React.MouseEventHandler<HTMLButtonElement>;
}

export default function SheetSelector( props: SheetSelectorProps) {

    const [sheetNames, setSheetNames] = useState( props.sheetNames );
    useEffect( () => setSheetNames(props.sheetNames), [props.sheetNames] );

    const [favorites, setFavorites] = useState(initFavorites);
    useEffect(()=> setFavorites(JSON.parse(localStorage.getItem(FavoriteReportLSKey) ?? '[]')), []);
    useEffect(()=> localStorage.setItem(FavoriteReportLSKey, JSON.stringify(favorites)),[favorites]);

    function toggleFavorite( event:React.MouseEvent<HTMLButtonElement> ) {
        event.preventDefault();
        const name = event.currentTarget.getAttribute('data-name');
        if( name && favorites ){
            if( favorites.includes( name )) {
                setFavorites( favorites.filter( i => i !== name) );
            }
            else {
                setFavorites( [...favorites, name].toSorted() );
            }
        }
    }

    return <ThemeProvider theme={favoriteTheme}>
        <Stack spacing={1} direction='column' className='overflow-y-auto'>
            { favorites && favorites.length > 0 && <Divider>Favorites</Divider> }
            { sheetNames && sheetNames.length > 0 && favorites && favorites.map( (f,i) =>{
                return <Stack direction={'row'} key={i}>
                    <IconButton data-name={f} onClick={toggleFavorite} color={ favorites.includes(f) ? 'primary' : 'default' } aria-label={`Favorite Sheet Select Button - ${f}`}>
                        <StyledClear /> 
                    </IconButton>
                    <Button data-name={f} key={i} variant='contained' color='primary' size='small' className='w-full' onClick={props.sheetButtonClickHandler} sx={{
                            marginRight: '20px',
                            overflowWrap: 'anywhere'
                        }}>
                        <Typography variant='subtitle1'>{f}</Typography>
                    </Button>
                </Stack>
            })}
            { sheetNames && sheetNames.length > 0 &&  <Divider>Reports</Divider> }
            { sheetNames && sheetNames.map( (sn,i) =>{
                return <Stack direction={'row'} key={sn}>
                    <IconButton data-name={sn} onClick={toggleFavorite} color={ (favorites || []).includes(sn) ? 'primary' : 'default' } aria-label={`Sheet Select Button - ${sn}`}>
                        <StyledStarIcon />
                    </IconButton>
                    <Button data-name={sn} key={i} variant='contained' color='secondary' size='small' className="w-full" onClick={props.sheetButtonClickHandler} sx={{
                            marginRight: '20px',
                            overflowWrap: 'anywhere'
                        }}>
                        <Typography variant="body2">{sn}</Typography>
                    </Button>
                </Stack>
            })}
        </Stack>
    </ThemeProvider>
}