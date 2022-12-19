export default function SusColorBoxes(props) {

    const susColorBoxElements = []
    const susDisplayStyles = props.susDisplayActive ? {display: 'inherit'} : {display: 'none'}

    for (let i = 0; i < 8; i++) {
        susColorBoxElements.push(
        <div key = {i} className = "sus-color-box-container col-12 col-lg-6">
            <span className = 'sus-color-box' onClick = {() => props.eliminateSusColor(props.fav, i)} style = {props.susStyles[i]}>#{i + 1}</span>
        </div>
        )
    }
    return (
        <div className = 'sus-color-boxes-container row' style = {susDisplayStyles}>
            {susColorBoxElements}
        </div>
    )
}