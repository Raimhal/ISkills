import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {clearLoading, clearPurchases, getPurchasesStatistic} from "../store/PurchaseReducer";
import {FlexibleWidthXYPlot, HorizontalGridLines, VerticalBarSeriesCanvas, XAxis, YAxis} from "react-vis";
import Loading from "../components/UI/Loading/Loading";

const StatisticsPage = () => {
    const purchases = useSelector(state => state.purchase.purchases)
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.purchase.isLoading)

    useEffect( () =>{
        dispatch(getPurchasesStatistic())

        return () => {
            dispatch(clearPurchases())
            dispatch(clearLoading())
        }
    }, [])

    return (
        <div className="wide main">
            <h3 className="title">Purchases</h3>
            {!isLoading
            ? <div style={{display: "flex", justifyContent: "center"}}>
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
            : <Loading/>
            }
        </div>
    );
};

export default StatisticsPage;