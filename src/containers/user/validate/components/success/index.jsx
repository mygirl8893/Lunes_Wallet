import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// UTILS
import i18n from "../../../../../utils/i18n";

// STYLE
import style from "./style.css";

class EmailSuccess extends React.Component {
  render() {
    return (
      <div className={style.baseMessage}>
        <img
          src="../../images/icons/confirm/confirm@2x.png"
          className={style.icon}
        />
        <p className={style.messageSuccess}>
          {i18n.t("SETTINGS_USER_EMAIL_VERIFIED")}
        </p>
        <Link to="/wallet">
          <button className={style.buttonLogin}>{i18n.t("BTN_LOGIN")}</button>
        </Link>
      </div>
    );
  }
}

EmailSuccess.propTypes = {};

const mapSateToProps = store => ({});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapSateToProps,
  mapDispatchToProps
)(EmailSuccess);
