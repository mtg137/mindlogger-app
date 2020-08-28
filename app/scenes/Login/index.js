import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  Content,
  Text,
  View,
  Icon,
  Footer,
  Right,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { SubmissionError } from 'redux-form';
import moment from 'moment';
import { fcmFcmTokenSelector } from '../../state/fcm/fcm.selectors';
import styles from './styles';
import { signInSuccessful } from '../../state/user/user.thunks';
import { signIn } from '../../services/network';
import LoginForm from './LoginForm';
import { skinSelector, mobileDataAllowedSelector } from '../../state/app/app.selectors';
import { toggleMobileDataAllowed } from '../../state/app/app.actions';

const defaultLogo = require('../../../img/CMI_white_logo.png');

class Login extends Component {
  constructor(props) {
    super(props);
    this.onClickTime = 0;

    // this.state({
    //   onClickTime: 0,
    // });
  }

  onRegister = () => {
    const currentTime = Date.now();

    if (currentTime - this.onClickTime > 350) {
      this.onClickTime = currentTime;
      Actions.sign_up();
    }
  }

  onChangeStudy = () => {
    const currentTime = Date.now();

    if (currentTime - this.onClickTime > 350) {
      this.onClickTime = currentTime;
      Actions.change_study();
    }
  }

  onForgotPassword = () => {
    const currentTime = Date.now();

    if (currentTime - this.onClickTime > 350) {
      this.onClickTime = currentTime;
      Actions.forgot_password();
    }
  }

  onAbout = () => {
    const currentTime = Date.now();

    if (currentTime - this.onClickTime > 350) {
      this.onClickTime = currentTime;
      Actions.about_app();
    }
  }

  onSubmit = async (body) => {
    const { signInSuccessful, fcmToken } = this.props;
    const timezone = this.getTimezone();

    return signIn({ ...body, deviceId: fcmToken, timezone })
      .then((response) => {
        if (typeof response.exception !== 'undefined') {
          throw response.exception;
        } else {
          signInSuccessful(response);
        }
      })
      .catch((e) => {
        if (typeof e.status !== 'undefined') {
          throw new SubmissionError({
            password: 'Login failed.',
          });
        } else {
          throw new SubmissionError({
            password: 'Login failed.',
          });
        }
      });
  }

  getTimezone = () => {
    return moment().utcOffset() / 60;
  }

  render() {
    const { skin, mobileDataAllowed, toggleMobileDataAllowed } = this.props;
    const title = skin.name;
    const logo = (typeof skin.logo !== 'undefined') ? { uri: skin.logo } : defaultLogo;
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <Content
          style={[styles.container, { backgroundColor: skin.colors.primary }]}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.header}>{title}</Text>
          <LoginForm
            onSubmit={this.onSubmit}
            primaryColor={skin.colors.primary}
            mobileDataAllowed={mobileDataAllowed}
            toggleMobileDataAllowed={toggleMobileDataAllowed}
          />
          <View style={styles.bottomRow}>
            <TouchableOpacity onPress={this.onRegister}>
              <Text style={styles.whiteText}>New User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotPassword} onPress={this.onForgotPassword}>
              <Text style={styles.whiteText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={this.onAbout}>
              <Text style={styles.whiteText}>{`What is ${title}?`}</Text>
            </TouchableOpacity>
          </View>
          <Image
            square
            style={styles.logo}
            source={logo}
          />
        </Content>
        <Footer style={styles.footer}>
          <Right>
            <TouchableOpacity onPress={this.onChangeStudy}>
              <Icon type="FontAwesome" name="database" style={styles.whiteIcon} />
            </TouchableOpacity>
          </Right>
        </Footer>
      </Container>
    );
  }
}

Login.propTypes = {
  signInSuccessful: PropTypes.func.isRequired,
  toggleMobileDataAllowed: PropTypes.func.isRequired,
  skin: PropTypes.object.isRequired,
  mobileDataAllowed: PropTypes.bool.isRequired,
  fcmToken: PropTypes.string,
};
Login.defaultProps = {
  fcmToken: null,
};
const mapStateToProps = state => ({
  skin: skinSelector(state),
  mobileDataAllowed: mobileDataAllowedSelector(state),
  fcmToken: fcmFcmTokenSelector(state),
});

const mapDispatchToProps = {
  signInSuccessful,
  toggleMobileDataAllowed,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
