import React, {useEffect, useRef, useState} from 'react';
import "./css/MainSection1.css";
import logo from "./photo/wplieonlylogo.png";
import { gsap } from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import iphone14 from "./photo/iPhone 14.png";

function MainSection1(props) {


    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const imgRef = useRef(null);
    useEffect(() => {

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    // css
    useEffect(() => {
        const textElements = document.querySelectorAll(".text");
        let delay = 0.3;

        textElements.forEach((element, index) => {
            element.style.animation = `fadeIn 2s ease ${delay * (index + 3)}s forwards`;
        });

    }, []);

    useEffect(() => {
        gsap.fromTo(
            imgRef.current,
            { opacity: 0, y: -100 },
            { opacity: 1, y: 0, duration: 1, delay:  0.7 }
        );
    }, []);

    const iphonemgRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.registerPlugin(ScrollToPlugin);

        // Initial animations
        gsap.fromTo(
            imgRef.current,
            { opacity: 0, y: -50 },
            { opacity: 1, y: 0, duration: 1, delay: 2.1 }
        );

        // Create GSAP animation for iPhone image
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: iphonemgRef.current,
                start: 'top 70%',
                end: 'top 40%',
                scrub: 1,
            },
        });


        tl.fromTo(
            iphonemgRef.current,
            { opacity: 1, x: -100},
            { opacity: 1, x: 0, duration: 1, ease: 'power1.in' }
        );
    }, []);

    const handleMouseMove = (e) => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    return (

        <div className='mainsection1'>
            <div className="cursorItem" style={{ top: cursorPosition.y, left: cursorPosition.x }}>
                <span className="circle"></span>
            </div>
            <div className={'mainsection2iphonemokup'} >
                <img src={iphone14} className={'iphone13mokup'} ref={iphonemgRef}/>
            </div>
            <div className={'mainsection1textgroup'}>
                <div className={'mainsection1text'}>WEPLI</div>
            </div>
            <div id={'mainsection1subtextgroup'} className={'fade-in'}>
                <div className={'text mainsection1subtext1'}>나만의 플레이리스트를 생성하고 공유하세요.</div>
                <div className={'text mainsection1subtext2'}>사람들과 같이 음악을 듣고, 소통하세요.</div>
            </div>
            <div className={'mainsectionimg2group'}>
                <img src={logo}  ref={imgRef} alt={'mainimg2'} className={"mainsectionimg2"}/>
            </div>
        </div>
    );
}

export default MainSection1;