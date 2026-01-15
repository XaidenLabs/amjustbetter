'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './axios';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Hydrate state from localStorage on mount
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            checkAuth(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const checkAuth = async (currentToken: string) => {
        try {
            const response = await api.get('/user');
            setUser(response.data);
        } catch (error) {
            console.error("Auth check failed", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);

        // Redirect based on role
        if (newUser.role === 'admin') {
            router.push('/dashboard/admin');
        } else {
            router.push('/dashboard/user');
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            // ignore error on logout
        }
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading, checkAuth: () => token ? checkAuth(token) : Promise.resolve() }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
