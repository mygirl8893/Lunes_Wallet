import React from "react";
import i18n from "../../utils/i18n";
import PropTypes from "prop-types";

// REDUX
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {getCoinsEnabled, setPayment, getPaymentData} from "./redux/paymentAction";

// COMPONENTS
import Select from "../../components/select";
import Instructions from "../../components/instructions";
import colors from "../../components/bases/colors";
import Loading from "../../components/loading";

// MATERIAL
import { Grid, Input, InputAdornment } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

// STYLES
import style from "./style.css";

// UTILS
import { inputValidator } from "../../utils/inputValidator";

const customStyle = {
  inputRoot: {
    color: colors.messages.info,
    margin: "0.5rem 0",
    padding: '5px',
    width: 'calc(100% - 20px)',
    "&:hover:before": {
      borderBottomColor: colors.purple.dark,
    },
  },
  inputCss: {
    color: colors.messages.info,
    fontFamily: "Noto Sans, sans-serif",
    fontSize: "14px",
    letterSpacing: "0.5px",
    textAlign: 'left',
    paddingLeft: '10px',
  },
  inputCssCenter: {
    fontFamily: "Noto Sans, sans-serif",
    fontSize: "16px",
    letterSpacing: "0.5px",
    textAlign: 'center',
  },
  inputCssUnderline: {
    "&:before, &:after": {
      borderBottomColor: colors.purple.dark,
    },
    "&:hover:not($disabled):not($error):not($focused):before": {
      borderBottomColor: `${colors.purple.dark} !important`,
    },
  },
  inputCssUnderlineDisabled: {
    "&:before, &:after": {
      display: 'none',
    },
  },
  disabled: {},
  error: {},
  focused: {},
}


class BankSlip extends React.Component {
  constructor() {
    super();
    this.state = {
      errors: [],
      bankSlip: {
        number: '',
        assignor: '',
        name: '',
        description: '',
        dueDate: '',
        cpfCnpj: '',
        value: '',
      },
      coin: {
        name: undefined,
        value: undefined,
        img: undefined
      },
      coins: [ // sera alterado para pegar do redux
        {
          title: 'Lunes',
          value: 'lunes',
          img: '/images/icons/coins/lunes.png'
        },
        {
          title: 'Bitcoin',
          value: 'btc',
          img: '/images/icons/coins/btc.png'
        },
        {
          title: 'Litecoin',
          value: 'ltc',
          img: '/images/icons/coins/ltc.png'
        },
      ],
    }

    this.coinSelected = this.coinSelected.bind(this);
  }

  componentDidMount(){
    const {getCoinsEnabled} = this.props;
    getCoinsEnabled();
  }

  coinSelected = (value, title, img = undefined) => {
    this.setState({
      ...this.state,
      coin: {
        name: title,
        value,
        img
      },
      bankSlip: {
        ...this.state.bankSlip,
        coin: title
      }
    })
  }

  handleBankSlipNumberChange = event => {
    this.setState({
      ...this.state,
      bankSlip: {
        ...this.state.bankSlip,
        number: event.target.value.replace(/\D/, '')
      }
    });


    if (event.target.value.length === 48) {
      console.log('Chama a API');
      const data = getPaymentData(event.target.value);
      console.log('data', data);
    }
  }

  handleBankSlipDefaultChange = (name) => event => {
    this.setState({
      ...this.state,
      bankSlip: {
        ...this.state.bankSlip,
        [name]: event.target.value
      }
    });
  }

  openModal = () => {
    const {openModal} = this.props;
    openModal();
  }

  setPayment = () => {
    const {setPayment} = this.props;
    setPayment(this.state.bankSlip);
  }

  inputValidator = () => {
    const {bankSlip} = this.state;

    const bankSlipInputs = {};

    for (const key in bankSlip) {
      if (bankSlip.hasOwnProperty(key)) {
        bankSlipInputs[key] = {
          type: 'text',
          name: key,
          placeholder: key,
          value: bankSlip[key],
          required: true,
        };
      }

      if (key === 'number') {
        bankSlipInputs[key]["minLength"] = 48;
      }
    }

    const { errors } = inputValidator(bankSlipInputs);

    if (errors) {
      this.setState({
        ...this.state,
        errors
      });
      return;
    }

    this.openModal(); // abrind modal sem validacao para testar
    this.setPayment(); // setar os dados no redux, para teste sem validacao
    // tem que fazer a funcao pra pegar a quantidade de moedas necessarias para esta transacao e
    // liberar o botao apos o resultado
  }

