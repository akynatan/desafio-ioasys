interface IResponse {
    success: boolean;
    data: unknown;
    error: unknown;
}

export class ResponseFactory {
    static success(data: unknown): IResponse{
        return {
            success: true,
            data: data,
            error: null
        };
    }

    static error(error: unknown): IResponse{
        return {
            success: false,
            data: null,
            error: error
        };
    }
}