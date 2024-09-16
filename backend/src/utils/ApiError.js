class ApiError extends Error{
    constructor(
        statusCode,
        message = "something went wong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode,
        this.data = null,
        this.success = fasle,
        this.message = message,
        this.errors = errors

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}