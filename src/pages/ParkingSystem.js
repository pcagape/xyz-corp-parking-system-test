import React, { useState, useEffect } from 'react';
import './ParkingSystem.css';

// Components
import LotInfo from '../components/LotInfo';

const _SMALL_PARKLOT = 'SP';
const _MEDIUM_PARKLOT = 'MP';
const _LARGE_PARKLOT = 'LP';
const _PARKLOT_HEIGHT = 60; // Must be same in css .parklot
const _PARKLOT_WIDTH = 20; // Must be same in css .parklot

const _AREA_A_CENTER_POS = { x: 0.5, y: 0.528 };
const _AREA_A_COUNT = 50;
const _AREA_A_TYPE = 'VERTICAL';
const _AREA_B_CENTER_POS = { x: 0.5, y: 0.461 };
const _AREA_B_COUNT = 50;
const _AREA_B_TYPE = 'VERTICAL';
const _AREA_C_CENTER_POS = { x: 0.483, y: 0.775 };
const _AREA_C_COUNT = 63;
const _AREA_C_TYPE = 'VERTICAL';
const _AREA_D_CENTER_POS = { x: 0.545, y: 0.224 };
const _AREA_D_COUNT = 57;
const _AREA_D_TYPE = 'VERTICAL';
const _AREA_E_CENTER_POS = { x: 0.8585, y: 0.577 };
const _AREA_E_COUNT = 14;
const _AREA_E_TYPE = 'HORIZONTAL';
const _AREA_F_CENTER_POS = { x: 0.1415, y: 0.377 };
const _AREA_F_COUNT = 17;
const _AREA_F_TYPE = 'HORIZONTAL';

