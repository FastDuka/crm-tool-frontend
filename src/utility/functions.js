import {ElNotification} from "element-plus";

export function showSuccess (text)
{
    ElNotification({
        title: 'Success',
        type: "success",
        position: "top-right",
        message: text
    })
}
export function raiseError (text)
{
    ElNotification({
        title: 'Error',
        type: "error",
        position: "top-right",
        message: text
    })
}
export function raiseServerError(err) {
    if (err && err.response && err.response.data) {
        if (err.response.data.errors) {
            // ValidationException
            const errors = err.response.data.errors;
            let errorMessages = [];
            if (Array.isArray(errors)) {
                // errors is an array
                errors.forEach((fieldErrors, index) => {
                    fieldErrors.forEach((message, errorIndex) => {
                        setTimeout(()=>{
                            ElNotification({
                                title: 'Error',
                                type: "error",
                                position: "top-right",
                                message: message,
                            })
                        },1000)


                    });
                });
            } else if (typeof errors === 'object') {
                // errors is an object
                Object.keys(errors).forEach((field, index) => {
                    errors[field].forEach((message, errorIndex) => {
                        setTimeout(()=>{
                            ElNotification({
                                title: 'Error',
                                type: "error",
                                position: "top-right",
                                message: message,
                            })
                        },1000)

                        // errorMessages.push(`${index + 1}.${errorIndex + 1}: ${message}`);
                    });
                });
            } else {
                // errors is neither an array nor an object
                ElNotification({
                    title: 'Error',
                    type: "error",
                    position: "top-right",
                    message: 'An Unexpected error occurred',
                })
            }


        } else if (err.response.data.message && err.response.data.error) {
            ElNotification({
                title: 'Error',
                type: "error",
                position: "top-right",
                message: err.response.data.error,
            })
        }  else if (err.response.data.message ) {

            ElNotification({
                title: err.response.data.message,
                type: "error",
                position: "top-right",
                message: err.response.data.message,
            })
        }
        else {

            ElNotification({
                title: 'Error',
                type: "error",
                position: "top-right",
                message: 'An Unexpected error occurred',
            })

        }
    } else {

        ElNotification({
            title: 'Error',
            type: "error",
            position: "top-right",
            message: err
        })

    }
}

export function deleteLocalStorageInformation(){
    localStorage.removeItem("authData")
    localStorage.removeItem("userDetails")
}






export default {}