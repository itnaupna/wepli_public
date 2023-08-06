import React, { useEffect } from 'react';
import wepli1min from "./photo/wepli2-min.jpg";
import "./css/MainSection3.css";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function MainSection3(props) {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(".mstext p", {
            backgroundPositionX: '0%',
            stagger: 1,
            scrollTrigger: {
                trigger: ".mstext",
                scrub: 1,
                start: "top center",
                end: "bottom top",
            },
        });
    }, []);

    return (
        <div className="mainsection3">
            <div className={'msimggroup'}>
                <img className={'msimg'} src={wepli1min}/>
            </div>
            <div className="mscontainer">
                <div className="mstext">
                    <p className="text1">새로운 노래를 들을 수 있어요</p>
                    <p className="text2">플레이리스트 공유</p>
                    <p className="text3">장르, 분위기 선택</p>
                </div>
            </div>

        </div>
    );
}

export default MainSection3;
