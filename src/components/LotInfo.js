import React, { useState, useRef, useEffect } from 'react';
import './LotInfo.css';

const _FIRSTHOURS = 3;
const _FIRSTHOURS_HOURLY_RATE = 40;
const _HOURLY_RATE_SP = 20;
const _HOURLY_RATE_MP = 60;
const _HOURLY_RATE_LP = 100;
const _24HRS_PENALTY = 5000;

function LotInfo({ isShow, currTime, selectedparkLot, setSelectedparkLot, parkOutCar }) {

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

    function getLotSize() {
        if(!selectedparkLot || !selectedparkLot.parkStart) return '';

        switch(selectedparkLot.type) {
            case 'SP': return 'Small';
            case 'MP': return 'Medium';
            case 'LP': return 'Large';
        }
    }

    function getCarSize() {
        if(!selectedparkLot || !selectedparkLot.parkStart) return '';

        switch(selectedparkLot.car.carSize) {
            case 'S': return 'Small';
            case 'M': return 'Medium';
            case 'L': return 'Large';
        }
    }

    function calculateHoursPark() {
        if(!selectedparkLot || !selectedparkLot.parkStart) return '-';

        let selectedDate = currTime;
        let hourDiff = selectedDate.getTime() - selectedparkLot.parkStart.getTime();
        hourDiff = hourDiff / 1000; // Seconds
        hourDiff = hourDiff / 60; // Minutes
        hourDiff = hourDiff / 60; // Hours
        hourDiff = Math.round(hourDiff);

        return hourDiff + (hourDiff > 1 ? ' hrs' : 'hr');
    }

    function calculateHourlyRate(selectedDate) {
        if(!selectedparkLot || !selectedparkLot.parkStart) return 0;

        selectedDate = selectedDate ?? currTime;
        let hourDiff = selectedDate.getTime() - selectedparkLot.parkStart.getTime();
        hourDiff = hourDiff / 1000; // Seconds
        hourDiff = hourDiff / 60; // Minutes
        hourDiff = hourDiff / 60; // Hours
        hourDiff = Math.round(hourDiff);

        var hourlyRate = _FIRSTHOURS_HOURLY_RATE;
        switch(selectedparkLot.type) {
            case 'SP': hourlyRate = _HOURLY_RATE_SP; break;
            case 'MP': hourlyRate = _HOURLY_RATE_MP; break;
            case 'LP': default: hourlyRate = _HOURLY_RATE_LP; break;
        }

        let lastParkDiff = 1;
        if(selectedparkLot.car.lastParkEnd) {
            lastParkDiff = selectedparkLot.parkStart.getTime() - selectedparkLot.car.lastParkEnd.getTime();
            lastParkDiff = lastParkDiff / 1000; // Seconds
            lastParkDiff = lastParkDiff / 60; // Minutes
            lastParkDiff = lastParkDiff / 60; // Hours
        }

        if(hourDiff < _FIRSTHOURS && lastParkDiff >= 1)
            return _FIRSTHOURS_HOURLY_RATE;
        else return hourlyRate;
    }

    function calculateTotalFee() {
        if(!selectedparkLot || !selectedparkLot.parkStart) return 0;

        let selectedDate = currTime;
        let hourDiff = selectedDate.getTime() - selectedparkLot.parkStart.getTime();
        hourDiff = hourDiff / 1000; // Seconds
        hourDiff = hourDiff / 60; // Minutes
        hourDiff = hourDiff / 60; // Hours
        hourDiff = Math.round(hourDiff);

        let lastParkDiff = 1;
        if(selectedparkLot.car.lastParkEnd) {
            lastParkDiff = selectedparkLot.parkStart.getTime() - selectedparkLot.car.lastParkEnd.getTime();
            lastParkDiff = lastParkDiff / 1000; // Seconds
            lastParkDiff = lastParkDiff / 60; // Minutes
            lastParkDiff = lastParkDiff / 60; // Hours
        }

        // Below 24hrs
        if(hourDiff < 24 & lastParkDiff >= 1) {
            let hrs = hourDiff - _FIRSTHOURS;
            if(hourDiff < _FIRSTHOURS) return hourDiff*_FIRSTHOURS_HOURLY_RATE;
            else return (_FIRSTHOURS*_FIRSTHOURS_HOURLY_RATE) + hrs*calculateHourlyRate();
        
        // Above 24hrs
        } else {
            let penaltyFee = Math.floor(hourDiff/24) * _24HRS_PENALTY;
            return (hourDiff%24)*calculateHourlyRate() + penaltyFee;
        }
    }

    // update on timeSpeed change
    // useEffect(() => {
    //     setTimeSpeed(_1MINUTE);
    // }, [timeSpeed]);
    return (
        <div className={"lotinfo-modal" + (isShow ? '' : ' hide')}>
            <div className='lotinfo-modal-header'>
                <h4>Lot #{selectedparkLot.lotNum} ({getLotSize()})</h4>
                <button className='btn-close-modal' onClick={()=>setSelectedparkLot({})}>Close</button>
            </div>
            <div className='lotinfo-modal-body'>
                <label>Plate Number: <dfn>{selectedparkLot?.carPlateNum}</dfn></label>
                <label>Car Size: <dfn>{getCarSize()}</dfn></label>
                <label>Park at: <dfn>{selectedparkLot && selectedparkLot.parkStart ? dateToTimeString(selectedparkLot?.parkStart) : ''}</dfn></label>
                <label>Hour/s Park: <dfn>{calculateHoursPark()}</dfn></label>
                <label>Hourly Rate: <dfn>Php{calculateHourlyRate()}</dfn></label>
                <label>Total Fee: <dfn>Php{calculateTotalFee().toLocaleString()}</dfn></label>
            </div>
            <button className='btn-pay-out' onClick={()=>parkOutCar(selectedparkLot)}>Pay-Out</button>
            {/* <button className='btn-cancel' onClick={()=>parkOutCar(selectedparkLot, true)}>Cancel</button> */}
        </div>
    )
}

export default LotInfo