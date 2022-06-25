import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {clearUsers, getCurrentUser, getUsers, setParams} from "../store/UserReducer";
import {getPurchasesStatistic} from "../store/StatisticReducer";
import {HorizontalGridLines, VerticalBarSeriesCanvas, VerticalGridLines, XAxis, XYPlot, YAxis} from "react-vis";

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
                <XYPlot xType="ordinal" width={500} height={400}>
                    <HorizontalGridLines />
                    <VerticalGridLines />
                    <XAxis/>
                    <YAxis/>
                    <VerticalBarSeriesCanvas
                        barWidth={10}
                        data={[...purchases].map((purchase,index) => {

                            return  {x: new Date(purchase.name).toLocaleString("en-US", {month: "short", day: "2-digit"}), y: purchase.count}
                        })}
                        color={"#975ad4"}
                    />
                </XYPlot>
            </div>
        </div>
    );
};

export default StatisticsPage;