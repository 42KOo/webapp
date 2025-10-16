import React from 'react';
import { View, Text, Button } from 'react-native';

export default function LoginScreen({ navigation }: any) {
  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <Text>Kubiciranje - Login (placeholder)</Text>
      <Button title="Open Scanner" onPress={() => navigation.navigate('Scanner')} />
    </View>
  );
}