function ParkingSystem ({ currTime, waitingCar, setSelectedGate }) {
    const [carRecords, setCarRecords] = useState({});
    const [parkingLots, setParkingLots] = useState([]);
    const [_hIdx] = useState(-1);
    const [_GATE_A_ORDER, setGAO] = useState([]);
    const [_GATE_B_ORDER, setGBO] = useState([]);
    const [_GATE_C_ORDER, setGCO] = useState([]);
    const [selectedparkLot, setSelectedparkLot] = useState({});

    function parkOutCar(parkLot, isCancel) {
        // park out car
        let tempParkingLots = parkingLots.slice();
        tempParkingLots[parkLot.idx].carPlateNum = null;
        tempParkingLots[parkLot.idx].parkEnd = new Date(currTime);
        carRecords[parkLot.car.carPlateNum].lastParkEnd = (isCancel ? null : new Date(tempParkingLots[parkLot.idx].parkEnd));
        carRecords[parkLot.car.carPlateNum].parkLot = null;
        setSelectedparkLot({});
        setCarRecords(carRecords);
    }

    function parkNewCar(waitingCar) {
        let orderSearchBySize = ['SP', 'MP', 'LP'];
        switch(waitingCar.carSize) {
            case 'S': orderSearchBySize = ['SP', 'MP', 'LP']; break;
            case 'M': orderSearchBySize = ['MP', 'LP']; break;
            case 'L': default: orderSearchBySize = ['LP']; break;
        }
        let orderSearchByLot = [];
        switch(waitingCar.gate) {
            case 'B': orderSearchByLot = _GATE_B_ORDER.slice(); break;
            case 'C': orderSearchByLot = _GATE_C_ORDER.slice(); break;
            case 'A': default: orderSearchByLot = _GATE_A_ORDER.slice(); break;
        }

        while(orderSearchBySize.length > 0) {
            let searchBySize = orderSearchBySize.shift();
            let tempOrderSearchByLot = orderSearchByLot.slice();
            while(tempOrderSearchByLot.length > 0) {
                let searchLotIdx = tempOrderSearchByLot.shift();

                // if parking lot is free, park here
                if(parkingLots[searchLotIdx] && parkingLots[searchLotIdx].type === searchBySize && !parkingLots[searchLotIdx].carPlateNum) {
                    parkingLots[searchLotIdx].carPlateNum = waitingCar.carPlateNum; // assign car
                    parkingLots[searchLotIdx].parkStart = new Date(currTime); // parkStartTime;
                    parkingLots[searchLotIdx].parkEnd = null; // didnt yet leave
                    waitingCar.parkLot = searchLotIdx; // waitingCar park
                    waitingCar.lastParkStart = parkingLots[searchLotIdx].parkStart; // update on start;
                    
                    return waitingCar; // successfully park
                }
            }
        }

        return false; // no space to park
    }

    function trySelectParkLot(parkLot) {
        if(!parkLot.carPlateNum) return;

        parkLot.car = carRecords[parkLot.carPlateNum];
        setSelectedparkLot(parkLot);
    }

    // update on waitingCar change / Trigger add new car
    useEffect(() => {
        if(!waitingCar.carPlateNum || waitingCar.carPlateNum.length < 1) return;

        // Fetch stored car data
        if(carRecords[waitingCar.carPlateNum])
            waitingCar = carRecords[waitingCar.carPlateNum];

        // Look up car records if it's already park, if yes open parkLot info
        if(carRecords[waitingCar.carPlateNum] && carRecords[waitingCar.carPlateNum].parkLot)
            return trySelectParkLot(parkingLots[carRecords[waitingCar.carPlateNum].parkLot]);
        
        // Try park car
        let carParked = parkNewCar(waitingCar);
        if(carParked) { // if has successfully park, save car to record
            carRecords[waitingCar.carPlateNum] = carParked
            setCarRecords(carRecords);
        }
    }, [waitingCar]);

    useEffect(() => {
        var i = 0;
        
        // _LARGE_PARKLOT counts
        var _parkingLots = [];
        const SP_COUNT = 100;
        for(i=0; i<SP_COUNT; i++)
        _parkingLots.push({
                idx: _parkingLots.length,
                lotNum: _parkingLots.length+1,
                type: _LARGE_PARKLOT,
                pos: null,
                carPlateNum: null,
                start: null,
                end: null
            });
        // _MEDIUM_PARKLOT counts
        const MP_COUNT = 120;
        for(i=0; i<MP_COUNT; i++)
            _parkingLots.push({
                idx: _parkingLots.length,
                lotNum: _parkingLots.length+1,
                type: _MEDIUM_PARKLOT,
                pos: null,
                carPlateNum: null,
                start: null,
                end: null
            });
        // _SMALL_PARKLOT counts
        const LP_COUNT = 31;
        for(i=0; i<LP_COUNT; i++)
            _parkingLots.push({
                idx: _parkingLots.length,
                lotNum: _parkingLots.length+1,
                type: _SMALL_PARKLOT,
                pos: null,
                carPlateNum: null,
                start: null,
                end: null
            });    

        // all indexs
        let _indexs = [];
        for(i=0; i<_parkingLots.length; i++)
            _indexs.push(i);

        // assign parklot per AREA
        var idx = null;
        var realHeight = document.body.clientHeight;
        var realWidth = document.body.clientWidth;
        var totalWidth = _AREA_A_COUNT * _PARKLOT_WIDTH;
        let _AREA_A_LOTS = [];
        for(i=0; i<_AREA_A_COUNT; i++) {
            idx = _indexs.shift();
            _parkingLots[idx].pos = {
                x: realWidth*_AREA_A_CENTER_POS.x - totalWidth/2 + i*_PARKLOT_WIDTH,
                y: realHeight*_AREA_A_CENTER_POS.y - _PARKLOT_HEIGHT/2
            }
            _parkingLots[idx].areaType = _AREA_A_TYPE;
            _AREA_A_LOTS.push(idx);
        }
        totalWidth = _AREA_B_COUNT * _PARKLOT_WIDTH;
        let _AREA_B_LOTS = [];
        for(i=0; i<_AREA_B_COUNT; i++) {
            idx = _indexs.shift();
            _parkingLots[idx].pos = {
                x: realWidth*_AREA_B_CENTER_POS.x + totalWidth/2 - (i+1)*_PARKLOT_WIDTH,
                y: realHeight*_AREA_B_CENTER_POS.y - _PARKLOT_HEIGHT/2
            }
            _parkingLots[idx].areaType = _AREA_B_TYPE;
            _AREA_B_LOTS.push(idx);
        }
        totalWidth = _AREA_C_COUNT * _PARKLOT_WIDTH;
        let _AREA_C_LOTS = [];
        for(i=0; i<_AREA_C_COUNT; i++) {
            idx = _indexs.shift();
            _parkingLots[idx].pos = {
                x: realWidth*_AREA_C_CENTER_POS.x - totalWidth/2 + i*_PARKLOT_WIDTH,
                y: realHeight*_AREA_C_CENTER_POS.y - _PARKLOT_HEIGHT/2
            }
            _parkingLots[idx].areaType = _AREA_C_TYPE;
            _AREA_C_LOTS.push(idx);
        }
        totalWidth = _AREA_D_COUNT * _PARKLOT_WIDTH;
        let _AREA_D_LOTS = [];
        for(i=0; i<_AREA_D_COUNT; i++) {
            idx = _indexs.shift();
            _parkingLots[idx].pos = {
                x: realWidth*_AREA_D_CENTER_POS.x + totalWidth/2 - (i+1)*_PARKLOT_WIDTH,
                y: realHeight*_AREA_D_CENTER_POS.y - _PARKLOT_HEIGHT/2
            }
            _parkingLots[idx].areaType = _AREA_D_TYPE;
            _AREA_D_LOTS.push(idx);
        }
        var totalHeight = _AREA_E_COUNT * _PARKLOT_WIDTH;
        let _AREA_E_LOTS = [];
        for(i=0; i<_AREA_E_COUNT; i++) {
            idx = _indexs.shift();
            _parkingLots[idx].pos = {
                x: realWidth*_AREA_E_CENTER_POS.x,
                y: realHeight*_AREA_E_CENTER_POS.y - _PARKLOT_WIDTH/2 + totalHeight/2 - i*_PARKLOT_WIDTH
            }
            _parkingLots[idx].areaType = _AREA_E_TYPE;
            _AREA_E_LOTS.push(idx);
        }
        totalHeight = _AREA_F_COUNT * _PARKLOT_WIDTH;
        let _AREA_F_LOTS = [];
        for(i=0; i<_AREA_F_COUNT; i++) {
            idx = _indexs.shift();
            _parkingLots[idx].pos = {
                x: realWidth*_AREA_F_CENTER_POS.x - _PARKLOT_HEIGHT,
                y: realHeight*_AREA_F_CENTER_POS.y - totalHeight/2 + i*_PARKLOT_WIDTH
            }
            _parkingLots[idx].areaType = _AREA_F_TYPE;
            _AREA_F_LOTS.push(idx);
        }

        setGAO([..._AREA_A_LOTS, ..._AREA_B_LOTS, ..._AREA_C_LOTS, ..._AREA_E_LOTS, ..._AREA_D_LOTS, ..._AREA_F_LOTS]);
        setGBO([..._AREA_A_LOTS, ..._AREA_B_LOTS, ..._AREA_F_LOTS, ..._AREA_C_LOTS, ..._AREA_E_LOTS, ..._AREA_D_LOTS]);
        setGCO([..._AREA_B_LOTS, ..._AREA_A_LOTS, ..._AREA_D_LOTS, ..._AREA_F_LOTS, ..._AREA_C_LOTS, ..._AREA_E_LOTS]);

        // Default parking lot to State
        setParkingLots(_parkingLots);
    }, []);

  return (
    <div className='parksystem-container'>
      <div className='parking-layout'>
          {parkingLots.length}{parkingLots.map((lot, index) => {
              return (
                <div onClick={trySelectParkLot.bind(this, lot)} key={lot.lotNum} style={{left: lot?.pos?.x+'px', top: lot?.pos?.y+'px'}} className={'parklot ' + lot.areaType + (index == _hIdx || lot.carPlateNum ? ' OCCUPIED' : '')}>
                  <label>{lot.lotNum}</label>
                  <label>{lot.type}</label>
                </div>
              );
          })}

          <div className='parklot-gate gate-a' onClick={()=>setSelectedGate('A')}><h4>GATE A</h4></div>
          <div className='parklot-gate gate-b' onClick={()=>setSelectedGate('B')}><h4>GATE B</h4></div>
          <div className='parklot-gate gate-c' onClick={()=>setSelectedGate('C')}><h4>GATE C</h4></div>

            <h1 className='arrow arrow1'>&#8592;</h1>
            <h1 className='arrow arrow2'>&#8592;</h1>
            <h1 className='arrow arrow3'>&#8594;</h1>
            <h1 className='arrow arrow4'>&#8594;</h1>
            <h1 className='arrow arrow5'>&#8595;</h1>
            <h1 className='arrow arrow6'>&#8593;</h1>

            <h1 className='arrow arrow7'>&#8593;</h1>
            <h1 className='arrow arrow8'>&#8595;</h1>

            <h1 className='arrow arrow9'>&#8594;</h1>
            <h1 className='arrow arrow10'>&#8592;</h1>

            <h1 className='arrow arrow11'>&#8594;</h1>
            <h1 className='arrow arrow12'>&#8592;</h1>
          
      </div>
      <LotInfo isShow={selectedparkLot && selectedparkLot.carPlateNum ? true : false} currTime={currTime} selectedparkLot={selectedparkLot} setSelectedparkLot={setSelectedparkLot} parkOutCar={parkOutCar}/>
    </div>
    
  );
}

export default ParkingSystem