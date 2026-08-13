class ApiResponse{
    constructor(status,data,message="success"){
        this.statusCode = statusCode,
        this.data= data,
        this.message=message,
        this.success= statusCode <400
    }
}
export {ApiResponse}