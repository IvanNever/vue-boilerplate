import { isAxiosError } from 'axios';

export function apiErrors(error: unknown): string {
  if (typeof error === 'string') return error;

  const status = isAxiosError(error) ? error.response?.status : undefined;

  switch (status) {
    case 400:
      return 'The request could not be understood by the server. Please check your input and try again.';
    case 401:
      return 'Login failed. The e-mail or password you entered is incorrect.';
    case 403:
      return 'Access to this resource is restricted. You do not have the necessary permissions.';
    case 404:
      return 'The requested resource was not found. Please check the URL and try again.';
    case 405:
      return 'The HTTP method used is not allowed for this resource. Please contact support if you believe this is an error.';
    case 408:
      return 'The request took too long to respond. Please check your network connection and try again.';
    case 409:
      return 'There was a conflict with the current state of the resource. Please refresh and try again.';
    case 410:
      return 'The requested resource is no longer available on this server.';
    case 413:
      return 'The request payload is too large. Please reduce the size and try again.';
    case 415:
      return 'The request media type is not supported by the server. Please check and try again.';
    case 429:
      return 'You have made too many requests in a short period. Please wait and try again later.';
    case 500:
      return 'An error occurred on the server. Please try again later or contact support if the problem persists.';
    case 501:
      return 'The server does not support this functionality. Please contact support for more information.';
    case 502:
      return 'The server received an invalid response from an upstream server. Please try again later.';
    case 503:
      return 'The server is currently unavailable. Please try again later.';
    case 504:
      return 'The server took too long to respond. Please check your network and try again.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
}
