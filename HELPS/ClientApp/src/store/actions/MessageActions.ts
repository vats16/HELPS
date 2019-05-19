import { Dispatch } from 'redux';
import { Message } from '../../types/model/Message';
import { MessageActionTypes, MessageAction } from '../../types/store/MessageActionTypes';
import { fetchToken, NO_TOKEN_MESSAGE, fetchWithAuthHeader } from './AuthActions';
import { fetchRequest } from '../../util';

const receiveMessages = (messages: Message[]): MessageAction => ({
    type: MessageActionTypes.RECEIVE_MESSAGES,
    messages: messages
}),
    messageError = (error: string) => ({
        type: MessageActionTypes.ERROR,
        payload: error
    }),
    MESSAGES_PATH = 'api/messages',
    selectMessagePayload = (message: Message) => ({
        type: MessageActionTypes.SELECT_MESSAGE,
        message
    }),
    editMessagePayload = (message: Message) => ({
        type: MessageActionTypes.EDIT_MESSAGE,
        message
    }),
    cancelOrCommenceEditPayload = () => ({ type: MessageActionTypes.CANCEL_OR_COMMENCE_EDIT_MESSAGE }),
    saveMessagePayload = (message: Message) => ({
        type: MessageActionTypes.SAVE_MESSAGE,
        message
    });

export const fetchMessages = () => async (dispatch: Dispatch<any>) => {
    const token = fetchToken();
    if (token === null) {
        dispatch(messageError(NO_TOKEN_MESSAGE));
    } else {
        try {
            const messages: MessageModel[] = await fetchRequest(
                MESSAGES_PATH,
                'GET',
                token
            );
            dispatch(receiveMessages(messages));
        } catch (e) {
            dispatch(messageError(`Error fetching messges list`));
        }
    }
};

export const saveMessage = (messageId: number, message: MessageModel, isNewMode: boolean) => async (dispatch: Dispatch<any>) => {
    const token = fetchToken();
    if (token === null) {
        dispatch(messageError(NO_TOKEN_MESSAGE));
    } else {
        try {
            if (isNewMode) {
                await fetchRequest(
                    MESSAGES_PATH,
                    'POST',
                    token,
                    message,
                    true
                );
            } else {
                await fetchRequest(
                    `${MESSAGES_PATH}/${messageId}`,
                    'PUT',
                    token,
                    message,
                    true
                );
            }
        } catch (e) {
            dispatch(messageError('Failed to save message'));
        }
    }
};

export const deleteMessage = (id: number) => async (dispatch: Dispatch<any>) => {
    const token = fetchToken();
    if (token === null) {
        dispatch(messageError(NO_TOKEN_MESSAGE));
    } else {
        const deleteResponse: Response = await fetch(`${MESSAGES_PATH}/${id}`, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': `Bearer ${token}`
            })
        });
        if (deleteResponse.ok) {
            alert('Message deleted successfully');
            fetchMessages();
        } else {
            const errorMessage = await deleteResponse.text();
            dispatch(messageError(`Failed to delete message: ${errorMessage}`));
        }
    }
};

export const selectMessage = (message: Message) => async (dispatch: Dispatch<any>) =>
    dispatch(selectMessagePayload(message));

export const editMessage = (message: Message) => async (dispatch: Dispatch<any>) =>
    dispatch(editMessagePayload(message));

export const cancelOrCommenceEdit = () => async (dispatch: Dispatch<any>) =>
    dispatch(cancelOrCommenceEditPayload());