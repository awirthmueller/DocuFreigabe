import { AxiosError, InternalAxiosRequestConfig } from "axios";
import ago from "s-ago";
import { RelativeTimeFormat } from "Intl";
import { useTranslation } from "react-i18next";

import {
  ACCOUNT_LOCK_OUT_TIME_IN_MINUTES,
  ACCOUNT_MAX_FAILED_ATTEMPTS_TO_SIGN_IN,
  LANGUAGES,
  DEFAULT_LANGUAGE
} from "../data/constants";


export const getHumanReadableRelativeDate = (date: Date): string => {
  return ago(date);
};

export const getHumanReadableRelativeDateIntl = (date: Date): string => {
  const rtf = new Intl.RelativeTimeFormat(localStorage.getItem('system_language') ?? DEFAULT_LANGUAGE, { style: "long" });	
  const now = new Date();
  const diff = now - date; // Difference in milliseconds
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  
  if (seconds < 60) return rtf.format(-seconds, 'seconds'); 
  if (minutes < 60) return rtf.format(-minutes, 'minutes'); 
  if (hours < 24) return rtf.format(-hours, 'hours'); 
  return rtf.format(-days, 'days'); 
};

export const getLocaleDateTimeString = (date: Date | undefined): string => {
  return date
    ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    : "";
};

export const getUserFriendlyApiErrorMessage = (error: any): string => {
  const { t } = useTranslation()
  try {
    let message = "";
    if (
      error instanceof AxiosError &&
      error.response &&
      Object.prototype.hasOwnProperty.call(error.response, "data")
    ) {
      if (Object.prototype.hasOwnProperty.call(error.response.data, "title")) {
        message += error.response.data.title;
      }
      if (Object.prototype.hasOwnProperty.call(error.response.data, "detail")) {
        message += message === "" ? "" : " ";
        switch (error.response.data.detail) {
          case "Failed":
          case "NotAllowed":
            message += `(Incorrect credentials or email is not confirmed)`;
            break;
          default:
            message += `(Email address is locked out for ${ACCOUNT_LOCK_OUT_TIME_IN_MINUTES} minutes
              after ${ACCOUNT_MAX_FAILED_ATTEMPTS_TO_SIGN_IN} failed attempts to sign in)`;
            break;
        }
      }
      if (Object.prototype.hasOwnProperty.call(error.response.data, "errors")) {
        message += message === "" ? "" : "\n";
        message += JSON.stringify(error.response.data.errors);
      }
      message = message === "" ? error.response.data : message;
    }
    message = message === "" ? error.message : message;
    return message;
  } catch {
    return "Unknown error occurred.";
  }
};

export const getLoaderName = (
  request: InternalAxiosRequestConfig<any>
): string => {
  const parametersStartIndex = request.url?.indexOf("?");
  return parametersStartIndex && parametersStartIndex > 0
    ? `${request.method}_${request.url?.substring(0, request.url.indexOf("?"))}`
    : `${request.method}_${request.url}`;
};
