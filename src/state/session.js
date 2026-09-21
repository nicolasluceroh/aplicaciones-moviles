// Sesión simulada del donante.
//
// El usuario se guarda acá, fuera de las pantallas, para que no se pierda al
// navegar entre Cuenta y Donaciones. No persiste si se cierra la aplicación.
// Nicolás reemplazará este módulo al conectar Supabase Auth.

let currentUser = null;
const listeners = new Set();

const notify = () => {
  listeners.forEach((listener) => listener(currentUser));
};

export const getUser = () => currentUser;

export const login = (user) => {
  currentUser = user;
  notify();
};

export const logout = () => {
  currentUser = null;
  notify();
};

// Devuelve la función para cancelar la suscripción.
export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
