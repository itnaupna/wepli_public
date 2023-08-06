import React from 'react';
import mainback from "./3di.jpg";
import "./hyukmain.css";
import headphone from "./headphones.jpg";
import mic from "./mic.jpg";
function Hyukmain(props) {

    const divStyle = {
        backgroundImage: `url(${mic})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
    };

    const maintext = {
        display: 'inline-block',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '200px',
        width: '100vw',
        textAlign: 'center',
        color: 'white',
    };

    const maintextbox = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        fontSize:'300px',
    };

    const mainsubbox = {
        color: 'white',
        fontSize: '25px',
        marginTop: '20px',
    };

    return (
        <div style={divStyle}>
            <div style={maintextbox}>
                <div style={maintext} className={'aaaa'}>WEPLI</div>
                <div style={mainsubbox} className={'bbbb'}>피할 수 없으면, 즐겨라</div>
            </div>
        </div>
    );
}

export default Hyukmain;
