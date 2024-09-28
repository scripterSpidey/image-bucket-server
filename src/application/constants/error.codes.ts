const errorCodes = {
    NOT_FOUND : 404,
    BAD_REQUEST : 400,
    SERVER_ERROR: 500,
    FORBIDDEN: 403,
    UNAUTHERIZED:401,
    CONFLICT:409
}

export default errorCodes;

export enum ErrorNames {
    NOT_FOUND = 'Not found',
    BAD_REQUEST = 'Bad request',
    FORBIDDEN = 'Forbidden',
    INVALID_DATA = 'Invalid data',
    UNAUTHERIZED = "Unautherized",
    DUPLICATE = 'Duplicate data'
}