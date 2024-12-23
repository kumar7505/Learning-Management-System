import axiosInstance from "@/api/axiosInstance";
import { registerService } from "@/services";

async function registerService(formData){
    const { data } = await axiosInstance.post("/auth/register", {
        ...formData,
        role: "user",
    });
    
     return data;
} 