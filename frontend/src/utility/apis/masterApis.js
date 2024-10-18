// // import { deleteCategory, deleteCatType, loadCategory, saveCatTypes, saveNewCategory, saveNewCatType, updateCategory, updateNewCatType } from "../../redux/actions/categories"
// import { commonAction } from "../../redux/actions/common"
// import { reduxLoadCategories } from "../../redux/reducers/categories"
// import { parentCategoryLoad } from "../../redux/reducers/categoriesParent"
// import { delCatType, loadCatType, saveCatType, updateCatType } from "../../redux/reducers/categoriesTypes"
//
// import { log } from "../helpers/common"
// import ApiEndpoints from "../http/ApiEndpoints"
// import http from "../http/useHttp"
// import { ErrorToast, SuccessToast } from "../Utils"

// /////////////////// Category Types //////////////////////////
// /**
//  * Load category types from api
//  */
// export const loadCatTypes = async ({ async = false, jsonData, loading, page, perPage, dispatch = () => { }, success = () => { } }) => {
//     return http.request({
//         async,
//         method: "post",
//         path: ApiEndpoints.loadCatTypes,
//         jsonData,
//         loading,
//         params: { page, perPage },
//         success: (data) => { dispatch(loadCatType(data.payload)); success(data) },
//         error: () => { /** ErrorToast("data-fetch-failed") **/ }
//     })
// }
// /**
//  * Save new category type to BD.
//  */
// export const submitNewCatType = ({ jsonData, loading, dispatch = () => { }, success = () => { } }) => {
//     http.request({
//         method: "post",
//         path: ApiEndpoints.addCatType,
//         jsonData,
//         loading,
//         showErrorToast: true,
//         success: (data) => { dispatch(saveCatType([{ ...data.payload, status: 1 }])); SuccessToast("data-saved"); success(data) }

//     })
// }

// /**
//  * Edit new category type to BD.
//  */
// export const editCatType = ({ id, jsonData, loading, dispatch = () => { }, success = () => { } }) => {
//     http.request({
//         method: "put",
//         path: ApiEndpoints.editCatType + id,
//         jsonData,
//         loading,
//         showErrorToast: true,
//         success: (data) => { dispatch(updateCatType(data.payload)); SuccessToast("data-edited"); success(data) }
//     })
// }

// /**
//  * Delete Cat Type By Id
//  * @param {*} param0
//  */
// export const deleteCatTypeId = ({ id, loading, dispatch = () => { } , success = () => { }, error = () => { } }) => {
//     http.request({
//         method: "delete",
//         path: ApiEndpoints.deleteCatType + id,
//         loading,
//         showErrorToast: true,
//         success: () => { dispatch(delCatType(id)); success(true) },
//         error: () => { error(true) }
//     })
// }

// ///////////////////// Categories ///////////////////////
// /**
//  * Load category from api
//  */
// export const loadCategoryParents = async ({ async = false, page, perPage, jsonData, loading, dispatch = () => { }, success = () => { } }) => {
//     return http.request({
//         async,
//         method: "post",
//         path: ApiEndpoints.loadCategoryParents,
//         jsonData,
//         loading,
//         params: { page, perPage },
//         success: (data) => { dispatch(parentCategoryLoad(data.payload)); success(data) },
//         error: () => { /** ErrorToast("data-fetch-failed") **/ }
//     })
// }
// /**
//  * Load category from api
//  */
// export const loadCategories = async ({ async = false, jsonData, page, perPage, loading, dispatch = () => { }, success = () => { } }) => {
//     return http.request({
//         async,
//         method: "post",
//         path: ApiEndpoints.loadCategories,
//         jsonData,
//         loading,
//         params: { page, perPage },
//         success: (data) => { dispatch(reduxLoadCategories(data.payload)); success(data); log(data) },
//         error: () => { /** ErrorToast("data-fetch-failed") **/ }
//     })
// }
// /**
//  * Save new category to BD.
//  */
// export const saveCategory = ({ jsonData, loading, dispatch = () => { }, success = () => { } }) => {
//     http.request({
//         method: "post",
//         path: ApiEndpoints.saveCategory,
//         jsonData,
//         loading,
//         showErrorToast: true,
//         success: (data) => { dispatch(saveNewCategory([{ ...data.payload, status: 1 }])); SuccessToast("data-saved"); success(data) },
//         error: () => { }
//     })
// }

// /**
//  * Edit new category to BD.
//  */
// export const editCategory = ({ jsonData, loading, dispatch = () => { }, success = () => { } }) => {
//     http.request({
//         method: "put",
//         path: ApiEndpoints.editCategory + jsonData?.id,
//         jsonData,
//         loading,
//         showErrorToast: true,
//         success: (data) => { dispatch(updateCategory(data.payload)); SuccessToast("data-edited"); success(data) },
//         error: () => { }
//     })
// }

// /**
//  * Delete Cat By Id
//  * @param {*} param0
//  */
// export const deleteCategoryById = ({ id, loading, dispatch = () => { } , success = () => { }, error = () => { } }) => {
//     http.request({
//         method: "delete",
//         path: ApiEndpoints.deleteCategoryById + id,
//         loading,
//         showErrorToast: true,
//         success: () => { dispatch(deleteCategory(id)); success(true) },
//         error: (e) => { error(true) }
//     })
// }
