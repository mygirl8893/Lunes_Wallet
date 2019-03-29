import { put, call } from "redux-saga/effects";
import { internalServerError } from "../../errors/statusCodeMessage";

// SERVICES
import DepositService from "../../../services/depositService";

// UTILS
import { getAuthToken } from "../../../utils/localStorage";

const depositService = new DepositService();

export function* getPackagesSaga() {
  try {
    yield put({
      type: "SET_LOADING_DEPOSIT",
      loading: true
    });
    let token = yield call(getAuthToken);
    let response = yield call(depositService.getPackages, token);    
    yield put({
      type: "GET_PACKAGES_REDUCER",
      packages: response
    });
  } catch (error) {
    yield put(internalServerError());    
  }
  yield put({
    type: "SET_LOADING_DEPOSIT",
    loading: false
  });
}

export function* getDepositHistorySaga() {
  try {
    let token = yield call(getAuthToken);
    let response = yield call(depositService.getDepositHistory, token);

    if (response.status !== 200) return yield put(internalServerError());

    yield put({
      type: "GET_HISTORY_DEPOSIT_REDUCER",
      history: response.data
    });
  } catch (error) {
    yield put(internalServerError());
  }
}