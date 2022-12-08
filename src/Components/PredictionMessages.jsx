export default function PredictionMessage(props) {

    return (
        <div id = 'prediction-messages-container'>
            {/* <h3>{props.predictionMessage[0]}</h3> */}
            <h5>{props.predictionMessage[1]}</h5>
            {/* <h3>{props.predictionMessage[2]}</h3> */}
            <h5>{props.predictionSuccessMessage[1]}</h5>
        </div>
    )

}