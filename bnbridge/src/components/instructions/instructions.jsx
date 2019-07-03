import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid
} from '@material-ui/core';
import { colors } from '../../theme'

import {
  FEES_UPDATED
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const store = Store.store

const styles = theme => ({
  root: {
    width: '400px',
    marginBottom: '24px'
  },
  header: {
    fontSize: '2.4rem',
    color: colors.grey,
    marginBottom: '24px',
    fontWeight: 400,
    fontFamily: ['Source Sans Pro', 'sans-serif'].join(","),
  },
  action: {
    fontSize: '1rem',
    color: colors.lightBlack,
    display: 'inline-block',
    marginTop: "0.5rem"
  },
  actionRed: {
    fontSize: '1rem',
    color: colors.lightBlack,
    display: 'inline-block',
    marginTop: "0.5rem",
    fontWeight: 'bold'
  },
  price: {
    paddingRight: '60px',
    fontSize: '1rem',
    color: colors.lightBlack,
    display: 'inline-block',
    marginTop: "0.5rem"
  }
});

class Instructions extends Component {
  state = {
    fees: [],
    lit_erc20: "https://etherscan.io/address/0x763fa6806e1acf68130d2d0f0df754c93cc546b2",
    lit_bep2: "https://explorer.binance.org/asset/LIT-099"
  };

  componentWillMount() {
    emitter.on(FEES_UPDATED, this.feesUpdated);
  };

  componentWillUnmount() {
    emitter.removeListener(FEES_UPDATED, this.feesUpdated);
  };

  feesUpdated = () => {
    const fees = store.getStore('fees')

    let feesDisplay = fees.map((fee) => {
      let description = ""

      switch (fee.msg_type) {
        case 'submit_proposal':
          description = 'Submit Listing Proposal'
          break;
        case 'dexList':
          description = 'Listing On DEX'
          break;
        case 'issueMsg':
          description = 'Issue New Token'
          break;
        case 'send':
          description = 'Transfer Tokens'
          break;
        case 'list_proposal_deposit':
          description = 'Listing Proposal Deposit'
          break;
        default:
          break;
      }

      return {
        description: description,
        price: fee.fee/100000000
      }
    })

    this.setState({
      fees,
      feesDisplay: feesDisplay,
    })
  };

  render() {
    const {
      classes
    } = this.props;

    return (
      <Grid
        container
        justify="flex-start"
        alignItems="flex-end">
        <Grid item xs={12} align='left'>
          <div style={{"marginRight":"50px"}} className={ classes.root } >
            <Typography className={ classes.header }>LIT Token Bridge</Typography>
            <li><Typography className={ classes.action }> Swap <a href={this.state.lit_erc20} target="_blank">LIT ERC20</a> to <a href={this.state.lit_bep2} target="_blank">LIT BEP2</a> token</Typography></li>
          </div>
          <div className={ classes.root } >
            <Typography className={ classes.header }>Swap details:</Typography>
              <Grid item xs={12} align='left'>
                <li><Typography className={ classes.action }>Minimum swap amount: 100 LIT</Typography></li>
                <li><Typography className={ classes.action }>Swap fee: 5 LIT</Typography></li>
                {/* { this.renderFees() } */}
            </Grid>
          </div>
        </Grid>
      </Grid>
    )
  };

  renderFees = () => {
    const {
      classes
    } = this.props;

    if(!this.state.feesDisplay) {
      return null
    }

    return this.state.feesDisplay.map((fee) => {
      return (
        <React.Fragment key={fee.description}>
          <Grid item xs={6} align='left' className={ classes.action }>
            {fee.description}
          </Grid>
          <Grid item xs={6} align='right' className={ classes.price }>
            {fee.price} BNB
          </Grid>
        </React.Fragment>
      )
    })
  }
}

Instructions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Instructions);
