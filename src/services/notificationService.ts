import axios from "axios";
import {BookSubscription} from "./bookPriceSubscriptionService.ts";

const BASE_URL = 'http://localhost:8080/notifications';

export interface PriceNotification {
    id: number;
    notificationType: NotificationType;
    bookSubscription: BookSubscription;
    oldPrice?: number;
    newPrice: number;
    priceDifference?: number;
    message?: string;
    isRead: boolean;
    createdAt: string;
    readAt?: string;
}

export interface BookSubscription {
    id: number;
    title: string;
}

export enum NotificationType {
    PRICE_DROP = "PRICE_DROP",
    PRICE_RISE = "PRICE_RISE",
    TARGET_REACHED = "TARGET_REACHED",
    FIRST_CHECK = "FIRST_CHECK"
}
export const getNotifications = async () => {
    const headers = {withCredentials: true};

    const response = await axios.get(`${BASE_URL}`, headers);
    return response.data;
};

export const markNotificationAsRead = async (notificationId : number) => {
    const headers = {withCredentials: true};

    const response = await axios.post(`${BASE_URL}/read/${notificationId}`, {}, headers);
    return response.data;
};

export const deleteNotification = async (notificationId : number) => {
    const headers = {withCredentials: true};

    const response = await axios.delete(`${BASE_URL}/${notificationId}`, headers);
    return response.data;
};

export const markAllNotificationAsRead = async () => {
    const headers = {withCredentials: true};

    const response = await axios.post(`${BASE_URL}/read/all`, {}, headers);
    return response.data;
};
