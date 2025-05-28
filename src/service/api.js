import { storage } from "../utils/storage";

export const fetchAPI = async (url, options = {}) => {
    const token = storage.getToken();
    // const token = "0sR9LVku4o9ihw49THBp";
    console.log(token);
    
    const { headers: customHeaders = {}, ...restOptions } = options;

    const headers = new Headers({
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...customHeaders
    });

    try {
        const response = await fetch(url, {
            ...restOptions,
            headers,
            // credentials: "include",
        });

        if (!response.ok) {
            const text = await response.text().catch(() => "");
            throw new Error(
                `Request failed ${response.status} ${response.statusText}${text ? ": " + text : ""}`
            );
        }

        return response;
    } catch (err) {
        throw new Error(err.message || "Network error occurred");
    }
};