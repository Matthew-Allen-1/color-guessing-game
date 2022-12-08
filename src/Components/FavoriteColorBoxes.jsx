export default function FavoriteColorBoxes(props) {

    const favoriteColorBoxElements = []
    const baseUrl = "https://encycolorpedia.com/"
    let colorUrl = ''

    for (let i = 0; i < 8; i++) {
        if (props.favoritesStyles[i]) {
            colorUrl = props.favoritesStyles[i].backgroundColor.replace('#', '')
        }
        favoriteColorBoxElements.push(
            <a key = {i} href = {baseUrl + colorUrl} target = '_blank'>
                <span className = 'favorite-color-box' style = {props.favoritesStyles[i]}>#{i + 1}</span>
            </a>
        )
    }
    return (
        <div id = 'favorite-color-boxes-container'>
            {favoriteColorBoxElements}
        </div>
    )
}