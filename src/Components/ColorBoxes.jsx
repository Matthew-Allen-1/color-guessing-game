export default function ColorBoxes(props) {
    const colorBoxElements = []
    for (let i = 0; i < 2; i++) {
        colorBoxElements.push(
            <div key = {i} className = "color-box-container" id = {props.idArray1[i]}>
                <div className = "color-box" id = {props.idArray2[i]} style = {props.styles[i]} onClick = {() => props.handleChoice(i)}></div>
                <h4>Box {i + 1} Stats</h4>
                {/* <p>Euclidean difference: {props.avgDistance[i].con - props.avgDistance[i].pro}</p> */}
                <h5>Likeability Score: {props.likeabilityScore[i]}</h5>
                {/* <p>Local Euclidean Difference: {props.avgLocalDistance[i].con - props.avgLocalDistance[i].pro}</p>  */}
            </div>
        )
    }
    return (colorBoxElements)
}