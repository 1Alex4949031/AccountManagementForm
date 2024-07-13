<script setup lang="ts">
import eye from '../assets/eye.svg';
import eyeSlash from '../assets/eye-slash.svg';
import {reactive, ref} from 'vue';
import {Account, useAccountStore} from '../stores/accountStore';

const store = useAccountStore();
const accounts = ref(store.accounts);
const passwordVisibility = reactive<boolean[]>([]);
const errors = reactive<Record<number, any>>({});

const validateAndSave = (index: number) => {
  const account = accounts.value[index];
  errors[index] = {};

  if (!account.login || account.login.length > 100) {
    errors[index].login = true;
  }

  if (account.label && account.label.length > 50) {
    errors[index].label = true;
  }

  if (account.type === 'Локальная' && (!account.password || account.password.length > 100)) {
    errors[index].password = true;
  }

  if (!errors[index].login && !errors[index].label && !errors[index].password) {
    account.labels = account.label ? account.label.split(';').map((text) => ({text: text.trim()})) : [];
    store.updateAccount(index, account);
  }
};

const addAccount = () => {
  store.addAccount();
  passwordVisibility.push(false);
};

const removeAccount = (index: number) => {
  store.removeAccount(index);
  passwordVisibility.splice(index, 1);
  delete errors[index];
};

const togglePasswordVisibility = (index: number) => {
  passwordVisibility[index] = !passwordVisibility[index];
};

const checkAccountType = (account: Account) => {
  if (account.type === 'LDAP') {
    account.password = null;
  }
  return account.type === 'Локальная';
};
</script>

<template>
  <div class="container mt-4 mb-2">
    <h1>Управление учетными записями</h1>
    <button class="btn btn-primary mb-3" @click="addAccount">Добавить учетную запись</button>
    <div class="alert alert-info" role="alert">
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
    </div>
    <div v-for="(account, index) in accounts" :key="index" class="account-card mb-3 p-3 border rounded">
      <div class="row">
        <div class="form-group col-12 col-md-12 col-lg-3">
          <label>Метка</label>
          <input
              type="text"
              v-model="account.label"
              @blur="validateAndSave(index)"
              class="form-control"
              placeholder="Введите метку"
              :class="{ 'is-invalid': errors[index] && errors[index].label }"
          />
          <div class="invalid-feedback">
            Метка не должна превышать 50 символов.
          </div>
        </div>
        <div class="form-group col-12 col-md-12 col-lg-3">
          <label>Тип записи</label>
          <select
              v-model="account.type"
              @change="validateAndSave(index)"
              class="form-control"
              :class="{ 'is-invalid': errors[index] && errors[index].type }"
          >
            <option value="LDAP">LDAP</option>
            <option value="Локальная">Локальная</option>
          </select>
        </div>
        <div class="form-group col-12 col-md-12 col-lg-3">
          <label>Логин</label>
          <input
              type="text"
              v-model="account.login"
              @blur="validateAndSave(index)"
              class="form-control"
              placeholder="Введите логин"
              :class="{ 'is-invalid': errors[index] && errors[index].login }"
          />
          <div class="invalid-feedback">
            Логин обязателен и не должен превышать 100 символов.
          </div>
        </div>
        <div class="form-group col-12 col-md-12 col-lg-3" v-if="checkAccountType(account)">
          <label>Пароль</label>
          <div class="input-group">
            <input
                :type="passwordVisibility[index] ? 'text' : 'password'"
                v-model="account.password"
                class="form-control"
                @blur="validateAndSave(index)"
                placeholder="Введите пароль"
                :class="{ 'is-invalid': errors[index] && errors[index].password }"
            />
            <div class="input-group-append">
              <button
                  class="btn btn-outline-light visible-password-btn d-flex align-items-center justify-content-center"
                  type="button"
                  @click="togglePasswordVisibility(index)"
              >
                <img v-if="passwordVisibility[index]" :src="eye" alt="Visible password" class="visibility-icon"/>
                <img v-else :src="eyeSlash" alt="Not visible password" class="visibility-icon"/>
              </button>
            </div>
          </div>
          <div class="invalid-feedback">
            Пароль обязателен и не должен превышать 100 символов.
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <div class="ms-auto">
            <button class="btn btn-danger remove-btn" @click="removeAccount(index)">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.container {
  margin: auto;
}

.alert {
  background-color: #f8f9fa;
  border-color: #dae0e5;
  color: #495057;
}

.account-card {
  background-color: #ffffff;
}

.form-group {
  margin-bottom: 10px;
  padding-right: 15px;
  padding-left: 15px;
}

.form-control {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 0.375rem 0.75rem;
}

.input-group-append .btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.invalid-feedback {
  display: none;
  color: #dc3545;
}

.form-control.is-invalid ~ .invalid-feedback {
  display: block;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.input-group .form-control {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.visibility-icon {
  width: 24px;
  height: 24px;
}
</style>
