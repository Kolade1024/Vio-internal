import { jwtDecode } from 'jwt-decode';

const getTenantId = () => {
	return localStorage.getItem('tenantId') || '';
};

const getUserRole = () => {
	return localStorage.getItem('roles') || '';
};

const getUser = () => {
	return JSON.parse(localStorage.getItem('user') || '{}');
};

const setUser = (profile: any) => {
	localStorage.setItem('user', JSON.stringify(profile));
};

const setToken = (token: string) => {
	window.localStorage.setItem('token', token);
};

const setRefreshToken = (token: string) => {
	window.localStorage.setItem('refreshToken', token);
};

const getToken = () => {
	if (typeof window !== 'undefined') {
		return window.localStorage.getItem('token');
	}
};

const getRefreshToken = () => {
	return window.localStorage.getItem('refresh-token');
};

const getDecodedJwt = () => {
	try {
		const token = getToken();
		return jwtDecode(token!);
	} catch (e) {
		return {};
	}
};

const logOut = () => {
	window.localStorage.clear();
	window.location.replace('/login');
};

const isAuthenticated = () => {
	try {
		const decodedToken = getDecodedJwt();

		const { exp } = decodedToken;
		const currentTime = Date.now() / 1000;

    exp! > currentTime;
		return getToken() != null;
	} catch (e) {
		return false;
	}
};

const Auth = {
	isAuthenticated,
	getDecodedJwt,
	setToken,
	setUser,
    getTenantId,
    getUserRole,
    getUser,
	getToken,
	setRefreshToken,
	getRefreshToken,
	logOut,
};

export default Auth;