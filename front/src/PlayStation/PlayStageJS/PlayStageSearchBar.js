import  Axios  from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import '../../PlayListMain/PlayListMain02PlayListSearchMain.css';
import { useRecoilState } from 'recoil';
import { QueryStringAtom, SearchStageAtom } from '../../recoil/StageSearchAtom';

function PlayStageSearchBar({listHandler}) {
    const [type, setType] = useState(0);
    const [curr, setCurr] = useState(1);
    const [cpp, setCpp] = useState(9);
    const [orderByDay ,setOrderByDay] = useState(true);
    const [toggleOption, setToggleOption] = useState(["제목","닉네임","장르","태그"]);
    const [queryString, setQueryString] = useRecoilState(QueryStringAtom);

    const searchOnChange = useCallback(e =>{
        setQueryString(e.target.value);
    });

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const SearchEnter = (e) =>{
        if (e.key === 'Enter') {
            listHandler(type, orderByDay);
            document.activeElement.blur();
        }
    };

    const SelectSearchOption = (e) =>{
        setType(e.target.getAttribute("value"));
        console.log();

    }


    return (
        <div className="searchtypebox-parent">
            <div className="searchtypebox">
                <div className="playlistmainsearchbody" />
                    <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 11 11" 
                    fill="none" xmlns="http://www.w3.org/2000/svg"
                    className="playlistmainsearchtoggle-icon"
                    >
                <path id="Intersect" d="M1.50972 2.35292C2.44299 4.70758 4.44138 9.36599 5.6433 9.36291C6.84522 9.35984 8.8249 4.69125 9.74872 2.33184C10.0015 1.68631 9.52123 1.00203 8.82811 1.00381L2.42499 1.02019C1.73187 1.02197 1.25438 1.70869 1.50972 2.35292Z" fill="#D7E0FF" stroke="#4147D5" strokeWidth="1.5"/>
                </svg>
                <div className="slpsort-playlistmainsearchoption" onClick={toggleDropdown}>{
                    toggleOption[type]}
                    {isOpen && (
                        <div  className="slpsort-playlistmainsearchDropDownBody">
                            <svg 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="slpsort-playlistmainsearchtoggleUP-icon">
                            </svg>
                            <option className="slpsort-playlistmainsearchDropDown" onClick={SelectSearchOption} value={0}>제목</option>
                            <option className="slpsort-playlistmainsearchDropDown" onClick={SelectSearchOption} value={1}>닉네임</option>
                            <option className="slpsort-playlistmainsearchDropDown" onClick={SelectSearchOption} value={2}>장르</option>
                            <option className="slpsort-playlistmainsearchDropDown" onClick={SelectSearchOption} value={3}>태그</option>
                        </div>
                    )}
                </div>
            </div>
            <div className="slpsort-playlistsearchbar">
                <input className="slpsort-playlsitsearchbarbody" onKeyDown={SearchEnter} value={queryString} type="text" placeholder="검색할 내용을 입력해 주세요"  onChange={searchOnChange}/>
                <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24"  
                    className="slpsort-playlsitsearchicons" 
                    onClick={() => listHandler()} fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="PlayLsitSearchIcons">
                    <path id="PlayLsitSearchIcon" d="M20.2062 17.5H19.2071L18.853 17.1625C20.0924 15.7375 20.8385 13.8875 20.8385 11.875C20.8385 7.3875 17.1585 3.75 12.6185 3.75C8.07848 3.75 4.39844 7.3875 4.39844 11.875C4.39844 16.3625 8.07848 20 12.6185 20C14.6545 20 16.5261 19.2625 17.9678 18.0375L18.3093 18.3875V19.375L24.6324 25.6125L26.5166 23.75L20.2062 17.5ZM12.6185 17.5C9.46956 17.5 6.92768 14.9875 6.92768 11.875C6.92768 8.7625 9.46956 6.25 12.6185 6.25C15.7674 6.25 18.3093 8.7625 18.3093 11.875C18.3093 14.9875 15.7674 17.5 12.6185 17.5Z" fill="#191D21"/>
                    </g>
                </svg>
            </div>
        </div>
    );
}

export default PlayStageSearchBar;