import React, {useEffect, useRef} from 'react';
import "./css/MainWrapper2.css";
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import albumcover from "./svg/albumcover.svg";
function MainWrapper2(props) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrollToPlugin);

    const textRef = useRef(null);

    useEffect(() => {
        // Create GSAP animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.mainsection2toptext',
                start: 'top 60%',
                end: 'top 80%',
                scrub: 1
            },
        });

        tl.fromTo(
            textRef.current,
            {opacity: 0, x: -200},
            {opacity: 1, x: 0, duration: 1, ease: 'power3'}
        );
    }, []);
    return (
        <div className="mainwrapper2-8">
            <div className="mainwrapper2legtgroup">
                <div className="mainwrapper2leftinfotextgroup">
                    <div className="mainwrapper2leftinfoengtextgro">
                        <div className="mainwrapper2rightinfoengtext">MAKE</div>
                    </div>
                    <div className="mainwrapper2leftinfokoreantext">
                        <div className="mainwrapper2leftinfokoreantext1">
                            플레이리스트를 생성하세요.
                        </div>
                    </div>
                </div>
                <div className="mainwrapper2leftalbumgroup">
                    <div className="mainwrapper2leftbordergroup">
                        <div className="mainwrapper2leftborder" />
                    </div>
                    <div className="mainwrapper2leftgrouphashtag">
                        <div className="mainwrapper2lefthashtag">
                            <p className="p">#</p>
                            <p className="p">팝</p>
                            <p className="p">송</p>
                        </div>
                    </div>
                    <div className="mainwrapper2leftalbumsection">
                        <div className="mainwrapper2leftalbumcolorgrou">
                            <div className="mainwrapper2leftalbumcolorgrou">
                                <div className="mainwrapper2leftalbumcolorsect" />
                            </div>
                            <div className="mainwrapper2leftalbumcovertext">
                                <div className="mainwrapper2logotext">
                                    <div className="mainwrapper2logotext1">wepli;</div>
                                </div>
                                <div className="mainwrapper2leftplaylisttextgr">
                                    <div className="mainwrapper2leftplaylisttext">PLAYLIST</div>
                                </div>
                            </div>
                        </div>
                        <div className="mainwrapper2leftalbumimgsectio">
                            <img
                                className="mainwrapper2leftalbumimg-icon"
                                alt=""
                                src={albumcover}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mainwrapper2legtgroup">
                <div className="mainwrapper2rightinfotextgroup">
                    <div className="mainwrapper2rightinfoengtextgr">
                        <div className="mainwrapper2rightinfoengtext1">SHARE</div>
                    </div>
                    <div className="mainwrapper2rightinfokoreantex">
                        <div className="mainwrapper2rightinfoengtext1">
                            사람들과 공유하여 즐기세요.
                        </div>
                    </div>
                </div>
                <div className="mainwrapper2rightalbumgroup">
                    <div className="mainwrapper2rigthbordergroup">
                        <div className="mainwrapper2rigthborder" />
                    </div>
                    <div className="mainwrapper2rigthgrouphashtag">
                        <div className="mainwrapper2righthashtag">
                            <p className="p">#</p>
                            <p className="p">재</p>
                            <p className="p">즈</p>
                        </div>
                    </div>
                    <div className="mainwrapper2rigthalbumsection">
                        <div className="mainwrapper2rightalbumcolorgro">
                            <div className="mainwrapper2rightalbumcolorsec" />
                        </div>
                        <div className="mainwrapper2albumcovertextgrou">
                            <div className="mainwrapper2logotextgroup">
                                <div className="mainwrapper2logotext2">wepli;</div>
                            </div>
                            <div className="mainwrapper2playlisttextgroup">
                                <div className="mainwrapper2playlisttext">PLAYLIST</div>
                            </div>
                        </div>
                        <div className="mainwrapper2albumimgsection">
                            <img
                                className="mainwrapper2albumimg-icon"
                                alt=""
                                src={albumcover}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainWrapper2;