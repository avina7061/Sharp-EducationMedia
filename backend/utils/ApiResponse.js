class ApiResponse {
  constructor(statusCode, data, message = "Success", success) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.success = success;
  }
}
// this is a class that will handle the response of the API. It will return the status code, data and message in the form of an object

export { ApiResponse };
