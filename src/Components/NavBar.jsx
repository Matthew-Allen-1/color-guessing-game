export default function NavBar (props) {
    return (
        <nav style = {props.navStyles}>
            <img id = "color-wheel-image" src = "https://upload.wikimedia.org/wikipedia/commons/d/dc/Eight-colour-wheel-2D.png" />
            <img id = "audio-image" src = {props.audioUrl} onClick = {() => props.handleAudioClick()}/>
            <div className = "nav-menu">
                <button className = "button nav-menu-button" data-bs-toggle = "collapse" data-bs-target = "#collapse-nav-menu" aria-expanded = "false" aria-controls = "menu">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30" focusable="false">
                        <title>Menu</title>
                        <path stroke="currentColor" strokeWidth="2" strokeLinecap = "round" strokeMiterlimit = "10" d = "M4 7h22M4 15h22M4 23h22"></path>
                    </svg>
                </button>
                <div className = "collapse" id = "collapse-nav-menu">
                    <ul>
                        <li><a href="#">Settings</a></li>
                        <li><a href="#">Stats</a></li>
                        <li><a href="#">Options</a></li>
                    </ul>
                </div>
            </div>
            <div className = "nav-title">
                <a href="http://www.myfavoritecolor.com"><h4 className = "nav-title-url">www.myfavoritecolor.com</h4></a>
            </div>
            <div className = "nav-buttons">
                <button className = "nav-button" id = "sign-up-button">Sign Up</button>
                <button className = "nav-button" id = "login-button">Login</button>
            </div>
        </nav>
    )
}