export default function FavoriteColorButtons (props) {

    const favoriteColorButtonElements = []

    props.precisionLevels.forEach((item, index) => {
        favoriteColorButtonElements.push(
            <div key = {index} >
                <button className = "favorite-color-button" style = {props.buttonStyles} onClick = {() => {
                    props.chooseFavoriteColors(props.precisionLevels[index], props.divNum)
                    props.displayFavoriteColors()
                }}>
                    <span className = 'button-span'>Click Here To See Your Favorite Colors</span> 
                    <span className = 'button-span'>Precision Level: {item == 64 ? 'Low' : 'High'}</span>
                </button>
            </div>
        )}
    )
    
    return(
        <div id = 'favorite-color-buttons'>
            {favoriteColorButtonElements}
        </div>
    )
}