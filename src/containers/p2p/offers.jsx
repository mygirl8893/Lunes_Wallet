import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getMyOrders,
  getHistory,
  getFilter,
  clearCancel
} from "./redux/p2pAction";

// MATERIA UI
import { Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

// STYLE
import style from "./style.css";
import colors from "../../components/bases/colors";

// COMPONENTS
import CardOffer from "./components/cardOffer";
import Select from "../../components/select";
import Loading from "../../components/loading";
import Tabs from "../../components/tabs";

// UTILS
import i18n from "../../utils/i18n";

const inputStyle = {
  root: {
    color: colors.messages.info,
    padding: "5px",
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
    borderRadius: "6px",
    border: "solid 1px #654fa4",
    fontSize: "11px",
    height: "20px",
    maxHeight: "20px",
    backgroundImage: "url(images/icons/p2p/search.png)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "95% center",
    backgroundColor: colors.purple.default,
    "&:hover:before": {
      borderBottom: "none"
    }
  },
  cssInput: {
    fontFamily: "Noto Sans, sans-serif",
    fontSize: "12px",
    letterSpacing: "0.5px"
  },
  cssUnderline: {
    "&:before, &:after": {
      borderBottom: "none"
    },
    "&:hover:not($disabled):not($error):not($focused):before": {
      borderBottom: "none"
    }
  },
  disabled: {},
  error: {},
  focused: {}
};
class Offers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabGiving: true,
      tabDone: false,
      tabCanceled: false,
      coinSelect: {
        name: "Lunes",
        value: "lunes",
        img: "images/icons/coins/lunes.png"
      },
      listTypeP2P: [
        { title: "Escrow", value: undefined, img: undefined },
        { title: "P2P", value: undefined, img: undefined }
      ],
      listTypeFilter: [
        { title: "Todos", value: undefined, img: undefined },
        { title: "Meus", value: undefined, img: undefined }
      ],
      myOrders: false,
      typeP2P: "Escrow",
      typeFilter: "Todos"
    };

    this.filterMyOrders = this.filterMyOrders.bind(this);
  }

  coinSelected = (value, title, img = undefined) => {
    this.setState({
      ...this.state,
      coinSelect: {
        name: title,
        value,
        img
      }
    });

    this.filterMyOrders(false);
  };

  clearCancel = () => {
    const { clearCancel, getFilter } = this.props;
    const { coinSelect } = this.state;

    clearCancel();

    getFilter(coinSelect.value, "p2p", "");
  };

  onChangeTab(status) {
    if (status == 1) {
      this.setState({
        ...this.state,
        tabGiving: true,
        tabDone: false,
        tabCanceled: false
      });
    } else if (status == 2) {
      this.setState({
        ...this.state,
        tabGiving: false,
        tabDone: true,
        tabCanceled: false
      });
    } else {
      this.setState({
        ...this.state,
        tabGiving: false,
        tabDone: false,
        tabCanceled: true
      });
    }

    this.filterMyOrders(false);
  }

  componentDidMount = () => {
    const { getFilter, getHistory, type } = this.props;
    const { coinSelect } = this.state;

    if (type === "myhistory") {
      getHistory(coinSelect.value);
    } else {
      getFilter(coinSelect.value, "p2p", "");
    }
  };

  renderOders = () => {
    const { orders, loading, type } = this.props;
    const { tabGiving, tabDone, tabCanceled } = this.state;
    if (loading) return <Loading color="lunes" margin={"50% 0% 0% 0%"} />;

    if (orders.length <= 0)
      return (
        <div className={style.noOrder}>
          <h1>{i18n.t("P2P_NO_ORDER")}</h1>
        </div>
      );
    if (type == "myhistory") {
      return orders.map((val, key) => {
        if (tabGiving && val.status == "confirmed") {
          return <CardOffer key={key} order={val} />;
        }

        if (tabDone && val.status == "confirmed") {
          return <CardOffer key={key} order={val} />;
        }

        if (tabCanceled && val.status === "canceled") {
          console.warn(val.status);
          return <CardOffer key={key} order={val} />;
        }
      });
    }
    return orders.map((val, key) => {
      return <CardOffer key={key} order={val} type={type} />;
    });
  };

  filterMyOrders = filtermyorder => {
    const { getFilter, getMyOrders, getHistory, type } = this.props;
    const { coinSelect, myOrders } = this.state;

    if (myOrders == false && type != "myhistory") {
      getMyOrders(coinSelect.value);
    } else if (type == "myhistory") {
      getHistory(coinSelect.value);
    } else {
      getFilter(coinSelect.value, "p2p", "");
    }

    if (filtermyorder) {
      this.setState({
        ...this.state,
        myOrders: !myOrders
      });
    }
  };

  renderFilters = () => {
    const { type } = this.props;
    const { tabGiving, tabDone, tabCanceled } = this.state;

    if (type === "myhistory") {
      return (
        <div className={style.tabContent}>
          <div
            className={!tabGiving ? style.itemTab : style.itemTabActive}
            onClick={() => this.onChangeTab(1)}
          >
            {i18n.t("P2P_STATUS_TEXT_1")}
          </div>
          <div
            className={!tabDone ? style.itemTab : style.itemTabActive}
            onClick={() => this.onChangeTab(2)}
          >
            {i18n.t("P2P_STATUS_TEXT_2")}
          </div>
          <div
            className={!tabCanceled ? style.itemTab : style.itemTabActive}
            onClick={() => this.onChangeTab(3)}
          >
            {i18n.t("P2P_STATUS_TEXT_3")}
          </div>
        </div>
      );
    }
    return;
  };
  selectTypeP2P = (value, title) => {
    this.setState({
      ...this.state,
      typeP2P: title
    });
  };
  selectTypeFilter = (value, title) => {
    this.filterMyOrders(true);

    this.setState({
      ...this.state,
      typeFilter: title
    });
  };

  renderMenu = () => {
    const { type, coinsEnabled } = this.props;
    const {
      coinSelect,
      listTypeP2P,
      listTypeFilter,
      typeP2P,
      typeFilter
    } = this.state;
    const titles = [i18n.t("P2P_TAB_PURCHASE"), i18n.t("P2P_TAB_SALE")];

    return type !== "myhistory" ? (
      <Grid className={style.headerActionFilter} container>
        <Grid item xs={3} style={{ textAlign: "center" }}>
          <Select
            list={coinsEnabled}
            titleImg={coinSelect.img}
            selectItem={this.coinSelected}
            error={null}
            width={"75%"}
          />
        </Grid>
        <Grid item xs={3} style={{ textAlign: "center" }}>
          <Select
            list={listTypeFilter}
            title={typeFilter}
            selectItem={this.selectTypeFilter}
            error={null}
            width={"80%"}
          />
        </Grid>
        <Grid item xs={3} style={{ textAlign: "center" }}>
          <Select
            list={listTypeP2P}
            title={typeP2P}
            selectItem={this.selectTypeP2P}
            error={null}
            width={"80%"}
          />
        </Grid>
        <Grid item xs={3} style={{ marginTop: "10px", textAlign: "center" }}>
          <a href="#">
            <img src="/images/icons/recharge/ic_instrucoes.png" alt={""} />
          </a>
        </Grid>
      </Grid>
    ) : (
      <Grid container>
        <Tabs tabTitles={titles} tabContents={[]} justify="center" />
      </Grid>
    );
  };
  render() {
    const { cancelDone } = this.props;

    if (cancelDone)
      return (
        <div>
          <span className={style.textSuccess}>Cancel done!</span>
          <button className={style.buttonEnable} onClick={this.clearCancel}>
            {i18n.t("P2P_TEXT_2")}
          </button>
        </div>
      );

    return (
      <div>
        {this.renderMenu()}
        {this.renderFilters()}
        <div className={style.content}>{this.renderOders()}</div>
      </div>
    );
  }
}

Offers.propTypes = {
  classes: PropTypes.object.isRequired,
  coinsEnabled: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    .isRequired,
  orders: PropTypes.array.isRequired,
  getFilter: PropTypes.func,
  getMyOrders: PropTypes.func,
  getHistory: PropTypes.func,
  loading: PropTypes.bool,
  type: PropTypes.string,
  clearCancel: PropTypes.func,
  cancelDone: PropTypes.bool
};

const mapStateToProps = store => ({
  coinsEnabled: store.p2p.coinsEnabled || [],
  orders: store.p2p.orders,
  loading: store.p2p.loading,
  cancelDone: store.p2p.cancelDone
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getMyOrders,
      getHistory,
      getFilter,
      clearCancel
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(inputStyle)(Offers));
