import React from "react";
import PropTypes from "prop-types";

// REDUX
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {setModalStep} from "./redux/rechargeAction";

// UTILS
import i18n from "../../utils/i18n";

// COMPONENTS
import Modal from "../../components/modal";
import RechargeModal from "./modal/rechargeModal";
import Tabs from "../../components/tabs";
import Invoice from "./invoice";
import History from "./history";
import Favorite from "./favorite";

import Select from "../../components/select";

// MATERIAL
import { Grid, Input, InputAdornment } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

// STYLE
import style from "./style.css";

class Recharge extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    }
  }
  handleModal = () => this.setState({ isOpen: !this.state.isOpen });

  closeModal(){
    const {setModalStep} = this.props;
    this.handleModal();
    setModalStep(1);
  }

  render() {
    let { isOpen } = this.state;

    const {modalStep, setModalStep} = this.props;

    const titles = ["Nova recarga", "Histórico"];
    const contents = [<Invoice openModal={this.handleModal} key={1} />, <History key={2} />]

    return (
      <div>
        <div className={style.header}>
          <h1>Lunes Recarga Online</h1>
          <p>Recarregue qualquer número e pague com criptomoedas</p>
        </div>

        <Tabs tabTitles={titles} tabContents={contents} justify="center" />

        <Modal
          title={"Recarga de Celular"}
          content={<RechargeModal />}
          show={isOpen}
          close={
            modalStep === 5 || modalStep === 1 ? ()=>this.closeModal() : null
          }
          back={
            modalStep === 2 || modalStep === 3 || modalStep === 4 ? () => setModalStep(modalStep-1) : null
          }
        />
      </div>
    );
  }
}

Recharge.propTypes = {
  modalStep: PropTypes.number.isRequired,
  setModalStep: PropTypes.func.isRequired
}

const mapStateToProps = store => ({
  modalStep: store.recharge.modalStep, 
});

const mapDispatchToProps = dispatch =>bindActionCreators(
  {
    setModalStep
  },
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recharge);
