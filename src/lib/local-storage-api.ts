// src/lib/local-storage-api.ts
/**
 * @fileoverview
 * Este archivo centraliza toda la lógica para interactuar con localStorage,
 * simulando una API de backend para la gestión de datos de la aplicación.
 */

import type { Product, Quote, PosSale, PosCustomer, ClosingRecord } from './types';
import { initialProducts } from './dummy-data';
import posCustomersData from '@/data/pos_customers.json';
import usersData from '@/data/users.json';
import { type User } from '@/context/auth-context';


// --- Claves de Almacenamiento ---
const PRODUCTS_KEY = 'crud_products';
const USERS_KEY = 'registered_users';
const QUOTES_KEY = 'saved_quotes';
const POS_CUSTOMERS_KEY = 'pos_customers';
const POS_SALES_KEY = 'pos_sales';
const SETTLED_COMMISSIONS_KEY = 'settled_commissions';
const CLOSING_HISTORY_KEY = 'pos_closing_history';


// --- Funciones Genéricas ---

/**
 * Carga datos desde localStorage. Si no existen, los inicializa con datos por defecto.
 * @param key La clave de localStorage.
 * @param defaultData Los datos por defecto para inicializar si no hay nada.
 * @returns Los datos cargados o inicializados.
 */
function loadData<T>(key: string, defaultData: T[] = []): T[] {
    if (typeof window === 'undefined') return defaultData;
    try {
        const storedData = localStorage.getItem(key);
        if (storedData) {
            return JSON.parse(storedData);
        } else {
            localStorage.setItem(key, JSON.stringify(defaultData));
            return defaultData;
        }
    } catch (error) {
        console.error(`Error cargando datos desde localStorage con clave ${key}:`, error);
        return defaultData;
    }
}

/**
 * Guarda datos en localStorage.
 * @param key La clave de localStorage.
 * @param data Los datos a guardar.
 */
function saveData<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error guardando datos en localStorage con clave ${key}:`, error);
    }
}

// --- API de Productos ---
export const getProductsApi = (): Product[] => loadData<Product>(PRODUCTS_KEY, initialProducts);
export const saveProductsApi = (products: Product[]): void => saveData<Product>(PRODUCTS_KEY, products);

// --- API de Usuarios del Sistema ---
export const getUsersApi = (): User[] => loadData<User>(USERS_KEY, usersData as User[]);
export const saveUsersApi = (users: User[]): void => saveData<User>(USERS_KEY, users);

// --- API de Cotizaciones ---
export const getQuotesApi = (): Quote[] => loadData<Quote>(QUOTES_KEY);
export const saveQuotesApi = (quotes: Quote[]): void => saveData<Quote>(QUOTES_KEY, quotes);

// --- API de Clientes POS ---
export const getPosCustomersApi = (): PosCustomer[] => loadData<PosCustomer>(POS_CUSTOMERS_KEY, posCustomersData);
export const savePosCustomersApi = (customers: PosCustomer[]): void => saveData<PosCustomer>(POS_CUSTOMERS_KEY, customers);

// --- API de Ventas POS ---
export const getPosSalesApi = (): PosSale[] => loadData<PosSale>(POS_SALES_KEY);
export const savePosSalesApi = (sales: PosSale[]): void => saveData<PosSale>(POS_SALES_KEY, sales);

// --- API de Comisiones Liquidadas ---
export const getSettledCommissionsApi = (): string[] => loadData<string>(SETTLED_COMMISSIONS_KEY);
export const saveSettledCommissionsApi = (ids: string[]): void => saveData<string>(SETTLED_COMMISSIONS_KEY, ids);

// --- API de Historial de Cierres ---
export const getClosingHistoryApi = (): ClosingRecord[] => loadData<ClosingRecord>(CLOSING_HISTORY_KEY);
export const saveClosingHistoryApi = (records: ClosingRecord[]): void => saveData<ClosingRecord>(CLOSING_HISTORY_KEY, records);