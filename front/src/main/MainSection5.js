import React, { useEffect, useRef } from 'react';
import './css/MainSection5.css';
import hh from "./photo/wepli1-min.jpg";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function MainSection5(props) {
    const textRefs = useRef([]);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const texts = textRefs.current;

        texts.forEach((text, index) => {
            gsap.fromTo(
                text,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: text,
                        start: 'top 80%', // Adjust the start position as needed
                        end: 'top 50%',
                        scrub: 1,
                    },
                }
            );
        });
    }, []);

    return (
        <div className={'mainsection5'}>
            <div className={'mainsectioncard'}>
                <p className={'text1-1 overlap-text'} ref={(el) => (textRefs.current[0] = el)}>
                    음악 공유와 소통의 새로운 방식
                </p>
                <p className={'text2-1 overlap-text'} ref={(el) => (textRefs.current[1] = el)}>
                    유튜브 API를 활용한 플레이리스트 생성과 공유
                </p>
                <p className={'text3-1 overlap-text'} ref={(el) => (textRefs.current[2] = el)}>
                    음악 스테이지에서 함께 즐기는 시간
                </p>

            </div>
        </div>
    );
}

export default MainSection5;
