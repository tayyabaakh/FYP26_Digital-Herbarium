import axiosInstance from "./api";

export const getBotanistDashboardApi = async () => {
    const response = await axiosInstance.get(
        "/botanist/dashboard"
    );

    return response.data;
};