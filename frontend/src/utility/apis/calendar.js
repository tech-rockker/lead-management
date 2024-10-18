// import ApiEndpoints from "../http/ApiEndpoints"
// import http from "../http/useHttp"
// import { ErrorToast, SuccessToast } from "../Utils"

// export const loadCalendar = async ({ async = false, jsonData, loading, page, perPage, dispatch = () => { }, success = () => { } }) => {
//     return http.request({
//         async,
//         method: "post",
//         path: ApiEndpoints.load_calendar,
//         jsonData,
//         loading,
//         params: { page, perPage },
//         success: (data) => { dispatch(loadCalendar(data?.payload)); success(data) },
//         error: () => { /** ErrorToast("data-fetch-failed") **/ }
//     })
// }
