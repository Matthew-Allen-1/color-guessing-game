export default function PredictionMessage(props) {

    return (
        <div id = 'prediction-messages-container'>
            <div id = 'prediction-messages'>
                {/* <h3>{props.predictionMessage[0]}</h3> */}
                <p>{props.predictionMessage[1]}</p>
                {/* <h3>{props.predictionMessage[2]}</h3> */}
                <p>{props.predictionSuccessMessage[1]}</p>
                
            </div>
        </div>
    )

}