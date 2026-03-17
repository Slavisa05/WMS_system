import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

// Mutex: samo jedan refresh poziv odjednom
let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
    (response) => response,
    
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/token/')) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                localStorage.clear();
                window.location.href = '/login'
                return Promise.reject(error);
            }

            try {
                if (!refreshPromise) {
                    refreshPromise = axios
                        .post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken })
                        .then(res => {
                            localStorage.setItem('access_token', res.data.access);
                            if (res.data.refresh) {
                                localStorage.setItem('refresh_token', res.data.refresh);
                            }
                            return res.data.access as string;
                        })
                        .finally(() => { refreshPromise = null; });
                }

                const newToken = await refreshPromise;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
)

export default api