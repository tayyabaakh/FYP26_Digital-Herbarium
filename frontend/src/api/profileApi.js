// import axiosInstance from "./api";


// export const getMyProfileApi = async () => {
//     const response = await axiosInstance.get(
//         "/profile/me"
//     );

//     return response.data;
// };



import axiosInstance from "./api";


// GET MY PROFILE
export const getMyProfileApi = async () => {
    const response = await axiosInstance.get(
        "/profile/me"
    );

    return response.data;
};


// UPDATE MY PROFILE
export const updateMyProfileApi = async (profileData) => {
    const response = await axiosInstance.put(
        "/profile/me",
        profileData
    );

    return response.data;
};