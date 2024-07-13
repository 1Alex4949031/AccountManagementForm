import {defineStore} from 'pinia';

export interface Account {
    label: string;
    type: string;
    login: string;
    password: string | null;
    labels: {
        text: string
    }[];
}

export const useAccountStore = defineStore('accountStore', {
    state: () => ({
        accounts: [] as Account[]
    }),
    actions: {
        addAccount() {
            this.accounts.push({
                label: '',
                type: 'LDAP',
                login: '',
                password: null,
                labels: []
            });
        },
        updateAccount(index: number, account: Account) {
            this.accounts[index] = account;
        },
        removeAccount(index: number) {
            this.accounts.splice(index, 1);
        }
    },
    persist: true
});
