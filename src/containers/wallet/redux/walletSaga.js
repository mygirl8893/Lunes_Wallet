import { put, call } from "redux-saga/effects";
import { internalServerError } from "../../../containers/errors/statusCodeMessage";

// Services
import CoinService from "../../../services/coinService";
const coinService = new CoinService();

export function* validateAddress(action) {
  try {
    let response = yield call(
      coinService.validateAddress,
      action.coin,
      action.address
    );

    if (!response.error) {
      yield put({
        type: "SET_WALLET_MODAL_ADDRESS",
        address: action.address
      });

      yield put({
        type: "SET_WALLET_MODAL_STEP",
        step: 1
      });

      return;
    }

    yield put(response.error);

    yield put({
      type: "SET_WALLET_MODAL_LOADING"
    });

    return;
  } catch (error) {
    yield put({ type: "CHANGE_WALLET_ERROR_STATE", state: true });
    yield put(internalServerError());
  }
}

export function* getWalletCoinHistory(action) {
  try {
    let response = yield call(
      coinService.getCoinHistory,
      action.coin,
      action.address
    );

    console.warn(response);

    return;
  } catch (error) {
    yield put({ type: "CHANGE_WALLET_ERROR_STATE", state: true });
    yield put(internalServerError());
  }
}
