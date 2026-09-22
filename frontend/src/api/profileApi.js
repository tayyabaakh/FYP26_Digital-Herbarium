import axiosInstance from "./api";


export const getMyProfileApi = async () => {
    const response = await axiosInstance.get(
        "/profile/me"
    );

    return response.data;
};