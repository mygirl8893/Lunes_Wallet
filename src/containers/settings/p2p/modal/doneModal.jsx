import React from "react";

// STYLE
import style from "./style.css";

class DoneModal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={style.modalBox}>
        <img
          src={"/images/icons/confirm/confirm.png"}
          className={style.iconInfor}
        />
        <div className={style.totalConfirm}>
          <span>{"Você acabou de debitar um boleto"}</span>
          <span>{"no valor de R$ 30,00 em sua Wallet Lunes"}</span>
        </div>

        <div className={style.confirmFee}>
          <div>
            {
              "Você pode visualizar a transação em sua aba “Históricos” desse boleto."
            }
          </div>
        </div>
      </div>
    );
  }
}

export default DoneModal;
