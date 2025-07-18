import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData){
    try {
        const { data } = await axiosInstance.post("/auth/register", {
            ...formData,
            role: "user",
        });
        return data;
    } catch (error) {
        console.error("Error registering user:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
} 

export async function loginService(formData){
    try {
        const { data } = await axiosInstance.post("/auth/login", formData);
        return data;
    } catch (error) {
        console.error("Error registering user:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
} 

export async function checkAuthService(){
    try {
        const { data } = await axiosInstance.get("/auth/check-auth");
        return data;
    } catch (error) {
        console.error("Error registering user:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export async function mediaUploadService(formData, onProgressCallback){
    
    try {
        const { data } = await axiosInstance.post("/media/upload", formData, {
            onUploadProgress: (ProgressEvent => {
                const percentageCompleted = Math.round(
                    (ProgressEvent.loaded * 100) / ProgressEvent.total
                );
                onProgressCallback(percentageCompleted)
            })
        });
        
        return data;
    } catch (error) {
        console.error("Error uploading data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
} 

export async function mediaDeleteService(id){    
    try {
        const { data } = await axiosInstance.delete(`/media/delete/${id}`);

        return data;
    } catch (error) {
        console.error("Error deleting data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
} 

export async function fetchInstructorCourseListService(){
    try {
        const { data } = await axiosInstance.get(`/instructor/course/get`);
        return data;

    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export async function addNewCourseService(formData){
    try {
        const { data } = await axiosInstance.post(`/instructor/course/add`, formData);
        return data;

    } catch (error) {
        console.error("Error adding data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export async function fetchInstructorCourseDetailservice(id){
    try {
        const { data } = await axiosInstance.get(`/instructor/course/get/details/${id}`);
        
        return data;
    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export async function updateCourseByIdService(id, formData){
    try {
        const { data } = await axiosInstance.put(`/instructor/course/update/${id}`, formData);
        return data;

    } catch (error) {
        console.error("Error updating data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export async function mediaBulkUploadService(formData, onProgressCallback){
    
    try {
        const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
            onUploadProgress: (ProgressEvent => {
                const percentageCompleted = Math.round(
                    (ProgressEvent.loaded * 100) / ProgressEvent.total
                );
                onProgressCallback(percentageCompleted)
            })
        });
        
        return data;
    } catch (error) {
        console.error("Error uploading data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
} 

export async function fetchStudentViewCourseListService(query){
    try {
        const { data } = await axiosInstance.get(`/student/course/get?${query}`);
        return data;

    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export async function fetchStudentViewCourseDetailsService(courseId){
    try {
        const { data } = await axiosInstance.get(`/student/course/get/details/${courseId}`);
        return data;

    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export async function checkCoursePurchaseInfoService(courseId, studentId){
    try {
        const { data } = await axiosInstance.get(`/student/course/purchase-info/${courseId}/${studentId}`);    
        return data;

    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export async function createPaymentService(formData){
    try {
        const { data } = await axiosInstance.post(`/student/order/create`, formData);
        return data;

    } catch (error) {
        console.error("Error adding data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export async function captureAndFinalizePaymentService(paymentId, payerId, orderId ){
    console.log(payerId,'kumar');
    
    try {
        const { data } = await axiosInstance.post(`/student/order/capture`, {
            paymentId, payerId, orderId 
        });
        return data;

    } catch (error) {
        console.error("Error adding data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}


export async function fetchStudentBoughtCourseDetailsService(studentId){
    try {
        const { data } = await axiosInstance.get(`/student/courses-bought/get/${studentId}`);
        return data;

    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

export async function getCurrentCourseProgressService(userId,  courseId){
    try {
        const { data } = await axiosInstance.get(`/student/course-progress/get/${userId}/${courseId}`);    
        return data;

    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}


export async function markLectureAsViewedService(userId, courseId, lectureId){
    try {
        const { data } = await axiosInstance.post(`/student/course-progress/mark-lecture-viewed`, {
            userId,
            courseId,
            lectureId
        });    
        return data;

    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}


export async function resetCourseProgressService(userId,  courseId){
    try {
        const { data } = await axiosInstance.post(`/student/course-progress/reset-progress`, {
            userId, courseId
        });    
        return data;

    } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
}

