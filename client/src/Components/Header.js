import React, {useEffect, useState} from "react"

export const Header = (props) => {
    let [status, setStatus] = useState(false)

    useEffect(() => {
        if(props.status.length !== 0) {
            setStatus(true)
        }
        // console.log(props)
    }, [props])
//
    const logout = () => {
        // setLoggedIn(false)
        sessionStorage.removeItem('credential');
        window.location.reload();
    }

    return(<>
        <header className="header">
            <div className="site-identity">
                {/* <h1><a href="">Tasks App</a></h1> */}
                <h1>Tasks App</h1>
            </div>
            <nav className="site-navigation">
                <ul className="nav">
                    {/* <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">Contact</a></li> */}
                    {status ? <li><a href="" onClick={logout}>Logout</a></li>: <></>}
                </ul>
            </nav>
        </header>
    </>)
}