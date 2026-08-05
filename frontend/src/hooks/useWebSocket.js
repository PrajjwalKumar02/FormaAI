import { useState, useEffect, useCallback, useRef } from 'react';

export const useWebSocket = (url, options = {}) => {
    const {
        autoConnect = true,
        onMessage = null,
        onOpen = null,
        onClose = null,
        onError = null,
        reconnectAttempts = 5,
        reconnectInterval = 3000
    } = options;

    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);
    const reconnectCountRef = useRef(0);
    const reconnectTimerRef = useRef(null);

    const connect = useCallback(() => {
        try {
            wsRef.current = new WebSocket(url);
            
            wsRef.current.onopen = () => {
                setIsConnected(true);
                setError(null);
                reconnectCountRef.current = 0;
                if (onOpen) onOpen();
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setLastMessage(data);
                    if (onMessage) onMessage(data);
                } catch (err) {
                    setLastMessage(event.data);
                    if (onMessage) onMessage(event.data);
                }
            };

            wsRef.current.onclose = (event) => {
                setIsConnected(false);
                if (onClose) onClose(event);
                
                // Auto reconnect
                if (reconnectCountRef.current < reconnectAttempts) {
                    reconnectTimerRef.current = setTimeout(() => {
                        reconnectCountRef.current += 1;
                        connect();
                    }, reconnectInterval);
                }
            };

            wsRef.current.onerror = (event) => {
                setError(event);
                if (onError) onError(event);
            };
        } catch (err) {
            setError(err);
            if (onError) onError(err);
        }
    }, [url, onOpen, onMessage, onClose, onError, reconnectAttempts, reconnectInterval]);

    const disconnect = useCallback(() => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        
        setIsConnected(false);
    }, []);

    const sendMessage = useCallback((data) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const message = typeof data === 'string' ? data : JSON.stringify(data);
            wsRef.current.send(message);
            return true;
        }
        return false;
    }, []);

    // Auto connect on mount
    useEffect(() => {
        if (autoConnect) {
            connect();
        }
        
        return () => {
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);

    return {
        isConnected,
        lastMessage,
        error,
        connect,
        disconnect,
        sendMessage,
        reconnectCount: reconnectCountRef.current
    };
};