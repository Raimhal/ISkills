import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {clearLoading, clearPurchases, getPurchasesStatistic} from "../store/PurchaseReducer";
import {FlexibleWidthXYPlot, HorizontalGridLines, VerticalBarSeriesCanvas, XAxis, YAxis} from "react-vis";
import Loading from "../components/UI/Loading/Loading";
import { Area } from '@ant-design/plots';

const StatisticsPage = () => {
    const purchases = useSelector(state => state.purchase.purchases)
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.purchase.isLoading)

    let data = [{day: 'Jun 25', count: 14}, {day: 'Jun 27', count: 4}]

    useEffect( () =>{
        dispatch(getPurchasesStatistic())
        console.log(data)

        return () => {
            dispatch(clearPurchases())
            dispatch(clearLoading())
        }
    }, [])

    return (
        <div className="wide main">
            <h3 className="title">Purchases</h3>
            {!isLoading
            ? <div>
                    <Area {...{
                        data: purchases,
                        autoFit: true,
                        xField: 'name',
                        yField: 'count',
                        xAxis: {
                            tickCount: 0,
                        },
                        point: {
                            size: 5,
                        },
                        areaStyle: () => {
                            return {
                                gradient: 'l(0) 0:#9c27b0 1:#ccccff',
                            };
                        },
                        color: '#975ad4'
                    }} />
            </div>
            : <Loading/>
            }
        </div>
    );
};

export default StatisticsPage;