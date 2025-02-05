const paypal = require('../../helpers/paypal');
const Order = require('../../models/Order');
const Course = require('../../models/Course');
const studentCourses = require('../../models/StudentCourses');
const StudentCourses = require('../../models/StudentCourses');

const createOrder = async (req, res) => {
    try {
        const {
            userId,
            userName,
            userEmail,
            orderStatus,
            paymentMethod,
            paymentStatus,
            orderDate,
            paymentId,
            payerId,
            instructorId,
            instructorName,
            courseImage,
            courseTitle,
            courseId,
            coursePricing,
            currency = 'USD',
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
                        items: [
                            {
                                name: courseTitle,
                                sku: courseId,
                                price: coursePricing.toFixed(2),
                                currency: 'USD',
                                quantity: 1,
                            }
                        ]
                    },
                    amount: {   
                        currency: 'USD',
                        total: coursePricing.toFixed(2)
                    },
                    description: courseTitle,
                }
            ]
        };

        console.log(req.body);

        // Handle PayPal Payment Creation with a Promise
        const createPaypalPayment = () => {
            return new Promise((resolve, reject) => {
                paypal.payment.create(create_payment_json, (error, paymentInfo) => {
                    if (error) reject(error);
                    else resolve(paymentInfo);
                });
            });
        };

        const paymentInfo = await createPaypalPayment();

        const newlyCreatedCourseOrder = new Order({
            userId,
            userName,
            userEmail,
            orderStatus,
            paymentMethod,
            paymentStatus,
            orderDate,
            paymentId,
            payerId,
            instructorId,
            instructorName,
            courseImage,
            courseTitle,
            courseId,
            coursePricing,
        });

        await newlyCreatedCourseOrder.save();

        const approveUrl = paymentInfo.links.find(link => link.rel === 'approval_url')?.href;

        res.status(201).json({
            success: true,
            data: {
                approveUrl,
                orderId: newlyCreatedCourseOrder._id
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred",
        });
    }
};  

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

        const studentCourses = await StudentCourses.findOne({
            userId: order.userId
        })

        if(studentCourses){
            studentCourses.courses.push({
                courseId: order.courseId,
                title: order.courseTitle,
                instructorId: order.instructorId,
                instructorName: order.instructorName,
                dateOfPurchase: order.orderDate,
                courseImage: order.courseImage,
            });

            await studentCourses.save();
        } else {
            const newStudentCourses = new StudentCourses({
                useerId: order.userId,
                courses: [
                    {
                        courseId: order.courseId,
                        title: order.courseTitle,
                        instructorId: order.instructorId,
                        instructorName: order.instructorName,
                        dateOfPurchase: order.orderDate,
                        courseImage: order.courseImage,
                    }
                ]
            });

            await newStudentCourses.save();
        }

        await Course.findByIdAndUpdate(order.courseId, {
            $addToSet: {
                students: {
                    studentId: order.userId,
                    studentName: order.userName,
                    studentEmail: order.userEmail,
                    paidAmount: order.coursePricing,
                }
            }
        })

        res.status(200).json({
            success: true,
            message: 'Order confirmed',
            data: order,
        })

    } catch(e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "some error occurred",
        })
    }
}

module.exports = {createOrder, capturePaymentAndFinalizeOrder}