export default function SusColorsButton (props) {
    return (
        <div className = 'sus-colors-button-container'>
            <button className = "sus-colors-button" style = {props.buttonStyles} onClick = {() => props.displaySusChoices(props.fav)}>
                <span className = 'button-span'>Click Here to See Your Most Sus {props.fav == true ? 'Preferred' : 'Not Preferred'} Choices</span>
            </button>
            <ul>
                <li>These are the colors you {props.fav == true ? 'selected' : 'did not select'} as your favorite but which I suspect you may {props.fav == true ? 'not really' : 'actually'} like.</li>
                <li>You may click on any colors that you would like to delete from your list of {props.fav == true ? "PREFERRED" : "NOT PREFERRED"} choices.</li>
                <li>Keep in mind that removing any of these colors from your list will affect my predictions as well as your list of "favorite colors".</li>
                <li>I suggest you only delete colors from this list if you really {props.fav == true ? 'like' : 'dislike'} them.</li>
            </ul>
        </div>
    )
}