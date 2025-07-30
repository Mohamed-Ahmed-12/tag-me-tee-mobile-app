import React from 'react';
import { Text,  StyleSheet } from 'react-native';


export default AppText = ({ style, children, ...rest }) => {
  return (
    <Text style={[styles.defaultFont, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'EthnocentricBold',
  },
});

