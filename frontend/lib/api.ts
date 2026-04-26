const API_URL = 'https://educacionenlinea-production.up.railway.app';

const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// GET request
export async function apiGet(endpoint: string) {
    const token = getToken();
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        },
    });
    return res.json();
}

// POST request (JSON)
export async function apiPost(endpoint: string, data: any) {
    const token = getToken();
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

// PUT request (JSON)
export async function apiPut(endpoint: string, data: any) {
    const token = getToken();
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

// DELETE request
export async function apiDelete(endpoint: string) {
    const token = getToken();
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
    });
    return res.json();
}

// POST con FormData (para archivos)
export async function apiPostFormData(endpoint: string, formData: FormData) {
    const token = getToken();
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
    });
    return res.json();
}

// PUT con FormData (para archivos)
export async function apiPutFormData(endpoint: string, formData: FormData) {
    const token = getToken();
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
        },
        body: formData,
    });
    return res.json();
}