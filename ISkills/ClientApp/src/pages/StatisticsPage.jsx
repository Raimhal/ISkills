import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {clearUsers, getCurrentUser, getUsers, setParams} from "../store/UserReducer";
import {getPurchasesStatistic} from "../store/StatisticReducer";
import {
    FlexibleWidthXYPlot,
    HorizontalGridLines,
    VerticalBarSeriesCanvas,
    VerticalGridLines,
    XAxis,
    XYPlot,
    YAxis
} from "react-vis";

const StatisticsPage = () => {
    const purchases = useSelector(state => state.statistic.purchases)
    const dispatch = useDispatch()

    useEffect( () =>{
        dispatch(getPurchasesStatistic())
    }, [])

    return (
        <div className="wide main">
            <h3 className="title">Statistic</h3>
            <div style={{display: "flex", justifyContent: "center"}}>
                <FlexibleWidthXYPlot
                    xType="ordinal"
                    height={300}
                    animation
                >
                    <HorizontalGridLines />
                    <XAxis  title="Day" style={{
                        line: {stroke: ''},
                        text: {stroke: 'none', fill: '#6b6b76', fontWeight: 600, fontSize: 10}
                    }} />
                    <YAxis  title="Count"
                            tickTotal={7}
                            style={{
                                line: {stroke: ''},
                                text: {stroke: 'none', fill: '#6b6b76', fontWeight: 600, fontSize: 10}
                            }}/>
                    <VerticalBarSeriesCanvas data = {purchases.map(purchase => {
                        return {x: new Date(purchase.name).toLocaleString("en-US", {month: window.innerWidth < 600 ? "narrow" : "short", day: "2-digit"}), y: purchase.count}
                    })} color="#975ad4"/>
                </FlexibleWidthXYPlot>
            </div>
        </div>
    );
};

export default StatisticsPage;