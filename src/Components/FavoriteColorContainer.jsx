import FavoriteColorBoxes from '.FavoriteColorBoxes'

export default function FavoriteColorContainer(props) {

    const favoriteColorBoxStyles = props.favoriteStylesDisplayActive ? {display: 'inherit'} : {display: 'none'}
    
    return(
        <div id = "favorite-colors-container" style = {favoriteColorBoxStyles}>
            <h3 style = {props.favoriteH3Styles}>Your Favorite Colors</h3>
            <h5 style = {props.favoriteH5Styles}>You may click on any color box below to open a new tab with information about the given color.</h5>
            <FavoriteColorBoxes favoritesStyles = {props.favoritesStyles} />
            <h3 style = {props.leastFavoriteH3Styles}>Your Least Favorite Colors</h3> 
            <FavoriteColorBoxes favoritesStyles = {props.leastFavoritesStyles} />
        </div>      
    )
}

