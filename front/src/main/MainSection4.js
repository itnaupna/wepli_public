import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import "./css/MainSection4.css";
import heart from "./photo/bluetube.jpg";
import typho from "./photo/typho.png";

function MainSection4(props) {
    const bluetubeRef = useRef(null);
    const bluetubetextRef = useRef(null);
    const bluetube1Ref = useRef(null);
    const bluetubetext11Ref = useRef(null);
    const bluetubetext1InnerRef = useRef(null); // Ref for the inner text

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: bluetubeRef.current,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse',
            }
        });

        tl.fromTo(bluetubeRef.current, {
            opacity: 0,
            y: 100,
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
        }).fromTo(bluetubetextRef.current, {
            opacity: 0,
            y: 100,
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
        }).fromTo(bluetube1Ref.current, {
            opacity: 0,
            y: 100,
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
        }).fromTo([bluetubetext11Ref.current, bluetubetext1InnerRef.current], { // Animate both outer and inner text
            opacity: 0,
            y: 100,
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
        });

    }, []);

    return (
        <div className="mainsection4">
            <div className={'bluetubegroup'} ref={bluetubeRef}>
                <img src={heart} className={'bluetube'} />
            </div>
            <div className={'bluetubetextgroup'} ref={bluetubetextRef}>
                <div className={'bluetubetext'}>
                    <span style={{color:'white'}}>플레</span>이리스트
                </div>
                <div className={'bluetubetext1'}>
                    나만의 플리 생성
                    #장르 #분위기
                </div>
            </div>
            <div className={'mainsectiongroup2'}>
                <div className={'bluetubegroup1'} ref={bluetube1Ref}>
                    <img src={typho} className={'bluetube1'} />
                </div>
                <div className={'bluetubetext11'} ref={bluetubetext11Ref}>
                    스테<span style={{color:'white'}}>이지</span>
                </div>
                <div className={'bluetubetext1-1'} ref={bluetubetext1InnerRef}>
                    소통과 공유
                    <div className={'bluetubetext1-11'}>함께 즐기는 공간</div>
                </div>
            </div>
        </div>
    );
}

export default MainSection4;
