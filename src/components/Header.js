import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

const _1SECOND = 1000;
const _1MINUTE = 60000;
const _10MINUTE = 60000 * 10;
const _15MINUTE = 60000 * 15;
const _30MINUTE = 60000 * 30;

function Header({ currTime, setCurrTime, timeSpeed, setTimeSpeed, setWaitingCar, selectedGate, setSelectedGate}) {
    const [carPlateNum, setCarPlateNum] = useState('');
    const [selectedCarSize, setSelectedCarSize] = useState('S');
    const gateSelect = useRef(null);
    const carPlateNumInput = useRef(null);
    const carSizeSelect = useRef(null);

    function dateToTimeString(date) {
        var month = '';
        switch(date.getMonth()) {
            case 0: month = 'Jan'; break;
            case 1: month = 'Feb'; break;
            case 2: month = 'Mar'; break;
            case 3: month = 'Apr'; break;
            case 4: month = 'May'; break;
            case 5: month = 'June'; break;
            case 6: month = 'July'; break;
            case 7: month = 'Aug'; break;
            case 8: month = 'Sep'; break;
            case 9: month = 'Oct'; break;
            case 10: month = 'Nov'; break;
            case 11: default: month = 'Dec'; break;
        }
        var h = date.getHours(); // 0 - 23
        var m = date.getMinutes(); // 0 - 59
        var s = date.getSeconds(); // 0 - 59
        var session = "AM";
        
        if(h === 0)
            h = 12;
        
        if(h > 12){
            h = h - 12;
            session = "PM";
        }
        
        h = (h < 10) ? h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;
        
        return month + ' ' + date.getDate() + ", " + date.getFullYear() + ' ' + h + ":" + m + ":" + s + " " + session;
    }

    function parkCar() {
        if(carPlateNum.length < 1) return;

        carPlateNumInput.current.value = '';
        setCarPlateNum('');
        setWaitingCar({gate: selectedGate, carPlateNum, carSize: selectedCarSize});
    }

    function onPressInput(e) {
        if(e.which == 13)
            parkCar();
    }

    // Change selected Gate
    useEffect(() => {
        gateSelect.current.value = selectedGate;
    }, [selectedGate]);

    // update on time change
    let timeoutInterval = null;
    useEffect(() => {
        if(timeoutInterval) return;

        try{clearTimeout(timeoutInterval);}catch(e){}

        timeoutInterval = setTimeout(()=>{
            timeoutInterval = null;
            setCurrTime(new Date(currTime.getTime()+timeSpeed))
        } ,1000);
    }, [currTime]);
    return (
        <div className="header-container">
            <select ref={gateSelect} onChange={e => setSelectedGate(e.target.value)} className='header-select-gate' title="Gates">
                <option value="A">Gate A</option>
                <option value="B">Gate B</option>
                <option value="C">Gate C</option>
            </select>
            <input ref={carPlateNumInput} onKeyDown={onPressInput} onChange={e => {carPlateNumInput.current.value = e.target.value.toUpperCase(); setCarPlateNum(e.target.value.toUpperCase())}} className='header-input-platenum' placeholder='Plate Number'/>
            <select ref={carSizeSelect} onChange={e => setSelectedCarSize(e.target.value)} className='header-select-carsize' title="Car Size">
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
            </select>
            <button className='header-park-btn' onClick={parkCar} >Park</button>
            <label className='header-time-label'>Time Speed:</label>
            <button className={'header-time-btn btn1' + (timeSpeed == _1SECOND ? ' SELECTED' : '')} onClick={()=>{setTimeSpeed(_1SECOND)}} >x1</button>
            <button className={'header-time-btn btn2' + (timeSpeed == _15MINUTE ? ' SELECTED' : '')} onClick={()=>{setTimeSpeed(_15MINUTE)}} >x15</button>
            <button className={'header-time-btn btn3' + (timeSpeed == _30MINUTE ? ' SELECTED' : '')} onClick={()=>{setTimeSpeed(_30MINUTE)}} >x30</button>
            <h1 className='header-time'>{dateToTimeString(currTime)}</h1>
        </div>
    )
}

export default Header
