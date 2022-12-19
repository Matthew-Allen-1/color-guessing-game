export default function SusColorsButton (props) {

    const susDisplayStyles = props.susDisplayActive ? {display: 'inherit', width: '384px'} : {display: 'none', width: '384px'}

    return (
        <div className = 'sus-colors-button-container'>
            <button className = "sus-colors-button" style = {props.buttonStyles} onClick = {() => props.displaySusChoices(props.fav)}>
                Click Here to {props.susDisplayActive ? 'Hide' : 'See'} Your Most Sus {props.fav == true ? 'Preferred' : 'Not Preferred'} Choices
            </button>
            <ul style = {susDisplayStyles}>
                <li>These are colors you {props.fav ? 'chose' : 'did not choose'} but which you may {props.fav ? 'not actually' : 'actually'} like.</li>
                <li>Click on any colors you would like to delete from your list of {props.fav ? "PREFERRED" : "NOT PREFERRED"} choices.</li>
                <li>Removing colors from this list will affect my future predictions.</li>
                <li>You should only delete colors from this list if you strongly {props.fav ? 'like' : 'dislike'} them.</li>
            </ul>
        </div>
    )
}