/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';

import { confirmAlert } from "react-confirm-alert";

import { useDispatch, useSelector } from "react-redux";
import UtilService from "../../services/utils";
import Modal from "react-awesome-modal";
import Moment from "react-moment";
import Loading from "../../components/Loading";
import ItemCard from "../../components/Card/ItemCard";
import InfoItem from "../../components/Card/InfoItem";

import { Button, Alert, Col, Form } from "react-bootstrap";

import "./styles.scss";

const Subscription = () => {
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [authorizenet, credits] = useSelector((state) => [
        state.authorizenet,
        state.search.credits
    ]);
    const subscriptTypeToUpdate = authorizenet.subscription
        ? authorizenet.subscription.plan === "basic"
            ? "premium"
            : "basic"
        : null;
    const [renewalDate, setRenewalDate] = useState(null);
    const [leaveModalVisible, setLeaveModalVisible] = useState(false);
    const [alertModalVisible, setAlertModalVisible] = useState(false);
    const [date, setdate] = useState("")
    const [reason, setReason] = useState(null);
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (authorizenet.subscription) {
            const startDate = new Date(authorizenet.subscription.start_date);
            const now = new Date();
            var datee;

            if (now.getMonth() === 11) {
                setRenewalDate(
                    new Date(now.getFullYear() + 1, 0, startDate.getDate())
                );

            } else {
                setRenewalDate(
                    new Date(
                        now.getFullYear(),
                        now.getMonth() + 1,
                        startDate.getDate()
                    )
                );
            }

            if(now.getMonth() > startDate.getMonth()){
                datee = new Date(now.getFullYear(), now.getMonth(), startDate.getDate() - 1);
            } else {
                datee = new Date(now.getFullYear(), now.getMonth() + 1, startDate.getDate() - 1);
            }
            
            setdate(datee.toLocaleDateString());
            // if(now >= startDate){
            //     datee = new Date(now.getFullYear(), now.getMonth(), startDate.getDate())
            //     console.log(datee.toLocaleDateString())
            // } else {
            //     datee = new Date(now.getFullYear(), now.getMonth(), startDate.getDate())
            //     console.log(datee.toLocaleDateString())
            // }

        }
    }, [authorizenet]);

    const updateSubscription = () => {
        dispatch({
            type: "authorize.net/UPDATE_SUBSCRIPTION",
            payload: { subscriptionType: subscriptTypeToUpdate },
        });
    };

    // const onSubmit = () => {
    //     confirmAlert({
    //         title: "Are you sure?",
    //         message:
    //             subscriptTypeToUpdate === "premium"
    //                 ? "You will charge more $50 to upgrade your subscription"
    //                 : "You cannot unsubscribe and resubscribe to get the discount. We have a zero refund policy.",
    //         buttons: [
    //             {
    //                 label: "Exit",
    //                 onClick: () => { },
    //             },
    //             {
    //                 label: "Continue with updating",
    //                 onClick: () => updateSubscription(),
    //             },
    //         ],
    //     });
    // };

    const onSubmit = (data) => {
        setAlertModalVisible(true);
        dispatch({
            type: "authorize.net/CANCEL_SUBSCRIPTION",
            payload: {
                subscription_id: authorizenet.subscription_id,
                primary_reason: data.primary_reason,
                another_reason: data.another_reason,
                suggestions: data.suggestions,
                returnTous: data.returnTous
            },
        });
    };

    const onCancel = () => {
        setLeaveModalVisible(true);
    };

    const handleAlertClick = () => {
        // dispatch({
        //     type: 'user/LOGOUT',
        // })
    }

    return (
        <div className="w-full md:w-1/3 sm:px-20 md:px-0">
            <Modal visible={leaveModalVisible} effect="fadeInUp" width="40%" height="90%">
                <div className="leave-modal modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <img
                                src="resources/images/crying.png"
                                alt=""
                                style={{
                                    width: "50px",
                                    margin: "0px auto 20px auto",
                                }}
                            />
                            <h4>We're sad to see you go...</h4>
                            <span>
                                Before you cancel, please let us know the reason
                                you are leaving. Every bit of feedback helps!
                            </span>
                        </div>
                        <div className="modal-body">
                            <Form
                                noValidate
                                onSubmit={handleSubmit(onSubmit)}
                                validated={validated}
                            >
                                <Form.Row>
                                    <Form.Group
                                        as={Col}
                                        md="12"
                                        controlId="validationReason"
                                    >
                                        <Form.Group>
                                            <Form.Label>&#8594; What is your primary reason for leaving?</Form.Label>
                                            {errors.primary_reason && <p style={{ color: 'red' }}> This field is required!</p>}
                                            <Form.Check type="radio" {...register('primary_reason', { required: true })} label="Price"
                                                value="Price"
                                                required />
                                            <Form.Check type="radio" label="Service"
                                                {...register('primary_reason', { required: true })}
                                                value="Service"
                                                required />
                                            <Form.Check type="radio" label="Quality of Data"
                                                {...register('primary_reason', { required: true })}
                                                value="Quality of Data"
                                            />
                                            <Form.Check type="radio" label="List Turnaround Time"
                                                {...register('primary_reason', { required: true })}
                                                value="List Turnaround Time"
                                            />
                                            <Form.Check type="radio" label="Missing Features"
                                                {...register('primary_reason', { required: true })}
                                                value="Missing Features"
                                            />
                                            <Form.Check type="radio" label="Switch to Another Service"
                                                {...register('primary_reason', { required: true })}
                                                value="Switch to Another Service"
                                            />
                                            <Form.Check type="radio" label="I No Longer Skip Trace"
                                                {...register('primary_reason', { required: true })}
                                                value="I No Longer Skip Trace"
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>&#8594; Was there another reason that you are leaving not listed in the previous question?</Form.Label>
                                            <input type="text" className="form-control" {...register('another_reason', { required: true })} placeholder="Type your answer here..." />
                                            {errors.another_reason && <p style={{ color: 'red' }}>This field is required!</p>}
                                            <Form.Text className="text-muted">
                                                Did we meet your expectations?</Form.Text>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>&#8594; How can we improve our services to make this a better experience for our clients?</Form.Label>
                                            <Form.Control type="text" {...register('suggestions', { required: true })} placeholder="Type your answer here..." required />
                                            {errors.suggestions && <p style={{ color: 'red' }}>This field is required!</p>}
                                            <Form.Text className="text-muted">
                                                Is there anything we could have done differently?</Form.Text>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>&#8594; Will you return to us someday?</Form.Label>
                                            {errors.returnTous && <p style={{ color: 'red' }}>This field is required!</p>}
                                            <Form.Check type="radio" label="Yes"
                                                {...register('returnTous', { required: true })}
                                                value="Yes"
                                                required />
                                            <Form.Check type="radio" label="No"
                                                {...register('returnTous', { required: true })}
                                                value="No"
                                                required />
                                            <Form.Check type="radio" label="Maybe"
                                                {...register('returnTous', { required: true })}
                                                value="Maybe"
                                                required />
                                        </Form.Group>
                                    </Form.Group>
                                </Form.Row>

                                <Alert variant="danger">
                                    <Alert.Heading>Warning!</Alert.Heading>
                                    <ul className="warning-bullets">
                                        <li>Effectivity is until {date}.</li>
                                        <li>Cancellation is effective immediately.</li>
                                        <li>You will not be able to use the single search.</li>
                                    </ul>
                                </Alert>
                                <Form.Row style={{ justifyContent: "center" }}>
                                    <button
                                        type="submit"
                                        style={{ margin: "10px" }}
                                        className="button submit-button fill-button"
                                    >
                                        Cancel Account
                                        <Loading
                                            type="spin"
                                            color="#777777"
                                            height={18}
                                            width={18}
                                        />
                                    </button>
                                </Form.Row>
                                <Form.Row style={{ justifyContent: "center", marginBottom: '2%' }}>
                                    <a
                                        className="cancel-link"
                                        style={{ cursor: "pointer" }}
                                        onClick={(e) =>
                                            setLeaveModalVisible(false)
                                        }
                                    >
                                        Nevermind, I don't want to cancel.
                                    </a>
                                </Form.Row>

                            </Form>
                        </div>
                    </div>
                </div>
                <Modal visible={alertModalVisible} effect="fadeInUp" width="100%" height="20%">
                    <div className="modal-content">
                        <div className="modal-body">
                            <h4>Your account has been cancelled successfully!</h4>
                            <button
                                type="submit"
                                className="button x-small-button"
                                style={{ margin: "10px", marginLeft: "80%" }}
                                onClick={handleAlertClick}
                            >Ok
                                <Loading
                                    type="spin"
                                    color="#777777"
                                    height={18}
                                    width={18}
                                />
                            </button>
                        </div>
                    </div>
                </Modal>
            </Modal>
            <ItemCard title="SUBSCRIPTION">
                <InfoItem label="Plan Type">
                    {authorizenet.subscription
                        ? authorizenet.subscription.plan === "basic"
                            ? "Basic"
                            : "Premium"
                        : "No Plan Now"}
                </InfoItem>
                <InfoItem label="Billing Date">
                    {credits && (
                        <Moment format="MMM DD, YYYY">{renewalDate}</Moment>
                    )}
                </InfoItem>
                <InfoItem label="Monthly Subscription Rate">
                    {authorizenet.subscription &&
                        `$${UtilService.plans[authorizenet.subscription.plan]
                            .monthly_rate
                        }`}
                </InfoItem>
                <InfoItem label="Remaining Single Search">
                    {credits && credits.plan_total - credits.single_search}
                </InfoItem>
                <InfoItem label="Add-on Single Search Price">
                    {authorizenet.subscription &&
                        `$${UtilService.plans[authorizenet.subscription.plan]
                            .price
                        }`}
                </InfoItem>
                <InfoItem label="Batch Search Price">
                    {authorizenet.subscription &&
                        `$${UtilService.plans[authorizenet.subscription.plan]
                            .price
                        }`}
                </InfoItem>
                {/*{*/}
                {/*  authorizenet.subscription &&*/}
                {/*  <div className='flex justify-center mt-5 mb-3'>*/}
                {/*    <button*/}
                {/*      className='button submit-button fill-button'*/}
                {/*      disabled={authorizenet.loading || !authorizenet.subscription.plan}*/}
                {/*      onClick={onSubmit}*/}
                {/*    >*/}
                {/*      {authorizenet.subscription.plan === 'premium' ? 'DOWNGRADE' : 'UPGRADE'} SUBSCRIPTION*/}
                {/*      <Loading type="spin" color="#ffffff" height={18} width={18} />*/}
                {/*    </button>*/}
                {/*  </div>*/}
                {/*}*/}
            </ItemCard>

            <div className="my-2 flex justify-center">
                <button
                    className="button border-0"
                    disabled={
                        authorizenet.loading || !authorizenet.subscription_id
                    }
                    onClick={() => onCancel()}
                >
                    <strong style={{ color: "#777777" }}>
                        CANCEL MY SUBSCRIPTION
                    </strong>
                    <Loading
                        type="spin"
                        color="#777777"
                        height={18}
                        width={18}
                    />
                </button>
            </div>
        </div>
    );
};

export default Subscription;
