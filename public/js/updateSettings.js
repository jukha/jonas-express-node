/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const BASE_URL = '/api/v1';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {

  try {
    const url =
      type === 'password'
        ? `${BASE_URL}/users/updateMyPassword`
        : `${BASE_URL}/users/updateMe`;
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (error) {
    showAlert('error', error.response.message);
  }
};
