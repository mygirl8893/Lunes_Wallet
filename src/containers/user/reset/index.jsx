import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { clearMessage } from "../../errors/redux/errorAction";
// COMPONENTS
import Footer from "../footer";
import ResetUser from "./resetUser";
import Email from "./emailMessage";

// STYLE
import style from "../style.css";

class Reset extends React.Component {
  renderContent = () => {
    let { reset } = this.props.user.pages;
    if (reset === 0) return <ResetUser />;
    if (reset === 1) return <Email />;
  };
  componentDidMount() {
    let { clearMessage } = this.props;
    clearMessage();
  }
  render() {
    return (
      <div className={style.contGeneral}>
        {this.renderContent()}
        <Footer />
      </div>
    );
  }
}

Reset.propTypes = {
  user: PropTypes.object,
  clearMessage:PropTypes.func
};

const mapSateToProps = store => ({
  user: store.user
});

const mapDispatchToProps = dispatch => bindActionCreators({clearMessage}, dispatch);

export default connect(
  mapSateToProps,
  mapDispatchToProps
)(Reset);
