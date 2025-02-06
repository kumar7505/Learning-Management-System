import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { captureAndFinalizePaymentService } from '@/services';
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';

const PaypalPaymentReturnPage = () => {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId')
    const payerId = params.get('PayerID')
    
    useEffect(() => {
        if(payerId && paymentId){
            async function capturePayment(){
                const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
                const res = await captureAndFinalizePaymentService(
                    paymentId, 
                    payerId, 
                    orderId,
                )
                if(res?.success){
                    sessionStorage.removeItem('currentOrderId');
                    window.location.href = '/my-courses';
                }
            }
            capturePayment();
        }
    }, [payerId, paymentId])
    
  return (
    <Card>
        <CardHeader>
            <CardTitle>Processing payment... Please wait</CardTitle>
        </CardHeader>
    </Card>
  )
}

export default PaypalPaymentReturnPage