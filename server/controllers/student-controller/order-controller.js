const paypal = require('../../helpers/paypal');
const Order = require('../../models/Order');
const Course = require('../../models/Course');
const studentCourses = require('../../models/StudentCourses');

const createOrder = async(req, res) => {
    try {
        const {
            userId ,
            userName ,
            userEmail ,
            orderStatus ,
            paymentMethod ,
            paymentStatus ,
            orderDate ,
            paymentId ,
            payerId ,
            instructorId ,
            instructorName ,
            courseImage ,
            courseTitle ,
            courseId ,
            coursePricing ,
        } = req.body;

        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_URL}/payment-return`,
                cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
            },
            transactions: [
                {
                    item_list: {
                        items: {
                            name: courseTitle,
                            sku: courseId,
                            price: coursePricing,
                            currency: 'USD',
                            quantity: 1,
                        }
                    },
                    amount: {   
                        currency: 'USD',
                        total: coursePricing.toFixed(2)
                    },
                    description: courseTitle,
                }
            ]
        }

        paypal.payment.create(create_payment_json, async(error, paymentInfo) => {
            if(error){
                console.log(error);
                return res.status(500).json({
                    success: false,
                    message: 'Error while creating paypal payment',
                })
            } else {
                const newlyCreatedCourseOrder = new Order({
                    userId ,
                    userName ,
                    userEmail ,
                    orderStatus ,
                    paymentMethod ,
                    paymentStatus ,
                    orderDate ,
                    paymentId ,
                    payerId ,
                    instructorId ,
                    instructorName ,
                    courseImage ,
                    courseTitle ,
                    courseId ,
                    coursePricing ,
                })
                await newlyCreatedCourseOrder.save();

                const approveUrl = paymentInfo.links.find(link => link.rel == 'approve_url').href;
                
                res.status(201).json({
                    success: true,
                    data: {
                        approveUrl,
                        orderId: newlyCreatedCourseOrder._id
                    }
                })

            }
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "some error occurred",
        })
    }
}

const capturePaymentAndFinalizeOrder = async(req, res) => {
    try {

        const [paymentId, payerId, orderId] = req.body;

        let order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({
                success: false,
                message: 'oder cannot be found',
            })
        }

        order.paymentStatus = 'paid';
        order.orderStatus = 'conformed';
        order.paymentId = paymentId;
        order.payerId = payerId;
        
        await order.save();

    } catch(e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "some error occurred",
        })
    }
}

module.exports = {createOrder, capturePaymentAndFinalizeOrder}