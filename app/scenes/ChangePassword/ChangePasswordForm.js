import React from 'react';
import { ActivityIndicator } from 'react-native';
import { propTypes } from 'react-redux';
import { Button, Form, Text } from 'native-base';
import { reduxForm, Field } from 'redux-form';
import i18n from 'i18next';
import { FormInputItem } from '../../components/form/FormItem';
import styles from './styles';

const validate = ({ oldPassword, password }) => {
  const errors = {};

  if (password && (!oldPassword || oldPassword.length === 0)) {
    errors.oldPassword = i18n.t('additional:enter_old_password');
  }
  if (oldPassword && (!password || password.length === 0)) {
    errors.password = i18n.t('additional:enter_new_password');
  }

  return errors;
};

const UserForm = ({ handleSubmit, submitting, error, primaryColor }) => (
  <Form>
    <Field
      component={FormInputItem}
      placeholder={i18n.t('change_pass_form:cur_pass_placeholder')}
      name="oldPassword"
      style={styles.text}
      secureTextEntry
      autoComplete="off"
      autoCorrect={false}
      autoCapitalize="none"
    />
    <Field
      component={FormInputItem}
      placeholder={i18n.t('change_pass_form:new_pass_placeholder')}
      name="password"
      style={styles.text}
      secureTextEntry
      autoComplete="off"
      autoCorrect={false}
      autoCapitalize="none"
    />
    <Button
      warning
      style={{ marginTop: 40, backgroundColor: primaryColor }}
      block
      onPress={handleSubmit}
      disabled={submitting}
    >
      {submitting ? (
        <ActivityIndicator color={primaryColor} />
      ) : (
        <Text style={styles.buttonText}>{i18n.t('change_pass_form:update')}</Text>
      )}
    </Button>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </Form>
);

UserForm.propTypes = {
  ...propTypes,
};

const UserFormConnected = reduxForm({
  form: 'user-form',
  validate,
  enableReinitialize: true,
})(UserForm);

export default UserFormConnected;
