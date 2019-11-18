import { NOTIFICATION } from '../types';

const initialState = {
    // Used for displaying number of notifs
    refreshCounter: 1,
    notificationCount: 0,
    notifications: [],
    popupNotifications: []
}

export default function(state = initialState, action) {

    switch (action.type) {
        case NOTIFICATION.set:
            return {
                ...state,
                notifications: action.payload
            }
        case NOTIFICATION.add:
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    ...action.payload
                ]
            }

        case NOTIFICATION.setCount:
            if (typeof action.payload === 'number') {
                return {
                    ...state,
                    notificationCount: action.payload
                }
            }
        case NOTIFICATION.addCount:
            const newCount = state.notificationCount + action.payload >= 0
                ? state.notificationCount + action.payload
                : 0;
            return {
                ...state,
                notificationCount: newCount
            }
        case NOTIFICATION.refresh:
            return {
                ...state,
                refreshCounter: state.refreshCounter + 1
            }
        case NOTIFICATION.clear:
            return {...initialState}

        case NOTIFICATION.popup.remove:
            let popupNotifications = [...state.popupNotifications];
            popupNotifications.splice(action.payload, 1);
            return {
                ...state,
                popupNotifications
            }
        case NOTIFICATION.popup.add:
            return {
                ...state,
                popupNotifications: [
                    ...state.popupNotifications,
                    action.payload
                ]
            }
        
        case NOTIFICATION.popup.clear:
            return {
                ...state,
                popupNotifications: []
            }

        default:
            return state;
    }

}