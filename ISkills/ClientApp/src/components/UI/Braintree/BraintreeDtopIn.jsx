import React, {useEffect, useState} from 'react'
import dropin from "braintree-web-drop-in";
import MyButton from "../Button/MyButton";
import {useDispatch, useSelector} from "react-redux";
import {assignUser} from "../../../store/UserReducer";
import {generateClientToken} from "../../../store/PurchaseReducer";

const BraintreeDropIn = ({show, onPaymentCompleted, clientToken, ...props}) => {

    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.purchase.isClientTokenLoading)
    const course = useSelector(state => state.course.course)
    const [braintreeInstance, setBraintreeInstance] = useState(undefined)



    useEffect(() => {
        if (show) {
            const initializeBraintree = () => dropin.create({
                authorization: clientToken,
                container: '#braintree-drop-in-div',
            }, function (error, instance) {
                if (error)
                    console.error(error)
                else
                    setBraintreeInstance(instance);
            });

            if (braintreeInstance) {
                braintreeInstance
                    .teardown()
                    .then(() => {
                        initializeBraintree();
                    });
            } else {
                initializeBraintree();
            }
        }
    }, [show])

    return (
        <div
            style={{display: `${show ? "block" : "none"}`}}
        >
            <div
                id={"braintree-drop-in-div"}
            />

            <MyButton
                className="braintreePayButton"
                style={{width: "100%"}}
                type="primary"
                disabled={!braintreeInstance}
                onClick={() => {
                    if (braintreeInstance) {
                        braintreeInstance.requestPaymentMethod(
                            async (error, payload) => {
                                if (error) {
                                    console.error(error);
                                }
                                else {
                                    const paymentMethodNonce = payload.nonce;

                                    await dispatch(assignUser(paymentMethodNonce))

                                    onPaymentCompleted();
                                }
                            });
                    }
                }}
            >
                {
                    `Pay $${course.price}`
                }
            </MyButton>
        </div>
    )
}

export default BraintreeDropIn;