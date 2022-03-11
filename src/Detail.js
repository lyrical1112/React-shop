/* eslint-disable */ 

import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { CSSTransition } from "react-transition-group";
import styled from 'styled-components';
import './Detail.scss';
import {재고context} from './App';
import {connect} from 'react-redux';


let 박스 = styled.div`
    padding : 20px;
`;

let 제목 = styled.h4`
    font-size: 25px;
    color: ${ props => props.색상 }
`;


function Detail(props) {

    let [ alert, alert변경 ] = useState(true);
    let [inputData, inputData변경 ] = useState('');
    let [누른탭,누른탭변경] = useState(0);
    let [스위치, 스위치변경] = useState(false);
    let 재고 = useContext(재고context);

    useEffect(()=>{
        let 타이머 = setTimeout(()=>{ alert변경(false) },2000);
        return () => {clearTimeout (타이머) } // 디테일 컴포넌트가 사라질때 타이머 제거
    },[]); // 스테이트가 변경될때만 실행하게하는 조건

    let history = useHistory();
    let { id } = useParams();
    let 찾은상품 = props.shoes.find(function (상품){
        return 상품.id == id
    });


    useEffect( ()=> {
        var arr = localStorage.getItem('watched');
        if( arr == null ) { arr = [] } else { arr = JSON.parse(arr) }

        arr.push(id);
        arr = new Set(arr);
        arr = [...arr];

        localStorage.setItem('watched', JSON.stringify(arr) );

    },[] );



    return (
        <div className="container">
            <박스>
                <제목 색상={'#ff0033'} >Detail</제목>
            </박스>

            {inputData}
            <input onChange={(e)=> {inputData변경(e.target.value) } } />

            {
                alert === true
                ?(<div className='my-alert'>
                    <p>재고가 얼마 남지 않았습니다</p>
                </div>)
                :null
            }

            <div className="row">
                <div className="col-md-6">
                    <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="100%" />
                </div>

                <div className="col-md-6 mt-4">
                    <h4 className="pt-5">{찾은상품.title}</h4>
                    <p>{찾은상품.content}</p>
                    <p>{찾은상품.price}원</p>
                    
                    <Info 재고={props.재고}></Info>

                    <button className="btn btn-danger" onClick={ ()=> { 
                        let newCount = [...props.재고];
                        newCount[0] = newCount[0] - 1;
                        props.재고변경(newCount);
                        props.dispatch( {type: '항목추가', payload: {id:찾은상품.id, name: 찾은상품.title, quan: 1 }} );
                        history.push('/cart');
                    } }>주문하기</button>
                    <button className="btn btn-danger" onClick={ ()=> {
                        history.goBack();
                    } }>뒤로가기</button> 
                </div>
            </div>

            <Nav className="mt-5" variant="tabs" defaultActiveKey="link-0">
                <Nav.Item>
                    <Nav.Link eventKey="link-0" onClick={ ()=>{ 스위치변경(false); 누른탭변경(0) } } >상품설명</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1" onClick={ ()=>{ 스위치변경(false); 누른탭변경(1) } }>배송정보</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2" onClick={ ()=>{ 스위치변경(false); 누른탭변경(2) } }>Option 3</Nav.Link>
                </Nav.Item>
            </Nav>

            <CSSTransition in={스위치} classNames="wow" timeout={500}>
                <TabContent 누른탭={누른탭} 스위치변경={스위치변경}></TabContent>
            </CSSTransition>
        </div>
    )
}

function TabContent(props) {

    useEffect( () => {
        props.스위치변경(true);
    });

    if (props.누른탭 === 0) {
        return <div>0</div>
    } else if (props.누른탭 === 1){
        return <div>1</div>
    } else if (props.누른탭 === 2){
        return <div>2</div>
    }
}


function Info(props) {
    return(
        <p>재고: {props.재고[0]}</p>
    )
}

function state를props화(state) {
    return {
        state: state.reducer,
        alert열렸니: state.reducer2
    }
}


export default connect(state를props화)(Detail)