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

export function highlightPlayerMouseEnterHandler( event: React.MouseEvent<HTMLLIElement>){
    toggleClassesForPlayer( event.currentTarget, true, toggleStyles );
}

export function highlightPlayerMouseLeaveHandler( event: React.MouseEvent<HTMLLIElement>){
    toggleClassesForPlayer( event.currentTarget, false, toggleStyles);
}