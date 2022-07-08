import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    clearLoading, clearParams,
    clearPurchases,
    clearYearLoading,
    clearYearPurchases,
    getPurchasesStatistic, getYearPurchasesStatistic, setParams
} from "../store/PurchaseReducer";
import {FlexibleWidthXYPlot, HorizontalGridLines, VerticalBarSeriesCanvas, XAxis, YAxis} from "react-vis";
import Loading from "../components/UI/Loading/Loading";
import { Area, Pie, BidirectionalBar } from '@ant-design/plots';
import {getTopUsers} from "../store/UserReducer";
import MySelect from "../components/UI/Select/MySelect";
import classes from "../components/UI/Navbar/Navbar.module.css";
import {Tooltip} from "@material-ui/core";
import {IconButton} from "@mui/material";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import {adminRoutes} from "../router";
import {Link} from "react-router-dom";
import {ButtonToolbar, Dropdown} from "rsuite";

const StatisticsPage = () => {
    const purchases = useSelector(state => state.purchase.purchases)
    const yearPurchases = useSelector(state => state.purchase.yearPurchases)
    const topUsers = useSelector(state => state.user.topUsers)
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.purchase.isLoading)
    const isYearLoading = useSelector(state => state.purchase.isYearLoading)
    const isTopUsersLoading = useSelector(state => state.user.isTopUsersLoading)
    const purchaseDays = useSelector(state => state.purchase.params.days)
    const purchaseYear = useSelector(state => state.purchase.params.year)
    const params = useSelector(state => state.purchase.params)

    const [init, setInit] = useState(false)

    const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i )

    useEffect( () =>{
        dispatch(getTopUsers())

        return () => {
            dispatch(clearPurchases())
            dispatch(clearYearPurchases())
            dispatch(clearLoading())
            dispatch(clearYearLoading())
            dispatch(clearParams())
        }
    }, [])

    useEffect(() => {
        dispatch(getYearPurchasesStatistic())
    }, [params.year])

    useEffect(() => {
        dispatch(getPurchasesStatistic())
    }, [purchaseDays])

    useEffect(() => {
        if(!isLoading && !isTopUsersLoading && !isYearLoading && purchases.length > 0)
            setInit(true)
    }, [isLoading, isTopUsersLoading, isYearLoading, purchases.length])
    return (
        init ?
            <div className="wide main">
                <div className="block">
                        <h4 className="flex-row">
                            <span>Purchases for last</span>
                            <ButtonToolbar>
                                <Dropdown trigger="click" title={purchaseDays} size="md" placement="bottomEnd" disabled={isLoading}>
                                    <Dropdown.Item disabled={true}>Days</Dropdown.Item>
                                    {[7, 14, 21, 30, 60, 90].map(days =>
                                        <Dropdown.Item eventKey={days} key={days} onSelect={() => {
                                            dispatch(setParams({...params, days: days}))
                                        }} active={days === purchaseDays}>{days}</Dropdown.Item>
                                    )}
                                </Dropdown>
                            </ButtonToolbar>
                            <span>days :</span>
                        </h4>
                        <Area {...{
                            data: purchases,
                            autoFit: true,
                            appendPadding: 10,
                            xField: 'day',
                            yField: 'amount',
                            xAxis: {
                                range: [0, 1],
                                tickCount: 0,
                            },
                            point: {
                                size: purchaseDays > 30 ? (180 / purchaseDays)  + 1 : 5,
                            },
                            slider: {
                                start: 0,
                                end: 1,
                                trendCfg: {
                                    isArea: true,
                                    smooth: true,
                                },
                                foregroundStyle: {
                                    fill: 'rgba(151,90,212,0.75)',
                                }
                            },
                            pattern: {
                                type: 'line',
                                cfg: {
                                    stroke: '#38023B',
                                },
                            },
                            autoHide: true,
                            animation: {
                                appear: {
                                    animation: 'fadeIn',
                                },
                            },
                            areaStyle: () => {
                                return {
                                    gradient: 'l(0) 0:#9c27b0 1:#ccccff',
                                };
                            },
                            color: '#975ad4'
                        }} />
                        {isLoading && <Loading/>}
                    </div>
                    <div className="block">
                        <h4 className="flex-row">
                            <span>Purchases for</span>
                            <ButtonToolbar>
                                <Dropdown trigger="click" title={params.year} size="md" placement="bottomEnd" disabled={isYearLoading}>
                                    <Dropdown.Item disabled={true}>Years</Dropdown.Item>
                                    {years.map(year =>
                                        <Dropdown.Item eventKey={year} key={year} onSelect={() => {

                                            !isYearLoading && dispatch(setParams({...params, year: year}))
                                        }} active={year === params.year}>{year}</Dropdown.Item>
                                    )}
                                </Dropdown>
                            </ButtonToolbar>
                            <span> :</span>
                        </h4>
                        <Pie
                            {
                            ...{
                                appendPadding: 10,
                                data: yearPurchases,
                                autoFit: true,
                                angleField: 'amount',
                                colorField: 'month',
                                radius: 0.8,
                                autoHide: true,
                                color: ["#38023B", "#532465", "#6D458F", "#A288E3", "#AD91CE", "#60C3D7", "#A9EAB0", "#FFDD4A", "#FFB725", "#FE9000", "#F487B6", "#EF3E36", "#FFFFF2"],
                                label: {
                                    type: 'outer',
                                    content: '{name}',
                                },
                                // legend: {
                                //     layout: 'horizontal',
                                //     position: 'bottom',
                                //     flipPage: false
                                // },
                                animation: true,
                                interactions: [
                                    {
                                        type: 'element-active',
                                    },
                                ],
                                pieStyle: {
                                    lineWidth: 0,
                                },
                            }
                            }
                        />
                    </div>
                    <div className="block">
                        <h4 className="flex-row">Authors (Rating - Courses) :</h4>
                        <BidirectionalBar
                            {...{
                                data: topUsers,
                                xField: 'userName',
                                xAxis: {
                                    position: 'bottom',
                                },
                                yAxis: {
                                    "rating": {
                                        nice: true
                                    },
                                    "count" : {
                                        nice: true
                                    }
                                },
                                interactions: [
                                    {
                                        type: 'active-region',
                                    },
                                ],

                                yField: ['rating', 'count'],
                                tooltip: {
                                    shared: true,
                                    showMarkers: false,
                                },
                            }}
                        />
                    </div>

            </div>
            : <Loading/>
    );
};

export default StatisticsPage;