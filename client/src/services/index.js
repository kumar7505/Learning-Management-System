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

export async function mediaUploadService(formData){
    
    try {
        const { data } = await axiosInstance.post("/media/upload", formData);
        
        return data;
    } catch (error) {
        console.error("Error uploading data:", error.response?.data || error.message);
        throw error; // Re-throw the error to handle it in the calling function
    }
} 