  render() {
    const {classes, loading, /*coins*/} = this.props;
    const {coin, coins, bankSlip, errors} = this.state;

    const title = coin.name || 'Select a coin..';
    const img = coin.img || '';

    return (
      <Grid container direction="row" justify="center">
        <Grid item xs={12} className={style.box}>
          <div className={style.row}>
            <Input
              classes={{
                root: classes.inputRoot,
                underline: classes.inputCssUnderline,
                input: classes.inputCssCenter
              }}
              placeholder="237933802350009031431630033330944400000001000000"
              inputProps={{ maxLength: 48, required: true }}
              value={bankSlip.number}
              onChange={this.handleBankSlipNumberChange}
              error={errors.includes('number')}
            />
          </div>

          <Grid container>
            <Grid item xs={12} sm={6}>
              <Input
                classes={{
                  root: classes.inputRoot,
                  underline: classes.inputCssUnderline,
                  input: classes.inputCss
                }}
                placeholder={i18n.t("PAYMENT_ASSIGNOR")}
                value={bankSlip.assignor}
                onChange={this.handleBankSlipDefaultChange('assignor')}
                error={errors.includes('assignor')}
                error={errors.includes('assignor')}
              />
              <Input
                classes={{
                  root: classes.inputRoot,
                  underline: classes.inputCssUnderline,
                  input: classes.inputCss
                }}
                placeholder={i18n.t("PAYMENT_NAME")}
                value={bankSlip.name}
                onChange={this.handleBankSlipDefaultChange('name')}
                error={errors.includes('name')}
              />
              <Input
                classes={{
                  root: classes.inputRoot,
                  underline: classes.inputCssUnderline,
                  input: classes.inputCss
                }}
                placeholder={i18n.t("PAYMENT_SHORT_DESCRIPTION")}
                value={bankSlip.description}
                onChange={this.handleBankSlipDefaultChange('description')}
                error={errors.includes('description')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Input
                classes={{
                  root: classes.inputRoot,
                  underline: classes.inputCssUnderline,
                  input: classes.inputCss
                }}
                placeholder={i18n.t("PAYMENT_DUE_DATE")}
                value={bankSlip.dueDate}
                onChange={this.handleBankSlipDefaultChange('dueDate')}
                error={errors.includes('dueDate')}
              />
              <Input
                classes={{
                  root: classes.inputRoot,
                  underline: classes.inputCssUnderline,
                  input: classes.inputCss
                }}
                placeholder={i18n.t("PAYMENT_CPF_CNPJ")}
                value={bankSlip.cpfCnpj}
                onChange={this.handleBankSlipDefaultChange('cpfCnpj')}
                error={errors.includes('cpfCnpj')}
              />
              <Input
                classes={{
                  root: classes.inputRoot,
                  underline: classes.inputCssUnderline,
                  input: classes.inputCss
                }}
                placeholder={i18n.t("PAYMENT_VALUE")}
                startAdornment={
                  <InputAdornment position="start"
                    disableTypography
                    classes={{root: classes.inputCss}}
                  >
                    {i18n.t("PAYMENT_VALUE_SYMBOL")}
                  </InputAdornment>
                }
                value={bankSlip.value}
                onChange={this.handleBankSlipDefaultChange('value')}
                error={errors.includes('value')}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className={style.box} style={{marginTop: '10px'}}>
          <Grid container>
            <Grid item xs={12} sm={6}>
              <Select list={coins} title={title} titleImg={img} selectItem={this.coinSelected} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className={style.transparentBox} style={{marginTop: '10px'}}>
          <button
            className={style.buttonBorderGreen}
            onClick={this.inputValidator}
          >
            {loading ? <Loading /> : i18n.t("PAYMENT_PAY_NOW")}
          </button>
        </Grid>

        <Grid item xs={12} className={style.transparentBox} style={{marginTop: '10px'}}>
          <Instructions>
            {/* TODO: set the modal content */}
            <p>Conteúdo</p>
          </Instructions>
        </Grid>
      </Grid>
    );
  }
}

BankSlip.propTypes = {
  classes: PropTypes.object,
  openModal: PropTypes.func
}

const mapStateToProps = store => ({
  coinsRedux: store.payment.coins,
  loading: store.payment.loading
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getCoinsEnabled,
    getPaymentData,
    setPayment
  }, dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(customStyle)(BankSlip));
