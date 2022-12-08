export default function ColorSectionHeader (props) {
    return(
        <div id = 'color-section-header' style = {props.colorSectionHeaderStyles}>
            <h2 style = {props.h2Styles}>Please click on the color that you prefer.</h2>
            <p>The Euclidean distance between these two colors is: {Math.round(props.euclideanDistance)}</p>
        </div>
    )
}